import type { ReactNode } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { Sidebar } from './Sidebar';

interface Props {
  children: ReactNode;
}

export function Layout({ children }: Props) {
  const logout = useAuthStore((s) => s.clearAuth);
  const navigate = useNavigate();

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg)' }}>
      {/* Barra Lateral */}
      <Sidebar />

      {/* Contenido Principal */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Header superior simple (para el botón de salir) */}
        <header style={{
          display: 'flex',
          justifyContent: 'flex-end',
          padding: '16px 20px',
          borderBottom: '1px solid var(--border)',
        }}>
          <button onClick={() => { logout(); navigate('/'); }} style={{
            background: 'transparent',
            color: 'var(--text-muted)',
            border: 'none',
            cursor: 'pointer',
            fontSize: 14
          }}>
            Salir
          </button>
        </header>

        {/* Área de la página */}
        <main style={{ flex: 1 }}>
          {children}
        </main>
      </div>
    </div>
  );
}
