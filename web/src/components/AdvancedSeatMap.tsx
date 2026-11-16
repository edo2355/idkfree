import { useState } from 'react';
import { ChevronLeft, CheckCircle2 } from 'lucide-react';

type SeatStatus = 'available' | 'sold' | 'broken';
interface Seat { id: string; row: number; col: number; status: SeatStatus; }

export default function AdvancedSeatMap({ venueId, venueName, shape }: { venueId: string, venueName: string, shape?: string }) {
  const [viewMode, setViewMode] = useState<'map' | 'seats'>('map');
  const [selectedZone, setSelectedZone] = useState<string | null>(null);
  const [selectedSeat, setSelectedSeat] = useState<Seat | null>(null);

  // Generar asientos para la zona seleccionada
  const generateSeats = (zoneId: string, rows: number, seatsPerRow: number): Seat[] => {
    const seats = [];
    for (let r = 1; r <= rows; r++) {
      for (let s = 1; s <= seatsPerRow; s++) {
        let status: SeatStatus = 'available';
        if ((r === 3 && s === 5) || (r === 7 && s === 12) || (r === 2 && s === 2)) status = 'sold';
        else if ((r === 5 && s === 8) || (r === 2 && s === 15)) status = 'broken';
        seats.push({ id: `${zoneId}-${r}-${s}`, row: r, col: s, status });
      }
    }
    return seats;
  };

  const [fondoNorteSeats] = useState(() => generateSeats('fondo-norte', 10, 15));

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
    // Si no hay forma, por defecto es un rectángulo (estadio)
    const type = shape || 'rectangular';

    if (type === 'circular') {
      return (
        <svg viewBox="0 0 1000 600" className="w-full max-w-4xl h-auto drop-shadow-xl">
          {/* Cancha Central */}
          <circle cx="500" cy="300" r="120" fill="#F97316" stroke="#EA580C" strokeWidth="4" />
          <text x="500" y="305" textAnchor="middle" fill="#fff" fontSize="18" fontWeight="bold">CANCHA</text>

          {/* Anillo de Asientos (Clickeable) */}
          <g onClick={() => handleZoneClick('anillo-general')} className="cursor-pointer group">
            <circle cx="500" cy="300" r="220" fill="none" stroke="#93C5FD" strokeWidth="60" className="group-hover:stroke-blue-400 transition-colors" opacity="0.8" />
            <text x="500" y="80" textAnchor="middle" fill="#1E3A8A" fontSize="20" fontWeight="bold">ANILLO GENERAL (Toca aquí)</text>
          </g>
          
          {/* Palcos VIP (Anillo exterior) */}
          <circle cx="500" cy="300" r="270" fill="none" stroke="#FDE047" strokeWidth="20" opacity="0.6" />
          <text x="500" y="540" textAnchor="middle" fill="#854D0E" fontSize="16" fontWeight="bold">PALCOS VIP</text>
        </svg>
      );
    }

    // Forma por defecto (Rectangular - Estadios)
    return (
      <svg viewBox="0 0 1000 600" className="w-full max-w-4xl h-auto drop-shadow-xl">
        <rect x="300" y="200" width="400" height="200" fill="#22C55E" stroke="#16A34A" strokeWidth="4" rx="10" />
        <circle cx="500" cy="300" r="40" fill="none" stroke="#16A34A" strokeWidth="4" />
        <g onClick={() => handleZoneClick('fondo-norte')} className="cursor-pointer group">
          <rect x="150" y="40" width="700" height="120" fill="#93C5FD" stroke="#1E40AF" strokeWidth="3" rx="15" className="group-hover:fill-blue-400 transition-colors" />
          <text x="500" y="105" textAnchor="middle" fill="#1E3A8A" fontSize="24" fontWeight="bold" className="pointer-events-none group-hover:text-blue-900">FONDO NORTE (Toca aquí)</text>
        </g>
        <rect x="150" y="440" width="700" height="120" fill="#D1D5DB" stroke="#9CA3AF" strokeWidth="3" rx="15" />
        <text x="500" y="510" textAnchor="middle" fill="#4B5563" fontSize="24" fontWeight="bold" className="pointer-events-none">FONDO SUR</text>
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

  // VISTA DE ASIENTOS (Simplificada para la demo de la arena)
  return (
    <div className="w-full flex flex-col lg:flex-row gap-6 bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-[#1a1a1a] rounded-xl p-4 md:p-8">
      <div className="flex-1 overflow-x-auto">
        <button onClick={handleBackToMap} className="flex items-center gap-2 text-sm font-mono text-brand-blue hover:text-blue-700 mb-6 transition-colors">
          <ChevronLeft size={16} /> VOLVER AL MAPA GENERAL
        </button>
        <div className="flex flex-col items-center min-w-[600px]">
          <div className="w-3/4 h-12 bg-gray-800 dark:bg-gray-700 text-white rounded-full flex items-center justify-center font-mono text-sm mb-10 tracking-widest">
            CANCHA CENTRAL
          </div>
          <div className="space-y-2">
            {Array.from({ length: 10 }).map((_, rowIndex) => {
              const rowLetter = String.fromCharCode(65 + rowIndex);
              return (
                <div key={rowIndex} className="flex items-center gap-3">
                  <span className="w-6 text-center text-xs font-mono text-gray-400 font-bold">{rowLetter}</span>
                  <div className="flex gap-1">
                    {Array.from({ length: 15 }).map((_, seatIndex) => (
                      <button
                        key={seatIndex}
                        onClick={() => setSelectedSeat({ id: `${rowLetter}-${seatIndex}`, row: rowIndex + 1, col: seatIndex + 1, status: 'available' })}
                        className={`w-6 h-6 md:w-8 md:h-8 rounded-full text-[10px] font-bold text-white transition-all bg-green-500 hover:bg-green-400`}
                      >
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
                <span className="text-sm text-gray-500">Zona:</span>
                <span className="font-bold text-gray-900 dark:text-white">Anillo General</span>
              </div>
              <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-800 pb-2">
                <span className="text-sm text-gray-500">Ubicación:</span>
                <span className="font-bold text-gray-900 dark:text-white text-right">Fila {String.fromCharCode(64 + selectedSeat.row)},<br/>Asiento {selectedSeat.col}</span>
              </div>
              <div className="flex justify-between items-center pt-2">
                <span className="text-sm text-gray-500">Precio:</span>
                <span className="font-bold text-brand-blue text-xl">$50.00</span>
              </div>
              <button className="w-full bg-brand-blue text-white font-bold py-3 rounded-lg hover:bg-blue-600 transition-colors mt-4 shadow-lg shadow-brand-blue/20 flex items-center justify-center gap-2">
                <CheckCircle2 size={18} /> PAGAR CON QVAPAY
              </button>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-sm text-gray-500 mb-4">Selecciona un asiento en el anillo.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
