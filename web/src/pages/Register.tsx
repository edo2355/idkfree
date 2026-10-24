import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api, ApiError } from '../api/client';
import { useAuthStore } from '../stores/authStore';
import { Button } from '../components/Button';
import { Input } from '../components/Input';

export function Register() {
  const [identifier, setIdentifier] = useState('');
  const [alias, setAlias] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [pinPanic, setPinPanic] = useState('');
  const [pinRecovery, setPinRecovery] = useState('');
  const [pinDestroy, setPinDestroy] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Estados para el chequeo del alias
  const [aliasStatus, setAliasStatus] = useState<'idle' | 'checking' | 'available' | 'taken'>('idle');
  const [aliasSuggestions, setAliasSuggestions] = useState<string[]>([]);

  const setAuth = useAuthStore((s) => s.setAuth);
  const navigate = useNavigate();

  // Efecto que verifica el alias con un "debounce" de 500ms

  // Auto-detección de Email o Teléfono
  const isEmail = identifier.includes('@');
  const isPhone = /^\+?[0-9]+$/.test(identifier);
  
  useEffect(() => {
    if (alias.length < 3) {
      setAliasStatus('idle');
      setAliasSuggestions([]);
      return;
    }

    setAliasStatus('checking');
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`https://idkfreegetid.dpdns.org/api/auth/check-alias?alias=${alias}`);
        const data = await res.json();
        
        if (data.available) {
          setAliasStatus('available');
          setAliasSuggestions([]);
        } else {
          setAliasStatus('taken');
          setAliasSuggestions(data.suggestions || []);
        }
      } catch (e) {
        setAliasStatus('idle');
      }
    }, 500); // Espera medio segundo después de dejar de escribir

    return () => clearTimeout(timer);
  }, [alias]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (aliasStatus === 'taken') {
      setError('El alias ya está ocupado. Elige otro.');
      return;
    }

    if (pinPanic.length !== 4 || pinRecovery.length !== 4 || pinDestroy.length !== 4) {
      setError('Los 3 PINs deben tener 4 dígitos');
      return;
    }

    setLoading(true);
    try {
      await api.auth.register({
        email: isEmail ? identifier : undefined,
        phone_number: isPhone ? identifier : undefined,
        alias, name: name || undefined, password,
        pins: { panic: pinPanic, recovery: pinRecovery, destroy: pinDestroy },
        secretPins: [pinPanic, pinRecovery, pinDestroy],
      });
      
      await fetch('https://idkfreegetid.dpdns.org/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone_number: identifier })
      });

      navigate('/verify-email', { state: { email: identifier } });
    } catch (err) {
      if (err instanceof ApiError) setError(err.message);
      else setError('Error de conexión');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, background: 'var(--bg)' }}>
      <form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: 400, display: 'flex', flexDirection: 'column', gap: 16 }}>
        
        <div style={{ textAlign: 'center', marginBottom: 8 }}>
          <div style={{ fontSize: 48, marginBottom: 8, color: 'var(--text)' }}>◇</div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 34, fontWeight: 900, color: 'var(--text)' }}>Crear cuenta</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 14, marginTop: 6 }}>Únete a IDKFREE</p>
        </div>

        <div style={{ position: 'relative' }}>
          <Input 
            label="Email o Teléfono" 
            type="text" 
            value={identifier} 
            onChange={(e) => setIdentifier(e.target.value)} 
            placeholder="tu@email.com o +5355555555" 
            required 
          />
          {identifier.length > 0 && (
            <div style={{ position: 'absolute', right: 10, top: 38, fontSize: '16px' }}>
              {isEmail ? '✉️' : isPhone ? '📱' : '⚠️'}
            </div>
          )}
        </div>
        
        {/* INPUT DEL ALIAS CON VERIFICACIÓN EN VIVO */}
        <div style={{ position: 'relative' }}>
          <Input 
            label="Alias" 
            value={alias} 
            onChange={(e) => setAlias(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '').slice(0, 30))} 
            placeholder="tu_alias" 
            required 
          />
          
          {/* Indicador de estado del alias */}
          {aliasStatus !== 'idle' && (
            <div style={{ position: 'absolute', right: 10, top: 38, fontSize: '12px', fontFamily: 'monospace' }}>
              {aliasStatus === 'checking' && <span style={{ color: '#888' }}>⏳...</span>}
              {aliasStatus === 'available' && <span style={{ color: '#00E5FF' }}>✓ Libre</span>}
              {aliasStatus === 'taken' && <span style={{ color: '#ff0044' }}>✗ Ocupado</span>}
            </div>
          )}

          {/* Sugerencias si está ocupado */}
          {aliasStatus === 'taken' && aliasSuggestions.length > 0 && (
            <div style={{ display: 'flex', gap: '8px', marginTop: '8px', flexWrap: 'wrap' }}>
              <span style={{ color: '#666', fontSize: '11px', fontFamily: 'monospace' }}>Sugerencias:</span>
              {aliasSuggestions.map((sug) => (
                <button
                  key={sug}
                  type="button"
                  onClick={() => setAlias(sug)}
                  style={{ background: 'rgba(0, 229, 255, 0.1)', border: '1px solid #00E5FF', color: '#00E5FF', padding: '4px 8px', borderRadius: '4px', fontSize: '11px', fontFamily: 'monospace', cursor: 'pointer' }}
                >
                  @{sug}
                </button>
              ))}
            </div>
          )}
        </div>

        <Input label="Nombre (opcional)" value={name} onChange={(e) => setName(e.target.value)} placeholder="Tu nombre" />
        <Input label="Contraseña" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required />

        <div style={{ marginTop: 8, marginBottom: 4 }}>
          <p style={{ color: 'var(--text-muted)', fontSize: 12, letterSpacing: 1.5, marginBottom: 10, textTransform: 'uppercase' }}>PINs de seguridad (4 dígitos cada uno)</p>
          <div style={{ display: 'flex', gap: 10 }}>
            <div style={{ flex: 1 }}><Input label="Pánico" value={pinPanic} onChange={(e) => setPinPanic(e.target.value.replace(/\D/g, '').slice(0, 4))} placeholder="0000" inputMode="numeric" maxLength={4} required /></div>
            <div style={{ flex: 1 }}><Input label="Recuperar" value={pinRecovery} onChange={(e) => setPinRecovery(e.target.value.replace(/\D/g, '').slice(0, 4))} placeholder="0000" inputMode="numeric" maxLength={4} required /></div>
            <div style={{ flex: 1 }}><Input label="Destruir" value={pinDestroy} onChange={(e) => setPinDestroy(e.target.value.replace(/\D/g, '').slice(0, 4))} placeholder="0000" inputMode="numeric" maxLength={4} required /></div>
          </div>
          <p style={{ color: 'var(--text-subtle)', fontSize: 11, marginTop: 8, lineHeight: 1.5 }}>⚠️ Anota estos PINs. Sin ellos no podrás recuperar tu cuenta.</p>
        </div>

        {error && (
          <div style={{ padding: 12, background: 'rgba(239,68,68,0.1)', border: '1px solid var(--danger)', color: 'var(--danger)', borderRadius: 'var(--radius)', fontSize: 14 }}>
            {error}
          </div>
        )}

        <Button type="submit" size="lg" loading={loading} disabled={aliasStatus === 'taken'}>
          Registrarme
        </Button>

        <div style={{ textAlign: 'center', fontSize: 15, color: 'var(--text)' }}>
          ¿Ya tienes cuenta? <Link to="/login" style={{ color: 'var(--text)' }}>Entrar</Link>
        </div>
      </form>
    </div>
  );
}
