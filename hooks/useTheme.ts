import { create } from 'zustand';
import * as storage from '@/services/storage';

type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeState {
  mode: ThemeMode;
  isDark: boolean;
  setMode: (mode: ThemeMode) => void;
  toggle: () => void;
  init: () => void;
}

function getSystemDark(): boolean {
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

function applyDark(isDark: boolean): void {
  if (isDark) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
}

export const useTheme = create<ThemeState>((set, get) => ({
  mode: 'system',
  isDark: false,

  setMode: (mode: ThemeMode) => {
    storage.setTheme(mode);
    const isDark = mode === 'dark' || (mode === 'system' && getSystemDark());
    applyDark(isDark);
    set({ mode, isDark });
  },

  toggle: () => {
    const { mode } = get();
    if (mode === 'light') {
      get().setMode('dark');
    } else {
      get().setMode('light');
    }
  },

  init: () => {
    const mode = storage.getTheme();
    const isDark = mode === 'dark' || (mode === 'system' && getSystemDark());
    applyDark(isDark);
    set({ mode, isDark });

    // Listen for system theme changes
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => {
      if (get().mode === 'system') {
        const isDark = getSystemDark();
        applyDark(isDark);
        set({ isDark });
      }
    };
    mq.addEventListener('change', handler);
  },
}));
