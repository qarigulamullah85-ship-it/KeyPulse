import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import { Lesson, UserStats } from '../types';
import { COURSES } from '../data';
import { AdBanner } from './AdBanner';
import { Lock, CheckCircle, Package, Search, Clock, Keyboard, User, Rocket, Award, Zap, Shield, Target, Gamepad2, LogOut, Activity, Star, Moon, Sun } from 'lucide-react';
import { loginWithGoogle, logout, auth } from '../lib/firebase';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { useLanguage } from '../i18n';
import { useTheme } from '../ThemeContext';

interface DashboardProps {
  stats: UserStats;
  onSelectLesson: (lesson: Lesson) => void;
  customLessons: Lesson[];
  onCreateCustom: () => void;
}

const getLessonIcon = (id: number) => {
  if (id === 1) return <Keyboard className="text-gray-400 w-10 h-10" />;
  if (id === 2 || id === 3 || id === 19) return <Package className="text-gray-400 w-10 h-10" />;
  if (id === 4 || id === 5 || id === 6 || id === 9 || id === 10 || id === 12 || id === 13 || id === 20) return <Search className="text-gray-400 w-10 h-10" />;
  if (id === 7 || id === 11 || id === 14 || id === 21 || id === 22) return <Clock className="text-gray-400 w-10 h-10" />;
  if (id === 8 || id === 15 || id === 23) return <Gamepad2 className="text-blue-400 w-10 h-10" />; // Games
  if (id > 600) return <Rocket className="text-gray-400 w-10 h-10" />;
  return <Package className="text-gray-400 w-10 h-10" />;
};

