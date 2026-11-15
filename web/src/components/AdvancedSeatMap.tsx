import { useState } from 'react';

interface Section {
  id: string;
  name: string;
  price: number;
  color: string;
  hoverColor: string;
  path: string;
}

// Definimos las secciones de forma geométrica para el Bernabéu
const bernabeuSections: Section[] = [
  { id: 'fondo_norte', name: 'Fondo Norte (General)', price: 50, color: '#93C5FD', hoverColor: '#60A5FA', path: 'M 150 50 Q 400 20 650 50 L 680 90 L 120 90 Z' },
  { id: 'fondo_sur', name: 'Fondo Sur (General)', price: 50, color: '#93C5FD', hoverColor: '#60A5FA', path: 'M 120 510 L 680 510 L 650 550 Q 400 580 150 550 Z' },
  { id: 'lateral_este', name: 'Lateral Este (Preferente)', price: 80, color: '#6EE7B7', hoverColor: '#34D399', path: 'M 680 90 L 720 120 L 720 480 L 680 510 L 650 510 L 650 90 Z' },
  { id: 'lateral_oeste', name: 'Lateral Oeste (Preferente)', price: 80, color: '#6EE7B7', hoverColor: '#34D399', path: 'M 120 90 L 80 120 L 80 480 L 120 510 L 150 510 L 150 90 Z' },
  { id: 'vip', name: 'Palcos VIP (Premium)', price: 150, color: '#FDE047', hoverColor: '#FACC15', path: 'M 220 130 L 580 130 L 580 470 L 220 470 Z' },
];

export default function AdvancedSeatMap({ venueId }: { venueId: string }) {
  const [selectedSection, setSelectedSection] = useState<Section | null>(null);

  // Si el venue no es el Bernabéu, mostramos un aviso
  if (venueId !== 'bernabeu') {
    return (
      <div className="p-10 text-center text-gray-500 font-mono border border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
        <p>El mapa detallado para este recinto estará disponible próximamente.</p>
        <p className="text-xs mt-2">Selecciona el Estadio Santiago Bernabéu para ver la demo.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6 w-full max-w-5xl mx-auto">
      
      {/* MAPA SVG */}
      <div className="flex-1 bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-[#1a1a1a] rounded-xl p-4 flex items-center justify-center relative min-h-[400px]">
        <svg viewBox="0 0 800 600" className="w-full h-auto drop-shadow-xl">
          {/* Césped */}
          <rect x="250" y="180" width="300" height="240" fill="#22C55E" stroke="#16A34A" strokeWidth="4" rx="10" />
          <circle cx="400" cy="300" r="40" fill="none" stroke="#16A34A" strokeWidth="2" />
          
          {/* Secciones */}
          {bernabeuSections.map((section) => {
            const isSelected = selectedSection?.id === section.id;
            return (
              <path
                key={section.id}
                d={section.path}
                fill={isSelected ? section.hoverColor : section.color}
                stroke={isSelected ? '#2563EB' : '#9CA3AF'}
                strokeWidth={isSelected ? 4 : 1}
                className="cursor-pointer transition-all duration-200 hover:opacity-80"
                onClick={() => setSelectedSection(section)}
              >
                <title>{section.name} - ${section.price}</title>
              </path>
            );
          })}

          {/* Textos sobre las secciones */}
          <text x="400" y="80" textAnchor="middle" fill="#1F2937" fontSize="14" fontWeight="bold">FONDO NORTE</text>
          <text x="400" y="540" textAnchor="middle" fill="#1F2937" fontSize="14" fontWeight="bold">FONDO SUR</text>
          <text x="720" y="300" textAnchor="middle" fill="#065F46" fontSize="12" fontWeight="bold" transform="rotate(90 720 300)">LATERAL ESTE</text>
          <text x="80" y="300" textAnchor="middle" fill="#065F46" fontSize="12" fontWeight="bold" transform="rotate(-90 80 300)">LATERAL OESTE</text>
          <text x="400" y="300" textAnchor="middle" fill="#854D0E" fontSize="14" fontWeight="bold">PALCOS VIP</text>
        </svg>
      </div>

      {/* PANEL DE SELECCIÓN */}
      <div className="w-full lg:w-80 flex flex-col gap-4">
        <div className="bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-[#1a1a1a] rounded-xl p-6">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white font-mono mb-4">Resumen de compra</h3>
          
          {selectedSection ? (
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-800 pb-2">
                <span className="text-sm text-gray-500">Zona seleccionada:</span>
                <span className="font-bold text-gray-900 dark:text-white">{selectedSection.name}</span>
              </div>
              <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-800 pb-2">
                <span className="text-sm text-gray-500">Precio por boleto:</span>
                <span className="font-bold text-brand-blue">${selectedSection.price}.00</span>
              </div>
              <button className="w-full bg-brand-blue text-white font-bold py-3 rounded-lg hover:bg-blue-600 transition-colors mt-4">
                SELECCIONAR ASIENTOS
              </button>
            </div>
          ) : (
            <p className="text-sm text-gray-500 text-center py-8">Toca una zona del mapa para ver los precios y disponibilidad.</p>
          )}
        </div>

        {/* Leyenda */}
        <div className="bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-[#1a1a1a] rounded-xl p-4 flex flex-wrap gap-4 justify-center">
          {bernabeuSections.map(s => (
            <div key={s.id} className="flex items-center gap-2 text-xs font-mono text-gray-500">
              <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: s.color }}></div>
              {s.name.split(' ')[0]}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
