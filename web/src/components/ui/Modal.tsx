import { useModal } from '../../contexts/ModalContext';
import { X, CheckCircle2, AlertTriangle, Info, AlertOctagon } from 'lucide-react';

export default function Modal() {
  const { modal, closeModal } = useModal();
  if (!modal) return null;

  const variantConfig = {
    info: { icon: Info, color: 'text-blue-500', bg: 'bg-blue-500/10', border: 'border-blue-500/30' },
    success: { icon: CheckCircle2, color: 'text-green-500', bg: 'bg-green-500/10', border: 'border-green-500/30' },
    warning: { icon: AlertTriangle, color: 'text-yellow-500', bg: 'bg-yellow-500/10', border: 'border-yellow-500/30' },
    danger: { icon: AlertOctagon, color: 'text-red-500', bg: 'bg-red-500/10', border: 'border-red-500/30' },
  };

  const config = variantConfig[modal.variant || 'info'];
  const IconComponent = config.icon;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={closeModal}></div>
      
      <div className="relative w-full max-w-md bg-white dark:bg-brand-panel border border-gray-200 dark:border-brand-border rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
        <button onClick={closeModal} className="absolute top-4 right-4 text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors z-10">
          <X size={20} />
        </button>

        <div className="p-6">
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 ${config.bg} ${config.border} border-2`}>
            <IconComponent size={28} className={config.color} />
          </div>

          <h2 className="text-xl font-bold text-gray-900 dark:text-white font-mono mb-2">{modal.title}</h2>
          <div className="text-sm text-gray-600 dark:text-gray-400">{modal.content}</div>
        </div>

        <div className="px-6 pb-6 flex gap-2">
          {modal.onConfirm && (
            <button onClick={closeModal} className="flex-1 py-3 rounded-lg border border-gray-300 dark:border-brand-border text-gray-700 dark:text-gray-300 font-mono text-sm hover:bg-gray-50 dark:hover:bg-[#111] transition-colors">
              {modal.cancelText || 'Cancelar'}
            </button>
          )}
          <button 
            onClick={() => { if (modal.onConfirm) modal.onConfirm(); closeModal(); }} 
            className={`flex-1 py-3 rounded-lg font-bold font-mono text-sm text-white transition-colors ${
              modal.variant === 'danger' ? 'bg-red-600 hover:bg-red-700' :
              modal.variant === 'success' ? 'bg-green-600 hover:bg-green-700' :
              'bg-brand-blue hover:bg-blue-600'
            }`}
          >
            {modal.confirmText || (modal.onConfirm ? 'Confirmar' : 'Entendido')}
          </button>
        </div>
      </div>
    </div>
  );
}
