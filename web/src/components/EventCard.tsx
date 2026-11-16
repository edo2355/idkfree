import { Calendar, MapPin, ArrowRight } from 'lucide-react';

interface EventCardProps {
  id: string;
  name: string;
  date: string;
  venueName: string;
  venueShape: string;
  imageUrl?: string | null;
  onClick: () => void;
  textTheme?: 'light' | 'dark'; // Opción para que el organizador elija
}

export default function EventCard({ name, date, venueName, imageUrl, onClick, textTheme = 'light' }: EventCardProps) {
  // Imagen por defecto de alta calidad (concierto)
  const defaultImage = 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1000&auto=format&fit=crop';

  // Clases dinámicas según el tema
  const textColorClass = textTheme === 'light' ? 'text-white' : 'text-gray-900';
  const subTextColorClass = textTheme === 'light' ? 'text-gray-300' : 'text-gray-600';
  const iconColorClass = textTheme === 'light' ? 'text-brand-blue' : 'text-blue-600';
  const borderColorClass = textTheme === 'light' ? 'border-white/20' : 'border-black/10';
  const gradientClass = textTheme === 'light' 
    ? 'from-black via-black/80 to-transparent' 
    : 'from-white via-white/80 to-transparent';

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

      {/* Degradado de Contraste (Se adapta al tema) */}
      <div className={`absolute inset-0 bg-gradient-to-t ${gradientClass} opacity-90 transition-colors duration-300`}></div>

      {/* Etiqueta Superior */}
      <div className="absolute top-4 left-4 z-10">
        <span className="bg-brand-blue text-white text-[10px] font-bold font-mono px-3 py-1 rounded-full uppercase tracking-wider shadow-lg">
          Evento Oficial
        </span>
      </div>

      {/* Contenido Inferior con Sombra de Texto */}
      <div className={`absolute bottom-0 w-full p-5 z-10 flex flex-col justify-end`}>
        
        {/* El texto tiene drop-shadow para que resalte incluso si el fondo es claro */}
        <h2 className={`text-2xl md:text-3xl font-black leading-tight mb-2 line-clamp-2 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] ${textColorClass}`}>
          {name}
        </h2>
        
        <div className={`flex flex-col gap-1 font-mono text-xs mb-4 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] ${subTextColorClass}`}>
          <div className="flex items-center gap-2">
            <Calendar size={14} className={iconColorClass} />
            <span>{new Date(date).toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin size={14} className={iconColorClass} />
            <span className="truncate">{venueName || 'Recinto por definir'}</span>
          </div>
        </div>

        {/* Footer de la Tarjeta (El cristal aquí ayuda a que siempre se vea bien) */}
        <div className={`flex items-center justify-between border-t pt-3 mt-1 backdrop-blur-sm ${borderColorClass}`}>
          <span className={`text-xs font-bold font-mono tracking-widest ${textColorClass}`}>OBTENER ENTRADAS</span>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${textTheme === 'light' ? 'bg-white text-black group-hover:bg-brand-blue group-hover:text-white' : 'bg-black text-white group-hover:bg-brand-blue'}`}>
            <ArrowRight size={16} />
          </div>
        </div>
      </div>
    </div>
  );
}
