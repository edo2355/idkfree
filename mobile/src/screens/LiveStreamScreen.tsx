import { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { LiveKitRoom, VideoTrack, useTracks } from '@livekit/react-native';
import { Track } from 'livekit-client';
import { useTheme } from '../stores/themeStore';
import { fonts } from '../theme/fonts';
import { api } from '../api/client';
import { ErrorLogger } from '../utils/errorLogger';

export function LiveStreamScreen() {
  const theme = useTheme();
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const roomName = route.params?.roomName || `live-${Date.now()}`;
  const isHost = route.params?.isHost ?? true;
  
  const [token, setToken] = useState<string | null>(null);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    async function getToken() {
      try {
        const res = await api.livekit.getToken(roomName, isHost);
        setToken(res.token);
      } catch (err: any) {
        setError(err.message || 'Error de token');
        ErrorLogger.log('TOKEN ERROR: ' + err.message);
      }
    }
    getToken();
  }, [roomName]);

  if (error) {
    return (
      <View style={{ flex: 1, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center', padding: 20 }}>
        <Text style={{ color: theme.danger, fontFamily: fonts.medium, textAlign: 'center' }}>{error}</Text>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginTop: 20, padding: 10, backgroundColor: theme.surface }}>
          <Text style={{ color: '#FFF' }}>Volver</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!token) {
    return (
      <View style={{ flex: 1, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator color={theme.accent} size="large" />
        <Text style={{ color: '#FFF', fontFamily: fonts.medium, marginTop: 12 }}>Conectando al estudio...</Text>
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
        video={true}
        onDisconnected={() => navigation.goBack()}
        onConnected={() => setTimeout(() => setIsCameraReady(true), 1500)}
      >
        <StreamUI roomName={roomName} onClose={() => navigation.goBack()} isCameraReady={isCameraReady} />
      </LiveKitRoom>
    </View>
  );
}

function StreamUI({ roomName, onClose, isCameraReady }: { roomName: string, onClose: () => void, isCameraReady: boolean }) {
  const theme = useTheme();
  const tracks = useTracks([Track.Source.Camera]);
  const localCamera = tracks.find(t => t.participant.isLocal);

  return (
    <View style={{ flex: 1 }}>
      {localCamera && isCameraReady ? (
        <VideoTrack trackRef={localCamera} style={StyleSheet.absoluteFill} />
      ) : (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ color: '#FFF' }}>Iniciando cámara...</Text>
        </View>
      )}
      <View style={{ position: 'absolute', top: 50, left: 20, right: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.6)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 }}>
          <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: theme.danger, marginRight: 8 }} />
          <Text style={{ color: '#FFF', fontFamily: fonts.medium, fontSize: 12 }}>EN VIVO</Text>
        </View>
        <TouchableOpacity onPress={onClose} style={{ backgroundColor: 'rgba(0,0,0,0.6)', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 }}>
          <Text style={{ color: '#FFF', fontFamily: fonts.medium }}>Cerrar</Text>
        </TouchableOpacity>
      </View>
      <View style={{ position: 'absolute', bottom: 40, left: 20, right: 20 }}>
        <Text style={{ color: '#FFF', fontFamily: fonts.medium, fontSize: 18 }}>Transmitiendo en vivo</Text>
        <Text style={{ color: 'rgba(255,255,255,0.7)', fontFamily: fonts.regular, fontSize: 14 }}>Sala: {roomName}</Text>
      </View>
    </View>
  );
}
