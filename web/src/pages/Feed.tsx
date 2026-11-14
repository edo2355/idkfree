import { useState } from 'react';
import { Heart, MessageCircle, Share2, MoreHorizontal, Image as ImageIcon } from 'lucide-react';
import { useUIStore } from '../stores/uiStore';
import { useAuthStore } from '../stores/authStore';

export default function Feed() {
  const { user } = useAuthStore();
  const { showToast } = useUIStore();
  
  const [newPost, setNewPost] = useState('');
  const [posts, setPosts] = useState([
    { id: 1, author: 'EL_CREADOR', handle: '@edo_creator', time: 'Hace 2 horas', content: 'Acabo de configurar mi túnel de pagos con QvaPay. Es una locura lo fácil que es cobrar desde Cuba sin intermediarios. 💸🔥', likes: 124, comments: 18, isLiked: false },
    { id: 2, author: 'IDK_FREE_OS', handle: '@idkfree', time: 'Hace 5 horas', content: 'Actualización del sistema: El módulo de Ticketera ya está en vivo. Pronto podrás crear tus propios eventos y vender boletos con QR. 🎟️🚀', likes: 340, comments: 45, isLiked: false }
  ]);

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPost.trim()) return;

    const post = {
      id: Date.now(),
      author: user?.alias?.toUpperCase() || 'USUARIO',
      handle: `@${user?.alias || 'user'}`,
      time: 'Justo ahora',
      content: newPost,
      likes: 0,
      comments: 0,
      isLiked: false
    };

    setPosts([post, ...posts]);
    setNewPost('');
    showToast('Publicación exitosa', 'success');
  };

  const toggleLike = (id: number) => {
    setPosts(posts.map(p => {
      if (p.id === id) {
        return { ...p, isLiked: !p.isLiked, likes: p.isLiked ? p.likes - 1 : p.likes + 1 };
      }
      return p;
    }));
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-4 md:mb-8 border-b border-gray-200 dark:border-brand-border pb-4 transition-colors">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white font-mono tracking-tight">TIMELINE_SOCIAL</h1>
      </div>

      {/* Crear Publicación */}
      <form onSubmit={handlePublish} className="bg-white dark:bg-brand-panel border border-gray-200 dark:border-brand-border p-4 rounded-lg flex gap-3 transition-colors">
        <div className="w-10 h-10 bg-brand-blue/20 border border-brand-blue rounded-full flex-shrink-0 flex items-center justify-center font-bold text-brand-blue">
          {user?.alias?.charAt(0).toUpperCase() || 'U'}
        </div>
        <div className="flex-1">
          <input 
            type="text" 
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            placeholder="¿Qué está pasando en la red?" 
            className="w-full bg-transparent border-none outline-none text-gray-900 dark:text-white placeholder-gray-500 text-sm mb-3" 
          />
          <div className="flex justify-between items-center border-t border-gray-200 dark:border-brand-border pt-3">
            <button type="button" onClick={() => showToast('Subida de imágenes en desarrollo', 'info')} className="text-brand-blue hover:text-blue-400"><ImageIcon size={20} /></button>
            <button type="submit" className="bg-brand-blue text-white text-xs font-mono font-bold px-4 py-1.5 rounded hover:bg-blue-600 transition-colors">PUBLICAR</button>
          </div>
        </div>
      </form>

      {posts.map((post) => (
        <div key={post.id} className="bg-white dark:bg-brand-panel border border-gray-200 dark:border-brand-border p-4 md:p-5 rounded-lg transition-colors">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-brand-blue/20 border border-brand-blue rounded-full flex items-center justify-center font-bold text-brand-blue">
                {post.author.charAt(0)}
              </div>
              <div>
                <h3 className="text-gray-900 dark:text-white font-bold text-sm flex items-center gap-2">
                  {post.author} <span className="text-gray-500 font-normal text-xs">{post.handle}</span>
                </h3>
                <p className="text-gray-500 text-xs font-mono">{post.time}</p>
              </div>
            </div>
            <button className="text-gray-500 hover:text-gray-900 dark:hover:text-white"><MoreHorizontal size={18} /></button>
          </div>
          
          <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed mb-6">{post.content}</p>
          
          <div className="flex items-center gap-6 border-t border-gray-200 dark:border-brand-border pt-4">
            <button onClick={() => toggleLike(post.id)} className={`flex items-center gap-2 transition-colors text-xs font-mono ${post.isLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'}`}>
              <Heart size={16} fill={post.isLiked ? "currentColor" : "none"} /> {post.likes}
            </button>
            <button onClick={() => showToast('Los comentarios estarán disponibles pronto', 'info')} className="flex items-center gap-2 text-gray-500 hover:text-brand-blue transition-colors text-xs font-mono">
              <MessageCircle size={16} /> {post.comments}
            </button>
            <button onClick={() => showToast('Enlace copiado al portapapeles', 'success')} className="flex items-center gap-2 text-gray-500 hover:text-green-500 transition-colors text-xs font-mono ml-auto">
              <Share2 size={16} /> <span className="hidden md:inline">COMPARTIR</span>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
