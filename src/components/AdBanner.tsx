import React, { useEffect, useRef } from 'react';

export function AdBanner() {
  const bannerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Avoid re-injecting the script multiple times
    if (bannerRef.current && bannerRef.current.children.length === 0) {
      const conf = document.createElement('script');
      conf.type = 'text/javascript';
      conf.innerHTML = `
        atOptions = {
          'key' : '105a0f16b3c74bda8d03c8d262672877',
          'format' : 'iframe',
          'height' : 90,
          'width' : 728,
          'params' : {}
        };
      `;
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.async = true;
      script.dataset.cfasync = 'false';
      script.src = 'https://pl31159039.profitableratecpmnetwork.com/105a0f16b3c74bda8d03c8d262672877/invoke.js';
      
      bannerRef.current.appendChild(script);
    }
  }, []);

  return (
    <div className="flex justify-center items-center w-full my-6 overflow-hidden min-h-[90px]">
      <div id="container-105a0f16b3c74bda8d03c8d262672877" ref={bannerRef}></div>
    </div>
  );
}
