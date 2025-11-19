import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Search } from 'lucide-react';
import { APP_NAME } from '../constants';

const Navbar: React.FC = () => {
  return (
    <nav className="bg-white border-b border-uganda-green/10 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center gap-2">
              <div className="bg-uganda-green p-2 rounded-lg">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <span className="font-bold text-xl text-uganda-dark tracking-tight hidden sm:block">
                {APP_NAME}
              </span>
            </Link>
          </div>
          <div className="flex items-center">
             <Link 
               to="/" 
               className="p-2 text-gray-500 hover:text-uganda-green transition-colors"
               aria-label="Search"
             >
               <Search className="h-6 w-6" />
             </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;