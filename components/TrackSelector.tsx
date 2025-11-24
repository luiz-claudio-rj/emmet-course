import React from 'react';
import { BookOpen, Trophy, Zap, GraduationCap } from 'lucide-react';
import { GameMode, Language, UITranslation } from '../types';
import { TRANSLATIONS } from '../constants';

interface TrackSelectorProps {
  lang: Language;
  onSelect: (mode: GameMode) => void;
}

export const TrackSelector: React.FC<TrackSelectorProps> = ({ lang, onSelect }) => {
  const t = TRANSLATIONS[lang];

  return (
    <div className="w-full max-w-5xl mx-auto p-6 animate-fade-in">
      <h2 className="text-3xl font-bold text-center text-white mb-12">{t.selectTrack}</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Learning Track */}
        <div 
          onClick={() => onSelect('LEARNING')}
          className="group relative bg-gray-800 rounded-2xl p-8 border border-gray-700 hover:border-blue-500 cursor-pointer transition-all duration-300 hover:shadow-2xl hover:shadow-blue-900/20 hover:-translate-y-2 overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <GraduationCap size={120} />
          </div>
          
          <div className="bg-blue-600/20 w-16 h-16 rounded-full flex items-center justify-center mb-6 group-hover:bg-blue-600 transition-colors">
            <BookOpen size={32} className="text-blue-400 group-hover:text-white" />
          </div>
          
          <h3 className="text-2xl font-bold text-white mb-4">{t.trackLearningTitle}</h3>
          <p className="text-gray-400 mb-8 leading-relaxed h-16">
            {t.trackLearningDesc}
          </p>
          
          <div className="flex items-center text-blue-400 font-semibold group-hover:text-blue-300">
            {t.start} <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
          </div>
        </div>

        {/* Challenge Track */}
        <div 
          onClick={() => onSelect('CHALLENGE')}
          className="group relative bg-gray-800 rounded-2xl p-8 border border-gray-700 hover:border-yellow-500 cursor-pointer transition-all duration-300 hover:shadow-2xl hover:shadow-yellow-900/20 hover:-translate-y-2 overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Trophy size={120} />
          </div>

          <div className="bg-yellow-600/20 w-16 h-16 rounded-full flex items-center justify-center mb-6 group-hover:bg-yellow-600 transition-colors">
            <Zap size={32} className="text-yellow-400 group-hover:text-white" />
          </div>
          
          <h3 className="text-2xl font-bold text-white mb-4">{t.trackChallengeTitle}</h3>
          <p className="text-gray-400 mb-8 leading-relaxed h-16">
            {t.trackChallengeDesc}
          </p>
          
          <div className="flex items-center text-yellow-400 font-semibold group-hover:text-yellow-300">
            {t.start} <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
          </div>
        </div>
      </div>
    </div>
  );
};