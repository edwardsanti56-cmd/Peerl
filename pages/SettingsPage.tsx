
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { User, Info, Shield, Bell, Download, FileText, Trash2, ChevronRight, AlertCircle } from 'lucide-react';
import { getSavedNotes, deleteSavedNote } from '../services/geminiService';
import { SavedNoteSummary } from '../types';

const SettingsPage: React.FC = () => {
  const [savedNotes, setSavedNotes] = useState<SavedNoteSummary[]>([]);

  useEffect(() => {
    loadSavedNotes();
  }, []);

  const loadSavedNotes = () => {
    setSavedNotes(getSavedNotes());
  };

  const handleDelete = (e: React.MouseEvent, key: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this note?")) {
      deleteSavedNote(key);
      loadSavedNotes();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24 pt-8 px-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Settings</h1>
      
      {/* Offline Library Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6">
        <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex items-center gap-3">
          <div className="bg-blue-50 p-2 rounded-full">
             <Download className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Offline Library</h3>
            <p className="text-xs text-gray-500">Notes you've viewed are saved here automatically.</p>
          </div>
        </div>
        
        <div className="divide-y divide-gray-100">
          {savedNotes.length > 0 ? (
            savedNotes.map((note) => (
              <Link 
                key={note.key}
                to={`/notes/${encodeURIComponent(note.classLevel)}/${encodeURIComponent(note.subject)}/${encodeURIComponent(note.topic)}?type=${note.noteType}`}
                className="block p-4 hover:bg-gray-50 transition-colors group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="flex-shrink-0 bg-gray-100 p-2 rounded-lg text-gray-500 group-hover:text-uganda-green group-hover:bg-green-50 transition-colors">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-gray-900 truncate pr-2">{note.topic}</p>
                      <p className="text-xs text-gray-500 flex items-center gap-2">
                        <span>{note.subject}</span>
                        <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                        <span>{note.classLevel}</span>
                        <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                        <span className="uppercase text-[10px] border border-gray-200 px-1 rounded">{note.noteType || 'Detailed'}</span>
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                     <span className="text-xs text-gray-400 whitespace-nowrap hidden sm:block">
                        {new Date(note.timestamp).toLocaleDateString()}
                     </span>
                     <button 
                        onClick={(e) => handleDelete(e, note.key)}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                        title="Delete Note"
                     >
                        <Trash2 className="h-4 w-4" />
                     </button>
                     <ChevronRight className="h-4 w-4 text-gray-300 group-hover:text-uganda-green" />
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="p-8 text-center text-gray-500">
              <Download className="h-8 w-8 mx-auto mb-3 text-gray-300" />
              <p className="text-sm">No saved notes yet.</p>
              <p className="text-xs text-gray-400 mt-1">Browse topics to save them automatically.</p>
            </div>
          )}
        </div>
      </div>

      {/* About Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6">
        <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex items-center gap-3">
          <div className="bg-uganda-light p-2 rounded-full">
             <Info className="h-5 w-5 text-uganda-green" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">About Pearl Notes</h3>
            <p className="text-xs text-gray-500">Version 1.1.0 (Offline Enabled)</p>
          </div>
        </div>
        <div className="p-6">
          <p className="text-gray-600 text-sm leading-relaxed mb-6">
            Pearl Notes is an educational tool designed specifically for Uganda's New Lower Secondary Curriculum (NCDC). We help students access syllabus-aligned notes, revision materials, and AI assistance instantly.
          </p>
          
          <div className="pt-6 border-t border-gray-100">
             <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Credits & Development</h4>
             <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                <div className="bg-white shadow-sm h-12 w-12 rounded-full flex items-center justify-center border border-gray-100">
                   <User className="h-6 w-6 text-gray-500" />
                </div>
                <div>
                   <p className="text-base font-bold text-gray-900">Benjamin Santiago</p>
                   <p className="text-sm text-uganda-green font-medium">Creator & Lead Developer</p>
                </div>
             </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="divide-y divide-gray-100">
          <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors text-left">
             <div className="flex items-center gap-3">
                <div className="bg-blue-50 p-2 rounded-lg text-blue-600">
                   <Shield className="h-5 w-5" />
                </div>
                <span className="font-medium text-gray-700">Privacy Policy</span>
             </div>
          </button>
           <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors text-left">
             <div className="flex items-center gap-3">
                <div className="bg-purple-50 p-2 rounded-lg text-purple-600">
                   <Bell className="h-5 w-5" />
                </div>
                <span className="font-medium text-gray-700">Notifications</span>
             </div>
          </button>
        </div>
      </div>
      
      <div className="mt-8 text-center">
        <p className="text-xs text-gray-400">
          Made with ❤️ for Ugandan Students
        </p>
      </div>
    </div>
  );
};

export default SettingsPage;
