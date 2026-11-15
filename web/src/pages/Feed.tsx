import { useState, useEffect } from 'react';
import { Heart, MessageCircle, Share2, Image as ImageIcon, Loader2, Music, Calendar, Link as LinkIcon } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { useUIStore } from '../stores/uiStore';
import StickerCard from '../components/StickerCard';

interface Post {
  id: string;
  userId: string;
  content: string;
  createdAt: string;
  sticker?: { type: 'music' | 'event' | 'ad'; title: string; subtitle: string; };
}

export default function Feed() {
  const { user, token } = useAuthStore();
  const { showToast } = useUIStore();
  
  const [posts, setPosts] = useState<Post[]>([
    // Simulamos un post con un sticker para que veas cómo se ve
    {
      id: '1',
      userId: 'sistema',
      content: '¡No te pierdas el próximo evento exclusivo de IDKMEDIA! Haz clic en la tarjeta para más info.',
      createdAt: new Date().toISOString(),
      sticker: { type: 'event', title: 'Underground Fest 2026', subtitle: 'Coliseo de la Habana • 15 Dic' }
    }
  ]);
  const [loading, setLoading] = useState(false);
  const [newPost, setNewPost] = useState('');
  const [showStickerOptions, setShowStickerOptions] = useState(false);

  // Simulador de publicación (en el futuro se conectará al backend real)
  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPost.trim()) return;
    
    const newPostData: Post = {
      id: Date.now().toString(),
      userId: user?.id || 'yo',
      content: newPost,
      createdAt: new Date().toISOString()
    };

    setPosts([newPostData, ...posts]);
    setNewPost('');
    setShowStickerOptions(false);
    showToast('Publicación exitosa', 'success');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-4 md:mb-8 border-b border-gray-200 dark:border-brand-border pb-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white font-mono tracking-tight">TIMELINE_SOCIAL</h1>
      </div>

      <form onSubmit={handlePublish} className="bg-white dark:bg-brand-panel border border-gray-200 dark:border-brand-border p-4 rounded-lg flex gap-3">
        <div className="w-10 h-10 bg-brand-blue/20 border border-brand-blue rounded-full flex-shrink-0 flex items-center justify-center font-bold text-brand-blue">{user?.alias?.charAt(0).toUpperCase() || 'U'}</div>
        <div className="flex-1">
          <input type="text" value={newPost} onChange={(e) => setNewPost(e.target.value)} placeholder="¿Qué está pasando?" className="w-full bg-transparent border-none outline-none text-gray-900 dark:text-white placeholder-gray-500 text-sm mb-3" />
          
          {/* Opciones de Sticker (Simuladas) */}
          {showStickerOptions && (
            <div className="mb-3 p-3 bg-gray-50 dark:bg-[#111] border border-gray-200 dark:border-gray-700 rounded-lg">
              <p className="text-xs text-gray-500 mb-2 font-mono">Adjuntar tarjeta:</p>
              <div className="flex gap-2">
                <button type="button" className="flex items-center gap-1 text-xs bg-green-500/10 text-green-500 px-3 py-1.5 rounded border border-green-500/20 hover:bg-green-500/20"><Music size={12}/> Música</button>
                <button type="button" className="flex items-center gap-1 text-xs bg-brand-blue/10 text-brand-blue px-3 py-1.5 rounded border border-brand-blue/20 hover:bg-brand-blue/20"><Calendar size={12}/> Evento</button>
                <button type="button" className="flex items-center gap-1 text-xs bg-orange-500/10 text-orange-500 px-3 py-1.5 rounded border border-orange-500/20 hover:bg-orange-500/20"><LinkIcon size={12}/> Enlace</button>
              </div>
            </div>
          )}

          <div className="flex justify-between items-center border-t border-gray-200 dark:border-brand-border pt-3">
            <div className="flex gap-2">
              <button type="button" onClick={() => showToast('Subida de imágenes en desarrollo', 'info')} className="text-brand-blue hover:text-blue-400 p-1"><ImageIcon size={20} /></button>
              <button type="button" onClick={() => setShowStickerOptions(!showStickerOptions)} className={`hover:text-blue-400 p-1 ${showStickerOptions ? 'text-brand-blue' : 'text-gray-500'}`}><LinkIcon size={20} /></button>
            </div>
            <button type="submit" className="bg-brand-blue text-white text-xs font-mono font-bold px-4 py-1.5 rounded hover:bg-blue-600">PUBLICAR</button>
          </div>
        </div>
      </form>

      {loading ? (
        <div className="flex justify-center py-10"><Loader2 className="animate-spin text-brand-blue" size={32} /></div>
      ) : (
        posts.map((post) => (
          <div key={post.id} className="bg-white dark:bg-brand-panel border border-gray-200 dark:border-brand-border p-4 md:p-5 rounded-lg">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-brand-blue/20 border border-brand-blue rounded-full flex items-center justify-center font-bold text-brand-blue">{post.userId.slice(0, 1).toUpperCase()}</div>
              <div>
                <h3 className="text-gray-900 dark:text-white font-bold text-sm">Usuario</h3>
                <p className="text-gray-500 text-xs font-mono">{new Date(post.createdAt).toLocaleString()}</p>
              </div>
            </div>
            <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed mb-4">{post.content}</p>
            
            {/* COMPONENTE STICKER AQUÍ */}
            {post.sticker && (
              <StickerCard 
                type={post.sticker.type} 
                title={post.sticker.title} 
                subtitle={post.sticker.subtitle} 
              />
            )}
            
            <div className="flex items-center gap-6 border-t border-gray-200 dark:border-brand-border pt-4 mt-4">
              <button className="flex items-center gap-2 text-xs font-mono text-gray-500 hover:text-red-500"><Heart size={16} /> 0</button>
              <button className="flex items-center gap-2 text-xs font-mono text-gray-500 hover:text-brand-blue"><MessageCircle size={16} /> 0</button>
              <button className="flex items-center gap-2 text-xs font-mono text-gray-500 hover:text-green-500 ml-auto"><Share2 size={16} /></button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
