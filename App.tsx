
import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import SubjectPage from './pages/SubjectPage';
import SearchResults from './pages/SearchResults';
import NoteViewer from './pages/NoteViewer';
import ChatPage from './pages/ChatPage';
import SettingsPage from './pages/SettingsPage';
import BottomNav from './components/BottomNav';

const App: React.FC = () => {
  return (
    <Router>
      <div className="flex flex-col min-h-screen font-sans text-slate-800">
        <div className="hidden md:block">
           <Navbar />
        </div>
        
        {/* Mobile top bar for logo only if on specific pages, simplified */}
        <div className="md:hidden bg-white p-3 border-b border-gray-100 flex items-center justify-center sticky top-0 z-30">
           <span className="font-bold text-lg text-uganda-dark tracking-tight">Pearl Notes</span>
        </div>

        <main className="flex-grow pb-16 md:pb-0">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/subject/:id" element={<SubjectPage />} />
            <Route path="/search" element={<SearchResults />} />
            <Route path="/notes/:classLevel/:subject/:topic" element={<NoteViewer />} />
            <Route path="/chat" element={<ChatPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        <BottomNav />

        <div className="hidden md:block">
          <footer className="bg-white border-t border-gray-200 py-8 mt-auto">
            <div className="max-w-7xl mx-auto px-4 text-center">
              <p className="text-sm text-gray-500">
                &copy; {new Date().getFullYear()} Pearl Notes. Educational resources Search for Uganda.
              </p>
              <p className="text-xs text-gray-400 mt-2">
                Aligned with NCDC New Lower Secondary Curriculum.
              </p>
              <p className="text-xs text-gray-400 mt-2">
                Created by Benjamin Santiago.
              </p>
            </div>
          </footer>
        </div>
      </div>
    </Router>
  );
};

export default App;
