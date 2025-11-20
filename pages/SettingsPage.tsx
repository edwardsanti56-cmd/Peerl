
import React from 'react';
import { User, Info, Shield, Bell } from 'lucide-react';

const SettingsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 pb-24 pt-8 px-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Settings</h1>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6">
        <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex items-center gap-3">
          <div className="bg-uganda-light p-2 rounded-full">
             <Info className="h-5 w-5 text-uganda-green" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">About Pearl Notes</h3>
            <p className="text-xs text-gray-500">Version 1.0.0</p>
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
