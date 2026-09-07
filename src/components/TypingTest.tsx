import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, RotateCcw, Trophy, Clock } from 'lucide-react';
import { commonWords } from '../data';

interface TypingTestProps {
  ninjaMode?: boolean;
  duration: number; // 60 or 120 seconds
  onComplete: (wpm: number, accuracy: number) => void;
  onBack: () => void;
}

function generateWords(count: number) {
  const result = [];
  for (let i = 0; i < count; i++) {
    result.push(commonWords[Math.floor(Math.random() * commonWords.length)]);
  }
  return result.join(' ');
}

export function TypingTest({ duration, onComplete, onBack, ninjaMode }: TypingTestProps) {
  const [text, setText] = useState(generateWords(100));
  const [typed, setTyped] = useState('');
  const [timeLeft, setTimeLeft] = useState(duration);
  const [status, setStatus] = useState<'waiting' | 'playing' | 'finished'>('waiting');
  const [mistakes, setMistakes] = useState(0);
  
  const inputRef = useRef<HTMLInputElement>(null);

  // Maintain sufficient words ahead
  useEffect(() => {
    if (typed.length > text.length - 100) {
      setText(t => t + ' ' + generateWords(50));
    }
  }, [typed, text]);

  useEffect(() => {
    if (status !== 'playing') return;
    const interval = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          setStatus('finished');
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [status]);

  useEffect(() => {
    if (status === 'finished') {
      const minutes = duration / 60;
      const wpm = Math.round((typed.length / 5) / minutes);
      const totalChars = typed.length + mistakes;
      const accuracy = totalChars > 0 ? Math.round((typed.length / totalChars) * 100) : 0;
      onComplete(wpm, accuracy);
    }
  }, [status, duration, typed, mistakes, onComplete]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (status === 'finished') return;
    if (status === 'waiting') setStatus('playing');
    
    const value = e.target.value;
    
    // Check if the last character was a mistake
    if (value.length > typed.length) {
      const charAdded = value[value.length - 1];
      const expectedChar = text[value.length - 1];
      if (charAdded !== expectedChar) {
        setMistakes(m => m + 1);
        // Do not block typing, let them make mistakes, or we can enforce backspace.
        // For simplicity, enforce strict typing like 10fastfingers (can only type correct char, or we just let them type but highlight red).
        // Let's enforce strict correct typing to match the rest of the app's style.
        if (charAdded !== expectedChar) {
            return;
        }
      }
      setTyped(value);
    } else {
      setTyped(value);
    }
  };

  const handleClick = () => {
    inputRef.current?.focus();
  };

  if (status === 'finished') {
    const minutes = duration / 60;
    const wpm = Math.round((typed.length / 5) / minutes);
    const totalChars = typed.length + mistakes;
    const accuracy = totalChars > 0 ? Math.round((typed.length / totalChars) * 100) : 0;

    return (
      <div className="w-full min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col items-center justify-center p-8">
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white dark:bg-slate-800 p-12 rounded-3xl shadow-xl text-center max-w-lg w-full">
          <Trophy className="w-24 h-24 text-amber-500 mx-auto mb-6" />
          <h2 className="text-4xl font-bold text-slate-800 dark:text-white mb-8">Test Complete!</h2>
          <div className="flex justify-around mb-8">
            <div className="text-center">
              <p className="text-slate-500 dark:text-slate-400 font-medium mb-1">Speed</p>
              <p className="text-5xl font-black text-indigo-600 dark:text-indigo-400">{wpm}</p>
              <p className="text-sm text-slate-400 dark:text-slate-500 font-medium mt-1">WPM</p>
            </div>
            <div className="text-center">
              <p className="text-slate-500 dark:text-slate-400 font-medium mb-1">Accuracy</p>
              <p className="text-5xl font-black text-emerald-500">{accuracy}%</p>
            </div>
          </div>
          <button onClick={onBack} className="bg-indigo-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-indigo-700 transition-colors w-full">
            Back to Dashboard
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col p-8" onClick={handleClick}>
      <div className="max-w-5xl w-full mx-auto">
        <div className="flex items-center justify-between mb-12">
          <button onClick={onBack} className="text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white font-bold flex items-center gap-2">
            <ArrowRight className="rotate-180" /> Back
          </button>
          <div className="flex items-center gap-2 bg-white dark:bg-slate-800 px-6 py-3 rounded-full shadow font-mono text-2xl font-bold text-indigo-600 dark:text-indigo-400">
            <Clock className="w-6 h-6" />
            {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-3xl p-12 shadow-sm relative overflow-hidden font-mono text-2xl leading-relaxed cursor-text select-none">
          {status === 'waiting' && (
            <div className="absolute inset-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center">
              <p className="text-3xl font-bold text-slate-800 dark:text-white mb-4">Start typing to begin</p>
              <p className="text-slate-500 dark:text-slate-400">{duration / 60} Minute Test</p>
            </div>
          )}
          
          <div className="break-words">
            {text.split('').map((char, index) => {
              let colorClass = 'text-slate-400 dark:text-slate-500';
              let isCurrent = false;

              if (index < typed.length) {
                if (typed[index] === char) {
                  colorClass = ninjaMode ? 'text-transparent bg-slate-300 dark:bg-slate-700' : 'text-slate-800 dark:text-white font-medium';
                } else {
                  colorClass = 'text-rose-500 bg-rose-500/20'; // This shouldn't happen with strict typing, but kept for logic
                }
              } else if (index === typed.length) {
                isCurrent = true;
                colorClass = 'text-slate-800 dark:text-white bg-indigo-500/20 dark:bg-indigo-500/40 rounded-sm';
              }

              return (
                <span key={index} className={`${colorClass} ${isCurrent ? 'border-b-2 border-indigo-500 animate-pulse' : ''}`}>
                  {char}
                </span>
              );
            })}
          </div>

          <input 
            ref={inputRef}
            type="text"
            className="absolute opacity-0 pointer-events-none"
            value={typed}
            onChange={handleChange}
            autoFocus
          />
        </div>
      </div>
    </div>
  );
}
