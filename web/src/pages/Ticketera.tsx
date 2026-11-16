import { useState, useEffect } from 'react';
import { MapPin, Search, ArrowRight, ChevronLeft, Calendar, Loader2, Users, Image as ImageIcon, Upload, Share2, Plus, Music, Trophy, Theater, Mic2, Briefcase, PartyPopper } from 'lucide-react';
import AdvancedSeatMap from '../components/AdvancedSeatMap';
import CustomSelect from '../components/CustomSelect';
import EventCard from '../components/EventCard';
import { useAuthStore } from '../stores/authStore';
import { useUIStore } from '../stores/uiStore';

interface Country { code: string; name: string; }
interface VenueType { id: string; name: string; }
interface Venue { id: string; name: string; type: string; country: string; address: string; capacity: number; shape?: string; }
interface EventData { id: string; name: string; event_date: string; venue_id: string; venue_name: string; venue_address: string; venue_shape: string; promo_image_url?: string; text_theme?: string; category?: string; }

const getFlagEmoji = (countryCode: string) => {
  if (!countryCode) return '🌎';
  const codePoints = countryCode.toUpperCase().split('').map(char => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
};

const categories = [
  { id: 'musical', label: 'Música', icon: Music },
  { id: 'deportivo', label: 'Deportes', icon: Trophy },
  { id: 'teatro', label: 'Teatro', icon: Theater },
  { id: 'conferencia', label: 'Conferencia', icon: Mic2 },
  { id: 'corporativo', label: 'Corporativo', icon: Briefcase },
  { id: 'fiesta', label: 'Fiesta', icon: PartyPopper },
  { id: 'general', label: 'General', icon: Calendar },
];

export default function Ticketera() {
  const { token } = useAuthStore();
  const { showToast } = useUIStore();
  
  const [view, setView] = useState<'catalog' | 'map' | 'create-event'>('catalog');
  const [selectedEvent, setSelectedEvent] = useState<EventData | null>(null);
  
  const [events, setEvents] = useState<EventData[]>([]);
  const [countriesList, setCountriesList] = useState<Country[]>([]);
  const [venueTypesList, setVenueTypesList] = useState<VenueType[]>([]);
  const [venuesList, setVenuesList] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [eventName, setEventName] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedVenueId, setSelectedVenueId] = useState('');
  const [textTheme, setTextTheme] = useState('light');
  const [category, setCategory] = useState('musical');
  const [paymentMethods, setPaymentMethods] = useState<string[]>(['qvapay']);
  
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchCatalogs = async () => {
      try {
        const [resCountries, resTypes] = await Promise.all([
          fetch('https://idkfree.onrender.com/api/ticketing/countries'),
          fetch('https://idkfree.onrender.com/api/ticketing/venue-types')
        ]);
        if (resCountries.ok) setCountriesList(await resCountries.json());
        if (resTypes.ok) setVenueTypesList(await resTypes.json());
      } catch (error) { console.error(error); }
    };
    fetchCatalogs();
  }, []);

  useEffect(() => {
    const fetchVenues = async () => {
      if (!selectedCountry || !selectedType) return;
      try {
        const res = await fetch(`https://idkfree.onrender.com/api/ticketing/venues?country=${selectedCountry}&type=${selectedType}`);
        if (res.ok) setVenuesList(await res.json());
      } catch (error) { console.error(error); }
    };
    fetchVenues();
  }, [selectedCountry, selectedType]);

  const fetchEvents = async () => {
    if (!token) return;
    try {
      const res = await fetch('https://idkfree.onrender.com/api/ticketing/events', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) setEvents(await res.json());
    } catch (error) { console.error(error); } finally { setLoading(false); }
  };

  useEffect(() => { fetchEvents(); }, [token]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
      setImagePreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return showToast('Debes iniciar sesión', 'error');

    let uploadedImageUrl = null;
    try {
      if (imageFile) {
        setUploading(true);
        const formData = new FormData();
        formData.append('file', imageFile);
        const uploadRes = await fetch('https://idkfree.onrender.com/api/ticketing/upload-promo', {
          method: 'POST', headers: { 'Authorization': `Bearer ${token}` }, body: formData
        });
        if (uploadRes.ok) {
          const uploadData = await uploadRes.json();
          uploadedImageUrl = uploadData.url;
        } else {
          showToast('Error subiendo imagen', 'error'); setUploading(false); return;
        }
        setUploading(false);
      }

      const isoDate = new Date(eventDate).toISOString();
      const res = await fetch('https://idkfree.onrender.com/api/ticketing/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ 
          venueId: selectedVenueId, 
          name: eventName, 
          date: isoDate, 
          promoImageUrl: uploadedImageUrl,
          textTheme,
          category,
          paymentMethods
        })
      });

      if (res.ok) {
        showToast('Evento creado exitosamente', 'success');
        setView('catalog');
        setEventName(''); setEventDate(''); setSelectedCountry(''); setSelectedType(''); setSelectedVenueId(''); setImageFile(null); setImagePreview(null);
        fetchEvents();
      } else {
        const errorData = await res.json();
        showToast(errorData.error || 'Error al crear el evento', 'error');
      }
    } catch (error) { showToast('Error de red', 'error'); }
  };

  const togglePaymentMethod = (method: string) => {
    setPaymentMethods(prev => 
      prev.includes(method) ? prev.filter(m => m !== method) : [...prev, method]
    );
  };

  const shareEvent = (event: EventData) => {
    const url = `${window.location.origin}/event/${event.id}`;
    navigator.clipboard.writeText(url);
    showToast('Enlace del evento copiado al portapapeles', 'success');
  };

  const countryOptions = countriesList.map(c => ({ value: c.code, label: c.name, flag: getFlagEmoji(c.code), prefix: c.code }));
  const typeOptions = venueTypesList.map(t => ({ value: t.id, label: t.name }));
  const venueOptions = venuesList.map(v => ({ value: v.id, label: `${v.name} (${v.address || 'Sin dirección'})` }));

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center border-b border-gray-200 dark:border-brand-border pb-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white font-mono tracking-tight">
            {view === 'catalog' && 'GESTIÓN DE EVENTOS'}
            {view === 'map' && 'MAPA INTERACTIVO'}
            {view === 'create-event' && 'CREAR NUEVO EVENTO'}
          </h1>
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
            <button onClick={() => window.location.href = "/ticketera/builder"} className="flex-1 bg-gray-800 text-white font-bold py-3 px-6 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-700 transition-colors">
              <Plus size={18} /> CREAR RECINTO
            </button>
          </div>

          <div>
            <h2 className="text-sm font-mono text-brand-blue uppercase tracking-widest mb-4 flex items-center gap-2">
              <span className="w-2 h-2 bg-brand-blue rounded-full animate-pulse"></span> MIS EVENTOS ACTIVOS
            </h2>
            {loading ? (
              <div className="flex justify-center py-8"><Loader2 className="animate-spin text-brand-blue" size={24} /></div>
            ) : events.length === 0 ? (
              <div className="text-center py-8 text-gray-500 font-mono border border-gray-200 dark:border-brand-border rounded-lg">No tienes eventos creados.</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {events.map((event) => (
                  <div key={event.id} className="relative group/wrapper">
                    <EventCard
                      id={event.id}
                      name={event.name}
                      date={event.event_date}
                      venueName={event.venue_name}
                      venueShape={event.venue_shape}
                      imageUrl={event.promo_image_url}
                      textTheme={event.text_theme as 'light' | 'dark'}
                      category={event.category}
                      onClick={() => { setSelectedEvent(event); setView('map'); }}
                    />
                    <button 
                      onClick={(e) => { e.stopPropagation(); shareEvent(event); }} 
                      className="absolute top-4 right-4 z-20 w-9 h-9 bg-black/50 backdrop-blur-md rounded-full flex items-center justify-center text-white opacity-0 group-hover/wrapper:opacity-100 transition-opacity hover:bg-brand-blue"
                      title="Compartir evento"
                    >
                      <Share2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {view === 'map' && selectedEvent && (
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white dark:bg-brand-panel p-4 rounded-lg border border-gray-200 dark:border-brand-border gap-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">{selectedEvent.venue_name}</h2>
              <p className="text-xs text-gray-500 font-mono flex items-center gap-2 mt-1">
                <MapPin size={12}/> {selectedEvent.venue_address || 'Dirección no disponible'} 
              </p>
            </div>
            <button onClick={() => shareEvent(selectedEvent)} className="bg-gray-100 dark:bg-brand-border text-gray-900 dark:text-white px-4 py-2 rounded text-sm font-bold hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors flex items-center gap-2">
              <Share2 size={16} /> COMPARTIR
            </button>
          </div>
          
          <AdvancedSeatMap venueId={selectedEvent.venue_id} venueName={selectedEvent.venue_name} shape={selectedEvent.venue_shape} />
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

            <div>
              <label className="text-xs font-mono text-gray-500 block mb-2">CATEGORÍA</label>
              <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
                {categories.map(cat => {
                  const CatIcon = cat.icon;
                  return (
                    <button 
                      key={cat.id}
                      type="button"
                      onClick={() => setCategory(cat.id)}
                      className={`flex flex-col items-center gap-1 p-2 rounded-lg border transition-colors ${category === cat.id ? 'border-brand-blue bg-brand-blue/10 text-brand-blue' : 'border-gray-200 dark:border-brand-border text-gray-500 hover:border-gray-400'}`}
                    >
                      <CatIcon size={18} />
                      <span className="text-[10px] font-mono">{cat.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="text-xs font-mono text-gray-500 block mb-2">PÓSTER / IMAGEN DE PROMOCIÓN (OPCIONAL)</label>
              <div className="flex items-center gap-4">
                <div className="w-24 h-24 bg-gray-100 dark:bg-[#111] border border-dashed border-gray-300 dark:border-gray-700 rounded-lg flex items-center justify-center overflow-hidden relative">
                  {imagePreview ? <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" /> : <ImageIcon size={24} className="text-gray-400" />}
                </div>
                <div className="flex-1">
                  <input type="file" accept="image/*" onChange={handleImageChange} id="file-upload" className="hidden" />
                  <label htmlFor="file-upload" className="cursor-pointer bg-white dark:bg-[#000] border border-gray-300 dark:border-brand-border px-4 py-2 rounded text-sm font-mono text-gray-700 dark:text-gray-300 hover:border-brand-blue transition-colors flex items-center gap-2 w-max">
                    <Upload size={16} /> SUBIR IMAGEN
                  </label>
                </div>
              </div>
            </div>

            <div>
              <label className="text-xs font-mono text-gray-500 block mb-2">TEMA DE TEXTO EN EL FLYER</label>
              <div className="flex gap-2">
                <button type="button" onClick={() => setTextTheme('light')} className={`flex-1 py-2 rounded-lg border text-sm font-mono transition-colors ${textTheme === 'light' ? 'bg-white text-black border-white' : 'bg-gray-100 dark:bg-[#111] text-gray-500 border-gray-200 dark:border-brand-border'}`}>Texto Blanco</button>
                <button type="button" onClick={() => setTextTheme('dark')} className={`flex-1 py-2 rounded-lg border text-sm font-mono transition-colors ${textTheme === 'dark' ? 'bg-black text-white border-black' : 'bg-gray-100 dark:bg-[#111] text-gray-500 border-gray-200 dark:border-brand-border'}`}>Texto Negro</button>
              </div>
            </div>

            <div>
              <label className="text-xs font-mono text-gray-500 block mb-2">MÉTODOS DE PAGO ACEPTADOS</label>
              <div className="flex gap-2">
                {['qvapay', 'efectivo', 'enzona'].map(method => (
                  <button 
                    key={method}
                    type="button"
                    onClick={() => togglePaymentMethod(method)}
                    className={`flex-1 py-2 rounded-lg border text-xs font-mono transition-colors capitalize ${paymentMethods.includes(method) ? 'bg-brand-blue text-white border-brand-blue' : 'bg-gray-100 dark:bg-[#111] text-gray-500 border-gray-200 dark:border-brand-border'}`}
                  >
                    {method === 'qvapay' ? 'QvaPay' : method === 'efectivo' ? 'Efectivo' : 'EnZona'}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="border-t border-gray-200 dark:border-brand-border pt-4 mt-4">
              <CustomSelect label="País" options={countryOptions} value={selectedCountry} onChange={(val) => { setSelectedCountry(val); setSelectedType(''); setSelectedVenueId(''); }} placeholder="-- Selecciona un país --" />
            </div>

            {selectedCountry && (
              <CustomSelect label="Tipo de Recinto" options={typeOptions} value={selectedType} onChange={(val) => { setSelectedType(val); setSelectedVenueId(''); }} placeholder="-- Selecciona un tipo --" />
            )}

            {selectedCountry && selectedType && (
              <div>
                <CustomSelect label="Selecciona el Recinto" options={venueOptions} value={selectedVenueId} onChange={setSelectedVenueId} placeholder="-- Selecciona un recinto --" />
                {venuesList.length === 0 && <p className="text-xs text-red-500 mt-2">No hay recintos registrados para esta combinación.</p>}
              </div>
            )}

            <button type="submit" disabled={uploading} className="w-full py-4 bg-brand-blue text-white font-bold font-mono text-sm hover:bg-blue-600 transition-colors rounded-lg mt-4 flex items-center justify-center gap-2">
              {uploading ? <Loader2 className="animate-spin" size={18} /> : null}
              {uploading ? 'SUBIENDO IMAGEN...' : 'PUBLICAR EVENTO EN EL SISTEMA'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
