import { useState, useRef, WheelEvent, MouseEvent, TouchEvent } from 'react';
import { ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';

type SeatStatus = 'available' | 'sold' | 'broken';

export default function AdvancedSeatMap() {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });
  
  const [selectedZone, setSelectedZone] = useState<string | null>(null);
  const [selectedSeat, setSelectedSeat] = useState<string | null>(null);

  // Simulamos los asientos del Fondo Norte (En el futuro vendrán de la BD)
  const generateSeats = (zoneId: string, rows: number, seatsPerRow: number) => {
    const seats = [];
    for (let r = 0; r < rows; r++) {
      for (let s = 0; s < seatsPerRow; s++) {
        let status: SeatStatus = 'available';
        const random = Math.random();
        if (random > 0.85) status = 'sold';
        else if (random > 0.80) status = 'broken';
        seats.push({ id: `${zoneId}-${r}-${s}`, row: r + 1, col: s + 1, status });
      }
    }
    return seats;
  };

  const [fondoNorteSeats] = useState(generateSeats('fondo-norte', 10, 20));

  // Lógica de Zoom (Rueda del ratón y Botones)
  const handleWheel = (e: WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    setScale(prev => Math.min(Math.max(0.5, prev + delta), 4));
  };

  const handleZoomIn = () => setScale(prev => Math.min(prev + 0.2, 4));
  const handleZoomOut = () => setScale(prev => Math.max(prev - 0.2, 0.5));
  const resetTransform = () => { setScale(1); setPosition({ x: 0, y: 0 }); };

  // Lógica de Arrastre (Mouse)
  const handleMouseDown = (e: MouseEvent) => {
    setIsDragging(true);
    dragStart.current = { x: e.clientX - position.x, y: e.clientY - position.y };
  };
  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    setPosition({ x: e.clientX - dragStart.current.x, y: e.clientY - dragStart.current.y });
  };
  const handleMouseUp = () => setIsDragging(false);

  // Lógica de Arrastre (Touch / Móvil)
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
        
        {/* Controles de Zoom Flotantes */}
        <div className="absolute top-4 right-4 z-10 flex flex-col gap-2 bg-white dark:bg-[#111] p-2 rounded-lg border border-gray-200 dark:border-gray-700 shadow-lg">
          <button onClick={handleZoomIn} className="p-2 text-gray-600 dark:text-gray-300 hover:text-brand-blue"><ZoomIn size={20} /></button>
          <button onClick={handleZoomOut} className="p-2 text-gray-600 dark:text-gray-300 hover:text-brand-blue"><ZoomOut size={20} /></button>
          <button onClick={resetTransform} className="p-2 text-gray-600 dark:text-gray-300 hover:text-brand-blue"><RotateCcw size={20} /></button>
        </div>

        {/* SVG CON TRANSFORMACIÓN DE ZOOM Y ARRASTRE */}
        <div 
          className="w-full h-full flex items-center justify-center transition-transform duration-100 ease-out"
          style={{ transform: `translate(${position.x}px, ${position.y}px) scale(${scale})` }}
        >
          <svg viewBox="0 0 1000 800" className="w-full h-full bg-gray-50 dark:bg-[#050505]">
            
            {/* Césped */}
            <rect x="300" y="250" width="400" height="300" fill="#22C55E" stroke="#16A34A" strokeWidth="4" rx="10" />
            <circle cx="500" cy="400" r="50" fill="none" stroke="#16A34A" strokeWidth="4" />

            {/* Fondo Norte (Clickeable) */}
            <g onClick={() => setSelectedZone('fondo-norte')} className="cursor-pointer hover:opacity-80 transition-opacity">
              <rect x="150" y="50" width="700" height="150" fill={selectedZone === 'fondo-norte' ? '#60A5FA' : '#93C5FD'} stroke="#1E40AF" strokeWidth="3" rx="20" />
              <text x="500" y="130" textAnchor="middle" fill="#fff" fontSize="24" fontWeight="bold" className="pointer-events-none">
                FONDO NORTE (Toca aquí)
              </text>
            </g>

            {/* Otras Zonas */}
            <rect x="150" y="600" width="700" height="150" fill="#D1D5DB" stroke="#9CA3AF" strokeWidth="3" rx="20" />
            <text x="500" y="680" textAnchor="middle" fill="#4B5563" fontSize="24" fontWeight="bold" className="pointer-events-none">FONDO SUR</text>
            <rect x="50" y="200" width="80" height="400" fill="#D1D5DB" stroke="#9CA3AF" strokeWidth="3" rx="20" />
            <rect x="870" y="200" width="80" height="400" fill="#D1D5DB" stroke="#9CA3AF" strokeWidth="3" rx="20" />

            {/* Renderizado de Asientos si se selecciona Fondo Norte */}
            {selectedZone === 'fondo-norte' && (
              <g transform="translate(150, 50)">
                {fondoNorteSeats.map(seat => {
                  const x = (seat.col * 25) + 20;
                  const y = (seat.row * 12) + 20;
                  let color = '#22C55E'; 
                  if (seat.status === 'sold') color = '#EF4444';
                  if (seat.status === 'broken') color = '#6B7280';

                  return (
                    <circle 
                      key={seat.id}
                      cx={x} cy={y} r="6"
                      fill={selectedSeat === seat.id ? '#FDE047' : color}
                      stroke={selectedSeat === seat.id ? '#D97706' : 'transparent'}
                      strokeWidth="2"
                      className="cursor-pointer hover:opacity-80 transition-all"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (seat.status === 'available') setSelectedSeat(seat.id);
                      }}
                    >
                      <title>{`Fila ${seat.row}, Asiento ${seat.col} - ${seat.status}`}</title>
                    </circle>
                  );
                })}
              </g>
            )}
          </svg>
        </div>
      </div>

      {/* PANEL LATERAL (Resumen) */}
      <div className="w-full lg:w-80 flex flex-col gap-4">
        <div className="bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-[#1a1a1a] rounded-xl p-6">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white font-mono mb-4">Resumen</h3>
          
          {selectedSeat ? (
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-800 pb-2">
                <span className="text-sm text-gray-500">Asiento:</span>
                <span className="font-bold text-gray-900 dark:text-white">{selectedSeat}</span>
              </div>
              <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-800 pb-2">
                <span className="text-sm text-gray-500">Precio:</span>
                <span className="font-bold text-brand-blue">$50.00</span>
              </div>
              <button className="w-full bg-brand-blue text-white font-bold py-3 rounded-lg hover:bg-blue-600 transition-colors mt-4">
                IR A PAGAR (QvaPay)
              </button>
            </div>
          ) : (
            <p className="text-sm text-gray-500 text-center py-8">Toca el Fondo Norte y selecciona un asiento verde.</p>
          )}
        </div>

        {/* Leyenda */}
        <div className="bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-[#1a1a1a] rounded-xl p-4 space-y-3">
          <h4 className="text-xs font-bold text-gray-500 uppercase font-mono">Leyenda</h4>
          <div className="flex items-center gap-2 text-sm"><div className="w-4 h-4 rounded-full bg-green-500"></div> Disponible</div>
          <div className="flex items-center gap-2 text-sm"><div className="w-4 h-4 rounded-full bg-red-500"></div> Vendido</div>
          <div className="flex items-center gap-2 text-sm"><div className="w-4 h-4 rounded-full bg-gray-500"></div> Roto / Mantenimiento</div>
        </div>
      </div>
    </div>
  );
}
