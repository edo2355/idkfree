import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Shield, CreditCard, Ticket, Code, X } from 'lucide-react';

export default function Landing() {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', desc: '', icon: null });

  const modules = [
    { title: 'Identidad (KYC)', desc: 'Sistema de verificación de identidad cifrado con protección contra censura y prueba de humanidad.', icon: <Shield size={32} className="text-brand-blue" /> },
    { title: 'Finanzas (QvaPay)', desc: 'Túnel de pagos internacional. Cobra en divisas desde cualquier parte del mundo y retira a moneda local.', icon: <CreditCard size={32} className="text-brand-blue" /> },
    { title: 'Ticketera Pro', desc: 'Crea eventos, diseña la distribución de tu estadio o teatro, y vende boletos con QR único.', icon: <Ticket size={32} className="text-brand-blue" /> },
    { title: 'B2B API', desc: 'Vende nuestra tecnología de verificación y cumplimiento a otras plataformas globales.', icon: <Code size={32} className="text-brand-blue" /> },
  ];

  return (
    <div className="min-h-screen bg-brand-dark text-white font-sans selection:bg-brand-blue selection:text-white overflow-x-hidden">
      
      {/* MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-brand-panel border border-brand-border max-w-md w-full p-8 rounded-xl relative animate-in zoom-in-95">
            <button onClick={() => setModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white"><X size={20} /></button>
            <div className="mb-6">{modalContent.icon}</div>
            <h2 className="text-2xl font-bold mb-4">{modalContent.title}</h2>
            <p className="text-gray-400 font-mono text-sm leading-relaxed">{modalContent.desc}</p>
            <Link to="/login" className="mt-8 block text-center bg-brand-blue text-white font-bold py-3 rounded hover:bg-blue-600 transition-colors">ACCEDER AL MÓDULO</Link>
          </div>
        </div>
      )}

      {/* NAVBAR */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/10 bg-brand-dark/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold tracking-tighter text-xl">
            <div className="w-6 h-6 bg-brand-blue flex items-center justify-center rounded-sm text-white"><Shield size={14} strokeWidth={3} /></div>
            IDKFREE<span className="text-brand-blue">.OS</span>
          </div>
          <div className="flex gap-4 items-center">
            <Link to="/login" className="text-xs font-mono hover:text-brand-blue transition-colors">LOG IN</Link>
            <Link to="/waitlist" className="bg-white text-black px-4 py-2 text-xs font-bold font-mono hover:bg-brand-blue hover:text-white transition-colors">GET ACCESS</Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden pt-16">
        <div className="absolute inset-0 z-0">
          <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=2000&auto=format&fit=crop" alt="Creator" className="w-full h-full object-cover object-top opacity-30 grayscale contrast-150" />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-brand-dark/80 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-brand-dark via-transparent to-brand-dark"></div>
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 flex flex-col items-center text-center">
          <div className="inline-block border border-white/20 bg-black/50 backdrop-blur-sm px-4 py-1 mb-8">
            <span className="text-xs font-mono tracking-[0.2em] text-brand-blue uppercase">Identity Layer Protocol</span>
          </div>
          <h1 className="text-5xl md:text-7xl lg:text-[100px] font-bold tracking-tighter leading-[0.85] mix-blend-difference mb-6">
            OFF-GRID <br />
            <span className="text-transparent" style={{ WebkitTextStroke: '2px white' }}>CREATOR</span> <br />
            ECONOMY.
          </h1>
          <p className="max-w-2xl text-gray-400 font-mono text-sm md:text-base mb-10 leading-relaxed">
            La cadena es tuya. Verifica todo. Monetiza tu talento desde cualquier lugar del mundo sin depender de la banca tradicional.
          </p>
          <Link to="/waitlist" className="group relative bg-white text-black px-8 py-4 font-bold font-mono text-sm uppercase tracking-widest flex items-center gap-3 overflow-hidden">
            <span className="relative z-10 flex items-center gap-2">Iniciar Protocolo <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" /></span>
            <div className="absolute inset-0 bg-brand-blue translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out z-0"></div>
          </Link>
        </div>
      </section>

      {/* MODULES GRID */}
      <section className="py-24 border-t border-white/5 bg-[#020202]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-16 md:mb-24 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight max-w-xl">Todo en una sola red. <br /><span className="text-gray-600">Nada en el medio.</span></h2>
            <p className="text-gray-500 font-mono text-xs max-w-xs text-left md:text-right">Conecta tu identidad, gestiona eventos y recibe pagos globales desde una única cuenta.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {modules.map((mod, i) => (
              <button key={i} onClick={() => { setModalContent(mod); setModalOpen(true); }} className="group text-left border border-white/5 bg-gradient-to-b from-white/5 to-transparent p-6 hover:border-brand-blue transition-all duration-300 rounded-lg">
                <div className="mb-6 group-hover:scale-110 transition-transform">{mod.icon}</div>
                <h3 className="text-lg font-bold mb-2 font-mono text-white">{mod.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed line-clamp-3">{mod.desc}</p>
              </button>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
