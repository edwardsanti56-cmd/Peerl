import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Subject } from '../types';

interface SubjectCardProps {
  subject: Subject;
}

const SubjectCard: React.FC<SubjectCardProps> = ({ subject }) => {
  return (
    <Link 
      to={`/subject/${subject.id}`}
      className="group relative flex flex-col bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 transform hover:-translate-y-1"
    >
      <div className="h-32 overflow-hidden relative">
         <img 
            src={`https://picsum.photos/seed/${subject.imageSeed}/600/400`}
            alt={subject.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
         />
         <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-80"></div>
         <div className="absolute bottom-2 left-3 text-white font-semibold">
            {subject.name}
         </div>
      </div>
      
      <div className="p-4 flex-1 flex flex-col justify-between">
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
          {subject.description}
        </p>
        <div className="flex items-center text-uganda-green font-medium text-sm group-hover:text-uganda-dark">
          Browse Topics <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
        </div>
      </div>
    </Link>
  );
};

export default SubjectCard;