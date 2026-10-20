import { useState, useEffect } from 'react';

export default function Dashboard() {
  const [stats, setStats] = useState({ users: 0, streams: 0, messages: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const token = localStorage.getItem('@idk_cpanel_token');
        const res = await fetch('https://idkfree-api-edo.fly.dev/api/admin/stats', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (res.ok) {
          const data = await res.json();
          setStats({
            users: data.total_users || 0,
            streams: data.total_posts || 0,
            messages: data.total_messages || 0
          });
        }
      } catch (error) {
        console.error('Error cargando estadísticas', error);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  return (
    <div>
      <h1 style={{ fontSize: '28px', marginBottom: '20px' }}>Resumen General</h1>
      <div style={{ display: 'flex', gap: '20px' }}>
        
        <div style={{ flex: 1, background: '#181b21', padding: '20px', borderRadius: '10px', border: '1px solid #2a2e39' }}>
          <p style={{ color: '#a0a5b1', margin: 0, fontSize: '14px' }}>Usuarios Totales</p>
          <h2 style={{ margin: '10px 0 0 0', fontSize: '32px', color: '#00f2fe' }}>
            {loading ? '...' : stats.users}
          </h2>
        </div>

        <div style={{ flex: 1, background: '#181b21', padding: '20px', borderRadius: '10px', border: '1px solid #2a2e39' }}>
          <p style={{ color: '#a0a5b1', margin: 0, fontSize: '14px' }}>Posts Totales</p>
          <h2 style={{ margin: '10px 0 0 0', fontSize: '32px', color: '#00f2fe' }}>
            {loading ? '...' : stats.streams}
          </h2>
        </div>

        <div style={{ flex: 1, background: '#181b21', padding: '20px', borderRadius: '10px', border: '1px solid #2a2e39' }}>
          <p style={{ color: '#a0a5b1', margin: 0, fontSize: '14px' }}>Mensajes Hoy</p>
          <h2 style={{ margin: '10px 0 0 0', fontSize: '32px', color: '#00f2fe' }}>
            {loading ? '...' : stats.messages}
          </h2>
        </div>

      </div>
    </div>
  );
}
