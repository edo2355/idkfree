import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../api/client';
import { resolveAssetUrl } from '../utils/assetUrl';
import { PostCard } from '../components/PostCard';
import { Layout } from '../components/Layout';
import './Profile.css';

type Tab = 'posts' | 'reels' | 'streams';

export function Profile() {
  const { alias } = useParams();
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

  if (loading || !profile) return <Layout><div style={{ padding: 40, color: 'white' }}>Cargando perfil...</div></Layout>;

  const u = profile.user;
  const stats = profile.stats;

  const mediaPosts = posts.filter((p: any) => p.image_url || p.video_url);
  const textPosts = posts.filter((p: any) => !p.image_url && !p.video_url);

  return (
    <Layout>
      <div className="profile-container">
        <div className="profile-header">
          <img 
            src={u.avatar_url ? resolveAssetUrl(u.avatar_url) : `https://ui-avatars.com/api/?name=${u.alias}&background=1A1A1A&color=A855F7&size=200`} 
            alt={u.alias} 
            className="profile-avatar-large" 
          />
          <div className="profile-info">
            <div className="profile-username">
              {u.name || u.alias} <span style={{ color: 'var(--text-muted)' }}>@{u.alias}</span>
            </div>
            <div className="profile-stats">
              <span><strong>{posts.length}</strong> publicaciones</span>
              <span><strong>{stats?.followers ?? 0}</strong> seguidores</span>
              <span><strong>{stats?.following ?? 0}</strong> siguiendo</span>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>{u.bio || 'Sin biografía todavía.'}</p>
          </div>
        </div>

        <div className="profile-tabs">
          <div className={`profile-tab ${tab === 'posts' ? 'active' : ''}`} onClick={() => setTab('posts')}>Posts</div>
          <div className={`profile-tab ${tab === 'reels' ? 'active' : ''}`} onClick={() => setTab('reels')}>Reels</div>
          <div className={`profile-tab ${tab === 'streams' ? 'active' : ''}`} onClick={() => setTab('streams')}>Streams</div>
        </div>

        {/* Contenido de las Pestañas */}
        {tab === 'posts' && (
          <div>
            {mediaPosts.length > 0 && (
              <div className="profile-grid" style={{ marginBottom: 20 }}>
                {mediaPosts.map(p => (
                  <div key={p.id} className="profile-grid-item">
                    {p.video_url ? (
                      <video src={resolveAssetUrl(p.video_url)} />
                    ) : (
                      <img src={resolveAssetUrl(p.image_url)} alt="post" />
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
    </Layout>
  );
}
