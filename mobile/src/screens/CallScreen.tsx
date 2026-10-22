import { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { LiveKitRoom, VideoTrack, useTracks, useRoomContext } from '@livekit/react-native';
import { Track } from 'livekit-client';
import { useAuthStore } from '../stores/authStore';
import { api } from '../api/client';
import { fonts } from '../theme/fonts';

export function CallScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { targetUserId, type } = route.params;
  const myToken = useAuthStore((s) => s.token);

  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    async function getToken() {
      try {
        // Hacemos la petición a nuestro nuevo endpoint
        const res = await fetch(`https://idkfreegetid.dpdns.org/api/calls/token?targetUserId=${targetUserId}`, {
          headers: { Authorization: `Bearer ${myToken}` }
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        setToken(data.token);
      } catch (err: any) {
        setError(err.message);
      }
    }
    getToken();
  }, [targetUserId]);

  if (error) {
    return (
      <View style={{ flex: 1, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: 'red', marginBottom: 20 }}>{error}</Text>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 15, backgroundColor: '#333', borderRadius: 10 }}>
          <Text style={{ color: '#FFF' }}>Volver</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!token) {
    return (
      <View style={{ flex: 1, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#00f2fe" />
        <Text style={{ color: '#FFF', marginTop: 10 }}>Conectando llamada...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#000' }}>
      <LiveKitRoom
        token={token}
        serverUrl="wss://idkfree-j8j98whs.livekit.cloud"
        connect={true}
        audio={true}
        video={type === 'video'} // Si es audio, no encendemos cámara
        onDisconnected={() => navigation.goBack()}
      >
        <CallUI type={type} onClose={() => navigation.goBack()} />
      </LiveKitRoom>
    </View>
  );
}

function CallUI({ type, onClose }: { type: string, onClose: () => void }) {
  const room = useRoomContext();
  const tracks = useTracks([Track.Source.Camera]);
  const remoteTrack = tracks.find(t => !t.participant.isLocal);
  const localTrack = tracks.find(t => t.participant.isLocal);

  return (
    <View style={{ flex: 1 }}>
      {/* Video remoto (pantalla completa) */}
      {remoteTrack && type === 'video' ? (
        <VideoTrack trackRef={remoteTrack} style={{ flex: 1 }} />
      ) : (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ color: '#FFF', fontSize: 20, fontFamily: fonts.displayBoldItalic }}>
            {type === 'audio' ? '📞 Llamada de voz' : 'Esperando video...'}
          </Text>
        </View>
      )}

      {/* Video local (esquina) */}
      {localTrack && type === 'video' && (
        <View style={{ position: 'absolute', top: 50, right: 20, width: 100, height: 150, borderRadius: 10, overflow: 'hidden', borderWidth: 2, borderColor: '#FFF' }}>
          <VideoTrack trackRef={localTrack} style={{ flex: 1 }} />
        </View>
      )}

      {/* Botón Colgar */}
      <View style={{ position: 'absolute', bottom: 40, width: '100%', alignItems: 'center' }}>
        <TouchableOpacity onPress={onClose} style={{ backgroundColor: '#EF4444', width: 70, height: 70, borderRadius: 35, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ color: '#FFF', fontSize: 24, fontWeight: 'bold' }}>✕</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
