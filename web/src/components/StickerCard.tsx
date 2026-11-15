import { Play, ExternalLink, Music, Calendar } from 'lucide-react';

interface StickerCardProps {
  type: 'music' | 'event' | 'ad';
  title: string;
  subtitle: string;
  imageUrl?: string;
  link?: string;
}

export default function StickerCard({ type, title, subtitle, imageUrl, link = '#' }: StickerCardProps) {
  
  // Colores según el tipo de sticker
  const getBrandColor = () => {
    if (type === 'music') return 'bg-green-500'; // Spotify Green
    if (type === 'event') return 'bg-brand-blue'; // IDKMEDIA Blue
    return 'bg-orange-500'; // Ads
  };

  const getIcon = () => {
    if (type === 'music') return <Music size={16} />;
    if (type === 'event') return <Calendar size={16} />;
    return <ExternalLink size={16} />;
  };

  return (
    <a 
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className="block w-full max-w-sm mt-4 bg-[#121212] border border-gray-800 rounded-xl overflow-hidden hover:bg-[#181818] transition-colors group"
    >
      <div className="flex items-center p-3 gap-4">
        {/* Carátula / Imagen */}
        <div className="relative w-16 h-16 bg-gray-800 rounded-md overflow-hidden flex-shrink-0">
          {imageUrl ? (
            <img src={imageUrl} alt={title} className="w-full h-full object-cover" />
          ) : (
            <div className={`w-full h-full flex items-center justify-center ${getBrandColor()} bg-opacity-20 text-white`}>
              {getIcon()}
            </div>
          )}
          {/* Icono de Play flotante */}
          <div className={`absolute inset-0 flex items-center justify-center ${getBrandColor()} opacity-0 group-hover:opacity-100 transition-opacity`}>
            <Play size={24} className="text-white ml-1" fill="currentColor" />
          </div>
        </div>

        {/* Textos */}
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">
            {type === 'music' ? 'Escuchar en IDKMusic' : type === 'event' ? 'Ver Evento' : 'Patrocinado'}
          </p>
          <h3 className="text-white font-bold text-sm truncate">{title}</h3>
          <p className="text-gray-400 text-xs truncate">{subtitle}</p>
        </div>
        
        {/* Icono externo */}
        <ExternalLink size={16} className="text-gray-500 group-hover:text-white transition-colors" />
      </div>
      
      {/* Barra de progreso falsa (solo estética) */}
      {type === 'music' && (
        <div className="px-3 pb-3">
          <div className="w-full h-1 bg-gray-800 rounded-full overflow-hidden">
            <div className={`h-full w-1/3 ${getBrandColor()}`}></div>
          </div>
        </div>
      )}
    </a>
  );
}
