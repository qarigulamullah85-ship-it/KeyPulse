import React, { useRef } from 'react';
import { UserStats } from '../types';
import { X, Printer } from 'lucide-react';

interface CertificateModalProps {
  stats: UserStats;
  onClose: () => void;
  userName: string;
}

export function CertificateModal({ stats, onClose, userName }: CertificateModalProps) {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white max-w-4xl w-full rounded-3xl shadow-2xl overflow-hidden print:w-full print:shadow-none print:rounded-none relative flex flex-col">
        {/* Actions (hidden in print) */}
        <div className="flex items-center justify-end p-4 border-b border-slate-100 print:hidden shrink-0">
          <button onClick={handlePrint} className="mr-4 flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-bold transition-colors">
            <Printer className="w-4 h-4" /> Print / Save as PDF
          </button>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-2">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Certificate Content */}
        <div className="p-12 md:p-20 text-center flex-1 bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] bg-[#fdfbf7] border-[12px] border-[#2C3E50] m-4 md:m-8 relative">
          <div className="absolute inset-0 border-[4px] border-amber-600/20 m-2"></div>
          
          <div className="relative z-10">
            <div className="mb-8">
              <h1 className="text-5xl md:text-6xl font-black text-[#2C3E50] tracking-widest uppercase" style={{ fontFamily: 'Georgia, serif' }}>Certificate</h1>
              <div className="text-xl md:text-2xl font-bold text-amber-700 tracking-[0.3em] uppercase mt-4">Of Achievement</div>
            </div>

            <div className="text-lg text-slate-500 font-medium my-10 italic">This is to certify that</div>

            <div className="text-4xl md:text-5xl font-bold text-slate-800 border-b-2 border-slate-300 pb-2 inline-block px-12 mb-10 capitalize">
              {userName || 'Typing Champion'}
            </div>

            <div className="text-lg text-slate-600 font-medium max-w-2xl mx-auto leading-relaxed mb-12">
              has successfully demonstrated exceptional typing skills on <span className="font-bold text-[#2C3E50]">KeyPulse</span>. 
              With a recorded average speed of <span className="font-bold text-blue-600">{stats.averageWpm} WPM</span> and 
              an accuracy of <span className="font-bold text-emerald-600">{stats.averageAccuracy}%</span> across {stats.completedLessons.length} tests, 
              they have proven their dedication to mastering the keyboard.
            </div>

            <div className="flex justify-between items-end max-w-2xl mx-auto mt-16 px-8">
              <div className="text-center">
                <div className="border-b border-slate-400 w-40 pb-2 mb-2 font-bold italic text-slate-600">{new Date().toLocaleDateString()}</div>
                <div className="text-sm font-bold text-slate-500 uppercase tracking-widest">Date</div>
              </div>
              
              <div className="w-24 h-24 bg-amber-500 rounded-full flex items-center justify-center shadow-lg border-4 border-amber-200">
                <div className="text-white font-black text-xs text-center uppercase tracking-wider">Official<br/>KeyPulse<br/>Seal</div>
              </div>

              <div className="text-center">
                <div className="border-b border-slate-400 w-40 pb-2 mb-2 font-black text-[#2C3E50] text-xl" style={{ fontFamily: 'Brush Script MT, cursive' }}>KeyPulse System</div>
                <div className="text-sm font-bold text-slate-500 uppercase tracking-widest">Issuer</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Print styles block to hide UI elements */}
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          body * {
            visibility: hidden;
          }
          .fixed, .fixed * {
            visibility: visible;
          }
          .fixed {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            padding: 0;
            background: white !important;
          }
        }
      `}} />
    </div>
  );
}
