import { useState, useEffect } from 'react';
import { Plus, MapPin, Users, ArrowRight, Loader2 } from 'lucide-react';
import SeatMap from '../components/SeatMap';
import { useAuthStore } from '../stores/authStore';
import { useUIStore } from '../stores/uiStore';

interface Venue {
  id: string;
  name: string;
  location: string;
}

export default function Ticketera() {
  const { token } = useAuthStore();
  const { showToast } = useUIStore();
  
  const [view, setView] = useState<'dashboard' | 'create-venue' | 'buy-ticket'>('dashboard');
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Formulario
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');

  const fetchVenues = async () => {
    if (!token) return;
    try {
      const res = await fetch('https://idkfree.onrender.com/api/ticketing/venues', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setVenues(data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVenues();
  }, [token]);

  const handleCreateVenue = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    
    try {
      const res = await fetch('https://idkfree.onrender.com/api/ticketing/venues', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ name, location })
      });

      if (res.ok) {
        showToast('Recinto creado exitosamente', 'success');
        setName(''); setLocation('');
        setView('dashboard');
        fetchVenues(); // Recargar la lista
      } else {
        showToast('Error creando el recinto', 'error');
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Header Dinámico */}
      <div className="flex justify-between items-center border-b border-gray-200 dark:border-brand-border pb-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white font-mono tracking-tight">
            {view === 'dashboard' && 'TICKETERA_PRO'}
            {view === 'create-venue' && 'CREAR NUEVO RECINTO'}
            {view === 'buy-ticket' && 'SELECCIÓN DE ASIENTOS'}
          </h1>
          <p className="text-gray-500 font-mono text-xs mt-1">SISTEMA DE GESTIÓN DE EVENTOS Y AFORO</p>
        </div>
        {view !== 'dashboard' && (
          <button onClick={() => setView('dashboard')} className="text-xs font-mono text-brand-blue hover:text-blue-700 transition-colors">
            &lt; VOLVER AL PANEL
          </button>
        )}
      </div>

      {/* VISTA 1: DASHBOARD (Lista de Venues/Eventos) */}
      {view === 'dashboard' && (
        <div className="space-y-4">
          <button 
            onClick={() => setView('create-venue')}
            className="w-full border border-dashed border-gray-300 dark:border-gray-700 p-6 flex flex-col items-center justify-center gap-2 hover:border-brand-blue hover:bg-brand-blue/5 transition-all text-gray-500 hover:text-brand-blue rounded-lg"
          >
            <Plus size={24} />
            <span className="font-mono text-sm">CREAR NUEVO VENUE / ESTADIO</span>
          </button>

          {loading ? (
            <div className="flex justify-center py-12"><Loader2 className="animate-spin text-brand-blue" size={32} /></div>
          ) : venues.length === 0 ? (
            <div className="text-center py-12 text-gray-500 font-mono border border-gray-200 dark:border-brand-border rounded-lg">
              No tienes recintos creados todavía.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {venues.map((venue) => (
                <div key={venue.id} className="border border-gray-200 dark:border-brand-border bg-white dark:bg-brand-panel p-6 flex flex-col justify-between hover:border-brand-blue/50 transition-colors rounded-lg">
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">{venue.name}</h3>
                      <span className="text-[10px] font-mono bg-brand-blue/10 text-brand-blue border border-brand-blue/20 px-2 py-1 rounded">VENUE</span>
                    </div>
                    <div className="space-y-2 text-sm text-gray-500 font-mono mb-6">
                      <p className="flex items-center gap-2"><MapPin size={14} /> {venue.location}</p>
                    </div>
                  </div>
                  <button onClick={() => setView('buy-ticket')} className="w-full py-2 bg-gray-900 dark:bg-white text-white dark:text-black font-bold font-mono text-xs hover:bg-brand-blue dark:hover:bg-brand-blue hover:text-white transition-colors flex items-center justify-center gap-2 rounded">
                    VER MAPA DE ASIENTOS <ArrowRight size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* VISTA 2: CREAR VENUE */}
      {view === 'create-venue' && (
        <div className="max-w-xl space-y-6">
          <form onSubmit={handleCreateVenue} className="space-y-4 bg-white dark:bg-brand-panel p-6 rounded-lg border border-gray-200 dark:border-brand-border">
            <div>
              <label className="text-xs font-mono text-gray-500 block mb-1">NOMBRE DEL RECINTO</label>
              <input type="text" required value={name} onChange={e => setName(e.target.value)} className="w-full bg-gray-50 dark:bg-[#000] border border-gray-300 dark:border-brand-border p-3 rounded text-gray-900 dark:text-white focus:outline-none focus:border-brand-blue transition-colors" placeholder="Ej. Estadio Monumental" />
            </div>
            <div>
              <label className="text-xs font-mono text-gray-500 block mb-1">UBICACIÓN</label>
              <input type="text" required value={location} onChange={e => setLocation(e.target.value)} className="w-full bg-gray-50 dark:bg-[#000] border border-gray-300 dark:border-brand-border p-3 rounded text-gray-900 dark:text-white focus:outline-none focus:border-brand-blue transition-colors" placeholder="Ej. Santiago de Cuba" />
            </div>
            <button type="submit" className="w-full py-3 bg-brand-blue text-white font-bold font-mono text-sm hover:bg-blue-600 transition-colors rounded">
              GUARDAR RECINTO EN TURSO
            </button>
          </form>
        </div>
      )}

      {/* VISTA 3: COMPRAR BOLETO (Mapa Visual) */}
      {view === 'buy-ticket' && (
        <div className="max-w-3xl mx-auto">
          <SeatMap />
          <div className="mt-6 flex justify-between items-center p-4 bg-white dark:bg-brand-panel border border-gray-200 dark:border-brand-border rounded-lg">
            <div>
              <p className="text-xs font-mono text-gray-500">TOTAL A PAGAR</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">$25.00 USD</p>
            </div>
            <button onClick={() => showToast('Módulo de pagos en desarrollo', 'info')} className="bg-brand-blue hover:bg-blue-600 text-white font-bold font-mono px-8 py-3 text-sm transition-colors rounded">
              PAGAR CON QVAPAY
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
