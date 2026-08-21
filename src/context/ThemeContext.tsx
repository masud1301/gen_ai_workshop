import React, { createContext, useContext, useEffect, useState } from 'react';
import { ThemeMode, ThemePreset } from '../types';

interface ThemeContextType {
  preset: ThemePreset;
  mode: ThemeMode;
  resolvedDark: boolean;
  setPreset: (preset: ThemePreset) => void;
  setMode: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [preset, setPresetState] = useState<ThemePreset>(() => {
    const saved = localStorage.getItem('smartfix_theme_preset');
    return (saved as ThemePreset) || 'immersive-dark';
  });

  const [mode, setModeState] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('smartfix_theme_mode');
    return (saved as ThemeMode) || 'dark';
  });

  const [resolvedDark, setResolvedDark] = useState<boolean>(true);

  useEffect(() => {
    const root = document.documentElement;

    // Determine dark mode
    let isDark = true;
    if (mode === 'dark') {
      isDark = true;
    } else if (mode === 'light') {
      isDark = false;
    } else {
      isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    }

    // Immersive Dark, Midnight & Aurora are inherently dark-toned themes by design
    if (preset === 'immersive-dark' || preset === 'midnight' || preset === 'aurora') {
      isDark = true;
    }

    setResolvedDark(isDark);

    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    root.setAttribute('data-theme', preset);
  }, [preset, mode]);

  const setPreset = (p: ThemePreset) => {
    setPresetState(p);
    localStorage.setItem('smartfix_theme_preset', p);
  };

  const setMode = (m: ThemeMode) => {
    setModeState(m);
    localStorage.setItem('smartfix_theme_mode', m);
  };

  return (
    <ThemeContext.Provider value={{ preset, mode, resolvedDark, setPreset, setMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
