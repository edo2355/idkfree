import { create } from 'zustand';
import { useColorScheme } from 'react-native';
import { lightTheme } from '../theme/light';
import { darkTheme } from '../theme/dark';

type Theme = 'light' | 'dark' | 'auto';

interface ThemeState { theme: Theme; setTheme: (t: Theme) => void; }

export const useThemeStore = create<ThemeState>((set) => ({
  theme: 'auto',
  setTheme: (theme) => set({ theme }),
}));

export function useTheme() {
  const mode = useThemeStore((s) => s.theme);
  const system = useColorScheme();
  const actual = mode === 'auto' ? (system ?? 'light') : mode;
  return actual === 'dark' ? darkTheme : lightTheme;
}