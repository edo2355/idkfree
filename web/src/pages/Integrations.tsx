import { useState } from 'react';
import { Video, Camera, Send, ShieldCheck, CreditCard, Link as LinkIcon, CheckCircle2 } from 'lucide-react';

export default function Integrations() {
  // Estado simulado de conexiones
  const [connections, setConnections] = useState({
    youtube: false,
    instagram: false,
    telegram: false,
    kyc: true,
    qvapay: false,
  });

  const toggleConnection = (key: keyof typeof connections) => {
    setConnections(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-500 font-sans">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2 font-mono tracking-tight">INTEGRACIONES & SESSIONS</h1>
        <p className="text-gray-400">Vincula tus cuentas para aumentar tu Trust Score y habilitar monetización.</p>
      </div>

      {/* Categoría: Redes Sociales */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 border-b border-gray-800 pb-2">
          <LinkIcon size={16} className="text-brand-blue" />
          <h2 className="text-sm font-mono text-white tracking-widest uppercase">Redes Sociales</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          
          <div className="border border-gray-800 bg-[#0a0a0a] p-5 flex flex-col justify-between hover:border-gray-600 transition-colors">
            <div className="flex justify-between items-start mb-4">
              <Video size={32} className="text-red-600" />
              {connections.youtube ? <span className="text-green-500 text-xs font-mono flex items-center gap-1"><CheckCircle2 size={12}/> CONECTADO</span> : <span className="text-gray-600 text-xs font-mono">DESCONECTADO</span>}
            </div>
            <div>
              <h3 className="text-white font-bold mb-1">YouTube</h3>
              <p className="text-xs text-gray-500 mb-4">Sincroniza tus suscriptores y verifica tu contenido. (+20 Trust)</p>
              <button onClick={() => toggleConnection('youtube')} className={`w-full py-2 text-xs font-mono font-bold border transition-colors ${connections.youtube ? 'border-red-900 text-red-500 hover:bg-red-900/20' : 'border-gray-700 text-white hover:border-white'}`}>
                {connections.youtube ? 'DESVINCULAR' : 'CONECTAR API'}
              </button>
            </div>
          </div>

          <div className="border border-gray-800 bg-[#0a0a0a] p-5 flex flex-col justify-between hover:border-gray-600 transition-colors">
            <div className="flex justify-between items-start mb-4">
              <Camera size={32} className="text-pink-500" />
              {connections.instagram ? <span className="text-green-500 text-xs font-mono flex items-center gap-1"><CheckCircle2 size={12}/> CONECTADO</span> : <span className="text-gray-600 text-xs font-mono">DESCONECTADO</span>}
            </div>
            <div>
              <h3 className="text-white font-bold mb-1">Instagram</h3>
              <p className="text-xs text-gray-500 mb-4">Verifica tu cuenta de creador y alcance. (+15 Trust)</p>
              <button onClick={() => toggleConnection('instagram')} className={`w-full py-2 text-xs font-mono font-bold border transition-colors ${connections.instagram ? 'border-red-900 text-red-500 hover:bg-red-900/20' : 'border-gray-700 text-white hover:border-white'}`}>
                {connections.instagram ? 'DESVINCULAR' : 'CONECTAR API'}
              </button>
            </div>
          </div>

          <div className="border border-gray-800 bg-[#0a0a0a] p-5 flex flex-col justify-between hover:border-gray-600 transition-colors">
            <div className="flex justify-between items-start mb-4">
              <Send size={32} className="text-blue-400" />
              {connections.telegram ? <span className="text-green-500 text-xs font-mono flex items-center gap-1"><CheckCircle2 size={12}/> CONECTADO</span> : <span className="text-gray-600 text-xs font-mono">DESCONECTADO</span>}
            </div>
            <div>
              <h3 className="text-white font-bold mb-1">Telegram Passport</h3>
              <p className="text-xs text-gray-500 mb-4">Verificación de identidad alternativa. (+10 Trust)</p>
              <button onClick={() => toggleConnection('telegram')} className={`w-full py-2 text-xs font-mono font-bold border transition-colors ${connections.telegram ? 'border-red-900 text-red-500 hover:bg-red-900/20' : 'border-gray-700 text-white hover:border-white'}`}>
                {connections.telegram ? 'DESVINCULAR' : 'CONECTAR API'}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Categoría: Verificación y Finanzas */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 border-b border-gray-800 pb-2">
          <ShieldCheck size={16} className="text-cyan-500" />
          <h2 className="text-sm font-mono text-white tracking-widest uppercase">Identidad & Finanzas</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          <div className="border border-cyan-900/30 bg-cyan-950/10 p-5 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 w-16 h-16 bg-cyan-500/10 blur-xl"></div>
            <div className="flex justify-between items-start mb-4 relative z-10">
              <ShieldCheck size={32} className="text-cyan-400" />
              {connections.kyc ? <span className="text-green-500 text-xs font-mono flex items-center gap-1"><CheckCircle2 size={12}/> VERIFICADO</span> : <span className="text-gray-600 text-xs font-mono">PENDIENTE</span>}
            </div>
            <div className="relative z-10">
              <h3 className="text-white font-bold mb-1">KYC All (Identidad)</h3>
              <p className="text-xs text-gray-400 mb-4">Sistema orquestador de verificación global.</p>
              <button onClick={() => toggleConnection('kyc')} className={`w-full py-2 text-xs font-mono font-bold border transition-colors ${connections.kyc ? 'border-cyan-900 text-cyan-500 hover:bg-cyan-900/20' : 'border-gray-700 text-white hover:border-cyan-500'}`}>
                {connections.kyc ? 'GESTIONAR KYC' : 'INICIAR KYC'}
              </button>
            </div>
          </div>

          <div className="border border-gray-800 bg-[#0a0a0a] p-5 flex flex-col justify-between hover:border-gray-600 transition-colors">
            <div className="flex justify-between items-start mb-4">
              <CreditCard size={32} className="text-green-500" />
              {connections.qvapay ? <span className="text-green-500 text-xs font-mono flex items-center gap-1"><CheckCircle2 size={12}/> CONECTADO</span> : <span className="text-gray-600 text-xs font-mono">DESCONECTADO</span>}
            </div>
            <div>
              <h3 className="text-white font-bold mb-1">QvaPay (Monetización)</h3>
              <p className="text-xs text-gray-500 mb-4">Habilita el túnel de pagos y retiros locales.</p>
              <button onClick={() => toggleConnection('qvapay')} className={`w-full py-2 text-xs font-mono font-bold border transition-colors ${connections.qvapay ? 'border-red-900 text-red-500 hover:bg-red-900/20' : 'border-gray-700 text-white hover:border-white'}`}>
                {connections.qvapay ? 'DESVINCULAR' : 'CONECTAR QVAPAY'}
              </button>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}
