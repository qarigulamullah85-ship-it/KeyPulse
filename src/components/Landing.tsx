import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../i18n';
import { AdBanner } from './AdBanner';
import { Globe } from 'lucide-react';

interface LandingProps {
  onStart: () => void;
}

export function Landing({ onStart }: LandingProps) {
  const { language, setLanguage } = useLanguage();
  const [isStarting, setIsStarting] = useState(false);
  const [textIndex, setTextIndex] = useState(0);
  
  const fullText = "Learn Touch Typing for free!";

  useEffect(() => {
    if (textIndex < fullText.length) {
      const timeout = setTimeout(() => {
        setTextIndex(textIndex + 1);
      }, 80);
      return () => clearTimeout(timeout);
    }
  }, [textIndex, fullText.length]);

  const handleStart = () => {
    setIsStarting(true);
    setTimeout(() => {
      onStart();
    }, 2000); // 2 seconds animation before opening
  };

  return (
    <div className="min-h-screen bg-[#0F172A] relative overflow-hidden flex flex-col font-sans">
      {/* Night Sky Background elements */}
      <div className="absolute inset-0 z-0">
        {/* Stars */}
        {[...Array(60)].map((_, i) => (
          <div 
            key={i} 
            className="absolute bg-white rounded-full opacity-60 animate-pulse"
            style={{
              width: Math.random() * 3 + 'px',
              height: Math.random() * 3 + 'px',
              top: Math.random() * 70 + '%',
              left: Math.random() * 100 + '%',
              animationDuration: (Math.random() * 3 + 2) + 's',
              animationDelay: Math.random() * 2 + 's',
            }}
          />
        ))}
        {/* Moon */}
        <div className="absolute top-[15%] left-[10%] w-32 h-32 md:w-48 md:h-48 bg-blue-100 rounded-full shadow-[0_0_80px_20px_rgba(255,255,255,0.15)] opacity-90 flex items-center justify-center overflow-hidden">
           <div className="w-full h-full rounded-full bg-gradient-to-br from-blue-50 to-blue-200 shadow-inner relative">
             <div className="absolute top-1/4 left-1/4 w-8 h-8 bg-blue-200/50 rounded-full shadow-inner blur-[1px]" />
             <div className="absolute top-1/2 left-2/3 w-12 h-12 bg-blue-200/40 rounded-full shadow-inner blur-[1px]" />
             <div className="absolute bottom-1/4 left-1/3 w-6 h-6 bg-blue-200/60 rounded-full shadow-inner blur-[1px]" />
           </div>
        </div>
        
        {/* Clouds at the bottom */}
        <div className="absolute bottom-0 left-0 w-full h-[30vh] bg-gradient-to-t from-white/20 to-transparent pointer-events-none" />
        <div className="absolute -bottom-20 left-0 w-full flex space-x-[-5%] overflow-hidden opacity-40 pointer-events-none">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="w-64 h-64 bg-white rounded-full shrink-0 mt-20 blur-md" />
          ))}
        </div>
      </div>

      {/* Language Selector */}
      <div className="absolute top-6 right-6 z-20">
        <div className="relative group flex items-center bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20 hover:bg-white/20 transition-colors">
           <Globe className="w-4 h-4 mr-2 text-white" />
          <select 
            className="bg-transparent text-white outline-none cursor-pointer appearance-none pr-4 font-medium text-sm"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            <option value="en" className="text-gray-900">English</option>
            <option value="es" className="text-gray-900">Español</option>
            <option value="ur" className="text-gray-900">اردو (Urdu)</option>
          </select>
          <span className="absolute right-3 pointer-events-none text-[10px] text-white">▼</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center relative z-10 px-6">
        <AnimatePresence mode="wait">
          {!isStarting ? (
            <motion.div
              key="content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center text-center"
            >
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-semibold text-white mb-12 min-h-[80px] md:min-h-[100px] flex items-center tracking-tight">
                {fullText.substring(0, textIndex)}
                <span className="inline-block w-[3px] h-10 md:h-16 lg:h-16 bg-white ml-1 animate-pulse" />
              </h1>
              
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2.5 }}
                onClick={handleStart}
                className="bg-white text-slate-900 px-12 py-4 rounded-lg font-bold text-lg hover:bg-blue-50 transition-all hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(255,255,255,0.3)] ring-4 ring-white/20"
              >
                Get Started
              </motion.button>
            </motion.div>
          ) : (
            <motion.div
              key="loader"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.5 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center justify-center"
            >
              {/* Cool rotating cube loading animation */}
              <motion.div 
                animate={{ rotate: 360, borderRadius: ["20%", "50%", "20%"] }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                className="w-20 h-20 bg-blue-400 shadow-[0_0_40px_rgba(96,165,250,0.8)]" 
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Ad Banner */}
      <div className="relative z-20 pb-8 flex justify-center w-full">
        <AdBanner />
      </div>
    </div>
  );
}
