'use client';

import { useEffect } from 'react';
import { soundManager } from '@/lib/sounds';

export function useSound() {
  useEffect(() => {
    const initSound = () => {
      if (soundManager.isEnabled()) {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        gainNode.gain.value = 0;
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.001);
      }
    };

    initSound();

    const events = ['click', 'touchstart', 'keydown'];
    const handleInteraction = () => {
      initSound();
      events.forEach((event) => {
        document.removeEventListener(event, handleInteraction);
      });
    };

    events.forEach((event) => {
      document.addEventListener(event, handleInteraction, { once: true });
    });

    return () => {
      events.forEach((event) => {
        document.removeEventListener(event, handleInteraction);
      });
    };
  }, []);
}

export { soundManager };

