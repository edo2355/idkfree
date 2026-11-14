import { create } from 'zustand';

interface AuthState {
  token: string | null;
  user: { alias: string; id: string } | null;
  login: (alias: string) => void; // Simulamos el login
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: localStorage.getItem('idk_token'),
  user: JSON.parse(localStorage.getItem('idk_user') || 'null'),
  
  login: (alias: string) => {
    // Simulamos un token y un usuario sin llamar al backend
    const fakeToken = 'mock_token_12345';
    const fakeUser = { alias: alias || 'EDO_ADMIN', id: 'usr_001' };
    
    localStorage.setItem('idk_token', fakeToken);
    localStorage.setItem('idk_user', JSON.stringify(fakeUser));
    set({ token: fakeToken, user: fakeUser });
  },
  
  logout: () => {
    localStorage.removeItem('idk_token');
    localStorage.removeItem('idk_user');
    set({ token: null, user: null });
  },
}));
