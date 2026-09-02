import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Lesson } from '../types';
import { ArrowRight, Heart, RotateCcw, Trophy } from 'lucide-react';
import { useLanguage } from '../i18n';

interface TypingGameProps {
  lesson: Lesson;
  onComplete: (wpm: number, accuracy: number) => void;
  onBack: () => void;
  onNext?: () => void;
}

interface FallingWord {
  id: number;
  text: string;
  x: number;
  y: number;
  speed: number;
}

export function TypingGame({ lesson, onComplete, onBack, onNext }: TypingGameProps) {
  const { t } = useLanguage();
  const [words, setWordsState] = useState<FallingWord[]>([]);
  const wordsRef = useRef<FallingWord[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const livesRef = useRef(3);
  const [status, setStatus] = useState<'playing' | 'gameover' | 'victory'>('playing');
  const [startTime] = useState(Date.now());
  const [keystrokes, setKeystrokes] = useState(0);
  const [correctKeystrokes, setCorrectKeystrokes] = useState(0);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const requestRef = useRef<number>();
  const lastSpawnTime = useRef<number>(Date.now());
  const wordsToSpawn = useRef<string[]>(lesson.content.split(' ').filter(w => w.length > 0));

  const setWords = (newWords: FallingWord[]) => {
    wordsRef.current = newWords;
    setWordsState(newWords);
  };
  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (status !== 'playing' && e.key === 'Enter') {
        if (onNext) {
          onNext();
        } else {
          onBack();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [status, onNext, onBack]);

  const finishGame = useCallback((won: boolean) => {
    const timeMs = Date.now() - startTime;
    const timeMin = timeMs / 60000;
    const wpm = timeMin > 0 ? Math.round((correctKeystrokes / 5) / timeMin) : 0;
    const accuracy = keystrokes > 0 ? Math.round((correctKeystrokes / keystrokes) * 100) : 0;
    onComplete(won ? wpm || 20 : 0, won ? accuracy || 90 : 0);
  }, [startTime, correctKeystrokes, keystrokes, onComplete]);

  // Game Loop
  const updateGame = useCallback(() => {
    if (status !== 'playing') return;

    const now = Date.now();
    const isBalloon = lesson.gameType === 'balloon';
    
    let currentWords = [...wordsRef.current];
    let didSpawn = false;

    // Spawn new word
    if (now - lastSpawnTime.current > 2000 && currentWords.length < 5 && wordsToSpawn.current.length > 0) {
      const text = wordsToSpawn.current.shift()!;
      const newWord: FallingWord = {
        id: Math.random(),
        text,
        x: Math.random() * 80 + 10,
        y: isBalloon ? 110 : -10,
        speed: (0.1 + Math.random() * 0.1) * (isBalloon ? -1 : 1)
      };
      currentWords.push(newWord);
      lastSpawnTime.current = now;
      didSpawn = true;
    }

    // Check win condition
    if (wordsToSpawn.current.length === 0 && currentWords.length === 0) {
      setStatus('victory');
      finishGame(true);
      return;
    }

    let lostLife = false;
    currentWords = currentWords.map(w => ({ ...w, y: w.y + w.speed })).filter(w => {
      if (isBalloon) {
        if (w.y < -10) {
          lostLife = true;
          return false;
        }
      } else {
        if (w.y > 100) {
          lostLife = true;
          return false;
        }
      }
      return true;
    });

    if (lostLife) {
      livesRef.current -= 1;
      setLives(livesRef.current);
      if (livesRef.current <= 0) {
        setStatus('gameover');
        finishGame(false);
      }
    }

    // Always update words ref, but we could throttle react state updates if it causes performance issues.
    // For now, updating state every frame is what it was doing before.
    setWords(currentWords);

    requestRef.current = requestAnimationFrame(updateGame);
  }, [status, lesson.gameType, finishGame]);

  useEffect(() => {
    if (status === 'playing') {
      requestRef.current = requestAnimationFrame(updateGame);
    }
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [updateGame, status]);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputValue(val);
    setKeystrokes(k => k + 1);

    // Check if input matches any active word
    const matchedWordIndex = words.findIndex(w => w.text === val.trim());
    if (matchedWordIndex !== -1) {
      // Play sound
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      
      if (lesson.gameType === 'balloon') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(800, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(100, audioCtx.currentTime + 0.05);
        gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.05);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.05);
      } else {
        osc.type = 'square';
        osc.frequency.setValueAtTime(400, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(800, audioCtx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.1);
      }

      setCorrectKeystrokes(c => c + val.length);
      setScore(s => s + val.length * 10);
      
      const newWords = wordsRef.current.filter((_, i) => i !== matchedWordIndex);
      setWords(newWords);
      setInputValue('');
    }
  };

  return (
    <div className="h-screen flex flex-col bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white overflow-hidden relative transition-colors duration-300" ref={containerRef}>
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-white/10 relative z-10 bg-white/50 dark:bg-slate-900/50 backdrop-blur">
        <button onClick={onBack} className="flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
          <RotateCcw className="w-5 h-5" /> {t('backToDashboard')}
        </button>
        <div className="flex items-center gap-8 text-lg font-bold">
          <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
            <Trophy className="w-5 h-5" /> {t('score')}: {score}
          </div>
          <div className="flex items-center gap-2 text-rose-500">
            {Array.from({ length: Math.max(3, lives) }).map((_, i) => (
              <Heart key={i} className={`w-5 h-5 ${i < lives ? 'fill-rose-500' : 'text-slate-300 dark:text-slate-700'}`} />
            ))}
          </div>
        </div>
      </div>

      {/* Game Area */}
      <div className="flex-1 relative overflow-hidden">
        {lesson.gameType === 'balloon' && (
          <div className="absolute top-0 left-0 w-full h-8 bg-gradient-to-b from-rose-500/50 to-transparent z-10 pointer-events-none" />
        )}
        <AnimatePresence>
          {words.map(w => (
            <motion.div
              key={w.id}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1, y: `${w.y}vh`, x: `${w.x}vw` }}
              exit={{ opacity: 0, scale: 1.5 }}
              transition={{ type: 'tween', duration: 0 }} // Duration 0 because we handle animation loop
              className={`absolute top-0 left-0 text-2xl font-mono font-bold whitespace-pre transform -translate-x-1/2 flex flex-col items-center justify-center ${lesson.gameType === 'balloon' ? '' : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-4 py-2 rounded-lg shadow-md dark:shadow-[0_4px_12px_rgba(255,255,255,0.2)] border border-slate-200 dark:border-transparent'}`}
              style={{ top: `${w.y}%`, left: `${w.x}%` }}
            >
              {lesson.gameType === 'balloon' && (
                <div className="relative w-24 h-28 bg-rose-500 rounded-[50%_50%_50%_50%/60%_60%_40%_40%] shadow-inner mb-1 flex items-center justify-center before:content-[''] before:absolute before:bottom-[-8px] before:w-0 before:h-0 before:border-l-[6px] before:border-r-[6px] before:border-b-[10px] before:border-transparent before:border-b-rose-600 after:content-[''] after:absolute after:bottom-[-40px] after:w-0.5 after:h-8 after:bg-gray-300">
                  <div className="absolute top-4 right-4 w-4 h-6 bg-white/30 rounded-full rotate-45 blur-[1px]"></div>
                  <div className="z-10 text-white font-black text-xl drop-shadow-md">
                    {/* Highlight typed portion if it matches start of word */}
                    {w.text.startsWith(inputValue.trim()) && inputValue.trim().length > 0 ? (
                      <>
                        <span className="text-rose-200">{inputValue.trim()}</span>
                        <span>{w.text.slice(inputValue.trim().length)}</span>
                      </>
                    ) : (
                      w.text
                    )}
                  </div>
                </div>
              )}
              {lesson.gameType !== 'balloon' && (
                <>
                  {/* Highlight typed portion if it matches start of word */}
                  {w.text.startsWith(inputValue.trim()) && inputValue.trim().length > 0 ? (
                    <>
                      <span className="text-blue-600">{inputValue.trim()}</span>
                      <span>{w.text.slice(inputValue.trim().length)}</span>
                    </>
                  ) : (
                    w.text
                  )}
                </>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
        
        {/* Ground */}
        <div className={`absolute bottom-0 left-0 w-full h-2 ${lesson.gameType === 'balloon' ? 'bg-gradient-to-t from-sky-500/50 to-transparent' : 'bg-gradient-to-t from-rose-500/50 to-transparent'}`} />
      </div>

      {/* Input Area */}
      <div className="p-8 bg-white dark:bg-slate-900 flex justify-center items-center relative z-10 border-t border-slate-200 dark:border-white/10 transition-colors">
        <input
          autoFocus
          type="text"
          value={inputValue}
          onChange={handleInput}
          disabled={status !== 'playing'}
          className="bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono text-3xl px-8 py-4 rounded-xl border-2 border-blue-400 dark:border-blue-500/50 focus:border-blue-600 dark:focus:border-blue-500 outline-none w-full max-w-lg shadow-[0_0_15px_rgba(59,130,246,0.1)] dark:shadow-[0_0_20px_rgba(59,130,246,0.2)] text-center transition-all disabled:opacity-50"
          placeholder="Type words here..."
          autoComplete="off"
        />
      </div>

      {/* Result Overlay */}
      <AnimatePresence>
        {status !== 'playing' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm flex items-center justify-center transition-colors"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-white dark:bg-slate-800 p-12 rounded-3xl text-center border border-slate-200 dark:border-white/10 shadow-2xl max-w-md w-full"
            >
              <div className="text-6xl mb-6 flex justify-center">
                {status === 'victory' ? '🏆' : '💀'}
              </div>
              <h2 className={`text-4xl font-black mb-2 ${status === 'victory' ? 'text-amber-500 dark:text-amber-400' : 'text-rose-600 dark:text-rose-500'}`}>
                {status === 'victory' ? t('victory') : t('gameOVer')}
              </h2>
              <p className="text-slate-500 dark:text-slate-400 mb-8">{t('score')}: <span className="text-slate-900 dark:text-white font-bold text-xl">{score}</span></p>
              
              <div className="flex gap-4">
                <button
                  onClick={onNext ? onNext : onBack}
                  className="flex-1 py-4 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-900 dark:text-white rounded-xl font-bold transition-colors flex items-center justify-center gap-2"
                >
                  {onNext ? 'Next Lesson' : t('continue')}
                  <span className="text-xs bg-slate-300 dark:bg-slate-600 px-2 py-1 rounded opacity-70">↵ Enter</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
