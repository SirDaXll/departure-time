import { useRef, useEffect } from 'react';
import { useSound as useSoundContext } from '../contexts/SoundContext';

export const useCelebrationSound = (isTimeUp: boolean) => {
  const hasPlayed = useRef(false);
  const { soundEnabled } = useSoundContext();

  useEffect(() => {
    if (isTimeUp && !hasPlayed.current && soundEnabled) {
      hasPlayed.current = true;
      
      // Crear un contexto de audio
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      // Configurar sonido de celebración (dos tonos)
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime); // C5
      oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.2); // E5
      oscillator.frequency.setValueAtTime(783.99, audioContext.currentTime + 0.4); // G5
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.8);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.8);
    }

    // Resetear cuando el tiempo ya no esté en cero
    if (!isTimeUp) {
      hasPlayed.current = false;
    }
  }, [isTimeUp, soundEnabled]);
};
