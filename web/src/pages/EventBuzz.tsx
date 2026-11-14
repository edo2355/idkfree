import { useState } from 'react';
import { Camera, MessageSquare, PlaySquare, Video, MessageCircle, Heart, ExternalLink } from 'lucide-react';

export default function EventBuzz() {
  const [activeFilter, setActiveFilter] = useState('all');

  const buzzFeed = [
    {
      id: 1,
      source: 'instagram',
      sourceIcon: <Camera size={14} className="text-pink-500" />,
      author: '@el_creador',
      content: '¡La energía en el concierto de #IDKfreeUnderground es increíble! 🔥🎸',
      likes: '2.4K',
      comments: '120',
      time: 'Hace 5 min'
    },
    {
      id: 2,
      source: 'twitter',
      sourceIcon: <MessageSquare size={14} className="text-blue-400" />,
      author: '@fan_de_idk',
      content: 'No puedo creer que estoy viendo esto en vivo desde Cuba gracias a @idkfree. #IDKfreeUnderground',
      likes: '890',
      comments: '45',
      time: 'Hace 12 min'
    },
    {
      id: 3,
      source: 'tiktok',
      sourceIcon: <Video size={14} className="text-white" />,
      author: '@bailarin_habana',
      content: 'El clip del backstage de #IDKfreeUnderground ya tiene 10k vistas! 🕺🕺',
      likes: '10.5K',
      comments: '340',
      time: 'Hace 20 min'
    }
  ];

  const filteredBuzz = activeFilter === 'all' ? buzzFeed : buzzFeed.filter(b => b.source === activeFilter);

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-4xl mx-auto">
      {/* Header del Evento */}
      <div className="bg-brand-panel border border-brand-border p-6 rounded-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-brand-blue/10 blur-2xl"></div>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative z-10">
          <div>
            <span className="text-[10px] font-mono bg-brand-blue/20 text-brand-blue px-2 py-1 rounded border border-brand-blue/30 mb-2 inline-block">EVENTO EN VIVO</span>
            <h1 className="text-3xl font-bold text-white mb-2">IDKfree Underground Fest</h1>
            <p className="text-gray-400 text-sm">Rastreando actividad social con el hashtag: <strong className="text-brand-blue">#IDKfreeUnderground</strong></p>
          </div>
          <div className="flex gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-white">1.2K</p>
              <p className="text-[10px] text-gray-500 font-mono">MENCIONES</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-white">450</p>
              <p className="text-[10px] text-gray-500 font-mono">ASISTENTES</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filtros de Redes Sociales */}
      <div className="flex flex-wrap gap-2 border-b border-brand-border pb-4">
        <button onClick={() => setActiveFilter('all')} className={`px-4 py-2 text-xs font-mono rounded-md transition-colors ${activeFilter === 'all' ? 'bg-white text-black' : 'bg-brand-panel text-gray-400 hover:text-white'}`}>TODO</button>
        <button onClick={() => setActiveFilter('instagram')} className={`px-4 py-2 text-xs font-mono rounded-md flex items-center gap-2 transition-colors ${activeFilter === 'instagram' ? 'bg-pink-500/20 text-pink-500 border border-pink-500/50' : 'bg-brand-panel text-gray-400 hover:text-white'}`}><Camera size={14} /> INSTAGRAM</button>
        <button onClick={() => setActiveFilter('twitter')} className={`px-4 py-2 text-xs font-mono rounded-md flex items-center gap-2 transition-colors ${activeFilter === 'twitter' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/50' : 'bg-brand-panel text-gray-400 hover:text-white'}`}><MessageSquare size={14} /> X / TWITTER</button>
        <button onClick={() => setActiveFilter('tiktok')} className={`px-4 py-2 text-xs font-mono rounded-md flex items-center gap-2 transition-colors ${activeFilter === 'tiktok' ? 'bg-white/20 text-white border border-white/50' : 'bg-brand-panel text-gray-400 hover:text-white'}`}><Video size={14} /> TIKTOK</button>
      </div>

      {/* Feed Agregado */}
      <div className="space-y-4">
        {filteredBuzz.map(post => (
          <div key={post.id} className="bg-brand-panel border border-brand-border p-5 rounded-lg hover:border-brand-blue/50 transition-colors">
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-[#000] border border-brand-border rounded-full flex items-center justify-center">
                  {post.sourceIcon}
                </div>
                <div>
                  <h3 className="text-white font-bold text-sm">{post.author}</h3>
                  <p className="text-gray-500 text-[10px] font-mono">{post.time} vía {post.source}</p>
                </div>
              </div>
              <a href="#" className="text-gray-500 hover:text-white"><ExternalLink size={14} /></a>
            </div>
            <p className="text-gray-300 text-sm mb-4">{post.content}</p>
            <div className="flex gap-4 text-xs font-mono text-gray-500">
              <span className="flex items-center gap-1"><Heart size={14} /> {post.likes}</span>
              <span className="flex items-center gap-1"><MessageCircle size={14} /> {post.comments}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
