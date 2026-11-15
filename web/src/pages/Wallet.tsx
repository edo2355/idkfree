import { useState } from 'react';
import TicketCard from '../components/TicketCard';
import { Wallet as WalletIcon } from 'lucide-react';

export default function Wallet() {
  // Simulamos un ticket que viene de la base de datos
  const [tickets] = useState([
    {
      id: 'tkt-123',
      eventName: 'IDKMEDIA Underground Fest 2026',
      eventDate: '2026-12-15T20:30:00.000Z', // Fecha futura
      venueName: 'Coliseo de la Ciudad Deportiva, La Habana',
      section: 'VIP',
      row: 'C',
      seat: '5'
    }
  ]);

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      
      <div className="flex items-center gap-3 border-b border-gray-200 dark:border-brand-border pb-4">
        <WalletIcon size={28} className="text-brand-blue" />
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white font-mono tracking-tight">MI WALLET</h1>
          <p className="text-gray-500 text-sm">Tus boletos digitales para eventos.</p>
        </div>
      </div>

      {/* Contenedor con scroll horizontal (deslizable) */}
      <div className="flex gap-6 overflow-x-auto pb-8 snap-x snap-mandatory hide-scrollbar">
        {tickets.map(ticket => (
          <div key={ticket.id} className="snap-center shrink-0">
            <TicketCard 
              eventName={ticket.eventName}
              eventDate={ticket.eventDate}
              venueName={ticket.venueName}
              section={ticket.section}
              row={ticket.row}
              seat={ticket.seat}
            />
          </div>
        ))}
      </div>

      {/* Estilos para ocultar la barra de scroll en CSS */}
      <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}
