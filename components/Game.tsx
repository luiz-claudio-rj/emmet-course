import React, { useState, useEffect, useRef } from 'react';
import { Play, CheckCircle2, AlertCircle, ArrowRight, Lightbulb, RefreshCcw, BookOpen, Award, Printer, RotateCcw, Timer, Home, Star, Crown, Zap } from 'lucide-react';
import { getLevels, TRANSLATIONS } from '../constants';
import { GameStatus, Language, GameMode, Difficulty, Level } from '../types';
import { expandEmmetWithGemini, getAiHint } from '../services/geminiService';
import { CodeEditor } from './CodeEditor';
import { HtmlPreview } from './HtmlPreview';

// Helper to normalize HTML for comparison (removes whitespace/newlines)
const normalizeHtml = (html: string) => html.replace(/\s+/g, '').toLowerCase();

// Helper to format seconds into mm:ss
const formatTime = (totalSeconds: number) => {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
};

interface GameProps {
  lang: Language;
  mode: GameMode;
  onBackToHome: () => void;
}

const RankBadge: React.FC<{ difficulty: Difficulty; t: any }> = ({ difficulty, t }) => {
  let colorClass = "";
  let icon = null;
  let label = "";

  switch (difficulty) {
    case 'JUNIOR':
      colorClass = "bg-emerald-900/50 text-emerald-300 border-emerald-500/50";
      icon = <Star size={14} className="mr-2" />;
      label = t.rankJunior;
      break;
    case 'PLENO':
      colorClass = "bg-amber-900/50 text-amber-300 border-amber-500/50";
      icon = <Zap size={14} className="mr-2" />;
      label = t.rankPleno;
      break;
    case 'SENIOR':
      colorClass = "bg-rose-900/50 text-rose-300 border-rose-500/50";
      icon = <Crown size={14} className="mr-2" />;
      label = t.rankSenior;
      break;
  }

  return (
    <div className={`flex items-center px-3 py-1 rounded-full border text-xs font-bold uppercase tracking-wider ${colorClass}`}>
      {icon}
      {label}
    </div>
  );
};

