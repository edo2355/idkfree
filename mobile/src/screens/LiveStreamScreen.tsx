import { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { LiveKitRoom, VideoTrack, useTracks, useRoomContext, ConnectOptions, AudioSession, AndroidAudioTypePresets } from '@livekit/react-native';
import { Track, RoomEvent, ConnectionState, VideoPresets } from 'livekit-client';
import { useTheme } from '../stores/themeStore';
import { fonts } from '../theme/fonts';
import { api } from '../api/client';
import { ErrorLogger, logConnectionEvent } from '../utils/errorLogger';

export function LiveStreamScreen() {
  const theme = useTheme();
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const roomName = route.params?.roomName || `live-${Date.now()}`;
  const isHost = route.params?.isHost ?? true;

  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [connectionState, setConnectionState] = useState<string>('Conectando...');

  // Configuración de audio para llamadas (VoIP) y evitar eco
  useEffect(() => {
    async function setupAudio() {
      try {
        await AudioSession.configureAudio({
          android: {
            audioTypeOptions: AndroidAudioTypePresets.communication,
          },
        });
        await AudioSession.startAudioSession();
      } catch (e) {
        logConnectionEvent('Error configurando audio', e);
      }
    }
    setupAudio();

    return () => {
      AudioSession.stopAudioSession().catch(() => {});
    };
  }, []);

  useEffect(() => {
    async function getToken() {
      try {
        logConnectionEvent('Solicitando token', { roomName, isHost });
        const res = await api.livekit.getToken(roomName, isHost);
        setToken(res.token);
      } catch (err: any) {
        setError(err.message || 'Error al conectar al servidor');
        ErrorLogger.log('TOKEN ERROR: ' + err.message);
      }
    }
    getToken();
  }, [roomName]);

  const handleDisconnect = () => {
    navigation.goBack();
  };

  if (error) {
    return (
      <View style={{ flex: 1, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center', padding: 20 }}>
        <Text style={{ color: theme.danger, fontFamily: fonts.medium, textAlign: 'center', fontSize: 16 }}>{error}</Text>
        <TouchableOpacity onPress={handleDisconnect} style={{ marginTop: 20, padding: 15, backgroundColor: theme.surface, borderRadius: 10 }}>
          <Text style={{ color: '#FFF', fontWeight: 'bold' }}>Volver</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!token) {
    return (
      <View style={{ flex: 1, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator color={theme.accent} size="large" />
        <Text style={{ color: '#FFF', fontFamily: fonts.medium, marginTop: 12 }}>Conectando al servidor...</Text>
      </View>
    );
  }

  const connectOptions: ConnectOptions = {
    videoCaptureDefaults: {
      resolution: VideoPresets.h360.resolution,
    },
    rtcConfig: {
      iceTransportPolicy: 'all',
    },
    publishDefaults: {
      simulcast: true,
    },
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#000' }}>
      <LiveKitRoom
        token={token}
        serverUrl="wss://idkfree-j8j98whs.livekit.cloud"
        connect={true}
        audio={isHost}
        video={isHost}
        options={connectOptions}
        onConnected={() => { setConnectionState('Conectado'); logConnectionEvent('LiveKitRoom Conectado'); }}
        onDisconnected={(reason) => {
          logConnectionEvent('LiveKitRoom Desconectado', reason);
        }}
        onError={(e) => {
          setError('Error de LiveKit: ' + e.message);
          ErrorLogger.log('LIVEKIT ROOM ERROR: ' + e.message);
        }}
      >
        <StreamUI isHost={isHost} roomName={roomName} onClose={handleDisconnect} connectionState={connectionState} setConnectionState={setConnectionState} />
      </LiveKitRoom>
    </View>
  );
}

function StreamUI({ isHost, roomName, onClose, connectionState, setConnectionState }: { isHost: boolean, roomName: string, onClose: () => void, connectionState: string, setConnectionState: (s: string) => void }) {
  const theme = useTheme();
  const room = useRoomContext();
  const tracks = useTracks([Track.Source.Camera]);
  
  const localCamera = tracks.find(t => t.participant.isLocal);
  const remoteCamera = tracks.find(t => !t.participant.isLocal);
  
  const mainCamera = isHost ? localCamera : remoteCamera;
  const miniCamera = isHost ? remoteCamera : localCamera;

  useEffect(() => {
    if (!room) return;

    const handleConnectionStateChanged = (state: ConnectionState) => {
      setConnectionState(state);
      logConnectionEvent('Estado de conexión cambiado', state);
    };

    room.on(RoomEvent.ConnectionStateChanged, handleConnectionStateChanged);
    return () => {
      room.off(RoomEvent.ConnectionStateChanged, handleConnectionStateChanged);
    };
  }, [room]);

  return (
    <View style={{ flex: 1 }}>
      {mainCamera ? (
        <VideoTrack 
          trackRef={mainCamera} 
          style={StyleSheet.absoluteFill} 
          objectFit="cover"
        />
      ) : (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator color={theme.accent} size="large" />
          <Text style={{ color: '#FFF', marginTop: 10, fontFamily: fonts.medium }}>
            {isHost ? 'Iniciando cámara...' : 'Esperando video del host...'}
          </Text>
        </View>
      )}

      {miniCamera && (
        <View style={{
          position: 'absolute',
          top: 80,
          right: 20,
          width: 110,
          height: 160,
          borderRadius: 12,
          overflow: 'hidden',
          borderWidth: 2,
          borderColor: 'rgba(255,255,255,0.4)',
          zIndex: 10,
          backgroundColor: '#000'
        }}>
          <VideoTrack 
            trackRef={miniCamera} 
            style={{ flex: 1 }} 
            objectFit="cover"
          />
        </View>
      )}

      <View style={{ position: 'absolute', top: 50, left: 20, right: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.6)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 }}>
          <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: connectionState === 'connected' ? '#4ade80' : '#facc15', marginRight: 8 }} />
          <Text style={{ color: '#FFF', fontFamily: fonts.medium, fontSize: 12 }}>
            {connectionState === 'connected' ? 'EN VIVO' : connectionState.toUpperCase()}
          </Text>
        </View>
        <TouchableOpacity onPress={onClose} style={{ backgroundColor: 'rgba(0,0,0,0.6)', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 }}>
          <Text style={{ color: '#FFF', fontFamily: fonts.medium }}>Cerrar</Text>
        </TouchableOpacity>
      </View>

      <View style={{ position: 'absolute', bottom: 40, left: 20, right: 20 }}>
        <Text style={{ color: '#FFF', fontFamily: fonts.medium, fontSize: 18 }}>{isHost ? 'Transmitiendo' : 'Viendo'}</Text>
        <Text style={{ color: 'rgba(255,255,255,0.7)', fontFamily: fonts.regular, fontSize: 14 }}>Sala: {roomName}</Text>
      </View>
    </View>
  );
}
