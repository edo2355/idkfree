import { useState } from 'react';
import { Plus, MapPin, Users, ArrowRight } from 'lucide-react';
import SeatMap from '../components/SeatMap';

export default function Ticketera() {
  const [view, setView] = useState<'dashboard' | 'create-venue' | 'buy-ticket'>('dashboard');

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header Dinámico */}
      <div className="flex justify-between items-center border-b border-gray-800 pb-4">
        <div>
          <h1 className="text-3xl font-bold text-white font-mono">
            {view === 'dashboard' && 'TICKETERA_PRO'}
            {view === 'create-venue' && 'CREAR NUEVO RECINTO'}
            {view === 'buy-ticket' && 'SELECCIÓN DE ASIENTOS'}
          </h1>
          <p className="text-gray-500 font-mono text-xs mt-1">SISTEMA DE GESTIÓN DE EVENTOS Y AFORO</p>
        </div>
        {view !== 'dashboard' && (
          <button onClick={() => setView('dashboard')} className="text-xs font-mono text-brand-blue hover:text-white transition-colors">
            &lt; VOLVER AL PANEL
          </button>
        )}
      </div>

      {/* VISTA 1: DASHBOARD (Lista de Eventos) */}
      {view === 'dashboard' && (
        <div className="space-y-4">
          <button 
            onClick={() => setView('create-venue')}
            className="w-full border border-dashed border-gray-700 p-6 flex flex-col items-center justify-center gap-2 hover:border-brand-blue hover:bg-brand-blue/5 transition-all text-gray-400 hover:text-brand-blue"
          >
            <Plus size={24} />
            <span className="font-mono text-sm">CREAR NUEVO VENUE / EVENTO</span>
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border border-gray-800 bg-[#0a0a0a] p-6 flex flex-col justify-between hover:border-gray-600 transition-colors">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-white">Concierto Underground</h3>
                  <span className="text-[10px] font-mono bg-green-500/10 text-green-500 border border-green-500/20 px-2 py-1">ACTIVO</span>
                </div>
                <div className="space-y-2 text-sm text-gray-400 font-mono mb-6">
                  <p className="flex items-center gap-2"><MapPin size={14} /> La Habana, Cuba</p>
                  <p className="flex items-center gap-2"><Users size={14} /> 450 / 500 Boletos vendidos</p>
                </div>
              </div>
              <button onClick={() => setView('buy-ticket')} className="w-full py-2 bg-white text-black font-bold font-mono text-xs hover:bg-cyan-500 transition-colors flex items-center justify-center gap-2">
                VER MAPA DE ASIENTOS <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VISTA 2: CREAR VENUE (Simulación) */}
      {view === 'create-venue' && (
        <div className="max-w-xl space-y-6">
          <div className="space-y-4">
            <div>
              <label className="text-xs font-mono text-gray-500 block mb-1">NOMBRE DEL RECINTO</label>
              <input type="text" className="w-full bg-[#0a0a0a] border border-gray-800 p-3 text-white focus:outline-none focus:border-brand-blue transition-colors" placeholder="Ej. Estadio Monumental" />
            </div>
            <div>
              <label className="text-xs font-mono text-gray-500 block mb-1">UBICACIÓN</label>
              <input type="text" className="w-full bg-[#0a0a0a] border border-gray-800 p-3 text-white focus:outline-none focus:border-brand-blue transition-colors" placeholder="Ej. Santiago de Cuba" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-mono text-gray-500 block mb-1">FILAS</label>
                <input type="number" className="w-full bg-[#0a0a0a] border border-gray-800 p-3 text-white focus:outline-none focus:border-brand-blue" defaultValue={5} />
              </div>
              <div>
                <label className="text-xs font-mono text-gray-500 block mb-1">ASIENTOS POR FILA</label>
                <input type="number" className="w-full bg-[#0a0a0a] border border-gray-800 p-3 text-white focus:outline-none focus:border-brand-blue" defaultValue={10} />
              </div>
            </div>
            <button className="w-full py-3 bg-brand-blue text-black font-bold font-mono text-sm hover:bg-brand-blue transition-colors">
              GUARDAR RECINTO EN TURSO
            </button>
          </div>
        </div>
      )}

      {/* VISTA 3: COMPRAR BOLETO (Mapa Visual) */}
      {view === 'buy-ticket' && (
        <div className="max-w-3xl mx-auto">
          <SeatMap />
          <div className="mt-6 flex justify-between items-center p-4 bg-[#0a0a0a] border border-gray-800">
            <div>
              <p className="text-xs font-mono text-gray-500">TOTAL A PAGAR</p>
              <p className="text-2xl font-bold text-white">$25.00 USD</p>
            </div>
            <button className="bg-cyan-600 hover:bg-cyan-500 text-black font-bold font-mono px-8 py-3 text-sm transition-colors">
              PAGAR CON QVAPAY
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
