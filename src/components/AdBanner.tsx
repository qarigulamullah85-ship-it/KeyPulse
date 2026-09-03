import React from 'react';

export function AdBanner() {
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
            'key' : '105a0f16b3c74bda8d03c8d262672877',
            'format' : 'iframe',
            'height' : 90,
            'width' : 728,
            'params' : {}
          };
        </script>
        <script type="text/javascript" src="https://pl31159039.profitableratecpmnetwork.com/105a0f16b3c74bda8d03c8d262672877/invoke.js"></script>
      </body>
    </html>
  `;

  return (
    <div className="flex justify-center items-center w-full my-6 overflow-hidden min-h-[90px]">
      <iframe
        srcDoc={html}
        width="728"
        height="90"
        frameBorder="0"
        scrolling="no"
        sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
        title="Ad Banner"
      ></iframe>
    </div>
  );
}
