import React from 'react';
import { motion } from 'motion/react';

export function HandsGuide({ activeChar }: { activeChar: string }) {
  const getFingerIndex = (char: string) => {
    if (!char) return -1;
    const c = char.toLowerCase();
    if (['`','1','q','a','z'].includes(c)) return 0; // L Pinky
    if (['2','w','s','x'].includes(c)) return 1; // L Ring
    if (['3','e','d','c'].includes(c)) return 2; // L Middle
    if (['4','5','r','t','f','g','v','b'].includes(c)) return 3; // L Index
    if ([' '].includes(c)) return 4; // Thumbs
    if (['6','7','y','u','h','j','n','m'].includes(c)) return 6; // R Index
    if (['8','i','k',','].includes(c)) return 7; // R Middle
    if (['9','o','l','.'].includes(c)) return 8; // R Ring
    if (['0','-','=','p','[',']','\\',';',"'",'/'].includes(c)) return 9; // R Pinky
    return -1;
  };

  const activeIndex = getFingerIndex(activeChar);

  const fingers = [
    { id: 0, height: 'h-16', translate: 'translate-y-6', color: 'bg-[#f48fb1]', label: 'L Pinky' },
    { id: 1, height: 'h-20', translate: 'translate-y-2', color: 'bg-[#ffb74d]', label: 'L Ring' },
    { id: 2, height: 'h-24', translate: 'translate-y-0', color: 'bg-[#81c784]', label: 'L Middle' },
    { id: 3, height: 'h-20', translate: 'translate-y-2', color: 'bg-[#64b5f6]', label: 'L Index' },
    { id: 4, height: 'h-16', translate: 'translate-y-12 rotate-[25deg] translate-x-4', color: 'bg-white/80', label: 'L Thumb' },
    // Gap for space
    { id: 5, height: 'h-16', translate: 'translate-y-12 -rotate-[25deg] -translate-x-4', color: 'bg-white/80', label: 'R Thumb' },
    { id: 6, height: 'h-20', translate: 'translate-y-2', color: 'bg-[#ba68c8]', label: 'R Index' },
    { id: 7, height: 'h-24', translate: 'translate-y-0', color: 'bg-[#fff176]', label: 'R Middle' },
    { id: 8, height: 'h-20', translate: 'translate-y-2', color: 'bg-[#ff8a65]', label: 'R Ring' },
    { id: 9, height: 'h-16', translate: 'translate-y-6', color: 'bg-[#f48fb1]', label: 'R Pinky' },
  ];

  return (
    <div className="flex justify-center items-end gap-1 w-full max-w-lg mx-auto opacity-80 pt-16 pb-4 pointer-events-none">
      <div className="flex gap-[14px] items-end mr-12 relative">
        <div className="absolute -bottom-8 -left-4 w-48 h-24 bg-[#252526]/80 rounded-[40px] -z-10 blur-xl"></div>
        {fingers.slice(0, 5).map(f => {
          const isTarget = activeIndex === f.id || (activeIndex === 4 && f.id === 4);
          return (
            <div 
              key={f.id} 
              className={`w-8 rounded-t-full rounded-b-md transition-all duration-300 ${f.height} ${f.translate} ${
                isTarget 
                  ? f.color + ' shadow-[0_0_20px_rgba(255,255,255,0.9)] scale-110 z-10' 
                  : 'bg-[#444] border border-[#555] shadow-inner'
              }`} 
            />
          );
        })}
      </div>
      <div className="flex gap-[14px] items-end relative">
        <div className="absolute -bottom-8 -right-4 w-48 h-24 bg-[#252526]/80 rounded-[40px] -z-10 blur-xl"></div>
        {fingers.slice(5).map(f => {
          const isTarget = activeIndex === f.id || (activeIndex === 4 && f.id === 5);
          return (
            <div 
              key={f.id} 
              className={`w-8 rounded-t-full rounded-b-md transition-all duration-300 ${f.height} ${f.translate} ${
                isTarget 
                  ? f.color + ' shadow-[0_0_20px_rgba(255,255,255,0.9)] scale-110 z-10' 
                  : 'bg-[#444] border border-[#555] shadow-inner'
              }`} 
            />
          );
        })}
      </div>
    </div>
  );
}
