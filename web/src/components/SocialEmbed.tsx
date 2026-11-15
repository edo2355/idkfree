import { ExternalLink, MessageSquare, Radio, Users } from 'lucide-react';

interface SocialEmbedProps {
  url: string;
  type?: 'video' | 'chat' | 'community';
}

export default function SocialEmbed({ url, type = 'video' }: SocialEmbedProps) {
  if (!url) return null;

  // 1. YOUTUBE (Video o Live)
  const ytMatch = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i);
  if (ytMatch && ytMatch[1]) {
    return (
      <div className="aspect-video w-full rounded-lg overflow-hidden border border-gray-200 dark:border-brand-border bg-black">
        <iframe width="100%" height="100%" src={`https://www.youtube.com/embed/${ytMatch[1]}?autoplay=0`} title="YouTube" frameBorder="0" allowFullScreen></iframe>
      </div>
    );
  }

  // 2. TWITCH (Video o Chat)
  const twitchMatch = url.match(/twitch\.tv\/([a-zA-Z0-9_]+)/i);
  if (twitchMatch && twitchMatch[1]) {
    const channel = twitchMatch[1];
    const parentParams = 'parent=idkfreegetid.dpdns.org&parent=idkfree-1.onrender.com&parent=localhost';
    
    if (type === 'chat') {
      return (
        <div className="w-full h-[500px] rounded-lg overflow-hidden border border-gray-200 dark:border-brand-border bg-white dark:bg-brand-panel">
          <iframe src={`https://www.twitch.tv/embed/${channel}/chat?${parentParams}&darkpopout`} height="100%" width="100%" frameBorder="0"></iframe>
        </div>
      );
    }
    
    return (
      <div className="aspect-video w-full rounded-lg overflow-hidden border border-gray-200 dark:border-brand-border bg-black">
        <iframe src={`https://player.twitch.tv/?channel=${channel}&${parentParams}`} height="100%" width="100%" allowFullScreen></iframe>
      </div>
    );
  }

  // 3. DISCORD (Widget de Comunidad)
  const discordMatch = url.match(/discord\.(?:gg|com\/invite)\/([a-zA-Z0-9-]+)/i);
  if (discordMatch) {
    // Para que funcione, necesitas el ID del servidor, no el código de invitación.
    // Si el usuario pega un enlace de invitación, le pedimos que use el ID en el futuro.
    // Por ahora, mostramos un botón de acceso.
    return (
      <div className="p-6 bg-[#5865F2]/10 border border-[#5865F2]/30 rounded-lg flex flex-col items-center justify-center text-center">
        <Users size={48} className="text-[#5865F2] mb-4" />
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Comunidad de Discord</h3>
        <p className="text-sm text-gray-500 mb-4">Únete a la conversación en nuestro servidor oficial.</p>
        <a href={url} target="_blank" rel="noopener noreferrer" className="bg-[#5865F2] text-white px-6 py-2 rounded font-bold hover:bg-[#4752C4] transition-colors">
          Unirse al Servidor
        </a>
      </div>
    );
  }

  // 4. BILIBILI (Plataforma asiática)
  const biliMatch = url.match(/bilibili\.com\/video\/([a-zA-Z0-9]+)/i);
  if (biliMatch && biliMatch[1]) {
    return (
      <div className="aspect-video w-full rounded-lg overflow-hidden border border-gray-200 dark:border-brand-border bg-black">
        <iframe src={`https://player.bilibili.com/player.html?bvid=${biliMatch[1]}&page=1&high_quality=1`} width="100%" height="100%" frameBorder="0" allowFullScreen></iframe>
      </div>
    );
  }

  // 5. OTRAS PLATAFORMAS (TikTok, Instagram, X, etc.)
  return (
    <a href={url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between w-full p-4 bg-gray-100 dark:bg-brand-panel border border-gray-200 dark:border-brand-border rounded-lg hover:border-brand-blue transition-colors group">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-brand-blue/10 text-brand-blue rounded-full flex items-center justify-center">
          <Radio size={20} className="animate-pulse" />
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
