import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, ChevronRight } from 'lucide-react';
import { Topic } from '../types';

interface TopicListProps {
  topics: Topic[];
  subjectName: string;
  classNameStr: string;
}

const TopicList: React.FC<TopicListProps> = ({ topics, subjectName, classNameStr }) => {
  const navigate = useNavigate();

  const handleTopicClick = (topicName: string) => {
    // Navigate to the detailed notes view
    const url = `/notes/${encodeURIComponent(classNameStr)}/${encodeURIComponent(subjectName)}/${encodeURIComponent(topicName)}`;
    navigate(url);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-4 bg-uganda-green/5 border-b border-uganda-green/10 flex items-center justify-between">
        <h3 className="font-semibold text-uganda-dark">Syllabus Topics</h3>
        <span className="text-xs font-medium text-uganda-green bg-uganda-green/10 px-2 py-1 rounded-full">
          {topics.length} Topics
        </span>
      </div>
      <div className="divide-y divide-gray-100">
        {topics.map((topic) => (
          <button
            key={topic.id}
            onClick={() => handleTopicClick(topic.name)}
            className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors text-left group"
          >
            <span className="text-gray-700 group-hover:text-uganda-dark font-medium">
              {topic.name.replace(/\(S\d\)/, '')} 
            </span>
            <div className="flex items-center text-gray-400 group-hover:text-uganda-green">
              <span className="text-xs mr-2 opacity-0 group-hover:opacity-100 transition-opacity font-medium uppercase">Read Notes</span>
              <BookOpen className="h-4 w-4 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
              <ChevronRight className="h-4 w-4" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default TopicList;