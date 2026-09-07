import os
import re

with open("src/components/Dashboard.tsx", "r") as f:
    content = f.read()

content = content.replace("const getLessonIcon", """const AVATARS = ["🦊", "🐱", "🐶", "🐼", "🐯", "🦁", "🐸", "🐵", "🦄", "🤖", "👻", "👽", "😎", "🤓", "🤠"];\n\nconst getLessonIcon""")

content = content.replace("const [unlockConfirmLesson, setUnlockConfirmLesson] = useState<Lesson | null>(null);", "const [unlockConfirmLesson, setUnlockConfirmLesson] = useState<Lesson | null>(null);\n  const [showAvatarPicker, setShowAvatarPicker] = useState(false);")

new_overview_cards = """          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
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
          </div>"""

content = re.sub(r'<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">.*?<div className="mb-10">', new_overview_cards + '\n          <div className="mb-10">', content, flags=re.DOTALL)

prog_section = """
          <div className="mb-10 mt-12">
            <h2 className="text-3xl font-bold text-slate-700 dark:text-slate-200 mb-8 tracking-tight flex items-center gap-2">💻 Coding Snippets</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {allLessons.filter(l => l.type === 'programming').map((lesson, index) => {
                const isCompleted = stats.completedLessons.includes(lesson.id);
                const earnedStars = isCompleted ? calculateStars(lesson.id) : 0;
                
                return (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    key={lesson.id}
                    onClick={() => onSelectLesson(lesson)}
                    className="relative flex flex-col bg-white dark:bg-slate-800 p-6 rounded-xl cursor-pointer hover:shadow-md border border-slate-200 dark:border-slate-700 hover:border-indigo-400 dark:hover:border-indigo-500 transition-all group"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-bold text-lg text-slate-800 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{lesson.title}</h3>
                        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">{lesson.description}</p>
                      </div>
                      {isCompleted && (
                        <div className="flex gap-0.5 text-yellow-400">
                          {Array.from({ length: earnedStars }).map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-current" />
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="mt-auto bg-slate-50 dark:bg-slate-900 p-3 rounded-lg border border-slate-100 dark:border-slate-700/50 font-mono text-xs text-slate-600 dark:text-slate-300 overflow-hidden text-ellipsis line-clamp-3">
                      {lesson.content}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
"""
content = content.replace("</div>\n\n        </div>\n      </div>", "</div>\n" + prog_section + "\n        </div>\n      </div>")

avatar_picker = """
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
"""
content = content.replace("      <AnimatePresence>\n        {unlockConfirmLesson &&", avatar_picker + "\n      <AnimatePresence>\n        {unlockConfirmLesson &&")

with open("src/components/Dashboard.tsx", "w") as f:
    f.write(content)
print("Done")
