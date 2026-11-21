import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthState {
  token: string | null;
  login: (token: string) => Promise<void>;
  logout: () => Promise<void>;
  loadToken: () => Promise<void>;
}

export const useAuth = create<AuthState>((set) => ({
  token: null,
  login: async (token) => {
    await AsyncStorage.setItem('idk_token', token);
    set({ token });
  },
  logout: async () => {
    await AsyncStorage.removeItem('idk_token');
    set({ token: null });
  },
  loadToken: async () => {
    const token = await AsyncStorage.getItem('idk_token');
    set({ token });
  },
}));
