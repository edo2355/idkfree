import { Link } from 'react-router-dom';

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

export function PostCard({ post }: { post: Post }) {
  const date = new Date(post.created_at);
  const timeAgo = getTimeAgo(date);

  return (
    <article
      style={{
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-lg)',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
      }}
    >
      <header style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: '50%',
            background: 'var(--color-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 18,
          }}
        >
          {post.author_name?.[0]?.toUpperCase() ?? '?'}
        </div>
        <div>
          <Link
            to={`/u/${post.author_alias}`}
            style={{ fontWeight: 600, color: 'var(--color-text)' }}
          >
            {post.author_name ?? post.author_alias}
          </Link>
          <div style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>
            @{post.author_alias} · {timeAgo}
          </div>
        </div>
      </header>

      {post.body && (
        <p style={{ whiteSpace: 'pre-wrap', lineHeight: 1.5 }}>{post.body}</p>
      )}

      {post.image_url && (
        <img
          src={post.image_url}
          alt=""
          style={{
            width: '100%',
            borderRadius: 'var(--radius)',
            maxHeight: 400,
            objectFit: 'cover',
          }}
        />
      )}
    </article>
  );
}

function getTimeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return 'ahora';
  if (seconds < 3600) return `hace ${Math.floor(seconds / 60)} min`;
  if (seconds < 86400) return `hace ${Math.floor(seconds / 3600)} h`;
  if (seconds < 604800) return `hace ${Math.floor(seconds / 86400)} d`;
  return date.toLocaleDateString('es-ES');
}