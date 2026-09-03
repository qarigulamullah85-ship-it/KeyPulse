import React from 'react';

export function AdVertical() {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { margin: 0; padding: 0; display: flex; justify-content: center; align-items: center; background: transparent; }
        </style>
      </head>
      <body>
        <script>
          atOptions = {
            'key' : '2a631e3d3784ad074208b9ad12afeb08',
            'format' : 'iframe',
            'height' : 300,
            'width' : 160,
            'params' : {}
          };
        </script>
        <script src="https://www.highrevenueformat.com/2a631e3d3784ad074208b9ad12afeb08/invoke.js"></script>
      </body>
    </html>
  `;

  return (
    <div className="w-[160px] h-[300px] overflow-hidden flex items-center justify-center bg-gray-50 dark:bg-[#323232]">
      <iframe
        srcDoc={html}
        width="160"
        height="300"
        frameBorder="0"
        scrolling="no"
        sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
        title="Ad"
      ></iframe>
    </div>
  );
}
