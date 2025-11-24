import React, { useState } from 'react';
import { Home } from 'lucide-react';

import { TRANSLATIONS } from './constants';
import { Language, GameMode } from './types';
import { TrackSelector } from './components/TrackSelector';
import { Game } from './components/Game';

const App: React.FC = () => {
  // Config State
  const [lang, setLang] = useState<Language>('pt-BR');
  const [view, setView] = useState<'SELECTION' | 'GAME'>('SELECTION');
  const [gameMode, setGameMode] = useState<GameMode>('LEARNING');

  const t = TRANSLATIONS[lang];

  // Handlers
  const handleSelectMode = (mode: GameMode) => {
    setGameMode(mode);
    setView('GAME');
  };

  const handleBackToHome = () => {
    setView('SELECTION');
  };

  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-blue-500 selection:text-white bg-[#0f172a] text-white">
      {/* Header */}
      <header className="bg-[#1e1e1e] border-b border-gray-800 p-4 flex justify-between items-center shadow-md relative z-20">
        <div className="flex items-center space-x-3 cursor-pointer" onClick={handleBackToHome}>
          <div className={`${gameMode === 'CHALLENGE' && view === 'GAME' ? 'bg-yellow-600' : 'bg-blue-600'} p-2 rounded-lg transition-colors`}>
            <span className="font-mono font-bold text-lg tracking-tighter text-white">&lt;/&gt;</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-100 hidden md:block">{t.title}</h1>
            {view === 'GAME' && (
              <p className="text-xs text-gray-500 font-mono uppercase tracking-wider">
                {gameMode === 'LEARNING' ? t.trackLearningTitle : t.trackChallengeTitle}
              </p>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
            {view === 'GAME' && (
                <button 
                  onClick={handleBackToHome}
                  className="hidden md:flex items-center text-gray-400 hover:text-white transition-colors"
                >
                  <Home size={18} className="mr-2" />
                  <span className="text-sm">{t.backToHome}</span>
                </button>
            )}

            {/* Language Switcher */}
            <select 
                value={lang}
                onChange={(e) => setLang(e.target.value as Language)}
                className="bg-gray-800 text-gray-200 text-xs py-1 px-2 rounded border border-gray-700 outline-none focus:border-blue-500"
            >
                <option value="pt-BR">🇧🇷 PT-BR</option>
                <option value="en">🇺🇸 EN</option>
                <option value="es">🇪🇸 ES</option>
            </select>
        </div>
      </header>

      {/* Main Content Area */}
      {view === 'SELECTION' ? (
        <div className="flex-1 flex flex-col justify-center items-center">
            <TrackSelector lang={lang} onSelect={handleSelectMode} />
        </div>
      ) : (
        <Game lang={lang} mode={gameMode} onBackToHome={handleBackToHome} />
      )}
    </div>
  );
};

export default App;