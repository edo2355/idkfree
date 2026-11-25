import React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { StatusBar } from 'expo-status-bar';
import { Building2, ScanLine } from 'lucide-react-native'; // <-- Lucide

import ScannerScreen from './src/screens/ScannerScreen';
import OfflineVenueScreen from './src/screens/OfflineVenueScreen';

const Stack = createNativeStackNavigator();

const DarkTheme = {
  ...DefaultTheme,
  colors: { ...DefaultTheme.colors, background: '#050505', card: '#0a0a0a', text: '#ffffff', primary: '#00E5FF', border: '#222222' },
};

const GlassHeader = ({ title }: { title: string }) => (
  <BlurView intensity={80} tint="dark" style={styles.headerContainer}>
    <Text style={styles.headerTitle}>{title}</Text>
  </BlurView>
);

function HomeScreen({ navigation }: any) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>IDKMEDIA APP</Text>
      <Text style={styles.subtitle}>Modo Offline & Herramientas</Text>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('OfflineVenue')}>
        <Building2 size={20} color="#00E5FF" style={styles.icon} />
        <Text style={styles.buttonText}>Crear Recinto Offline</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Scanner')}>
        <ScanLine size={20} color="#00E5FF" style={styles.icon} />
        <Text style={styles.buttonText}>Escanear Ticket QR</Text>
      </TouchableOpacity>
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer theme={DarkTheme}>
      <StatusBar style="light" />
      <Stack.Navigator screenOptions={{ headerTransparent: true, header: ({ options }) => <GlassHeader title={options.title || ''} />, animation: 'slide_from_right' }}>
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Inicio', headerShown: false }} />
        <Stack.Screen name="Scanner" component={ScannerScreen} options={{ title: 'Escáner QR' }} />
        <Stack.Screen name="OfflineVenue" component={OfflineVenueScreen} options={{ title: 'Recintos Offline' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#050505', alignItems: 'center', justifyContent: 'center', padding: 20 },
  title: { color: '#00E5FF', fontSize: 32, fontWeight: '900', marginBottom: 5, letterSpacing: 1 },
  subtitle: { color: '#888', fontSize: 16, marginBottom: 40, fontWeight: '500' },
  button: { backgroundColor: '#111', padding: 16, borderRadius: 16, width: '100%', marginBottom: 16, borderWidth: 1, borderColor: '#222', flexDirection: 'row', alignItems: 'center' },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600', flex: 1, textAlign: 'center' },
  icon: { position: 'absolute', left: 16 },
  headerContainer: { height: Platform.OS === 'ios' ? 100 : 70, paddingTop: Platform.OS === 'ios' ? 50 : 20, alignItems: 'center', justifyContent: 'center', borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.1)' },
  headerTitle: { color: '#fff', fontSize: 18, fontWeight: '600', marginTop: Platform.OS === 'ios' ? 0 : 10 }
});
