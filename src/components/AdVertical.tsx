import React, { useEffect, useRef } from 'react';

export function AdVertical() {
  const adRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Avoid re-injecting the script multiple times
    if (adRef.current && adRef.current.children.length === 0) {
      const conf = document.createElement('script');
      conf.type = 'text/javascript';
      conf.innerHTML = `
        atOptions = {
          'key' : '2a631e3d3784ad074208b9ad12afeb08',
          'format' : 'iframe',
          'height' : 300,
          'width' : 160,
          'params' : {}
        };
      `;
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = 'https://www.highrevenueformat.com/2a631e3d3784ad074208b9ad12afeb08/invoke.js';
      
      adRef.current.appendChild(conf);
      adRef.current.appendChild(script);
    }
  }, []);

  return (
    <div className="w-[160px] h-[300px] overflow-hidden flex items-center justify-center bg-gray-50 dark:bg-[#323232]" ref={adRef}></div>
  );
}
