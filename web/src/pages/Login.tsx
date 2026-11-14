import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { Terminal, Mail, Lock } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('https://idkfree.onrender.com/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || 'Credenciales inválidas');
      
      // 🛠️ FIX: Tu backend devuelve accessToken, userId y alias en la raíz
      const authToken = data.accessToken;
      const authUser = { alias: data.alias, id: data.userId };

      if (!authToken) throw new Error('El servidor no devolvió un token válido');

      // Guardamos el token real y el usuario en Zustand
      login(authToken, authUser);
      
      // Navegamos al Feed
      navigate('/feed');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-dark flex flex-col items-center justify-center p-4 relative font-sans">
      <div className="absolute top-10 left-10 text-gray-600 text-xs font-mono hidden md:block">SYS.AUTH // SEC-LEVEL: 01</div>
      
      <div className="w-full max-w-md border border-brand-border bg-brand-panel p-8 relative">
        <div className="flex items-center gap-3 mb-8 text-white">
          <Terminal size={24} className="text-brand-blue" />
          <h1 className="text-xl font-mono tracking-widest">IDKFREE_AUTH</h1>
        </div>

        {error && <div className="bg-red-500/10 border border-red-500 text-red-500 p-3 text-xs font-mono mb-4">{error}</div>}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="text-xs text-gray-500 font-mono mb-2 block">EMAIL / NODE_ID</label>
            <div className="flex items-center border border-brand-border bg-[#000] p-3 focus-within:border-brand-blue transition-colors">
              <Mail size={16} className="text-gray-500 mr-3" />
              <input 
                type="email" required value={email} onChange={e => setEmail(e.target.value)}
                className="bg-transparent border-none outline-none text-white w-full text-sm font-mono"
                placeholder="user@idkfree.os"
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-gray-500 font-mono mb-2 block">PASSWORD</label>
            <div className="flex items-center border border-brand-border bg-[#000] p-3 focus-within:border-brand-blue transition-colors">
              <Lock size={16} className="text-gray-500 mr-3" />
              <input 
                type="password" required value={password} onChange={e => setPassword(e.target.value)}
                className="bg-transparent border-none outline-none text-white w-full text-sm font-mono"
                placeholder="••••••••••••"
              />
            </div>
          </div>

          <button 
            type="submit" disabled={loading}
            className="w-full bg-brand-blue hover:bg-blue-600 text-white font-bold font-mono text-sm py-3 transition-colors disabled:opacity-50 mt-4"
          >
            {loading ? 'VERIFICANDO...' : 'ACCEDER AL SISTEMA'}
          </button>
        </form>

        <div className="mt-6 text-center text-xs font-mono text-gray-600">
          <span>¿No tienes cuenta? </span>
          <Link to="/waitlist" className="text-brand-blue hover:underline">Solicitar Acceso</Link>
        </div>
      </div>
    </div>
  );
}
