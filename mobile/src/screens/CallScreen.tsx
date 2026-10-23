import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { LiveKitRoom } from '@livekit/react-native';

const TURN_SERVERS = [
  { urls: 'turns:global.relay.metered.ca:443?transport=tcp', username: 'e8d6c68b5f0a1cf42c9f7e6f', credential: 'f8h3K2j9L1m4' },
];
const rtcConfig = { iceServers: TURN_SERVERS };

export function CallScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { targetUserId } = route.params || { targetUserId: 'unknown' };

  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simulamos token para que no explote la UI
    setToken('simulated_call_token');
  }, [targetUserId]);

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>[ ERROR: {error} ]</Text>
      </View>
    );
  }

  if (!token) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#00E5FF" />
        <Text style={styles.loadingText}>ESTABLECIENDO LLAMADA...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LiveKitRoom
        token={token}
        serverUrl="wss://idkfree.livekit.cloud"
        connect={true}
        audio={true}
        video={false}
        options={{ rtcConfig }}
        style={styles.room}
      >
        <View style={styles.hud}>
          <Text style={styles.hudText}>[ LLAMADA: {targetUserId} ]</Text>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.hudClose}>[ COLGAR ]</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.infoText}>Audio conectado...</Text>
      </LiveKitRoom>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0a', justifyContent: 'center', alignItems: 'center' },
  room: { flex: 1, width: '100%' },
  hud: { position: 'absolute', top: 50, left: 20, right: 20, flexDirection: 'row', justifyContent: 'space-between', zIndex: 10 },
  hudText: { color: '#00E5FF', fontFamily: 'monospace', fontSize: 12 },
  hudClose: { color: '#ff0044', fontFamily: 'monospace', fontSize: 14, fontWeight: 'bold' },
  infoText: { color: '#fff', fontFamily: 'monospace', marginTop: 20 },
  errorText: { color: '#ff0044', fontFamily: 'monospace' },
  loadingText: { color: '#00E5FF', fontFamily: 'monospace', marginTop: 10 },
});
