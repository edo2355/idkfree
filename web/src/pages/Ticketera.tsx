import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, ChevronLeft, Calendar, Loader2, Image as ImageIcon, Upload, Plus, Music, Trophy, Theater, Mic2, Briefcase, PartyPopper, Edit, Trash2, Map } from 'lucide-react';
import AdvancedSeatMap from '../components/AdvancedSeatMap';
import CustomSelect from '../components/CustomSelect';
import EventCard from '../components/EventCard';
import { useAuthStore } from '../stores/authStore';
import { useUIStore } from '../stores/uiStore';
import { useModal } from '../contexts/ModalContext';

interface EventData { id: string; name: string; event_date: string; venue_id: string; venue_name: string; venue_shape: string; promo_image_url?: string; text_theme?: string; category?: string; organizer_alias?: string; }

const categories = [
  { id: 'musical', label: 'Música', icon: Music }, { id: 'deportivo', label: 'Deportes', icon: Trophy },
  { id: 'teatro', label: 'Teatro', icon: Theater }, { id: 'conferencia', label: 'Conferencia', icon: Mic2 },
  { id: 'corporativo', label: 'Corporativo', icon: Briefcase }, { id: 'fiesta', label: 'Fiesta', icon: PartyPopper },
];

export default function Ticketera() {
  const { token } = useAuthStore();
  const { showToast } = useUIStore();
  const { openModal } = useModal();
  const navigate = useNavigate();
  
  const [view, setView] = useState<'catalog' | 'map' | 'create-event' | 'edit-event'>('catalog');
  const [selectedEvent, setSelectedEvent] = useState<EventData | null>(null);
  const [events, setEvents] = useState<EventData[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [eventName, setEventName] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [category, setCategory] = useState('musical');
  const [textTheme, setTextTheme] = useState('light');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const [countriesList, setCountriesList] = useState<any[]>([]);
  const [venueTypesList, setVenueTypesList] = useState<any[]>([]);
  const [venuesList, setVenuesList] = useState<any[]>([]);
  const [myVenuesList, setMyVenuesList] = useState<any[]>([]);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedVenueId, setSelectedVenueId] = useState('');

  const [customCountry, setCustomCountry] = useState('');
  const [customType, setCustomType] = useState('');
  const [customVenueName, setCustomVenueName] = useState('');
  const [customVenueAddress, setCustomVenueAddress] = useState('');

  // Cargar mis recintos
  const fetchMyVenues = async () => {
    if (!token) return;
    try {
      const res = await fetch('https://idkfree.onrender.com/api/venues/mine', { headers: { 'Authorization': `Bearer ${token}` } });
      if (res.ok) setMyVenuesList(await res.json());
    } catch (error) { console.error(error); }
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
      } catch (error) { console.error(error); }
    };
    fetchCatalogs();
    fetchMyVenues();
  }, [token]);

  useEffect(() => {
    const fetchVenues = async () => {
      if (!selectedCountry || selectedCountry === 'custom' || !selectedType || selectedType === 'custom') return;
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
      const res = await fetch('https://idkfree.onrender.com/api/ticketing/events', { headers: { 'Authorization': `Bearer ${token}` } });
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
    if (!eventName || !eventDate) return showToast('Completa los campos obligatorios', 'error');

    let finalVenueId = selectedVenueId;
    let uploadedImageUrl = null;

    try {
      if (selectedVenueId === 'custom') {
        if (!customVenueName) return showToast('Escribe el nombre del recinto', 'error');
        const vRes = await fetch('https://idkfree.onrender.com/api/ticketing/venues', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify({
            name: customVenueName, location: customVenueAddress,
            country: selectedCountry === 'custom' ? customCountry : selectedCountry,
            type: selectedType === 'custom' ? customType : selectedType
          })
        });
        const vData = await vRes.json();
        if (!vRes.ok) throw new Error('Error creando recinto');
        finalVenueId = vData.id;
      }

      if (imageFile) {
        setUploading(true);
        const formData = new FormData();
        formData.append('file', imageFile);
        const uploadRes = await fetch('https://idkfree.onrender.com/api/ticketing/upload-promo', {
          method: 'POST', headers: { 'Authorization': `Bearer ${token}` }, body: formData
        });
        if (uploadRes.ok) { uploadedImageUrl = (await uploadRes.json()).url; }
        setUploading(false);
      }

      const isoDate = new Date(eventDate).toISOString();
      const res = await fetch('https://idkfree.onrender.com/api/ticketing/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ venueId: finalVenueId, name: eventName, date: isoDate, promoImageUrl: uploadedImageUrl, textTheme, category })
      });

      if (res.ok) {
        showToast('Evento creado', 'success');
        setView('catalog');
        setEventName(''); setEventDate(''); setSelectedCountry(''); setSelectedType(''); setSelectedVenueId('');
        setCustomCountry(''); setCustomType(''); setCustomVenueName(''); setCustomVenueAddress('');
        setImageFile(null); setImagePreview(null);
        fetchEvents();
      } else { showToast('Error al crear evento', 'error'); }
    } catch (error: any) { showToast(error.message || 'Error de red', 'error'); }
  };

  const handleUpdateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const isoDate = new Date(eventDate).toISOString();
      const res = await fetch(`https://idkfree.onrender.com/api/ticketing/events/${selectedEvent?.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ name: eventName, date: isoDate, category, textTheme })
      });
      if (res.ok) { showToast('Evento actualizado', 'success'); setView('catalog'); fetchEvents(); }
    } catch (error) { showToast('Error', 'error'); }
  };

  const handleEditClick = (e: React.MouseEvent, event: EventData) => {
    e.stopPropagation();
    setSelectedEvent(event);
    setEventName(event.name);
    const d = new Date(event.event_date);
    const offset = d.getTimezoneOffset();
    setEventDate(new Date(d.getTime() - (offset * 60 * 1000)).toISOString().slice(0, 16));
    setCategory(event.category || 'musical');
    setTextTheme(event.text_theme || 'light');
    setView('edit-event');
  };

  const handleDeleteClick = (e: React.MouseEvent, eventId: string) => {
    e.stopPropagation();
    openModal({
      title: 'Eliminar Evento', content: '¿Estás seguro? Esta acción no se puede deshacer.',
      variant: 'danger', confirmText: 'Sí, eliminar',
      onConfirm: async () => {
        const res = await fetch(`https://idkfree.onrender.com/api/ticketing/events/${eventId}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
        if (res.ok) { showToast('Evento eliminado', 'success'); fetchEvents(); }
      }
    });
  };

  const handleEditVenue = (venueId: string) => {
    navigate(`/ticketera/builder?edit=${venueId}`);
  };

  // Dropdowns con "Personalizado" y "Mis Recintos" primero
  const countryOptions = [
    { value: 'custom', label: '✨ Otro (Escribir...)' },
    ...countriesList.map(c => ({ value: c.code, label: c.name }))
  ];
  
  const typeOptions = [
    { value: 'custom', label: '✨ Otro (Escribir...)' },
    ...venueTypesList.map(t => ({ value: t.id, label: t.name }))
  ];

  const venueOptions = [
    { value: 'custom', label: '✨ Otro (Agregar nuevo...)' },
    // Mis recintos primero
    ...myVenuesList.map(v => ({ value: v.id, label: `⭐ MI RECINTO: ${v.name} (${v.capacity} cap.)` })),
    // Recintos globales (evitar duplicados)
    ...venuesList.filter(v => !myVenuesList.some(m => m.id === v.id)).map(v => ({ value: v.id, label: `${v.name} (${v.address || 'Sin dirección'})` }))
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center border-b border-gray-200 dark:border-brand-border pb-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white font-mono tracking-tight">
            {view === 'catalog' ? 'GESTIÓN DE EVENTOS' : view === 'map' ? 'MAPA' : view === 'create-event' ? 'CREAR EVENTO' : 'EDITAR EVENTO'}
          </h1>
        </div>
        {view !== 'catalog' && (
          <button onClick={() => setView('catalog')} className="text-xs font-mono text-brand-blue hover:text-blue-700 flex items-center gap-1"><ChevronLeft size={14} /> VOLVER</button>
        )}
      </div>

      {view === 'catalog' && (
        <div className="space-y-10">
          <div className="flex flex-col md:flex-row gap-4">
            <button onClick={() => setView('create-event')} className="flex-1 bg-brand-blue text-white font-bold py-3 rounded-lg hover:bg-blue-600 flex items-center justify-center gap-2"><Calendar size={18} /> CREAR EVENTO</button>
            <button onClick={() => navigate('/ticketera/builder')} className="flex-1 bg-gray-800 text-white font-bold py-3 rounded-lg hover:bg-gray-700 flex items-center justify-center gap-2"><Plus size={18} /> CREAR RECINTO</button>
          </div>

          {loading ? <div className="flex justify-center py-8"><Loader2 className="animate-spin text-brand-blue" size={24} /></div> : (
            <>
              {events.length > 0 && (
                <div>
                  <h2 className="text-sm font-mono text-brand-blue uppercase mb-4">MIS EVENTOS</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {events.map((event) => (
                      <div key={event.id} className="relative group/wrapper">
                        <EventCard id={event.id} name={event.name} date={event.event_date} venueName={event.venue_name} imageUrl={event.promo_image_url} textTheme={event.text_theme as any} category={event.category} organizerAlias={event.organizer_alias} onClick={() => { setSelectedEvent(event); setView('map'); }} />
                        <div className="absolute top-4 right-4 z-20 flex gap-2 opacity-0 group-hover/wrapper:opacity-100 transition-opacity">
                          <button onClick={(e) => handleEditClick(e, event)} className="w-8 h-8 bg-blue-500/80 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-blue-600"><Edit size={14} /></button>
                          <button onClick={(e) => handleDeleteClick(e, event.id)} className="w-8 h-8 bg-red-500/80 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-red-600"><Trash2 size={14} /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {myVenuesList.length > 0 && (
                <div>
                  <h2 className="text-sm font-mono text-brand-blue uppercase mb-4">MIS RECINTOS</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {myVenuesList.map(venue => (
                      <div key={venue.id} className="bg-white dark:bg-brand-panel border border-gray-200 dark:border-brand-border rounded-lg p-4 hover:border-brand-blue transition-colors group">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">{venue.name}</h3>
                            <p className="text-xs text-gray-500 font-mono">{venue.city}, {venue.country}</p>
                          </div>
                          <span className="text-[10px] bg-brand-blue/10 text-brand-blue px-2 py-1 rounded font-mono">{venue.capacity} CAP.</span>
                        </div>
                        <p className="text-xs text-gray-500 mb-3 truncate">{venue.address || 'Sin dirección'}</p>
                        <div className="flex gap-2">
                          <button onClick={() => handleEditVenue(venue.id)} className="flex-1 text-xs bg-gray-100 dark:bg-[#111] text-gray-700 dark:text-gray-300 font-mono py-2 rounded hover:bg-brand-blue hover:text-white transition-colors flex items-center justify-center gap-1"><Edit size={12} /> EDITAR</button>
                          <button onClick={() => { setSelectedCountry(venue.country); setSelectedType(venue.type); setSelectedVenueId(venue.id); setView('create-event'); }} className="flex-1 text-xs bg-brand-blue text-white font-mono py-2 rounded hover:bg-blue-600 transition-colors flex items-center justify-center gap-1"><Calendar size={12} /> USAR</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {view === 'map' && selectedEvent && (
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="flex justify-between items-center bg-white dark:bg-brand-panel p-4 rounded-lg border border-gray-200 dark:border-brand-border">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">{selectedEvent.venue_name}</h2>
          </div>
          <AdvancedSeatMap venueId={selectedEvent.venue_id} venueName={selectedEvent.venue_name} shape={selectedEvent.venue_shape} />
        </div>
      )}

      {(view === 'create-event' || view === 'edit-event') && (
        <div className="max-w-xl mx-auto">
          <form onSubmit={view === 'edit-event' ? handleUpdateEvent : handleCreateEvent} className="space-y-5 bg-white dark:bg-brand-panel p-8 rounded-xl border border-gray-200 dark:border-brand-border shadow-sm">
            <div>
              <label className="text-xs font-mono text-gray-500 block mb-2">NOMBRE DEL EVENTO</label>
              <input type="text" required value={eventName} onChange={e => setEventName(e.target.value)} className="w-full bg-gray-50 dark:bg-[#000] border border-gray-300 dark:border-brand-border p-3 rounded" />
            </div>
            <div>
              <label className="text-xs font-mono text-gray-500 block mb-2">FECHA Y HORA</label>
              <input type="datetime-local" required value={eventDate} onChange={e => setEventDate(e.target.value)} className="w-full bg-gray-50 dark:bg-[#000] border border-gray-300 dark:border-brand-border p-3 rounded" />
            </div>
            {view === 'create-event' && (
              <>
                <div>
                  <label className="text-xs font-mono text-gray-500 block mb-2">CATEGORÍA</label>
                  <div className="grid grid-cols-3 gap-2">
                    {categories.map(cat => (
                      <button key={cat.id} type="button" onClick={() => setCategory(cat.id)} className={`flex flex-col items-center gap-1 p-2 rounded border ${category === cat.id ? 'border-brand-blue bg-brand-blue/10 text-brand-blue' : 'border-gray-200 dark:border-brand-border text-gray-500'}`}>
                        <cat.icon size={18} /><span className="text-[10px] font-mono">{cat.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-xs font-mono text-gray-500 block mb-2">PÓSTER</label>
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 bg-gray-100 dark:bg-[#111] border border-dashed rounded-lg flex items-center justify-center overflow-hidden">
                      {imagePreview ? <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" /> : <ImageIcon size={24} className="text-gray-400" />}
                    </div>
                    <input type="file" accept="image/*" onChange={handleImageChange} id="file-upload" className="hidden" />
                    <label htmlFor="file-upload" className="cursor-pointer bg-white dark:bg-[#000] border border-gray-300 dark:border-brand-border px-4 py-2 rounded text-sm font-mono flex items-center gap-2"><Upload size={16} /> SUBIR</label>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-mono text-gray-500 block mb-2">TEMA DE TEXTO</label>
                  <div className="flex gap-2">
                    <button type="button" onClick={() => setTextTheme('light')} className={`flex-1 py-2 rounded border font-mono text-sm ${textTheme === 'light' ? 'bg-white text-black' : 'bg-gray-100 dark:bg-[#111] text-gray-500'}`}>Blanco</button>
                    <button type="button" onClick={() => setTextTheme('dark')} className={`flex-1 py-2 rounded border font-mono text-sm ${textTheme === 'dark' ? 'bg-black text-white' : 'bg-gray-100 dark:bg-[#111] text-gray-500'}`}>Negro</button>
                  </div>
                </div>
                <div className="border-t border-gray-200 dark:border-brand-border pt-4 space-y-4">
                  <CustomSelect label="País" options={countryOptions} value={selectedCountry} onChange={(val) => { setSelectedCountry(val); setSelectedType(''); setSelectedVenueId(''); }} placeholder="-- Selecciona un país --" />
                  {selectedCountry === 'custom' && <input type="text" placeholder="Escribe el país" value={customCountry} onChange={e => setCustomCountry(e.target.value)} className="w-full bg-white dark:bg-[#000] border border-brand-blue p-3 rounded text-sm" />}
                  {(selectedCountry && selectedCountry !== 'custom' || customCountry) && (
                    <>
                      <CustomSelect label="Tipo de Recinto" options={typeOptions} value={selectedType} onChange={(val) => { setSelectedType(val); setSelectedVenueId(''); }} placeholder="-- Selecciona un tipo --" />
                      {selectedType === 'custom' && <input type="text" placeholder="Escribe el tipo" value={customType} onChange={e => setCustomType(e.target.value)} className="w-full bg-white dark:bg-[#000] border border-brand-blue p-3 rounded text-sm" />}
                    </>
                  )}
                  {(selectedType && selectedType !== 'custom' || customType) && (
                    <>
                      <CustomSelect label="Recinto" options={venueOptions} value={selectedVenueId} onChange={setSelectedVenueId} placeholder="-- Selecciona un recinto --" />
                      {selectedVenueId === 'custom' && (
                        <div className="space-y-2">
                          <input type="text" placeholder="Nombre del recinto" value={customVenueName} onChange={e => setCustomVenueName(e.target.value)} className="w-full bg-white dark:bg-[#000] border border-brand-blue p-3 rounded text-sm" />
                          <input type="text" placeholder="Dirección" value={customVenueAddress} onChange={e => setCustomVenueAddress(e.target.value)} className="w-full bg-white dark:bg-[#000] border border-brand-border p-3 rounded text-sm" />
                        </div>
                      )}
                    </>
                  )}
                </div>
              </>
            )}
            <button type="submit" disabled={uploading} className="w-full py-4 bg-brand-blue text-white font-bold font-mono text-sm hover:bg-blue-600 transition-colors rounded-lg mt-4 flex items-center justify-center gap-2">
              {uploading ? <Loader2 className="animate-spin" size={18} /> : null}
              {uploading ? 'GUARDANDO...' : view === 'edit-event' ? 'GUARDAR CAMBIOS' : 'PUBLICAR EVENTO'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
