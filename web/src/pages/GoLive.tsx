import { useState, useEffect } from 'react';
import { LiveKitRoom, VideoConference } from '@livekit/components-react';
import '@livekit/components-styles';
import { useNavigate } from 'react-router-dom';

export default function GoLive() {
  const [token, setToken] = useState<string | null>(null);
  const [roomName, setRoomName] = useState('');
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  async function startStream(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    const newRoomName = `web-live-${Date.now()}`;
    setRoomName(newRoomName);

    try {
      const userToken = localStorage.getItem('@idkfree_token'); // Asumiendo que guardas el token así
      
      const res = await fetch(`https://idkfreegetid.dpdns.org/api/livekit/token?roomName=${newRoomName}&isHost=true`, {
        headers: { 'Authorization': `Bearer ${userToken}` }
      });
      
      if (!res.ok) throw new Error('Error al obtener el token de transmisión');
      
      const data = await res.json();
      setToken(data.token);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (token) {
    return (
      <div style={{ height: '100vh', background: '#000' }} data-lk-theme="default">
        <LiveKitRoom
          video={true}
          audio={true}
          token={token}
          serverUrl="wss://idkfree-j8j98whs.livekit.cloud"
          onDisconnected={() => { setToken(null); navigate('/'); }}
        >
          <VideoConference />
        </LiveKitRoom>
      </div>
    );
  }

  return (
    <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0f1115', color: '#fff' }}>
      <form onSubmit={startStream} style={{ background: '#181b21', padding: '40px', borderRadius: '12px', border: '1px solid #2a2e39', width: '400px' }}>
        <h2 style={{ color: '#00f2fe', textAlign: 'center', marginBottom: '20px' }}>Transmitir desde PC</h2>
        
        {error && <div style={{ background: '#ff4d4f22', color: '#ff4d4f', padding: '10px', marginBottom: '15px', borderRadius: '6px' }}>{error}</div>}
        
        <label style={{ display: 'block', marginBottom: '5px', color: '#a0a5b1' }}>Título de la transmisión:</label>
        <input 
          type="text" 
          value={title} 
          onChange={e => setTitle(e.target.value)} 
          placeholder="Ej: Jugando con los panas"
          required
          style={{ width: '100%', padding: '12px', background: '#0f1115', border: '1px solid #2a2e39', color: '#fff', borderRadius: '6px', marginBottom: '20px', boxSizing: 'border-box' }}
        />

        <button type="submit" disabled={loading} style={{ width: '100%', padding: '15px', background: '#ff4d4f', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>
          {loading ? 'Conectando...' : '🔴 Iniciar Transmisión en Vivo'}
        </button>
      </form>
    </div>
  );
}
