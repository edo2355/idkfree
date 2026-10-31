import { useState } from 'react';
import { 
  LiveKitRoom, 
  useTracks, 
  VideoTrack, 
  RoomAudioRenderer,
  ParticipantName
} from '@livekit/components-react';
import { Track } from 'livekit-client';
import '@livekit/components-styles';
import './GoLive.css';
import { api } from '../api/client';

function StudioLayout({ streamTitle, onStop }: { streamTitle: string, onStop: () => void }) {
  // Obtenemos las pistas de video de los participantes
  const tracks = useTracks([Track.Source.Camera]);
  const myTrack = tracks.find(t => t.participant.isLocal);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#050505', color: 'white' }}>
      
      {/* Header del Stream */}
      <div style={{ padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <div>
          <span style={{ background: '#ff4444', color: 'white', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold', marginRight: '10px' }}>
            🔴 EN VIVO
          </span>
          <strong style={{ fontSize: '18px' }}>{streamTitle || 'Transmisión sin título'}</strong>
        </div>
        <button onClick={onStop} style={{ background: 'transparent', color: '#ff4444', border: '1px solid #ff4444', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
          Terminar Stream
        </button>
      </div>

      {/* Área de Video Principal */}
      <div style={{ flex: 1, padding: '20px', display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
        <div style={{ width: '100%', maxWidth: '800px', aspectRatio: '16/9', background: '#111', borderRadius: '16px', overflow: 'hidden', border: '1px solid var(--accent)' }}>
          {myTrack ? (
            <VideoTrack trackRef={myTrack} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'gray' }}>
              Cámara apagada
            </div>
          )}
          
          {/* Nombre del Streamer */}
          <div style={{ position: 'absolute', bottom: '40px', left: '40px', background: 'rgba(0,0,0,0.6)', padding: '6px 12px', borderRadius: '8px', fontSize: '14px' }}>
            {myTrack && <ParticipantName participant={myTrack.participant} />}
          </div>
        </div>
      </div>

      {/* Barra de Controles Inferior */}
      <div style={{ padding: '20px', display: 'flex', justifyContent: 'center', gap: '15px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        {/* Aquí irían los botones de mute, cam, etc., que ya vienen en el VideoConference, pero ahora los estilizamos a nuestro gusto */}
        <div style={{ color: 'gray', fontSize: '14px' }}>Micrófono: Encendido 🎙️</div>
        <div style={{ color: 'gray', fontSize: '14px' }}>Cámara: Encendida 📷</div>
        <div style={{ color: 'gray', fontSize: '14px' }}>Espectadores: 0 👁️</div>
      </div>
      
      <RoomAudioRenderer />
    </div>
  );
}

export default function GoLive() {
  const [token, setToken] = useState<string | null>(null);
  const [url, setUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [streamTitle, setStreamTitle] = useState('');

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
    setStreamTitle('');
  };

  // Pantalla previa (Setup)
  if (!token || !url) {
    return (
      <div style={{ padding: 40, textAlign: 'center', color: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#050505' }}>
        <h1 style={{ color: 'var(--accent)', fontSize: '32px', marginBottom: '20px' }}>Configurar Transmisión</h1>
        {error && <p style={{ color: '#ff4444', background: 'rgba(255,68,68,0.1)', padding: '10px', borderRadius: '8px' }}>{error}</p>}
        
        <input 
          type="text" 
          placeholder="Título de tu transmisión (ej: Jugando Minecraft)" 
          value={streamTitle}
          onChange={(e) => setStreamTitle(e.target.value)}
          style={{ padding: '12px 16px', width: '100%', maxWidth: '400px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.05)', color: 'white', marginBottom: '20px' }}
        />

        <button onClick={startStream} disabled={loading} style={{ padding: '14px 32px', fontSize: '16px', background: 'var(--accent)', color: '#050505', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
          {loading ? 'Conectando...' : '🔴 Iniciar Transmisión'}
        </button>
      </div>
    );
  }

  return (
    <LiveKitRoom
      token={token}
      serverUrl={url}
      connect={true}
      video={true}
      audio={true}
      options={{
        dynacast: true,
        adaptiveStream: true,
        publishDefaults: { simulcast: true },
        // @ts-ignore
        rtcConfig: { iceTransportPolicy: 'relay' }
      }}
    >
      <StudioLayout streamTitle={streamTitle} onStop={stopStream} />
    </LiveKitRoom>
  );
}
