
import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import { generateSyllabusNotes, generateQuiz, generateSpeech } from '../services/geminiService';
import { NoteContent, QuizQuestion } from '../types';
import { ArrowLeft, Copy, Loader2, Volume2, StopCircle, BrainCircuit } from 'lucide-react';

// Audio Decode Helpers
function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number = 24000,
  numChannels: number = 1,
): Promise<AudioBuffer> {
  // Create a copy of the buffer to ensure byte alignment for Int16Array
  // data.slice() returns a new Uint8Array with a fresh, aligned ArrayBuffer
  const alignedData = data.slice();
  const dataInt16 = new Int16Array(alignedData.buffer);
  
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

const NoteViewer: React.FC = () => {
  const { classLevel, subject, topic } = useParams<{ classLevel: string; subject: string; topic: string }>();
  const [searchParams] = useSearchParams();
  const typeParam = searchParams.get('type') as 'concise' | 'detailed' | null;
  
  // Content State
  const [data, setData] = useState<NoteContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [detailLevel, setDetailLevel] = useState<'concise' | 'detailed'>(typeParam || 'detailed');

  // Quiz State
  const [quiz, setQuiz] = useState<QuizQuestion[]>([]);
  const [quizLoading, setQuizLoading] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  
  // Audio State
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioLoading, setAudioLoading] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceNodeRef = useRef<AudioBufferSourceNode | null>(null);

  useEffect(() => {
    if (typeParam && typeParam !== detailLevel) {
        setDetailLevel(typeParam);
    }
  }, [typeParam]);

  useEffect(() => {
    fetchNotes();
    // Reset states when topic changes
    setQuiz([]);
    setQuizStarted(false);
    setUserAnswers({});
    stopAudio();
  }, [classLevel, subject, topic, detailLevel]);

  useEffect(() => {
    return () => stopAudio(); // Cleanup audio on unmount
  }, []);

  const fetchNotes = async () => {
    if (topic && subject && classLevel) {
      setLoading(true);
      const content = await generateSyllabusNotes(topic, subject, classLevel, detailLevel);
      setData(content);
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (data?.htmlContent) {
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = data.htmlContent;
      const text = tempDiv.textContent || tempDiv.innerText || "";
      
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // --- Audio Logic ---
  const playAudio = async () => {
    if (isPlaying) {
      stopAudio();
      return;
    }
    
    if (!data?.htmlContent) return;

    setAudioLoading(true);
    try {
      // Extract clean text
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = data.htmlContent;
      const textToSpeak = `Here are your notes on ${topic}. ` + (tempDiv.textContent || "");

      const base64Audio = await generateSpeech(textToSpeak);
      
      if (!base64Audio) throw new Error("No audio generated");

      // Init Context
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      }
      const ctx = audioContextRef.current;

      // Decode
      const bytes = decode(base64Audio);
      const audioBuffer = await decodeAudioData(bytes, ctx, 24000, 1);

      // Play
      const source = ctx.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(ctx.destination);
      source.onended = () => setIsPlaying(false);
      source.start();
      
      sourceNodeRef.current = source;
      setIsPlaying(true);

    } catch (e) {
      console.error("Audio playback failed", e);
      alert("Could not play audio. Please try again.");
    } finally {
      setAudioLoading(false);
    }
  };

  const stopAudio = () => {
    if (sourceNodeRef.current) {
      sourceNodeRef.current.stop();
      sourceNodeRef.current = null;
    }
    setIsPlaying(false);
  };

  // --- Quiz Logic ---
  const loadQuiz = async () => {
    if (!topic || !subject || !classLevel) return;
    setQuizLoading(true);
    const questions = await generateQuiz(topic, subject, classLevel);
    setQuiz(questions);
    setQuizLoading(false);
    setQuizStarted(true);
  };

  const handleAnswer = (questionIdx: number, optionIdx: number) => {
    if (userAnswers[questionIdx] !== undefined) return; // Prevent changing answer
    setUserAnswers(prev => ({ ...prev, [questionIdx]: optionIdx }));
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 md:top-16 z-40 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link 
            to={`/subject/${subject?.toLowerCase()}`} 
            className="flex items-center text-gray-600 hover:text-uganda-dark transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-1" />
            <span className="font-medium hidden sm:inline">Back</span>
          </Link>
          
          <div className="flex items-center gap-2">
             {/* Audio Toggle */}
             <button 
               onClick={playAudio}
               disabled={loading || audioLoading}
               className={`flex items-center px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                 isPlaying 
                   ? 'bg-red-100 text-red-700 border border-red-200' 
                   : 'bg-indigo-50 text-indigo-700 border border-indigo-100 hover:bg-indigo-100'
               }`}
             >
               {audioLoading ? (
                 <Loader2 className="h-4 w-4 animate-spin mr-1.5" />
               ) : isPlaying ? (
                 <StopCircle className="h-4 w-4 mr-1.5" />
               ) : (
                 <Volume2 className="h-4 w-4 mr-1.5" />
               )}
               <span className="hidden sm:inline">{isPlaying ? 'Stop Listening' : 'Listen'}</span>
             </button>

             <button 
                onClick={handleCopy}
                className="flex items-center px-3 py-1.5 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
             >
                <Copy className="h-4 w-4 mr-1.5" />
                <span className="hidden sm:inline">{copied ? 'Copied!' : 'Copy'}</span>
             </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6">
        {loading ? (
           <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="relative">
                 <div className="absolute inset-0 bg-uganda-green/20 rounded-full blur-xl animate-pulse"></div>
                 <Loader2 className="h-16 w-16 text-uganda-green animate-spin relative z-10" />
              </div>
              <h2 className="mt-8 text-xl font-bold text-gray-800">Generating Notes...</h2>
              <p className="text-gray-500 mt-2 max-w-md">
                 Our AI tutor is writing {detailLevel} notes and finding visuals for <span className="font-semibold text-uganda-green">{topic}</span>.
              </p>
           </div>
        ) : data ? (
          <div className="animate-in fade-in duration-500">
            {/* Title & Controls */}
            <div className="mb-8 border-b border-gray-200 pb-6">
               <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                  <div className="flex items-center gap-2 text-sm font-semibold text-uganda-green uppercase tracking-wide">
                     <span className="bg-green-100 px-2 py-0.5 rounded">{classLevel}</span>
                     <span>•</span>
                     <span>{subject}</span>
                  </div>
                  
                  {/* Length Toggle */}
                  <div className="flex bg-gray-100 rounded-lg p-1">
                    <button 
                      onClick={() => setDetailLevel('concise')}
                      className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${detailLevel === 'concise' ? 'bg-white shadow text-uganda-dark' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                      Concise
                    </button>
                    <button 
                      onClick={() => setDetailLevel('detailed')}
                      className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${detailLevel === 'detailed' ? 'bg-white shadow text-uganda-dark' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                      Detailed
                    </button>
                  </div>
               </div>
               <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight">
                  {topic}
               </h1>
            </div>

            {/* AI Generated Content */}
            <article className="prose prose-lg prose-green max-w-none bg-white p-6 md:p-10 rounded-2xl shadow-sm border border-gray-100">
               <div dangerouslySetInnerHTML={{ __html: data.htmlContent }} />
            </article>

            {/* Interactive Quiz Section */}
            <div className="mt-12 bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
               <div className="bg-gradient-to-r from-uganda-dark to-uganda-green p-6 text-white">
                  <div className="flex items-center gap-3">
                     <BrainCircuit className="h-8 w-8 opacity-90" />
                     <div>
                        <h3 className="text-xl font-bold">Knowledge Check</h3>
                        <p className="text-green-100 text-sm">Test your understanding of this topic.</p>
                     </div>
                  </div>
               </div>
               
               <div className="p-6 md:p-8">
                  {!quizStarted ? (
                     <div className="text-center py-8">
                        <p className="text-gray-600 mb-6 max-w-lg mx-auto">
                           Ready to test yourself? Click below to generate 5 multiple-choice questions based on these notes.
                        </p>
                        <button 
                           onClick={loadQuiz}
                           disabled={quizLoading}
                           className="inline-flex items-center bg-uganda-green hover:bg-uganda-dark text-white px-8 py-3 rounded-full font-semibold transition-colors disabled:opacity-50"
                        >
                           {quizLoading ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : null}
                           {quizLoading ? 'Generating Quiz...' : 'Start Quiz'}
                        </button>
                     </div>
                  ) : (
                     <div className="space-y-8">
                        {quiz.length === 0 && <p className="text-center text-red-500">Failed to load quiz. Please try again.</p>}
                        {quiz.map((q, idx) => {
                           const answered = userAnswers[idx] !== undefined;
                           const isCorrect = userAnswers[idx] === q.correctAnswerIndex;
                           
                           return (
                              <div key={idx} className="border-b border-gray-100 pb-8 last:border-0">
                                 <p className="font-semibold text-lg text-gray-900 mb-4">
                                    <span className="text-gray-400 mr-2">{idx + 1}.</span>
                                    {q.question}
                                 </p>
                                 <div className="space-y-3">
                                    {q.options.map((opt, optIdx) => {
                                       let btnClass = "w-full text-left px-4 py-3 rounded-lg border transition-all ";
                                       if (answered) {
                                          if (optIdx === q.correctAnswerIndex) btnClass += "bg-green-100 border-green-300 text-green-800";
                                          else if (optIdx === userAnswers[idx]) btnClass += "bg-red-50 border-red-200 text-red-700";
                                          else btnClass += "bg-gray-50 border-gray-100 text-gray-400";
                                       } else {
                                          btnClass += "bg-white border-gray-200 hover:border-uganda-green hover:bg-green-50 text-gray-700";
                                       }

                                       return (
                                          <button 
                                             key={optIdx}
                                             onClick={() => handleAnswer(idx, optIdx)}
                                             disabled={answered}
                                             className={btnClass}
                                          >
                                             {opt}
                                          </button>
                                       );
                                    })}
                                 </div>
                                 {answered && (
                                    <div className={`mt-4 p-4 rounded-lg ${isCorrect ? 'bg-green-50 text-green-800' : 'bg-gray-100 text-gray-700'}`}>
                                       <p className="font-medium text-sm flex items-center gap-2">
                                          {isCorrect ? <span className="text-green-600 font-bold">Correct!</span> : <span className="text-red-500 font-bold">Incorrect.</span>}
                                          {q.explanation}
                                       </p>
                                    </div>
                                 )}
                              </div>
                           );
                        })}
                        
                        {Object.keys(userAnswers).length === quiz.length && (
                           <div className="text-center pt-4">
                              <button 
                                 onClick={() => {
                                    setQuizStarted(false);
                                    setUserAnswers({});
                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                 }}
                                 className="text-uganda-green font-medium hover:underline"
                              >
                                 Reset Quiz
                              </button>
                           </div>
                        )}
                     </div>
                  )}
               </div>
            </div>
          </div>
        ) : (
           <div className="text-center py-20">
              <p className="text-red-500">Failed to load content.</p>
           </div>
        )}
      </div>
    </div>
  );
};

export default NoteViewer;
