import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { SUBJECTS, getTopicsForSubject, CLASSES } from '../constants';
import { ClassLevel } from '../types';
import Hero from '../components/Hero';
import TopicList from '../components/TopicList';
import { Filter, BookOpen } from 'lucide-react';

const SubjectPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [selectedClass, setSelectedClass] = useState<ClassLevel>(ClassLevel.S1);

  const subject = SUBJECTS.find((s) => s.id === id);

  const topics = useMemo(() => {
    if (!subject) return [];
    return getTopicsForSubject(subject.id, selectedClass);
  }, [subject, selectedClass]);

  if (!subject) {
    return (
      <div className="min-h-screen flex items-center justify-center flex-col bg-gray-50">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Subject Not Found</h2>
        <p className="text-gray-500 mb-6">The subject you are looking for does not exist.</p>
        <button 
          onClick={() => navigate('/')} 
          className="px-6 py-2 bg-uganda-green text-white rounded-full hover:bg-uganda-dark transition-colors"
        >
          Go Home
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Hero 
        title={subject.name} 
        subtitle={`NCDC Syllabus Notes for ${selectedClass}`}
        imageSeed={`${subject.imageSeed}-${selectedClass}`} 
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Sidebar / Filter */}
          <div className="w-full lg:w-1/4">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24 border border-gray-100">
              <div className="flex items-center mb-6 text-uganda-dark pb-4 border-b border-gray-100">
                <Filter className="h-5 w-5 mr-2" />
                <h3 className="font-bold text-lg">Select Class</h3>
              </div>
              <div className="space-y-2">
                {CLASSES.map((cls) => (
                  <button
                    key={cls}
                    onClick={() => setSelectedClass(cls)}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 flex items-center justify-between group ${
                      selectedClass === cls 
                        ? 'bg-uganda-green text-white shadow-md ring-2 ring-uganda-green ring-offset-2' 
                        : 'bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-uganda-dark'
                    }`}
                  >
                    <span className="font-medium">{cls}</span>
                    {selectedClass === cls ? (
                       <BookOpen className="h-4 w-4" />
                    ) : (
                       <span className="w-2 h-2 rounded-full bg-gray-300 group-hover:bg-uganda-green/50"></span>
                    )}
                  </button>
                ))}
              </div>
              
              <div className="mt-8 bg-yellow-50 p-4 rounded-lg border border-yellow-100">
                <p className="text-xs text-yellow-800 leading-relaxed">
                  <span className="font-bold">Note:</span> Topics listed are based on the standard NCDC New Lower Secondary Curriculum.
                </p>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="w-full lg:w-3/4">
             <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                   {selectedClass} <span className="text-gray-400">/</span> {subject.name}
                </h2>
                <p className="text-gray-500 mt-2">
                   Select a topic below to generate detailed study notes.
                </p>
             </div>
             
             <TopicList 
                topics={topics} 
                subjectName={subject.name} 
                classNameStr={selectedClass} 
             />
          </div>

        </div>
      </div>
    </div>
  );
};

export default SubjectPage;