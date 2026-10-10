import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api, ApiError } from '../api/client';
import { Layout } from '../components/Layout';
import { PostCard } from '../components/PostCard';

export function Profile() {
  const { alias } = useParams<{ alias: string }>();
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function load() {
      if (!alias) return;
      setLoading(true);
      try {
        // Primero buscamos el usuario por alias (el backend no tiene
        // endpoint directo, usamos /api/users/:alias después de añadirlo)
        // Por ahora mostramos solo los posts del usuario actual.
        const res = await api.posts.feed({ limit: 50 });
        setPosts(res.posts.filter((p: any) => p.author_alias === alias));
      } catch (err) {
        if (err instanceof ApiError) setError(err.message);
        else setError('Error de conexión');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [alias]);

  return (
    <Layout>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div
          style={{
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-lg)',
            padding: 24,
            textAlign: 'center',
          }}
        >
          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              background: 'var(--color-border)',
              margin: '0 auto 12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 32,
            }}
          >
            {alias?.[0]?.toUpperCase() ?? '?'}
          </div>
          <h1 style={{ fontSize: 20, fontWeight: 600 }}>@{alias}</h1>
        </div>

        {loading && (
          <div style={{ textAlign: 'center', color: 'var(--color-text-muted)' }}>
            Cargando...
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
            Este usuario aún no ha publicado nada.
          </div>
        )}

        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </Layout>
  );
}