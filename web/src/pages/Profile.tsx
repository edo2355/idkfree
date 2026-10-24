import { useEffect, useState } from 'react';
import { useAuthStore } from '../stores/authStore';
import { useParams, Link, useNavigate  } from 'react-router-dom';
import { api } from '../api/client';
import { resolveAssetUrl } from '../utils/assetUrl';
import { PostCard } from '../components/PostCard';

import './Profile.css';

type Tab = 'posts' | 'reels' | 'streams';

export function Profile() {
  const navigate = useNavigate();
  const { alias } = useParams();
  const currentUser = useAuthStore(s => s.user);
  const [profile, setProfile] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [tab, setTab] = useState<Tab>('posts');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!alias) return;
      try {
        const res = await api.profile.get(alias);
        setProfile(res);
        const postsRes = await api.posts.userPosts(res.user.id);
        setPosts(postsRes.posts ?? []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [alias]);

  if (loading || !profile) return <div style={{ padding: 40, color: 'white' }}>Cargando perfil...</div>;

  const u = profile.user;
  const stats = profile.stats;
  const isMe = currentUser?.alias === u?.alias;

  const mediaPosts = posts.filter((p: any) => p.image_url || p.video_url);
  const textPosts = posts.filter((p: any) => !p.image_url && !p.video_url);
  
  let parsedLinks: {title: string, url: string}[] = [];
  if (u.links) {
    try { parsedLinks = JSON.parse(u.links); } catch {}
  }

  return (
    
      <div className="profile-container">
        <div className="profile-header">
          <img 
            src={u.avatar_url ? resolveAssetUrl(u.avatar_url) : `https://ui-avatars.com/api/?name=${u?.alias}&background=1A1A1A&color=A855F7&size=200`} 
            alt={u?.alias} 
            className="profile-avatar-large" 
          />
          <div className="profile-info">
            <div className="profile-username">
              {u?.name || u?.alias} <span style={{ color: 'var(--text-muted)' }}>@{u?.alias}</span>
              
              {/* Badge de Creador / Empresa */}
              {u.account_type && u.account_type !== 'personal' && (
                <span className={`account-badge ${u.account_type}`}>
                  {u.account_type === 'business' ? 'Empresa' : 'Creador'}
                </span>
              )}
            </div>

            {/* Categoría */}
            {u.category && (
              <p style={{ color: 'var(--accent)', fontSize: 14, marginBottom: 10, fontWeight: 500 }}>
                {u.category}
              </p>
            )}

            <div className="profile-stats">
              <span><strong>{posts.length}</strong> posts</span>
              <span><strong>{stats?.followers ?? 0}</strong> seguidores</span>
              <span><strong>{stats?.following ?? 0}</strong> siguiendo</span>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>{u?.bio || 'Sin biografía todavía.'}</p>
            
            {/* Enlaces */}
            {parsedLinks.length > 0 && (
              <div className="profile-links">
                {parsedLinks.map((link, i) => (
                  <a key={i} href={link.url} target="_blank" rel="noopener noreferrer" className="profile-link-btn">
                    {link.title}
                  </a>
                ))}
              </div>
            )}

            {/* Botón Editar (Solo si es mi perfil) */}
            {isMe && (
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '20px' }}>
                <Link to="/edit-profile" className="btn-tactical" style={{ textDecoration: 'none' }}>Editar Perfil</Link>
                <Link to="/settings" className="btn-tactical" style={{ textDecoration: 'none' }}>[ AJUSTES ]</Link>
                <Link to="/catalog/me" className="btn-tactical" style={{ textDecoration: 'none' }}>[ VER CATÁLOGO ]</Link>
              </div>
            )}
          </div>
        </div>

        <div className="profile-tabs">
          <div className={`profile-tab ${tab === 'posts' ? 'active' : ''}`} onClick={() => setTab('posts')}>Posts</div>
          <div className={`profile-tab ${tab === 'reels' ? 'active' : ''}`} onClick={() => setTab('reels')}>Reels</div>
          <div className={`profile-tab ${tab === 'streams' ? 'active' : ''}`} onClick={() => setTab('streams')}>Streams</div>
        </div>

        {tab === 'posts' && (
          <div>
            {mediaPosts.length > 0 && (
              <div className="profile-grid" style={{ marginBottom: 20 }}>
                {mediaPosts.map(p => (
                  <div key={p.id} className="profile-grid-item">
                    {p.video_url ? (
                      <video 
                        src={resolveAssetUrl(p.video_url)} 
                        controls 
                        onError={(e) => {
                          const parent = (e.target as HTMLElement).parentElement;
                          if (parent) parent.innerHTML = '<div style="width:100%;height:100%;display:flex;justify-content:center;align-items:center;color:#333;font-size:10px;font-family:monospace;background:#0f0f0f">[ SIN_VIDEO ]</div>';
                        }}
                      />
                    ) : p.image_url ? (
                      <img 
                        src={resolveAssetUrl(p.image_url)} 
                        alt="" 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                        onError={(e) => {
                          const parent = (e.target as HTMLElement).parentElement;
                          if (parent) parent.innerHTML = '<div style="width:100%;height:100%;display:flex;justify-content:center;align-items:center;color:#333;font-size:10px;font-family:monospace;background:#0f0f0f">[ SIN_IMG ]</div>';
                        }}
                      />
                    ) : (
                      <div style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#333', fontSize: '10px', fontFamily: 'monospace', background: '#0f0f0f' }}>[ NO_DATA ]</div>
                    )}
                  </div>
                ))}
              </div>
            )}
            {textPosts.map(p => (
              <PostCard key={p.id} post={p} />
            ))}
          </div>
        )}

        {tab === 'reels' && (
          <div className="profile-grid">
             {mediaPosts.filter(p => p.video_url).map(p => (
                <div key={p.id} className="profile-grid-item">
                  <video src={resolveAssetUrl(p.video_url)} />
                </div>
             ))}
          </div>
        )}

        {tab === 'streams' && (
          <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>
            Aún no hay transmisiones en vivo.
          </div>
        )}
      </div>
    
  );
}
