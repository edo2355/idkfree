import { create } from 'zustand';

interface User {
  id: string;
  alias: string;
  name?: string;
  bio?: string;
}

interface AuthState {
  token: string | null;
  user: User | null;
  login: (token: string, user: any) => void;
  updateUser: (data: Partial<User>) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  token: localStorage.getItem('idk_token'),
  user: JSON.parse(localStorage.getItem('idk_user') || 'null'),
  
  login: (token, user) => {
    localStorage.setItem('idk_token', token);
    localStorage.setItem('idk_user', JSON.stringify(user));
    set({ token, user });
  },
  
  updateUser: (data) => {
    const currentUser = get().user;
    if (!currentUser) return;
    const updatedUser = { ...currentUser, ...data };
    localStorage.setItem('idk_user', JSON.stringify(updatedUser));
    set({ user: updatedUser });
  },
  
  logout: () => {
    localStorage.removeItem('idk_token');
    localStorage.removeItem('idk_user');
    set({ token: null, user: null });
  },
}));
