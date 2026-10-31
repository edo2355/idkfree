import { useState } from 'react';
import { LiveKitRoom, VideoConference } from '@livekit/components-react';
import '@livekit/components-styles';
import { api } from '../api/client';

export default function GoLive() {
  const [token, setToken] = useState<string | null>(null);
  const [url, setUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startStream = async () => {
    setLoading(true);
    setError(null);
    try {
      const roomName = `live-${Date.now()}`; // Sala única por transmisión
      const res = await api.livekit.getToken(roomName, true);
      
      if (!res.token || !res.url) throw new Error('Token o URL inválidos');
      
      setToken(res.token);
      setUrl(res.url);
    } catch (err: any) {
      setError(err.message || 'Error al iniciar la transmisión');
    } finally {
      setLoading(false);
    }
  };

  const stopStream = () => {
    setToken(null);
    setUrl(null);
  };

  if (!token || !url) {
    return (
      <div style={{ padding: 40, textAlign: 'center' }}>
        <h1>Transmisión en Vivo</h1>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button onClick={startStream} disabled={loading} style={{ padding: '10px 20px', fontSize: 16 }}>
          {loading ? 'Conectando...' : '🔴 Iniciar Transmisión'}
        </button>
      </div>
    );
  }

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: 10, background: '#111', textAlign: 'center' }}>
        <button onClick={stopStream} style={{ background: '#ff4444', color: 'white', padding: '8px 16px', border: 'none', borderRadius: 6, cursor: 'pointer' }}>
          🛑 Terminar Transmisión
        </button>
      </div>
      
      <div style={{ flex: 1 }}>
        <LiveKitRoom
          token={token}
          serverUrl={url}
          connect={true}
          video={true}
          audio={true}
          options={{
            dynacast: true,
            adaptiveStream: true,
            publishDefaults: {
              simulcast: true,
            },
            rtcConfig: {
              // 🔥 FUERZA EL USO DE TURN/TCP 443 (Evita la VPN en Cuba) 🔥
              iceTransportPolicy: 'relay', 
            },
          }}
        >
          <VideoConference />
        </LiveKitRoom>
      </div>
    </div>
  );
}
