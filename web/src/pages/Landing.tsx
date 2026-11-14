import { Link } from 'react-router-dom';
import { ArrowRight, Globe, Shield, CreditCard, Ticket } from 'lucide-react';

export default function Landing() {
  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-orange-500 selection:text-black overflow-x-hidden">
      
      {/* NAVBAR (Minimalista estilo Bulo) */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/10 bg-[#050505]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold tracking-tighter text-xl">
            <div className="w-6 h-6 bg-white flex items-center justify-center rounded-sm text-black">
              <Shield size={14} strokeWidth={3} />
            </div>
            IDKFREE<span className="text-orange-500">.OS</span>
          </div>
          <div className="hidden md:flex gap-8 text-xs font-mono text-gray-400 uppercase tracking-widest">
            <a href="#protocol" className="hover:text-white transition-colors">Protocolo</a>
            <a href="#modules" className="hover:text-white transition-colors">Módulos</a>
            <a href="#creators" className="hover:text-white transition-colors">Creadores</a>
          </div>
          <div className="flex gap-4 items-center">
            <Link to="/login" className="text-xs font-mono hover:text-orange-500 transition-colors">LOG IN</Link>
            <Link to="/waitlist" className="bg-white text-black px-4 py-2 text-xs font-bold font-mono hover:bg-orange-500 transition-colors">
              GET ACCESS
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO SECTION (Estilo editorial de las fotos) */}
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden pt-16">
        {/* Imagen de fondo con alto contraste (simulando la estética de las fotos) */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=2000&auto=format&fit=crop" 
            alt="Creator" 
            className="w-full h-full object-cover object-top opacity-40 grayscale contrast-150"
          />
          {/* Degradados para fundir la imagen con el fondo negro */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/60 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-transparent to-[#050505]"></div>
          
          {/* Patrón de puntos (Halftone) sutil sobre la imagen */}
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '4px 4px' }}></div>
        </div>

        {/* Textos superpuestos */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 flex flex-col items-center text-center">
          <div className="inline-block border border-white/20 bg-black/50 backdrop-blur-sm px-4 py-1 mb-8">
            <span className="text-xs font-mono tracking-[0.2em] text-orange-500 uppercase">Sovereign Identity Layer</span>
          </div>
          
          <h1 className="text-6xl md:text-8xl lg:text-[120px] font-bold tracking-tighter leading-[0.85] mix-blend-difference mb-6">
            OFF-GRID <br />
            <span className="text-transparent" style={{ WebkitTextStroke: '2px white' }}>CREATOR</span> <br />
            ECONOMY.
          </h1>
          
          <p className="max-w-2xl text-gray-400 font-mono text-sm md:text-base mb-10 leading-relaxed">
            La cadena es tuya. Verifica todo. Monetiza tu talento desde cualquier lugar del mundo sin depender de la banca tradicional.
          </p>
          
          <Link to="/waitlist" className="group relative bg-white text-black px-8 py-4 font-bold font-mono text-sm uppercase tracking-widest flex items-center gap-3 overflow-hidden">
            <span className="relative z-10 flex items-center gap-2">
              Iniciar Protocolo <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </span>
            <div className="absolute inset-0 bg-orange-500 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out z-0"></div>
          </Link>
        </div>
      </section>

      {/* SECCIÓN DE MÓDULOS (Estilo Bulo - Geometría limpia) */}
      <section id="modules" className="py-24 border-t border-white/5 bg-[#020202]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-16 md:mb-24 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight max-w-xl">
              Todo en una sola red. <br />
              <span className="text-gray-600">Nada en el medio.</span>
            </h2>
            <p className="text-gray-500 font-mono text-xs max-w-xs text-left md:text-right">
              Conecta tu identidad, gestiona eventos y recibe pagos globales desde una única cuenta soberana.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-4 border-t border-white/10 pt-12">
            {/* Item 1 */}
            <div className="group cursor-default">
              <div className="h-32 mb-6 flex items-center justify-center border border-white/5 bg-gradient-to-b from-white/5 to-transparent relative overflow-hidden">
                <div className="w-16 h-16 rounded-full border border-white/30 group-hover:border-orange-500 group-hover:scale-110 transition-all duration-500"></div>
              </div>
              <h3 className="text-lg font-bold mb-2 font-mono">Identidad (KYC)</h3>
              <p className="text-xs text-gray-500 leading-relaxed">Carnet digital cifrado con sistema de recuperación y prueba de humanidad.</p>
            </div>

            {/* Item 2 */}
            <div className="group cursor-default">
              <div className="h-32 mb-6 flex items-center justify-center border border-white/5 bg-gradient-to-b from-white/5 to-transparent relative overflow-hidden">
                <div className="w-16 h-16 border border-white/30 group-hover:border-orange-500 group-hover:rotate-45 transition-all duration-500"></div>
              </div>
              <h3 className="text-lg font-bold mb-2 font-mono">Finanzas (QvaPay)</h3>
              <p className="text-xs text-gray-500 leading-relaxed">Túnel de pagos para cobrar en divisas y retirar en moneda local.</p>
            </div>

            {/* Item 3 */}
            <div className="group cursor-default">
              <div className="h-32 mb-6 flex items-center justify-center border border-white/5 bg-gradient-to-b from-white/5 to-transparent relative overflow-hidden">
                <div className="w-0 h-0 border-l-[32px] border-l-transparent border-r-[32px] border-r-transparent border-b-[55px] border-b-white/30 group-hover:border-b-orange-500 group-hover:-translate-y-2 transition-all duration-500"></div>
              </div>
              <h3 className="text-lg font-bold mb-2 font-mono">Ticketera Pro</h3>
              <p className="text-xs text-gray-500 leading-relaxed">Crea eventos, diseña estadios personalizados y vende boletos con QR.</p>
            </div>

            {/* Item 4 */}
            <div className="group cursor-default">
              <div className="h-32 mb-6 flex items-center justify-center border border-white/5 bg-gradient-to-b from-white/5 to-transparent relative overflow-hidden">
                <div className="w-14 h-16 border border-white/30 group-hover:border-orange-500 group-hover:scale-110 transition-all duration-500" style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}></div>
              </div>
              <h3 className="text-lg font-bold mb-2 font-mono">B2B API</h3>
              <p className="text-xs text-gray-500 leading-relaxed">Vende nuestra tecnología de verificación y compliance a otras apps.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-8 border-t border-white/10 text-center font-mono text-[10px] text-gray-600">
        <p>© 2026 IDKFREE.OS - SOVEREIGN DIGITAL INFRASTRUCTURE.</p>
      </footer>
    </div>
  );
}
