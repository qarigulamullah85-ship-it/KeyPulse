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

interface DashboardProps {
  stats: UserStats;
  onSelectLesson: (lesson: Lesson) => void;
  customLessons: Lesson[];
  onCreateCustom: () => void;
}

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

export function Dashboard({ stats, onSelectLesson, customLessons }: DashboardProps) {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [unlockConfirmLesson, setUnlockConfirmLesson] = useState<Lesson | null>(null);
  const { language, setLanguage } = useLanguage();

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
    <div className="w-full min-h-screen bg-[#F0F4F8] text-slate-900 flex flex-col font-sans relative overflow-hidden transition-colors duration-300">
      
      {/* Top Navbar */}
      <nav className="w-full h-16 bg-[#2C3E50] text-white flex items-center justify-between px-8 z-20 shadow-md">
        <div className="flex items-center gap-8">
          <div className="font-black text-xl tracking-tight flex items-center gap-2 text-white">
            KeyPulse
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm font-semibold text-slate-300">
            <button className="text-white">Home</button>
            <button className="hover:text-white transition-colors">Stats</button>
            <button className="hover:text-white transition-colors">Badges</button>
          </div>
        </div>

        <div className="flex items-center gap-4 text-sm font-medium">
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
        <button className="text-slate-500 hover:text-slate-900 text-xs font-semibold transition-colors">Hide ✕</button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto px-8 pb-24 z-10 pt-10">
        <div className="max-w-[1400px] mx-auto">
          
          <AdCustom />
          <AdBanner />
          
          <div className="mb-10">
            <h2 className="text-3xl font-bold text-slate-700 mb-8 tracking-tight">Home Row</h2>
            
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
                      <span className={`text-xl font-bold ${isLocked ? 'text-slate-400' : 'text-slate-700'}`}>{index + 1}</span>
                      
                      {isCompleted ? (
                        <div className="bg-[#7CD922] text-white rounded-full p-1 shadow-sm">
                          <CheckCircle className="w-5 h-5" />
                        </div>
                      ) : isNext ? (
                        <div className="text-slate-800 opacity-0 group-hover:opacity-100 transition-opacity">
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
                      <span className={`text-[11px] truncate w-full text-center font-bold ${isLocked ? 'text-slate-400' : 'text-slate-500'}`}>
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
                  className="flex-1 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors"
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
