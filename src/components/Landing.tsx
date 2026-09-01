import { Keyboard, ArrowRight, Activity, Gamepad2, Globe, Sparkles } from 'lucide-react';
import { useLanguage } from '../i18n';
import { motion } from 'motion/react';
import { loginWithGoogle, auth } from '../lib/firebase';
import { useState, useEffect } from 'react';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';

interface LandingProps {
  onStart: () => void;
}

export function Landing({ onStart }: LandingProps) {
  const { t, language, setLanguage } = useLanguage();
  const [user, setUser] = useState<FirebaseUser | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return () => unsubscribe();
  }, []);

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-gray-900 text-slate-900 dark:text-gray-100 relative overflow-hidden flex flex-col font-sans transition-colors duration-300">
      {/* Background decorations */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-100 dark:bg-blue-900/20 rounded-full blur-3xl opacity-50 pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-100 dark:bg-indigo-900/20 rounded-full blur-3xl opacity-50 pointer-events-none" />

      {/* Top Navbar */}
      <nav className="w-full h-20 flex items-center justify-between px-8 z-20 max-w-7xl mx-auto">
        <div className="text-slate-900 dark:text-white font-bold text-2xl flex items-center gap-2">
          <div className="bg-slate-900 dark:bg-gray-800 text-white p-1.5 rounded-lg shadow-sm">
            <Keyboard className="w-6 h-6" />
          </div>
          KeyPulse
        </div>
        <div className="flex items-center gap-6 text-sm font-semibold text-slate-600 dark:text-gray-300">
          <button className="hover:text-slate-900 dark:hover:text-white transition-colors hidden md:block">{t('features')}</button>
          
          <div className="relative group flex items-center">
             <Globe className="w-4 h-4 mr-1 text-slate-400 dark:text-gray-500" />
            <select 
              className="bg-transparent text-slate-600 dark:text-gray-300 outline-none cursor-pointer hover:text-slate-900 dark:hover:text-white appearance-none pr-4 font-semibold"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
            >
              <option value="en" className="bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100">English</option>
              <option value="es" className="bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100">Español</option>
              <option value="ur" className="bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100">اردو (Urdu)</option>
            </select>
            <span className="absolute right-0 top-[2px] pointer-events-none text-[10px] text-slate-400 dark:text-gray-500">▼</span>
          </div>

          {!user ? (
            <button onClick={loginWithGoogle} className="bg-white dark:bg-gray-800 text-slate-900 dark:text-white border border-slate-200 dark:border-gray-700 px-5 py-2 rounded-full hover:bg-slate-50 dark:hover:bg-gray-700 transition-colors shadow-sm">{t('login')}</button>
          ) : (
            <button onClick={onStart} className="text-slate-600 dark:text-gray-300 hover:text-slate-900 dark:hover:text-white transition-colors">Dashboard</button>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <div className="flex-1 flex flex-col items-center justify-center relative z-20 px-6 pt-12 pb-32 max-w-4xl mx-auto text-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800 text-blue-700 dark:text-blue-400 text-sm font-bold mb-8 shadow-sm"
        >
          <Sparkles className="w-4 h-4" /> {t('newNextGen')}
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white tracking-tight leading-tight mb-6"
        >
          {t('heroTitle')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">KeyPulse</span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-xl text-slate-600 dark:text-gray-400 max-w-2xl mx-auto mb-12 leading-relaxed"
        >
          {t('heroSubtitle')}
        </motion.p>

        <motion.button 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          onClick={onStart}
          className="group flex items-center gap-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-10 py-5 rounded-full font-bold text-lg hover:bg-blue-600 dark:hover:bg-blue-50 hover:shadow-xl hover:shadow-blue-500/20 dark:hover:shadow-white/10 transition-all active:scale-95"
        >
          {t('startTypingNow')}
          <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
        </motion.button>
      </div>

      {/* Features Section */}
      <div className="bg-white dark:bg-gray-900 border-t border-slate-100 dark:border-gray-800 py-24 z-20 relative transition-colors duration-300">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12">
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col items-center text-center p-6"
          >
            <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-blue-100 dark:border-blue-900/50">
              <Activity className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{t('feature1Title')}</h3>
            <p className="text-slate-600 dark:text-gray-400 leading-relaxed font-medium">{t('feature1Desc')}</p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="flex flex-col items-center text-center p-6"
          >
            <div className="w-16 h-16 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-indigo-100 dark:border-indigo-900/50">
              <Gamepad2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{t('feature2Title')}</h3>
            <p className="text-slate-600 dark:text-gray-400 leading-relaxed font-medium">{t('feature2Desc')}</p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex flex-col items-center text-center p-6"
          >
            <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-emerald-100 dark:border-emerald-900/50">
              <Globe className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{t('feature3Title')}</h3>
            <p className="text-slate-600 dark:text-gray-400 leading-relaxed font-medium">{t('feature3Desc')}</p>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
