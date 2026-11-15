import { useState } from 'react';
import { ChevronLeft, CheckCircle2, Loader2 } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { useUIStore } from '../stores/uiStore';

type SeatStatus = 'available' | 'sold' | 'broken';
interface Seat { id: string; row: number; col: number; status: SeatStatus; }

export default function AdvancedSeatMap({ venueId, venueName }: { venueId: string, venueName: string }) {
  const { token } = useAuthStore();
  const { showToast } = useUIStore();
  
  const [viewMode, setViewMode] = useState<'map' | 'seats'>('map');
  const [selectedZone, setSelectedZone] = useState<string | null>(null);
  const [selectedSeat, setSelectedSeat] = useState<Seat | null>(null);
  
  // Estado para el botón de pago
  const [isPaying, setIsPaying] = useState(false);

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

  // FUNCIÓN PARA IR A PAGAR A QVAPAY
  const handlePay = async () => {
    if (!selectedSeat) return;
    if (!token) {
      showToast('Debes iniciar sesión para pagar', 'error');
      return;
    }

    setIsPaying(true);
    try {
      const rowLetter = String.fromCharCode(64 + selectedSeat.row);
      const description = `Boleto ${venueName} - Fila ${rowLetter}, Asiento ${selectedSeat.col}`;

      const res = await fetch('https://idkfree.onrender.com/api/qvapay/create-invoice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          amount: 50.00,
          description: description
        })
      });

      const data = await res.json();

      if (res.ok && data.url) {
        showToast('Redirigiendo a QvaPay...', 'success');
        // REDIRECCIÓN A LA PASARELA DE PAGO
        window.location.href = data.url;
      } else {
        showToast(data.error || 'Error al generar el pago', 'error');
      }
    } catch (error) {
      console.error(error);
      showToast('Error de conexión con el servidor', 'error');
    } finally {
      setIsPaying(false);
    }
  };

  if (viewMode === 'map') {
    return (
      <div className="w-full flex justify-center items-center p-4 bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-[#1a1a1a] rounded-xl h-[500px]">
        <svg viewBox="0 0 1000 600" className="w-full max-w-4xl h-auto drop-shadow-xl">
          <rect x="300" y="200" width="400" height="200" fill="#22C55E" stroke="#16A34A" strokeWidth="4" rx="10" />
          <circle cx="500" cy="300" r="40" fill="none" stroke="#16A34A" strokeWidth="4" />

          <g onClick={() => handleZoneClick('fondo-norte')} className="cursor-pointer group">
            <rect x="150" y="40" width="700" height="120" fill="#93C5FD" stroke="#1E40AF" strokeWidth="3" rx="15" className="group-hover:fill-blue-400 transition-colors" />
            <text x="500" y="105" textAnchor="middle" fill="#1E3A8A" fontSize="24" fontWeight="bold" className="pointer-events-none group-hover:text-blue-900">
              FONDO NORTE (Toca aquí)
            </text>
          </g>

          <rect x="150" y="440" width="700" height="120" fill="#D1D5DB" stroke="#9CA3AF" strokeWidth="3" rx="15" />
          <text x="500" y="510" textAnchor="middle" fill="#4B5563" fontSize="24" fontWeight="bold" className="pointer-events-none">FONDO SUR</text>
          <rect x="50" y="180" width="60" height="240" fill="#D1D5DB" stroke="#9CA3AF" strokeWidth="3" rx="15" />
          <rect x="890" y="180" width="60" height="240" fill="#D1D5DB" stroke="#9CA3AF" strokeWidth="3" rx="15" />
        </svg>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col lg:flex-row gap-6 bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-[#1a1a1a] rounded-xl p-4 md:p-8">
      
      <div className="flex-1 overflow-x-auto">
        <button onClick={handleBackToMap} className="flex items-center gap-2 text-sm font-mono text-brand-blue hover:text-blue-700 mb-6 transition-colors">
          <ChevronLeft size={16} /> VOLVER AL MAPA GENERAL
        </button>

        <div className="flex flex-col items-center min-w-[600px]">
          <div className="w-3/4 h-12 bg-gray-800 dark:bg-gray-700 text-white rounded-t-full flex items-center justify-center font-mono text-sm mb-10 tracking-widest">
            CANCHA / ESCENARIO
          </div>

          <div className="space-y-2">
            {Array.from({ length: 10 }).map((_, rowIndex) => {
              const rowNumber = rowIndex + 1;
              const rowLetter = String.fromCharCode(64 + rowNumber);

              return (
                <div key={rowNumber} className="flex items-center gap-3">
                  <span className="w-6 text-center text-xs font-mono text-gray-400 font-bold">{rowLetter}</span>
                  <div className="flex gap-1">
                    {fondoNorteSeats.filter(s => s.row === rowNumber).map(seat => {
                      const isSelected = selectedSeat?.id === seat.id;
                      let bgColor = 'bg-green-500 hover:bg-green-400';
                      if (seat.status === 'sold') bgColor = 'bg-red-500 cursor-not-allowed';
                      if (seat.status === 'broken') bgColor = 'bg-gray-500 cursor-not-allowed';
                      if (isSelected) bgColor = 'bg-yellow-400 ring-2 ring-yellow-600';

                      return (
                        <button
                          key={seat.id}
                          disabled={seat.status !== 'available'}
                          onClick={() => setSelectedSeat(seat)}
                          className={`w-6 h-6 md:w-8 md:h-8 rounded-t-md text-[10px] md:text-xs font-bold text-white transition-all ${bgColor}`}
                          title={`Fila ${rowLetter}, Asiento ${seat.col}`}
                        >
                          {seat.col}
                        </button>
                      );
                    })}
                  </div>
                  <span className="w-6 text-center text-xs font-mono text-gray-400 font-bold">{rowLetter}</span>
                </div>
              );
            })}
          </div>
          <p className="mt-8 text-xs text-gray-500 font-mono text-center">
            Selecciona un asiento verde. Los rojos están vendidos y los grises en mantenimiento.
          </p>
        </div>
      </div>

      <div className="w-full lg:w-80 flex flex-col gap-4 border-t lg:border-t-0 lg:border-l border-gray-200 dark:border-[#1a1a1a] pt-6 lg:pt-0 lg:pl-6">
        <div className="bg-gray-50 dark:bg-[#111] border border-gray-200 dark:border-[#333] rounded-xl p-6">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white font-mono mb-4">Detalles del Ticket</h3>
          
          {selectedSeat ? (
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-800 pb-2">
                <span className="text-sm text-gray-500">Zona:</span>
                <span className="font-bold text-gray-900 dark:text-white">Fondo Norte</span>
              </div>
              <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-800 pb-2">
                <span className="text-sm text-gray-500">Fila:</span>
                <span className="font-bold text-gray-900 dark:text-white">{String.fromCharCode(64 + selectedSeat.row)}</span>
              </div>
              <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-800 pb-2">
                <span className="text-sm text-gray-500">Asiento:</span>
                <span className="font-bold text-gray-900 dark:text-white">{selectedSeat.col}</span>
              </div>
              <div className="flex justify-between items-center pt-2">
                <span className="text-sm text-gray-500">Total a Pagar:</span>
                <span className="font-bold text-brand-blue text-2xl">$50.00</span>
              </div>
              <button 
                onClick={handlePay}
                disabled={isPaying}
                className="w-full bg-brand-blue text-white font-bold py-3 rounded-lg hover:bg-blue-600 transition-colors mt-4 shadow-lg shadow-brand-blue/20 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isPaying ? <Loader2 className="animate-spin" size={18} /> : <CheckCircle2 size={18} />}
                {isPaying ? 'PROCESANDO...' : 'PAGAR CON QVAPAY'}
              </button>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-sm text-gray-500 mb-4">No has seleccionado ningún asiento todavía.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
