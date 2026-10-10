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
  const [name, setName] = useState('');
  const [pinPanic, setPinPanic] = useState('');
  const [pinRecovery, setPinRecovery] = useState('');
  const [pinDestroy, setPinDestroy] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await api.auth.register({
        email,
        alias,
        password,
        name: name || undefined,
        pins: {
          panic: pinPanic,
          recovery: pinRecovery,
          destroy: pinDestroy,
        },
      });

      // Tras registrarse, redirigimos al login
      navigate('/login', {
        state: { message: 'Cuenta creada. Guarda tu carnet e inicia sesión.' },
      });
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
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          background: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-lg)',
          padding: 32,
          width: '100%',
          maxWidth: 440,
          display: 'flex',
          flexDirection: 'column',
          gap: 20,
        }}
      >
        <h1 style={{ fontSize: 22, fontWeight: 700, textAlign: 'center' }}>
          Crear cuenta en Aldea
        </h1>

        <Input
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <Input
          label="Alias"
          value={alias}
          onChange={(e) => setAlias(e.target.value.toLowerCase())}
          placeholder="ana_garcia"
          hint="Solo minúsculas, números y guión bajo"
          required
        />

        <Input
          label="Nombre (opcional)"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <Input
          label="Contraseña"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          hint="Mínimo 12 caracteres, 1 mayúscula, 1 minúscula, 1 número"
          required
        />

        <div
          style={{
            borderTop: '1px solid var(--color-border)',
            paddingTop: 16,
            marginTop: 8,
          }}
        >
          <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 12 }}>
            🔑 Elige tus 3 PINs (4 dígitos cada uno)
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <Input
              label="🚨 PIN de Pánico"
              type="text"
              inputMode="numeric"
              maxLength={4}
              value={pinPanic}
              onChange={(e) => setPinPanic(e.target.value.replace(/\D/g, ''))}
              placeholder="0000"
              required
            />
            <Input
              label="🔓 PIN de Restablecer"
              type="text"
              inputMode="numeric"
              maxLength={4}
              value={pinRecovery}
              onChange={(e) => setPinRecovery(e.target.value.replace(/\D/g, ''))}
              placeholder="0000"
              required
            />
            <Input
              label="🕊️ PIN de Fénix"
              type="text"
              inputMode="numeric"
              maxLength={4}
              value={pinDestroy}
              onChange={(e) => setPinDestroy(e.target.value.replace(/\D/g, ''))}
              placeholder="0000"
              required
            />
          </div>
        </div>

        {error && (
          <div
            style={{
              padding: 10,
              background: '#FEE',
              color: 'var(--color-danger)',
              borderRadius: 'var(--radius)',
              fontSize: 14,
            }}
          >
            {error}
          </div>
        )}

        <Button type="submit" size="lg" loading={loading}>
          Crear cuenta
        </Button>

        <div style={{ textAlign: 'center', fontSize: 14 }}>
          ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
        </div>
      </form>
    </div>
  );
}