import React, { useState, useEffect } from 'react';
import { ArrowLeft, Users, Play, Copy, Check } from 'lucide-react';
import { db, auth } from '../lib/firebase';
import { doc, getDoc, setDoc, onSnapshot, updateDoc, serverTimestamp , collection } from 'firebase/firestore';
import { useTyping } from '../hooks/useTyping';
import { motion } from 'motion/react';
import { commonWords } from '../data';

function generateRaceText() {
  const words = [];
  for (let i = 0; i < 25; i++) {
    words.push(commonWords[Math.floor(Math.random() * commonWords.length)]);
  }
  return words.join(' ');
}

export function PrivateRoomView({ onBack }: { onBack: () => void }) {
  const [roomId, setRoomId] = useState('');
  const [joinId, setJoinId] = useState('');
  const [inRoom, setInRoom] = useState(false);
  const [roomData, setRoomData] = useState<any>(null);
  const [players, setPlayers] = useState<any[]>([]);
  const [copied, setCopied] = useState(false);

  const user = auth.currentUser;
  
  const { cursorIndex, status, mistakes, lastMistakeIndex, reset } = useTyping(
    roomData?.text || "Waiting for race to start...",
    (wpm) => {
      if (inRoom && roomId && user) {
        updateDoc(doc(db, `rooms/${roomId}/players`, user.uid), {
          progress: 100,
          wpm,
          finished: true
        });
      }
    }
  );

  // Sync player progress
  useEffect(() => {
    if (inRoom && roomId && user && roomData?.status === 'playing' && status !== 'finished') {
      const progress = Math.min(100, Math.round((cursorIndex / roomData.text.length) * 100));
      updateDoc(doc(db, `rooms/${roomId}/players`, user.uid), {
        progress
      }).catch(e => console.error(e));
    }
  }, [cursorIndex, inRoom, roomId, user, roomData?.status, status]);

  // Listen to room & players
  useEffect(() => {
    if (!inRoom || !roomId) return;
    
    const unsubRoom = onSnapshot(doc(db, 'rooms', roomId), (docSnap) => {
      if (docSnap.exists()) {
        setRoomData(docSnap.data());
      } else {
        onBack(); // Room closed
      }
    });

    return () => { unsubRoom(); };
  }, [inRoom, roomId]);
  
  // More robust player listener
  useEffect(() => {
    if (!inRoom || !roomId) return;
    import('firebase/firestore').then(({ collection, onSnapshot }) => {
      const unsub = onSnapshot(collection(db, `rooms/${roomId}/players`), (snap) => {
        const p: any[] = [];
        snap.forEach(d => p.push({ id: d.id, ...d.data() }));
        setPlayers(p);
      });
      return () => unsub();
    });
  }, [inRoom, roomId]);

  const createRoom = async () => {
    if (!user) return alert("Please login first");
    const id = Math.random().toString(36).substring(2, 8).toUpperCase();
    
    await setDoc(doc(db, 'rooms', id), {
      host: user.uid,
      status: 'waiting',
      text: generateRaceText(),
      createdAt: serverTimestamp()
    });
    
    await setDoc(doc(db, `rooms/${id}/players`, user.uid), {
      name: user.displayName || 'Host',
      progress: 0,
      wpm: 0,
      finished: false
    });
    
    setRoomId(id);
    setInRoom(true);
  };

  const joinRoom = async () => {
    if (!user) return alert("Please login first");
    if (!joinId.trim()) return;
    const id = joinId.trim().toUpperCase();
    
    const roomSnap = await getDoc(doc(db, 'rooms', id));
    if (!roomSnap.exists()) {
      return alert("Room not found");
    }
    
    await setDoc(doc(db, `rooms/${id}/players`, user.uid), {
      name: user.displayName || 'Player',
      progress: 0,
      wpm: 0,
      finished: false
    });
    
    setRoomId(id);
    setInRoom(true);
  };

  const startRace = async () => {
    if (roomData?.host === user?.uid) {
      await updateDoc(doc(db, 'rooms', roomId), {
        status: 'playing',
        startTime: Date.now()
      });
    }
  };

  const copyCode = () => {
    navigator.clipboard.writeText(roomId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!inRoom) {
    return (
      <div className="w-full min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col items-center justify-center p-8">
        <div className="max-w-md w-full bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-700">
          <button onClick={onBack} className="text-slate-500 mb-8 flex items-center gap-2 hover:text-slate-800 dark:hover:text-white">
            <ArrowLeft className="w-5 h-5" /> Back
          </button>
          <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-8 flex items-center gap-3">
            <Users className="w-8 h-8 text-indigo-500" /> Private Room
          </h2>
          
          <button onClick={createRoom} className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-colors mb-6 text-lg">
            Create New Room
          </button>
          
          <div className="relative flex items-center py-4">
            <div className="flex-grow border-t border-slate-200 dark:border-slate-700"></div>
            <span className="flex-shrink-0 mx-4 text-slate-400 font-medium">OR JOIN WITH CODE</span>
            <div className="flex-grow border-t border-slate-200 dark:border-slate-700"></div>
          </div>
          
          <div className="flex gap-2 mt-4">
            <input 
              type="text" 
              placeholder="e.g. A1B2C3" 
              value={joinId}
              onChange={e => setJoinId(e.target.value.toUpperCase())}
              className="flex-1 px-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-600 bg-transparent text-slate-800 dark:text-white font-mono text-center text-xl uppercase focus:border-indigo-500 outline-none"
              maxLength={6}
            />
            <button onClick={joinRoom} className="px-6 bg-slate-800 dark:bg-slate-600 text-white font-bold rounded-xl hover:bg-slate-900 dark:hover:bg-slate-500 transition-colors">
              Join
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col p-8">
      <div className="max-w-5xl w-full mx-auto">
        <div className="flex items-center justify-between mb-8">
          <button onClick={onBack} className="text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white font-bold flex items-center gap-2">
            <ArrowLeft /> Leave Room
          </button>
          <div className="flex items-center gap-3 bg-white dark:bg-slate-800 px-4 py-2 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
            <span className="text-slate-500 dark:text-slate-400 font-medium">Room Code:</span>
            <span className="font-mono font-bold text-xl text-indigo-600 dark:text-indigo-400 tracking-wider">{roomId}</span>
            <button onClick={copyCode} className="p-2 bg-slate-100 dark:bg-slate-700 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors text-slate-600 dark:text-slate-300">
              {copied ? <Check className="w-5 h-5 text-emerald-500" /> : <Copy className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm relative overflow-hidden">
              {roomData?.status === 'waiting' && (
                <div className="absolute inset-0 z-10 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm flex flex-col items-center justify-center">
                  <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-4">Waiting for Host...</h3>
                  {roomData.host === user?.uid && (
                    <button onClick={startRace} className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-lg flex items-center gap-2 shadow-lg transition-transform hover:scale-105">
                      <Play className="w-6 h-6 fill-current" /> Start Race Now
                    </button>
                  )}
                </div>
              )}
              
              <div className="text-3xl font-mono leading-relaxed text-slate-500 dark:text-slate-400 break-words">
                {roomData?.text?.split('').map((char: string, index: number) => {
                  let colorClass = 'text-slate-400/50 dark:text-slate-500/50';
                  if (index < cursorIndex) colorClass = 'text-slate-800 dark:text-white font-medium';
                  if (index === lastMistakeIndex) colorClass = 'text-rose-500 bg-rose-500/20';
                  
                  return (
                    <span key={index} className={`${colorClass} ${index === cursorIndex && roomData?.status === 'playing' ? 'border-b-4 border-indigo-500 animate-pulse' : ''}`}>
                      {char}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col h-full max-h-[600px]">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2 border-b border-slate-100 dark:border-slate-700 pb-4">
              <Users className="w-5 h-5 text-indigo-500" /> Players ({players.length})
            </h3>
            
            <div className="flex-1 overflow-y-auto space-y-4">
              {players.map(p => (
                <div key={p.id} className="relative bg-slate-50 dark:bg-slate-700/50 p-4 rounded-xl">
                  <div className="flex justify-between items-center mb-2 relative z-10">
                    <span className="font-bold text-slate-700 dark:text-slate-200 flex items-center gap-2">
                      {p.id === roomData?.host && <span className="text-amber-500 text-xs px-1.5 py-0.5 bg-amber-100 dark:bg-amber-900/30 rounded-md">HOST</span>}
                      {p.name} {p.id === user?.uid && '(You)'}
                    </span>
                    {p.finished && <span className="text-emerald-500 font-bold">{p.wpm} WPM</span>}
                  </div>
                  
                  {/* Progress bar background */}
                  <div className="h-2 w-full bg-slate-200 dark:bg-slate-600 rounded-full overflow-hidden">
                    <motion.div 
                      className={`h-full ${p.finished ? 'bg-emerald-500' : 'bg-indigo-500'}`}
                      animate={{ width: `${p.progress || 0}%` }}
                      transition={{ type: 'tween', ease: 'linear', duration: 0.2 }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
