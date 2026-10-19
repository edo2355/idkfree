import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
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
      {/* Barra Lateral Izquierda */}
      <Sidebar />

      {/* Contenido de la Página */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <header style={{
          display: 'flex',
          justifyContent: 'flex-end',
          padding: '16px 20px',
          borderBottom: '1px solid var(--border)',
          position: 'sticky',
          top: 0,
          zIndex: 10,
          background: 'rgba(5, 5, 5, 0.8)',
          backdropFilter: 'blur(10px)',
        }}>
          <button onClick={() => { logout(); navigate('/'); }} style={{
            background: 'transparent',
            color: 'var(--text-muted)',
            border: 'none',
            cursor: 'pointer',
            fontSize: 14,
          }}>
            Salir
          </button>
        </header>

        <main style={{ flex: 1 }}>
          {children}
        </main>
      </div>
    </div>
  );
}
