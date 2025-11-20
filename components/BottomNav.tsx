
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BookOpen, MessageCircle, Settings } from 'lucide-react';

const BottomNav: React.FC = () => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 md:hidden shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
      <div className="flex justify-around items-center h-16 pb-1">
        <Link 
          to="/" 
          className={`flex flex-col items-center justify-center w-full h-full transition-colors ${isActive('/') ? 'text-uganda-green' : 'text-gray-400 hover:text-gray-600'}`}
        >
          <BookOpen className={`h-6 w-6 ${isActive('/') ? 'fill-current' : ''}`} strokeWidth={isActive('/') ? 2.5 : 2} />
          <span className="text-[10px] font-semibold mt-1">Subjects</span>
        </Link>
        
        <Link 
          to="/chat" 
          className={`flex flex-col items-center justify-center w-full h-full transition-colors ${isActive('/chat') ? 'text-uganda-green' : 'text-gray-400 hover:text-gray-600'}`}
        >
          <MessageCircle className={`h-6 w-6 ${isActive('/chat') ? 'fill-current' : ''}`} strokeWidth={isActive('/chat') ? 2.5 : 2} />
          <span className="text-[10px] font-semibold mt-1">AI Chat</span>
        </Link>
        
        <Link 
          to="/settings" 
          className={`flex flex-col items-center justify-center w-full h-full transition-colors ${isActive('/settings') ? 'text-uganda-green' : 'text-gray-400 hover:text-gray-600'}`}
        >
          <Settings className={`h-6 w-6 ${isActive('/settings') ? 'fill-current' : ''}`} strokeWidth={isActive('/settings') ? 2.5 : 2} />
          <span className="text-[10px] font-semibold mt-1">Settings</span>
        </Link>
      </div>
    </div>
  );
};

export default BottomNav;
