import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { SUBJECTS, APP_NAME } from '../constants';
import SubjectCard from '../components/SubjectCard';

const Home: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery + ' notes uganda ncdc')}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Hero Search Section */}
      <div className="bg-uganda-dark relative overflow-hidden">
         <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
         <div className="max-w-4xl mx-auto px-4 py-20 sm:py-28 relative z-10 text-center">
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6 tracking-tight">
              Find {APP_NAME}
            </h1>
            <p className="text-green-100 text-lg mb-8 max-w-2xl mx-auto">
              Instant access to NCDC aligned notes, revision materials, and past papers for S1 to S4. No login required.
            </p>
            
            <form onSubmit={handleSearch} className="relative max-w-xl mx-auto">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for a topic (e.g. 'Photosynthesis')"
                  className="w-full pl-12 pr-4 py-4 rounded-full shadow-lg border-0 focus:ring-4 focus:ring-uganda-green/30 text-lg placeholder:text-gray-400 text-gray-900"
                />
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-6 w-6" />
              </div>
              <button 
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-uganda-green hover:bg-green-700 text-white px-6 py-2 rounded-full font-medium transition-colors"
              >
                Search
              </button>
            </form>
         </div>
      </div>

      {/* Subjects Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20">
        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 border-l-4 border-uganda-green pl-4">
            Browse by Subject
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {SUBJECTS.map((subject) => (
              <SubjectCard key={subject.id} subject={subject} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;