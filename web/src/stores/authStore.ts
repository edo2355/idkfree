import { create } from 'zustand';

interface AuthState {
  token: string | null;
  user: { alias: string; id: string } | null;
  login: (token: string, user: any) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: localStorage.getItem('idk_token'),
  user: JSON.parse(localStorage.getItem('idk_user') || 'null'),
  login: (token, user) => {
    localStorage.setItem('idk_token', token);
    localStorage.setItem('idk_user', JSON.stringify(user));
    set({ token, user });
  },
  logout: () => {
    localStorage.removeItem('idk_token');
    localStorage.removeItem('idk_user');
    set({ token: null, user: null });
  },
}));
