import { useState } from 'react';
import { Play, ExternalLink } from 'lucide-react';

interface SocialEmbedProps {
  url: string;
}

export default function SocialEmbed({ url }: SocialEmbedProps) {
  if (!url) return null;

  // Detectar YouTube (youtube.com/watch?v= o youtu.be/)
  const ytMatch = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i);
  if (ytMatch && ytMatch[1]) {
    return (
      <div className="aspect-video w-full rounded-lg overflow-hidden border border-gray-200 dark:border-brand-border bg-black">
        <iframe
          width="100%"
          height="100%"
          src={`https://www.youtube.com/embed/${ytMatch[1]}?autoplay=0`}
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
    );
  }

  // Detectar Twitch (twitch.tv/nombre_del_canal)
  const twitchMatch = url.match(/twitch\.tv\/([a-zA-Z0-9_]+)/i);
  if (twitchMatch && twitchMatch[1]) {
    const channel = twitchMatch[1];
    return (
      <div className="aspect-video w-full rounded-lg overflow-hidden border border-gray-200 dark:border-brand-border bg-black">
        <iframe
          src={`https://player.twitch.tv/?channel=${channel}&parent=idkfreegetid.dpdns.org&parent=idkfree-1.onrender.com&parent=localhost`}
          height="100%"
          width="100%"
          allowFullScreen
        ></iframe>
      </div>
    );
  }

  // Si es otra red (Instagram, TikTok, X), mostramos un botón elegante
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center justify-between w-full p-4 bg-gray-100 dark:bg-brand-panel border border-gray-200 dark:border-brand-border rounded-lg hover:border-brand-blue transition-colors group"
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-brand-blue/10 text-brand-blue rounded-full flex items-center justify-center">
          <Play size={20} className="ml-1" />
        </div>
        <div>
          <p className="text-sm font-bold text-gray-900 dark:text-white">Ver contenido externo</p>
          <p className="text-xs text-gray-500 truncate max-w-[200px] md:max-w-xs">{url}</p>
        </div>
      </div>
      <ExternalLink size={18} className="text-gray-400 group-hover:text-brand-blue transition-colors" />
    </a>
  );
}
