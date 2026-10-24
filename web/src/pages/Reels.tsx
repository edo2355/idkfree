import { useEffect, useState, useRef } from 'react';
import { api } from '../api/client';
import { resolveAssetUrl } from '../utils/assetUrl';
import { useAuthStore } from '../stores/authStore';
import './Reels.css';

export function Reels() {
  const { user } = useAuthStore();
  const [reels, setReels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await api.posts.reels(20);
        setReels(res.reels || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  async function toggleLike(postId: string, currentStatus: boolean, index: number) {
    try {
      if (currentStatus) {
        await api.posts.unlike(postId);
      } else {
        await api.posts.like(postId);
      }
      // Actualizamos la UI localmente para respuesta inmediata
      setReels(prev => prev.map((r, i) => 
        i === index ? { 
          ...r, 
          liked_by_me: !currentStatus, 
          likes_count: currentStatus ? r.likes_count - 1 : r.likes_count + 1 
        } : r
      ));
    } catch (err) {
      alert('Error al dar like');
    }
  }

  if (loading) return <div className="reels-loading">Cargando Reels...</div>;

  if (reels.length === 0) {
    return (
      <>
        <div className="reels-empty">
          <h2>No hay Reels aún</h2>
          <p>Los videos que se suban desde la app aparecerán aquí.</p>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="reels-wrapper">
        {reels.map((reel, index) => (
          <div key={reel.id} className="reel-container">
            <video 
              src={resolveAssetUrl(reel.video_url)} 
              className="reel-video"
              loop
              playsInline
              controls={false}
              autoPlay
              muted // Los navegadores obligan a silenciar para autoplay
              onClick={(e) => {
                const video = e.target as HTMLVideoElement;
                video.paused ? video.play() : video.pause();
              }}
            />
            
            {/* Overlay oscuro inferior para legibilidad */}
            <div className="reel-overlay"></div>

            {/* Botones laterales (Like, Comentarios, Compartir) */}
            <div className="reel-actions">
              <div className="reel-avatar-container">
                <img 
                  src={reel.author_avatar ? resolveAssetUrl(reel.author_avatar) : `https://ui-avatars.com/api/?name=${reel.author_alias}&background=1A1A1A&color=A855F7`} 
                  alt="avatar" 
                  className="reel-avatar" 
                />
              </div>
              
              <button className="reel-action-btn" onClick={() => toggleLike(reel.id, reel.liked_by_me, index)}>
                <span className={`reel-icon ${reel.liked_by_me ? 'liked' : ''}`}>❤️</span>
                <span>{reel.likes_count || 0}</span>
              </button>
              
              <button className="reel-action-btn">
                <span className="reel-icon">💬</span>
                <span>{reel.comments_count || 0}</span>
              </button>
              
              <button className="reel-action-btn">
                <span className="reel-icon">📤</span>
              </button>
            </div>

            {/* Info inferior izquierda */}
            <div className="reel-info">
              <h3>@{reel.author_alias}</h3>
              {reel.body && <p>{reel.body}</p>}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
