import React from 'react';
import { Sparkles, X, MapPin } from 'lucide-react';
import { GroundingSource } from '../types';

interface TriviaCardProps {
  fact: string | null;
  sources: GroundingSource[];
  loading: boolean;
  onClose: () => void;
}

const TriviaCard: React.FC<TriviaCardProps> = ({ fact, sources, loading, onClose }) => {
  if (!fact && !loading) return null;

  return (
    <div className="absolute top-4 left-4 right-4 md:left-auto md:right-4 md:w-80 bg-white/95 backdrop-blur-sm shadow-xl rounded-2xl p-4 border border-indigo-100 z-[1000] animate-in fade-in slide-in-from-top-4 duration-500">
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-indigo-100 rounded-lg">
            <Sparkles className="w-4 h-4 text-indigo-600" />
          </div>
          <span className="font-bold text-indigo-900 text-sm">Gemini Guide</span>
        </div>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
          <X className="w-4 h-4" />
        </button>
      </div>
      
      {loading ? (
        <div className="space-y-2 animate-pulse">
          <div className="h-3 bg-gray-200 rounded w-3/4"></div>
          <div className="h-3 bg-gray-200 rounded w-full"></div>
        </div>
      ) : (
        <>
          <p className="text-gray-700 text-sm leading-relaxed mb-3">
            {fact}
          </p>
          
          {sources.length > 0 && (
            <div className="border-t border-gray-100 pt-2 mt-2">
              <p className="text-[10px] text-gray-400 font-semibold mb-1 uppercase tracking-wider">Source</p>
              <div className="flex flex-wrap gap-2">
                {sources.map((source, idx) => (
                  <a 
                    key={idx}
                    href={source.uri}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-[10px] bg-gray-100 hover:bg-blue-50 text-gray-600 hover:text-blue-600 px-2 py-1 rounded-full transition-colors"
                  >
                    <MapPin className="w-3 h-3" />
                    <span className="truncate max-w-[150px]">{source.title}</span>
                  </a>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default TriviaCard;