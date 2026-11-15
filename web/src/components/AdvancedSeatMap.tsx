import { useState, useRef, WheelEvent, MouseEvent, TouchEvent } from 'react';
import { ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';

type SeatStatus = 'available' | 'sold' | 'broken';
interface Seat { id: string; row: number; col: number; status: SeatStatus; }

export default function AdvancedSeatMap({ venueId }: { venueId: string }) {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });
  
  const [selectedZone, setSelectedZone] = useState<string | null>(null);
  const [selectedSeat, setSelectedSeat] = useState<Seat | null>(null);

  // Generamos los asientos del Fondo Norte (Simulando la base de datos)
  const generateSeats = (zoneId: string, rows: number, seatsPerRow: number): Seat[] => {
    const seats = [];
    for (let r = 1; r <= rows; r++) {
      for (let s = 1; s <= seatsPerRow; s++) {
        let status: SeatStatus = 'available';
        // Simulamos algunos asientos vendidos o rotos
        if ((r === 3 && s === 5) || (r === 7 && s === 12)) status = 'sold';
        else if ((r === 5 && s === 8) || (r === 2 && s === 15)) status = 'broken';
        
        seats.push({ id: `${zoneId}-${r}-${s}`, row: r, col: s, status });
      }
    }
    return seats;
  };

  const [fondoNorteSeats] = useState(() => generateSeats('fondo-norte', 8, 20));

  const handleWheel = (e: WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    setScale(prev => Math.min(Math.max(0.5, prev + delta), 4));
  };

  const handleZoomIn = () => setScale(prev => Math.min(prev + 0.2, 4));
  const handleZoomOut = () => setScale(prev => Math.max(prev - 0.2, 0.5));
  const resetTransform = () => { setScale(1); setPosition({ x: 0, y: 0 }); setSelectedZone(null); };

  const handleMouseDown = (e: MouseEvent) => {
    setIsDragging(true);
    dragStart.current = { x: e.clientX - position.x, y: e.clientY - position.y };
  };
  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    setPosition({ x: e.clientX - dragStart.current.x, y: e.clientY - dragStart.current.y });
  };
  const handleMouseUp = () => setIsDragging(false);

  const handleTouchStart = (e: TouchEvent) => {
    setIsDragging(true);
    dragStart.current = { x: e.touches[0].clientX - position.x, y: e.touches[0].clientY - position.y };
  };
  const handleTouchMove = (e: TouchEvent) => {
    if (!isDragging) return;
    setPosition({ x: e.touches[0].clientX - dragStart.current.x, y: e.touches[0].clientY - dragStart.current.y });
  };
  const handleTouchEnd = () => setIsDragging(false);

  return (
    <div className="flex flex-col lg:flex-row gap-6 w-full max-w-6xl mx-auto h-[600px]">
      
      {/* CONTENEDOR DEL MAPA */}
      <div 
        className="flex-1 bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-[#1a1a1a] rounded-xl relative overflow-hidden flex flex-col cursor-grab active:cursor-grabbing touch-none"
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Controles de Zoom */}
        <div className="absolute top-4 right-4 z-10 flex flex-col gap-2 bg-white dark:bg-[#111] p-2 rounded-lg border border-gray-200 dark:border-gray-700 shadow-lg">
          <button onClick={handleZoomIn} className="p-2 text-gray-600 dark:text-gray-300 hover:text-brand-blue"><ZoomIn size={20} /></button>
          <button onClick={handleZoomOut} className="p-2 text-gray-600 dark:text-gray-300 hover:text-brand-blue"><ZoomOut size={20} /></button>
          <button onClick={resetTransform} className="p-2 text-gray-600 dark:text-gray-300 hover:text-brand-blue"><RotateCcw size={20} /></button>
        </div>

        {/* SVG CON TRANSFORMACIÓN */}
        <div 
          className="w-full h-full flex items-center justify-center transition-transform duration-100 ease-out"
          style={{ transform: `translate(${position.x}px, ${position.y}px) scale(${scale})` }}
        >
          <svg viewBox="0 0 1000 800" className="w-full h-full bg-gray-50 dark:bg-[#050505]">
            
            {/* Césped */}
            <rect x="300" y="250" width="400" height="300" fill="#22C55E" stroke="#16A34A" strokeWidth="4" rx="10" />
            <circle cx="500" cy="400" r="50" fill="none" stroke="#16A34A" strokeWidth="4" />

            {/* Fondo Norte (Clickeable para ver asientos) */}
            <g onClick={() => setSelectedZone(selectedZone === 'fondo-norte' ? null : 'fondo-norte')} className="cursor-pointer hover:opacity-80 transition-opacity">
              <rect x="150" y="50" width="700" height="150" fill={selectedZone === 'fondo-norte' ? '#60A5FA' : '#93C5FD'} stroke="#1E40AF" strokeWidth="3" rx="20" />
              <text x="500" y="130" textAnchor="middle" fill="#fff" fontSize="24" fontWeight="bold" className="pointer-events-none">
                FONDO NORTE (Toca para ver asientos)
              </text>
            </g>

            {/* Otras Zonas */}
            <rect x="150" y="600" width="700" height="150" fill="#D1D5DB" stroke="#9CA3AF" strokeWidth="3" rx="20" />
            <text x="500" y="680" textAnchor="middle" fill="#4B5563" fontSize="24" fontWeight="bold" className="pointer-events-none">FONDO SUR</text>
            <rect x="50" y="200" width="80" height="400" fill="#D1D5DB" stroke="#9CA3AF" strokeWidth="3" rx="20" />
            <rect x="870" y="200" width="80" height="400" fill="#D1D5DB" stroke="#9CA3AF" strokeWidth="3" rx="20" />

            {/* Renderizado de Asientos del Fondo Norte */}
            {selectedZone === 'fondo-norte' && (
              <g transform="translate(150, 50)">
                {/* Filas */}
                {fondoNorteSeats.map(seat => {
                  const x = (seat.col * 33) + 10; 
                  const y = (seat.row * 16) + 10;
                  let color = '#22C55E'; // Verde (Disponible)
                  if (seat.status === 'sold') color = '#EF4444'; // Rojo (Vendido)
                  if (seat.status === 'broken') color = '#6B7280'; // Gris (Roto)

                  return (
                    <rect 
                      key={seat.id}
                      x={x} y={y} width="20" height="12" rx="3"
                      fill={selectedSeat?.id === seat.id ? '#FDE047' : color}
                      stroke={selectedSeat?.id === seat.id ? '#D97706' : 'transparent'}
                      strokeWidth="2"
                      className="cursor-pointer hover:opacity-70 transition-all"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (seat.status === 'available') setSelectedSeat(seat);
                      }}
                    >
                      <title>{`Fila ${seat.row}, Asiento ${seat.col} - ${seat.status}`}</title>
                    </rect>
                  );
                })}
              </g>
            )}
          </svg>
        </div>
      </div>

      {/* PANEL LATERAL (Resumen y Compra) */}
      <div className="w-full lg:w-80 flex flex-col gap-4">
        <div className="bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-[#1a1a1a] rounded-xl p-6">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white font-mono mb-4">Resumen del Ticket</h3>
          
          {selectedSeat ? (
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-800 pb-2">
                <span className="text-sm text-gray-500">Zona:</span>
                <span className="font-bold text-gray-900 dark:text-white">Fondo Norte</span>
              </div>
              <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-800 pb-2">
                <span className="text-sm text-gray-500">Ubicación:</span>
                <span className="font-bold text-gray-900 dark:text-white text-right">Fila {selectedSeat.row},<br/>Asiento {selectedSeat.col}</span>
              </div>
              <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-800 pb-2">
                <span className="text-sm text-gray-500">Precio:</span>
                <span className="font-bold text-brand-blue text-xl">$50.00</span>
              </div>
              <button className="w-full bg-brand-blue text-white font-bold py-3 rounded-lg hover:bg-blue-600 transition-colors mt-4 shadow-lg shadow-brand-blue/20">
                PAGAR CON QVAPAY
              </button>
              <button onClick={() => setSelectedSeat(null)} className="w-full text-xs text-gray-500 hover:text-gray-800 dark:hover:text-white transition-colors mt-2">
                Cancelar selección
              </button>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-sm text-gray-500 mb-4">Toca el Fondo Norte en el mapa para ver los asientos disponibles.</p>
              <div className="flex justify-center gap-4 text-xs font-mono">
                <span className="flex items-center gap-1"><div className="w-2 h-2 bg-green-500 rounded-full"></div> Libre</span>
                <span className="flex items-center gap-1"><div className="w-2 h-2 bg-red-500 rounded-full"></div> Vendido</span>
                <span className="flex items-center gap-1"><div className="w-2 h-2 bg-gray-500 rounded-full"></div> Roto</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
