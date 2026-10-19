import { useEffect, useState } from 'react';
import { api } from '../api/client';
import { PostCard } from '../components/PostCard';
import { NotesRow } from '../components/NotesRow';
import { Layout } from '../components/Layout';
import './Feed.css';

export function Feed() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadFeed() {
      try {
        const res = await api.posts.feed({ limit: 20 });
        setPosts(res.posts);
      } catch (err: any) {
        setError(err.message || 'Error cargando el feed');
      } finally {
        setLoading(false);
      }
    }
    loadFeed();
  }, []);

  return (
    <Layout>
      <div className="feed-container" style={{ maxWidth: '600px', margin: '0 auto', width: '100%', borderLeft: '1px solid var(--border)', borderRight: '1px solid var(--border)' }}>
        <NotesRow />
        {loading ? (
          <div className="feed-loading">Cargando feed...</div>
        ) : error ? (
          <div className="feed-error">{error}</div>
        ) : posts.length === 0 ? (
          <div className="feed-empty">No hay publicaciones aún.</div>
        ) : (
          posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))
        )}
      </div>
    </Layout>
  );
}
