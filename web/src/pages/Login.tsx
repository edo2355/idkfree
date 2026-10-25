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
      // Creamos una promesa de timeout de 15 segundos
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('El servidor tardó demasiado en responder. Verifica tu conexión.')), 15000)
      );

      // Hacemos la petición real y competimos contra el tiempo
      const res: any = await Promise.race([
        api.auth.login(email, password),
        timeoutPromise
      ]);

      // Mapeamos la respuesta del backend al formato que espera el store
      const userData = {
        id: res.userId,
        alias: res.alias,
        name: res.alias // Usamos el alias como nombre si no viene
      };

      // Guardamos la sesión con el token correcto
      setAuth(userData, res.accessToken);
      navigate('/home');
    } catch (err: any) {
      setError(err.message || 'Credenciales inválidas');
    } finally {
      // ESTO ES VITAL: Pase lo que pase, apagamos el "VERIFICANDO..."
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
          <Link to='/recovery' style={{ color: '#ff0044', fontSize: '12px', display: 'block', marginTop: '15px', textAlign: 'center' }}>Recuperar cuenta con Carnet</Link>
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
            <img 
              src="/logo-edo.svg" 
              alt="Edo Amate" 
              style={{ 
                width: '100%', 
                maxWidth: '280px', // Aquí controlas el tamaño máximo real
                height: 'auto',
                objectFit: 'contain',
                filter: 'brightness(0) invert(1)', 
                opacity: 0.9, // Un poco más visible
                margin: '20px auto 0',
                transform: 'scale(1.1)' // Truco visual para agrandarlo un 10% extra
              }} 
            />
          </div>

        </div>
      </div>
    
      <div style={{ textAlign: 'center', marginTop: '30px', fontSize: '12px', color: '#a0a5b1', fontFamily: 'Space Mono' }}>
        ¿Problemas con tu cuenta? <a href="mailto:eduardorafaelamatevaldes@gmail.com" style={{ color: '#00E5FF', textDecoration: 'underline' }}>Contacta a Soporte</a>
      </div>
</div>
  );
}
