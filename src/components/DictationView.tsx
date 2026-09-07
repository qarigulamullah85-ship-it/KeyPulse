import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Play, Square, Trophy } from 'lucide-react';
import { commonWords } from '../data';

export function DictationView({ onBack }: { onBack: () => void }) {
  const [text, setText] = useState('');
  const [typed, setTyped] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [status, setStatus] = useState<'idle' | 'playing' | 'finished'>('idle');
  
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Generate random sentence
    const words = [];
    for (let i = 0; i < 15; i++) {
      words.push(commonWords[Math.floor(Math.random() * commonWords.length)]);
    }
    setText(words.join(' '));
  }, []);

  const speakText = () => {
    if (!text) return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.85; // slightly slower for dictation
    utterance.onend = () => setIsPlaying(false);
    window.speechSynthesis.speak(utterance);
    setIsPlaying(true);
    if (status === 'idle') setStatus('playing');
    inputRef.current?.focus();
  };

  const stopSpeaking = () => {
    window.speechSynthesis.cancel();
    setIsPlaying(false);
  };

  useEffect(() => {
    return () => stopSpeaking();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (status === 'finished') return;
    const val = e.target.value;
    setTyped(val);
    
    if (val === text) {
      setStatus('finished');
      stopSpeaking();
    }
  };

  if (status === 'finished') {
    return (
      <div className="w-full min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col items-center justify-center p-8">
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white dark:bg-slate-800 p-12 rounded-3xl shadow-xl text-center max-w-lg w-full">
          <Trophy className="w-24 h-24 text-amber-500 mx-auto mb-6" />
          <h2 className="text-4xl font-bold text-slate-800 dark:text-white mb-4">Dictation Complete!</h2>
          <p className="text-slate-500 dark:text-slate-400 mb-8">You successfully transcribed the audio.</p>
          <button onClick={onBack} className="bg-indigo-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-indigo-700 w-full transition-colors">
            Back to Dashboard
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col p-8" onClick={() => inputRef.current?.focus()}>
      <div className="max-w-4xl w-full mx-auto">
        <div className="flex items-center justify-between mb-12">
          <button onClick={onBack} className="text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white font-bold flex items-center gap-2">
            <ArrowLeft /> Back
          </button>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-3xl p-12 shadow-sm relative flex flex-col items-center justify-center min-h-[400px]">
          <button 
            onClick={(e) => { e.stopPropagation(); isPlaying ? stopSpeaking() : speakText(); }}
            className={`w-24 h-24 rounded-full flex items-center justify-center mb-8 transition-colors ${isPlaying ? 'bg-rose-100 text-rose-500' : 'bg-indigo-100 text-indigo-600 hover:bg-indigo-200'}`}
          >
            {isPlaying ? <Square className="w-10 h-10 fill-current" /> : <Play className="w-12 h-12 ml-2 fill-current" />}
          </button>

          <p className="text-slate-500 dark:text-slate-400 text-center mb-8 max-w-md">
            {isPlaying ? "Listen carefully and type what you hear..." : "Click play to hear the sentence. Type exactly what is spoken."}
          </p>

          <div className="w-full relative">
            <input 
              ref={inputRef}
              type="text"
              value={typed}
              onChange={handleChange}
              className="w-full bg-slate-100 dark:bg-slate-700/50 border-2 border-slate-200 dark:border-slate-600 rounded-2xl px-6 py-4 text-2xl font-mono text-slate-800 dark:text-white focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20"
              placeholder="Start typing..."
              autoComplete="off"
              spellCheck="false"
            />
            {typed && (
              <div className="absolute -bottom-10 left-0 w-full text-center text-sm font-mono text-slate-400">
                {typed.length} / {text.length} chars
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
