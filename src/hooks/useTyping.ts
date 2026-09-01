import { useState, useEffect, useCallback } from 'react';

export function useTyping(text: string, onFinish: (wpm: number, accuracy: number, durationSec: number, score: number) => void, onKeyPress?: (isCorrect: boolean) => void) {
  const [cursorIndex, setCursorIndex] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [status, setStatus] = useState<'idle' | 'typing' | 'finished'>('idle');
  const [lastMistakeIndex, setLastMistakeIndex] = useState<number | null>(null);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (status === 'finished') return;
    
    // Ignore meta keys
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    if (e.key.length > 1) return; // Ignore Shift, Enter, Backspace etc

    // prevent default scrolling on space
    if (e.key === ' ') {
      e.preventDefault();
    }

    const expectedChar = text[cursorIndex];

    if (status === 'idle') {
      if (e.key === expectedChar) {
        setStatus('typing');
        setStartTime(Date.now());
        setCursorIndex(1);
        setLastMistakeIndex(null);
        onKeyPress?.(true);
        if (text.length === 1) {
          setStatus('finished');
          onFinish(0, 100, 0, 1000);
        }
      } else {
        setMistakes(prev => prev + 1);
        setLastMistakeIndex(0);
        onKeyPress?.(false);
      }
      return;
    }

    if (e.key === expectedChar) {
      setCursorIndex(prev => prev + 1);
      setLastMistakeIndex(null);
      onKeyPress?.(true);
      // Check if finished
      if (cursorIndex + 1 === text.length) {
        setStatus('finished');
        const endTime = Date.now();
        const durationSec = Math.round((endTime - (startTime || endTime)) / 1000);
        const durationMin = durationSec / 60;
        const words = text.length / 5;
        const wpm = durationMin > 0 ? Math.round(words / durationMin) : 0;
        const totalKeystrokes = text.length + mistakes;
        const accuracy = Math.max(0, Math.round((text.length / totalKeystrokes) * 100));
        
        // Simple score calculation: 1000 base + wpm * 10 + accuracy * 5
        let score = 0;
        if (accuracy > 80 && wpm > 10) {
           score = Math.round(1000 + (wpm * 20) + (accuracy * 10));
        }
        
        onFinish(wpm, accuracy, durationSec, score);
      }
    } else {
      setMistakes(prev => prev + 1);
      setLastMistakeIndex(cursorIndex);
      onKeyPress?.(false);
    }
  }, [cursorIndex, status, text, startTime, mistakes, onFinish, onKeyPress]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const reset = useCallback(() => {
    setCursorIndex(0);
    setMistakes(0);
    setStartTime(null);
    setStatus('idle');
    setLastMistakeIndex(null);
  }, []);

  return { cursorIndex, mistakes, status, reset, lastMistakeIndex };
}
