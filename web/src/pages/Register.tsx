import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api, ApiError } from '../api/client';
import { useAuthStore } from '../stores/authStore';
import { Button } from '../components/Button';
import { Input } from '../components/Input';

export function Register() {
  const [email, setEmail] = useState('');
  const [alias, setAlias] = useState('');
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
      const res = await api.auth.register({ email, alias, password });
      setAuth({ id: res.userId, alias: res.alias }, res.accessToken);
      navigate('/');
    } catch (err) {
      if (err instanceof ApiError) setError(err.message);
      else setError('Error de conexión');
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
        <div style={{ textAlign: 'center', marginBottom: 8 }}>
          <div style={{ fontSize: 48, marginBottom: 8, color: 'var(--text)' }}>◇</div>
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontStyle: 'italic',
            fontSize: 34,
            fontWeight: 900,
            color: 'var(--text)',
          }}>
            Crear cuenta
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 14, marginTop: 6 }}>
            Únete a IDKFREE
          </p>
        </div>

        <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="tu@email.com" required />
        <Input label="Alias" value={alias} onChange={(e) => setAlias(e.target.value)} placeholder="@tu_alias" required />
        <Input label="Contraseña" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required />

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
          Registrarme
        </Button>

        <div style={{ textAlign: 'center', fontSize: 15, color: 'var(--text)' }}>
          ¿Ya tienes cuenta? <Link to="/login" style={{ color: 'var(--text)' }}>Entrar</Link>
        </div>
      </form>
    </div>
  );
}
