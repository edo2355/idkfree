import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthState {
  user: any | null;
  token: string | null;
  isLoading: boolean;
  setAuth: (user: any, token: string) => void;
  clearAuth: () => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isLoading: true, // Empezamos cargando
      setAuth: (user, token) => set({ user, token, isLoading: false }),
      clearAuth: () => set({ user: null, token: null, isLoading: false }),
      setLoading: (isLoading) => set({ isLoading }),
    }),
    {
      name: 'idkfree-auth-storage', // El nombre del archivo en el teléfono
      storage: createJSONStorage(() => AsyncStorage),
      // Solo guardamos el user y el token, no el isLoading
      partialize: (state) => ({ user: state.user, token: state.token }),
      onRehydrateStorage: () => (state) => {
        // Cuando termina de leer del disco, apagamos el loading
        if (state) {
          state.setLoading(false);
        }
      },
    }
  )
);
