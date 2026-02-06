import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

const SOUND_STORAGE_KEY = 'sound-enabled';

type SoundContextType = {
  soundEnabled: boolean;
  toggleSound: () => void;
};

const SoundContext = createContext<SoundContextType | undefined>(undefined);

export const SoundProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
    const stored = localStorage.getItem(SOUND_STORAGE_KEY);
    return stored !== null ? stored === 'true' : true; // Por defecto activado
  });

  useEffect(() => {
    localStorage.setItem(SOUND_STORAGE_KEY, soundEnabled.toString());
  }, [soundEnabled]);

  const toggleSound = () => {
    setSoundEnabled(prev => !prev);
  };

  return (
    <SoundContext.Provider value={{ soundEnabled, toggleSound }}>
      {children}
    </SoundContext.Provider>
  );
};

export const useSound = () => {
  const context = useContext(SoundContext);
  if (context === undefined) {
    throw new Error('useSound debe usarse dentro de un SoundProvider');
  }
  return context;
};
