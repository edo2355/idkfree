import { X, Bell, Calendar, Ticket, DollarSign, Check } from 'lucide-react';

interface NotificationsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const mockNotifications = [
  { id: 1, type: 'sale', icon: DollarSign, color: 'text-green-500', bg: 'bg-green-500/10', title: 'Nueva venta de boleto', desc: 'Fila A, Asiento 5 vendido por $50.00', time: 'Hace 5 min' },
  { id: 2, type: 'event', icon: Calendar, color: 'text-brand-blue', bg: 'bg-brand-blue/10', title: 'Evento próximo', desc: 'Tu evento "Underground Fest" es mañana', time: 'Hace 1 hora' },
  { id: 3, type: 'kyc', icon: Check, color: 'text-purple-500', bg: 'bg-purple-500/10', title: 'KYC Aprobado', desc: 'Tu identidad ha sido verificada', time: 'Hace 2 horas' },
  { id: 4, type: 'ticket', icon: Ticket, color: 'text-orange-500', bg: 'bg-orange-500/10', title: 'Ticket escaneado', desc: 'Tu QR fue validado en la entrada', time: 'Ayer' },
];

export default function NotificationsPanel({ isOpen, onClose }: NotificationsPanelProps) {
  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-[90]" onClick={onClose}></div>
      <div className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-brand-panel border border-gray-200 dark:border-brand-border rounded-2xl shadow-2xl z-[100] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-brand-border">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white font-mono flex items-center gap-2"><Bell size={16} /> Notificaciones</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-900 dark:hover:text-white"><X size={16} /></button>
        </div>

        <div className="max-h-96 overflow-y-auto">
          {mockNotifications.map((notif) => (
            <div key={notif.id} className="p-4 border-b border-gray-100 dark:border-[#1a1a1a] hover:bg-gray-50 dark:hover:bg-[#111] transition-colors cursor-pointer">
              <div className="flex items-start gap-3">
                <div className={`w-9 h-9 rounded-lg ${notif.bg} flex items-center justify-center flex-shrink-0`}>
                  <notif.icon size={18} className={notif.color} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-gray-900 dark:text-white">{notif.title}</p>
                  <p className="text-xs text-gray-500 line-clamp-2">{notif.desc}</p>
                  <p className="text-[10px] text-gray-400 font-mono mt-1">{notif.time}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="p-3 bg-gray-50 dark:bg-[#0a0a0a] text-center">
          <button className="text-xs font-mono text-brand-blue hover:underline">Ver todas las notificaciones</button>
        </div>
      </div>
    </>
  );
}