export function Dashboard({ stats, onSelectLesson, customLessons, onCreateCustom }: DashboardProps) {
  const [activeTab, setActiveTab] = useState<'home' | 'stats' | 'badges' | 'games'>('home');
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [unlockConfirmLesson, setUnlockConfirmLesson] = useState<Lesson | null>(null);
  const { t, language, setLanguage } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return () => unsubscribe();
  }, []);

  const allLessons = [...COURSES, ...customLessons];
  const games = allLessons.filter(lesson => lesson.gameType === 'falling-words');

  const renderNavButton = (id: 'home' | 'stats' | 'badges' | 'games', label: string) => (
    <button 
      onClick={() => setActiveTab(id)}
      className={`${activeTab === id ? 'text-gray-900 dark:text-white border-b-2 border-blue-600 font-bold' : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'} pb-[18px] pt-[20px] transition-colors flex items-center capitalize`}
    >
      {t(label)}
    </button>
  );

  const chartData = stats.history.map((h, i) => ({
    name: `L-${h.lessonId}`,
    wpm: h.wpm,
    accuracy: h.accuracy
  }));

  return (
    <div className="w-full min-h-screen bg-[#F9FAFB] dark:bg-gray-900 flex flex-col font-sans relative overflow-hidden transition-colors duration-300">

      {/* Main Navbar */}
      <nav className="w-full h-16 bg-white dark:bg-gray-800 flex items-center justify-between px-6 md:px-10 z-10 border-b border-gray-200 dark:border-gray-700 shadow-sm relative transition-colors duration-300">
        <div className="flex items-center gap-10">
          <div className="text-gray-900 dark:text-white font-black text-xl tracking-tight flex items-center gap-2">
            <div className="bg-blue-600 p-1.5 rounded-lg">
              <Keyboard className="w-4 h-4 text-white" />
            </div>
            KeyPulse
          </div>
          <div className="hidden md:flex items-center gap-6 text-[14px] text-gray-500 dark:text-gray-400 font-medium h-full pt-1">
            {renderNavButton('home', 'home')}
            {renderNavButton('stats', 'stats')}
            {renderNavButton('badges', 'badges')}
            {renderNavButton('games', 'games')}
          </div>
        </div>
        <div className="flex items-center gap-4 text-[13px] text-gray-700 dark:text-gray-300 font-medium">
          <button 
            onClick={toggleTheme} 
            className="p-1.5 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 transition-colors"
            title="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          <div className="relative group flex items-center bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-1.5 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
            <select 
              className="bg-transparent text-gray-700 dark:text-gray-300 outline-none cursor-pointer hover:text-gray-900 dark:hover:text-white appearance-none pr-5 text-xs font-semibold"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
            >
              <option value="en" className="text-black">English</option>
              <option value="es" className="text-black">Español</option>
              <option value="ur" className="text-black">اردو</option>
            </select>
            <span className="absolute right-3 top-[10px] pointer-events-none text-[8px] text-gray-400 dark:text-gray-400">▼</span>
          </div>
          {!user ? (
            <button onClick={loginWithGoogle} className="hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 px-4 py-1.5 rounded-lg text-gray-700 dark:text-gray-200 shadow-[0_2px_4px_rgba(0,0,0,0.02)]">{t('loginToSave')}</button>
          ) : (
            <div className="flex items-center gap-4 pl-2 border-l border-gray-200 dark:border-gray-600">
              <span className="text-gray-700 dark:text-gray-300 font-bold truncate max-w-[120px]">{user.displayName}</span>
              <button onClick={logout} className="hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex items-center gap-1.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 px-3 py-1.5 rounded-lg text-gray-700 dark:text-gray-300"><LogOut className="w-4 h-4" /> {t('logout')}</button>
            </div>
          )}
        </div>
      </nav>

      {/* Sub Navbar (Stats) */}
      <div className="w-full h-14 bg-white dark:bg-gray-800 flex items-center justify-between px-6 md:px-10 z-10 border-b border-gray-100 dark:border-gray-700 shadow-[0_4px_10px_rgba(0,0,0,0.02)] transition-colors duration-300">
        <div className="flex items-center gap-6 text-sm font-medium text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <Activity className="w-4 h-4" />
            </div>
            <span className="font-bold text-gray-900 dark:text-white">{Math.round((stats.completedLessons.length / 685) * 100)}%</span> progress
          </div>
          <div className="flex items-center gap-2 border-l border-gray-200 dark:border-gray-700 pl-6">
            <div className="w-8 h-8 rounded-full bg-amber-50 dark:bg-amber-900/30 flex items-center justify-center text-amber-500 dark:text-amber-400">
              <Star className="w-4 h-4" />
            </div>
            <span className="font-bold text-gray-900 dark:text-white">{stats.completedLessons.length * 3}</span> stars
          </div>
          <div className="flex items-center gap-2 border-l border-gray-200 dark:border-gray-700 pl-6 hidden sm:flex">
            <div className="w-8 h-8 rounded-full bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-500 dark:text-emerald-400">
              <Target className="w-4 h-4" />
            </div>
            <span className="font-bold text-gray-900 dark:text-white">{stats.completedLessons.length * 150}</span> points
          </div>
        </div>
        <button className="text-gray-400 dark:text-gray-500 hover:text-gray-900 dark:hover:text-white bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors">Hide ✕</button>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto px-8 pb-24 z-10">
        <div className="max-w-[1200px] mx-auto">
          
          <AdBanner />
          
          <AnimatePresence mode="wait">
            {activeTab === 'home' && (
              <motion.div
                key="home"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="w-full"
              >
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6 mt-4">{t('curriculum')} (685 Lessons)</h2>
                
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
                  {allLessons.map((lesson, index) => {
                    const isCompleted = stats.completedLessons.includes(lesson.id);
                    const isNext = !isCompleted && (index === 0 || stats.completedLessons.includes(allLessons[index-1].id));
                    const isLocked = !isCompleted && !isNext;
                    
                    return (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: Math.min(index * 0.02, 0.4) }}
                        key={lesson.id}
                        onClick={() => {
                          if (isLocked) {
                            setUnlockConfirmLesson(lesson);
                          } else {
                            onSelectLesson(lesson);
                          }
                        }}
                        className={`relative flex flex-col bg-white dark:bg-gray-800 rounded-xl transition-all aspect-square overflow-hidden group ${
                          isLocked ? 'cursor-pointer opacity-60 border border-gray-100 dark:border-gray-700 hover:opacity-80' : 'cursor-pointer hover:-translate-y-1 hover:shadow-md'
                        } ${
                          isNext ? 'border-2 border-blue-500 shadow-lg scale-105 z-20 ring-4 ring-blue-50 dark:ring-blue-900/20' : 'border border-gray-200 dark:border-gray-700 shadow-sm'
                        }`}
                      >
                        {/* Status Indicator Bar */}
                        <div className={`absolute top-0 left-0 w-full h-1 ${isCompleted ? 'bg-green-500' : isNext ? 'bg-blue-500' : 'bg-transparent'}`} />

                        {/* Top Bar */}
                        <div className="flex justify-between items-start p-3">
                          <span className={`font-bold text-sm ${isNext ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 dark:text-gray-500'}`}>{lesson.id}</span>
                          {isCompleted ? (
                            <div className="text-green-500">
                              <CheckCircle className="w-5 h-5" />
                            </div>
                          ) : isNext ? (
                             <div className="w-2 h-2 rounded-full bg-blue-500 mt-1 animate-pulse" />
                          ) : (
                            <Lock className="w-4 h-4 text-gray-300 dark:text-gray-600" />
                          )}
                        </div>
                        
                        {/* Icon */}
                        <div className="flex-1 flex justify-center items-center pb-6 transition-transform group-hover:scale-110 duration-300">
                          {getLessonIcon(lesson.id)}
                        </div>
                        
                        {/* Title Bar */}
                        <div className={`absolute bottom-0 w-full py-2 px-3 flex items-center justify-center transition-colors ${
                          isNext ? 'bg-blue-50 dark:bg-blue-900/30 border-t border-blue-100 dark:border-blue-800/50' : 'bg-gray-50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-700 group-hover:bg-blue-50/50 dark:group-hover:bg-blue-900/20'
                        }`}>
                          <span className={`text-xs truncate w-full text-center font-semibold ${
                            isNext ? 'text-blue-700 dark:text-blue-300' : 'text-gray-600 dark:text-gray-400 group-hover:text-blue-700 dark:group-hover:text-blue-300'
                          }`}>
                            {lesson.title}
                          </span>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {activeTab === 'stats' && (
              <motion.div
                key="stats"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }} 
                className="mt-8"
              >
                <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-8">{t('yourStatistics')}</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                  <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }} className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 text-center hover:shadow-md transition-shadow">
                    <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Zap className="w-8 h-8" />
                    </div>
                    <h3 className="text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider text-sm mb-2">{t('averageSpeed')}</h3>
                    <p className="text-5xl font-black text-gray-900 dark:text-white">{stats.averageWpm} <span className="text-xl text-gray-400 dark:text-gray-500">WPM</span></p>
                  </motion.div>
                  <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 text-center hover:shadow-md transition-shadow">
                    <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Target className="w-8 h-8" />
                    </div>
                    <h3 className="text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider text-sm mb-2">{t('averageAccuracy')}</h3>
                    <p className="text-5xl font-black text-gray-900 dark:text-white">{stats.averageAccuracy}%</p>
                  </motion.div>
                  <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }} className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 text-center hover:shadow-md transition-shadow">
                    <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Award className="w-8 h-8" />
                    </div>
                    <h3 className="text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider text-sm mb-2">{t('lessonsCleared')}</h3>
                    <p className="text-5xl font-black text-gray-900 dark:text-white">{stats.completedLessons.length}</p>
                  </motion.div>
                </div>

                {stats.history.length > 0 && (
                  <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }} className="mb-12 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-6">Typing Speed Progress</h3>
                    <div className="w-full h-72">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData}>
                          <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#374151' : '#f0f0f0'} />
                          <XAxis dataKey="name" stroke={theme === 'dark' ? '#9CA3AF' : '#a0a0a0'} fontSize={12} tickLine={false} axisLine={false} />
                          <YAxis stroke={theme === 'dark' ? '#9CA3AF' : '#a0a0a0'} fontSize={12} tickLine={false} axisLine={false} />
                          <RechartsTooltip 
                            contentStyle={{ borderRadius: '12px', border: 'none', backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff', color: theme === 'dark' ? '#f3f4f6' : '#111827', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
                            cursor={{ stroke: theme === 'dark' ? '#4b5563' : '#e0e0e0', strokeWidth: 2 }}
                          />
                          <Line type="monotone" dataKey="wpm" name="Speed (WPM)" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, fill: '#3b82f6', strokeWidth: 2, stroke: theme === 'dark' ? '#1f2937' : '#fff' }} activeDot={{ r: 6 }} animationDuration={1500} />
                          <Line type="monotone" dataKey="accuracy" name="Accuracy (%)" stroke="#10b981" strokeWidth={3} dot={{ r: 4, fill: '#10b981', strokeWidth: 2, stroke: theme === 'dark' ? '#1f2937' : '#fff' }} activeDot={{ r: 6 }} animationDuration={1500} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </motion.div>
                )}

                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">{t('recentHistory')}</h3>
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                  {stats.history.length === 0 ? (
                    <p className="p-8 text-center text-gray-500 dark:text-gray-400">No lessons completed yet. Start typing!</p>
                  ) : (
                    <table className="w-full text-left">
                      <thead className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-700 text-gray-500 dark:text-gray-400 text-sm uppercase">
                        <tr>
                          <th className="py-4 px-6 font-semibold">Lesson</th>
                          <th className="py-4 px-6 font-semibold">Speed</th>
                          <th className="py-4 px-6 font-semibold">Accuracy</th>
                          <th className="py-4 px-6 font-semibold">Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {stats.history.slice().reverse().map((h, i) => (
                          <tr key={i} className="border-b border-gray-50 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                            <td className="py-4 px-6 font-medium text-gray-900 dark:text-gray-100">Lesson {h.lessonId}</td>
                            <td className="py-4 px-6 text-blue-600 dark:text-blue-400 font-bold">{h.wpm} WPM</td>
                            <td className="py-4 px-6 text-emerald-600 font-bold">{h.accuracy}%</td>
                            <td className="py-4 px-6 text-gray-500">{new Date(h.timestamp).toLocaleDateString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </motion.div>
            )}

            {activeTab === 'badges' && (
              <motion.div
                key="badges"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }} 
                className="mt-8"
              >
                <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-8">{t('achievements')}</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                  {[
                    { id: 'novice', title: t('firstStep'), desc: 'Complete your first lesson.', icon: <Rocket className="w-8 h-8" />, earned: stats.completedLessons.length > 0 },
                    { id: 'speed', title: t('speedster'), desc: 'Reach 30 WPM average.', icon: <Zap className="w-8 h-8" />, earned: stats.averageWpm >= 30 },
                    { id: 'acc', title: t('sharpshooter'), desc: 'Achieve 100% accuracy.', icon: <Target className="w-8 h-8" />, earned: stats.history.some(h => h.accuracy === 100) },
                    { id: 'dedication', title: t('dedicated'), desc: 'Complete 10 lessons.', icon: <Shield className="w-8 h-8" />, earned: stats.completedLessons.length >= 10 },
                    { id: 'master', title: t('homeRowMaster'), desc: 'Complete first 23 lessons.', icon: <Award className="w-8 h-8" />, earned: stats.completedLessons.length >= 23 },
                  ].map((badge, i) => (
                    <motion.div 
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: i * 0.1, type: 'spring' }}
                      key={badge.id} 
                      className={`relative p-6 rounded-2xl border text-center transition-all duration-300 ${badge.earned ? 'bg-white dark:bg-gray-800 border-blue-200 dark:border-blue-900 shadow-md hover:-translate-y-1' : 'bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 opacity-60'}`}
                    >
                      <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4 transition-transform ${badge.earned ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 scale-110' : 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500'}`}>
                        {badge.icon}
                      </div>
                      <h3 className={`font-bold text-lg mb-1 ${badge.earned ? 'text-gray-900 dark:text-gray-100' : 'text-gray-500 dark:text-gray-400'}`}>{badge.title}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{badge.desc}</p>
                      {badge.earned && <div className="mt-3 text-[10px] tracking-wider font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 py-1 px-3 rounded-full inline-block uppercase">Unlocked</div>}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'games' && (
              <motion.div
                key="games"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="w-full"
              >
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6 mt-4">{t('games')}</h2>
                
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
                  {games.map((lesson, index) => {
                    const isCompleted = stats.completedLessons.includes(lesson.id);
                    const isLocked = !isCompleted && stats.completedLessons.length < 5; // Require 5 lessons to unlock games
                    
                    return (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: Math.min(index * 0.02, 0.4) }}
                        key={lesson.id}
                        onClick={() => {
                          if (isLocked) {
                            setUnlockConfirmLesson(lesson);
                          } else {
                            onSelectLesson(lesson);
                          }
                        }}
                        className={`relative flex flex-col bg-white dark:bg-gray-800 rounded-xl transition-all aspect-square overflow-hidden group ${
                          isLocked ? 'cursor-pointer opacity-60 border border-gray-100 dark:border-gray-700 hover:opacity-80' : 'cursor-pointer hover:-translate-y-1 hover:shadow-md border border-emerald-100 dark:border-emerald-900/50 shadow-sm hover:border-emerald-300 dark:hover:border-emerald-700'
                        }`}
                      >
                        {/* Status Indicator Bar */}
                        <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500" />
                        
                        {/* Top Bar */}
                        <div className="flex justify-between items-start p-3">
                          <span className="font-bold text-emerald-600 dark:text-emerald-400 text-sm">G{index+1}</span>
                          {isCompleted ? (
                            <div className="text-emerald-500">
                              <CheckCircle className="w-5 h-5" />
                            </div>
                          ) : isLocked ? (
                            <Lock className="w-4 h-4 text-gray-300 dark:text-gray-600" />
                          ) : (
                             <div className="text-emerald-300 dark:text-emerald-600">
                               <Gamepad2 className="w-4 h-4" />
                             </div>
                          )}
                        </div>
                        
                        {/* Icon */}
                        <div className="flex-1 flex justify-center items-center pb-6 transition-transform group-hover:scale-110 duration-300">
                          {getLessonIcon(lesson.id)}
                        </div>
                        
                        {/* Title Bar */}
                        <div className="absolute bottom-0 w-full py-2 px-3 flex items-center justify-center transition-colors bg-emerald-50 dark:bg-emerald-900/20 border-t border-emerald-100 dark:border-emerald-900/40 group-hover:bg-emerald-100/50 dark:group-hover:bg-emerald-900/40">
                          <span className="text-xs text-emerald-800 dark:text-emerald-300 truncate w-full text-center font-semibold">
                            {lesson.title}
                          </span>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </div>
      
      {/* Scroll controls (mock) */}
      <div className="fixed right-6 top-1/2 -translate-y-1/2 flex flex-col items-center gap-2 z-20 bg-white/50 dark:bg-gray-800/50 p-2 rounded-full backdrop-blur-sm">
        <button className="w-8 h-8 rounded-full bg-white dark:bg-gray-700 shadow flex items-center justify-center text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="18 15 12 9 6 15"></polyline></svg>
        </button>
        <span className="text-xs font-bold text-gray-500 dark:text-gray-400 my-1">1</span>
        <button className="w-8 h-8 rounded-full bg-white dark:bg-gray-700 shadow flex items-center justify-center text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
        </button>
      </div>

      {/* Unlock Confirmation Modal */}
      <AnimatePresence>
        {unlockConfirmLesson && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-sm w-full p-6 text-center border border-gray-100 dark:border-gray-700"
            >
              <div className="w-16 h-16 bg-amber-100 dark:bg-amber-900/30 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Are you sure?</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                I highly recommend going through every lesson and not jumping ahead.
              </p>
              <div className="flex gap-3">
                <button 
                  onClick={() => setUnlockConfirmLesson(null)}
                  className="flex-1 px-4 py-2.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 font-semibold rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => {
                    const lesson = unlockConfirmLesson;
                    setUnlockConfirmLesson(null);
                    onSelectLesson(lesson);
                  }}
                  className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors shadow-sm"
                >
                  Continue
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
