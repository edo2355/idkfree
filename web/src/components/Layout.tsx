import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';

interface Props {
  children: ReactNode;
}

export function Layout({ children }: Props) {
  const { user, logout } = useAuthStore();

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 10,
        background: 'var(--bg)',
        borderBottom: '1px solid var(--border)',
        padding: '14px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <div style={{ width: 80 }} />
        <Link to="/" style={{
          fontFamily: 'var(--font-display)',
          fontStyle: 'italic',
          fontSize: 24,
          fontWeight: 900,
          letterSpacing: 0.5,
          color: 'var(--text)',
          textDecoration: 'none',
        }}>
          IDKFREE
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          {user && (
            <>
              <Link to={`/u/${user.alias}`} style={{
                width: 32,
                height: 32,
                borderRadius: 16,
                background: 'var(--surface-elevated)',
                border: '1px solid var(--border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--text)',
                fontFamily: 'var(--font-ui)',
                fontWeight: 500,
                fontSize: 14,
                textDecoration: 'none',
              }}>
                {user.alias?.charAt(0).toUpperCase() ?? '?'}
              </Link>
              <button onClick={logout} style={{
                color: 'var(--text-muted)',
                fontSize: 13,
                fontFamily: 'var(--font-ui)',
              }}>
                Salir
              </button>
            </>
          )}
        </div>
      </header>
      <main>{children}</main>
    </div>
  );
}
