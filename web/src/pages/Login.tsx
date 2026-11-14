import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { Lock, User, Terminal } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // SIMULACIÓN: No importa la contraseña, entramos directo
    const alias = email.split('@')[0] || 'EDO_ADMIN';
    login(alias);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4 relative font-mono">
      {/* Adornos técnicos (HUD) */}
      <div className="absolute top-10 left-10 text-gray-600 text-xs hidden md:block">SYS.AUTH // SEC-LEVEL: 01</div>
      <div className="absolute bottom-10 right-10 text-gray-600 text-xs hidden md:block">IP: 192.168.x.x // ENCRYPTED</div>

      <div className="w-full max-w-md border border-gray-800 bg-[#0a0a0a] p-8 relative">
        {/* Cruz de calibración */}
        <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-orange-500"></div>
        <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-orange-500"></div>
        <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-orange-500"></div>
        <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-orange-500"></div>

        <div className="flex items-center gap-3 mb-8 text-white">
          <Terminal size={24} className="text-orange-500" />
          <h1 className="text-xl tracking-widest">IDKFREE_AUTH</h1>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="text-xs text-gray-500 mb-1 block">NODE_ID / EMAIL</label>
            <div className="flex items-center border border-gray-700 bg-black p-2 focus-within:border-orange-500 transition-colors">
              <User size={16} className="text-gray-500 mr-2" />
              <input 
                type="text" required value={email} onChange={e => setEmail(e.target.value)}
                className="bg-transparent border-none outline-none text-white w-full text-sm"
                placeholder="user@idkfree.os"
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-gray-500 mb-1 block">PASSKEY</label>
            <div className="flex items-center border border-gray-700 bg-black p-2 focus-within:border-orange-500 transition-colors">
              <Lock size={16} className="text-gray-500 mr-2" />
              <input 
                type="password" required value={password} onChange={e => setPassword(e.target.value)}
                className="bg-transparent border-none outline-none text-white w-full text-sm"
                placeholder="••••••••••••"
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="w-full bg-orange-600 hover:bg-orange-500 text-black font-bold text-sm py-3 transition-colors mt-4"
          >
            ACCEDER AL SISTEMA
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-gray-600">
          <span>¿No tienes acceso? </span>
          <a href="/waitlist" className="text-orange-500 hover:underline">Solicitar Pase</a>
        </div>
      </div>
    </div>
  );
}
