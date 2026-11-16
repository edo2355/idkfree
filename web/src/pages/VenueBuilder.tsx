import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Save, Plus, Trash2, MapPin, LayoutTemplate } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { useUIStore } from '../stores/uiStore';

export default function VenueBuilder() {
  const navigate = useNavigate();
  const { token } = useAuthStore();
  const { showToast } = useUIStore();
  
  // Estado del Paso 1: Datos básicos
  const [name, setName] = useState('');
  const [type, setType] = useState('estadio');
  const [country, setCountry] = useState('CU');
  const [address, setAddress] = useState('');
  const [shape, setShape] = useState('rectangular');

  // Estado del Paso 2: Secciones
  const [sections, setSections] = useState([
    { id: 1, name: 'General', price: 50, color: '#3B82F6', rows: [{ label: 'A', seats: 10 }] }
  ]);

  const addSection = () => {
    setSections([...sections, { id: Date.now(), name: 'Nueva Sección', price: 100, color: '#FDE047', rows: [{ label: 'A', seats: 10 }] }]);
  };

  const removeSection = (id: number) => {
    setSections(sections.filter(s => s.id !== id));
  };

  const addRow = (sectionId: number) => {
    setSections(sections.map(s => {
      if (s.id === sectionId) {
        const nextLabel = String.fromCharCode(65 + s.rows.length);
        return { ...s, rows: [...s.rows, { label: nextLabel, seats: 10 }] };
      }
      return s;
    }));
  };

  const updateRowSeats = (sectionId: number, rowIndex: number, seats: number) => {
    setSections(sections.map(s => {
      if (s.id === sectionId) {
        const newRows = [...s.rows];
        newRows[rowIndex].seats = seats;
        return { ...s, rows: newRows };
      }
      return s;
    }));
  };

  const handleSave = async () => {
    if (!token) return showToast('Debes iniciar sesión', 'error');
    if (!name) return showToast('El nombre del recinto es obligatorio', 'error');

    // Calcular capacidad total
    let totalCapacity = 0;
    sections.forEach(s => s.rows.forEach(r => totalCapacity += r.seats));

    try {
      const res = await fetch('https://idkfree.onrender.com/api/builder/venues', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ name, type, country, address, capacity: totalCapacity, shape, sections })
      });

      if (res.ok) {
        showToast('Recinto creado exitosamente', 'success');
        navigate('/ticketera');
      } else {
        showToast('Error al guardar el recinto', 'error');
      }
    } catch (error) {
      showToast('Error de red', 'error');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
      
      {/* Header */}
      <div className="flex items-center gap-4 border-b border-gray-200 dark:border-brand-border pb-4">
        <button onClick={() => navigate('/ticketera')} className="text-gray-500 hover:text-white"><ChevronLeft /></button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white font-mono tracking-tight">VENUE_BUILDER</h1>
          <p className="text-gray-500 text-sm mt-1">Diseña tu propio recinto y define sus asientos.</p>
        </div>
      </div>

      {/* PASO 1: DATOS DEL RECINTO */}
      <div className="bg-white dark:bg-brand-panel border border-gray-200 dark:border-brand-border rounded-xl p-6">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2"><MapPin className="text-brand-blue" /> Paso 1: Datos del Recinto</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-mono text-gray-500 block mb-1">NOMBRE DEL RECINTO</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full bg-gray-50 dark:bg-[#000] border border-gray-300 dark:border-brand-border p-2 rounded text-gray-900 dark:text-white" placeholder="Ej. Estadio Central" />
          </div>
          <div>
            <label className="text-xs font-mono text-gray-500 block mb-1">DIRECCIÓN</label>
            <input type="text" value={address} onChange={e => setAddress(e.target.value)} className="w-full bg-gray-50 dark:bg-[#000] border border-gray-300 dark:border-brand-border p-2 rounded text-gray-900 dark:text-white" placeholder="Ej. Calle 23, La Habana" />
          </div>
          <div>
            <label className="text-xs font-mono text-gray-500 block mb-1">TIPO DE RECINTO</label>
            <select value={type} onChange={e => setType(e.target.value)} className="w-full bg-gray-50 dark:bg-[#000] border border-gray-300 dark:border-brand-border p-2 rounded text-gray-900 dark:text-white">
              <option value="estadio">Estadio</option>
              <option value="arena">Arena</option>
              <option value="teatro">Teatro</option>
              <option value="coliseo">Coliseo</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-mono text-gray-500 block mb-1">FORMA GEOMÉTRICA</label>
            <select value={shape} onChange={e => setShape(e.target.value)} className="w-full bg-gray-50 dark:bg-[#000] border border-gray-300 dark:border-brand-border p-2 rounded text-gray-900 dark:text-white">
              <option value="rectangular">Rectangular (Estadio clásico)</option>
              <option value="circular">Circular (Arena)</option>
              <option value="herradura">Herradura (Teatro)</option>
              <option value="d_shape">Forma de D (Bombonera)</option>
            </select>
          </div>
        </div>
      </div>

      {/* PASO 2: CONSTRUCTOR DE SECCIONES Y ASIENTOS */}
      <div className="bg-white dark:bg-brand-panel border border-gray-200 dark:border-brand-border rounded-xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2"><LayoutTemplate className="text-brand-blue" /> Paso 2: Secciones y Asientos</h2>
          <button onClick={addSection} className="text-xs font-mono bg-brand-blue text-white px-3 py-1.5 rounded flex items-center gap-1 hover:bg-blue-600"><Plus size={14}/> Añadir Sección</button>
        </div>

        <div className="space-y-6">
          {sections.map((section) => (
            <div key={section.id} className="border border-gray-200 dark:border-[#333] rounded-lg p-4 bg-gray-50 dark:bg-[#0a0a0a]">
              
              <div className="flex flex-wrap gap-4 items-end mb-4 border-b border-gray-200 dark:border-[#333] pb-4">
                <div className="flex-1">
                  <label className="text-[10px] font-mono text-gray-500 block mb-1">NOMBRE (VIP, GENERAL)</label>
                  <input type="text" value={section.name} onChange={e => setSections(sections.map(s => s.id === section.id ? {...s, name: e.target.value} : s))} className="w-full bg-white dark:bg-[#000] border border-gray-300 dark:border-brand-border p-2 rounded text-sm text-gray-900 dark:text-white" />
                </div>
                <div className="w-24">
                  <label className="text-[10px] font-mono text-gray-500 block mb-1">PRECIO ($)</label>
                  <input type="number" value={section.price} onChange={e => setSections(sections.map(s => s.id === section.id ? {...s, price: Number(e.target.value)} : s))} className="w-full bg-white dark:bg-[#000] border border-gray-300 dark:border-brand-border p-2 rounded text-sm text-gray-900 dark:text-white" />
                </div>
                <div className="w-20">
                  <label className="text-[10px] font-mono text-gray-500 block mb-1">COLOR</label>
                  <input type="color" value={section.color} onChange={e => setSections(sections.map(s => s.id === section.id ? {...s, color: e.target.value} : s))} className="w-full h-9 rounded cursor-pointer border border-gray-300 dark:border-brand-border" />
                </div>
                <button onClick={() => removeSection(section.id)} className="text-red-500 hover:text-red-400 p-2"><Trash2 size={18}/></button>
              </div>

              {/* Filas */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-mono text-gray-500">FILAS: {section.rows.length}</p>
                  <button onClick={() => addRow(section.id)} className="text-[10px] font-mono text-brand-blue hover:underline flex items-center gap-1"><Plus size={12}/> Añadir Fila</button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {section.rows.map((row, idx) => (
                    <div key={idx} className="flex items-center gap-2 bg-white dark:bg-[#111] p-2 rounded border border-gray-200 dark:border-[#333]">
                      <span className="font-mono text-sm font-bold text-gray-500">Fila {row.label}</span>
                      <input type="number" min="1" value={row.seats} onChange={e => updateRowSeats(section.id, idx, Number(e.target.value))} className="w-16 bg-transparent border-b border-gray-300 dark:border-gray-600 text-center text-sm text-gray-900 dark:text-white focus:outline-none" />
                      <span className="text-[10px] text-gray-400">asientos</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          ))}
        </div>
      </div>

      {/* BOTÓN DE GUARDAR */}
      <div className="fixed bottom-0 left-0 w-full md:pl-64 p-4 bg-white dark:bg-brand-dark border-t border-gray-200 dark:border-brand-border z-50">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div>
            <p className="text-xs font-mono text-gray-500">CAPACIDAD TOTAL ESTIMADA</p>
            <p className="text-xl font-bold text-brand-blue">
              {sections.reduce((acc, s) => acc + s.rows.reduce((rAcc, r) => rAcc + r.seats, 0), 0).toLocaleString()} personas
            </p>
          </div>
          <button onClick={handleSave} className="bg-brand-blue text-white px-8 py-3 rounded-lg font-bold font-mono hover:bg-blue-600 transition-colors flex items-center gap-2">
            <Save size={18} /> GUARDAR RECINTO
          </button>
        </div>
      </div>

    </div>
  );
}
