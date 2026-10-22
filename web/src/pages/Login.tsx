import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { api } from '../api/client';

export function Login() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await api.auth.login({ email, password });
      setAuth(res.user, res.token);
      navigate('/home');
    } catch (err: any) {
      setError(err.message || 'Credenciales inválidas');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      
      <div className="glass-panel" style={{ 
        width: '100%', 
        maxWidth: '400px', 
        padding: '40px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        
        <div style={{ marginBottom: '30px', textAlign: 'center' }}>
          <h1 style={{ fontSize: '28px', fontWeight: '800', letterSpacing: '4px', color: 'var(--text-main)' }}>
            IDK<span style={{ color: 'var(--accent-warm)' }}>FREE</span>
          </h1>
          <p className="text-tactical" style={{ marginTop: '8px' }}>AUTH_CMD</p>
          <div style={{ width: '40px', height: '2px', background: 'var(--accent-warm)', margin: '12px auto 0' }} />
        </div>

        {error && (
          <div style={{ background: 'rgba(255, 77, 79, 0.1)', color: '#ff4d4f', padding: '12px', borderRadius: '8px', width: '100%', textAlign: 'center', marginBottom: '20px', fontSize: '13px', border: '1px solid rgba(255, 77, 79, 0.3)' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div>
            <label className="text-tactical" style={{ display: 'block', marginBottom: '8px' }}>EMAIL</label>
            <input 
              type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="tu@correo.com" required
              style={{ width: '100%', padding: '14px 16px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', borderRadius: '10px', color: '#fff', fontSize: '15px', outline: 'none' }}
            />
          </div>

          <div>
            <label className="text-tactical" style={{ display: 'block', marginBottom: '8px' }}>CONTRASEÑA</label>
            <input 
              type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required
              style={{ width: '100%', padding: '14px 16px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', borderRadius: '10px', color: '#fff', fontSize: '15px', outline: 'none' }}
            />
          </div>

          <button 
            type="submit" disabled={loading}
            style={{ marginTop: '10px', width: '100%', padding: '16px', background: loading ? 'var(--text-muted)' : 'var(--accent-warm)', color: '#000', border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: '800', fontFamily: 'Space Mono', letterSpacing: '2px', cursor: loading ? 'not-allowed' : 'pointer', boxShadow: loading ? 'none' : '0 0 20px rgba(255, 87, 34, 0.4)' }}
          >
            {loading ? 'AUTENTICANDO...' : 'ENTRAR_'}
          </button>
        </form>

        <div style={{ marginTop: '30px', textAlign: 'center' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>
            ¿No tienes cuenta? <Link to="/register" style={{ color: 'var(--accent-warm)', textDecoration: 'none', fontWeight: '600' }}>Crear una ahora</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
