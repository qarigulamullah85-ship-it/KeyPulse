import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Lesson } from '../types';
import { ArrowRight, Trophy, Heart, Star } from 'lucide-react';

interface GameProps {
  lesson: Lesson;
  onComplete: (wpm: number, accuracy: number) => void;
  onBack: () => void;
  onNext?: () => void;
}

const EMOJI_MAP: Record<string, string> = {
  cat: '🐱', dog: '🐶', cow: '🐮', pig: '🐷', fox: '🦊', bat: '🦇', 
  ant: '🐜', bug: '🐛', bee: '🐝', fly: '🪰', sun: '☀️', moon: '🌙', 
  star: '⭐', tree: '🌳', leaf: '🍃'
};

export function KidsTypingGame({ lesson, onComplete, onBack, onNext }: GameProps) {
  const words = React.useMemo(() => lesson.content.split(' ').filter(w => w), [lesson.content]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [typed, setTyped] = useState('');
  const [status, setStatus] = useState<'playing' | 'gameover' | 'victory'>('playing');
  const [score, setScore] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [startTime] = useState(Date.now());
  const [wiggleIndex, setWiggleIndex] = useState(-1);

  const currentWord = words[currentWordIndex];

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (status !== 'playing') return;
    if (e.key.length > 1) return; // ignore shift, ctrl

    const expectedChar = currentWord[typed.length];
    
    if (e.key.toLowerCase() === expectedChar.toLowerCase()) {
      const nextTyped = typed + e.key.toLowerCase();
      setTyped(nextTyped);
      setScore(s => s + 10);
      
      if (nextTyped === currentWord) {
        setTimeout(() => {
          if (currentWordIndex + 1 < words.length) {
            setCurrentWordIndex(i => i + 1);
            setTyped('');
          } else {
            setStatus('victory');
            const totalChars = words.join('').length;
            const accuracy = Math.round((totalChars / (totalChars + mistakes)) * 100);
            const minutes = (Date.now() - startTime) / 60000;
            const wpm = Math.round((totalChars / 5) / minutes);
            onComplete(wpm, accuracy);
          }
        }, 300);
      }
    } else {
      setMistakes(m => m + 1);
      setWiggleIndex(typed.length);
      setTimeout(() => setWiggleIndex(-1), 300);
    }
  }, [status, currentWord, typed, currentWordIndex, words, mistakes, startTime, onComplete]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  if (status === 'victory') {
    return (
      <div className="w-full min-h-screen bg-gradient-to-b from-sky-200 to-sky-400 flex flex-col items-center justify-center p-8">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="bg-white p-12 rounded-3xl shadow-2xl text-center">
          <Trophy className="w-32 h-32 text-yellow-400 mx-auto mb-6" />
          <h2 className="text-5xl font-black text-rose-500 mb-4">Yay! You Did It!</h2>
          <div className="flex justify-center gap-4 text-4xl mb-8">⭐⭐⭐</div>
          <p className="text-2xl text-slate-600 font-bold mb-8">Score: {score}</p>
          <div className="flex justify-center gap-4">
            <button onClick={onBack} className="bg-slate-200 text-slate-700 px-8 py-4 rounded-2xl font-bold text-xl hover:bg-slate-300">Back</button>
            {onNext && <button onClick={onNext} className="bg-rose-500 text-white px-8 py-4 rounded-2xl font-bold text-xl hover:bg-rose-600 flex items-center gap-2">Next <ArrowRight /></button>}
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-sky-100 to-sky-200 flex flex-col relative overflow-hidden">
      <div className="absolute top-8 left-8">
        <button onClick={onBack} className="bg-white/50 hover:bg-white text-slate-700 font-bold py-3 px-6 rounded-2xl shadow transition-all">Back</button>
      </div>
      <div className="absolute top-8 right-8 flex gap-4 bg-white/50 px-6 py-3 rounded-2xl font-bold text-2xl text-slate-700 shadow">
        <span className="flex items-center gap-2"><Star className="text-yellow-500" /> {score}</span>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-8">
        <AnimatePresence mode="wait">
          <motion.div 
            key={currentWord}
            initial={{ y: -50, opacity: 0, scale: 0.5 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 50, opacity: 0, scale: 0.5 }}
            className="text-center"
          >
            <div className="text-9xl mb-8">{EMOJI_MAP[currentWord] || '🌈'}</div>
            <div className="flex justify-center gap-2">
              {currentWord.split('').map((char, idx) => {
                const isTyped = idx < typed.length;
                const isWiggling = idx === wiggleIndex;
                
                return (
                  <motion.div 
                    key={idx}
                    animate={isWiggling ? { x: [-5, 5, -5, 5, 0] } : {}}
                    className={`w-24 h-32 rounded-3xl flex items-center justify-center text-7xl font-black shadow-lg
                      ${isTyped ? 'bg-emerald-400 text-white' : 'bg-white text-slate-800'}`}
                  >
                    {isTyped ? char.toUpperCase() : char.toUpperCase()}
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>
        
        <div className="mt-16 text-3xl font-bold text-slate-500 uppercase tracking-widest">
          Type the word!
        </div>
      </div>
    </div>
  );
}
