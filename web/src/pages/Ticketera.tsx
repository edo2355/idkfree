import { useState, useEffect } from 'react';
import { MapPin, Search, ArrowRight, ChevronLeft, Calendar, Loader2, Users } from 'lucide-react';
import AdvancedSeatMap from '../components/AdvancedSeatMap';
import EventCard from '../components/EventCard';
import CustomSelect from '../components/CustomSelect';
import { useAuthStore } from '../stores/authStore';
import { useUIStore } from '../stores/uiStore';

interface Country { code: string; name: string; }
interface VenueType { id: string; name: string; }
interface Venue { id: string; name: string; type: string; country: string; address: string; capacity: number; shape?: string; }
interface EventData { id: string; name: string; event_date: string; venue_id: string; venue_name: string; venue_address: string; venue_shape: string; }

const getFlagEmoji = (countryCode: string) => {
  if (!countryCode) return '🌎';
  const codePoints = countryCode.toUpperCase().split('').map(char => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
};

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
        body: JSON.stringify({ venueId: selectedVenueId, name: eventName, date: isoDate, promoImageUrl: uploadedImageUrl })
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
                  <EventCard
                    key={event.id}
                    id={event.id}
                    name={event.name}
                    date={event.event_date}
                    venueName={event.venue_name}
                    venueShape={event.venue_shape}
                    imageUrl={event.promo_image_url}
                    onClick={() => {
                      setSelectedEvent(event);
                      setView('map');
                    }}
                  />
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
