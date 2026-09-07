import React, { useState } from 'react';
import { UserStats } from '../types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useLanguage } from '../i18n';
import { ArrowLeft, Award, TrendingUp, Target, Printer } from 'lucide-react';
import { CertificateModal } from './CertificateModal';
import { auth } from '../lib/firebase';

interface StatsViewProps {
  stats: UserStats;
  onBack: () => void;
}

export function StatsView({ stats, onBack }: StatsViewProps) {
  const { t } = useLanguage();
  const [showCertificate, setShowCertificate] = useState(false);
  
  const historyData = stats.history.map((h, i) => ({
    name: `Test ${i + 1}`,
    wpm: h.wpm,
    accuracy: h.accuracy
  })).slice(-20); // Show last 20 tests

  return (
    <div className="w-full min-h-screen bg-[#F0F4F8] p-8 pb-24 overflow-y-auto">
      <div className="flex justify-between items-center mb-8">
        <button onClick={onBack} className="flex items-center gap-2 text-slate-500 hover:text-slate-800 font-bold transition-colors">
          <ArrowLeft className="w-5 h-5" /> Back to Dashboard
        </button>
        {stats.completedLessons.length > 0 && (
          <button 
            onClick={() => setShowCertificate(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white px-6 py-2.5 rounded-xl font-bold shadow-sm transition-all"
          >
            <Printer className="w-4 h-4" /> Get Certificate
          </button>
        )}
      </div>

      {showCertificate && (
        <CertificateModal 
          stats={stats} 
          userName={auth.currentUser?.displayName || 'Typing Champion'} 
          onClose={() => setShowCertificate(false)} 
        />
      )}

      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-black text-slate-800 mb-8 tracking-tight">Your Progress</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <div className="flex items-center gap-4 mb-2">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div className="text-slate-500 font-bold">Avg. Speed</div>
            </div>
            <div className="text-4xl font-black text-slate-800">{stats.averageWpm} <span className="text-lg text-slate-400">WPM</span></div>
          </div>
          
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <div className="flex items-center gap-4 mb-2">
              <div className="w-12 h-12 bg-rose-100 rounded-xl flex items-center justify-center text-rose-600">
                <Target className="w-6 h-6" />
              </div>
              <div className="text-slate-500 font-bold">Avg. Accuracy</div>
            </div>
            <div className="text-4xl font-black text-slate-800">{stats.averageAccuracy}%</div>
          </div>
          
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <div className="flex items-center gap-4 mb-2">
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600">
                <Award className="w-6 h-6" />
              </div>
              <div className="text-slate-500 font-bold">Lessons Completed</div>
            </div>
            <div className="text-4xl font-black text-slate-800">{stats.completedLessons.length}</div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 mb-12">
          <h2 className="text-2xl font-bold text-slate-800 mb-8">Speed History (WPM)</h2>
          <div className="w-full h-80">
            {historyData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={historyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Line type="monotone" dataKey="wpm" stroke="#3b82f6" strokeWidth={4} dot={{ r: 4, fill: '#3b82f6', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-400 font-bold">
                Complete some lessons to see your graph!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
