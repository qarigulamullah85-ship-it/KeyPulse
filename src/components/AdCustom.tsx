import React from 'react';
import { Download, ArrowRight } from 'lucide-react';

export function AdCustom() {
  return (
    <div className="flex justify-center items-center w-full my-6 overflow-hidden">
      <a 
        href="https://universal-thumbnail-downloader.vercel.app/" 
        target="_blank" 
        rel="noopener noreferrer"
        className="block w-full max-w-[728px] hover:opacity-95 transition-opacity rounded-[20px] overflow-hidden shadow-lg hover:shadow-xl relative bg-[#0b1021]"
      >
        <div className="flex items-center justify-between p-5 md:px-8 md:py-6">
          <div className="flex items-center gap-6">
            {/* Icon Box */}
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gradient-to-br from-[#1a2342] to-[#2d1b4e] flex items-center justify-center shadow-inner shrink-0 relative overflow-hidden">
               <div className="absolute inset-0 bg-gradient-to-t from-purple-500/20 to-transparent"></div>
               <Download className="w-8 h-8 md:w-10 md:h-10 text-white relative z-10" strokeWidth={2.5} />
            </div>
            
            {/* Text Content */}
            <div className="flex flex-col justify-center">
              <h3 className="text-white text-xl md:text-3xl font-bold leading-tight tracking-tight">
                Download <span className="text-[#a855f7]">ANY</span><br className="hidden md:block" />
                Thumbnail in <span className="text-[#a855f7]">HD</span>
              </h3>
              <div className="flex items-center gap-2 mt-2 text-sm md:text-base text-gray-400 font-medium">
                <span>Fast</span>
                <span className="text-[#a855f7]">•</span>
                <span>Free</span>
                <span className="text-[#a855f7]">•</span>
                <span>High Quality</span>
              </div>
            </div>
          </div>

          {/* Button */}
          <div className="hidden sm:flex items-center justify-center bg-gradient-to-r from-[#9333ea] to-[#c026d3] hover:from-[#a855f7] hover:to-[#d946ef] text-white font-bold py-3 px-6 rounded-xl transition-all shadow-[0_4px_14px_rgba(168,85,247,0.4)] whitespace-nowrap gap-2">
            Get Thumbnail <ArrowRight className="w-5 h-5" strokeWidth={2.5} />
          </div>
        </div>
      </a>
    </div>
  );
}
