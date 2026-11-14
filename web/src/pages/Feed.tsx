import { useState } from 'react';
import { Heart, MessageCircle, Share2, Image as ImageIcon } from 'lucide-react';
import { useDataStore } from '../stores/dataStore';
import { useAuthStore } from '../stores/authStore';
import { useUIStore } from '../stores/uiStore';

export default function Feed() {
  const [newPost, setNewPost] = useState('');
  const { posts, addPost, toggleLike } = useDataStore();
  const { user } = useAuthStore();
  const { showToast } = useUIStore();

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPost.trim()) return;
    addPost(newPost, user?.alias || 'user');
    setNewPost('');
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
          <div className="flex justify-between items-center border-t border-gray-200 dark:border-brand-border pt-3">
            <button type="button" onClick={() => showToast('Subida de imágenes en desarrollo', 'info')} className="text-brand-blue hover:text-blue-400"><ImageIcon size={20} /></button>
            <button type="submit" className="bg-brand-blue text-white text-xs font-mono font-bold px-4 py-1.5 rounded hover:bg-blue-600">PUBLICAR</button>
          </div>
        </div>
      </form>

      {posts.map((post) => (
        <div key={post.id} className="bg-white dark:bg-brand-panel border border-gray-200 dark:border-brand-border p-4 md:p-5 rounded-lg">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-brand-blue/20 border border-brand-blue rounded-full flex items-center justify-center font-bold text-brand-blue">{post.author.charAt(0)}</div>
            <div>
              <h3 className="text-gray-900 dark:text-white font-bold text-sm">{post.author} <span className="text-gray-500 font-normal text-xs">{post.handle}</span></h3>
              <p className="text-gray-500 text-xs font-mono">{post.time}</p>
            </div>
          </div>
          <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed mb-6">{post.content}</p>
          <div className="flex items-center gap-6 border-t border-gray-200 dark:border-brand-border pt-4">
            <button onClick={() => toggleLike(post.id)} className={`flex items-center gap-2 text-xs font-mono ${post.isLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'}`}>
              <Heart size={16} fill={post.isLiked ? "currentColor" : "none"} /> {post.likes}
            </button>
            <button onClick={() => showToast('Los comentarios estarán disponibles pronto', 'info')} className="flex items-center gap-2 text-gray-500 hover:text-brand-blue text-xs font-mono"><MessageCircle size={16} /> {post.comments}</button>
            <button onClick={() => showToast('Enlace copiado', 'success')} className="flex items-center gap-2 text-gray-500 hover:text-green-500 text-xs font-mono ml-auto"><Share2 size={16} /></button>
          </div>
        </div>
      ))}
    </div>
  );
}
