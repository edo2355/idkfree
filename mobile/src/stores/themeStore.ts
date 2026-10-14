import { create } from 'zustand';
import { useColorScheme } from 'react-native';
import { lightTheme } from '../theme/light';
import { darkTheme } from '../theme/dark';
import { DEFAULT_ACCENT, getAccent, type AccentName } from '../theme/accents';

type Theme = 'light' | 'dark' | 'auto';

interface ThemeState {
  theme: Theme;
  accent: AccentName;
  setTheme: (t: Theme) => void;
  setAccent: (a: AccentName) => void;
}

export const useThemeStore = create<ThemeState>((set) => ({
  theme: 'auto',
  accent: DEFAULT_ACCENT,
  setTheme: (theme) => set({ theme }),
  setAccent: (accent) => set({ accent }),
}));

export function useTheme() {
  const mode = useThemeStore((s) => s.theme);
  const accentName = useThemeStore((s) => s.accent);
  const system = useColorScheme();
  const actual: 'light' | 'dark' = mode === 'auto' ? ((system ?? 'dark') as any) : (mode as any);
  const base = actual === 'dark' ? darkTheme : lightTheme;
  const accentColor = getAccent(accentName, actual);
  return { ...base, accent: accentColor, accentName };
}
