import { useState } from 'react';
import { Users, Ticket, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function Waitlist() {
  const [alias, setAlias] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [successData, setSuccessData] = useState<{ position: number, code: string } | null>(null);
  const [error, setError] = useState('');

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Usamos la URL de producción de tu backend en Render
      const response = await fetch('https://idkfree.onrender.com/api/waitlist/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ alias, email })
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || 'Error al registrarse');

      setSuccessData({ position: data.position, code: data.referral_code });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (successData) {
    return (
      <div className="flex flex-col items-center justify-center h-full space-y-6 text-center animate-in fade-in zoom-in duration-500">
        <CheckCircle2 size={80} className="text-green-400" />
        <h2 className="text-3xl font-bold text-white">¡Estás dentro!</h2>
        <p className="text-slate-400 text-lg">Tu lugar en la lista de espera está reservado.</p>
        
        <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl w-full max-w-md space-y-4">
          <div>
            <p className="text-sm text-slate-500 uppercase tracking-wider">Posición</p>
            <p className="text-5xl font-bold text-cyan-400">#{successData.position}</p>
          </div>
          <div>
            <p className="text-sm text-slate-500 uppercase tracking-wider">Tu código de referido</p>
            <p className="text-2xl font-mono text-white bg-slate-950 p-3 rounded-lg border border-slate-800">
              {successData.code}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-20 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold text-white">Acceso Anticipado</h1>
        <p className="text-slate-400">Únete a la lista de espera y asegura tu lugar en IDKfree.</p>
      </div>

      <form onSubmit={handleJoin} className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-4 shadow-2xl">
        {error && <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-lg text-sm">{error}</div>}
        
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Alias (Nombre de usuario)</label>
          <input
            type="text"
            required
            value={alias}
            onChange={(e) => setAlias(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all"
            placeholder="ej. el_creador"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Correo Electrónico</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all"
            placeholder="tu@correo.com"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2 transition-all disabled:opacity-50"
        >
          {loading ? 'Procesando...' : 'Unirme a la lista'} <ArrowRight size={18} />
        </button>
      </form>
    </div>
  );
}
