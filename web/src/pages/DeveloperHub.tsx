import { useState } from 'react';
import { Code, Key, Terminal, Shield, Lock, Wallet, Ticket, Copy, CheckCircle2, ChevronRight } from 'lucide-react';
import { useUIStore } from '../stores/uiStore';

export default function DeveloperHub() {
  const { showToast } = useUIStore();
  const [activeTab, setActiveTab] = useState('keys');
  const [apiKey, setApiKey] = useState('idk_live_9bae6960b10141dc970c0e40fe9486e5');

  const apis = [
    { name: 'KYC Omni', endpoint: '/api/kyc/start', method: 'POST', desc: 'Inicia verificación de identidad global.', icon: Shield },
    { name: 'Trust Score', endpoint: '/api/user/trust', method: 'GET', desc: 'Consulta la reputación de un creador.', icon: CheckCircle2 },
    { name: 'Crear Factura', endpoint: '/api/qvapay/create-invoice', method: 'POST', desc: 'Genera un link de pago con QvaPay.', icon: Wallet },
    { name: 'Escrow Deal', endpoint: '/api/escrow/create', method: 'POST', desc: 'Retiene fondos en garantía.', icon: Lock },
    { name: 'Crear Evento', endpoint: '/api/ticketing/events', method: 'POST', desc: 'Crea un evento y sus asientos.', icon: Ticket },
  ];

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    showToast('Copiado al portapapeles', 'success');
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="border-b border-gray-200 dark:border-brand-border pb-4 transition-colors">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white font-mono tracking-tight flex items-center gap-3">
          <Code size={28} className="text-brand-blue" />
          DEVELOPER_HUB
        </h1>
        <p className="text-gray-500 text-sm mt-1 font-mono">Integra el poder de IDKfree en tus propias aplicaciones.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Sidebar de Navegación */}
        <div className="space-y-2">
          <button onClick={() => setActiveTab('keys')} className={`w-full flex items-center justify-between p-3 rounded-lg border transition-colors ${activeTab === 'keys' ? 'bg-brand-blue/10 border-brand-blue/30 text-brand-blue' : 'border-transparent text-gray-500 hover:bg-gray-100 dark:hover:bg-brand-panel'}`}>
            <span className="flex items-center gap-3 font-mono text-sm font-bold"><Key size={18} /> API KEYS</span>
            <ChevronRight size={16} />
          </button>
          <button onClick={() => setActiveTab('endpoints')} className={`w-full flex items-center justify-between p-3 rounded-lg border transition-colors ${activeTab === 'endpoints' ? 'bg-brand-blue/10 border-brand-blue/30 text-brand-blue' : 'border-transparent text-gray-500 hover:bg-gray-100 dark:hover:bg-brand-panel'}`}>
            <span className="flex items-center gap-3 font-mono text-sm font-bold"><Terminal size={18} /> ENDPOINTS</span>
            <ChevronRight size={16} />
          </button>
        </div>

        {/* Contenido Principal */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Pestaña: API KEYS */}
          {activeTab === 'keys' && (
            <div className="bg-white dark:bg-brand-panel border border-gray-200 dark:border-brand-border rounded-lg p-6 transition-colors">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">Tus Credenciales</h2>
                  <p className="text-xs text-gray-500 font-mono">Usa esta llave para autenticar tus peticiones.</p>
                </div>
                <button onClick={() => showToast('Generando nueva llave...', 'info')} className="bg-brand-blue text-white text-xs font-bold px-4 py-2 rounded hover:bg-blue-600 transition-colors">GENERAR NUEVA</button>
              </div>

              <div className="space-y-4">
                <div className="bg-gray-50 dark:bg-[#000] border border-gray-200 dark:border-brand-border rounded p-4 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] text-gray-500 font-mono mb-1 uppercase tracking-wider">Live API Key</p>
                    <p className="font-mono text-sm text-gray-900 dark:text-gray-300">{apiKey}</p>
                  </div>
                  <button onClick={() => handleCopy(apiKey)} className="text-gray-400 hover:text-brand-blue transition-colors"><Copy size={18} /></button>
                </div>
                
                <div className="bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-900/30 rounded p-4">
                  <p className="text-xs text-yellow-800 dark:text-yellow-500 font-mono">
                    ⚠️ <strong>Advertencia:</strong> No compartas esta llave en el frontend (React, HTML). Úsala solo en tu backend (Node.js, Python, PHP).
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Pestaña: ENDPOINTS */}
          {activeTab === 'endpoints' && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Catálogo de APIs</h2>
              
              {apis.map((api, i) => (
                <div key={i} className="bg-white dark:bg-brand-panel border border-gray-200 dark:border-brand-border rounded-lg p-4 transition-colors hover:border-brand-blue/50 group">
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-gray-100 dark:bg-[#000] border border-gray-200 dark:border-brand-border rounded">
                      <api.icon size={20} className="text-brand-blue" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-gray-900 dark:text-white font-bold text-sm">{api.name}</h3>
                        <span className="text-[10px] font-mono bg-green-500/10 text-green-500 px-2 py-0.5 rounded border border-green-500/20">{api.method}</span>
                      </div>
                      <p className="text-xs text-gray-500 mb-3">{api.desc}</p>
                      <div className="flex items-center justify-between bg-gray-50 dark:bg-[#000] border border-gray-200 dark:border-brand-border rounded p-2">
                        <code className="text-xs font-mono text-gray-700 dark:text-gray-300">https://idkfree.onrender.com{api.endpoint}</code>
                        <button onClick={() => handleCopy(`https://idkfree.onrender.com${api.endpoint}`)} className="text-gray-400 hover:text-white"><Copy size={14} /></button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
