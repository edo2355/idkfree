import { useState } from 'react';

export default function SeatMap() {
  // Simulamos los asientos (true = ocupado, false = libre)
  const [seats, setSeats] = useState<boolean[]>([
    false, false, true, false, false, false, false, true, false, false,
    false, true, true, false, false, false, false, false, false, false,
    false, false, false, true, true, false, false, false, false, false,
  ]);

  const toggleSeat = (index: number) => {
    if (seats[index]) return; // Si está ocupado, no hace nada
    const newSeats = [...seats];
    newSeats[index] = !newSeats[index]; // Lo marca como ocupado (seleccionado)
    setSeats(newSeats);
  };

  return (
    <div className="flex flex-col items-center p-8 bg-[#0a0a0a] border border-gray-800 rounded-xl">
      {/* Escenario */}
      <div className="w-full max-w-md h-8 bg-gradient-to-t from-orange-500/20 to-transparent border-t border-orange-500 mb-8 text-center text-xs font-mono text-orange-500 pt-1">
        ESCENARIO / PANTALLA
      </div>

      {/* Mapa de Asientos */}
      <div className="grid grid-cols-10 gap-2 mb-8">
        {seats.map((isOccupied, i) => (
          <button
            key={i}
            onClick={() => toggleSeat(i)}
            disabled={isOccupied && seats[i]}
            className={`w-8 h-8 rounded-t-lg border transition-colors flex items-center justify-center text-[10px] font-mono
              ${isOccupied 
                ? 'bg-red-900/50 border-red-700 text-red-500 cursor-not-allowed' 
                : 'bg-[#111] border-gray-600 text-gray-500 hover:border-cyan-500 hover:text-cyan-500'
              }`}
          >
            {i + 1}
          </button>
        ))}
      </div>

      {/* Leyenda */}
      <div className="flex gap-6 text-xs font-mono text-gray-400">
        <div className="flex items-center gap-2"><div className="w-3 h-3 bg-[#111] border border-gray-600"></div> Disponible</div>
        <div className="flex items-center gap-2"><div className="w-3 h-3 bg-red-900/50 border border-red-700"></div> Ocupado</div>
        <div className="flex items-center gap-2"><div className="w-3 h-3 bg-cyan-500/20 border border-cyan-500"></div> Seleccionado</div>
      </div>
    </div>
  );
}
