import { useState } from 'react';
import { ChevronLeft, CheckCircle2 } from 'lucide-react';

type SeatStatus = 'available' | 'sold' | 'broken';
interface Seat { id: string; row: number; col: number; status: SeatStatus; }

export default function AdvancedSeatMap({ venueId, venueName, shape }: { venueId: string, venueName: string, shape?: string }) {
  const [viewMode, setViewMode] = useState<'map' | 'seats'>('map');
  const [selectedZone, setSelectedZone] = useState<string | null>(null);
  const [selectedSeat, setSelectedSeat] = useState<Seat | null>(null);

  const handleZoneClick = (zoneId: string) => {
    setSelectedZone(zoneId);
    setViewMode('seats');
    setSelectedSeat(null);
  };

  const handleBackToMap = () => {
    setViewMode('map');
    setSelectedZone(null);
    setSelectedSeat(null);
  };

  // FUNCIÓN PARA RENDERIZAR LA FORMA BASE (MACRO)
  const renderBaseShape = () => {
    const type = shape || 'rectangular';

    // 1. LA ESFERA (Sphere Las Vegas)
    if (type === 'sphere') {
      return (
        <svg viewBox="0 0 1000 600" className="w-full max-w-4xl h-auto drop-shadow-2xl">
          <defs>
            <radialGradient id="sphereGradient" cx="50%" cy="50%" r="50%" fx="30%" fy="30%">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#1e3a8a" />
            </radialGradient>
          </defs>
          <circle cx="500" cy="300" r="240" fill="url(#sphereGradient)" stroke="#60A5FA" strokeWidth="4" />
          <circle cx="500" cy="300" r="100" fill="#111" stroke="#374151" strokeWidth="2" />
          <text x="500" y="305" textAnchor="middle" fill="#fff" fontSize="18" fontWeight="bold">ESCENARIO</text>
          <g onClick={() => handleZoneClick('sphere-general')} className="cursor-pointer hover:opacity-80 transition-opacity">
            <circle cx="500" cy="300" r="180" fill="none" stroke="#FDE047" strokeWidth="30" strokeDasharray="10, 5" />
            <text x="500" y="90" textAnchor="middle" fill="#fff" fontSize="20" fontWeight="bold">ANILLO 360°</text>
          </g>
        </svg>
      );
    }

    // 2. EL NIDO DEL PÁJARO (Beijing)
    if (type === 'bird_nest') {
      return (
        <svg viewBox="0 0 1000 600" className="w-full max-w-4xl h-auto drop-shadow-xl">
          <ellipse cx="500" cy="300" rx="400" ry="240" fill="#1e293b" stroke="#94a3b8" strokeWidth="4" />
          <ellipse cx="500" cy="300" rx="260" ry="140" fill="#22C55E" stroke="#16A34A" strokeWidth="4" />
          <path d="M 100 300 Q 500 100 900 300 M 100 300 Q 500 500 900 300 M 300 100 Q 500 300 300 500 M 700 100 Q 500 300 700 500" stroke="#94a3b8" strokeWidth="2" fill="none" opacity="0.5"/>
          <g onClick={() => handleZoneClick('bird-nest')} className="cursor-pointer hover:opacity-80 transition-opacity">
            <ellipse cx="500" cy="300" rx="330" ry="190" fill="none" stroke="#FDE047" strokeWidth="40" strokeDasharray="5,5" opacity="0.7"/>
            <text x="500" y="80" textAnchor="middle" fill="#fff" fontSize="24" fontWeight="bold">GRADAS (Toca aquí)</text>
          </g>
        </svg>
      );
    }

    // 3. HEXAGONAL (Teatro Real Madrid)
    if (type === 'hexagonal') {
      return (
        <svg viewBox="0 0 1000 600" className="w-full max-w-4xl h-auto drop-shadow-xl">
          <polygon points="500,50 800,200 800,400 500,550 200,400 200,200" fill="#1e293b" stroke="#60A5FA" strokeWidth="4" />
          <polygon points="500,150 680,250 680,350 500,450 320,350 320,250" fill="#22C55E" stroke="#16A34A" strokeWidth="4" />
          <text x="500" y="305" textAnchor="middle" fill="#fff" fontSize="18" fontWeight="bold">ESCENARIO</text>
          <g onClick={() => handleZoneClick('hex-general')} className="cursor-pointer hover:opacity-80 transition-opacity">
            <polygon points="500,100 740,220 740,380 500,500 260,380 260,220" fill="none" stroke="#FDE047" strokeWidth="30" opacity="0.6" />
            <text x="500" y="580" textAnchor="middle" fill="#fff" fontSize="20" fontWeight="bold">PLATEA (Toca aquí)</text>
          </g>
        </svg>
      );
    }

    // 4. FORMA DE D (La Bombonera)
    if (type === 'd_shape') {
      return (
        <svg viewBox="0 0 1000 600" className="w-full max-w-4xl h-auto drop-shadow-xl">
          <path d="M 300 100 L 500 100 A 200 200 0 0 1 700 300 A 200 200 0 0 1 500 500 L 300 500 Z" fill="#1e293b" stroke="#60A5FA" strokeWidth="4" />
          <path d="M 400 200 L 500 200 A 100 100 0 0 1 600 300 A 100 100 0 0 1 500 400 L 400 400 Z" fill="#22C55E" stroke="#16A34A" strokeWidth="4" />
          <text x="480" y="305" textAnchor="middle" fill="#fff" fontSize="18" fontWeight="bold">CAMPO</text>
          <g onClick={() => handleZoneClick('bombonera')} className="cursor-pointer hover:opacity-80 transition-opacity">
            <path d="M 350 150 L 500 150 A 150 150 0 0 1 650 300 A 150 150 0 0 1 500 450 L 350 450 Z" fill="none" stroke="#FDE047" strokeWidth="30" opacity="0.6" />
            <text x="700" y="320" textAnchor="middle" fill="#fff" fontSize="20" fontWeight="bold">POPULAR</text>
          </g>
        </svg>
      );
    }

    // Forma por defecto (Rectangular)
    return (
      <svg viewBox="0 0 1000 600" className="w-full max-w-4xl h-auto drop-shadow-xl">
        <rect x="300" y="200" width="400" height="200" fill="#22C55E" stroke="#16A34A" strokeWidth="4" rx="10" />
        <circle cx="500" cy="300" r="40" fill="none" stroke="#16A34A" strokeWidth="4" />
        <g onClick={() => handleZoneClick('fondo-norte')} className="cursor-pointer group">
          <rect x="150" y="40" width="700" height="120" fill="#93C5FD" stroke="#1E40AF" strokeWidth="3" rx="15" className="group-hover:fill-blue-400 transition-colors" />
          <text x="500" y="105" textAnchor="middle" fill="#1E3A8A" fontSize="24" fontWeight="bold" className="pointer-events-none">FONDO NORTE (Toca aquí)</text>
        </g>
      </svg>
    );
  };

  if (viewMode === 'map') {
    return (
      <div className="w-full flex justify-center items-center p-4 bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-[#1a1a1a] rounded-xl min-h-[500px]">
        {renderBaseShape()}
      </div>
    );
  }

  // VISTA DE ASIENTOS (Genérica para la demo)
  return (
    <div className="w-full flex flex-col lg:flex-row gap-6 bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-[#1a1a1a] rounded-xl p-4 md:p-8">
      <div className="flex-1 overflow-x-auto">
        <button onClick={handleBackToMap} className="flex items-center gap-2 text-sm font-mono text-brand-blue hover:text-blue-700 mb-6 transition-colors">
          <ChevronLeft size={16} /> VOLVER AL MAPA GENERAL
        </button>
        <div className="flex flex-col items-center min-w-[600px]">
          <div className="w-3/4 h-12 bg-gray-800 dark:bg-gray-700 text-white rounded-full flex items-center justify-center font-mono text-sm mb-10 tracking-widest">
            VISTA DE ASIENTOS
          </div>
          <div className="space-y-2">
            {Array.from({ length: 8 }).map((_, rowIndex) => {
              const rowLetter = String.fromCharCode(65 + rowIndex);
              return (
                <div key={rowIndex} className="flex items-center gap-3">
                  <span className="w-6 text-center text-xs font-mono text-gray-400 font-bold">{rowLetter}</span>
                  <div className="flex gap-1">
                    {Array.from({ length: 12 }).map((_, seatIndex) => (
                      <button key={seatIndex} onClick={() => setSelectedSeat({ id: `${rowLetter}-${seatIndex}`, row: rowIndex + 1, col: seatIndex + 1, status: 'available' })} className="w-6 h-6 md:w-8 md:h-8 rounded-full text-[10px] font-bold text-white bg-green-500 hover:bg-green-400">
                        {seatIndex + 1}
                      </button>
                    ))}
                  </div>
                  <span className="w-6 text-center text-xs font-mono text-gray-400 font-bold">{rowLetter}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="w-full lg:w-80 flex flex-col gap-4 border-t lg:border-t-0 lg:border-l border-gray-200 dark:border-[#1a1a1a] pt-6 lg:pt-0 lg:pl-6">
        <div className="bg-gray-50 dark:bg-[#111] border border-gray-200 dark:border-[#333] rounded-xl p-6">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white font-mono mb-4">Detalles del Ticket</h3>
          {selectedSeat ? (
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-800 pb-2">
                <span className="text-sm text-gray-500">Ubicación:</span>
                <span className="font-bold text-gray-900 dark:text-white text-right">Fila {String.fromCharCode(64 + selectedSeat.row)},<br/>Asiento {selectedSeat.col}</span>
              </div>
              <div className="flex justify-between items-center pt-2">
                <span className="text-sm text-gray-500">Precio:</span>
                <span className="font-bold text-brand-blue text-xl">$50.00</span>
              </div>
              <button className="w-full bg-brand-blue text-white font-bold py-3 rounded-lg hover:bg-blue-600 transition-colors mt-4 flex items-center justify-center gap-2">
                <CheckCircle2 size={18} /> PAGAR CON QVAPAY
              </button>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-sm text-gray-500 mb-4">Selecciona un asiento en el mapa.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