export const Game: React.FC<GameProps> = ({ lang, mode, onBackToHome }) => {
  // Game State
  const [gameLevels, setGameLevels] = useState<Level[]>([]);
  const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
  const [inputEmmet, setInputEmmet] = useState('');
  const [generatedHtml, setGeneratedHtml] = useState('');
  const [status, setStatus] = useState<GameStatus>(GameStatus.IDLE);
  const [errorMessage, setErrorMessage] = useState('');
  const [hint, setHint] = useState('');
  const [showDiplomaForm, setShowDiplomaForm] = useState(false);
  const [userName, setUserName] = useState('');
  const [diplomaGenerated, setDiplomaGenerated] = useState(false);
  
  // Timer State (Challenge Mode)
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [finalTime, setFinalTime] = useState(0);
  const timerRef = useRef<number | null>(null);

  // Derived
  const t = TRANSLATIONS[lang];

  // Initialize Levels
  useEffect(() => {
    const allLevels = getLevels(lang);
    
    if (mode === 'CHALLENGE') {
      // Fisher-Yates shuffle and pick 10
      const shuffled = [...allLevels];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      setGameLevels(shuffled.slice(0, 10));
    } else {
      // Learning mode: Use all levels in order
      setGameLevels(allLevels);
    }
    
    // Reset state
    setCurrentLevelIndex(0);
    setElapsedSeconds(0);
    setFinalTime(0);
    setShowDiplomaForm(false);
    setDiplomaGenerated(false);
  }, [lang, mode]);

  const currentLevel = gameLevels[currentLevelIndex];
  const isLastLevel = currentLevelIndex === gameLevels.length - 1;

  // Reset inputs on level change
  useEffect(() => {
    setInputEmmet('');
    setGeneratedHtml('');
    setStatus(GameStatus.IDLE);
    setErrorMessage('');
    setHint('');
  }, [currentLevelIndex]);

  // Timer Logic
  useEffect(() => {
    if (mode === 'CHALLENGE' && !showDiplomaForm && gameLevels.length > 0) {
      timerRef.current = window.setInterval(() => {
        setElapsedSeconds(prev => prev + 1);
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [mode, showDiplomaForm, gameLevels]);

  // Handlers
  const handleRun = async () => {
    if (!inputEmmet.trim()) return;
    
    setStatus(GameStatus.LOADING);
    setErrorMessage('');
    setHint('');

    try {
      // 1. Expand User Input using Gemini
      const expanded = await expandEmmetWithGemini(process.env.API_KEY || '', inputEmmet);
      
      if (expanded === 'INVALID_EMMET') {
        setErrorMessage(t.errorInvalid);
        setStatus(GameStatus.ERROR);
        return;
      }

      setGeneratedHtml(expanded);

      // 2. Validate
      const normalizedUser = normalizeHtml(expanded);
      const normalizedTarget = normalizeHtml(currentLevel.targetHtml);

      if (normalizedUser === normalizedTarget) {
        setStatus(GameStatus.SUCCESS);
      } else {
        setStatus(GameStatus.ERROR);
        setErrorMessage(t.errorMismatch);
      }
    } catch (err: any) {
      console.error(err);
      setErrorMessage(t.errorConnection);
      setStatus(GameStatus.ERROR);
    }
  };

  const handleNextLevel = () => {
    if (!isLastLevel) {
      setCurrentLevelIndex(prev => prev + 1);
    } else {
      if (mode === 'CHALLENGE') {
        setFinalTime(elapsedSeconds);
        if (timerRef.current) clearInterval(timerRef.current);
      }
      setShowDiplomaForm(true);
    }
  };

  const handleGetHint = async () => {
    if (status === GameStatus.LOADING) return;
    setHint(t.processing);
    const aiHint = await getAiHint(process.env.API_KEY || '', inputEmmet, currentLevel.targetHtml, currentLevel.concept);
    setHint(aiHint);
  };

  const handleGenerateDiploma = (e: React.FormEvent) => {
    e.preventDefault();
    if (userName.trim()) {
        setDiplomaGenerated(true);
    }
  };

  const handleRestart = () => {
    // If restarting challenge, we need to re-shuffle, which useEffect handles if we force a refresh or just reset
    // For simplicity, we just reset indices here. 
    // To re-shuffle, we could toggle a 'key' or just call the init logic again.
    // Here we'll just reset the current list.
    setCurrentLevelIndex(0);
    setShowDiplomaForm(false);
    setDiplomaGenerated(false);
    setUserName('');
    setElapsedSeconds(0);
    setFinalTime(0);
  };

  if (!currentLevel) {
    return <div className="flex-1 flex items-center justify-center text-blue-400 animate-pulse">{t.processing}</div>;
  }

  // --- RENDER DIPLOMA SCREEN ---
  if (showDiplomaForm) {
    return (
        <div className="flex-1 flex flex-col items-center justify-center p-4">
             {!diplomaGenerated ? (
                 <div className="bg-gray-800 rounded-xl p-8 border border-gray-700 shadow-2xl max-w-md w-full animate-fade-in">
                    <div className="flex justify-center mb-6">
                        <Award size={64} className={mode === 'CHALLENGE' ? "text-yellow-400" : "text-blue-400"} />
                    </div>
                    <h2 className="text-2xl font-bold text-center text-white mb-2">{t.finishTitle}</h2>
                    <p className="text-gray-400 text-center mb-8">
                      {mode === 'CHALLENGE' ? t.finishDescChallenge : t.finishDesc}
                    </p>
                    {mode === 'CHALLENGE' && (
                      <div className="text-center mb-6 font-mono text-xl text-yellow-400 bg-yellow-900/20 py-2 rounded border border-yellow-700/50">
                        {t.timeLabel}: {formatTime(finalTime)}
                      </div>
                    )}
                    
                    <form onSubmit={handleGenerateDiploma} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">{t.nameLabel}</label>
                            <input 
                                type="text" 
                                value={userName}
                                onChange={(e) => setUserName(e.target.value)}
                                className="w-full bg-gray-900 border border-gray-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder="John Doe"
                                required
                            />
                        </div>
                        <button 
                            type="submit"
                            className={`w-full text-white font-bold py-3 rounded-lg transition-colors shadow-lg ${mode === 'CHALLENGE' ? 'bg-yellow-600 hover:bg-yellow-500' : 'bg-blue-600 hover:bg-blue-500'}`}
                        >
                            {t.generateDiploma}
                        </button>
                    </form>
                 </div>
             ) : (
                 <div className="flex flex-col items-center animate-fade-in w-full max-w-4xl">
                    {/* DIPLOMA PREVIEW */}
                    <div className="bg-[#fffbf0] text-gray-900 p-8 md:p-12 rounded-sm shadow-2xl border-8 border-double border-[#b49b57] w-full aspect-[1.414/1] flex flex-col items-center justify-center text-center relative overflow-hidden">
                        {/* Decorative background Elements */}
                        <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
                        <div className="absolute top-4 left-4 w-24 h-24 border-t-4 border-l-4 border-[#b49b57]"></div>
                        <div className="absolute bottom-4 right-4 w-24 h-24 border-b-4 border-r-4 border-[#b49b57]"></div>

                        <Award size={64} className="text-[#b49b57] mb-6" />
                        <h1 className="font-serif text-3xl md:text-5xl font-bold text-[#2c3e50] mb-4 uppercase tracking-widest">
                          {mode === 'CHALLENGE' ? t.diplomaTitleChallenge : t.diplomaTitle}
                        </h1>
                        <div className="w-24 h-1 bg-[#b49b57] mb-8"></div>
                        <p className="font-serif text-lg md:text-xl text-gray-600 mb-6 italic max-w-2xl">
                          {mode === 'CHALLENGE' ? t.diplomaTextChallenge : t.diplomaText}
                        </p>
                        
                        <h2 className="font-serif text-4xl md:text-6xl text-[#1e293b] font-bold mb-6 border-b-2 border-gray-300 pb-2 px-8 min-w-[300px]">
                            {userName}
                        </h2>

                        {mode === 'CHALLENGE' && (
                          <div className="mb-8 font-serif text-2xl text-[#b49b57] font-bold">
                             {t.timeLabel}: {formatTime(finalTime)}
                          </div>
                        )}

                        <div className="flex justify-between w-full max-w-2xl mt-4">
                            <div className="text-center">
                                <div className="text-sm font-bold text-gray-400 uppercase tracking-wider">Date</div>
                                <div className="font-serif text-lg text-gray-800">{new Date().toLocaleDateString()}</div>
                            </div>
                            <div className="text-center">
                                <div className="text-sm font-bold text-gray-400 uppercase tracking-wider">Emmet Master</div>
                                <div className="font-serif text-lg text-gray-800">AI Instructor</div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 flex space-x-4">
                        <button onClick={() => window.print()} className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-2 rounded-lg flex items-center space-x-2">
                            <Printer size={18} />
                            <span>{t.download}</span>
                        </button>
                        <button onClick={handleRestart} className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg flex items-center space-x-2">
                            <RotateCcw size={18} />
                            <span>{t.restart}</span>
                        </button>
                        <button onClick={onBackToHome} className="bg-gray-800 hover:bg-gray-700 text-white px-6 py-2 rounded-lg flex items-center space-x-2 border border-gray-600">
                            <Home size={18} />
                            <span>{t.backToHome}</span>
                        </button>
                    </div>
                 </div>
             )}
        </div>
    );
  }

  // --- MAIN GAME ---
  return (
    <div className="flex-1 p-4 md:p-8 flex flex-col md:flex-row gap-6 overflow-hidden">
        
        {/* Challenge Timer Overlay */}
        {mode === 'CHALLENGE' && (
          <div className="fixed top-20 right-4 md:right-8 bg-black/50 backdrop-blur text-yellow-400 border border-yellow-500/50 px-4 py-2 rounded-lg font-mono text-xl z-10 flex items-center gap-2 shadow-lg">
            <Timer size={20} className="animate-pulse" />
            {formatTime(elapsedSeconds)}
          </div>
        )}

        {/* Left Column: Examples & Editor */}
        <section className="flex-1 flex flex-col min-h-[400px] gap-6">
          
          {/* Progress / Title Bar */}
          <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                  <span className="text-gray-400 text-sm font-bold uppercase tracking-widest">
                    {t.level} {currentLevelIndex + 1}
                  </span>
                  <RankBadge difficulty={currentLevel.difficulty} t={t} />
              </div>
              <div className="text-sm text-gray-500">
                  {currentLevelIndex + 1} / {gameLevels.length}
              </div>
          </div>

          <h1 className="text-2xl font-bold text-white">{currentLevel.title}</h1>

          {/* Usage Examples - ONLY IN LEARNING MODE */}
          {mode === 'LEARNING' && (
            <div className="bg-gray-800/50 rounded-xl p-5 border border-gray-700 backdrop-blur-sm animate-fade-in">
              <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                      <BookOpen size={18} className="text-blue-400" />
                      <h2 className="text-sm font-bold text-blue-400 tracking-wider uppercase">{t.examplesLabel}</h2>
                  </div>
                  <div className="px-3 py-1 bg-blue-900/30 rounded text-xs text-blue-300 border border-blue-800/50">
                      <span className="font-bold opacity-70 mr-2">{t.conceptLabel}:</span>
                      <span className="font-mono">{currentLevel.concept}</span>
                  </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {currentLevel.examples.map((ex, idx) => (
                      <div key={idx} className="bg-[#1e1e1e] border border-gray-700 rounded p-2 px-3 font-mono text-sm text-green-400 flex items-center shadow-inner">
                          <span className="text-gray-600 mr-2 select-none">$</span>
                          {ex}
                      </div>
                  ))}
              </div>
            </div>
          )}

          {/* Editor Container */}
          <div className="flex-1 flex flex-col min-h-[250px]">
             <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-gray-400">{t.inputLabel}</span>
                {status === GameStatus.ERROR && mode !== 'CHALLENGE' && (
                    <button 
                        onClick={handleGetHint}
                        className="text-xs text-yellow-400 hover:text-yellow-300 flex items-center space-x-1 transition-colors"
                    >
                        <Lightbulb size={12} />
                        <span>{t.hintButton}</span>
                    </button>
                )}
             </div>
             <CodeEditor 
                value={inputEmmet} 
                onChange={setInputEmmet} 
                onEnter={handleRun}
                disabled={status === GameStatus.SUCCESS || status === GameStatus.LOADING}
             />
             
             {/* Action Bar */}
             <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center space-x-3 h-6">
                    {status === GameStatus.LOADING && (
                        <span className="text-sm text-blue-400 animate-pulse flex items-center">
                            <RefreshCcw size={14} className="mr-2 animate-spin" /> {t.processing}
                        </span>
                    )}
                    {status === GameStatus.ERROR && (
                        <span className="text-sm text-red-400 flex items-center">
                            <AlertCircle size={14} className="mr-2" /> {errorMessage}
                        </span>
                    )}
                    {hint && mode !== 'CHALLENGE' && (
                        <span className="text-sm text-yellow-400 italic animate-fade-in flex items-center">
                            <span className="font-bold mr-1 not-italic">[{t.hintPrefix}]</span> {hint}
                        </span>
                    )}
                </div>

                <div className="flex space-x-3 w-full sm:w-auto">
                    {status === GameStatus.SUCCESS ? (
                         <button
                            onClick={handleNextLevel}
                            className="w-full sm:w-auto bg-green-600 hover:bg-green-500 text-white px-6 py-2 rounded-lg font-semibold flex items-center justify-center space-x-2 transition-all shadow-lg shadow-green-900/20"
                         >
                            <span>{t.nextButton}</span>
                            <ArrowRight size={18} />
                         </button>
                    ) : (
                        <button
                            onClick={handleRun}
                            disabled={status === GameStatus.LOADING || !inputEmmet}
                            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg font-semibold flex items-center justify-center space-x-2 transition-all shadow-lg shadow-blue-900/20"
                        >
                            <Play size={18} fill="currentColor" />
                            <span>{t.runButton}</span>
                        </button>
                    )}
                </div>
             </div>
          </div>
        </section>

        {/* Right Column: Comparison */}
        <section className="flex-1 flex flex-col md:flex-row gap-4 min-h-[400px]">
             
             {/* User Output (Generated) */}
             <div className="flex-1 flex flex-col">
                <div className="mb-2 text-sm font-semibold text-gray-400 flex justify-between">
                    <span>{t.outputLabel}</span>
                    {status === GameStatus.SUCCESS && <span className="text-green-500 text-xs font-bold uppercase tracking-wider">{t.matched}</span>}
                </div>
                <div className={`flex-1 rounded-lg transition-all duration-300 ${status === GameStatus.SUCCESS ? 'ring-2 ring-green-500 shadow-[0_0_20px_rgba(34,197,94,0.2)]' : ''}`}>
                    <HtmlPreview html={generatedHtml} label={t.outputLabel} isEmpty={!generatedHtml} />
                </div>
             </div>

             {/* Target */}
             <div className="flex-1 flex flex-col">
                <div className="mb-2 text-sm font-semibold text-gray-400">{t.targetLabel}</div>
                <div className="flex-1 rounded-lg opacity-80 hover:opacity-100 transition-opacity">
                    <HtmlPreview html={currentLevel.targetHtml} label={t.targetLabel} />
                </div>
             </div>

        </section>

        {/* Success Overlay Toast */}
        {status === GameStatus.SUCCESS && !showDiplomaForm && (
            <div className="fixed bottom-10 left-1/2 transform -translate-x-1/2 bg-green-900/90 text-green-100 px-6 py-3 rounded-full border border-green-500 shadow-2xl flex items-center space-x-3 animate-bounce z-50">
                <CheckCircle2 size={24} className="text-green-400" />
                <span className="font-bold">{t.matched}!</span>
            </div>
        )}
    </div>
  );
};