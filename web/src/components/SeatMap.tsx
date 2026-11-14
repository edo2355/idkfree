import { useState } from 'react';

type VenueType = 'theater' | 'stadium' | 'general';

export default function SeatMap() {
  const [venueType, setVenueType] = useState<VenueType>('theater');
  const [seats, setSeats] = useState<boolean[]>(Array(40).fill(false));

  const toggleSeat = (index: number) => {
    if (seats[index]) return;
    const newSeats = [...seats];
    newSeats[index] = !newSeats[index];
    setSeats(newSeats);
  };

  return (
    <div className="flex flex-col items-center p-8 bg-brand-panel border border-brand-border rounded-xl w-full">
      
      {/* Selector de Recinto */}
      <div className="flex gap-2 mb-8 bg-[#000] p-1 rounded-lg border border-brand-border">
        <button onClick={() => setVenueType('theater')} className={`px-4 py-2 text-xs font-mono transition-colors ${venueType === 'theater' ? 'bg-brand-blue text-white' : 'text-gray-500 hover:text-white'}`}>TEATRO</button>
        <button onClick={() => setVenueType('stadium')} className={`px-4 py-2 text-xs font-mono transition-colors ${venueType === 'stadium' ? 'bg-brand-blue text-white' : 'text-gray-500 hover:text-white'}`}>ESTADIO</button>
        <button onClick={() => setVenueType('general')} className={`px-4 py-2 text-xs font-mono transition-colors ${venueType === 'general' ? 'bg-brand-blue text-white' : 'text-gray-500 hover:text-white'}`}>GENERAL</button>
      </div>

      {/* Renderizado según el tipo */}
      {venueType === 'theater' && (
        <div className="w-full max-w-lg flex flex-col items-center">
          <div className="w-3/4 h-8 bg-gradient-to-t from-brand-blue/20 to-transparent border-t border-brand-blue mb-6 text-center text-[10px] font-mono text-brand-blue pt-1">ESCENARIO</div>
          <div className="grid grid-cols-8 gap-1.5 mb-8">
            {Array(32).fill(0).map((_, i) => (
              <button key={i} onClick={() => toggleSeat(i)} className={`w-7 h-7 rounded-sm border text-[8px] ${seats[i] ? 'bg-red-900/50 border-red-700' : 'bg-[#111] border-gray-600 hover:border-brand-blue'}`}>{i + 1}</button>
            ))}
          </div>
        </div>
      )}

      {venueType === 'stadium' && (
        <div className="w-full max-w-2xl flex flex-col items-center relative">
          {/* Campo */}
          <div className="w-48 h-24 border-2 border-green-900/50 bg-green-900/10 rounded-sm mb-4 flex items-center justify-center">
            <span className="text-[10px] font-mono text-green-700">CAMPO</span>
          </div>
          <div className="grid grid-cols-12 gap-1 w-full">
            {Array(48).fill(0).map((_, i) => (
              <button key={i} onClick={() => toggleSeat(i)} className={`h-4 rounded-sm border ${seats[i] ? 'bg-red-900/50 border-red-700' : 'bg-[#111] border-gray-600 hover:border-brand-blue'}`}></button>
            ))}
          </div>
        </div>
      )}

      {venueType === 'general' && (
        <div className="w-full max-w-md border border-dashed border-gray-600 p-12 text-center rounded-lg hover:border-brand-blue transition-colors cursor-pointer">
          <h3 className="text-xl font-bold text-white mb-2">ZONA GENERAL (DE PIE)</h3>
          <p className="text-sm text-gray-400 font-mono mb-4">Admisión general sin asiento fijo.</p>
          <p className="text-2xl font-bold text-brand-blue">$15.00 USD</p>
        </div>
      )}

      {/* Leyenda (Solo para Teatro y Estadio) */}
      {venueType !== 'general' && (
        <div className="flex gap-6 text-[10px] font-mono text-gray-400 mt-6 border-t border-brand-border pt-4 w-full justify-center">
          <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 bg-[#111] border border-gray-600"></div> Libre</div>
          <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 bg-red-900/50 border border-red-700"></div> Ocupado</div>
          <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 bg-brand-blue"></div> Seleccionado</div>
        </div>
      )}
    </div>
  );
}
