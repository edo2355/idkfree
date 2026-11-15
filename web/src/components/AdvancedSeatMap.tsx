import { useState } from 'react';

interface Zone {
  id: string;
  name: string;
  price: number;
  color: string;
  hoverColor: string;
  path: string;
}

const zonesData: Zone[] = [
  { 
    id: 'floor', name: 'Floor Pit (De Pie)', price: 150, 
    color: '#93C5FD', hoverColor: '#60A5FA', // Azul claro
    path: 'M 250 150 L 550 150 L 550 250 L 250 250 Z' // Rectángulo central
  },
  { 
    id: 'sec_a', name: 'Sección A (VIP)', price: 120, 
    color: '#FDE047', hoverColor: '#FACC15', // Amarillo
    path: 'M 200 150 Q 400 50 600 150 L 580 170 Q 400 80 220 170 Z' 
  },
  { 
    id: 'sec_b', name: 'Sección B (Preferente)', price: 80, 
    color: '#6EE7B7', hoverColor: '#34D399', // Verde
    path: 'M 150 160 Q 400 10 650 160 L 630 190 Q 400 40 170 190 Z' 
  },
  { 
    id: 'sec_c', name: 'Sección C (General)', price: 50, 
    color: '#D1D5DB', hoverColor: '#9CA3AF', // Gris
    path: 'M 100 170 Q 400 -20 700 170 L 680 220 Q 400 10 120 220 Z' 
  },
  { 
    id: 'sec_d', name: 'Sección D (Lateral)', price: 40, 
    color: '#D1D5DB', hoverColor: '#9CA3AF', 
    path: 'M 180 260 L 250 260 L 250 350 L 200 350 Z M 550 260 L 620 260 L 600 350 L 550 350 Z' 
  }
];

export default function AdvancedSeatMap() {
  const [hoveredZone, setHoveredZone] = useState<string | null>(null);
  const [selectedZones, setSelectedZones] = useState<string[]>([]);

  const toggleZone = (id: string) => {
    setSelectedZones(prev => 
      prev.includes(id) ? prev.filter(z => z !== id) : [...prev, id]
    );
  };

  const totalPrice = selectedZones.reduce((acc, id) => {
    const zone = zonesData.find(z => z.id === id);
    return acc + (zone ? zone.price : 0);
  }, 0);

  return (
    <div className="flex flex-col lg:flex-row gap-6 bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-[#1a1a1a] rounded-xl overflow-hidden p-4 md:p-6 w-full">
      
      {/* MAPA SVG */}
      <div className="flex-1 flex flex-col items-center justify-center relative bg-gray-50 dark:bg-[#050505] rounded-lg border border-gray-100 dark:border-[#111] min-h-[400px]">
        <svg viewBox="0 0 800 450" className="w-full max-w-2xl h-auto drop-shadow-lg">
          
          {/* Etiqueta del Escenario */}
          <rect x="300" y="30" width="200" height="60" rx="8" fill="#374151" className="dark:fill-gray-700" />
          <text x="400" y="68" textAnchor="middle" fill="#ffffff" fontSize="14" fontWeight="bold" fontFamily="monospace">ESCENARIO</text>

          {/* Renderizado de Zonas */}
          {zonesData.map((zone) => {
            const isHovered = hoveredZone === zone.id;
            const isSelected = selectedZones.includes(zone.id);
            
            return (
              <path
                key={zone.id}
                d={zone.path}
                fill={isSelected ? zone.hoverColor : (isHovered ? zone.color : zone.color)}
                stroke={isSelected ? '#2563EB' : '#9CA3AF'}
                strokeWidth={isSelected ? 3 : 1}
                className="cursor-pointer transition-all duration-200"
                onMouseEnter={() => setHoveredZone(zone.id)}
                onMouseLeave={() => setHoveredZone(null)}
                onClick={() => toggleZone(zone.id)}
                opacity={isSelected ? 1 : 0.8}
              />
            );
          })}
          
          {/* Etiquetas de las Zonas */}
          <text x="400" y="210" textAnchor="middle" fill="#1F2937" fontSize="12" fontWeight="bold">FLOOR PIT</text>
          <text x="400" y="140" textAnchor="middle" fill="#1F2937" fontSize="10">SECCIÓN A</text>
        </svg>

        {/* Controles de Zoom (Simulados visualmente) */}
        <div className="absolute bottom-4 right-4 flex flex-col gap-2">
          <button className="w-8 h-8 bg-white dark:bg-[#1a1a1a] border border-gray-300 dark:border-gray-600 rounded flex items-center justify-center text-gray-500 hover:text-black dark:hover:text-white">+</button>
          <button className="w-8 h-8 bg-white dark:bg-[#1a1a1a] border border-gray-300 dark:border-gray-600 rounded flex items-center justify-center text-gray-500 hover:text-black dark:hover:text-white">-</button>
        </div>
      </div>

      {/* LISTA LATERAL DE ZONAS (Estilo Ticketmaster) */}
      <div className="w-full lg:w-80 flex flex-col">
        <div className="border-b border-gray-200 dark:border-[#1a1a1a] pb-3 mb-3">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white font-mono uppercase">Selecciona tus asientos</h3>
          <p className="text-xs text-gray-500">Haz clic en una zona del mapa.</p>
        </div>

        <div className="flex-1 overflow-y-auto max-h-[300px] space-y-2 pr-2">
          {zonesData.map((zone) => (
            <div 
              key={zone.id} 
              onClick={() => toggleZone(zone.id)}
              className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors ${selectedZones.includes(zone.id) ? 'border-brand-blue bg-brand-blue/5' : 'border-gray-200 dark:border-[#1a1a1a] hover:bg-gray-50 dark:hover:bg-[#111]'}`}
            >
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full border border-gray-400" style={{ backgroundColor: zone.color }}></div>
                <div>
                  <p className="text-sm font-bold text-gray-900 dark:text-white">{zone.name}</p>
                  <p className="text-xs text-gray-500 font-mono">Disponibilidad: Alta</p>
                </div>
              </div>
              <p className="font-mono text-sm font-bold text-gray-900 dark:text-white">${zone.price}</p>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-200 dark:border-[#1a1a1a] pt-4 mt-4">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm text-gray-500 font-mono">Total:</span>
            <span className="text-2xl font-bold text-gray-900 dark:text-white font-mono">${totalPrice}.00</span>
          </div>
          <button className="w-full bg-brand-blue text-white font-bold py-3 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50" disabled={totalPrice === 0}>
            CONTINUAR AL PAGO
          </button>
        </div>
      </div>
    </div>
  );
}
