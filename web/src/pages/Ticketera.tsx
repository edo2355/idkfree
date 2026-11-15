import { useState } from 'react';
import { Plus, MapPin, Search, ArrowRight, ChevronLeft, Calendar } from 'lucide-react';
import { realVenueTemplates, VenueTemplate } from '../data/realVenueTemplates';
import { useAuthStore } from '../stores/authStore';
import { useUIStore } from '../stores/uiStore';

export default function Ticketera() {
  const { token } = useAuthStore();
  const { showToast } = useUIStore();
  
  const [view, setView] = useState<'catalog' | 'map' | 'create-event'>('catalog');
  const [selectedTemplate, setSelectedTemplate] = useState<VenueTemplate | null>(null);
  const [search, setSearch] = useState('');
  const [eventName, setEventName] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [selectedVenueId, setSelectedVenueId] = useState('');

  const filteredTemplates = realVenueTemplates.filter(t => 
    t.name.toLowerCase().includes(search.toLowerCase()) || 
    t.country.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      showToast('Debes iniciar sesión de nuevo', 'error');
      return;
    }

    try {
      const isoDate = new Date(eventDate).toISOString();
      const res = await fetch('https://idkfree.onrender.com/api/ticketing/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ venueId: selectedVenueId, name: eventName, date: isoDate })
      });

      if (res.ok) {
        showToast('Evento creado exitosamente', 'success');
        setView('catalog');
        setEventName(''); setEventDate(''); setSelectedVenueId('');
      } else {
        const errorData = await res.json();
        showToast(errorData.error || 'Error al crear el evento', 'error');
        console.error('Error backend:', errorData);
      }
    } catch (error) {
      console.error(error);
      showToast('Error de red o del servidor', 'error');
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-gray-200 dark:border-brand-border pb-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white font-mono tracking-tight">
            {view === 'catalog' && 'CATÁLOGO DE RECINTOS'}
            {view === 'map' && 'MAPA INTERACTIVO'}
            {view === 'create-event' && 'CREAR NUEVO EVENTO'}
          </h1>
          <p className="text-gray-500 font-mono text-xs mt-1">
            {view === 'catalog' && 'Selecciona un recinto o crea un evento.'}
            {view === 'map' && `Vista previa: ${selectedTemplate?.name}`}
            {view === 'create-event' && 'Asigna un nombre, fecha y recinto a tu evento.'}
          </p>
        </div>
        {view !== 'catalog' && (
          <button onClick={() => setView('catalog')} className="text-xs font-mono text-brand-blue hover:text-blue-700 flex items-center gap-1 transition-colors">
            <ChevronLeft size={14} /> VOLVER AL CATÁLOGO
          </button>
        )}
      </div>

      {/* VISTA 1: CATÁLOGO */}
      {view === 'catalog' && (
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row gap-4">
            <button onClick={() => setView('create-event')} className="flex-1 bg-brand-blue text-white font-bold py-3 px-6 rounded-lg flex items-center justify-center gap-2 hover:bg-blue-600 transition-colors">
              <Calendar size={18} /> CREAR NUEVO EVENTO
            </button>
            <div className="flex-1 flex items-center bg-white dark:bg-brand-panel border border-gray-200 dark:border-brand-border rounded-lg px-4 py-3">
              <Search size={18} className="text-gray-500 mr-3" />
              <input type="text" placeholder="Buscar estadio, teatro o país..." value={search} onChange={(e) => setSearch(e.target.value)} className="bg-transparent border-none outline-none text-sm w-full text-gray-900 dark:text-white" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTemplates.map((template) => (
              <div key={template.id} className="border border-gray-200 dark:border-brand-border bg-white dark:bg-brand-panel p-6 rounded-lg hover:border-brand-blue transition-colors group cursor-pointer" onClick={() => { setSelectedTemplate(template); setView('map'); }}>
                <div className="flex justify-between items-start mb-4">
                  <div className="p-2 bg-brand-blue/10 rounded-lg"><MapPin size={20} className="text-brand-blue" /></div>
                  <span className="text-[10px] font-mono bg-gray-100 dark:bg-[#111] text-gray-500 px-2 py-1 rounded">{template.capacity.toLocaleString()} CAP.</span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">{template.name}</h3>
                <p className="text-xs text-gray-500 font-mono mb-4">{template.city}, {template.country}</p>
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="text-gray-500">100% Asientos</span>
                  <span className="text-brand-blue flex items-center gap-1 group-hover:translate-x-1 transition-transform">VER MAPA <ArrowRight size={14} /></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VISTA 2: MAPA SVG REALISTA */}
      {view === 'map' && selectedTemplate && (
        <div className="max-w-5xl mx-auto space-y-6">
          <div className="flex justify-between items-center bg-white dark:bg-brand-panel p-4 rounded-lg border border-gray-200 dark:border-brand-border">
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">{selectedTemplate.name}</h2>
              <p className="text-xs text-gray-500 font-mono">{selectedTemplate.city}, {selectedTemplate.country} - Capacidad: {selectedTemplate.capacity.toLocaleString()}</p>
            </div>
            <button onClick={() => setView('create-event')} className="bg-brand-blue text-white px-6 py-2 rounded text-sm font-bold hover:bg-blue-600 transition-colors">USAR ESTE RECINTO</button>
          </div>
          <div className="bg-white dark:bg-brand-panel border border-gray-200 dark:border-brand-border rounded-xl p-8 flex justify-center">
            <svg viewBox="0 0 800 450" className="w-full max-w-2xl h-auto">
              <path d={selectedTemplate.svgPath} fill="#2563EB" opacity="0.6" stroke="#1E40AF" strokeWidth="2" className="cursor-pointer hover:opacity-80 transition-opacity" />
              <text x="400" y="225" textAnchor="middle" fill="#fff" fontSize="16" fontWeight="bold">MAPA DE ASIENTOS</text>
            </svg>
          </div>
        </div>
      )}

      {/* VISTA 3: CREAR EVENTO */}
      {view === 'create-event' && (
        <div className="max-w-xl mx-auto">
          <form onSubmit={handleCreateEvent} className="space-y-5 bg-white dark:bg-brand-panel p-8 rounded-xl border border-gray-200 dark:border-brand-border shadow-sm">
            <div>
              <label className="text-xs font-mono text-gray-500 block mb-2">NOMBRE DEL EVENTO</label>
              <input type="text" required value={eventName} onChange={e => setEventName(e.target.value)} className="w-full bg-gray-50 dark:bg-[#000] border border-gray-300 dark:border-brand-border p-3 rounded text-gray-900 dark:text-white focus:outline-none focus:border-brand-blue transition-colors" placeholder="Ej. Concierto de Primavera" />
            </div>
            <div>
              <label className="text-xs font-mono text-gray-500 block mb-2">FECHA Y HORA</label>
              <input type="datetime-local" required value={eventDate} onChange={e => setEventDate(e.target.value)} className="w-full bg-gray-50 dark:bg-[#000] border border-gray-300 dark:border-brand-border p-3 rounded text-gray-900 dark:text-white focus:outline-none focus:border-brand-blue transition-colors" />
            </div>
            <div>
              <label className="text-xs font-mono text-gray-500 block mb-2">SELECCIONA EL RECINTO</label>
              <select required value={selectedVenueId} onChange={e => setSelectedVenueId(e.target.value)} className="w-full bg-gray-50 dark:bg-[#000] border border-gray-300 dark:border-brand-border p-3 rounded text-gray-900 dark:text-white focus:outline-none focus:border-brand-blue transition-colors">
                <option value="">-- Selecciona un recinto --</option>
                {realVenueTemplates.map(v => (
                  <option key={v.id} value={v.id}>{v.name} ({v.city})</option>
                ))}
              </select>
            </div>
            <button type="submit" className="w-full py-4 bg-brand-blue text-white font-bold font-mono text-sm hover:bg-blue-600 transition-colors rounded-lg mt-4">PUBLICAR EVENTO EN EL SISTEMA</button>
          </form>
        </div>
      )}
    </div>
  );
}
