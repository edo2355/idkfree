import { Settings, MapPin, Link as LinkIcon, Calendar } from 'lucide-react';

export default function Profile() {
  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500">
      {/* Header del Perfil */}
      <div className="bg-brand-panel border border-brand-border rounded-lg overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-brand-blue/40 to-[#0a0a0a] w-full"></div>
        <div className="p-6 relative">
          <div className="absolute -top-12 left-6 w-24 h-24 bg-[#050505] border-4 border-brand-panel rounded-full flex items-center justify-center text-3xl font-bold text-brand-blue">
            E
          </div>
          <div className="flex justify-end mb-4">
            <button className="border border-brand-border text-white px-4 py-2 rounded text-xs font-mono hover:bg-brand-border transition-colors flex items-center gap-2">
              <Settings size={14} /> EDITAR PERFIL
            </button>
          </div>
          <div className="mt-2">
            <h1 className="text-2xl font-bold text-white">Eduardo Amate</h1>
            <p className="text-brand-blue font-mono text-sm mb-4">@edo_creator</p>
            <p className="text-gray-300 text-sm max-w-lg mb-4">Construyendo el futuro de la libertad digital desde Cuba. Fundador de IDKfree.OS.</p>
            <div className="flex gap-4 text-xs text-gray-500 font-mono">
              <span className="flex items-center gap-1"><MapPin size={14} /> La Habana, Cuba</span>
              <span className="flex items-center gap-1"><LinkIcon size={14} /> idkfreegetid.dpdns.org</span>
              <span className="flex items-center gap-1"><Calendar size={14} /> Se unió en Nov 2026</span>
            </div>
          </div>
          <div className="flex gap-6 mt-6 border-t border-brand-border pt-4 text-sm">
            <span className="text-gray-400"><strong className="text-white">12</strong> Publicaciones</span>
            <span className="text-gray-400"><strong className="text-white">1.2K</strong> Seguidores</span>
            <span className="text-gray-400"><strong className="text-white">45</strong> Siguiendo</span>
          </div>
        </div>
      </div>
      
      {/* Tabs y Grid (Simulado) */}
      <div className="flex border-b border-brand-border">
        <button className="px-6 py-3 text-sm font-mono text-brand-blue border-b-2 border-brand-blue">PUBLICACIONES</button>
        <button className="px-6 py-3 text-sm font-mono text-gray-500 hover:text-white">REELS</button>
        <button className="px-6 py-3 text-sm font-mono text-gray-500 hover:text-white">VIBES</button>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {[1,2,3,4,5,6].map(i => (
          <div key={i} className="aspect-square bg-brand-panel border border-brand-border hover:border-brand-blue transition-colors cursor-pointer"></div>
        ))}
      </div>
    </div>
  );
}
