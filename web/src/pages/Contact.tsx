import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Mail, MessageSquare } from 'lucide-react';
import { useUIStore } from '../stores/uiStore';

export default function Contact() {
  const { showToast } = useUIStore();
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulamos el envío del formulario
    setTimeout(() => {
      setLoading(false);
      showToast('Mensaje enviado. Te contactaremos pronto.', 'success');
      (e.target as HTMLFormElement).reset();
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-brand-dark text-gray-900 dark:text-gray-300 p-6 md:p-12 transition-colors">
      <div className="max-w-xl mx-auto space-y-6">
        <Link to="/" className="inline-flex items-center gap-2 text-brand-blue hover:underline text-sm font-mono mb-4">
          <ArrowLeft size={16} /> VOLVER AL INICIO
        </Link>
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Contacto</h1>
          <p className="text-sm text-gray-500">¿Tienes dudas o necesitas soporte técnico? Escríbenos.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 bg-gray-50 dark:bg-brand-panel p-6 rounded-lg border border-gray-200 dark:border-brand-border">
          <div>
            <label className="text-xs font-mono text-gray-500 block mb-1">NOMBRE / ALIAS</label>
            <input type="text" required className="w-full bg-white dark:bg-[#000] border border-gray-300 dark:border-brand-border p-3 rounded text-gray-900 dark:text-white outline-none focus:border-brand-blue" placeholder="Tu nombre" />
          </div>
          <div>
            <label className="text-xs font-mono text-gray-500 block mb-1">CORREO ELECTRÓNICO</label>
            <input type="email" required className="w-full bg-white dark:bg-[#000] border border-gray-300 dark:border-brand-border p-3 rounded text-gray-900 dark:text-white outline-none focus:border-brand-blue" placeholder="tu@correo.com" />
          </div>
          <div>
            <label className="text-xs font-mono text-gray-500 block mb-1">MENSAJE</label>
            <textarea required rows={4} className="w-full bg-white dark:bg-[#000] border border-gray-300 dark:border-brand-border p-3 rounded text-gray-900 dark:text-white outline-none focus:border-brand-blue resize-none" placeholder="¿En qué podemos ayudarte?"></textarea>
          </div>
          <button type="submit" disabled={loading} className="w-full bg-brand-blue text-white font-bold py-3 rounded hover:bg-blue-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
            {loading ? 'ENVIANDO...' : <><MessageSquare size={18} /> ENVIAR MENSAJE</>}
          </button>
        </form>

        <div className="text-center pt-8 border-t border-gray-200 dark:border-brand-border">
          <p className="text-sm text-gray-500 mb-2">O escríbenos directamente a:</p>
          <a href="mailto:soporte@idkfreegetid.dpdns.org" className="inline-flex items-center gap-2 text-brand-blue hover:underline font-mono text-sm">
            <Mail size={16} /> soporte@idkfreegetid.dpdns.org
          </a>
        </div>
      </div>
    </div>
  );
}
