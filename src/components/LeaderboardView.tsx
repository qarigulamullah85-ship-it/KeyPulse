import React, { useEffect, useState } from 'react';
import { ArrowLeft, Trophy, Medal } from 'lucide-react';
import { db } from '../lib/firebase';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';

interface LeaderboardEntry {
  id: string;
  name: string;
  wpm: number;
  accuracy: number;
}

export function LeaderboardView({ onBack }: { onBack: () => void }) {
  const [leaders, setLeaders] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaders = async () => {
      try {
        const q = query(collection(db, 'users'), orderBy('averageWpm', 'desc'), limit(10));
        const snap = await getDocs(q);
        const data: LeaderboardEntry[] = [];
        snap.forEach(doc => {
          const ud = doc.data();
          if (ud.averageWpm > 0) {
            data.push({
              id: doc.id,
              name: ud.displayName || 'Anonymous Player',
              wpm: ud.averageWpm || 0,
              accuracy: ud.averageAccuracy || 0
            });
          }
        });
        setLeaders(data);
      } catch (e) {
        console.error("Failed to load leaderboard", e);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaders();
  }, []);

  return (
    <div className="w-full min-h-screen bg-[#F0F4F8] p-8 pb-24 overflow-y-auto">
      <button onClick={onBack} className="flex items-center gap-2 text-slate-500 hover:text-slate-800 font-bold mb-8 transition-colors">
        <ArrowLeft className="w-5 h-5" /> Back to Dashboard
      </button>

      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-10">
          <Trophy className="w-12 h-12 text-yellow-500" />
          <h1 className="text-4xl font-black text-slate-800 tracking-tight">Global Leaderboard</h1>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="grid grid-cols-12 bg-slate-50 border-b border-slate-200 p-6 font-bold text-slate-500">
            <div className="col-span-2 text-center">Rank</div>
            <div className="col-span-6">Player Name</div>
            <div className="col-span-2 text-right">Avg WPM</div>
            <div className="col-span-2 text-right">Accuracy</div>
          </div>
          
          {loading ? (
            <div className="p-12 text-center text-slate-400 font-bold text-lg">Loading Top Typists...</div>
          ) : leaders.length === 0 ? (
            <div className="p-12 text-center text-slate-400 font-bold text-lg">No records found yet. Be the first!</div>
          ) : (
            leaders.map((l, i) => (
              <div key={l.id} className="grid grid-cols-12 border-b border-slate-100 p-6 items-center hover:bg-slate-50 transition-colors">
                <div className="col-span-2 flex justify-center">
                  {i === 0 ? <Medal className="text-yellow-400 w-8 h-8" /> : 
                   i === 1 ? <Medal className="text-slate-400 w-8 h-8" /> : 
                   i === 2 ? <Medal className="text-amber-700 w-8 h-8" /> : 
                   <span className="font-bold text-slate-400 text-xl">#{i+1}</span>}
                </div>
                <div className="col-span-6 font-bold text-slate-700 text-lg">{l.name}</div>
                <div className="col-span-2 text-right font-black text-blue-500 text-xl">{l.wpm}</div>
                <div className="col-span-2 text-right font-bold text-slate-500">{l.accuracy}%</div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
