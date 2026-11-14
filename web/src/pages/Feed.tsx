import { Heart, MessageCircle, Share2, MoreHorizontal } from 'lucide-react';

export default function Feed() {
  const mockPosts = [
    {
      id: 1,
      author: 'EL_CREADOR',
      handle: '@edo_creator',
      time: 'Hace 2 horas',
      content: 'Acabo de configurar mi túnel de pagos con QvaPay. Es una locura lo fácil que es cobrar desde Cuba sin intermediarios. 💸🔥',
      likes: 124,
      comments: 18,
    },
    {
      id: 2,
      author: 'IDK_FREE_OS',
      handle: '@idkfree',
      time: 'Hace 5 horas',
      content: 'Actualización del sistema: El módulo de Ticketera ya está en vivo. Pronto podrás crear tus propios eventos y vender boletos con QR. 🎟️🚀',
      likes: 340,
      comments: 45,
    }
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-8 border-b border-brand-border pb-4">
        <h1 className="text-2xl font-bold text-white font-mono tracking-tight">TIMELINE_SOCIAL</h1>
        <button className="text-xs font-mono text-brand-blue hover:text-white">FILTRAR_ALGORITMO</button>
      </div>

      {mockPosts.map((post) => (
        <div key={post.id} className="bg-brand-panel border border-brand-border p-5 rounded-lg">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-brand-blue/20 border border-brand-blue rounded-full flex items-center justify-center font-bold text-brand-blue">
                {post.author.charAt(0)}
              </div>
              <div>
                <h3 className="text-white font-bold text-sm flex items-center gap-2">
                  {post.author} <span className="text-gray-500 font-normal text-xs">{post.handle}</span>
                </h3>
                <p className="text-gray-500 text-xs font-mono">{post.time}</p>
              </div>
            </div>
            <button className="text-gray-500 hover:text-white"><MoreHorizontal size={18} /></button>
          </div>
          
          <p className="text-gray-300 text-sm leading-relaxed mb-6">{post.content}</p>
          
          <div className="flex items-center gap-6 border-t border-brand-border pt-4 text-gray-500">
            <button className="flex items-center gap-2 hover:text-red-500 transition-colors text-xs font-mono"><Heart size={16} /> {post.likes}</button>
            <button className="flex items-center gap-2 hover:text-brand-blue transition-colors text-xs font-mono"><MessageCircle size={16} /> {post.comments}</button>
            <button className="flex items-center gap-2 hover:text-green-500 transition-colors text-xs font-mono ml-auto"><Share2 size={16} /> COMPARTIR</button>
          </div>
        </div>
      ))}
    </div>
  );
}
