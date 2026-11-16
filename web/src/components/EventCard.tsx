import { Calendar, MapPin, ArrowRight } from 'lucide-react';

interface EventCardProps {
  id: string;
  name: string;
  date: string;
  venueName: string;
  venueShape: string;
  imageUrl?: string | null;
  onClick: () => void;
}

export default function EventCard({ name, date, venueName, imageUrl, onClick }: EventCardProps) {
  // Usamos una imagen de alta calidad por defecto si no hay póster
  const defaultImage = 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1000&auto=format&fit=crop';

  return (
    <div 
      onClick={onClick}
      className="relative w-full aspect-[4/5] md:aspect-square rounded-2xl overflow-hidden cursor-pointer group shadow-lg hover:shadow-2xl transition-all duration-300"
    >
      {/* Imagen de Fondo */}
      <img 
        src={imageUrl ? `https://idkfree.onrender.com${imageUrl}` : defaultImage} 
        alt={name} 
        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" 
      />

      {/* Degradado Oscuro (Estilo Spotify) */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent opacity-90"></div>

      {/* Contenido Superior (Badge) */}
      <div className="absolute top-4 left-4 z-10">
        <span className="bg-brand-blue text-white text-[10px] font-bold font-mono px-3 py-1 rounded-full uppercase tracking-wider shadow-lg">
          Evento Oficial
        </span>
      </div>

      {/* Contenido Inferior (Textos) */}
      <div className="absolute bottom-0 w-full p-6 z-10 flex flex-col justify-end">
        <h2 className="text-2xl md:text-3xl font-black text-white leading-tight mb-2 line-clamp-2 drop-shadow-md">
          {name}
        </h2>
        
        <div className="flex flex-col gap-1 text-gray-300 font-mono text-xs mb-4">
          <div className="flex items-center gap-2">
            <Calendar size={14} className="text-brand-blue" />
            <span>{new Date(date).toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin size={14} className="text-brand-blue" />
            <span className="truncate">{venueName || 'Recinto por definir'}</span>
          </div>
        </div>

        {/* Botón de Acción */}
        <div className="flex items-center justify-between border-t border-white/20 pt-3 mt-2">
          <span className="text-white text-xs font-bold font-mono tracking-widest">OBTENER ENTRADAS</span>
          <div className="w-8 h-8 bg-white text-black rounded-full flex items-center justify-center group-hover:bg-brand-blue group-hover:text-white transition-colors">
            <ArrowRight size={16} />
          </div>
        </div>
      </div>
    </div>
  );
}
