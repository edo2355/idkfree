import { useState, useRef } from 'react';
import { api } from '../api/client';
import { resolveAssetUrl } from '../utils/assetUrl';
import './PostCard.css';

// Iconos SVG nativos para Web (Replicando los de móvil)
const HeartIcon = ({ filled, color, size = 22 }: { filled: boolean, color: string, size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? color : 'none'} stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
  </svg>
);
const CommentIcon = ({ color }: { color: string }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
  </svg>
);
const ShareIcon = ({ color }: { color: string }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
  </svg>
);
const MoreIcon = ({ color }: { color: string }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="1"></circle><circle cx="19" cy="12" r="1"></circle><circle cx="5" cy="12" r="1"></circle>
  </svg>
);

interface PostCardProps {
  post: any; // idealmente Post de shared/types
  onComment?: () => void;
  onShare?: () => void;
}

export function PostCard({ post, onComment, onShare }: PostCardProps) {
  const [liked, setLiked] = useState(post.liked_by_me ?? false);
  const [likesCount, setLikesCount] = useState(post.likes_count ?? 0);
  const [busy, setBusy] = useState(false);
  
  const lastTapRef = useRef<number>(0);
  const heartRef = useRef<HTMLDivElement>(null);

  // Asumimos que el usuario actual se saca del store (ajustar si es necesario)
  const isMine = false; // Aquí conectarías con useAuthStore

  async function toggleLike() {
    if (busy) return;
    const nextLiked = !liked;
    const nextCount = nextLiked ? likesCount + 1 : Math.max(0, likesCount - 1);
    setLiked(nextLiked);
    setLikesCount(nextCount);
    setBusy(true);
    try {
      if (nextLiked) await api.posts.like(post.id);
      else await api.posts.unlike(post.id);
    } catch {
      setLiked(!nextLiked);
      setLikesCount(likesCount);
    }
    setBusy(false);
  }

  function handleDoubleTap() {
    const now = Date.now();
    if (now - lastTapRef.current < 300) {
      if (!liked && !busy) toggleLike();
      
      // Animación del corazón
      if (heartRef.current) {
        heartRef.current.classList.add('animate');
        heartRef.current.classList.remove('fade-out');
        
        setTimeout(() => {
          heartRef.current?.classList.add('fade-out');
          setTimeout(() => {
            heartRef.current?.classList.remove('animate', 'fade-out');
          }, 700);
        }, 300);
      }
    }
    lastTapRef.current = now;
  }

  function renderBody(text: string) {
    const parts = text.split(/(#[\wáéíóúñÁÉÍÓÚÑ]+|@[\w.]+)/g);
    return (
      <div className="post-body">
        {parts.map((part, i) => {
          if (part.startsWith('#') || part.startsWith('@')) {
            const className = part.startsWith('#') ? 'hashtag' : 'mention';
            return <span key={i} className={className}>{part}</span>;
          }
          return <span key={i}>{part}</span>;
        })}
      </div>
    );
  }

  function getTimeAgo(dateStr: string): string {
    const date = new Date(dateStr);
    const s = Math.floor((Date.now() - date.getTime()) / 1000);
    if (s < 60) return 'ahora';
    if (s < 3600) return `hace ${Math.floor(s / 60)} min`;
    if (s < 86400) return `hace ${Math.floor(s / 3600)} h`;
    if (s < 604800) return `hace ${Math.floor(s / 86400)} d`;
    return date.toLocaleDateString('es-ES');
  }

  return (
    <div className="post-card" onClick={handleDoubleTap}>
      {/* Header */}
      <div className="post-header">
        <img 
          src={post.author_avatar ? resolveAssetUrl(post.author_avatar) : `https://ui-avatars.com/api/?name=${post.author_alias}&background=1A1A1A&color=A855F7`} 
          alt={post.author_alias} 
          className="post-avatar" 
        />
        <div className="post-info">
          <span className="post-author-name">{post.author_name ?? post.author_alias}</span>
          <span className="post-author-alias">@{post.author_alias} · {getTimeAgo(post.created_at)}</span>
        </div>
        {isMine && (
          <button className="post-more-btn"><MoreIcon color="var(--text-muted)" /></button>
        )}
      </div>

      {/* Body */}
      {post.body && renderBody(post.body)}

      {/* Media */}
      {post.video_url ? (
        <video src={post.video_url} className="post-media-video" controls muted loop />
      ) : post.image_url ? (
        <img src={resolveAssetUrl(post.image_url)} alt="Post media" className="post-media" />
      ) : null}

      {/* Actions */}
      <div className="post-actions">
        <button className="post-action-btn" onClick={toggleLike} disabled={busy}>
          <HeartIcon size={22} color={liked ? 'var(--accent)' : 'var(--text-muted)'} filled={liked} />
          {likesCount > 0 && (
            <span className={`post-action-count ${liked ? 'liked' : ''}`}>{likesCount}</span>
          )}
        </button>

        <button className="post-action-btn" onClick={onComment}>
          <CommentIcon color="var(--text-muted)" />
          {(post.comments_count ?? 0) > 0 && (
            <span className="post-action-count">{post.comments_count}</span>
          )}
        </button>

        <button className="post-action-btn" onClick={onShare}>
          <ShareIcon color="var(--text-muted)" />
        </button>
      </div>

      {/* Corazón flotante animado */}
      <div className="floating-heart" ref={heartRef}>
        <HeartIcon size={110} color="var(--accent)" filled={true} />
      </div>
    </div>
  );
}
