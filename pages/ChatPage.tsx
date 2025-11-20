
import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, Sparkles, RefreshCw } from 'lucide-react';
import { createChatSession } from '../services/geminiService';
import { GenerateContentResponse } from '@google/genai';

interface Message {
  role: 'user' | 'model';
  text: string;
}

const ChatPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: "Hello! I'm your AI study companion. Ask me anything about your subjects, topics, or revision." }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const chatSessionRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    initializeChat();
  }, []);

  const initializeChat = () => {
    try {
      chatSessionRef.current = createChatSession();
      setError(null);
    } catch (e) {
      console.error("Failed to init chat", e);
      setError("Failed to connect to AI service.");
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Simple Markdown Formatter to convert basic MD to HTML
  const formatMessage = (text: string) => {
    if (!text) return '';
    
    const lines = text.split('\n');
    let html = '';
    let inList = false;

    lines.forEach((line) => {
      const trimLine = line.trim();
      
      // Headers
      if (line.startsWith('### ')) {
        if (inList) { html += '</ul>'; inList = false; }
        html += `<h3 class="text-sm font-bold text-gray-900 mt-3 mb-2 block">${line.replace('### ', '')}</h3>`;
      } else if (line.startsWith('## ')) {
        if (inList) { html += '</ul>'; inList = false; }
        html += `<h2 class="text-base font-bold text-gray-900 mt-4 mb-2 block">${line.replace('## ', '')}</h2>`;
      } 
      // Bold lines (often used as headers in simple markdown)
      else if (line.startsWith('**') && line.endsWith('**') && line.length < 60) {
         if (inList) { html += '</ul>'; inList = false; }
         html += `<p class="font-bold text-gray-900 mt-3 mb-1">${line.replace(/\*\*/g, '')}</p>`;
      }
      // Lists
      else if (trimLine.startsWith('* ') || trimLine.startsWith('- ')) {
        if (!inList) { html += '<ul class="list-disc pl-5 space-y-1 mb-3 text-gray-700">'; inList = true; }
        let content = trimLine.substring(2);
        content = content.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-gray-900">$1</strong>');
        content = content.replace(/\*(.*?)\*/g, '<em class="italic">$1</em>');
        html += `<li>${content}</li>`;
      } 
      // Paragraphs
      else {
        if (inList) { html += '</ul>'; inList = false; }
        if (trimLine) {
          let content = line;
          content = content.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-gray-900">$1</strong>');
          content = content.replace(/\*(.*?)\*/g, '<em class="italic">$1</em>');
          content = content.replace(/`([^`]+)`/g, '<code class="bg-gray-100 px-1 rounded text-sm font-mono text-red-500">$1</code>');
          html += `<p class="mb-2 text-gray-800 leading-relaxed">${content}</p>`;
        }
      }
    });

    if (inList) { html += '</ul>'; }
    return html;
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);
    setError(null);

    try {
      // Ensure session exists
      if (!chatSessionRef.current) initializeChat();

      const result = await chatSessionRef.current.sendMessageStream({ message: userMessage });
      
      let fullResponse = "";
      setMessages(prev => [...prev, { role: 'model', text: "" }]); // Placeholder for stream

      for await (const chunk of result) {
        const c = chunk as GenerateContentResponse;
        const text = c.text || "";
        fullResponse += text;
        
        setMessages(prev => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1].text = fullResponse;
          return newMessages;
        });
      }
    } catch (error: any) {
      console.error("Chat error", error);
      let errorMessage = "Sorry, I encountered an error.";
      
      if (error.status === 0 || error.toString().includes("status code: 0")) {
         errorMessage = "Connection failed. Please check your internet or refresh the page.";
         // Force re-init on next try
         chatSessionRef.current = null; 
      }

      setMessages(prev => {
         // Remove the empty placeholder if we haven't received any text yet
         const last = prev[prev.length - 1];
         if (last.role === 'model' && !last.text) {
             return [...prev.slice(0, -1), { role: 'model', text: errorMessage }];
         }
         return [...prev, { role: 'model', text: errorMessage }];
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)] md:h-[calc(100vh-4rem)] bg-gray-50">
      {/* Header for Chat */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-center sticky top-0 z-30 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="bg-uganda-green/10 p-1.5 rounded-full">
            <Sparkles className="h-5 w-5 text-uganda-green" />
          </div>
          <span className="font-bold text-gray-900">AI Tutor</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 pb-32 space-y-6">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex max-w-[90%] md:max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'} items-start gap-3`}>
              
              {/* Avatar */}
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1 shadow-sm ${
                msg.role === 'user' 
                  ? 'bg-uganda-dark text-white hidden' 
                  : 'bg-white border border-gray-200 text-uganda-green'
              }`}>
                {msg.role === 'user' ? <User className="h-5 w-5" /> : <Bot className="h-5 w-5" />}
              </div>

              {/* Message Bubble */}
              <div className={`px-5 py-3.5 rounded-2xl text-[15px] shadow-sm ${
                msg.role === 'user' 
                  ? 'bg-uganda-dark text-white rounded-tr-none' 
                  : 'bg-white border border-gray-100 text-gray-800 rounded-tl-none'
              }`}>
                {msg.role === 'user' ? (
                  <p>{msg.text}</p>
                ) : (
                  <div 
                    className="prose prose-sm max-w-none prose-p:my-1 prose-headings:my-2"
                    dangerouslySetInnerHTML={{ __html: formatMessage(msg.text) }} 
                  />
                )}
              </div>
            </div>
          </div>
        ))}
        
        {isLoading && (
           <div className="flex justify-start pl-11">
             <div className="flex items-center gap-2 bg-white border border-gray-100 px-4 py-3 rounded-2xl rounded-tl-none shadow-sm">
               <Loader2 className="h-4 w-4 animate-spin text-uganda-green" />
               <span className="text-xs text-gray-500 font-medium">Thinking...</span>
             </div>
           </div>
        )}
        
        {error && (
           <div className="flex justify-center">
              <button onClick={() => window.location.reload()} className="flex items-center gap-2 text-xs text-red-500 bg-red-50 px-3 py-1 rounded-full">
                 <RefreshCw className="h-3 w-3" /> Connection Error. Tap to Refresh.
              </button>
           </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-white border-t border-gray-200 fixed bottom-16 md:bottom-0 left-0 right-0 w-full z-20 px-4 py-3 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <form onSubmit={handleSend} className="flex gap-2 max-w-4xl mx-auto items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question about your studies..."
            className="flex-1 bg-gray-100 text-gray-900 rounded-full px-5 py-3 focus:outline-none focus:ring-2 focus:ring-uganda-green/50 border-transparent transition-all placeholder:text-gray-400 text-base"
          />
          <button 
            type="submit" 
            disabled={isLoading || !input.trim()}
            className="bg-uganda-green text-white p-3 rounded-full hover:bg-uganda-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm flex-shrink-0"
          >
            <Send className="h-5 w-5" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatPage;
