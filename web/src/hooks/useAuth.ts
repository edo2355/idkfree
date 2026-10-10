// ============================================================
// useAuth.ts
// ------------------------------------------------------------
// Hook para comprobar si hay sesión activa al arrancar.
// ============================================================

import { useEffect } from 'react';
import { api } from '../api/client';
import { useAuthStore } from '../stores/authStore';

export function useAuth() {
  const { user, token, isLoading, setAuth, clearAuth, setLoading } = useAuthStore();

  useEffect(() => {
    async function check() {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await api.auth.me();
        setAuth(
          {
            id: res.user.id,
            alias: res.user.alias,
            name: res.user.name,
          },
          token
        );
      } catch {
        clearAuth();
      }
    }

    check();
  }, []);

  return { user, token, isLoading };
}