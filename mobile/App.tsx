import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useAuth } from './src/stores/authStore';

// Pantallas
import ScannerScreen from './src/screens/ScannerScreen';
import OfflineVenueScreen from './src/screens/OfflineVenueScreen';

const Stack = createNativeStackNavigator();

// Pantalla de Inicio (Home) Temporal
function HomeScreen({ navigation }: any) {
  const { token, login, logout } = useAuth();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>IDKMEDIA APP</Text>
      <Text style={styles.subtitle}>Modo Offline & Herramientas</Text>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('OfflineVenue')}>
        <Text style={styles.buttonText}>🏗️ Crear Recinto Offline</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Scanner')}>
        <Text style={styles.buttonText}>📷 Escanear Ticket QR</Text>
      </TouchableOpacity>

      {/* Botón temporal para simular Login y obtener token */}
      <TouchableOpacity 
        style={[styles.button, { backgroundColor: token ? '#ef4444' : '#22c55e' }]} 
        onPress={() => token ? logout() : login('TOKEN_DE_PRUEBA_123')}
      >
        <Text style={styles.buttonText}>{token ? 'Cerrar Sesión' : 'Simular Login'}</Text>
      </TouchableOpacity>
      
      <Text style={{ marginTop: 20, fontSize: 12, color: '#666' }}>
        Estado: {token ? 'Autenticado ✅' : 'No Autenticado ❌'}
      </Text>
    </View>
  );
}

export default function App() {
  const { loadToken } = useAuth();

  useEffect(() => {
    loadToken(); // Cargar el token guardado al iniciar
  }, []);

  return (
    <NavigationContainer>
      <StatusBar style="light" />
      <Stack.Navigator 
        initialRouteName="Home"
        screenOptions={{
          headerStyle: { backgroundColor: '#050505' },
          headerTintColor: '#fff',
          contentStyle: { backgroundColor: '#050505' }
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="OfflineVenue" component={OfflineVenueScreen} options={{ title: 'Editor Offline' }} />
        <Stack.Screen name="Scanner" component={ScannerScreen} options={{ title: 'Escáner QR' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#050505', padding: 20 },
  title: { fontSize: 32, fontWeight: 'bold', color: '#00E5FF', marginBottom: 10 },
  subtitle: { fontSize: 16, color: '#94a3b8', marginBottom: 40 },
  button: { width: '100%', backgroundColor: '#2563EB', padding: 15, borderRadius: 10, marginBottom: 15, alignItems: 'center' },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' }
});
