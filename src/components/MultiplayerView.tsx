import React, { useState, useEffect } from 'react';
import { ArrowLeft, Flag } from 'lucide-react';
import { useTyping } from '../hooks/useTyping';
import { motion, AnimatePresence } from 'motion/react';
import { auth } from '../lib/firebase';

const RACE_TEXT = "The quick brown fox jumps over the lazy dog. Typing races are a fun way to improve your speed and accuracy while competing with others in real time.";

export function MultiplayerView({ onBack }: { onBack: () => void }) {
  const [countdown, setCountdown] = useState(3);
  const [raceStarted, setRaceStarted] = useState(false);
  const [bots, setBots] = useState([
    { id: 1, name: 'TypoBot 3000', progress: 0, speed: 45 },
    { id: 2, name: 'SpeedyFingers', progress: 0, speed: 60 },
    { id: 3, name: 'KeyboardNinja', progress: 0, speed: 30 },
  ]);

  const { cursorIndex, status, lastMistakeIndex, mistakes } = useTyping(
    RACE_TEXT,
    (wpm) => {
      // Finished
    }
  );

  const playerProgress = Math.min(100, Math.round((cursorIndex / RACE_TEXT.length) * 100));

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(c => c - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0 && !raceStarted) {
      setRaceStarted(true);
    }
  }, [countdown, raceStarted]);

  // Bot movement
  useEffect(() => {
    if (!raceStarted) return;
    
    const interval = setInterval(() => {
      setBots(prevBots => prevBots.map(bot => {
        // Calculate progress step based on speed (wpm roughly translates to characters per second)
        // 60 wpm = ~5 chars per sec. RACE_TEXT is ~150 chars.
        const charsPerSec = (bot.speed * 5) / 60;
        const progressPerSec = (charsPerSec / RACE_TEXT.length) * 100;
        // Updating every 200ms
        const step = progressPerSec / 5 + (Math.random() * 0.5 - 0.2); // slight variance
        
        return {
          ...bot,
          progress: Math.min(100, bot.progress + step)
        };
      }));
    }, 200);

    return () => clearInterval(interval);
  }, [raceStarted]);

  return (
    <div className="w-full min-h-screen bg-slate-900 text-white p-8 flex flex-col">
      <button onClick={onBack} className="flex items-center gap-2 text-slate-400 hover:text-white font-bold mb-8 transition-colors self-start z-10">
        <ArrowLeft className="w-5 h-5" /> Leave Race
      </button>

      <div className="max-w-4xl mx-auto w-full flex-1 flex flex-col">
        <div className="flex items-center justify-between mb-12">
          <h1 className="text-4xl font-black flex items-center gap-4">
            <Flag className="w-10 h-10 text-rose-500" /> 
            Pro Circuit Race
          </h1>
          <div className="text-2xl font-mono text-slate-400">
            {countdown > 0 ? `Starts in ${countdown}...` : 'GO!'}
          </div>
        </div>

        {/* Racing Tracks */}
        <div className="space-y-6 mb-12">
          {/* Player Track */}
          <div className="relative h-16 bg-slate-800 rounded-2xl p-2 border border-blue-500/30 overflow-hidden">
            <div className="absolute inset-y-0 right-12 w-2 bg-gradient-to-b from-white to-transparent opacity-20"></div> {/* Finish line */}
            
            <motion.div 
              className="absolute h-12 w-12 bg-blue-500 rounded-xl shadow-[0_0_20px_rgba(59,130,246,0.5)] flex items-center justify-center font-bold text-xs"
              animate={{ left: `calc(${playerProgress}% - 48px + 10px)` }}
              transition={{ type: 'spring', bounce: 0, duration: 0.1 }}
              style={{ left: 10 }}
            >
              You
            </motion.div>
          </div>

          {/* Bot Tracks */}
          {bots.map((bot, i) => (
            <div key={bot.id} className="relative h-12 bg-slate-800/50 rounded-xl p-2 overflow-hidden">
              <div className="absolute inset-y-0 right-12 w-2 bg-gradient-to-b from-white to-transparent opacity-10"></div>
              
              <motion.div 
                className={`absolute h-8 px-3 rounded-lg shadow-md flex items-center justify-center font-bold text-xs truncate ${i === 0 ? 'bg-rose-500' : i === 1 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                animate={{ left: `calc(${bot.progress}% - 80px + 10px)` }}
                transition={{ type: 'tween', ease: 'linear', duration: 0.2 }}
                style={{ left: 10, width: 80 }}
              >
                {bot.name}
              </motion.div>
            </div>
          ))}
        </div>

        {/* Typing Area */}
        <div className="bg-slate-800 p-8 rounded-3xl border border-slate-700 shadow-2xl relative">
          {!raceStarted && (
            <div className="absolute inset-0 z-10 bg-slate-900/50 rounded-3xl flex items-center justify-center backdrop-blur-sm">
              <div className="text-6xl font-black text-white drop-shadow-2xl">{countdown}</div>
            </div>
          )}
          
          <div className="text-3xl font-mono leading-relaxed text-slate-500">
            {RACE_TEXT.split('').map((char, index) => {
              let colorClass = 'text-slate-500';
              if (index < cursorIndex) colorClass = 'text-white';
              if (index === lastMistakeIndex) colorClass = 'text-rose-500 bg-rose-500/20 rounded';
              
              return (
                <span key={index} className={`${colorClass} ${index === cursorIndex && raceStarted ? 'border-b-4 border-blue-500 animate-pulse' : ''}`}>
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
