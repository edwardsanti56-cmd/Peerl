import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import SubjectPage from './pages/SubjectPage';
import SearchResults from './pages/SearchResults';
import NoteViewer from './pages/NoteViewer';

const App: React.FC = () => {
  return (
    <Router>
      <div className="flex flex-col min-h-screen font-sans text-slate-800">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/subject/:id" element={<SubjectPage />} />
            <Route path="/search" element={<SearchResults />} />
            <Route path="/notes/:classLevel/:subject/:topic" element={<NoteViewer />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <footer className="bg-white border-t border-gray-200 py-8 mt-auto">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <p className="text-sm text-gray-500">
              &copy; {new Date().getFullYear()} Pearl Notes. Educational resources Search for Uganda.
            </p>
            <p className="text-xs text-gray-400 mt-2">
              Aligned with NCDC New Lower Secondary Curriculum.
            </p>
          </div>
        </footer>
      </div>
    </Router>
  );
};

export default App;