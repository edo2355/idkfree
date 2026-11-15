import { useState } from 'react';

export default function AdvancedSeatMap({ venueId }: { venueId: string }) {
  const [selectedSection, setSelectedSection] = useState<string | null>(null);

  // Configuración visual por tipo de estadio
  const renderSVG = () => {
    if (venueId === 'bernabeu') {
      return (
        <svg viewBox="0 0 800 500" className="w-full h-auto drop-shadow-xl">
          {/* Fondo del estadio */}
          <rect x="50" y="50" width="700" height="400" rx="80" fill="#e5e7eb" className="dark:fill-[#1f2937]" />
          {/* Anillo Exterior */}
          <rect x="80" y="80" width="640" height="340" rx="60" fill="#93C5FD" stroke="#60A5FA" strokeWidth="2" />
          {/* Anillo Medio */}
          <rect x="140" y="130" width="520" height="240" rx="40" fill="#6EE7B7" stroke="#34D399" strokeWidth="2" />
          {/* Anillo Interior (Preferente) */}
          <rect x="200" y="180" width="400" height="140" rx="20" fill="#FDE047" stroke="#FACC15" strokeWidth="2" />
          {/* Césped / Cancha */}
          <rect x="280" y="210" width="240" height="80" rx="10" fill="#22C55E" stroke="#16A34A" strokeWidth="2" />
          <text x="400" y="255" textAnchor="middle" fill="#fff" fontSize="14" fontWeight="bold">CAMPO</text>
          
          {/* Etiquetas de Secciones */}
          <text x="400" y="110" textAnchor="middle" fill="#1F2937" fontSize="12" fontWeight="bold">FONDO NORTE (GRAL)</text>
          <text x="400" y="390" textAnchor="middle" fill="#1F2937" fontSize="12" fontWeight="bold">FONDO SUR (GRAL)</text>
          <text x="400" y="155" textAnchor="middle" fill="#065F46" fontSize="12" fontWeight="bold">LATERAL ESTE</text>
          <text x="400" y="345" textAnchor="middle" fill="#065F46" fontSize="12" fontWeight="bold">LATERAL OESTE</text>
          <text x="400" y="205" textAnchor="middle" fill="#854D0E" fontSize="12" fontWeight="bold">PREFERENTE</text>
        </svg>
      );
    }
    if (venueId === 'coliseo_habana') {
      return (
        <svg viewBox="0 0 800 500" className="w-full h-auto drop-shadow-xl">
          <circle cx="400" cy="250" r="220" fill="#e5e7eb" className="dark:fill-[#1f2937]" />
          <circle cx="400" cy="250" r="200" fill="#D1D5DB" stroke="#9CA3AF" strokeWidth="4" />
          <circle cx="400" cy="250" r="150" fill="#93C5FD" stroke="#60A5FA" strokeWidth="4" />
          <circle cx="400" cy="250" r="90" fill="#FDE047" stroke="#FACC15" strokeWidth="4" />
          {/* Cancha central */}
          <circle cx="400" cy="250" r="50" fill="#F97316" stroke="#EA580C" strokeWidth="4" />
          <text x="400" y="255" textAnchor="middle" fill="#fff" fontSize="14" fontWeight="bold">ARENA</text>
          
          {/* Etiquetas */}
          <text x="400" y="80" textAnchor="middle" fill="#4B5563" fontSize="14" fontWeight="bold">GRADA EXTERIOR</text>
          <text x="400" y="120" textAnchor="middle" fill="#1E40AF" fontSize="14" fontWeight="bold">PALCOS VIP</text>
        </svg>
      );
    }
    // Por defecto (Teatros / Estadios genéricos)
    return (
      <svg viewBox="0 0 800 500" className="w-full h-auto drop-shadow-xl">
        <path d="M 100 100 L 700 100 L 750 400 L 50 400 Z" fill="#D1D5DB" className="dark:fill-[#1f2937]" />
        <path d="M 150 150 L 650 150 L 680 380 L 120 380 Z" fill="#93C5FD" stroke="#60A5FA" strokeWidth="2" />
        <path d="M 250 220 L 550 220 L 580 350 L 220 350 Z" fill="#FDE047" stroke="#FACC15" strokeWidth="2" />
        <rect x="300" y="80" width="200" height="40" fill="#374151" rx="4" />
        <text x="400" y="105" textAnchor="middle" fill="#fff" fontSize="12" fontWeight="bold">ESCENARIO</text>
      </svg>
    );
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 md:p-8 bg-white dark:bg-brand-panel border border-gray-200 dark:border-brand-border rounded-xl w-full relative">
      <div className="w-full max-w-3xl">
        {renderSVG()}
      </div>
      
      {/* Panel flotante para seleccionar asientos */}
      <div className="mt-6 w-full max-w-md bg-gray-50 dark:bg-[#111] p-4 rounded-lg border border-gray-200 dark:border-[#333]">
        <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-2 font-mono uppercase text-center">Selecciona tu Zona</h4>
        <div className="grid grid-cols-2 gap-2">
          <button onClick={() => setSelectedSection('vip')} className={`p-3 text-xs font-mono rounded border ${selectedSection === 'vip' ? 'bg-brand-blue text-white border-brand-blue' : 'bg-white dark:bg-[#1a1a1a] border-gray-300 dark:border-gray-600 text-gray-500'}`}>VIP / Palcos ($150)</button>
          <button onClick={() => setSelectedSection('general')} className={`p-3 text-xs font-mono rounded border ${selectedSection === 'general' ? 'bg-brand-blue text-white border-brand-blue' : 'bg-white dark:bg-[#1a1a1a] border-gray-300 dark:border-gray-600 text-gray-500'}`}>General ($50)</button>
        </div>
        <p className="text-[10px] text-gray-500 text-center mt-3 font-mono">Al seleccionar una zona, podrás ver las filas y sillas exactas.</p>
      </div>
    </div>
  );
}
