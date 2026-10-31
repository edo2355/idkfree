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
      const roomName = `live-${Date.now()}`;
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
      <div style={{ padding: 40, textAlign: 'center', color: 'white' }}>
        <h1>Transmisión en Vivo</h1>
        {error && <p style={{ color: '#ff4444' }}>{error}</p>}
        <button onClick={startStream} disabled={loading} style={{ padding: '12px 24px', fontSize: 16, background: '#ff4444', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer' }}>
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
            // @ts-ignore - rtcConfig es válido en LiveKit pero falta en los tipos de React
            rtcConfig: {
              iceTransportPolicy: 'relay', // Evita VPN en Cuba
            },
          }}
        >
          <VideoConference />
        </LiveKitRoom>
      </div>
    </div>
  );
}
