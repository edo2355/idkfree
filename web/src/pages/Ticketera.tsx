import { useState, useEffect } from 'react';
import { MapPin, Search, ArrowRight, ChevronLeft, Calendar, Loader2 } from 'lucide-react';
import { realVenueTemplates, VenueTemplate } from '../data/realVenueTemplates';
import AdvancedSeatMap from '../components/AdvancedSeatMap';
import CustomSelect from '../components/CustomSelect';
import { useAuthStore } from '../stores/authStore';
import { useUIStore } from '../stores/uiStore';

interface Country { code: string; name: string; }
interface VenueType { id: string; name: string; }

// Función para convertir código ISO (ej. 'CU') a emoji de bandera 🇨🇺
const getFlagEmoji = (countryCode: string) => {
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map(char => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
};

export default function Ticketera() {
  const { token } = useAuthStore();
  const { showToast } = useUIStore();
  
  const [view, setView] = useState<'catalog' | 'map' | 'create-event'>('catalog');
  const [selectedTemplate, setSelectedTemplate] = useState<VenueTemplate | null>(null);
  
  const [events, setEvents] = useState<any[]>([]);
  const [countriesList, setCountriesList] = useState<Country[]>([]);
  const [venueTypesList, setVenueTypesList] = useState<VenueType[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [eventName, setEventName] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedVenueId, setSelectedVenueId] = useState('');

  const availableVenues = realVenueTemplates.filter(v => 
    (selectedCountry === '' || v.country === selectedCountry) &&
    (selectedType === '' || v.type === selectedType)
  );

  // Generar opciones con banderas y prefijos
  const countryOptions = countriesList.map(c => ({ 
    value: c.code, 
    label: c.name, 
    flag: getFlagEmoji(c.code),
    prefix: c.code
  }));
  
  const typeOptions = venueTypesList.map(t => ({ value: t.id, label: t.name }));
  const venueOptions = availableVenues.map(v => ({ value: v.id, label: `${v.name} (${v.city})` }));

  const handleCountryChange = (value: string) => {
    setSelectedCountry(value);
    setSelectedType('');
    setSelectedVenueId('');
  };

  const handleTypeChange = (value: string) => {
    setSelectedType(value);
    setSelectedVenueId('');
  };

  useEffect(() => {
    const fetchCatalogs = async () => {
      try {
        const [resCountries, resTypes] = await Promise.all([
          fetch('https://idkfree.onrender.com/api/ticketing/countries'),
          fetch('https://idkfree.onrender.com/api/ticketing/venue-types')
        ]);
        if (resCountries.ok) setCountriesList(await resCountries.json());
        if (resTypes.ok) setVenueTypesList(await resTypes.json());
      } catch (error) {
        console.error('Error cargando catálogos:', error);
      }
    };
    fetchCatalogs();
  }, []);

  const fetchEvents = async () => {
    if (!token) return;
    try {
      const res = await fetch('https://idkfree.onrender.com/api/ticketing/events', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) setEvents(await res.json());
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchEvents(); }, [token]);

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return showToast('Debes iniciar sesión de nuevo', 'error');

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
        setEventName(''); setEventDate(''); setSelectedCountry(''); setSelectedType(''); setSelectedVenueId('');
        fetchEvents();
      } else {
        const errorData = await res.json();
        showToast(errorData.error || 'Error al crear el evento', 'error');
      }
    } catch (error) {
      showToast('Error de red o del servidor', 'error');
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center border-b border-gray-200 dark:border-brand-border pb-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white font-mono tracking-tight">
            {view === 'catalog' && 'GESTIÓN DE EVENTOS'}
            {view === 'map' && 'MAPA INTERACTIVO'}
            {view === 'create-event' && 'CREAR NUEVO EVENTO'}
          </h1>
          <p className="text-gray-500 font-mono text-xs mt-1">
            {view === 'catalog' && 'Tus eventos y recintos disponibles.'}
            {view === 'map' && `Vista previa: ${selectedTemplate?.name}`}
            {view === 'create-event' && 'Asigna un nombre, fecha, país y recinto a tu evento.'}
          </p>
        </div>
        {view !== 'catalog' && (
          <button onClick={() => setView('catalog')} className="text-xs font-mono text-brand-blue hover:text-blue-700 flex items-center gap-1 transition-colors">
            <ChevronLeft size={14} /> VOLVER AL PANEL
          </button>
        )}
      </div>

      {view === 'catalog' && (
        <div className="space-y-10">
          <div className="flex flex-col md:flex-row gap-4">
            <button onClick={() => setView('create-event')} className="flex-1 bg-brand-blue text-white font-bold py-3 px-6 rounded-lg flex items-center justify-center gap-2 hover:bg-blue-600 transition-colors">
              <Calendar size={18} /> CREAR NUEVO EVENTO
            </button>
            <div className="flex-1 flex items-center bg-white dark:bg-brand-panel border border-gray-200 dark:border-brand-border rounded-lg px-4 py-3">
              <Search size={18} className="text-gray-500 mr-3" />
              <input type="text" placeholder="Buscar evento..." className="bg-transparent border-none outline-none text-sm w-full text-gray-900 dark:text-white" />
            </div>
          </div>

          <div>
            <h2 className="text-sm font-mono text-brand-blue uppercase tracking-widest mb-4 flex items-center gap-2">
              <span className="w-2 h-2 bg-brand-blue rounded-full animate-pulse"></span> MIS EVENTOS ACTIVOS
            </h2>
            {loading ? (
              <div className="flex justify-center py-8"><Loader2 className="animate-spin text-brand-blue" size={24} /></div>
            ) : events.length === 0 ? (
              <div className="text-center py-8 text-gray-500 font-mono border border-gray-200 dark:border-brand-border rounded-lg">
                No tienes eventos creados. ¡Crea uno nuevo!
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {events.map((event) => (
                  <div key={event.id} onClick={() => { setSelectedTemplate(realVenueTemplates.find(v => v.id === event.venue_id) || realVenueTemplates[0]); setView('map'); }} className="border border-gray-200 dark:border-brand-border bg-white dark:bg-brand-panel p-6 rounded-lg hover:border-brand-blue transition-colors group cursor-pointer">
                    <div className="flex justify-between items-start mb-4">
                      <div className="p-2 bg-brand-blue/10 rounded-lg"><Calendar size={20} className="text-brand-blue" /></div>
                      <span className="text-[10px] font-mono bg-green-500/10 text-green-500 px-2 py-1 rounded border border-green-500/20">ACTIVO</span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">{event.name}</h3>
                    <p className="text-xs text-gray-500 font-mono mb-4">{new Date(event.event_date).toLocaleString()}</p>
                    <div className="flex justify-between items-center text-xs font-mono">
                      <span className="text-gray-500">Recinto: {event.venue_id}</span>
                      <span className="text-brand-blue flex items-center gap-1 group-hover:translate-x-1 transition-transform">VER MAPA <ArrowRight size={14} /></span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <h2 className="text-sm font-mono text-gray-500 uppercase tracking-widest mb-4">Recintos Disponibles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {realVenueTemplates.map((template) => (
                <div key={template.id} className="border border-gray-200 dark:border-brand-border bg-white dark:bg-brand-panel p-6 rounded-lg hover:border-brand-blue transition-colors group cursor-pointer" onClick={() => { setSelectedTemplate(template); setView('map'); }}>
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-2 bg-gray-100 dark:bg-[#111] rounded-lg"><MapPin size={20} className="text-gray-600 dark:text-gray-400" /></div>
                    <span className="text-[10px] font-mono bg-gray-100 dark:bg-[#111] text-gray-500 px-2 py-1 rounded uppercase">{template.type}</span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">{template.name}</h3>
                  <p className="text-xs text-gray-500 font-mono mb-4">
                    {template.city}, {countriesList.find(c => c.code === template.country)?.name || template.country}
                  </p>
                  <div className="flex justify-between items-center text-xs font-mono">
                    <span className="text-gray-500">{template.capacity.toLocaleString()} Cap.</span>
                    <span className="text-brand-blue flex items-center gap-1 group-hover:translate-x-1 transition-transform">VER MAPA <ArrowRight size={14} /></span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {view === 'map' && selectedTemplate && (
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="flex justify-between items-center bg-white dark:bg-brand-panel p-4 rounded-lg border border-gray-200 dark:border-brand-border">
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">{selectedTemplate.name}</h2>
              <p className="text-xs text-gray-500 font-mono">{selectedTemplate.city}, {countriesList.find(c => c.code === selectedTemplate.country)?.name} - Capacidad: {selectedTemplate.capacity.toLocaleString()}</p>
            </div>
            <button onClick={() => setView('create-event')} className="bg-brand-blue text-white px-6 py-2 rounded text-sm font-bold hover:bg-blue-600 transition-colors">USAR ESTE RECINTO</button>
          </div>
          <AdvancedSeatMap venueId={selectedTemplate.id} venueName={selectedTemplate.name} />
        </div>
      )}

      {view === 'create-event' && (
        <div className="max-w-xl mx-auto">
          <form onSubmit={handleCreateEvent} className="space-y-5 bg-white dark:bg-brand-panel p-8 rounded-xl border border-gray-200 dark:border-brand-border shadow-sm relative">
            <div>
              <label className="text-xs font-mono text-gray-500 block mb-2">NOMBRE DEL EVENTO</label>
              <input type="text" required value={eventName} onChange={e => setEventName(e.target.value)} className="w-full bg-gray-50 dark:bg-[#000] border border-gray-300 dark:border-brand-border p-3 rounded text-gray-900 dark:text-white focus:outline-none focus:border-brand-blue transition-colors" placeholder="Ej. Concierto de Primavera" />
            </div>
            <div>
              <label className="text-xs font-mono text-gray-500 block mb-2">FECHA Y HORA</label>
              <input type="datetime-local" required value={eventDate} onChange={e => setEventDate(e.target.value)} className="w-full bg-gray-50 dark:bg-[#000] border border-gray-300 dark:border-brand-border p-3 rounded text-gray-900 dark:text-white focus:outline-none focus:border-brand-blue transition-colors" />
            </div>
            
            <CustomSelect 
              label="País" 
              options={countryOptions} 
              value={selectedCountry} 
              onChange={handleCountryChange} 
              placeholder="-- Selecciona un país --" 
            />

            {selectedCountry && (
              <CustomSelect 
                label="Tipo de Recinto" 
                options={typeOptions} 
                value={selectedType} 
                onChange={handleTypeChange} 
                placeholder="-- Selecciona un tipo --" 
              />
            )}

            {selectedCountry && selectedType && (
              <div>
                <CustomSelect 
                  label="Selecciona el Recinto" 
                  options={venueOptions} 
                  value={selectedVenueId} 
                  onChange={setSelectedVenueId} 
                  placeholder="-- Selecciona un recinto --" 
                />
                {availableVenues.length === 0 && (
                  <p className="text-xs text-red-500 mt-2">No hay recintos de este tipo en el país seleccionado.</p>
                )}
              </div>
            )}

            <button type="submit" className="w-full py-4 bg-brand-blue text-white font-bold font-mono text-sm hover:bg-blue-600 transition-colors rounded-lg mt-4">PUBLICAR EVENTO EN EL SISTEMA</button>
          </form>
        </div>
      )}
    </div>
  );
}
