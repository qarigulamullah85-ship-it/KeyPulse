import React from 'react';

export type KeyboardStyle = 'standard' | 'glass' | 'classic' | 'modern' | 'colorful';

interface VirtualKeyboardProps {
  activeChar: string;
  styleName?: KeyboardStyle;
}

const keyboardLayout = [
  [
    { char: '`', width: 'w-10' }, { char: '1', width: 'w-10' }, { char: '2', width: 'w-10' }, 
    { char: '3', width: 'w-10' }, { char: '4', width: 'w-10' }, { char: '5', width: 'w-10' }, 
    { char: '6', width: 'w-10' }, { char: '7', width: 'w-10' }, { char: '8', width: 'w-10' }, 
    { char: '9', width: 'w-10' }, { char: '0', width: 'w-10' }, { char: '-', width: 'w-10' }, 
    { char: '=', width: 'w-10' }, { char: 'backspace', width: 'w-20', label: 'backspace' }
  ],
  [
    { char: 'tab', width: 'w-16', label: 'tab' }, { char: 'q', width: 'w-10' }, { char: 'w', width: 'w-10' }, 
    { char: 'e', width: 'w-10' }, { char: 'r', width: 'w-10' }, { char: 't', width: 'w-10' }, 
    { char: 'y', width: 'w-10' }, { char: 'u', width: 'w-10' }, { char: 'i', width: 'w-10' }, 
    { char: 'o', width: 'w-10' }, { char: 'p', width: 'w-10' }, { char: '[', width: 'w-10' }, 
    { char: ']', width: 'w-10' }, { char: '\\', width: 'w-[52px]' }
  ],
  [
    { char: 'caps', width: 'w-20', label: 'caps lock' }, { char: 'a', width: 'w-10' }, { char: 's', width: 'w-10' }, 
    { char: 'd', width: 'w-10' }, { char: 'f', width: 'w-10' }, { char: 'g', width: 'w-10' }, 
    { char: 'h', width: 'w-10' }, { char: 'j', width: 'w-10' }, { char: 'k', width: 'w-10' }, 
    { char: 'l', width: 'w-10' }, { char: ';', width: 'w-10' }, { char: "'", width: 'w-10' }, 
    { char: 'enter', width: 'w-[72px]', label: 'enter' }
  ],
  [
    { char: 'shift1', width: 'w-[104px]', label: 'shift' }, { char: 'z', width: 'w-10' }, { char: 'x', width: 'w-10' }, 
    { char: 'c', width: 'w-10' }, { char: 'v', width: 'w-10' }, { char: 'b', width: 'w-10' }, 
    { char: 'n', width: 'w-10' }, { char: 'm', width: 'w-10' }, { char: ',', width: 'w-10' }, 
    { char: '.', width: 'w-10' }, { char: '/', width: 'w-10' }, { char: 'shift2', width: 'w-24', label: 'shift' }
  ],
  [
    { char: 'ctrl1', width: 'w-12', label: 'control' }, { char: 'opt1', width: 'w-12', label: 'option' }, 
    { char: 'cmd1', width: 'w-12', label: 'command' }, { char: ' ', width: 'w-[320px]', label: 'space' }, 
    { char: 'cmd2', width: 'w-12', label: 'command' }, { char: 'opt2', width: 'w-12', label: 'option' }, 
    { char: 'ctrl2', width: 'w-12', label: 'control' }
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
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-1.5 p-4 rounded-xl items-center pointer-events-none select-none relative z-10">
      {keyboardLayout.map((row, rowIndex) => (
        <div key={rowIndex} className="flex gap-1.5 justify-center w-full">
          {row.map((key) => {
            const isActive = key.char === normalizedChar || (key.char === ' ' && normalizedChar === ' ');
            
            let keyStyle = '';
            
            if (styleName === 'standard') {
              keyStyle = isActive 
                ? 'bg-[#5b95ff] border-[#5b95ff] text-white shadow-[0_0_15px_rgba(91,149,255,0.4)] scale-105 z-10' 
                : 'bg-transparent border-[#4d4d4d] text-[#6b6b6b] border';
            } else if (styleName === 'glass') {
              keyStyle = isActive
                ? 'bg-white/40 border-white/50 text-white backdrop-blur-md shadow-[0_0_20px_rgba(255,255,255,0.4)] scale-105 z-10 border'
                : 'bg-white/5 border-white/10 text-white/50 backdrop-blur-sm border';
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
                key={key.char} 
                className={`
                  ${key.width} h-12 flex items-center justify-center rounded-[4px]
                  transition-all duration-75
                  ${keyStyle}
                `}
              >
                <span className="text-sm font-medium">{key.label || key.char}</span>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
