import React from 'react';

export type KeyboardStyle = 'standard' | 'glass' | 'classic' | 'modern' | 'colorful';

interface VirtualKeyboardProps {
  activeChar: string;
  styleName?: KeyboardStyle;
}

const keyboardLayout = [
  [
    { char: '`', span: 4 }, { char: '1', span: 4 }, { char: '2', span: 4 }, 
    { char: '3', span: 4 }, { char: '4', span: 4 }, { char: '5', span: 4 }, 
    { char: '6', span: 4 }, { char: '7', span: 4 }, { char: '8', span: 4 }, 
    { char: '9', span: 4 }, { char: '0', span: 4 }, { char: '-', span: 4 }, 
    { char: '=', span: 4 }, { char: 'backspace', span: 8, label: 'backspace' }
  ],
  [
    { char: 'tab', span: 6, label: 'tab' }, { char: 'q', span: 4 }, { char: 'w', span: 4 }, 
    { char: 'e', span: 4 }, { char: 'r', span: 4 }, { char: 't', span: 4 }, 
    { char: 'y', span: 4 }, { char: 'u', span: 4 }, { char: 'i', span: 4 }, 
    { char: 'o', span: 4 }, { char: 'p', span: 4 }, { char: '[', span: 4 }, 
    { char: ']', span: 4 }, { char: '\\', span: 6 }
  ],
  [
    { char: 'caps', span: 7, label: 'caps' }, { char: 'a', span: 4 }, { char: 's', span: 4 }, 
    { char: 'd', span: 4 }, { char: 'f', span: 4 }, { char: 'g', span: 4 }, 
    { char: 'h', span: 4 }, { char: 'j', span: 4 }, { char: 'k', span: 4 }, 
    { char: 'l', span: 4 }, { char: ';', span: 4 }, { char: "'", span: 4 }, 
    { char: 'enter', span: 9, label: 'enter' }
  ],
  [
    { char: 'shift1', span: 9, label: 'shift' }, { char: 'z', span: 4 }, { char: 'x', span: 4 }, 
    { char: 'c', span: 4 }, { char: 'v', span: 4 }, { char: 'b', span: 4 }, 
    { char: 'n', span: 4 }, { char: 'm', span: 4 }, { char: ',', span: 4 }, 
    { char: '.', span: 4 }, { char: '/', span: 4 }, { char: 'shift2', span: 11, label: 'shift' }
  ],
  [
    { char: 'ctrl1', span: 5, label: 'ctrl' }, { char: 'win1', span: 5, label: 'win' }, 
    { char: 'alt1', span: 5, label: 'alt' }, { char: ' ', span: 25, label: 'space' }, 
    { char: 'alt2', span: 5, label: 'alt' }, { char: 'win2', span: 5, label: 'win' }, 
    { char: 'menu', span: 5, label: 'menu' }, { char: 'ctrl2', span: 5, label: 'ctrl' }
  ]
];

const getColorClass = (char: string, isActive: boolean) => {
  const c = char.toLowerCase();
  let baseClass = 'bg-[#f5f5f5] text-gray-800 border-b-4 border-gray-300';
  
  if (['`','1','q','a','z'].includes(c)) baseClass = 'bg-[#f48fb1] text-pink-900 border-b-4 border-[#d81b60]';
  else if (['2','w','s','x'].includes(c)) baseClass = 'bg-[#ffb74d] text-orange-900 border-b-4 border-[#f57c00]';
  else if (['3','e','d','c'].includes(c)) baseClass = 'bg-[#81c784] text-green-900 border-b-4 border-[#388e3c]';
  else if (['4','5','r','t','f','g','v','b'].includes(c)) baseClass = 'bg-[#64b5f6] text-blue-900 border-b-4 border-[#1976d2]';
  else if (['6','7','y','u','h','j','n','m'].includes(c)) baseClass = 'bg-[#ba68c8] text-purple-900 border-b-4 border-[#8e24aa]';
  else if (['8','i','k',','].includes(c)) baseClass = 'bg-[#fff176] text-yellow-900 border-b-4 border-[#fbc02d]';
  else if (['9','o','l','.'].includes(c)) baseClass = 'bg-[#ff8a65] text-red-900 border-b-4 border-[#e64a19]';
  else if (['0','-','=','p','[',']','\\',';',"'",'/','backspace','enter'].includes(c)) baseClass = 'bg-[#f48fb1] text-pink-900 border-b-4 border-[#d81b60]';

  return isActive ? `${baseClass} brightness-110 translate-y-[2px] border-b-2` : baseClass;
};

export function VirtualKeyboard({ activeChar, styleName = 'standard' }: VirtualKeyboardProps) {
  const normalizedChar = activeChar?.toLowerCase() || '';

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-1.5 p-4 rounded-xl pointer-events-none select-none relative z-10">
      {keyboardLayout.map((row, rowIndex) => (
        <div key={rowIndex} className="grid gap-1.5 w-full" style={{ gridTemplateColumns: 'repeat(60, minmax(0, 1fr))' }}>
          {row.map((key, i) => {
            const isActive = key.char === normalizedChar || (key.char === ' ' && normalizedChar === ' ');
            
            let keyStyle = '';
            
            if (styleName === 'standard') {
              keyStyle = isActive 
                ? 'bg-[#5b95ff] border-[#5b95ff] text-white shadow-[0_0_15px_rgba(91,149,255,0.4)] scale-105 z-10 border-b-0 translate-y-[2px]' 
                : 'bg-transparent border-[#4d4d4d] text-[#6b6b6b] border border-b-[3px]';
            } else if (styleName === 'glass') {
              keyStyle = isActive
                ? 'bg-white/40 border-white/50 text-white backdrop-blur-md shadow-[0_0_20px_rgba(255,255,255,0.4)] scale-105 z-10 border border-b-0 translate-y-[2px]'
                : 'bg-white/5 border-white/10 text-white/50 backdrop-blur-sm border border-b-[3px]';
            } else if (styleName === 'modern') {
              keyStyle = isActive
                ? 'bg-blue-500 text-white shadow-lg scale-105 z-10 rounded-lg border-none'
                : 'bg-[#2a2a2d] text-gray-400 rounded-lg border-none shadow-inner';
            } else if (styleName === 'classic') {
              keyStyle = isActive
                ? 'bg-gray-300 text-black border-b-0 translate-y-[4px]'
                : 'bg-gray-100 text-gray-700 border-b-4 border-gray-300';
            } else if (styleName === 'colorful') {
              keyStyle = getColorClass(key.char, isActive);
            }
            
            return (
              <div 
                key={i} 
                className={`
                  h-12 sm:h-14 flex items-center justify-center rounded-[4px]
                  transition-all duration-75
                  ${keyStyle}
                `}
                style={{ gridColumn: `span ${key.span}` }}
              >
                <span className="text-xs sm:text-sm font-medium uppercase tracking-wider">{key.label || key.char}</span>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
