import { useEffect, useState } from 'react';
import { api, ApiError } from '../api/client';
import { Layout } from '../components/Layout';
import { PostCard } from '../components/PostCard';
import { Button } from '../components/Button';

interface Post {
  id: string;
  author_id: string;
  author_alias: string;
  author_name: string | null;
  author_avatar: string | null;
  body: string | null;
  image_url: string | null;
  created_at: string;
}

export function Feed() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newBody, setNewBody] = useState('');
  const [posting, setPosting] = useState(false);

  async function loadFeed() {
    setLoading(true);
    setError('');
    try {
      const res = await api.posts.feed({ limit: 50 });
      setPosts(res.posts);
    } catch (err) {
      if (err instanceof ApiError) setError(err.message);
      else setError('Error de conexión');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadFeed();
  }, []);

  async function handleCreatePost(e: React.FormEvent) {
    e.preventDefault();
    if (!newBody.trim()) return;
    setPosting(true);

    try {
      await api.posts.create({ body: newBody.trim(), visibility: 'followers' });
      setNewBody('');
      await loadFeed();
    } catch (err) {
      if (err instanceof ApiError) setError(err.message);
      else setError('Error de conexión');
    } finally {
      setPosting(false);
    }
  }

  return (
    <Layout>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {/* Crear post */}
        <form
          onSubmit={handleCreatePost}
          style={{
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-lg)',
            padding: 16,
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
          }}
        >
          <textarea
            value={newBody}
            onChange={(e) => setNewBody(e.target.value)}
            placeholder="¿Qué estás pensando?"
            maxLength={5000}
            rows={3}
            style={{
              padding: 12,
              fontSize: 15,
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius)',
              background: 'var(--color-bg)',
              color: 'var(--color-text)',
              resize: 'vertical',
              fontFamily: 'inherit',
            }}
          />
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button type="submit" loading={posting} disabled={!newBody.trim()}>
              Publicar
            </Button>
          </div>
        </form>

        {/* Feed */}
        {loading && (
          <div style={{ textAlign: 'center', color: 'var(--color-text-muted)' }}>
            Cargando feed...
          </div>
        )}

        {error && (
          <div
            style={{
              padding: 12,
              background: '#FEE',
              color: 'var(--color-danger)',
              borderRadius: 'var(--radius)',
            }}
          >
            {error}
          </div>
        )}

        {!loading && posts.length === 0 && (
          <div
            style={{
              textAlign: 'center',
              padding: 40,
              color: 'var(--color-text-muted)',
            }}
          >
            <p style={{ fontSize: 48 }}>👋</p>
            <p style={{ marginTop: 12 }}>
              Tu feed está vacío. Sigue a alguien para que esto tenga vida.
            </p>
          </div>
        )}

        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </Layout>
  );
}