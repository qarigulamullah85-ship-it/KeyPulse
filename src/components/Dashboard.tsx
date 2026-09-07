import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Lesson, UserStats } from '../types';
import { COURSES } from '../data';
import { AdBanner } from './AdBanner';
import { AdCustom } from './AdCustom';
import { Lock, CheckCircle, Package, Search, Clock, Keyboard, Rocket, Gamepad2, LogOut, Star, Play, Home } from 'lucide-react';
import { loginWithGoogle, logout, auth } from '../lib/firebase';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { useLanguage } from '../i18n';
import { useTheme } from '../ThemeContext';
import { Moon, Sun } from 'lucide-react';

interface DashboardProps {
  stats: UserStats;
  onSelectLesson: (lesson: Lesson) => void;
  customLessons: Lesson[];
  onCreateCustom: () => void;
  changeView?: (view: string) => void;
  onStartTest?: (duration: number) => void;
  updateStats?: (updates: Partial<UserStats>) => void;
}

const AVATARS = ["🦊", "🐱", "🐶", "🐼", "🐯", "🦁", "🐸", "🐵", "🦄", "🤖", "👻", "👽", "😎", "🤓", "🤠"];

const getLessonIcon = (id: number, isGame: boolean) => {
  if (isGame) return <Gamepad2 className="w-12 h-12" />;
  if (id === 1) return <Keyboard className="w-12 h-12" />;
  if (id === 4 || id === 5 || id === 6 || id === 10 || id === 13) return <Search className="w-12 h-12" />;
  if (id === 7 || id === 11 || id === 14 || id === 21) return <Clock className="w-12 h-12" />;
  if (id === 16 || id === 17 || id === 18) return <Home className="w-12 h-12" />;
  if (id > 600) return <Rocket className="w-12 h-12" />;
  
  // Default box icon 
  return (
    <div className="relative">
      <Package className="w-14 h-14" />
      {/* Small label inside the box */}
      <span className="absolute inset-0 flex items-center justify-center font-bold text-lg pt-1">
        {id === 2 || id === 3 || id === 4 ? 'fj' : id === 5 || id === 6 || id === 7 ? 'dk' : id === 8 || id === 9 || id === 10 ? 'sl' : id === 11 || id === 12 || id === 13 ? 'a;' : 'gh'}
      </span>
    </div>
  );
};

