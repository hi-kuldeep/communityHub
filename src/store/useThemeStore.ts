import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ThemeState {
  themeMode: 'light' | 'dark';
  setThemeMode: (mode: 'light' | 'dark') => void;
  toggleThemeMode: () => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      themeMode: 'light',
      setThemeMode: (themeMode) => set({ themeMode }),
      toggleThemeMode: () =>
        set((state) => ({
          themeMode: state.themeMode === 'light' ? 'dark' : 'light',
        })),
    }),
    {
      name: 'theme-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
