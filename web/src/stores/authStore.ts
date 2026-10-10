// ============================================================
// authStore.ts
// ------------------------------------------------------------
// Estado global de autenticación.
//
// Guarda el usuario actual y el token. Persiste en localStorage
// para que al recargar la página siga la sesión.
// ============================================================

import { create } from 'zustand';

export interface AuthUser {
  id: string;
  alias: string;
  name?: string | null;
}

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isLoading: boolean;

  // Acciones
  setAuth: (user: AuthUser, token: string) => void;
  clearAuth: () => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: localStorage.getItem('aldea_token'),
  isLoading: true,

  setAuth: (user, token) => {
    localStorage.setItem('aldea_token', token);
    set({ user, token, isLoading: false });
  },

  clearAuth: () => {
    localStorage.removeItem('aldea_token');
    set({ user: null, token: null, isLoading: false });
  },

  setLoading: (isLoading) => set({ isLoading }),
}));