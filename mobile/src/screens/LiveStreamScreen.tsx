import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { LiveKitRoom, VideoTrack, useTracks } from '@livekit/react-native';
import { Track } from 'livekit-client';

// Servidores TURN de Metered (para saltar bloqueo en Cuba)
const TURN_SERVERS = [
  { urls: 'turn:global.relay.metered.ca:80', username: 'e8d6c68b5f0a1cf42c9f7e6f', credential: 'f8h3K2j9L1m4' },
  { urls: 'turn:global.relay.metered.ca:443', username: 'e8d6c68b5f0a1cf42c9f7e6f', credential: 'f8h3K2j9L1m4' },
  { urls: 'turns:global.relay.metered.ca:443?transport=tcp', username: 'e8d6c68b5f0a1cf42c9f7e6f', credential: 'f8h3K2j9L1m4' },
];

const rtcConfig = { iceServers: TURN_SERVERS };

export function LiveStreamScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { roomName, isHost } = route.params || { roomName: 'test', isHost: false };
  
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Aquí deberías pedir el token a tu backend
    // Por ahora, simulamos que obtenemos el token
    async function fetchToken() {
      try {
        // TODO: Reemplazar con la llamada real a tu backend
        // const res = await fetch(`https://idkfreegetid.dpdns.org/api/live/token?room=${roomName}&isHost=${isHost}`);
        // const data = await res.json();
        // setToken(data.token);
        
        // Simulamos un token para que la pantalla compile y muestre la UI
        setToken('simulated_token_reemplazar'); 
      } catch (e) {
        setError('Error al conectar con el servidor.');
      }
    }
    fetchToken();
  }, [roomName, isHost]);

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>[ ERROR: {error} ]</Text>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.btn}>
          <Text style={styles.btnText}>VOLVER</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!token) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#00E5FF" />
        <Text style={styles.loadingText}>CONECTANDO A LIVEKIT...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LiveKitRoom
        token={token}
        serverUrl="wss://idkfree.livekit.cloud" // Cambia esto por tu URL de LiveKit
        connect={true}
        audio={true}
        video={isHost}
        options={{ rtcConfig }}
        style={styles.room}
      >
        <View style={styles.hud}>
          <Text style={styles.hudText}>[ LIVE: {roomName} ]</Text>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.hudClose}>[ X ]</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.infoText}>LiveKit conectado (Cámara activa si eres Host)</Text>
      </LiveKitRoom>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0a', justifyContent: 'center', alignItems: 'center' },
  room: { flex: 1, width: '100%' },
  hud: { position: 'absolute', top: 50, left: 20, right: 20, flexDirection: 'row', justifyContent: 'space-between', zIndex: 10 },
  hudText: { color: '#00E5FF', fontFamily: 'monospace', fontSize: 12 },
  hudClose: { color: '#ff0044', fontFamily: 'monospace', fontSize: 16, fontWeight: 'bold' },
  infoText: { color: '#fff', fontFamily: 'monospace', marginTop: 20 },
  errorText: { color: '#ff0044', fontFamily: 'monospace', marginBottom: 20 },
  loadingText: { color: '#00E5FF', fontFamily: 'monospace', marginTop: 10 },
  btn: { borderWidth: 1, borderColor: '#00E5FF', padding: 10, borderRadius: 8 },
  btnText: { color: '#00E5FF', fontFamily: 'monospace' }
});
