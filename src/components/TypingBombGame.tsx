import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Lesson } from '../types';
import { ArrowRight, Trophy, Flame, Heart } from 'lucide-react';

interface GameProps {
  lesson: Lesson;
  onComplete: (wpm: number, accuracy: number) => void;
  onBack: () => void;
  onNext?: () => void;
}

export function TypingBombGame({ lesson, onComplete, onBack, onNext }: GameProps) {
  const words = React.useMemo(() => lesson.content.split(' ').filter(w => w), [lesson.content]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [typed, setTyped] = useState('');
  const [status, setStatus] = useState<'playing' | 'gameover' | 'victory'>('playing');
  const [mistakes, setMistakes] = useState(0);
  const [startTime] = useState(Date.now());
  const [lives, setLives] = useState(3);
  const [timeLeft, setTimeLeft] = useState(5000); // 5 seconds per bomb

  const currentWord = words[currentWordIndex];

  // Timer loop
  useEffect(() => {
    if (status !== 'playing') return;
    
    if (timeLeft <= 0) {
      // Boom!
      const nextLives = lives - 1;
      if (nextLives <= 0) {
        setLives(0);
        setStatus('gameover');
      } else if (currentWordIndex + 1 < words.length) {
        setLives(nextLives);
        setCurrentWordIndex(i => i + 1);
        setTyped('');
        setTimeLeft(5000 - ((currentWordIndex + 1) * 100));
      } else {
        setLives(nextLives);
        setStatus('victory');
      }
      return;
    }
    
    const timer = setTimeout(() => {
      setTimeLeft(t => t - 100);
    }, 100);

    return () => clearTimeout(timer);
  }, [status, timeLeft, lives, currentWordIndex, words.length]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (status !== 'playing') return;
    if (e.key.length > 1) return; // ignore shift, ctrl

    const expectedChar = currentWord[typed.length];
    
    if (e.key.toLowerCase() === expectedChar.toLowerCase()) {
      const nextTyped = typed + e.key.toLowerCase();
      setTyped(nextTyped);
      
      if (nextTyped === currentWord) {
        if (currentWordIndex + 1 < words.length) {
          setCurrentWordIndex(i => i + 1);
          setTyped('');
          setTimeLeft(5000 - (currentWordIndex * 100)); // Gets slightly faster
        } else {
          setStatus('victory');
          const totalChars = words.join('').length;
          const accuracy = Math.round((totalChars / (totalChars + mistakes)) * 100);
          const minutes = (Date.now() - startTime) / 60000;
          const wpm = Math.round((totalChars / 5) / minutes);
          onComplete(wpm, accuracy);
        }
      }
    } else {
      setMistakes(m => m + 1);
    }
  }, [status, currentWord, typed, currentWordIndex, words, mistakes, startTime, onComplete]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  if (status === 'gameover') {
    return (
      <div className="w-full min-h-screen bg-slate-900 flex flex-col items-center justify-center p-8">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="bg-slate-800 p-12 rounded-3xl shadow-2xl text-center border border-slate-700">
          <Flame className="w-32 h-32 text-orange-500 mx-auto mb-6 animate-pulse" />
          <h2 className="text-5xl font-black text-rose-500 mb-8">BOOM! GAME OVER</h2>
          <button onClick={() => {
            setLives(3);
            setCurrentWordIndex(0);
            setTyped('');
            setTimeLeft(5000);
            setMistakes(0);
            setStatus('playing');
          }} className="bg-rose-600 text-white px-8 py-4 rounded-2xl font-bold text-xl hover:bg-rose-500">Try Again</button>
        </motion.div>
      </div>
    );
  }

  if (status === 'victory') {
    return (
      <div className="w-full min-h-screen bg-slate-900 flex flex-col items-center justify-center p-8">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="bg-slate-800 p-12 rounded-3xl shadow-2xl text-center border border-slate-700">
          <Trophy className="w-32 h-32 text-yellow-500 mx-auto mb-6" />
          <h2 className="text-4xl font-black text-white mb-8">Bomb Defused!</h2>
          <div className="flex justify-center gap-4">
            <button onClick={onBack} className="bg-slate-700 text-slate-300 px-8 py-4 rounded-2xl font-bold text-xl hover:bg-slate-600">Back</button>
            {onNext && <button onClick={onNext} className="bg-orange-600 text-white px-8 py-4 rounded-2xl font-bold text-xl hover:bg-orange-500 flex items-center gap-2">Next <ArrowRight /></button>}
          </div>
        </motion.div>
      </div>
    );
  }

  const fuseWidth = (timeLeft / (5000 - (currentWordIndex > 0 ? (currentWordIndex - 1) * 100 : 0))) * 100;

  return (
    <div className="w-full min-h-screen bg-[#2c1515] flex flex-col relative overflow-hidden font-mono">
      <div className="absolute top-8 left-8">
        <button onClick={onBack} className="bg-black/30 hover:bg-black/50 text-orange-200 font-bold py-3 px-6 rounded-2xl border border-orange-900/50 transition-all">Back</button>
      </div>
      <div className="absolute top-8 right-8 flex gap-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <Heart key={i} className={`w-8 h-8 ${i < lives ? 'text-rose-500 fill-rose-500' : 'text-slate-800'}`} />
        ))}
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-8">
        <div className="mb-12 relative w-full max-w-xl">
          {/* Fuse line */}
          <div className="h-4 bg-slate-900 rounded-full w-full overflow-hidden border border-slate-800 shadow-inner">
            <div 
              className="h-full bg-gradient-to-r from-orange-600 to-yellow-400 transition-all duration-100 ease-linear relative"
              style={{ width: `${Math.min(100, Math.max(0, fuseWidth))}%` }}
            >
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-[0_0_15px_#facc15] animate-ping"></div>
            </div>
          </div>
          <div className="text-center mt-4 text-orange-500 font-black tracking-widest">
            DEFUSE IN: {(timeLeft / 1000).toFixed(1)}s
          </div>
        </div>

        <div className="relative">
          <Flame className="absolute -top-16 -right-12 w-24 h-24 text-orange-500 animate-pulse opacity-50" />
          <div className="text-7xl font-black tracking-wider text-slate-700 bg-black/40 px-12 py-8 rounded-[3rem] shadow-2xl border-[8px] border-slate-900 relative z-10">
            {currentWord?.split('').map((char, index) => {
              let colorClass = 'text-slate-600';
              if (index < typed.length) {
                colorClass = 'text-orange-500 drop-shadow-[0_0_15px_rgba(249,115,22,0.8)]';
              }
              return (
                <span key={index} className={colorClass}>
                  {char}
                </span>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
