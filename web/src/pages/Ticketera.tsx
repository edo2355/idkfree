import { useState, useEffect } from 'react';
import { MapPin, Search, ChevronLeft, Calendar, Loader2, Image as ImageIcon, Upload, Share2, Plus, Music, Trophy, Theater, Mic2, Briefcase, PartyPopper, Edit, Trash2, X } from 'lucide-react';
import AdvancedSeatMap from '../components/AdvancedSeatMap';
import CustomSelect from '../components/CustomSelect';
import EventCard from '../components/EventCard';
import { useAuthStore } from '../stores/authStore';
import { useUIStore } from '../stores/uiStore';

interface EventData { id: string; name: string; event_date: string; venue_id: string; venue_name: string; venue_shape: string; promo_image_url?: string; text_theme?: string; category?: string; organizer_alias?: string; }

const categories = [
  { id: 'musical', label: 'Música', icon: Music }, { id: 'deportivo', label: 'Deportes', icon: Trophy },
  { id: 'teatro', label: 'Teatro', icon: Theater }, { id: 'conferencia', label: 'Conferencia', icon: Mic2 },
  { id: 'corporativo', label: 'Corporativo', icon: Briefcase }, { id: 'fiesta', label: 'Fiesta', icon: PartyPopper },
];

export default function Ticketera() {
  const { token } = useAuthStore();
  const { showToast } = useUIStore();
  
  const [view, setView] = useState<'catalog' | 'map' | 'create-event' | 'edit-event'>('catalog');
  const [selectedEvent, setSelectedEvent] = useState<EventData | null>(null);
  const [events, setEvents] = useState<EventData[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Formulario
  const [eventName, setEventName] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [category, setCategory] = useState('musical');
  const [textTheme, setTextTheme] = useState('light');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const fetchEvents = async () => {
    if (!token) return;
    try {
      const res = await fetch('https://idkfree.onrender.com/api/ticketing/events', { headers: { 'Authorization': `Bearer ${token}` } });
      if (res.ok) setEvents(await res.json());
    } catch (error) { console.error(error); } finally { setLoading(false); }
  };

  useEffect(() => { fetchEvents(); }, [token]);

  const handleEditClick = (e: React.MouseEvent, event: EventData) => {
    e.stopPropagation();
    setSelectedEvent(event);
    setEventName(event.name);
    setEventDate(new Date(event.event_date).toISOString().slice(0, 16)); // Formato datetime-local
    setCategory(event.category || 'musical');
    setTextTheme(event.text_theme || 'light');
    setView('edit-event');
  };

  const handleDeleteClick = async (e: React.MouseEvent, eventId: string) => {
    e.stopPropagation();
    if (!window.confirm('¿Estás seguro de eliminar este evento?')) return;
    try {
      const res = await fetch(`https://idkfree.onrender.com/api/ticketing/events/${eventId}`, {
        method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) { showToast('Evento eliminado', 'success'); fetchEvents(); }
    } catch (error) { showToast('Error al eliminar', 'error'); }
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
          <button onClick={() => setView('create-event')} className="w-full bg-brand-blue text-white font-bold py-3 rounded-lg hover:bg-blue-600 flex items-center justify-center gap-2">
            <Calendar size={18} /> CREAR NUEVO EVENTO
          </button>

          {loading ? <div className="flex justify-center py-8"><Loader2 className="animate-spin text-brand-blue" size={24} /></div> : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {events.map((event) => (
                <div key={event.id} className="relative group/wrapper">
                  <EventCard
                    id={event.id} name={event.name} date={event.event_date} venueName={event.venue_name}
                    imageUrl={event.promo_image_url} textTheme={event.text_theme as any} category={event.category}
                    organizerAlias={event.organizer_alias}
                    onClick={() => { setSelectedEvent(event); setView('map'); }}
                  />
                  {/* Botones de Acción Hover */}
                  <div className="absolute top-4 right-4 z-20 flex gap-2 opacity-0 group-hover/wrapper:opacity-100 transition-opacity">
                    <button onClick={(e) => handleEditClick(e, event)} className="w-8 h-8 bg-blue-500/80 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-blue-600" title="Editar"><Edit size={14} /></button>
                    <button onClick={(e) => handleDeleteClick(e, event.id)} className="w-8 h-8 bg-red-500/80 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-red-600" title="Eliminar"><Trash2 size={14} /></button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {(view === 'create-event' || view === 'edit-event') && (
        <div className="max-w-xl mx-auto">
          <form onSubmit={view === 'edit-event' ? handleUpdateEvent : (e) => e.preventDefault()} className="space-y-5 bg-white dark:bg-brand-panel p-8 rounded-xl border border-gray-200 dark:border-brand-border shadow-sm">
            <div>
              <label className="text-xs font-mono text-gray-500 block mb-2">NOMBRE</label>
              <input type="text" required value={eventName} onChange={e => setEventName(e.target.value)} className="w-full bg-gray-50 dark:bg-[#000] border border-gray-300 dark:border-brand-border p-3 rounded" />
            </div>
            <div>
              <label className="text-xs font-mono text-gray-500 block mb-2">FECHA Y HORA</label>
              <input type="datetime-local" required value={eventDate} onChange={e => setEventDate(e.target.value)} className="w-full bg-gray-50 dark:bg-[#000] border border-gray-300 dark:border-brand-border p-3 rounded" />
            </div>
            
            <div>
              <label className="text-xs font-mono text-gray-500 block mb-2">CATEGORÍA</label>
              <div className="grid grid-cols-3 gap-2">
                {categories.map(cat => (
                  <button key={cat.id} type="button" onClick={() => setCategory(cat.id)} className={`flex flex-col items-center gap-1 p-2 rounded border ${category === cat.id ? 'border-brand-blue bg-brand-blue/10 text-brand-blue' : 'border-gray-200 text-gray-500'}`}>
                    <cat.icon size={18} /><span className="text-[10px] font-mono">{cat.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-mono text-gray-500 block mb-2">TEMA DE TEXTO</label>
              <div className="flex gap-2">
                <button type="button" onClick={() => setTextTheme('light')} className={`flex-1 py-2 rounded border font-mono ${textTheme === 'light' ? 'bg-white text-black' : 'bg-gray-100 text-gray-500'}`}>Blanco</button>
                <button type="button" onClick={() => setTextTheme('dark')} className={`flex-1 py-2 rounded border font-mono ${textTheme === 'dark' ? 'bg-black text-white' : 'bg-gray-100 text-gray-500'}`}>Negro</button>
              </div>
            </div>

            {view === 'create-event' && (
               <button type="button" onClick={() => showToast('El guardado completo se reactivará en el próximo deploy', 'info')} className="w-full py-4 bg-brand-blue text-white font-bold rounded-lg mt-4">PUBLICAR EVENTO</button>
            )}
            {view === 'edit-event' && (
               <button type="submit" className="w-full py-4 bg-green-600 text-white font-bold rounded-lg mt-4">GUARDAR CAMBIOS</button>
            )}
          </form>
        </div>
      )}
    </div>
  );
}
