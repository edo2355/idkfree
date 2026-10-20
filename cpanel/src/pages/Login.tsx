import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login({ setToken }: { setToken: (t: string) => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Conectamos con tu backend en Render
      const res = await fetch('https://idkfree-api-edo.fly.dev/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Credenciales inválidas');
      }

      // Guardar token y entrar
      localStorage.setItem('@idk_cpanel_token', data.accessToken);
      setToken(data.accessToken);
      navigate('/');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0f1115', color: '#fff' }}>
      <form onSubmit={handleLogin} style={{ background: '#181b21', padding: '40px', borderRadius: '12px', border: '1px solid #2a2e39', width: '350px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
        
        <h1 style={{ textAlign: 'center', margin: '0 0 20px 0', color: '#00f2fe' }}>IDK CPANEL</h1>
        
        {error && <div style={{ background: '#ff4d4f22', color: '#ff4d4f', padding: '10px', borderRadius: '6px', fontSize: '14px', textAlign: 'center' }}>{error}</div>}

        <input 
          type="email" 
          placeholder="Correo electrónico" 
          value={email} onChange={e => setEmail(e.target.value)}
          style={{ background: '#0f1115', border: '1px solid #2a2e39', padding: '12px', borderRadius: '6px', color: '#fff', outline: 'none' }}
        />
        <input 
          type="password" 
          placeholder="Contraseña" 
          value={password} onChange={e => setPassword(e.target.value)}
          style={{ background: '#0f1115', border: '1px solid #2a2e39', padding: '12px', borderRadius: '6px', color: '#fff', outline: 'none' }}
        />

        <button type="submit" disabled={loading} style={{ background: '#00f2fe', color: '#000', border: 'none', padding: '12px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' }}>
          {loading ? 'Entrando...' : 'Iniciar Sesión'}
        </button>
      </form>
    </div>
  );
}
