import { useState, useEffect } from 'react';
import { Heart, MessageCircle, Share2, Image as ImageIcon, Loader2 } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { useUIStore } from '../stores/uiStore';

interface Post {
  id: string;
  userId: string;
  content: string;
  createdAt: string;
}

export default function Feed() {
  const { user, token } = useAuthStore();
  const { showToast } = useUIStore();
  
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [newPost, setNewPost] = useState('');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch('https://idkfree.onrender.com/api/social/posts');
        if (res.ok) {
          const data = await res.json();
          setPosts(data);
        }
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPost.trim()) return;
    if (!token) return showToast('Debes iniciar sesión', 'error');

    try {
      const res = await fetch('https://idkfree.onrender.com/api/social/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ content: newPost })
      });
      if (res.ok) {
        const newPostData = await res.json();
        setPosts([newPostData, ...posts]);
        setNewPost('');
        showToast('Publicación exitosa', 'success');
      } else {
        showToast('Error al publicar', 'error');
      }
    } catch (error) {
      showToast('Error de red', 'error');
    }
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

      {loading ? (
        <div className="flex justify-center py-10"><Loader2 className="animate-spin text-brand-blue" size={32} /></div>
      ) : posts.length === 0 ? (
        <div className="text-center py-10 text-gray-500 font-mono border border-dashed border-gray-300 dark:border-gray-700 rounded-lg">No hay publicaciones aún. ¡Sé el primero!</div>
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
            <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed mb-6">{post.content}</p>
            <div className="flex items-center gap-6 border-t border-gray-200 dark:border-brand-border pt-4">
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
