import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Terminal, Mail, Lock, ArrowRight } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { GlassCard } from '../components/ui/GlassCard';
import { useAuthStore } from '../stores/authStore';

export function LoginScreen() {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const login = useAuthStore((state) => state.login);

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Por favor, llena todos los campos.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const API_URL = process.env.EXPO_PUBLIC_API_URL || 'https://idkfree.onrender.com';
      
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Credenciales inválidas');

      const authToken = data.accessToken;
      // Nota: No guardamos authUser por ahora porque el store móvil solo maneja el token.

      if (!authToken) throw new Error('El servidor no devolvió un token válido');

      // 🔥 FIX: Llamamos a login solo con el token, tal como espera el authStore móvil
      await login(authToken);

      // Navegamos al Home
      navigation.replace('Home'); 
      
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={styles.hudText}>SYS.AUTH // SEC-LEVEL: 01</Text>

          <GlassCard style={styles.card} intensity={30}>
            <View style={styles.header}>
              <Terminal size={28} color="#00E5FF" />
              <Text style={styles.title}>IDKMEDIA_AUTH</Text>
            </View>

            {error ? (
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}

            <View style={styles.formGroup}>
              <Text style={styles.label}>EMAIL / NODE_ID</Text>
              <View style={styles.inputContainer}>
                <Mail size={18} color="#666" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="user@idkmedia.os"
                  placeholderTextColor="#555"
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                />
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>PASSWORD</Text>
              <View style={styles.inputContainer}>
                <Lock size={18} color="#666" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="••••••••••••"
                  placeholderTextColor="#555"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                />
              </View>
            </View>

            <TouchableOpacity style={styles.submitBtnWrapper} onPress={handleLogin} disabled={loading}>
              <LinearGradient colors={loading ? ['#333', '#333'] : ['#00E5FF', '#0055FF']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.submitBtn}>
                <Text style={styles.submitBtnText}>{loading ? 'VERIFICANDO...' : 'ACCEDER AL SISTEMA'}</Text>
                {!loading && <ArrowRight size={18} color="#fff" />}
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity style={styles.registerLink} onPress={() => navigation.navigate('Register')}>
              <Text style={styles.registerText}>¿No tienes cuenta? <Text style={{ color: '#00E5FF' }}>Solicitar Acceso</Text></Text>
            </TouchableOpacity>
          </GlassCard>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#050505' },
  scrollContent: { flexGrow: 1, justifyContent: 'center', padding: 20 },
  hudText: { color: '#444', fontFamily: 'monospace', fontSize: 10, marginBottom: 20, textAlign: 'center', letterSpacing: 2 },
  card: { padding: 24, borderRadius: 24, backgroundColor: 'rgba(15,15,15,0.6)' },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 30 },
  title: { color: '#fff', fontSize: 20, fontFamily: 'monospace', letterSpacing: 2, fontWeight: 'bold' },
  errorBox: { backgroundColor: 'rgba(255, 59, 48, 0.1)', borderWidth: 1, borderColor: '#FF3B30', padding: 12, borderRadius: 12, marginBottom: 20 },
  errorText: { color: '#FF3B30', fontFamily: 'monospace', fontSize: 12 },
  formGroup: { marginBottom: 20 },
  label: { color: '#888', fontFamily: 'monospace', fontSize: 11, marginBottom: 8, letterSpacing: 1 },
  inputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.6)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', borderRadius: 14, paddingHorizontal: 15, height: 55 },
  inputIcon: { marginRight: 12 },
  input: { flex: 1, color: '#fff', fontFamily: 'monospace', fontSize: 14 },
  submitBtnWrapper: { marginTop: 10, borderRadius: 16, overflow: 'hidden' },
  submitBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 16, gap: 10 },
  submitBtnText: { color: '#fff', fontFamily: 'monospace', fontSize: 14, fontWeight: 'bold', letterSpacing: 1 },
  registerLink: { marginTop: 25, alignItems: 'center' },
  registerText: { color: '#666', fontFamily: 'monospace', fontSize: 12 },
});
