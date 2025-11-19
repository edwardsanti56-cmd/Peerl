
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { generateSyllabusNotes } from '../services/geminiService';
import { NoteContent } from '../types';
import { ArrowLeft, BookOpen, Share2, Copy, ExternalLink, Loader2, ImageIcon } from 'lucide-react';

const NoteViewer: React.FC = () => {
  const { classLevel, subject, topic } = useParams<{ classLevel: string; subject: string; topic: string }>();
  const [data, setData] = useState<NoteContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchNotes = async () => {
      if (topic && subject && classLevel) {
        setLoading(true);
        const content = await generateSyllabusNotes(topic, subject, classLevel);
        setData(content);
        setLoading(false);
      }
    };
    fetchNotes();
  }, [classLevel, subject, topic]);

  const handleCopy = () => {
    if (data?.htmlContent) {
      // Create a temporary element to extract text from HTML
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = data.htmlContent;
      const text = tempDiv.textContent || tempDiv.innerText || "";
      
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-16 z-40 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link 
            to={`/subject/${subject?.toLowerCase()}`} 
            className="flex items-center text-gray-600 hover:text-uganda-dark transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-1" />
            <span className="font-medium hidden sm:inline">Back to Subject</span>
          </Link>
          
          <div className="flex items-center gap-2">
             <button 
                onClick={handleCopy}
                className="flex items-center px-3 py-1.5 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
             >
                <Copy className="h-4 w-4 mr-1.5" />
                {copied ? 'Copied!' : 'Copy Text'}
             </button>
             <button className="flex items-center px-3 py-1.5 text-sm font-medium text-white bg-uganda-green hover:bg-uganda-dark rounded-lg transition-colors shadow-sm">
                <Share2 className="h-4 w-4 mr-1.5" />
                Share
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
                 Our AI tutor is writing detailed notes and finding visuals for <span className="font-semibold text-uganda-green">{topic}</span>.
              </p>
              <div className="mt-6 flex gap-2">
                 <span className="w-2 h-2 bg-uganda-green rounded-full animate-bounce" style={{ animationDelay: '0ms'}}></span>
                 <span className="w-2 h-2 bg-uganda-green rounded-full animate-bounce" style={{ animationDelay: '150ms'}}></span>
                 <span className="w-2 h-2 bg-uganda-green rounded-full animate-bounce" style={{ animationDelay: '300ms'}}></span>
              </div>
           </div>
        ) : data ? (
          <div className="animate-in fade-in duration-500">
            {/* Title Section */}
            <div className="mb-8 border-b border-gray-200 pb-6">
               <div className="flex items-center gap-2 text-sm font-semibold text-uganda-green uppercase tracking-wide mb-2">
                  <span className="bg-green-100 px-2 py-0.5 rounded">{classLevel}</span>
                  <span>•</span>
                  <span>{subject}</span>
               </div>
               <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight">
                  {topic}
               </h1>
            </div>

            {/* AI Generated Content - Image is now embedded inside htmlContent */}
            <article className="prose prose-lg prose-green max-w-none bg-white p-6 md:p-10 rounded-2xl shadow-sm border border-gray-100">
               <div dangerouslySetInnerHTML={{ __html: data.htmlContent }} />
            </article>

            {/* Sources / References */}
            <div className="mt-10">
               <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <BookOpen className="h-5 w-5 mr-2 text-uganda-dark" />
                  External Resources & References
               </h3>
               <div className="grid gap-3 sm:grid-cols-2">
                  {data.sources.length > 0 ? (
                     data.sources.map((source, idx) => (
                        <a 
                           key={idx}
                           href={source.url}
                           target="_blank"
                           rel="noopener noreferrer"
                           className="flex items-start p-3 rounded-lg border border-gray-200 hover:border-uganda-green hover:bg-green-50 transition-all group"
                        >
                           <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate group-hover:text-uganda-dark">
                                 {source.title}
                              </p>
                              <p className="text-xs text-gray-500 mt-0.5 truncate">
                                 {source.source}
                              </p>
                           </div>
                           <ExternalLink className="h-4 w-4 text-gray-400 group-hover:text-uganda-green ml-2" />
                        </a>
                     ))
                  ) : (
                     <p className="text-gray-500 text-sm col-span-2">
                        No specific external links were found, but the notes above are based on general NCDC curriculum standards.
                     </p>
                  )}
               </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-red-600 font-medium">Failed to load content.</p>
            <Link to="/" className="text-uganda-green hover:underline mt-4 inline-block">Return Home</Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default NoteViewer;
