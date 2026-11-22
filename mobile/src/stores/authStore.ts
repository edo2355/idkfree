import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface User {
  id: string;
  alias: string;
  name?: string;
  bio?: string;
  email?: string;
  phone_number?: string;
  avatar_url?: string;
}

interface AuthState {
  token: string | null;
  user: User | null;
  isLoading: boolean;
  setAuth: (token: string, user: User) => Promise<void>;
  clearAuth: () => Promise<void>;
  loadToken: () => Promise<void>;
  login: (token: string) => Promise<void>; // Compatibilidad con la nueva pantalla
  logout: () => Promise<void>; // Compatibilidad con la nueva pantalla
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,
  isLoading: true,
  setAuth: async (token, user) => {
    await AsyncStorage.setItem('idk_token', token);
    await AsyncStorage.setItem('idk_user', JSON.stringify(user));
    set({ token, user, isLoading: false });
  },
  clearAuth: async () => {
    await AsyncStorage.removeItem('idk_token');
    await AsyncStorage.removeItem('idk_user');
    set({ token: null, user: null, isLoading: false });
  },
  loadToken: async () => {
    const token = await AsyncStorage.getItem('idk_token');
    const userStr = await AsyncStorage.getItem('idk_user');
    const user = userStr ? JSON.parse(userStr) : null;
    set({ token, user, isLoading: false });
  },
  login: async (token) => {
    await AsyncStorage.setItem('idk_token', token);
    set({ token, isLoading: false });
  },
  logout: async () => {
    await AsyncStorage.removeItem('idk_token');
    set({ token: null, user: null, isLoading: false });
  },
}));

// Alias para que las pantallas nuevas funcionen
export const useAuth = useAuthStore;
