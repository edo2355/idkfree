import { create } from 'zustand';
import { mobileStorage } from '../utils/storage';

export interface AuthUser { id: string; alias: string; name?: string | null; }

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isLoading: boolean;
  setAuth: (user: AuthUser, token: string) => void;
  clearAuth: () => void;
  setLoading: (loading: boolean) => void;
  restore: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null, token: null, isLoading: true,
  setAuth: (user, token) => { mobileStorage.setToken(token); set({ user, token, isLoading: false }); },
  clearAuth: () => { mobileStorage.removeToken(); set({ user: null, token: null, isLoading: false }); },
  setLoading: (isLoading) => set({ isLoading }),
  restore: async () => {
    const token = await mobileStorage.getToken();
    if (!token) { set({ isLoading: false }); return; }
    set({ token });
  },
}));