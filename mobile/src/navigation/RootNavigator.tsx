import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AppTabs } from './AppTabs';
import { AuthStack } from './AuthStack';
import { useAuthStore } from '../stores/authStore';
import { View, ActivityIndicator, Text } from 'react-native';

const Stack = createNativeStackNavigator();

export function RootNavigator() {
  const token = useAuthStore((s) => s.token);
  const isLoading = useAuthStore((s) => s.isLoading); // <--- Nueva bandera

  // Mientras lee el disco, mostramos un indicador o el Splash
  if (isLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: '#0a0a0a', justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#00E5FF" />
        <Text style={{ color: '#888', marginTop: 10, fontFamily: 'monospace' }}>CARGANDO_SESIÓN...</Text>
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {token ? (
        <Stack.Screen name="Main" component={AppTabs} />
      ) : (
        <Stack.Screen name="Auth" component={AuthStack} />
      )}
    </Stack.Navigator>
  );
}
