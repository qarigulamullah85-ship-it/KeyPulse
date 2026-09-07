import { useState, useEffect } from 'react';

export function useSettings() {
  const [soundsEnabled, setSoundsEnabled] = useState(() => {
    return localStorage.getItem('soundsEnabled') !== 'false';
  });

  useEffect(() => {
    localStorage.setItem('soundsEnabled', String(soundsEnabled));
  }, [soundsEnabled]);

  return { soundsEnabled, setSoundsEnabled };
}
