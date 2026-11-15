import { useState } from 'react';
import { VenueTemplate } from '../data/venueTemplates';

interface SeatMapProps {
  template: VenueTemplate;
}

export default function SeatMap({ template }: SeatMapProps) {
  // Estado de los asientos: 'available', 'occupied', 'selected'
  const [seatStates, setSeatStates] = useState<Record<string, string>>({});

  const toggleSeat = (seatId: string) => {
    if (seatStates[seatId] === 'occupied') return;
    setSeatStates(prev => ({
      ...prev,
      [seatId]: prev[seatId] === 'selected' ? 'available' : 'selected'
    }));
  };

  // Simulamos algunos asientos ocupados al azar
  const isOccupied = (zoneId: string, row: number, seat: number) => {
    return (row === 1 && seat === 3) || (row === 2 && seat === 5); // Asientos de prueba ocupados
  };

  return (
    <div className="flex flex-col items-center p-8 bg-white dark:bg-brand-panel border border-gray-200 dark:border-brand-border rounded-xl w-full overflow-x-auto">
      
      {/* Escenario / Cancha */}
      <div className="w-full max-w-2xl h-12 bg-gradient-to-t from-brand-blue/20 to-transparent border-t-2 border-brand-blue mb-8 text-center text-xs font-mono text-brand-blue pt-2 rounded-t-full">
        {template.type === 'theater' ? 'ESCENARIO PRINCIPAL' : 
         template.type === 'stadium' ? 'CAMPO DE JUEGO' : 'ARENA CENTRAL'}
      </div>

      {/* Renderizado de Zonas */}
      <div className="space-y-8 w-full flex flex-col items-center">
        {template.zones.map((zone) => (
          <div key={zone.id} className="flex flex-col items-center">
            <p className={`text-[10px] font-mono mb-2 font-bold ${zone.color.replace('bg-', 'text-')}`}>
              {zone.name.toUpperCase()} - {zone.rows * zone.seatsPerRow} ASIENTOS
            </p>
            
            <div className="space-y-1">
              {Array.from({ length: zone.rows }).map((_, rowIndex) => (
                <div key={rowIndex} className="flex gap-1 items-center">
                  <span className="text-[10px] text-gray-500 font-mono w-4 text-right">{String.fromCharCode(65 + rowIndex)}</span>
                  {Array.from({ length: zone.seatsPerRow }).map((_, seatIndex) => {
                    const seatId = `${zone.id}-${rowIndex}-${seatIndex}`;
                    const isOcc = isOccupied(zone.id, rowIndex, seatIndex) || seatStates[seatId] === 'occupied';
                    const isSel = seatStates[seatId] === 'selected';

                    return (
                      <button
                        key={seatIndex}
                        onClick={() => toggleSeat(seatId)}
                        disabled={isOcc}
                        title={`Asiento ${String.fromCharCode(65 + rowIndex)}${seatIndex + 1}`}
                        className={`w-5 h-5 md:w-6 md:h-6 rounded-t-sm border transition-colors flex items-center justify-center
                          ${isOcc ? 'bg-gray-300 dark:bg-gray-800 border-gray-400 dark:border-gray-700 cursor-not-allowed' : 
                            isSel ? 'bg-brand-blue border-blue-400 text-white' : 
                            'bg-white dark:bg-[#111] border-gray-300 dark:border-gray-600 hover:border-brand-blue'
                          }`}
                      >
                        {isSel && <span className="text-[8px]">✓</span>}
                      </button>
                    );
                  })}
                  <span className="text-[10px] text-gray-500 font-mono w-4">{String.fromCharCode(65 + rowIndex)}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Leyenda */}
      <div className="flex flex-wrap gap-6 text-[10px] font-mono text-gray-500 mt-10 border-t border-gray-200 dark:border-brand-border pt-4 w-full justify-center">
        <div className="flex items-center gap-2"><div className="w-3 h-3 bg-white dark:bg-[#111] border border-gray-300 dark:border-gray-600"></div> Disponible</div>
        <div className="flex items-center gap-2"><div className="w-3 h-3 bg-gray-300 dark:bg-gray-800 border border-gray-400"></div> Ocupado</div>
        <div className="flex items-center gap-2"><div className="w-3 h-3 bg-brand-blue border border-blue-400"></div> Seleccionado</div>
      </div>
    </div>
  );
}
