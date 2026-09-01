import { useState } from 'react';
import { Lesson } from '../types';

interface LessonCreatorProps {
  onSave: (lesson: Lesson) => void;
  onCancel: () => void;
}

export function LessonCreator({ onSave, onCancel }: LessonCreatorProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const [difficulty, setDifficulty] = useState<'easy'|'medium'|'hard'>('medium');

  const handleSave = () => {
    if (!title.trim() || !content.trim()) return;
    
    onSave({
      id: Date.now(),
      title,
      description,
      content: content.replace(/\s+/g, ' ').trim(), // sanitize newlines for single line typing
      difficulty,
      type: 'custom'
    });
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6 sm:p-8">
      <div className="mb-8 flex items-center justify-between">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Create Custom Lesson</h2>
        <button onClick={onCancel} className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-medium">Cancel</button>
      </div>

      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6 transition-colors duration-300">
        <div>
          <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Lesson Title</label>
          <input 
            type="text" 
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg px-4 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            placeholder="e.g. Science Vocabulary"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Description</label>
          <input 
            type="text" 
            value={description}
            onChange={e => setDescription(e.target.value)}
            className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg px-4 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            placeholder="Brief description of the lesson"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Difficulty</label>
          <select 
            value={difficulty}
            onChange={e => setDifficulty(e.target.value as any)}
            className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg px-4 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-no-repeat transition-colors"
            style={{ backgroundPosition: 'right 1rem center', backgroundImage: 'url("data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 fill=%27none%27 viewBox=%270 0 20 20%27%3e%3cpath stroke=%27%236b7280%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27 stroke-width=%271.5%27 d=%27M6 8l4 4 4-4%27/%3e%3c/svg%3e")' }}
          >
            <option value="easy" className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white">Easy</option>
            <option value="medium" className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white">Medium</option>
            <option value="hard" className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white">Hard</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Text Content</label>
          <textarea 
            value={content}
            onChange={e => setContent(e.target.value)}
            rows={5}
            className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none font-mono text-lg transition-colors"
            placeholder="Type or paste the text you want to practice..."
          />
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-2">Newlines will be converted to spaces. Ideal length is 50-200 characters.</p>
        </div>

        <div className="pt-4 border-t border-slate-100 dark:border-slate-700">
          <button 
            onClick={handleSave}
            disabled={!title.trim() || !content.trim()}
            className="w-full bg-blue-600 text-white font-bold rounded-lg py-3 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
          >
            Save Lesson
          </button>
        </div>
      </div>
    </div>
  );
}
