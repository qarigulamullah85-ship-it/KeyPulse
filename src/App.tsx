/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Landing } from './components/Landing';
import { Dashboard } from './components/Dashboard';
import { TypingView } from './components/TypingView';
import { TypingGame } from './components/TypingGame';
import { LessonCreator } from './components/LessonCreator';
import { StatsView } from './components/StatsView';
import { LeaderboardView } from './components/LeaderboardView';
import { MultiplayerView } from './components/MultiplayerView';
import { WhatsAppButton } from './components/WhatsAppButton';
import { Lesson, UserStats, LessonResult } from './types';
import { loadProgress, saveProgress, COURSES } from './data';
import { auth, db } from './lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { LanguageContext, dictionary } from './i18n';

import { ThemeProvider } from './ThemeContext';

type ViewState = 'landing' | 'dashboard' | 'typing' | 'create' | 'stats' | 'leaderboard' | 'multiplayer' | 'certificate';

export default function App() {
  const [view, setView] = useState<ViewState>('landing');
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [customLessons, setCustomLessons] = useState<Lesson[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [language, setLanguage] = useState<string>('en');

  const t = (key: string) => {
    return dictionary[language]?.[key] || dictionary['en'][key] || key;
  };
  
  const defaultStats: UserStats = {
    averageWpm: 0,
    averageAccuracy: 0,
    completedLessons: [],
    totalTimeSeconds: 0,
    history: []
  };

  const [stats, setStats] = useState<UserStats>(defaultStats);

  // Auth Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Fetch from firestore when logged in
        const docRef = doc(db, 'users', currentUser.uid);
        getDoc(docRef).then(docSnap => {
          if (docSnap.exists()) {
            setStats(docSnap.data() as UserStats);
          } else {
            setStats(defaultStats);
          }
        });
      } else {
        // Logged out, revert to fresh start
        setStats(defaultStats);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const saved = loadProgress();
    if (saved && saved.customLessons) {
      setCustomLessons(saved.customLessons);
    }
  }, []);

  // Save to local & firestore
  useEffect(() => {
    // Only save custom lessons to local storage, not stats (guests start fresh)
    saveProgress({ customLessons });
    if (user) {
      setDoc(doc(db, 'users', user.uid), { ...stats, displayName: user.displayName }, { merge: true }).catch(err => {
        console.error("Error saving to firestore", err);
      });
    }
  }, [stats, customLessons, user]);

  const handleLessonComplete = (wpm: number, accuracy: number) => {
    if (!activeLesson) return;

    setStats(prev => {
      const history = [...prev.history, { lessonId: activeLesson.id, wpm, accuracy, timestamp: Date.now() }];
      
      const totalWpm = history.reduce((sum, h) => sum + h.wpm, 0);
      const totalAcc = history.reduce((sum, h) => sum + h.accuracy, 0);
      
      const completed = new Set(prev.completedLessons);
      completed.add(activeLesson.id);

      return {
        ...prev,
        history,
        averageWpm: Math.round(totalWpm / history.length),
        averageAccuracy: Math.round(totalAcc / history.length),
        completedLessons: Array.from(completed)
      };
    });
  };

  return (
    <ThemeProvider>
      <LanguageContext.Provider value={{ language, setLanguage, t }}>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans selection:bg-blue-200 dark:selection:bg-blue-900 transition-colors duration-300">
          {view === 'landing' && (
            <Landing onStart={() => setView('dashboard')} />
          )}

        {view === 'dashboard' && (
          <Dashboard 
            stats={stats}
            customLessons={customLessons}
            onSelectLesson={lesson => {
              setActiveLesson(lesson);
              setView('typing');
            }}
            onCreateCustom={() => setView('create')}
            changeView={setView as any}
          />
        )}

        {view === 'typing' && activeLesson && !activeLesson.gameType && (
          <TypingView 
            lesson={activeLesson}
            onComplete={handleLessonComplete}
            onBack={() => {
              setActiveLesson(null);
              setView('dashboard');
            }}
            onNext={() => {
              // Try to find the next lesson in COURSES
              const currentIndex = COURSES.findIndex(l => l.id === activeLesson.id);
              if (currentIndex >= 0 && currentIndex < COURSES.length - 1) {
                setActiveLesson(COURSES[currentIndex + 1]);
              } else {
                setActiveLesson(null);
                setView('dashboard');
              }
            }}
          />
        )}
        {view === 'typing' && activeLesson && activeLesson.gameType && (
          <TypingGame 
            lesson={activeLesson}
            onComplete={handleLessonComplete}
            onBack={() => {
              setActiveLesson(null);
              setView('dashboard');
            }}
            onNext={() => {
              const currentIndex = COURSES.findIndex(l => l.id === activeLesson.id);
              if (currentIndex >= 0 && currentIndex < COURSES.length - 1) {
                setActiveLesson(COURSES[currentIndex + 1]);
              } else {
                setActiveLesson(null);
                setView('dashboard');
              }
            }}
          />
        )}

        {view === 'stats' && (
          <StatsView stats={stats} onBack={() => setView('dashboard')} />
        )}
        {view === 'leaderboard' && (
          <LeaderboardView onBack={() => setView('dashboard')} />
        )}
        {view === 'multiplayer' && (
          <MultiplayerView onBack={() => setView('dashboard')} />
        )}
        {view === 'create' && (
          <LessonCreator 
            onSave={lesson => {
              setCustomLessons(prev => [...prev, lesson]);
              setView('dashboard');
            }}
            onCancel={() => setView('dashboard')}
          />
        )}
        
        <WhatsAppButton />
      </div>
    </LanguageContext.Provider>
    </ThemeProvider>
  );
}
