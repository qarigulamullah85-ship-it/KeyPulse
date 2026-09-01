import { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Lesson } from '../types';
import { useTyping } from '../hooks/useTyping';
import { RotateCcw, ArrowRight, Menu, RotateCw, Keyboard, Hand, Volume2, VolumeX, Settings, X, Check, Star } from 'lucide-react';
import { VirtualKeyboard, KeyboardStyle } from './VirtualKeyboard';
import { HandsGuide } from './HandsGuide';
import { useLanguage } from '../i18n';

interface TypingViewProps {
  lesson: Lesson;
  onComplete: (wpm: number, accuracy: number) => void;
  onBack: () => void;
}

export function TypingView({ lesson, onComplete, onBack }: TypingViewProps) {
  const { t } = useLanguage();
  const [results, setResults] = useState<{wpm: number, accuracy: number, durationSec: number, score: number} | null>(null);
  
  const [showKeyboard, setShowKeyboard] = useState(true);
  const [showHands, setShowHands] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showKeyboardSettings, setShowKeyboardSettings] = useState(false);
  const [kbStyle, setKbStyle] = useState<KeyboardStyle>('standard');
  const audioCtxRef = useRef<AudioContext | null>(null);

  const initAudio = () => {
    if (!audioCtxRef.current) {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContext) {
        audioCtxRef.current = new AudioContext();
      }
    }
  };

  const playSound = useCallback((isCorrect: boolean) => {
    if (!soundEnabled) return;
    try {
      initAudio();
      const ctx = audioCtxRef.current;
      if (!ctx) return;

      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      if (isCorrect) {
        // Authentic mechanical keyboard switch click + bottom out thock
        
        // Thock (low frequency transient)
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(300, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(50, ctx.currentTime + 0.05);

        const oscGain = ctx.createGain();
        oscGain.gain.setValueAtTime(0.4, ctx.currentTime);
        oscGain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05);

        osc.connect(oscGain);
        oscGain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.05);

        // Click (high frequency noise)
        const bufferSize = ctx.sampleRate * 0.04; // 40ms
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = Math.random() * 2 - 1;
        }
        const noise = ctx.createBufferSource();
        noise.buffer = buffer;

        const filter = ctx.createBiquadFilter();
        filter.type = 'highpass';
        filter.frequency.value = 2500 + Math.random() * 500;

        const noiseGain = ctx.createGain();
        noiseGain.gain.setValueAtTime(0.3, ctx.currentTime);
        noiseGain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.04);

        noise.connect(filter);
        filter.connect(noiseGain);
        noiseGain.connect(ctx.destination);
        noise.start();
      } else {
        // Error thud
        const osc = ctx.createOscillator();
        osc.type = 'square';
        osc.frequency.setValueAtTime(150, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.1);
        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.1);
      }
    } catch (e) {
      console.error("Audio playback failed", e);
    }
  }, [soundEnabled]);

  const { cursorIndex, mistakes, status, reset, lastMistakeIndex } = useTyping(lesson.content, (wpm, accuracy, durationSec, score) => {
    setResults({ wpm, accuracy, durationSec, score });
    onComplete(wpm, accuracy);
  }, playSound);

  const chars = lesson.content.split('');

  const kbStyles: {id: KeyboardStyle, name: string, previewClass: string}[] = [
    { id: 'standard', name: 'Standard', previewClass: 'bg-[#333] border border-gray-500 text-gray-300' },
    { id: 'glass', name: 'Glass', previewClass: 'bg-white/20 border-white/40 text-white backdrop-blur' },
    { id: 'modern', name: 'Modern', previewClass: 'bg-blue-500 text-white' },
    { id: 'classic', name: 'Classic', previewClass: 'bg-gray-200 border-b-4 border-gray-400 text-gray-800' },
    { id: 'colorful', name: 'Colorful', previewClass: 'bg-pink-400 border-b-4 border-pink-600 text-white' }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-[#323232] w-full absolute inset-0 z-50 transition-colors duration-300">
      {/* Top Navbar */}
      <nav className="h-14 bg-white dark:bg-[#3e3e42] flex items-center justify-between px-4 border-b border-gray-200 dark:border-[#2d2d30] shadow-sm relative z-50">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="text-gray-500 dark:text-[#8e8e93] hover:text-gray-900 dark:hover:text-white transition-colors">
            <Menu className="w-6 h-6" />
          </button>
          <h1 className="text-gray-800 dark:text-white text-base font-medium">Lesson {lesson.id}: {lesson.title}</h1>
        </div>
        <div className="flex items-center gap-6 text-gray-500 dark:text-[#8e8e93]">
          <button onClick={reset} title="Restart Lesson" className="hover:text-gray-900 dark:hover:text-white transition-colors">
            <RotateCw className="w-5 h-5" />
          </button>
          <button 
            onClick={() => setShowKeyboardSettings(!showKeyboardSettings)} 
            title="Keyboard Settings" 
            className={`${showKeyboardSettings ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-[#8e8e93]'} hover:text-gray-900 dark:hover:text-white transition-colors relative`}
          >
            <Keyboard className="w-5 h-5" />
          </button>
          <button 
            onClick={() => setShowHands(!showHands)} 
            title="Toggle Hands" 
            className={`${showHands ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-[#8e8e93]'} hover:text-gray-900 dark:hover:text-white transition-colors`}
          >
            <Hand className="w-5 h-5" />
          </button>
          <button 
            onClick={() => {
              setSoundEnabled(!soundEnabled);
              initAudio();
            }} 
            title="Toggle Sound" 
            className={`${soundEnabled ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-[#8e8e93]'} hover:text-gray-900 dark:hover:text-white transition-colors`}
          >
            {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </button>
          <button 
            title="Settings" 
            className={`text-gray-500 dark:text-[#8e8e93] hover:text-gray-900 dark:hover:text-white transition-colors`}
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </nav>

      {/* Keyboard Settings Dropdown */}
      <AnimatePresence>
        {showKeyboardSettings && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-14 right-16 bg-white dark:bg-[#333333] border border-gray-200 dark:border-[#444] shadow-2xl rounded-md p-5 w-[380px] z-50 text-gray-900 dark:text-white"
          >
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100 dark:border-[#444]">
              <span className="font-medium text-sm text-gray-800 dark:text-gray-200">Keyboard Guide</span>
              <button 
                onClick={() => setShowKeyboard(!showKeyboard)}
                className={`w-10 h-5 rounded-full relative transition-colors ${showKeyboard ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'}`}
              >
                <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform ${showKeyboard ? 'left-5' : 'left-1'}`}></div>
              </button>
            </div>
            
            <div className="mb-4 flex justify-between items-center text-sm">
              <span className="font-medium text-gray-800 dark:text-gray-200">Keyboard Layout</span>
              <span className="text-gray-500 dark:text-gray-400 flex items-center gap-1 text-xs"><Keyboard className="w-3 h-3"/> United States</span>
            </div>

            <div className="grid grid-cols-3 gap-4 mt-6">
              {kbStyles.map(style => (
                <div 
                  key={style.id} 
                  onClick={() => setKbStyle(style.id)}
                  className="flex flex-col items-center gap-2 cursor-pointer group"
                >
                  <div className={`w-16 h-12 rounded flex items-center justify-center text-xs font-bold ${style.previewClass} ${kbStyle === style.id ? 'ring-2 ring-blue-500 ring-offset-2 ring-offset-white dark:ring-offset-[#333]' : ''}`}>
                    Q W <br/> A S
                  </div>
                  <span className={`text-xs ${kbStyle === style.id ? 'text-blue-500 dark:text-blue-400 font-bold' : 'text-gray-500 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-200'}`}>
                    {style.name}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Typing Area */}
      <div className="flex-1 relative flex flex-col items-center pt-24 pb-8 overflow-hidden">
        
        {/* START TYPING Vertical Ribbon */}
        {status === 'waiting' && (
          <div className="absolute left-[8%] md:left-[15%] top-0 bg-[#8c52ff] w-16 h-32 rounded-b-md flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-sm tracking-[0.2em] transform -rotate-90 whitespace-nowrap leading-none mt-4">
              {t('startTyping')}
            </span>
          </div>
        )}

        {/* Text Container */}
        <div className="max-w-3xl w-full px-8 relative z-20 mb-16">
          <div className="text-[32px] sm:text-[40px] leading-[1.8] font-mono tracking-[0.1em] text-gray-400 dark:text-[#6b6b6b] flex flex-wrap gap-x-[2px]">
            {chars.map((char, index) => {
              const isCompleted = index < cursorIndex;
              const isCurrent = index === cursorIndex;
              const isMistake = index === lastMistakeIndex;

              let colorClass = 'text-gray-400 dark:text-[#6b6b6b]'; // Upcoming
              let bgClass = 'bg-transparent';

              if (isCompleted) {
                colorClass = 'text-gray-600 dark:text-[#555555]'; // Typed correctly
              }
              if (isCurrent) {
                colorClass = 'text-gray-900 dark:text-white'; // Current character
                bgClass = 'bg-blue-200 dark:bg-[#5b95ff] dark:shadow-[0_0_10px_rgba(91,149,255,0.3)]';
              }
              if (isMistake) {
                colorClass = 'text-white';
                bgClass = 'bg-red-500'; // Mistake
              }

              // Special handling for space character to ensure the background is visible
              if (char === ' ') {
                return (
                  <span key={index} className={`inline-block ${bgClass} rounded-sm transition-colors duration-75`} style={{ width: '0.6em', height: '1.2em', verticalAlign: 'middle' }}>
                  </span>
                );
              }

              return (
                <span key={index} className={`inline-block ${colorClass} ${bgClass} rounded-sm transition-colors duration-75 px-1 -mx-1`}>
                  {char}
                </span>
              );
            })}
          </div>
          {/* Subtle bottom line separator */}
          <div className="w-full h-px bg-gray-300 dark:bg-[#444] mt-8"></div>
        </div>

        {/* Virtual Keyboard */}
        <AnimatePresence>
          {showKeyboard && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="mt-auto mb-10 opacity-80 relative w-full flex justify-center"
            >
              {showHands && (
                <div className="absolute bottom-16 w-full z-20 pointer-events-none">
                  <HandsGuide activeChar={status !== 'finished' ? lesson.content[cursorIndex] : ''} />
                </div>
              )}
              
              <div className="relative z-10 w-auto">
                <VirtualKeyboard activeChar={status !== 'finished' ? lesson.content[cursorIndex] : ''} styleName={kbStyle} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Completion Modal */}
      <AnimatePresence>
        {status === 'finished' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-50 flex flex-col justify-between bg-[#3f6385] text-white overflow-hidden font-sans"
          >
            <div className="flex-1 flex flex-col items-center justify-center pt-10">
              
              {/* Stars Arch */}
              <div className="flex justify-center items-end gap-3 mb-12 h-20">
                {[1, 2, 3, 4, 5].map((starIndex) => {
                  let earnedStars = 1;
                  const w = results?.wpm || 0;
                  const a = results?.accuracy || 0;
                  if (a >= 98 && w >= 30) earnedStars = 5;
                  else if (a >= 95 && w >= 20) earnedStars = 4;
                  else if (a >= 90) earnedStars = 3;
                  else if (a >= 80) earnedStars = 2;
                  
                  // Arch calculation
                  const translateY = starIndex === 3 ? '0px' : (starIndex === 2 || starIndex === 4) ? '12px' : '32px';
                  const rotate = starIndex === 3 ? '0deg' : starIndex === 2 ? '-10deg' : starIndex === 4 ? '10deg' : starIndex === 1 ? '-20deg' : '20deg';

                  return (
                    <motion.div
                      key={starIndex}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.1 * starIndex, type: 'spring' }}
                      style={{ transform: `translateY(${translateY}) rotate(${rotate})` }}
                    >
                      <Star 
                        className={`w-12 h-12 ${starIndex <= earnedStars ? 'text-white fill-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.2)]' : 'text-white/20 fill-white/20'}`} 
                      />
                    </motion.div>
                  );
                })}
              </div>

              {/* Dials Container */}
              <div className="flex items-center justify-center gap-12 mb-16">
                
                {/* Accuracy Dial */}
                <div className="flex flex-col items-center">
                  <div className="relative w-48 h-48 flex items-center justify-center">
                    <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                      <circle cx="96" cy="96" r="88" stroke="rgba(255,255,255,0.1)" strokeWidth="4" fill="none" />
                      <circle cx="96" cy="96" r="88" stroke="#fbc02d" strokeWidth="4" fill="none" strokeDasharray="552.9" strokeDashoffset={552.9 - (552.9 * (results?.accuracy || 0) / 100)} className="transition-all duration-1000 ease-out" />
                      
                      <circle cx="96" cy="96" r="76" stroke="rgba(255,255,255,0.1)" strokeWidth="2" strokeDasharray="4 6" fill="none" />
                      <circle cx="96" cy="96" r="76" stroke="#fbc02d" strokeWidth="2" strokeDasharray="4 6" fill="none" strokeDashoffset={477.5 - (477.5 * (results?.accuracy || 0) / 100)} className="transition-all duration-1000 ease-out" />
                    </svg>
                    <div className="text-center z-10">
                      <div className="text-5xl font-black tracking-tighter">{results?.accuracy || 0}<span className="text-3xl">%</span></div>
                      <div className="text-xs font-bold uppercase tracking-wider text-white/80 mt-1">{t('realAccuracy')}</div>
                      <div className="text-sm font-bold mt-1">{results?.accuracy || 0}%</div>
                    </div>
                  </div>
                  <div className="mt-4 text-lg font-bold tracking-wide text-white/90">{t('accuracy')}</div>
                </div>

                {/* Duration Dial */}
                <div className="flex flex-col items-center -mt-8">
                  <div className="relative w-40 h-40 flex items-center justify-center">
                    <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                      <circle cx="80" cy="80" r="72" stroke="rgba(255,255,255,0.1)" strokeWidth="16" fill="none" strokeDasharray="2 8" />
                      <circle cx="80" cy="80" r="72" stroke="#5b95ff" strokeWidth="16" fill="none" strokeDasharray="2 8" className="transition-all duration-1000" />
                    </svg>
                    <div className="text-center z-10">
                      <div className="text-4xl font-black tracking-tighter">
                        {Math.floor((results?.durationSec || 0) / 60)}:{(results?.durationSec || 0) % 60 < 10 ? '0' : ''}{(results?.durationSec || 0) % 60}
                      </div>
                      <div className="text-[10px] font-bold uppercase tracking-wider text-white/60 mt-1">min : seconds</div>
                    </div>
                  </div>
                  <div className="mt-6 text-lg font-bold tracking-wide text-white/90">{t('duration')}</div>
                  
                  {/* Score */}
                  <div className="mt-8 text-center border-t border-white/20 pt-4 w-48 relative">
                    <div className="text-5xl font-black mb-1 drop-shadow-md">{results?.score || 0}</div>
                    <div className="text-[10px] font-bold tracking-widest uppercase text-white/80">{t('newHighscore')}</div>
                  </div>
                </div>

                {/* Speed Dial */}
                <div className="flex flex-col items-center relative">
                  <div className="absolute -right-24 top-1/2 -translate-y-1/2 text-left">
                    <div className="text-sm font-bold text-white/80">10 wpm</div>
                    <div className="text-[10px] text-white/50 whitespace-nowrap">Requirement: 3 wpm</div>
                  </div>
                  <div className="relative w-48 h-48 flex items-center justify-center">
                    <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                      <circle cx="96" cy="96" r="88" stroke="rgba(255,255,255,0.1)" strokeWidth="4" fill="none" />
                      <circle cx="96" cy="96" r="88" stroke="#fbc02d" strokeWidth="4" fill="none" strokeDasharray="552.9" strokeDashoffset={552.9 - (552.9 * Math.min((results?.wpm || 0) / 100, 1))} className="transition-all duration-1000 ease-out" />
                      
                      <circle cx="96" cy="96" r="76" stroke="rgba(255,255,255,0.1)" strokeWidth="12" fill="none" />
                      <circle cx="96" cy="96" r="76" stroke="#e57373" strokeWidth="12" fill="none" strokeDasharray="477.5" strokeDashoffset={477.5 - (477.5 * Math.min((results?.wpm || 0) / 100, 1))} className="transition-all duration-1000 ease-out" />
                      <circle cx="96" cy="96" r="76" stroke="rgba(255,255,255,0.2)" strokeWidth="12" strokeDasharray="2 10" fill="none" />
                    </svg>
                    <div className="text-center z-10">
                      <div className="text-6xl font-black tracking-tighter leading-none">{results?.wpm || 0}</div>
                      <div className="text-sm font-bold uppercase tracking-wider text-white/80 mt-1">wpm</div>
                    </div>
                  </div>
                  <div className="mt-4 text-lg font-bold tracking-wide text-white/90">{t('speed')}</div>
                </div>

              </div>
            </div>

            {/* Bottom Bar */}
            <div className="h-20 bg-white dark:bg-[#252526] w-full flex items-center justify-between px-12 text-gray-500 dark:text-[#888] shrink-0">
              <button 
                onClick={reset}
                className="px-8 py-2.5 bg-gray-100 dark:bg-[#333] hover:bg-gray-200 dark:hover:bg-[#444] border border-gray-200 dark:border-[#444] text-gray-600 dark:text-[#aaa] rounded-full font-medium transition-colors text-sm"
              >
                {t('retry')}
              </button>
              <div className="text-sm font-medium text-gray-500 dark:text-[#888]">
                {t('goodWork')}
              </div>
              <button 
                onClick={onBack}
                className="px-10 py-2.5 bg-emerald-500 dark:bg-[#6bcf8a] hover:bg-emerald-600 dark:hover:bg-[#5bbf7a] text-white rounded-full font-medium transition-colors flex items-center justify-center shadow-sm"
              >
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
