import type { ReactNode } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';

interface Props {
  children: ReactNode;
}

export function Layout({ children }: Props) {
  const { user, clearAuth } = useAuthStore();
  const navigate = useNavigate();

  function handleLogout() {
    clearAuth();
    navigate('/login');
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Barra superior */}
      <header
        style={{
          borderBottom: '1px solid var(--color-border)',
          background: 'var(--color-surface)',
          padding: '12px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'sticky',
          top: 0,
          zIndex: 10,
        }}
      >
        <Link
          to="/"
          style={{
            fontSize: '20px',
            fontWeight: 700,
            color: 'var(--color-text)',
            textDecoration: 'none',
          }}
        >
          🌱 Aldea
        </Link>

        {user && (
          <nav style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <Link
              to="/"
              style={{ color: 'var(--color-text)', fontSize: '14px' }}
            >
              Feed
            </Link>
            <Link
              to={`/u/${user.alias}`}
              style={{ color: 'var(--color-text)', fontSize: '14px' }}
            >
              @{user.alias}
            </Link>
            <button
              onClick={handleLogout}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--color-text-muted)',
                fontSize: '14px',
              }}
            >
              Salir
            </button>
          </nav>
        )}
      </header>

      {/* Contenido */}
      <main style={{ flex: 1, padding: '24px 16px', maxWidth: 640, margin: '0 auto', width: '100%' }}>
        {children}
      </main>
    </div>
  );
}