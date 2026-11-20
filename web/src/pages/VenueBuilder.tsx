import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Save, Plus, Trash2, MapPin, Eye, Loader2 } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { useUIStore } from '../stores/uiStore';
import { computeStraightSeats, computeRadialSeats, computeArena360Seats } from '../utils/seatLayouts';

const LAYOUT_TYPES = ['straight', 'radial', 'arena_360', 'arena_180', 'arena_270', 'standing', 'grid', 'end_stage'];

export default function VenueBuilder() {
  const navigate = useNavigate();
  const { token } = useAuthStore();
  const { showToast } = useUIStore();

  // Datos del Venue
  const [name, setName] = useState('');
  const [type, setType] = useState('stadium');
  const [country, setCountry] = useState('CU');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [capacity, setCapacity] = useState(0);
  const [shape, setShape] = useState('rectangular');
  const [mapWidth] = useState(1200);
  const [mapHeight] = useState(900);

  // Secciones (con layoutType)
  const [sections, setSections] = useState<any[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  const addSection = () => {
    setSections([...sections, {
      id: Date.now(),
      name: 'Nueva Sección',
      layoutType: 'straight',
      seatRankId: 'general',
      price: 50,
      color: '#3B82F6',
      accessible: false,
      rowsCount: 5,
      seatsPerRow: 10,
      centerX: 600, centerY: 450,
      startRadius: 200, radiusGap: 30,
      startAngle: 200, endAngle: 340,
      rows: [] as any[]
    }]);
  };

  const removeSection = (id: number) => setSections(sections.filter(s => s.id !== id));

  const updateSection = (id: number, patch: any) => {
    setSections(sections.map(s => s.id === id ? { ...s, ...patch } : s));
  };

  // Recalcula los asientos de una sección según su layoutType
  const recomputeSection = (section: any) => {
    let rows = [];
    if (section.layoutType === 'straight' || section.layoutType === 'grid' || section.layoutType === 'end_stage') {
      rows = computeStraightSeats(section.rowsCount, section.seatsPerRow);
    } else if (section.layoutType === 'radial' || section.layoutType === 'arena_180' || section.layoutType === 'arena_270') {
      rows = computeRadialSeats(section.rowsCount, section.seatsPerRow, section.centerX, section.centerY, section.startRadius, section.radiusGap, section.startAngle, section.endAngle);
    } else if (section.layoutType === 'arena_360') {
      rows = computeArena360Seats(section.rowsCount, section.seatsPerRow, section.centerX, section.centerY, section.startRadius, section.radiusGap);
    }
    return rows;
  };

  const handlePreviewSection = (section: any) => {
    const rows = recomputeSection(section);
    updateSection(section.id, { rows });
    const totalSeats = rows.reduce((acc: number, r: any) => acc + r.seats.length, 0);
    showToast(`Sección "${section.name}" calculada: ${totalSeats} asientos`, 'success');
  };

  const handleSave = async () => {
    if (!name) return showToast('El nombre es obligatorio', 'error');
    if (sections.length === 0) return showToast('Añade al menos una sección', 'error');
    
    // Calcular todas las secciones antes de enviar
    const processedSections = sections.map(s => {
      const rows = recomputeSection(s);
      return {
        name: s.name,
        layoutType: s.layoutType,
        seatRankId: s.seatRankId,
        price: s.price,
        color: s.color,
        accessible: s.accessible,
        curve: s.layoutType === 'radial' ? { centerX: s.centerX, centerY: s.centerY, radius: s.startRadius, startAngle: s.startAngle, endAngle: s.endAngle } : undefined,
        rows: rows
      };
    });

    const totalCapacity = processedSections.reduce((acc, s) => acc + s.rows.reduce((a: number, r: any) => a + r.seats.length, 0), 0);

    setIsSaving(true);
    try {
      const res = await fetch('https://idkfree.onrender.com/api/venues/full', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({
          name, type, country, city, address, capacity: totalCapacity, shape,
          map: { width: mapWidth, height: mapHeight },
          sections: processedSections
        })
      });
      if (res.ok) {
        showToast('Venue creado exitosamente', 'success');
        navigate('/ticketera');
      } else {
        showToast('Error al guardar', 'error');
      }
    } catch (error) {
      showToast('Error de red', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  // Vista previa SVG de la sección
  const renderSectionPreview = (section: any) => {
    if (!section.rows || section.rows.length === 0) {
      return <div className="text-xs text-gray-500 text-center py-8 font-mono">Toca "Calcular" para ver los asientos.</div>;
    }
    return (
      <svg viewBox={`0 0 ${mapWidth} ${mapHeight}`} className="w-full bg-gray-50 dark:bg-[#050505] rounded-lg border border-gray-200 dark:border-[#222]">
        {section.rows.map((row: any) => 
          row.seats.map((seat: any) => (
            <circle
              key={`${row.name}-${seat.number}`}
              cx={seat.x} cy={seat.y} r="4"
              fill={section.color}
              className="cursor-pointer hover:fill-brand-blue"
            >
              <title>{`Fila ${row.name} - Asiento ${seat.label}`}</title>
            </circle>
          ))
        )}
      </svg>
    );
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-500 pb-24">
      
      <div className="flex items-center gap-4 border-b border-gray-200 dark:border-brand-border pb-4">
        <button onClick={() => navigate('/ticketera')} className="text-gray-500 hover:text-white"><ChevronLeft /></button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white font-mono tracking-tight">VENUE_BUILDER_PRO</h1>
          <p className="text-gray-500 text-sm mt-1">Diseña recintos con múltiples layouts de asientos.</p>
        </div>
      </div>

      {/* Datos del Venue */}
      <div className="bg-white dark:bg-brand-panel border border-gray-200 dark:border-brand-border rounded-xl p-6">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2"><MapPin className="text-brand-blue" /> Datos del Recinto</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input type="text" placeholder="Nombre del recinto" value={name} onChange={e => setName(e.target.value)} className="bg-gray-50 dark:bg-[#000] border border-gray-300 dark:border-brand-border p-2 rounded text-sm" />
          <input type="text" placeholder="Dirección" value={address} onChange={e => setAddress(e.target.value)} className="bg-gray-50 dark:bg-[#000] border border-gray-300 dark:border-brand-border p-2 rounded text-sm" />
          <input type="text" placeholder="Ciudad" value={city} onChange={e => setCity(e.target.value)} className="bg-gray-50 dark:bg-[#000] border border-gray-300 dark:border-brand-border p-2 rounded text-sm" />
          <input type="text" placeholder="País (ej. CU)" maxLength={2} value={country} onChange={e => setCountry(e.target.value.toUpperCase())} className="bg-gray-50 dark:bg-[#000] border border-gray-300 dark:border-brand-border p-2 rounded text-sm" />
          <select value={type} onChange={e => setType(e.target.value)} className="bg-gray-50 dark:bg-[#000] border border-gray-300 dark:border-brand-border p-2 rounded text-sm">
            <option value="stadium">Estadio</option>
            <option value="arena">Arena</option>
            <option value="theater">Teatro</option>
            <option value="amphitheater">Anfiteatro</option>
            <option value="auditorium">Auditorio</option>
            <option value="plaza">Plaza</option>
          </select>
          <select value={shape} onChange={e => setShape(e.target.value)} className="bg-gray-50 dark:bg-[#000] border border-gray-300 dark:border-brand-border p-2 rounded text-sm">
            <option value="rectangular">Rectangular</option>
            <option value="circular">Circular</option>
            <option value="herradura">Herradura</option>
            <option value="d_shape">Forma D</option>
          </select>
        </div>
      </div>

      {/* Secciones */}
      <div className="bg-white dark:bg-brand-panel border border-gray-200 dark:border-brand-border rounded-xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Secciones del Recinto</h2>
          <button onClick={addSection} className="text-xs bg-brand-blue text-white px-3 py-1.5 rounded flex items-center gap-1 hover:bg-blue-600">
            <Plus size={14} /> Añadir Sección
          </button>
        </div>

        <div className="space-y-6">
          {sections.map(section => (
            <div key={section.id} className="border border-gray-200 dark:border-[#333] rounded-lg p-4 bg-gray-50 dark:bg-[#0a0a0a]">
              
              <div className="flex justify-between mb-3">
                <input type="text" value={section.name} onChange={e => updateSection(section.id, { name: e.target.value })} className="bg-white dark:bg-[#000] border border-gray-300 dark:border-brand-border px-2 py-1 rounded text-sm font-bold flex-1 mr-2" />
                <button onClick={() => removeSection(section.id)} className="text-red-500"><Trash2 size={18} /></button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-3">
                <div>
                  <label className="text-[10px] font-mono text-gray-500">LAYOUT</label>
                  <select value={section.layoutType} onChange={e => updateSection(section.id, { layoutType: e.target.value })} className="w-full bg-white dark:bg-[#000] border border-gray-300 dark:border-brand-border p-1.5 rounded text-xs">
                    {LAYOUT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-mono text-gray-500">PRECIO</label>
                  <input type="number" value={section.price} onChange={e => updateSection(section.id, { price: Number(e.target.value) })} className="w-full bg-white dark:bg-[#000] border border-gray-300 dark:border-brand-border p-1.5 rounded text-xs" />
                </div>
                <div>
                  <label className="text-[10px] font-mono text-gray-500">FILAS</label>
                  <input type="number" value={section.rowsCount} onChange={e => updateSection(section.id, { rowsCount: Number(e.target.value) })} className="w-full bg-white dark:bg-[#000] border border-gray-300 dark:border-brand-border p-1.5 rounded text-xs" />
                </div>
                <div>
                  <label className="text-[10px] font-mono text-gray-500">ASIENTOS/FILA</label>
                  <input type="number" value={section.seatsPerRow} onChange={e => updateSection(section.id, { seatsPerRow: Number(e.target.value) })} className="w-full bg-white dark:bg-[#000] border border-gray-300 dark:border-brand-border p-1.5 rounded text-xs" />
                </div>
                <div>
                  <label className="text-[10px] font-mono text-gray-500">COLOR</label>
                  <input type="color" value={section.color} onChange={e => updateSection(section.id, { color: e.target.value })} className="w-full h-8 rounded border border-gray-300" />
                </div>
              </div>

              {(section.layoutType === 'radial' || section.layoutType.startsWith('arena_')) && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-3 p-2 bg-brand-blue/5 rounded border border-brand-blue/20">
                  <div><label className="text-[10px] font-mono">CX</label><input type="number" value={section.centerX} onChange={e => updateSection(section.id, { centerX: Number(e.target.value) })} className="w-full p-1 rounded text-xs" /></div>
                  <div><label className="text-[10px] font-mono">CY</label><input type="number" value={section.centerY} onChange={e => updateSection(section.id, { centerY: Number(e.target.value) })} className="w-full p-1 rounded text-xs" /></div>
                  <div><label className="text-[10px] font-mono">RADIO INICIAL</label><input type="number" value={section.startRadius} onChange={e => updateSection(section.id, { startRadius: Number(e.target.value) })} className="w-full p-1 rounded text-xs" /></div>
                  <div><label className="text-[10px] font-mono">GAP RADIO</label><input type="number" value={section.radiusGap} onChange={e => updateSection(section.id, { radiusGap: Number(e.target.value) })} className="w-full p-1 rounded text-xs" /></div>
                </div>
              )}

              <button onClick={() => handlePreviewSection(section)} className="text-xs bg-white dark:bg-[#111] border border-gray-300 dark:border-[#333] px-3 py-1.5 rounded flex items-center gap-1 hover:border-brand-blue mb-3">
                <Eye size={12} /> Calcular Asientos
              </button>

              {renderSectionPreview(section)}
            </div>
          ))}
        </div>
      </div>

      {/* Botón de Guardar */}
      <div className="fixed bottom-0 left-0 w-full lg:pl-64 p-4 bg-white dark:bg-brand-dark border-t border-gray-200 dark:border-brand-border z-50">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <div>
            <p className="text-xs font-mono text-gray-500">SECCIONES: {sections.length}</p>
            <p className="text-xl font-bold text-brand-blue">
              Capacidad estimada: {sections.reduce((acc, s) => acc + (s.rowsCount * s.seatsPerRow), 0).toLocaleString()}
            </p>
          </div>
          <button onClick={handleSave} disabled={isSaving} className="bg-brand-blue text-white px-8 py-3 rounded-lg font-bold font-mono hover:bg-blue-600 flex items-center gap-2 disabled:opacity-50">
            {isSaving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
            {isSaving ? 'GUARDANDO...' : 'GUARDAR RECINTO'}
          </button>
        </div>
      </div>
    </div>
  );
}
