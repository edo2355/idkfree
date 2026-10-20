import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client';
import { resolveAssetUrl } from '../utils/assetUrl';
import { Layout } from '../components/Layout';
import './Search.css';

export function Search() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setSearched(false);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await api.search.users(query);
        setResults(res.users || []);
        setSearched(true);
      } catch (err) {
        console.error('Error buscando:', err);
      } finally {
        setLoading(false);
      }
    }, 500); // Espera 500ms después de dejar de escribir

    return () => clearTimeout(timer);
  }, [query]);

  async function toggleFollow(userId: string, isFollowing: boolean) {
    try {
      if (isFollowing) {
        await api.follows.unfollow(userId);
      } else {
        await api.follows.follow(userId);
      }
      // Actualizamos la lista visualmente
      setResults(results.map(u => 
        u.id === userId ? { ...u, is_following: !isFollowing } : u
      ));
    } catch (err) {
      alert('Error al seguir/dejar de seguir');
    }
  }

  return (
    <Layout>
      <div className="search-container">
        <div className="search-header">
          <h1>Explorar</h1>
          <div className="search-bar">
            <span className="search-icon">🔍</span>
            <input 
              type="text" 
              placeholder="Buscar usuarios por alias o nombre..." 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoFocus
            />
          </div>
        </div>

        <div className="search-results">
          {loading ? (
            <div className="search-status">Buscando...</div>
          ) : searched && results.length === 0 ? (
            <div className="search-status">No se encontraron usuarios con "{query}"</div>
          ) : (
            results.map(user => (
              <div key={user.id} className="user-card">
                <Link to={`/u/${user.alias}`} className="user-info">
                  <img 
                    src={user.avatar_url ? resolveAssetUrl(user.avatar_url) : `https://ui-avatars.com/api/?name=${user.alias}&background=1A1A1A&color=A855F7`} 
                    alt={user.alias} 
                    className="user-avatar" 
                  />
                  <div className="user-details">
                    <span className="user-name">{user.name || user.alias}</span>
                    <span className="user-alias">@{user.alias}</span>
                  </div>
                </Link>
                <button 
                  className={`follow-btn ${user.is_following ? 'following' : ''}`}
                  onClick={() => toggleFollow(user.id, user.is_following)}
                >
                  {user.is_following ? 'Siguiendo' : 'Seguir'}
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </Layout>
  );
}
