import React from 'react';

export function AdCustom() {
  return (
    <div className="flex justify-center items-center w-full my-6 overflow-hidden">
      <a 
        href="https://universal-thumbnail-downloader.vercel.app/" 
        target="_blank" 
        rel="noopener noreferrer"
        className="block w-full max-w-[728px] hover:opacity-90 transition-opacity rounded-xl overflow-hidden shadow-sm hover:shadow-md"
      >
        <img 
          src="https://raw.githubusercontent.com/qarigulamullah85-ship/Thumbnail-downloader/main/public/images/ChatGPT_Image_Sep_4__2026__10_35_12_AM-removebg-preview.png" 
          alt="Universal Thumbnail Downloader" 
          className="w-full h-auto object-contain bg-[#111827]"
          onError={(e) => {
            // Fallback content if the image fails to load
            e.currentTarget.style.display = 'none';
            if (e.currentTarget.nextElementSibling) {
              (e.currentTarget.nextElementSibling as HTMLElement).style.display = 'flex';
            }
          }}
        />
        {/* Fallback UI if image doesn't load */}
        <div className="hidden w-full h-[90px] bg-[#111827] text-white flex items-center justify-between px-8">
          <div className="text-xl font-bold">
            Download <span className="text-rose-500">ANY</span> YouTube Thumbnail in <span className="text-rose-500">HD</span>
          </div>
          <div className="bg-rose-600 hover:bg-rose-700 text-white font-bold py-2 px-6 rounded-lg transition-colors flex items-center gap-2">
            Get Thumbnail <span>→</span>
          </div>
        </div>
      </a>
    </div>
  );
}
