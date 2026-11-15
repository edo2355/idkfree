import { useState, useEffect } from 'react';
import { Calendar, MapPin, Info } from 'lucide-react';

interface TicketCardProps {
  eventName: string;
  eventDate: string;
  venueName: string;
  section: string;
  row: string;
  seat: string;
  imageUrl?: string;
}

export default function TicketCard({ 
  eventName, 
  eventDate, 
  venueName, 
  section, 
  row, 
  seat, 
  imageUrl = 'https://images.unsplash.com/photo-1540039155732-684736882301?q=80&w=1000&auto=format&fit=crop'
}: TicketCardProps) {
  
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, mins: 0, secs: 0 });

  useEffect(() => {
    const targetDate = new Date(eventDate).getTime();
    
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance < 0) {
        clearInterval(interval);
        setTimeLeft({ days: 0, hours: 0, mins: 0, secs: 0 });
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        mins: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        secs: Math.floor((distance % (1000 * 60)) / 1000)
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [eventDate]);

  return (
    <div className="w-full max-w-sm mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-500">
      
      {/* HEADER AZUL (Sección, Fila, Asiento) */}
      <div className="bg-blue-600 text-white p-4 text-center relative">
        <button className="absolute top-4 right-4 text-white/70 hover:text-white">
          <Info size={20} />
        </button>
        <h3 className="text-sm font-medium mb-3 opacity-90">Reserved Seating</h3>
        <div className="flex justify-between px-4">
          <div>
            <p className="text-xs text-blue-200 uppercase font-bold tracking-wider mb-1">SEC</p>
            <p className="text-xl font-bold">{section}</p>
          </div>
          <div>
            <p className="text-xs text-blue-200 uppercase font-bold tracking-wider mb-1">ROW</p>
            <p className="text-xl font-bold">{row}</p>
          </div>
          <div>
            <p className="text-xs text-blue-200 uppercase font-bold tracking-wider mb-1">SEAT</p>
            <p className="text-xl font-bold">{seat}</p>
          </div>
        </div>
      </div>

      {/* IMAGEN DEL EVENTO */}
      <div className="relative h-48 bg-gray-900">
        <img src={imageUrl} alt="Event" className="w-full h-full object-cover opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-4 text-white">
          <h2 className="text-xl font-bold leading-tight mb-1">{eventName}</h2>
          <div className="flex items-center gap-2 text-xs text-gray-300">
            <Calendar size={12} />
            <span>{new Date(eventDate).toLocaleString('es-ES', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-300 mt-1">
            <MapPin size={12} />
            <span>{venueName}</span>
          </div>
        </div>
      </div>

      {/* TEMPORIZADOR Y CÓDIGO DE BARRAS */}
      <div className="p-6 text-center bg-white">
        <p className="text-sm font-semibold text-gray-600 mb-4">Barcode will display in:</p>
        
        <div className="flex justify-center gap-4 mb-6">
          <div className="flex flex-col items-center">
            <span className="text-3xl font-black text-black">{String(timeLeft.days).padStart(2, '0')}</span>
            <span className="text-[10px] font-bold text-gray-500 uppercase border border-gray-300 px-1 mt-1 rounded-sm">Day</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-3xl font-black text-black">{String(timeLeft.hours).padStart(2, '0')}</span>
            <span className="text-[10px] font-bold text-gray-500 uppercase border border-gray-300 px-1 mt-1 rounded-sm">Hour</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-3xl font-black text-black">{String(timeLeft.mins).padStart(2, '0')}</span>
            <span className="text-[10px] font-bold text-gray-500 uppercase border border-gray-300 px-1 mt-1 rounded-sm">Min</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-3xl font-black text-black">{String(timeLeft.secs).padStart(2, '0')}</span>
            <span className="text-[10px] font-bold text-gray-500 uppercase border border-gray-300 px-1 mt-1 rounded-sm">Seconds</span>
          </div>
        </div>

        <button className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-black font-bold rounded-lg transition-colors border border-gray-200">
          Ticket Details
        </button>
      </div>
    </div>
  );
}
