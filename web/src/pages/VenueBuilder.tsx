import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ChevronLeft, Save, Plus, Trash2, MapPin, Eye, Loader2, Edit, LayoutTemplate } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { useUIStore } from '../stores/uiStore';
import { computeStraightSeats, computeRadialSeats, computeArena360Seats, RowWithSeats } from '../utils/seatLayouts';

const LAYOUT_TYPES = ['straight', 'radial', 'arena_360', 'arena_180', 'arena_270', 'standing', 'grid', 'end_stage'];

export default function VenueBuilder() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editVenueId = searchParams.get('edit');
  const isNew = searchParams.get('new') === 'true';
  
  const { token } = useAuthStore();
  const { showToast } = useUIStore();

  // Galería de recintos
  const [venuesList, setVenuesList] = useState<any[]>([]);
  const [loadingVenues, setLoadingVenues] = useState(!editVenueId && !isNew);

  // Estados del editor
  const [name, setName] = useState('');
  const [type, setType] = useState('stadium');
  const [country, setCountry] = useState('CU');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [shape, setShape] = useState('rectangular');
  const [mapWidth] = useState(1200);
  const [mapHeight] = useState(900);
  const [sections, setSections] = useState<any[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingVenue, setIsLoadingVenue] = useState(!!editVenueId);

  // Cargar galería de recintos si no estamos editando
  useEffect(() => {
    if (editVenueId || isNew) return;
    
    const fetchVenues = async () => {
      try {
        const [globalRes, myRes] = await Promise.all([
          fetch('https://idkfree.onrender.com/api/ticketing/venues'),
          fetch('https://idkfree.onrender.com/api/venues/mine', { headers: { Authorization: `Bearer ${token}` } })
        ]);
        const globalData = globalRes.ok ? await globalRes.json() : [];
        const myData = myRes.ok ? await myRes.json() : [];
        
        // Combinar y quitar duplicados
        const combined = [...myData, ...globalData.filter((g: any) => !myData.find((m: any) => m.id === g.id))];
        setVenuesList(combined);
      } catch (error) {
        console.error(error);
      } finally {
        setLoadingVenues(false);
      }
    };
    if (token) fetchVenues();
  }, [editVenueId, isNew, token]);

  // Cargar datos del recinto si estamos editando
  useEffect(() => {
    if (!editVenueId) return;
    
    const loadVenue = async () => {
      try {
        const res = await fetch(`https://idkfree.onrender.com/api/venues/${editVenueId}/full`);
        if (res.ok) {
          const data = await res.json();
          setName(data.name);
          setType(data.type);
          setCountry(data.country);
          setCity(data.city || '');
          setAddress(data.address || '');
          setShape(data.shape || 'rectangular');
          
          const loadedSections = data.sections.map((s: any) => {
            const curve = s.curve ? JSON.parse(s.curve) : {};
            return {
              id: s.id,
              name: s.name,
              layoutType: s.layout_type || 'straight',
              seatRankId: s.seat_rank_id || 'general',
              price: s.price,
              color: s.color,
              accessible: s.accessible === 1,
              rowsCount: s.rows.length,
              seatsPerRow: s.rows[0]?.seats.length || 10,
              centerX: curve.centerX || 600,
              centerY: curve.centerY || 450,
              startRadius: curve.radius || 200,
              radiusGap: 30,
              startAngle: curve.startAngle || 200,
              endAngle: curve.endAngle || 340,
              rows: s.rows.map((r: any) => ({
                name: r.row_label,
                index: r.row_index,
                seats: r.seats.map((seat: any) => ({
                  number: seat.seat_number,
                  label: seat.seat_label,
                  x: seat.x,
                  y: seat.y,
                  seatType: seat.seat_type
                }))
              }))
            };
          });
          setSections(loadedSections);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoadingVenue(false);
      }
    };
    loadVenue();
  }, [editVenueId]);

  // ... funciones de edición (addSection, removeSection, etc.) ...
  const addSection = () => {
    setSections([...sections, {
      id: Date.now(), name: 'Nueva Sección', layoutType: 'straight', seatRankId: 'general',
      price: 50, color: '#3B82F6', accessible: false, rowsCount: 5, seatsPerRow: 10,
      centerX: 600, centerY: 450, startRadius: 200, radiusGap: 30,
      startAngle: 200, endAngle: 340, rows: [] as RowWithSeats[]
    }]);
  };

  const removeSection = (id: number) => setSections(sections.filter(s => s.id !== id));
  const updateSection = (id: number, patch: any) => setSections(sections.map(s => s.id === id ? { ...s, ...patch } : s));

  const recomputeSection = (section: any): RowWithSeats[] => {
    if (section.layoutType === 'straight' || section.layoutType === 'grid' || section.layoutType === 'end_stage') {
      return computeStraightSeats(section.rowsCount, section.seatsPerRow);
    }
    if (section.layoutType === 'radial' || section.layoutType === 'arena_180' || section.layoutType === 'arena_270') {
      return computeRadialSeats(section.rowsCount, section.seatsPerRow, section.centerX, section.centerY, section.startRadius, section.radiusGap, section.startAngle, section.endAngle);
    }
    if (section.layoutType === 'arena_360') {
      return computeArena360Seats(section.rowsCount, section.seatsPerRow, section.centerX, section.centerY, section.startRadius, section.radiusGap);
    }
    return [];
  };

  const handlePreviewSection = (section: any) => {
    const rows = recomputeSection(section);
    updateSection(section.id, { rows });
    showToast(`Calculados ${rows.reduce((a, r) => a + r.seats.length, 0)} asientos`, 'success');
  };

  const handleSave = async () => {
    if (!name) return showToast('Nombre obligatorio', 'error');
    if (sections.length === 0) return showToast('Añade secciones', 'error');

    const processedSections = sections.map(s => ({
      name: s.name, layoutType: s.layoutType, seatRankId: s.seatRankId, price: s.price,
      color: s.color, accessible: s.accessible,
      curve: s.layoutType === 'radial' ? { centerX: s.centerX, centerY: s.centerY, radius: s.startRadius, startAngle: s.startAngle, endAngle: s.endAngle } : undefined,
      rows: s.rows.length > 0 ? s.rows : recomputeSection(s)
    }));

    const totalCapacity = processedSections.reduce((acc: number, s: any) => acc + s.rows.reduce((a: number, r: any) => a + r.seats.length, 0), 0);

    setIsSaving(true);
    try {
      const url = editVenueId 
        ? `https://idkfree.onrender.com/api/venues/${editVenueId}/full`
        : 'https://idkfree.onrender.com/api/venues/full';
      const method = editVenueId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ name, type, country, city, address, capacity: totalCapacity, shape, map: { width: mapWidth, height: mapHeight }, sections: processedSections })
      });
      if (res.ok) {
        showToast(editVenueId ? 'Recinto actualizado' : 'Recinto creado', 'success');
        navigate('/ticketera/builder'); // Volver a la galería
      } else { showToast('Error al guardar', 'error'); }
    } catch (error) { showToast('Error de red', 'error'); } finally { setIsSaving(false); }
  };

  const renderSectionPreview = (section: any) => {
    if (!section.rows || section.rows.length === 0) return <div className="text-xs text-gray-500 text-center py-6 font-mono">Toca "Calcular Asientos" para ver.</div>;
    return (
      <svg viewBox={`0 0 ${mapWidth} ${mapHeight}`} className="w-full bg-gray-50 dark:bg-[#050505] rounded-lg border border-gray-200 dark:border-[#222] max-h-64">
        {section.rows.map((row: any) => row.seats.map((seat: any) => (
          <circle key={`${row.name}-${seat.number}`} cx={seat.x} cy={seat.y} r="3" fill={section.color} />
        )))}
      </svg>
    );
  };

  if (loadingVenues) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-brand-blue" size={32} /></div>;
  if (isLoadingVenue) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-brand-blue" size={32} /></div>;

  // ==========================================
  // VISTA 1: GALERÍA DE RECINTOS (Cuando no hay edit ni new)
  // ==========================================
  if (!editVenueId && !isNew) {
    return (
      <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-500 pb-24">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-200 dark:border-brand-border pb-4 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white font-mono tracking-tight flex items-center gap-3">
              <LayoutTemplate size={28} className="text-brand-blue" /> VENUE DIRECTORY
            </h1>
            <p className="text-gray-500 text-sm mt-1">Selecciona un recinto para editarlo o crea uno nuevo.</p>
          </div>
          <button onClick={() => navigate('/ticketera/builder?new=true')} className="bg-brand-blue text-white font-bold px-6 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-600">
            <Plus size={18} /> CREAR NUEVO RECINTO
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {venuesList.map(venue => (
            <div key={venue.id} className="bg-white dark:bg-brand-panel border border-gray-200 dark:border-brand-border rounded-xl p-6 hover:border-brand-blue transition-colors group flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div className="p-2 bg-brand-blue/10 rounded-lg"><MapPin size={20} className="text-brand-blue" /></div>
                  <span className="text-[10px] font-mono bg-gray-100 dark:bg-[#111] px-2 py-1 rounded">{venue.capacity?.toLocaleString()} CAP.</span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">{venue.name}</h3>
                <p className="text-xs text-gray-500 mb-4">{venue.city}, {venue.country}</p>
              </div>
              <button onClick={() => navigate(`/ticketera/builder?edit=${venue.id}`)} className="w-full py-2 bg-gray-50 dark:bg-[#111] text-brand-blue font-mono text-sm font-bold rounded hover:bg-brand-blue hover:text-white transition-colors flex items-center justify-center gap-2">
                <Edit size={16} /> EDITAR / VER
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ==========================================
  // VISTA 2: EDITOR (Cuando edit=ID o new=true)
  // ==========================================
  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-500 pb-24">
      <div className="flex items-center gap-4 border-b border-gray-200 dark:border-brand-border pb-4">
        <button onClick={() => navigate('/ticketera/builder')} className="text-gray-500 hover:text-white flex items-center gap-1 text-xs font-mono"><ChevronLeft size={16} /> VOLVER</button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white font-mono tracking-tight">
            {editVenueId ? 'EDITAR RECINTO' : 'VENUE_BUILDER_PRO'}
          </h1>
          <p className="text-gray-500 text-sm mt-1">{editVenueId ? 'Modifica la capacidad o distribución de asientos.' : 'Diseña tu recinto con layouts personalizados.'}</p>
        </div>
      </div>

      {/* Datos del recinto */}
      <div className="bg-white dark:bg-brand-panel border border-gray-200 dark:border-brand-border rounded-xl p-6">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2"><MapPin className="text-brand-blue" /> Datos del Recinto</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input type="text" placeholder="Nombre del recinto" value={name} onChange={e => setName(e.target.value)} className="bg-gray-50 dark:bg-[#000] border border-gray-300 dark:border-brand-border p-2 rounded text-sm" />
          <input type="text" placeholder="Dirección" value={address} onChange={e => setAddress(e.target.value)} className="bg-gray-50 dark:bg-[#000] border border-gray-300 dark:border-brand-border p-2 rounded text-sm" />
          <input type="text" placeholder="Ciudad" value={city} onChange={e => setCity(e.target.value)} className="bg-gray-50 dark:bg-[#000] border border-gray-300 dark:border-brand-border p-2 rounded text-sm" />
          <input type="text" placeholder="País (ej. CU)" maxLength={2} value={country} onChange={e => setCountry(e.target.value.toUpperCase())} className="bg-gray-50 dark:bg-[#000] border border-gray-300 dark:border-brand-border p-2 rounded text-sm" />
          <select value={type} onChange={e => setType(e.target.value)} className="bg-gray-50 dark:bg-[#000] border border-gray-300 dark:border-brand-border p-2 rounded text-sm">
            <option value="stadium">Estadio</option><option value="arena">Arena</option><option value="theater">Teatro</option>
            <option value="amphitheater">Anfiteatro</option><option value="auditorium">Auditorio</option><option value="plaza">Plaza</option>
          </select>
          <select value={shape} onChange={e => setShape(e.target.value)} className="bg-gray-50 dark:bg-[#000] border border-gray-300 dark:border-brand-border p-2 rounded text-sm">
            <option value="rectangular">Rectangular</option><option value="circular">Circular</option>
            <option value="herradura">Herradura</option><option value="d_shape">Forma D</option>
          </select>
        </div>
      </div>

      {/* Secciones */}
      <div className="bg-white dark:bg-brand-panel border border-gray-200 dark:border-brand-border rounded-xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Secciones del Recinto</h2>
          <button onClick={addSection} className="text-xs bg-brand-blue text-white px-3 py-1.5 rounded flex items-center gap-1"><Plus size={14} /> Añadir Sección</button>
        </div>

        <div className="space-y-6">
          {sections.map(section => (
            <div key={section.id} className="border border-gray-200 dark:border-[#333] rounded-lg p-4 bg-gray-50 dark:bg-[#0a0a0a]">
              <div className="flex justify-between mb-3">
                <input type="text" value={section.name} onChange={e => updateSection(section.id, { name: e.target.value })} className="bg-white dark:bg-[#000] border border-gray-300 dark:border-brand-border px-2 py-1 rounded text-sm font-bold flex-1 mr-2" />
                <button onClick={() => removeSection(section.id)} className="text-red-500"><Trash2 size={18} /></button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-3">
                <div><label className="text-[10px] font-mono text-gray-500">LAYOUT</label><select value={section.layoutType} onChange={e => updateSection(section.id, { layoutType: e.target.value })} className="w-full p-1.5 rounded text-xs bg-white dark:bg-[#000] border border-gray-300">{LAYOUT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}</select></div>
                <div><label className="text-[10px] font-mono text-gray-500">PRECIO</label><input type="number" value={section.price} onChange={e => updateSection(section.id, { price: Number(e.target.value) })} className="w-full p-1.5 rounded text-xs bg-white dark:bg-[#000] border border-gray-300" /></div>
                <div><label className="text-[10px] font-mono text-gray-500">FILAS</label><input type="number" value={section.rowsCount} onChange={e => updateSection(section.id, { rowsCount: Number(e.target.value) })} className="w-full p-1.5 rounded text-xs bg-white dark:bg-[#000] border border-gray-300" /></div>
                <div><label className="text-[10px] font-mono text-gray-500">ASIENTOS/FILA</label><input type="number" value={section.seatsPerRow} onChange={e => updateSection(section.id, { seatsPerRow: Number(e.target.value) })} className="w-full p-1.5 rounded text-xs bg-white dark:bg-[#000] border border-gray-300" /></div>
              </div>
              {(section.layoutType === 'radial' || section.layoutType.startsWith('arena_')) && (
                <div className="grid grid-cols-4 gap-2 mb-3 p-2 bg-brand-blue/5 rounded border border-brand-blue/20">
                  <div><label className="text-[10px]">CX</label><input type="number" value={section.centerX} onChange={e => updateSection(section.id, { centerX: Number(e.target.value) })} className="w-full p-1 rounded text-xs" /></div>
                  <div><label className="text-[10px]">CY</label><input type="number" value={section.centerY} onChange={e => updateSection(section.id, { centerY: Number(e.target.value) })} className="w-full p-1 rounded text-xs" /></div>
                  <div><label className="text-[10px]">RADIO</label><input type="number" value={section.startRadius} onChange={e => updateSection(section.id, { startRadius: Number(e.target.value) })} className="w-full p-1 rounded text-xs" /></div>
                  <div><label className="text-[10px]">GAP</label><input type="number" value={section.radiusGap} onChange={e => updateSection(section.id, { radiusGap: Number(e.target.value) })} className="w-full p-1 rounded text-xs" /></div>
                </div>
              )}
              <button onClick={() => handlePreviewSection(section)} className="text-xs bg-white dark:bg-[#111] border border-gray-300 px-3 py-1.5 rounded flex items-center gap-1 mb-3"><Eye size={12} /> Calcular</button>
              {renderSectionPreview(section)}
            </div>
          ))}
        </div>
      </div>

      {/* Botón Guardar */}
      <div className="fixed bottom-0 left-0 w-full lg:pl-64 p-4 bg-white dark:bg-brand-dark border-t border-gray-200 dark:border-brand-border z-50">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <div>
            <p className="text-xs font-mono text-gray-500">SECCIONES: {sections.length}</p>
            <p className="text-xl font-bold text-brand-blue">Capacidad: {sections.reduce((acc, s) => acc + (s.rowsCount * s.seatsPerRow), 0).toLocaleString()}</p>
          </div>
          <button onClick={handleSave} disabled={isSaving} className="bg-brand-blue text-white px-8 py-3 rounded-lg font-bold font-mono flex items-center gap-2 disabled:opacity-50">
            {isSaving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
            {isSaving ? 'GUARDANDO...' : editVenueId ? 'ACTUALIZAR RECINTO' : 'GUARDAR RECINTO'}
          </button>
        </div>
      </div>
    </div>
  );
}
