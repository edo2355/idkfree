import { Calendar, MapPin, ArrowRight, Music, Trophy, Theater, Mic2, Briefcase, PartyPopper } from 'lucide-react';

interface EventCardProps {
  id: string;
  name: string;
  date: string;
  venueName: string;
  venueShape: string;
  imageUrl?: string | null;
  onClick: () => void;
  textTheme?: 'light' | 'dark';
  category?: string;
}

const categoryConfig: Record<string, { icon: any, color: string, label: string }> = {
  musical: { icon: Music, color: 'bg-pink-500', label: 'Música' },
  deportivo: { icon: Trophy, color: 'bg-green-500', label: 'Deportes' },
  teatro: { icon: Theater, color: 'bg-purple-500', label: 'Teatro' },
  conferencia: { icon: Mic2, color: 'bg-orange-500', label: 'Conferencia' },
  corporativo: { icon: Briefcase, color: 'bg-gray-600', label: 'Corporativo' },
  fiesta: { icon: PartyPopper, color: 'bg-yellow-500', label: 'Fiesta' },
  general: { icon: Calendar, color: 'bg-brand-blue', label: 'Evento' },
};

export default function EventCard({ name, date, venueName, imageUrl, onClick, textTheme = 'light', category = 'general' }: EventCardProps) {
  const defaultImage = 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1000&auto=format&fit=crop';

  const textColorClass = textTheme === 'light' ? 'text-white' : 'text-gray-900';
  const subTextColorClass = textTheme === 'light' ? 'text-gray-200' : 'text-gray-700';
  const iconColorClass = textTheme === 'light' ? 'text-brand-blue' : 'text-blue-700';
  const borderColorClass = textTheme === 'light' ? 'border-white/30' : 'border-black/20';
  const gradientClass = textTheme === 'light' 
    ? 'from-black via-black/80 to-transparent' 
    : 'from-white via-white/90 to-transparent';

  const catInfo = categoryConfig[category] || categoryConfig.general;
  const CatIcon = catInfo.icon;

  return (
    <div 
      onClick={onClick}
      className="relative w-full aspect-[4/5] md:aspect-square rounded-2xl overflow-hidden cursor-pointer group shadow-lg hover:shadow-2xl transition-all duration-300"
    >
      <img 
        src={imageUrl ? `https://idkfree.onrender.com${imageUrl}` : defaultImage} 
        alt={name} 
        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" 
      />

      <div className={`absolute inset-0 bg-gradient-to-t ${gradientClass} opacity-90 transition-colors duration-300`}></div>

      {/* Badge de Categoría */}
      <div className="absolute top-4 left-4 z-10 flex items-center gap-1.5">
        <span className={`${catInfo.color} text-white text-[10px] font-bold font-mono px-3 py-1.5 rounded-full uppercase tracking-wider shadow-lg flex items-center gap-1`}>
          <CatIcon size={12} />
          {catInfo.label}
        </span>
      </div>

      <div className={`absolute bottom-0 w-full p-5 z-10 flex flex-col justify-end`}>
        <h2 className={`text-2xl md:text-3xl font-black leading-tight mb-2 line-clamp-2 drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)] ${textColorClass}`}>
          {name}
        </h2>
        
        <div className={`flex flex-col gap-1 font-mono text-xs mb-4 drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)] ${subTextColorClass}`}>
          <div className="flex items-center gap-2">
            <Calendar size={14} className={iconColorClass} />
            <span>{new Date(date).toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin size={14} className={iconColorClass} />
            <span className="truncate">{venueName || 'Recinto por definir'}</span>
          </div>
        </div>

        <div className={`flex items-center justify-between border-t pt-3 mt-1 backdrop-blur-sm ${borderColorClass}`}>
          <span className={`text-xs font-bold font-mono tracking-widest ${textColorClass}`}>VER ENTRADAS</span>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${textTheme === 'light' ? 'bg-white text-black group-hover:bg-brand-blue group-hover:text-white' : 'bg-black text-white group-hover:bg-brand-blue'}`}>
            <ArrowRight size={16} />
          </div>
        </div>
      </div>
    </div>
  );
}
