import { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, SafeAreaView } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import * as LocalAuthentication from 'expo-local-authentication';
import TattooScanner from './TattooScanner';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1); 
  const [loading, setLoading] = useState(false);
  const [showScanner, setShowScanner] = useState(false);

  useEffect(() => {
    async function checkBiometrics() {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      if (hasHardware) {
        const result = await LocalAuthentication.authenticateAsync({ promptMessage: 'Huella requerida' });
        if (result.success) setIsAuthenticated(true);
      } else {
        setIsAuthenticated(true); 
      }
    }
    if (step === 3 && !isAuthenticated) checkBiometrics();
  }, [step]);

  const requestOTP = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://192.168.1.45:3002/api/auth/send-otp', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone_number: phone }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      Alert.alert('Código Enviado', 'Revisa Termux para ver el código.');
      setStep(2);
    } catch (err: any) { Alert.alert('Error', err.message); } finally { setLoading(false); }
  };

  const verifyOTP = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://192.168.1.45:3002/api/auth/verify-otp', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone_number: phone, otp_code: otp }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      await SecureStore.setItemAsync('auth_token', data.accessToken);
      setToken(data.accessToken); setStep(3); 
    } catch (err: any) { Alert.alert('Error', err.message); } finally { setLoading(false); }
  };

  if (showScanner) return <TattooScanner onComplete={() => setShowScanner(false)} onCancel={() => setShowScanner(false)} />;

  if (step === 1 || step === 2) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>IDKFREE AUTH</Text>
        <Text style={styles.subtitle}>Tu llave de seguridad</Text>
        {step === 1 ? (
          <>
            <TextInput style={styles.input} placeholder="Número de teléfono" placeholderTextColor="#666" keyboardType="phone-pad" value={phone} onChangeText={setPhone} />
            <TouchableOpacity style={styles.button} onPress={requestOTP} disabled={loading}><Text style={styles.buttonText}>{loading ? '...' : 'Recibir SMS'}</Text></TouchableOpacity>
          </>
        ) : (
          <>
            <TextInput style={styles.input} placeholder="Código SMS" placeholderTextColor="#666" keyboardType="number-pad" maxLength={6} value={otp} onChangeText={setOtp} />
            <TouchableOpacity style={styles.button} onPress={verifyOTP} disabled={loading}><Text style={styles.buttonText}>{loading ? '...' : 'Vincular'}</Text></TouchableOpacity>
          </>
        )}
      </SafeAreaView>
    );
  }

  if (!isAuthenticated) {
    return (
      <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ fontSize: 50, marginBottom: 20 }}>🔒</Text>
        <Text style={{ color: '#fff', fontSize: 18 }}>App Bloqueada</Text>
        <TouchableOpacity style={[styles.button, { marginTop: 20 }]} onPress={() => setIsAuthenticated(false)}>
          <Text style={styles.buttonText}>Desbloquear</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Mi Carnet</Text>
      
      <View style={styles.card}>
        <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold' }}>@edo2355</Text>
        <Text style={{ color: '#888', marginTop: 5 }}>Eduardo Owner</Text>
      </View>

      <TouchableOpacity style={[styles.button, { backgroundColor: '#32D3EE', marginTop: 20 }]} onPress={() => setShowScanner(true)}>
        <Text style={styles.buttonText}>📸 Escanear Tatuaje (En Vivo)</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, { backgroundColor: '#ff4d4f', marginTop: 10 }]} onPress={() => Alert.alert('PÁNICO', '¿Bloquear todo?')}>
        <Text style={styles.buttonText}>🚨 PROTOCOLO PÁNICO</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#050505', padding: 20, justifyContent: 'center' },
  title: { color: '#fff', fontSize: 32, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
  subtitle: { color: '#00f2fe', fontSize: 16, textAlign: 'center', marginBottom: 40, letterSpacing: 2 },
  input: { backgroundColor: '#181b21', color: '#fff', padding: 15, borderRadius: 10, marginBottom: 15, borderWidth: 1, borderColor: '#2a2e39' },
  button: { backgroundColor: '#00f2fe', padding: 15, borderRadius: 10, alignItems: 'center' },
  buttonText: { color: '#000', fontWeight: 'bold', fontSize: 16 },
  card: { backgroundColor: '#181b21', padding: 20, borderRadius: 15, borderWidth: 1, borderColor: '#00f2fe' }
});
