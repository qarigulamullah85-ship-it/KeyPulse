/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Landing } from './components/Landing';
import { Dashboard } from './components/Dashboard';
import { TypingView } from './components/TypingView';
import { TypingGame } from './components/TypingGame';
import { TypingBombGame } from './components/TypingBombGame';
import { TypingPuzzleGame } from './components/TypingPuzzleGame';
import { KidsTypingGame } from './components/KidsTypingGame';
import { DictationView } from './components/DictationView';
import { PrivateRoomView } from './components/PrivateRoomView';
import { TypingTest } from './components/TypingTest';
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

type ViewState = 'landing' | 'dashboard' | 'typing' | 'create' | 'stats' | 'leaderboard' | 'multiplayer' | 'certificate' | 'typing-test' | 'dictation' | 'private-room';

export default function App() {
  const [view, setView] = useState<ViewState>('landing');
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [testDuration, setTestDuration] = useState<number>(60);
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

  const checkAndUpdateStreakAndBadges = (prevStats: UserStats, wpm: number, accuracy: number): UserStats => {
    const today = new Date().toDateString();
    let newStreak = prevStats.streak || 0;
    
    if (prevStats.lastPlayDate !== today) {
      if (prevStats.lastPlayDate === new Date(Date.now() - 86400000).toDateString()) {
        newStreak += 1;
      } else {
        newStreak = 1;
      }
    }

    const badges = new Set(prevStats.badges || []);
    if (newStreak >= 3) badges.add("3 Day Streak 🔥");
    if (newStreak >= 7) badges.add("7 Day Streak 🔥");
    if (wpm >= 40) badges.add("Speed Demon (40+ WPM) ⚡");
    if (wpm >= 60) badges.add("Typing Master (60+ WPM) 👑");
    if (accuracy === 100) badges.add("Perfect Accuracy 🎯");
    if ((prevStats.completedLessons.length + 1) >= 1) badges.add("First Lesson 🎓");

    return {
      ...prevStats,
      streak: newStreak,
      lastPlayDate: today,
      badges: Array.from(badges)
    };
  };

  const handleLessonComplete = (wpm: number, accuracy: number) => {
    if (!activeLesson) return;

    setStats(prev => {
      const history = [...prev.history, { lessonId: activeLesson.id, wpm, accuracy, timestamp: Date.now() }];
      
      const totalWpm = history.reduce((sum, h) => sum + h.wpm, 0);
      const totalAcc = history.reduce((sum, h) => sum + h.accuracy, 0);
      
      const completed = new Set(prev.completedLessons);
      completed.add(activeLesson.id);

      const statsWithAchievements = checkAndUpdateStreakAndBadges(prev, wpm, accuracy);

      return {
        ...statsWithAchievements,
        history,
        averageWpm: Math.round(totalWpm / history.length),
        averageAccuracy: Math.round(totalAcc / history.length),
        completedLessons: Array.from(completed)
      };
    });
  };

  const updateStats = (updates: Partial<UserStats>) => {
    setStats(prev => ({ ...prev, ...updates }));
  };

  const handleTestComplete = (wpm: number, accuracy: number, duration: number) => {
    setStats(prev => {
      const testHistory = [...(prev.testHistory || []), { wpm, accuracy, duration, timestamp: Date.now() }];
      
      const statsWithAchievements = checkAndUpdateStreakAndBadges(prev, wpm, accuracy);

      return {
        ...statsWithAchievements,
        testHistory,
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
            onStartTest={(duration) => setTestDuration(duration)}
            updateStats={updateStats}
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
            ninjaMode={stats.ninjaMode}
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
        {view === 'typing' && activeLesson && (activeLesson.gameType === 'falling-words' || activeLesson.gameType === 'balloon') && (
          <TypingGame 
            lesson={activeLesson}
            onComplete={handleLessonComplete}
            onBack={() => {
              setActiveLesson(null);
              setView('dashboard');
            }}
            ninjaMode={stats.ninjaMode}
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
        {view === 'typing' && activeLesson && activeLesson.gameType === 'bomb' && (
          <TypingBombGame 
            lesson={activeLesson}
            onComplete={handleLessonComplete}
            onBack={() => {
              setActiveLesson(null);
              setView('dashboard');
            }}
            ninjaMode={stats.ninjaMode}
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
        {view === 'typing' && activeLesson && activeLesson.gameType === 'puzzle' && (
          <TypingPuzzleGame 
            lesson={activeLesson}
            onComplete={handleLessonComplete}
            onBack={() => {
              setActiveLesson(null);
              setView('dashboard');
            }}
            ninjaMode={stats.ninjaMode}
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
        {view === 'typing' && activeLesson && activeLesson.gameType === 'kids' && (
          <KidsTypingGame 
            lesson={activeLesson}
            onComplete={handleLessonComplete}
            onBack={() => {
              setActiveLesson(null);
              setView('dashboard');
            }}
            ninjaMode={stats.ninjaMode}
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
        {view === 'dictation' && (
          <DictationView onBack={() => setView('dashboard')} />
        )}
        {view === 'private-room' && (
          <PrivateRoomView onBack={() => setView('dashboard')} />
        )}
        {view === 'typing-test' && (
          <TypingTest 
            duration={testDuration}
            ninjaMode={stats.ninjaMode} 
            onBack={() => setView('dashboard')} 
            onComplete={(wpm, accuracy) => {
              handleTestComplete(wpm, accuracy, testDuration);
            }} 
          />
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