export function Dashboard({ stats, onSelectLesson, customLessons, onCreateCustom, changeView, onStartTest, updateStats }: DashboardProps) {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [unlockConfirmLesson, setUnlockConfirmLesson] = useState<Lesson | null>(null);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const { language, setLanguage } = useLanguage();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return () => unsubscribe();
  }, []);

  const allLessons = [...COURSES, ...customLessons];

  // Calculate total stars across all lessons (max 5 per completed lesson)
  const calculateStars = (lessonId: number) => {
    const history = stats.history.filter(h => h.lessonId === lessonId);
    if (history.length === 0) return 0;
    const bestAcc = Math.max(...history.map(h => h.accuracy));
    if (bestAcc >= 90) return 5;
    if (bestAcc >= 75) return 4;
    if (bestAcc >= 60) return 3;
    if (bestAcc >= 40) return 2;
    return 1;
  };

  const totalStars = allLessons.reduce((sum, lesson) => {
    if (stats.completedLessons.includes(lesson.id)) {
      return sum + calculateStars(lesson.id);
    }
    return sum;
  }, 0);

  const progressPercent = Math.round((stats.completedLessons.length / allLessons.length) * 100) || 0;
  const totalPoints = stats.completedLessons.length * 150;

  return (
    <div className="w-full min-h-screen bg-[#F0F4F8] dark:bg-slate-900 text-slate-900 dark:text-slate-100 flex flex-col font-sans relative overflow-hidden transition-colors duration-300">
      
      {/* Top Navbar */}
      <nav className="w-full h-16 bg-[#2C3E50] text-white flex items-center justify-between px-8 z-20 shadow-md">
        <div className="flex items-center gap-8">
          <div className="font-black text-xl tracking-tight flex items-center gap-2 text-white">
            KeyPulse
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm font-semibold text-slate-300">
            <button className="text-white" onClick={() => changeView?.('dashboard')}>Home</button>
            <button className="hover:text-white transition-colors" onClick={() => changeView?.('stats')}>Stats & Charts</button>
            <button className="hover:text-white transition-colors" onClick={() => changeView?.('leaderboard')}>Leaderboard</button><button className="hover:text-white transition-colors" onClick={() => changeView?.('multiplayer')}>Multiplayer</button><button className="hover:text-white transition-colors" onClick={onCreateCustom}>Custom Test</button>
          </div>
        </div>

        <div className="flex items-center gap-4 text-sm font-medium">
          <button 
            onClick={toggleTheme}
            className="text-slate-300 hover:text-white transition-colors flex items-center justify-center w-6 h-6"
            title="Toggle Theme"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          <button 
            className="text-slate-300 hover:text-white transition-colors"
            onClick={() => {
              const current = localStorage.getItem("soundsEnabled") !== "false";
              localStorage.setItem("soundsEnabled", String(!current));
              setLanguage(language);
            }}
            title="Toggle Typing Sounds"
          >
            {localStorage.getItem("soundsEnabled") !== "false" ? "🔊" : "🔇"}
          </button>
          <select 
            className="bg-transparent text-slate-300 outline-none cursor-pointer hover:text-white appearance-none pr-5 font-semibold"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            <option value="en" className="text-black">English</option>
            <option value="es" className="text-black">Español</option>
            <option value="ur" className="text-black">اردو</option>
          </select>

          {!user ? (
            <button onClick={loginWithGoogle} className="hover:text-white transition-colors">Login</button>
          ) : (
            <div className="flex items-center gap-4 pl-4 border-l border-slate-600">
              <span className="font-bold hidden sm:block truncate max-w-[120px]">{user.displayName}</span>
              <button onClick={logout} className="hover:text-red-400 transition-colors flex items-center gap-1.5"><LogOut className="w-4 h-4" /> Logout</button>
            </div>
          )}
        </div>
      </nav>

      {/* Sub Navbar (Stats Bar) */}
      <div className="w-full h-14 bg-[#E8F0FE] flex items-center justify-between px-8 z-10 shadow-sm border-b border-[#D2E3FC]">
        <div className="flex items-center gap-6 text-sm font-bold text-slate-600">
          <div><span className="text-slate-900">{progressPercent}%</span> progress</div>
          <div><span className="text-slate-900">{totalStars}</span> stars</div>
          <div><span className="text-slate-900">{totalPoints.toLocaleString()}</span> points</div>
        </div>
        <button className="text-slate-500 dark:text-slate-400 hover:text-slate-900 text-xs font-semibold transition-colors">Hide ✕</button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto px-8 pb-24 z-10 pt-10">
        <div className="max-w-[1400px] mx-auto">
          
          <AdCustom />
          <AdBanner />
          
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
              <h3 className="text-lg font-bold text-slate-700 dark:text-slate-200 mb-2 flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <div className="text-2xl cursor-pointer hover:scale-110 transition-transform" onClick={() => setShowAvatarPicker(true)}>
                    {stats.avatar || "👤"}
                  </div> 
                  Profile
                </span>
              </h3>
              <div className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                Streak: <strong className="text-orange-500">{stats.streak || 0} 🔥</strong>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-600 dark:text-slate-300 flex items-center gap-2">
                  🥷 Ninja Mode
                </span>
                <button 
                  onClick={() => updateStats?.({ ninjaMode: !stats.ninjaMode })}
                  className={`w-12 h-6 rounded-full transition-colors relative ${stats.ninjaMode ? 'bg-indigo-500' : 'bg-slate-300 dark:bg-slate-600'}`}
                >
                  <div className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${stats.ninjaMode ? 'translate-x-6' : 'translate-x-0'}`}></div>
                </button>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
              <h3 className="text-lg font-bold text-slate-700 dark:text-slate-200 mb-2 flex items-center gap-2"><div className="text-yellow-500">🎖️</div> Achievements</h3>
              <div className="flex flex-wrap gap-2 mt-2 h-16 overflow-y-auto">
                {(stats.badges && stats.badges.length > 0) ? stats.badges.map((badge, idx) => (
                  <span key={idx} className="bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-200 text-xs font-bold px-2 py-1 rounded-full border border-amber-200 dark:border-amber-700/50">
                    {badge}
                  </span>
                )) : (
                  <p className="text-slate-400 text-sm">No badges yet. Start typing to earn!</p>
                )}
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col justify-between">
              <h3 className="text-lg font-bold text-slate-700 dark:text-slate-200 mb-2 flex items-center gap-2"><div className="text-blue-500">⏱️</div> Quick Tests</h3>
              <div className="flex gap-2">
                <button 
                  onClick={() => { onStartTest?.(60); changeView?.('typing-test'); }} 
                  className="flex-1 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-800 dark:text-white text-sm font-bold py-2 rounded-xl transition-colors border border-slate-300 dark:border-slate-600"
                >
                  1 Min
                </button>
                <button 
                  onClick={() => { onStartTest?.(120); changeView?.('typing-test'); }} 
                  className="flex-1 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-800 dark:text-white text-sm font-bold py-2 rounded-xl transition-colors border border-slate-300 dark:border-slate-600"
                >
                  2 Min
                </button>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col justify-between">
              <h3 className="text-lg font-bold text-slate-700 dark:text-slate-200 mb-2 flex items-center gap-2"><div className="text-emerald-500">🎮</div> Modes</h3>
              <div className="flex flex-col gap-2">
                <button 
                  onClick={() => changeView?.('dictation')} 
                  className="flex-1 bg-indigo-50 dark:bg-indigo-900/30 hover:bg-indigo-100 dark:hover:bg-indigo-800/40 text-indigo-700 dark:text-indigo-300 text-sm font-bold py-1.5 rounded-xl transition-colors border border-indigo-200 dark:border-indigo-800/50"
                  title="Audio Dictation Mode"
                >
                  🎧 Dictate
                </button>
                <button 
                  onClick={() => changeView?.('private-room')} 
                  className="flex-1 bg-emerald-50 dark:bg-emerald-900/30 hover:bg-emerald-100 dark:hover:bg-emerald-800/40 text-emerald-700 dark:text-emerald-300 text-sm font-bold py-1.5 rounded-xl transition-colors border border-emerald-200 dark:border-emerald-800/50"
                  title="Play with Friends"
                >
                  🤝 Friends
                </button>
              </div>
            </div>
          </div>
          <div className="mb-10">
            <h2 className="text-3xl font-bold text-slate-700 dark:text-slate-200 mb-8 tracking-tight">Home Row</h2>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {allLessons.map((lesson, index) => {
                const isCompleted = stats.completedLessons.includes(lesson.id);
                const isNext = !isCompleted && (index === 0 || stats.completedLessons.includes(allLessons[index-1].id));
                const isLocked = !isCompleted && !isNext;
                const earnedStars = isCompleted ? calculateStars(lesson.id) : 0;
                const isGame = !!lesson.gameType;
                
                return (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: Math.min(index * 0.015, 0.3) }}
                    key={lesson.id}
                    onClick={() => {
                      if (isLocked) {
                        setUnlockConfirmLesson(lesson);
                      } else {
                        onSelectLesson(lesson);
                      }
                    }}
                    className={`relative flex flex-col bg-white rounded-lg transition-all aspect-square overflow-hidden group ${
                      isLocked ? 'cursor-pointer opacity-70 border border-slate-200' : 
                      isNext ? 'cursor-pointer border-2 border-slate-800 shadow-md ring-4 ring-[#E8F0FE]' : 
                      'cursor-pointer hover:shadow-md border border-slate-200 hover:border-slate-400'
                    }`}
                  >
                    {/* Top row: ID and Status Icon */}
                    <div className="flex justify-between items-start p-3 z-10">
                      <span className={`text-xl font-bold ${isLocked ? 'text-slate-400' : 'text-slate-700 dark:text-slate-200'}`}>{index + 1}</span>
                      
                      {isCompleted ? (
                        <div className="bg-[#7CD922] text-white rounded-full p-1 shadow-sm">
                          <CheckCircle className="w-5 h-5" />
                        </div>
                      ) : isNext ? (
                        <div className="text-slate-800 dark:text-white opacity-0 group-hover:opacity-100 transition-opacity">
                          <Play className="w-6 h-6 fill-current" />
                        </div>
                      ) : (
                        <Lock className="w-5 h-5 text-slate-300" />
                      )}
                    </div>

                    {/* Center Icon */}
                    <div className={`flex-1 flex justify-center items-center pb-8 transition-transform duration-300 ${isNext ? 'scale-110' : 'group-hover:scale-105'} ${isLocked ? 'text-slate-300' : 'text-slate-400'}`}>
                      {getLessonIcon(lesson.id, isGame)}
                    </div>

                    {/* Bottom Area: Stars (if completed) or subtle indicator */}
                    {isCompleted && (
                      <div className="absolute bottom-9 w-full flex justify-center gap-0.5">
                         {[...Array(5)].map((_, i) => (
                           <Star 
                             key={i} 
                             className={`w-3.5 h-3.5 ${i < earnedStars ? 'fill-[#FFC107] text-[#FFC107]' : 'fill-slate-200 text-slate-200'}`} 
                           />
                         ))}
                      </div>
                    )}

                    {/* Title Bar */}
                    <div className="absolute bottom-0 w-full py-2 px-2 flex items-center justify-center border-t border-slate-100 bg-white group-hover:bg-slate-50 transition-colors">
                      <span className={`text-[11px] truncate w-full text-center font-bold ${isLocked ? 'text-slate-400' : 'text-slate-500 dark:text-slate-400'}`}>
                        {lesson.title}
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Unlock Confirmation Modal */}

      <AnimatePresence>
        {showAvatarPicker && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4" onClick={() => setShowAvatarPicker(false)}>
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-slate-800 rounded-3xl p-8 max-w-sm w-full shadow-2xl border border-slate-100 dark:border-slate-700"
              onClick={e => e.stopPropagation()}
            >
              <h3 className="text-2xl font-bold text-center text-slate-800 dark:text-white mb-6">Choose Avatar</h3>
              
              <div className="grid grid-cols-5 gap-4 mb-8">
                {AVATARS.map(avatar => (
                  <button
                    key={avatar}
                    onClick={() => {
                      updateStats?.({ avatar });
                      setShowAvatarPicker(false);
                    }}
                    className={`text-3xl p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors ${stats.avatar === avatar ? 'bg-indigo-50 dark:bg-indigo-900/40 ring-2 ring-indigo-500' : ''}`}
                  >
                    {avatar}
                  </button>
                ))}
              </div>
              
              <button 
                onClick={() => setShowAvatarPicker(false)}
                className="w-full py-3 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-800 dark:text-white font-bold rounded-xl transition-colors"
              >
                Done
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {unlockConfirmLesson && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 text-center border border-slate-100"
            >
              <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Lesson Locked</h3>
              <p className="text-slate-600 mb-6 text-sm">
                We highly recommend going through every lesson in order and not jumping ahead. Complete previous lessons to unlock this one.
              </p>
              <div className="flex gap-3">
                <button 
                  onClick={() => setUnlockConfirmLesson(null)}
                  className="flex-1 px-4 py-2.5 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-bold rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => {
                    const lesson = unlockConfirmLesson;
                    setUnlockConfirmLesson(null);
                    onSelectLesson(lesson);
                  }}
                  className="flex-1 px-4 py-2.5 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-xl transition-colors shadow-sm"
                >
                  Jump Ahead
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
