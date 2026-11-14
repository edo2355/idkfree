import { useState } from 'react';
import { Wallet, ShieldCheck, Key, Lock, Activity, Megaphone, ArrowUpRight, Ticket, ShoppingBag, Terminal } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { useUIStore } from '../stores/uiStore';

export default function Dashboard() {
  const { user } = useAuthStore();
  const { showToast } = useUIStore();
  const [activeTab, setActiveTab] = useState('overview');

  // Simulación de datos (en el futuro vendrán del backend)
  const trustScore = 10;
  const balance = 0.00;
  const escrowActive = 0;
  const apiKeys = 0;

  const modules = [
    { id: 'kyc', name: 'KYC Identity', status: 'Pendiente', color: 'text-yellow-500', icon: ShieldCheck, action: 'Verificar' },
    { id: 'wallet', name: 'QvaPay Wallet', status: 'Conectado', color: 'text-green-500', icon: Wallet, action: 'Gestionar' },
    { id: 'escrow', name: 'Escrow Deals', status: 'Activo', color: 'text-brand-blue', icon: Lock, action: 'Ver Contratos' },
    { id: 'api', name: 'Developer API', status: 'Sin Llaves', color: 'text-gray-500', icon: Key, action: 'Crear API Key' },
    { id: 'shop', name: 'IDK Shop', status: 'Vendedor', color: 'text-green-500', icon: ShoppingBag, action: 'Ir al Shop' },
    { id: 'ticket', name: 'Ticketera', status: 'Organizador', color: 'text-brand-blue', icon: Ticket, action: 'Crear Evento' },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-200 dark:border-brand-border pb-4 transition-colors">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white font-mono tracking-tight flex items-center gap-3">
            <Terminal size={28} className="text-brand-blue" />
            CONTROL_PANEL
          </h1>
          <p className="text-gray-500 text-sm mt-1 font-mono">Bienvenido, <span className="text-gray-900 dark:text-white">@{user?.alias || 'usuario'}</span></p>
        </div>
        <div className="flex gap-2 mt-4 md:mt-0">
          <span className="px-3 py-1 bg-green-500/10 text-green-500 border border-green-500/20 rounded text-xs font-mono flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div> SISTEMA ONLINE
          </span>
        </div>
      </div>

      {/* STATS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Wallet */}
        <div className="bg-white dark:bg-brand-panel border border-gray-200 dark:border-brand-border p-5 rounded-lg relative overflow-hidden group transition-colors">
          <div className="absolute -right-4 -top-4 text-gray-100 dark:text-white/5 group-hover:text-brand-blue/10 transition-colors"><Wallet size={100} /></div>
          <p className="text-xs font-mono text-gray-500 mb-2 relative z-10">BALANCE DISPONIBLE</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mb-2 relative z-10">${balance.toFixed(2)} <span className="text-sm text-gray-500">USD</span></p>
          <button onClick={() => showToast('Generando factura en QvaPay...', 'info')} className="text-xs text-brand-blue font-mono flex items-center gap-1 hover:underline relative z-10">Recargar Saldo <ArrowUpRight size={12} /></button>
        </div>

        {/* Trust Score */}
        <div className="bg-white dark:bg-brand-panel border border-gray-200 dark:border-brand-border p-5 rounded-lg relative overflow-hidden group transition-colors">
          <div className="absolute -right-4 -top-4 text-gray-100 dark:text-white/5 group-hover:text-brand-blue/10 transition-colors"><ShieldCheck size={100} /></div>
          <p className="text-xs font-mono text-gray-500 mb-2 relative z-10">TRUST SCORE</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mb-2 relative z-10">{trustScore} <span className="text-sm text-gray-500">/ 100</span></p>
          <button onClick={() => showToast('Iniciando proceso KYC...', 'info')} className="text-xs text-brand-blue font-mono flex items-center gap-1 hover:underline relative z-10">Aumentar Score <ArrowUpRight size={12} /></button>
        </div>

        {/* Escrow */}
        <div className="bg-white dark:bg-brand-panel border border-gray-200 dark:border-brand-border p-5 rounded-lg relative overflow-hidden group transition-colors">
          <div className="absolute -right-4 -top-4 text-gray-100 dark:text-white/5 group-hover:text-brand-blue/10 transition-colors"><Lock size={100} /></div>
          <p className="text-xs font-mono text-gray-500 mb-2 relative z-10">CONTRATOS EN GARANTÍA</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mb-2 relative z-10">{escrowActive}</p>
          <button onClick={() => showToast('Cargando contratos Escrow...', 'info')} className="text-xs text-brand-blue font-mono flex items-center gap-1 hover:underline relative z-10">Ver Contratos <ArrowUpRight size={12} /></button>
        </div>

        {/* API Keys */}
        <div className="bg-white dark:bg-brand-panel border border-gray-200 dark:border-brand-border p-5 rounded-lg relative overflow-hidden group transition-colors">
          <div className="absolute -right-4 -top-4 text-gray-100 dark:text-white/5 group-hover:text-brand-blue/10 transition-colors"><Key size={100} /></div>
          <p className="text-xs font-mono text-gray-500 mb-2 relative z-10">API KEYS B2B</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mb-2 relative z-10">{apiKeys}</p>
          <button onClick={() => showToast('Generando nueva API Key...', 'info')} className="text-xs text-brand-blue font-mono flex items-center gap-1 hover:underline relative z-10">Crear Llave <ArrowUpRight size={12} /></button>
        </div>
      </div>

      {/* MODULES SECTION */}
      <div className="bg-white dark:bg-brand-panel border border-gray-200 dark:border-brand-border rounded-lg transition-colors">
        <div className="p-4 border-b border-gray-200 dark:border-brand-border flex items-center justify-between">
          <h2 className="text-sm font-mono text-gray-900 dark:text-white tracking-widest uppercase flex items-center gap-2"><Activity size={16} className="text-brand-blue" /> Estado de los Módulos</h2>
        </div>
        <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {modules.map((mod) => (
            <div key={mod.id} className="border border-gray-200 dark:border-brand-border rounded-lg p-4 flex items-center justify-between hover:border-brand-blue/50 transition-colors bg-gray-50 dark:bg-[#050505]">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-white dark:bg-brand-dark border border-gray-200 dark:border-brand-border rounded shadow-sm">
                  <mod.icon size={20} className={mod.color} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white">{mod.name}</h3>
                  <p className={`text-[10px] font-mono ${mod.color}`}>{mod.status}</p>
                </div>
              </div>
              <button onClick={() => showToast(`Abriendo módulo: ${mod.name}`, 'success')} className="text-xs font-mono text-brand-blue hover:text-blue-400 border border-brand-blue/20 px-3 py-1.5 rounded hover:bg-brand-blue/5 transition-colors">
                {mod.action}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* RECENT ACTIVITY */}
      <div className="bg-white dark:bg-brand-panel border border-gray-200 dark:border-brand-border rounded-lg transition-colors">
        <div className="p-4 border-b border-gray-200 dark:border-brand-border flex items-center gap-2">
          <Megaphone size={16} className="text-brand-blue" />
          <h2 className="text-sm font-mono text-gray-900 dark:text-white tracking-widest uppercase">Actividad Reciente</h2>
        </div>
        <div className="p-8 text-center text-gray-500 text-sm font-mono">
          No hay transacciones recientes en el sistema.
        </div>
      </div>
    </div>
  );
}
