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
    <div className="clean-bg" style={{ display: 'flex', flexDirection: 'column', position: 'relative' }}>
      
      {/* ESQUINAS TÁCTICAS (Líneas finas) */}
      <div style={{ position: 'absolute', top: 30, left: 30, width: 20, height: 20, borderTop: '1px solid rgba(255,255,255,0.2)', borderLeft: '1px solid rgba(255,255,255,0.2)' }}></div>
      <div style={{ position: 'absolute', top: 30, right: 30, width: 20, height: 20, borderTop: '1px solid rgba(255,255,255,0.2)', borderRight: '1px solid rgba(255,255,255,0.2)' }}></div>
      <div style={{ position: 'absolute', bottom: 30, left: 30, width: 20, height: 20, borderBottom: '1px solid rgba(255,255,255,0.2)', borderLeft: '1px solid rgba(255,255,255,0.2)' }}></div>
      <div style={{ position: 'absolute', bottom: 30, right: 30, width: 20, height: 20, borderBottom: '1px solid rgba(255,255,255,0.2)', borderRight: '1px solid rgba(255,255,255,0.2)' }}></div>

      {/* HUD SUPERIOR MINIMALISTA */}
      <div style={{ width: '100%', padding: '20px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: 'Space Mono', fontSize: '11px', color: 'var(--text-muted)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span className="text-tactical">IDKFREE_SYS</span>
        </div>
        <div style={{ display: 'flex', gap: '20px' }}>
          <span className="text-tactical">LATENCY: 24ms</span>
          <span className="text-tactical">V2.0</span>
        </div>
      </div>

      {/* CONTENEDOR CENTRAL */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
        
        <div className="glass-panel" style={{ 
          width: '100%', 
          maxWidth: '400px', 
          padding: '40px 40px 30px 40px',
          display: 'flex',
          flexDirection: 'column',
        }}>
          
          {/* BRANDING: IDK GRANDE Y FREE DEBAJO */}
          <div style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <h1 style={{ fontSize: '54px', fontWeight: '800', letterSpacing: '8px', color: '#fff', margin: 0, lineHeight: 0.9 }}>
                IDK
              </h1>
              <h2 style={{ fontSize: '14px', fontWeight: '400', letterSpacing: '16px', color: 'var(--text-muted)', margin: '8px 0 0 4px', textTransform: 'uppercase' }}>
                FREE
              </h2>
            </div>
            <div style={{ textAlign: 'right', marginTop: '5px' }}>
              <span className="text-tactical">[ AUTH ]</span>
              <div style={{ width: '8px', height: '8px', backgroundColor: 'var(--accent-subtle)', marginLeft: 'auto', marginTop: '10px' }}></div>
            </div>
          </div>

          {error && (
            <div style={{ color: '#ff4d4f', marginBottom: '20px', fontSize: '12px', fontFamily: 'Space Mono' }}>
              [ ERROR: {error} ]
            </div>
          )}

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
            
            <div>
              <label className="text-tactical" style={{ display: 'block', marginBottom: '5px' }}>Usuario / Email</label>
              <input 
                type="email" 
                className="input-minimal" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
              />
            </div>

            <div>
              <label className="text-tactical" style={{ display: 'block', marginBottom: '5px' }}>Contraseña</label>
              <input 
                type="password" 
                className="input-minimal" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              style={{ 
                marginTop: '10px', 
                width: '100%', 
                padding: '16px', 
                background: 'rgba(255,255,255,0.03)', 
                color: '#fff', 
                border: '1px solid var(--glass-border)', 
                borderRadius: '4px', 
                fontSize: '12px', 
                fontWeight: '600', 
                fontFamily: 'Space Mono', 
                letterSpacing: '3px', 
                cursor: loading ? 'not-allowed' : 'pointer', 
                transition: 'all 0.3s'
              }}
              onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.borderColor = 'var(--glass-border-hover)'; }}
              onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.borderColor = 'var(--glass-border)'; }}
            >
              {loading ? 'VERIFICANDO...' : 'INICIAR SESIÓN'}
            </button>
          </form>

          {/* Enlaces del footer del formulario */}
          <div style={{ marginTop: '25px', display: 'flex', justifyContent: 'space-between' }}>
            <Link to="/register" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '10px', fontFamily: 'Space Mono', letterSpacing: '1px' }}>
              CREAR CUENTA
            </Link>
            <Link to="/recover" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '10px', fontFamily: 'Space Mono', letterSpacing: '1px' }}>
              RECUPERAR
            </Link>
          </div>

          {/* LOGO EDO AMATE EN EL FONDO DEL PANEL */}
          <div style={{ marginTop: '40px', display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: 0.4 }}>
            <svg width="60" height="25" viewBox="0 0 100 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 20 L25 10 L40 20 L25 30 Z" fill="#ffffff" opacity="0.8"/>
              <text x="50" y="18" textAnchor="middle" fill="#ffffff" fontSize="16" fontFamily="Space Mono" fontWeight="bold" letterSpacing="4">edo</text>
              <text x="50" y="30" textAnchor="middle" fill="#888888" fontSize="8" fontFamily="Space Mono" letterSpacing="3">AMATE</text>
            </svg>
          </div>

        </div>
      </div>
    </div>
  );
}
