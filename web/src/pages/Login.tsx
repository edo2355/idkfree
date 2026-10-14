import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api, ApiError } from '../api/client';
import { useAuthStore } from '../stores/authStore';
import { Button } from '../components/Button';
import { Input } from '../components/Input';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const setAuth = useAuthStore((s) => s.setAuth);
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await api.auth.login(email, password);
      setAuth({ id: res.userId, alias: res.alias }, res.accessToken);
      navigate('/');
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Error de conexión');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 24,
      background: 'var(--bg)',
    }}>
      <form
        onSubmit={handleSubmit}
        style={{
          width: '100%',
          maxWidth: 400,
          display: 'flex',
          flexDirection: 'column',
          gap: 20,
        }}
      >
        {/* Logo + título */}
        <div style={{ textAlign: 'center', marginBottom: 8 }}>
          <div style={{ fontSize: 60, marginBottom: 8, color: 'var(--text)' }}>◇</div>
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontStyle: 'italic',
            fontSize: 42,
            fontWeight: 900,
            letterSpacing: 1,
            color: 'var(--text)',
          }}>
            IDKFREE
          </h1>
          <p style={{
            color: 'var(--text-muted)',
            fontSize: 15,
            marginTop: 6,
            letterSpacing: 0.5,
          }}>
            No lo sé, gratis o libre
          </p>
        </div>

        <Input
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="tu@email.com"
          required
        />

        <Input
          label="Contraseña"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          required
        />

        {error && (
          <div style={{
            padding: 12,
            background: 'rgba(239,68,68,0.1)',
            border: '1px solid var(--danger)',
            color: 'var(--danger)',
            borderRadius: 'var(--radius)',
            fontSize: 14,
          }}>
            {error}
          </div>
        )}

        <Button type="submit" size="lg" loading={loading}>
          Entrar
        </Button>

        <div style={{
          textAlign: 'center',
          fontSize: 15,
          color: 'var(--text)',
          marginTop: 4,
        }}>
          <Link to="/register" style={{ color: 'var(--text)' }}>
            Crear cuenta
          </Link>
        </div>

        {/* Firma Edo Amate */}
        <div style={{
          textAlign: 'center',
          marginTop: 40,
          paddingTop: 24,
          borderTop: '1px solid var(--border)',
        }}>
          <div style={{
            fontSize: 12,
            color: 'var(--text-muted)',
            letterSpacing: 3,
            marginBottom: 8,
            textTransform: 'lowercase',
          }}>
            from
          </div>
          <div style={{
            fontFamily: 'var(--font-display)',
            fontStyle: 'italic',
            fontSize: 24,
            fontWeight: 700,
            color: 'var(--text)',
            letterSpacing: 1,
          }}>
            edo amate
          </div>
        </div>
      </form>
    </div>
  );
}
