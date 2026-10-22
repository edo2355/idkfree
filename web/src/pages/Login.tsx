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
      const res = await api.auth.login(email, password);
      setAuth(res.user, res.token);
      navigate('/home');
    } catch (err: any) {
      setError(err.message || 'Credenciales inválidas');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="tactical-bg" style={{ display: 'flex', flexDirection: 'column' }}>
      
      {/* HUD SUPERIOR */}
      <div style={{ width: '100%', padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--glass-border)', fontFamily: 'Space Mono', fontSize: '11px', color: 'var(--text-muted)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--accent-main)' }}></div>
          <span>IDKFREE.OS</span>
        </div>
        <div style={{ display: 'flex', gap: '20px' }}>
          <span className="text-tactical">SERVIDOR</span>
          <span>V2.0.0_2026</span>
        </div>
      </div>

      {/* CONTENEDOR CENTRAL */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
        
        <div className="glass-panel" style={{ 
          width: '100%', 
          maxWidth: '420px', 
          padding: '40px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          borderTop: '2px solid var(--accent-main)', // Borde superior con el nuevo color
          boxShadow: '0 0 40px rgba(0,0,0,0.8), inset 0 0 20px var(--accent-glow)'
        }}>
          
          <div style={{ marginBottom: '35px', textAlign: 'center', width: '100%' }}>
            <h1 style={{ fontSize: '32px', fontWeight: '800', letterSpacing: '6px', color: '#fff', marginBottom: '5px' }}>
              IDK<span style={{ color: 'var(--accent-main)' }}>FREE</span>
            </h1>
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginTop: '15px' }}>
              <span className="text-tactical">[ AUTH_CMD ]</span>
              <span className="text-tactical">SYS.REQ.01</span>
            </div>
          </div>

          {error && (
            <div style={{ background: 'rgba(255, 77, 79, 0.1)', color: '#ff4d4f', padding: '12px', borderRadius: '4px', width: '100%', textAlign: 'center', marginBottom: '20px', fontSize: '13px', borderLeft: '3px solid #ff4d4f', fontFamily: 'Space Mono' }}>
              ERR: {error}
            </div>
          )}

          <form onSubmit={handleLogin} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            <div>
              <label className="text-tactical" style={{ display: 'block', marginBottom: '8px' }}>EMAIL</label>
              <input 
                type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="tu@email.com" required
                style={{ width: '100%', padding: '14px 16px', background: 'rgba(0,0,0,0.5)', border: '1px solid var(--glass-border)', borderRadius: '4px', color: 'var(--accent-main)', fontSize: '15px', outline: 'none', fontFamily: 'Space Mono' }}
              />
            </div>

            <div>
              <label className="text-tactical" style={{ display: 'block', marginBottom: '8px' }}>CONTRASEÑA</label>
              <input 
                type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required
                style={{ width: '100%', padding: '14px 16px', background: 'rgba(0,0,0,0.5)', border: '1px solid var(--glass-border)', borderRadius: '4px', color: 'var(--accent-main)', fontSize: '15px', outline: 'none', fontFamily: 'Space Mono' }}
              />
            </div>

            <button 
              type="submit" disabled={loading}
              style={{ marginTop: '10px', width: '100%', padding: '16px', background: 'var(--accent-main)', color: '#000', border: 'none', borderRadius: '4px', fontSize: '14px', fontWeight: '800', fontFamily: 'Space Mono', letterSpacing: '2px', cursor: loading ? 'not-allowed' : 'pointer', boxShadow: loading ? 'none' : '0 0 20px var(--accent-glow)' }}
            >
              {loading ? 'AUTENTICANDO...' : 'ENTRAR_'}
            </button>
          </form>

          <div style={{ marginTop: '35px', width: '100%', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <Link to="/register" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '13px', fontFamily: 'Space Mono', display: 'flex', justifyContent: 'space-between' }}>
              <span><span style={{ color: 'var(--accent-main)' }}>&gt;</span> Crear cuenta</span>
              <span style={{ fontSize: '10px', opacity: 0.5 }}>REG</span>
            </Link>
            <Link to="/recover" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '13px', fontFamily: 'Space Mono', display: 'flex', justifyContent: 'space-between' }}>
              <span><span style={{ color: 'var(--accent-main)' }}>&gt;</span> Recuperar cuenta</span>
              <span style={{ fontSize: '10px', opacity: 0.5 }}>REC</span>
            </Link>
          </div>

        </div>
      </div>

      <div style={{ width: '100%', padding: '20px', textAlign: 'center', fontFamily: 'Space Mono', fontSize: '10px', color: 'var(--text-muted)', opacity: 0.5 }}>
        [ CREADO POR EDO AMATE ]
      </div>
    </div>
  );
}
