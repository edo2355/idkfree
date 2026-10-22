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
      
      {/* ESQUINAS TÁCTICAS (El detalle de las imágenes) */}
      <div style={{ position: 'absolute', top: 30, left: 30, width: 20, height: 20, borderTop: '1px solid rgba(255,255,255,0.3)', borderLeft: '1px solid rgba(255,255,255,0.3)' }}></div>
      <div style={{ position: 'absolute', top: 30, right: 30, width: 20, height: 20, borderTop: '1px solid rgba(255,255,255,0.3)', borderRight: '1px solid rgba(255,255,255,0.3)' }}></div>
      <div style={{ position: 'absolute', bottom: 30, left: 30, width: 20, height: 20, borderBottom: '1px solid rgba(255,255,255,0.3)', borderLeft: '1px solid rgba(255,255,255,0.3)' }}></div>
      <div style={{ position: 'absolute', bottom: 30, right: 30, width: 20, height: 20, borderBottom: '1px solid rgba(255,255,255,0.3)', borderRight: '1px solid rgba(255,255,255,0.3)' }}></div>

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
          maxWidth: '380px', 
          padding: '40px',
          display: 'flex',
          flexDirection: 'column',
        }}>
          
          <div style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <div>
              <h1 style={{ fontSize: '24px', fontWeight: '500', letterSpacing: '4px', color: '#fff', margin: 0 }}>
                ACCESO
              </h1>
              <p style={{ color: 'var(--text-muted)', fontSize: '12px', marginTop: '5px' }}>
                Identifícate para continuar
              </p>
            </div>
            <div style={{ width: '6px', height: '6px', backgroundColor: 'var(--accent-subtle)' }}></div>
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
                marginTop: '15px', 
                width: '100%', 
                padding: '16px', 
                background: 'rgba(255,255,255,0.05)', 
                color: '#fff', 
                border: '1px solid var(--glass-border)', 
                borderRadius: '4px', 
                fontSize: '12px', 
                fontWeight: '600', 
                fontFamily: 'Space Mono', 
                letterSpacing: '2px', 
                cursor: loading ? 'not-allowed' : 'pointer', 
                transition: 'all 0.3s'
              }}
              onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.borderColor = 'var(--glass-border-hover)'; }}
              onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.borderColor = 'var(--glass-border)'; }}
            >
              {loading ? 'VERIFICANDO...' : 'INICIAR SESIÓN'}
            </button>
          </form>

          {/* Footer del panel */}
          <div style={{ marginTop: '40px', display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--glass-border)', paddingTop: '20px' }}>
            <Link to="/register" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '11px', fontFamily: 'Space Mono' }}>
              CREAR CUENTA
            </Link>
            <Link to="/recover" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '11px', fontFamily: 'Space Mono' }}>
              RECUPERAR
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
