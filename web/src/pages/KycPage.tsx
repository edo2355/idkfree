import { ShieldCheck, Upload, Fingerprint } from 'lucide-react';

export default function KycPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold text-white font-mono tracking-tight">VERIFICACIÓN DE IDENTIDAD</h1>
        <p className="text-gray-500 text-sm mt-1">Sube tu identidad para aumentar tu Trust Score y habilitar pagos.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border border-brand-border bg-brand-panel p-8 rounded-lg text-center flex flex-col items-center justify-center">
          <ShieldCheck size={48} className="text-brand-blue mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Nivel de Confianza</h2>
          <p className="text-4xl font-mono text-brand-blue mb-4">10/100</p>
          <p className="text-xs text-gray-500 mb-6">Completa el KYC para sumar +30 puntos.</p>
          <button className="bg-brand-blue text-white font-mono text-xs px-6 py-3 hover:bg-blue-600 transition-colors w-full">
            INICIAR PROCESO KYC
          </button>
        </div>

        <div className="space-y-4">
          <div className="border border-brand-border bg-brand-panel p-6 rounded-lg flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-brand-border rounded flex items-center justify-center"><Fingerprint size={20} className="text-gray-400" /></div>
              <div>
                <h3 className="text-white font-bold text-sm">Documento de Identidad</h3>
                <p className="text-xs text-gray-500">Sube tu pasaporte o cédula.</p>
              </div>
            </div>
            <button className="text-brand-blue hover:text-white"><Upload size={18} /></button>
          </div>
          <div className="border border-brand-border bg-brand-panel p-6 rounded-lg flex items-center justify-between opacity-50">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-brand-border rounded flex items-center justify-center"><ShieldCheck size={20} className="text-gray-400" /></div>
              <div>
                <h3 className="text-white font-bold text-sm">Telegram Passport</h3>
                <p className="text-xs text-gray-500">Verificación alternativa.</p>
              </div>
            </div>
            <button className="text-brand-blue hover:text-white">CONECTAR</button>
          </div>
        </div>
      </div>
    </div>
  );
}
