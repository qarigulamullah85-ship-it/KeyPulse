import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Lesson } from '../types';
import { ArrowRight, Trophy, KeyRound } from 'lucide-react';

interface GameProps {
  lesson: Lesson;
  onComplete: (wpm: number, accuracy: number) => void;
  onBack: () => void;
  onNext?: () => void;
}

function shuffleWord(word: string) {
  const arr = word.split('');
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr.join('');
}

export function TypingPuzzleGame({ lesson, onComplete, onBack, onNext }: GameProps) {
  const words = React.useMemo(() => lesson.content.split(' ').filter(w => w), [lesson.content]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [typed, setTyped] = useState('');
  const [status, setStatus] = useState<'playing' | 'victory'>('playing');
  const [scrambled, setScrambled] = useState('');
  const [mistakes, setMistakes] = useState(0);
  const [startTime] = useState(Date.now());
  const [shake, setShake] = useState(false);

  const currentWord = words[currentWordIndex];

  useEffect(() => {
    if (currentWord) {
      let shuffled = shuffleWord(currentWord);
      while(shuffled === currentWord && currentWord.length > 1) {
        shuffled = shuffleWord(currentWord);
      }
      setScrambled(shuffled);
    }
  }, [currentWord]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (status !== 'playing') return;
    if (e.key.length > 1 && e.key !== 'Backspace') return;
    
    if (e.key === 'Backspace') {
      setTyped(t => t.slice(0, -1));
      return;
    }

    if (!/^[a-zA-Z]$/.test(e.key)) return;

    if (typed.length < currentWord.length) {
      const nextTyped = typed + e.key.toLowerCase();
      setTyped(nextTyped);
      
      if (nextTyped.length === currentWord.length) {
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
          }, 500);
        } else {
          setShake(true);
          setMistakes(m => m + 1);
          setTimeout(() => {
            setShake(false);
            setTyped('');
          }, 500);
        }
      }
    }
  }, [status, currentWord, typed, currentWordIndex, words, mistakes, startTime, onComplete]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  if (status === 'victory') {
    return (
      <div className="w-full min-h-screen bg-slate-900 flex flex-col items-center justify-center p-8">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="bg-slate-800 p-12 rounded-3xl shadow-2xl text-center border border-slate-700">
          <Trophy className="w-32 h-32 text-amber-500 mx-auto mb-6" />
          <h2 className="text-4xl font-black text-white mb-8">Puzzle Solved!</h2>
          <div className="flex justify-center gap-4">
            <button onClick={onBack} className="bg-slate-700 text-slate-300 px-8 py-4 rounded-2xl font-bold text-xl hover:bg-slate-600">Back</button>
            {onNext && <button onClick={onNext} className="bg-amber-600 text-white px-8 py-4 rounded-2xl font-bold text-xl hover:bg-amber-500 flex items-center gap-2">Next <ArrowRight /></button>}
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-[#1A1A2E] flex flex-col relative overflow-hidden font-mono">
      <div className="absolute top-8 left-8">
        <button onClick={onBack} className="bg-slate-800/50 hover:bg-slate-800 text-slate-300 font-bold py-3 px-6 rounded-2xl border border-slate-700 transition-all">Back</button>
      </div>
      <div className="absolute top-8 right-8 flex gap-4 text-slate-400 font-bold text-xl">
        Level {currentWordIndex + 1}/{words.length}
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-8">
        <KeyRound className="w-24 h-24 text-indigo-500 mb-12 opacity-50" />
        
        <AnimatePresence mode="wait">
          <motion.div 
            key={currentWord}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex flex-col items-center"
          >
            <div className="text-indigo-400 font-bold tracking-[0.5em] text-3xl mb-12 uppercase">
              {scrambled}
            </div>

            <motion.div 
              animate={shake ? { x: [-10, 10, -10, 10, 0] } : {}}
              transition={{ duration: 0.4 }}
              className="flex gap-4"
            >
              {Array.from({ length: currentWord.length }).map((_, idx) => {
                const isTyped = idx < typed.length;
                const char = isTyped ? typed[idx] : '';
                const isError = shake;
                
                return (
                  <div 
                    key={idx}
                    className={`w-16 h-20 rounded-xl flex items-center justify-center text-4xl font-black uppercase
                      ${isTyped 
                        ? (isError ? 'bg-rose-500/20 text-rose-500 border-2 border-rose-500' : 'bg-indigo-600 text-white shadow-[0_0_20px_rgba(79,70,229,0.5)]') 
                        : 'bg-slate-800/50 text-slate-600 border-2 border-slate-700 border-dashed'}`}
                  >
                    {char}
                  </div>
                );
              })}
            </motion.div>
          </motion.div>
        </AnimatePresence>
        
        <div className="mt-16 text-slate-500 font-medium">Unscramble the word by typing it out</div>
      </div>
    </div>
  );
}
