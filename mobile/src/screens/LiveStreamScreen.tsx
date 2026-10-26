import React from 'react';
import { View, Text } from 'react-native';
import Constants, { ExecutionEnvironment } from 'expo-constants';
import { LiveStreamReal } from './LiveStreamReal';

export function LiveStreamScreen(props: any) {
  // Detectar si estamos en Expo Go
  const isExpoGo = Constants.executionEnvironment === ExecutionEnvironment.StoreClient;

  if (isExpoGo) {
    return (
      <View style={{ flex: 1, backgroundColor: '#0a0a0a', justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: '#00E5FF', fontFamily: 'monospace', fontSize: 14, letterSpacing: 1 }}>
          [ LIVEKIT REQUIERE APK REAL ]
        </Text>
        <Text style={{ color: '#666', fontFamily: 'monospace', fontSize: 11, marginTop: 10 }}>
          Descarga la APK para transmitir en vivo.
        </Text>
      </View>
    );
  }

  // Si es APK, cargar el Live real
  return <LiveStreamReal {...props} />;
}
