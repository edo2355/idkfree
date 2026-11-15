import { useState } from 'react';
import { Plus, MapPin, Search, ArrowRight, ChevronLeft } from 'lucide-react';
import SeatMap from '../components/SeatMap';
import { venueTemplates, VenueTemplate } from '../data/venueTemplates';

export default function Ticketera() {
  const [view, setView] = useState<'catalog' | 'map'>('catalog');
  const [selectedTemplate, setSelectedTemplate] = useState<VenueTemplate | null>(null);
  const [search, setSearch] = useState('');

  const filteredTemplates = venueTemplates.filter(t => 
    t.name.toLowerCase().includes(search.toLowerCase()) || 
    t.country.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelectVenue = (template: VenueTemplate) => {
    setSelectedTemplate(template);
    setView('map');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Header Dinámico */}
      <div className="flex justify-between items-center border-b border-gray-200 dark:border-brand-border pb-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white font-mono tracking-tight">
            {view === 'catalog' ? 'CATÁLOGO DE RECINTOS' : 'MAPA INTERACTIVO'}
          </h1>
          <p className="text-gray-500 font-mono text-xs mt-1">
            {view === 'catalog' ? 'Selecciona un estadio, arena o teatro.' : `Vista previa: ${selectedTemplate?.name}`}
          </p>
        </div>
        {view === 'map' && (
          <button onClick={() => setView('catalog')} className="text-xs font-mono text-brand-blue hover:text-blue-700 flex items-center gap-1 transition-colors">
            <ChevronLeft size={14} /> VOLVER AL CATÁLOGO
          </button>
        )}
      </div>

      {/* VISTA 1: CATÁLOGO */}
      {view === 'catalog' && (
        <div className="space-y-6">
          {/* Barra de Búsqueda y Filtro */}
          <div className="flex gap-4">
            <div className="flex-1 flex items-center bg-white dark:bg-brand-panel border border-gray-200 dark:border-brand-border rounded-lg px-4 py-3">
              <Search size={18} className="text-gray-500 mr-3" />
              <input 
                type="text" 
                placeholder="Buscar por país o nombre del estadio..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-transparent border-none outline-none text-sm w-full text-gray-900 dark:text-white" 
              />
            </div>
            <button className="flex items-center gap-2 bg-brand-blue text-white px-6 py-3 rounded-lg text-sm font-bold hover:bg-blue-600 transition-colors">
              <Plus size={18} /> AÑADIR NUEVO
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTemplates.map((template) => (
              <div key={template.id} className="border border-gray-200 dark:border-brand-border bg-white dark:bg-brand-panel p-6 rounded-lg hover:border-brand-blue transition-colors group cursor-pointer" onClick={() => handleSelectVenue(template)}>
                <div className="flex justify-between items-start mb-4">
                  <div className="p-2 bg-brand-blue/10 rounded-lg"><MapPin size={20} className="text-brand-blue" /></div>
                  <span className="text-[10px] font-mono bg-gray-100 dark:bg-[#111] text-gray-500 px-2 py-1 rounded uppercase">{template.type}</span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">{template.name}</h3>
                <p className="text-xs text-gray-500 font-mono mb-4">{template.city}, {template.country}</p>
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="text-gray-500">{template.capacity.toLocaleString()} Cap.</span>
                  <span className="text-brand-blue flex items-center gap-1 group-hover:translate-x-1 transition-transform">VER MAPA <ArrowRight size={14} /></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VISTA 2: MAPA INTERACTIVO */}
      {view === 'map' && selectedTemplate && (
        <div className="max-w-5xl mx-auto space-y-6">
          <div className="flex justify-between items-center bg-white dark:bg-brand-panel p-4 rounded-lg border border-gray-200 dark:border-brand-border">
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">{selectedTemplate.name}</h2>
              <p className="text-xs text-gray-500 font-mono">{selectedTemplate.city}, {selectedTemplate.country}</p>
            </div>
            <button className="bg-brand-blue text-white px-6 py-2 rounded text-sm font-bold hover:bg-blue-600 transition-colors">
              GUARDAR ASIENTOS
            </button>
          </div>

          <SeatMap template={selectedTemplate} />
        </div>
      )}
    </div>
  );
}
