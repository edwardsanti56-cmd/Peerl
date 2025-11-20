import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { searchNCDCResources } from '../services/geminiService';
import { SearchResult } from '../types';
import { ExternalLink, Loader2, AlertCircle, ArrowLeft, Search } from 'lucide-react';

const SearchResults: React.FC = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const topic = searchParams.get('topic');
  const subject = searchParams.get('subject');
  const classLevel = searchParams.get('class');

  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await searchNCDCResources(query, classLevel || undefined, subject || undefined);
        setResults(data);
      } catch (err) {
        setError("Failed to fetch resources. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (query) {
      fetchResults();
    }
  }, [query, classLevel, subject]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-uganda-dark text-white py-8 px-4">
         <div className="max-w-4xl mx-auto">
            <Link to="/" className="inline-flex items-center text-uganda-light hover:text-white mb-4 transition-colors">
              <ArrowLeft className="h-4 w-4 mr-1" /> Back to Home
            </Link>
            <h1 className="text-2xl md:text-3xl font-bold mb-2">
              Search Results
            </h1>
            <p className="text-uganda-light">
              Showing resources for: <span className="font-semibold text-white">"{topic || query}"</span>
            </p>
         </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="h-12 w-12 text-uganda-green animate-spin mb-4" />
            <p className="text-gray-500 font-medium">Searching syllabus-aligned resources...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center text-red-700">
            <AlertCircle className="h-5 w-5 mr-3" />
            {error}
          </div>
        ) : results.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-100">
             <div className="bg-gray-100 rounded-full p-4 inline-block mb-4">
                <Search className="h-8 w-8 text-gray-400" />
             </div>
            <h3 className="text-lg font-semibold text-gray-900">No results found</h3>
            <p className="text-gray-500 mt-2">Try adjusting your search terms or browse by subject.</p>
            <Link to="/" className="mt-6 inline-block text-uganda-green font-medium hover:underline">
              Browse Subjects
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-gray-500 mb-4">
              Found {results.length} external resources.
            </p>
            {results.map((result, index) => (
              <a 
                key={index} 
                href={result.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="block bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:border-uganda-green/30 transition-all group"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-medium text-gray-500 mb-2 uppercase tracking-wider">
                       <span className="bg-gray-100 px-2 py-0.5 rounded text-gray-600">{result.source}</span>
                    </div>
                    <h3 className="text-lg md:text-xl font-semibold text-uganda-green group-hover:underline decoration-2 underline-offset-2 mb-2">
                      {result.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {result.snippet}
                    </p>
                  </div>
                  <ExternalLink className="h-5 w-5 text-gray-400 group-hover:text-uganda-green flex-shrink-0 ml-4" />
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResults;