import React from 'react';
import { View, Text } from 'react-native';
import Constants, { ExecutionEnvironment } from 'expo-constants';
import { LiveStreamReal } from './LiveStreamReal'; // Reutilizamos la misma UI por ahora

export function CallScreen(props: any) {
  const isExpoGo = Constants.executionEnvironment === ExecutionEnvironment.StoreClient;

  if (isExpoGo) {
    return (
      <View style={{ flex: 1, backgroundColor: '#0a0a0a', justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: '#00E5FF', fontFamily: 'monospace', fontSize: 14, letterSpacing: 1 }}>
          [ LLAMADAS REQUIEREN APK REAL ]
        </Text>
      </View>
    );
  }

  return <LiveStreamReal {...props} />;
}
