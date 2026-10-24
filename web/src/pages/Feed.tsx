import { useEffect, useState } from 'react';
import { api } from '../api/client';
import { PostCard } from '../components/PostCard';
import { NotesRow } from '../components/NotesRow';
import { useAuthStore } from '../stores/authStore';
import './Feed.css';

export function Feed() {
  const { user } = useAuthStore();
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Estados para el compositor
  const [newPostText, setNewPostText] = useState('');
  const [isPublishing, setIsPublishing] = useState(false);

  async function loadFeed() {
    try {
      const res = await api.posts.feed({ limit: 20 });
      setPosts(res.posts);
      setError(null);
    } catch (err: any) {
      setError('No se pudo conectar con el servidor. Render puede estar despertando.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadFeed();
  }, []);

  async function handlePublish() {
    if (!newPostText.trim() || isPublishing) return;
    
    setIsPublishing(true);
    try {
      // Creamos el post. Visibilidad pública por defecto.
      await api.posts.create({ 
        body: newPostText.trim(), 
        visibility: 'public' 
      });
      
      // Limpiamos el input
      setNewPostText('');
      
      // Recargamos el feed para ver nuestro nuevo post
      setLoading(true);
      await loadFeed();
    } catch (err: any) {
      alert('Error al publicar: ' + (err.message || 'Intenta de nuevo'));
    } finally {
      setIsPublishing(false);
    }
  }

  return (
    <>
      <div className="feed-wrapper">
        {/* Columna Central */}
        <div className="feed-main">
          
          {/* Header del Feed */}
          <div className="feed-header">
            <h1>Inicio</h1>
          </div>

          {/* Compositor Funcional */}
          <div className="feed-composer">
            <div className="composer-avatar">
              {user?.alias?.charAt(0).toUpperCase() || '?'}
            </div>
            <input 
              type="text" 
              placeholder="¿Qué está pasando en el pueblo?" 
              value={newPostText}
              onChange={(e) => setNewPostText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handlePublish()}
              disabled={isPublishing}
            />
            <button 
              onClick={handlePublish}
              disabled={!newPostText.trim() || isPublishing}
              className={newPostText.trim() ? 'active' : ''}
            >
              {isPublishing ? '...' : 'Publicar'}
            </button>
          </div>

          {/* Filtros */}
          <NotesRow />

          {/* Lista de Posts */}
          {loading ? (
            <div className="feed-loading">
              <div className="spinner"></div>
              <p>Cargando publicaciones...</p>
            </div>
          ) : error ? (
            <div className="feed-error">
              <p>{error}</p>
              <button onClick={() => { setLoading(true); loadFeed(); }}>Reintentar</button>
            </div>
          ) : posts.length === 0 ? (
            <div className="feed-empty">
              <p>Aún no hay publicaciones en IDKFREE.</p>
              <p>¡Sé el primero en compartir algo!</p>
            </div>
          ) : (
            <div className="posts-list">
              {posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          )}
        </div>

        {/* Barra Lateral Derecha (Widgets) */}
        <div className="feed-sidebar">
          <div className="widget">
            <h3>Sobre IDKFREE</h3>
            <p>La red social de la soberanía digital. Tu pueblo en internet.</p>
          </div>
          <div className="widget">
            <h3>Tendencias</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>Próximamente...</p>
          </div>
        </div>
      </div>
    </>
  );
}
