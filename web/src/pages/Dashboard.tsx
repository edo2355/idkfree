import { ArrowUpRight, ShieldCheck, Wallet, Ticket, Activity } from 'lucide-react';

export default function Dashboard() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white font-mono tracking-tight">PANEL DE CONTROL</h1>
        <p className="text-gray-500 text-sm mt-1">Resumen de operaciones y estado del sistema.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-brand-panel border border-brand-border p-6 rounded-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10"><Wallet size={64} /></div>
          <p className="text-xs font-mono text-gray-500 mb-2">BALANCE DISPONIBLE</p>
          <p className="text-3xl font-bold text-white mb-2">$0.00 <span className="text-sm text-gray-500">USD</span></p>
          <div className="flex items-center gap-2 text-xs text-brand-blue font-mono">
            <span>Conectar QvaPay</span> <ArrowUpRight size={14} />
          </div>
        </div>

        <div className="bg-brand-panel border border-brand-border p-6 rounded-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10"><ShieldCheck size={64} /></div>
          <p className="text-xs font-mono text-gray-500 mb-2">TRUST SCORE</p>
          <p className="text-3xl font-bold text-white mb-2">10 <span className="text-sm text-gray-500">/ 100</span></p>
          <div className="flex items-center gap-2 text-xs text-gray-400 font-mono">
            <span>Verificar Identidad (KYC)</span>
          </div>
        </div>

        <div className="bg-brand-panel border border-brand-border p-6 rounded-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10"><Ticket size={64} /></div>
          <p className="text-xs font-mono text-gray-500 mb-2">BOLETOS VENDIDOS</p>
          <p className="text-3xl font-bold text-white mb-2">0</p>
          <div className="flex items-center gap-2 text-xs text-gray-400 font-mono">
            <span>Crear primer evento</span>
          </div>
        </div>
      </div>

      {/* Activity */}
      <div className="border border-brand-border rounded-lg bg-brand-panel">
        <div className="p-4 border-b border-brand-border flex items-center gap-2">
          <Activity size={16} className="text-brand-blue" />
          <h2 className="text-sm font-mono text-white tracking-widest uppercase">Actividad Reciente</h2>
        </div>
        <div className="p-8 text-center text-gray-500 text-sm font-mono">
          No hay actividad reciente en el sistema.
        </div>
      </div>
    </div>
  );
}
