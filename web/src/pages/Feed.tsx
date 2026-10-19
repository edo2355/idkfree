import { useEffect, useState } from 'react';
import { api } from '../api/client';
import { PostCard } from '../components/PostCard';
import { NotesRow } from '../components/NotesRow';
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

  if (loading) return <div className="feed-loading">Cargando feed...</div>;
  if (error) return <div className="feed-error">{error}</div>;
  if (posts.length === 0) return <div className="feed-empty">No hay publicaciones aún.</div>;

  return (
    <div className="feed-container">
      <NotesRow />
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
