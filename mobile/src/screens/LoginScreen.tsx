import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, StyleSheet, KeyboardAvoidingView, Platform, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../stores/themeStore';
import { fonts } from '../theme/fonts';
import { useAuthStore } from '../stores/authStore';
import { api } from '../api/client';
import { GlassPanel } from '../components/GlassPanel';

export function LoginScreen() {
  const theme = useTheme();
  const navigation = useNavigation<any>();
  const setAuth = useAuthStore((s) => s.setAuth);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    if (!email.trim() || !password.trim()) return;
    setError('');
    setLoading(true);

    try {
      const res = await api.auth.login(email, password);
      // Mapeo correcto de la respuesta del backend
      const userData = { id: res.userId, alias: res.alias, name: res.alias };
      setAuth(userData, res.accessToken);
      // La navegación se maneja automáticamente en RootNavigator al cambiar el token
    } catch (err: any) {
      setError(err.message || 'Credenciales inválidas');
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1, backgroundColor: theme.bg }}>
      
      {/* Fondo con gradiente simulado */}
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <View style={{ flex: 1, backgroundColor: '#0a0a0a' }} />
        <View style={{ position: 'absolute', top: '20%', left: '10%', width: 300, height: 300, borderRadius: 150, backgroundColor: theme.accent, opacity: 0.05, transform: [{ scale: 2 }] }} />
      </View>

      <View style={{ flex: 1, justifyContent: 'center', padding: 20 }}>
        
        {/* HUD Superior */}
        <View style={{ position: 'absolute', top: 50, left: 20, right: 20, flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={{ color: theme.textMuted, fontFamily: fonts.mono, fontSize: 10, letterSpacing: 2 }}>IDKFREE_SYS</Text>
          <Text style={{ color: theme.textMuted, fontFamily: fonts.mono, fontSize: 10, letterSpacing: 2 }}>LATENCY: 24ms</Text>
        </View>

        <GlassPanel style={{ padding: 30, borderRadius: 16, borderColor: 'rgba(255,255,255,0.05)' }}>
          
          {/* Branding */}
          <View style={{ marginBottom: 30, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <View>
              <Text style={{ color: theme.text, fontSize: 48, fontWeight: '800', letterSpacing: 4, lineHeight: 50 }}>IDK</Text>
              <Text style={{ color: theme.textMuted, fontSize: 12, fontWeight: '400', letterSpacing: 12, marginTop: 4 }}>FREE</Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={{ color: theme.textMuted, fontFamily: fonts.mono, fontSize: 10 }}>[ AUTH ]</Text>
              <View style={{ width: 6, height: 6, backgroundColor: theme.accent, marginTop: 10 }} />
            </View>
          </View>

          {error ? (
            <Text style={{ color: theme.danger, fontFamily: fonts.mono, fontSize: 12, marginBottom: 20 }}>[ ERROR: {error} ]</Text>
          ) : null}

          <View style={{ gap: 20 }}>
            <View>
              <Text style={{ color: theme.textMuted, fontFamily: fonts.mono, fontSize: 10, letterSpacing: 1, marginBottom: 8 }}>USUARIO / EMAIL</Text>
              <TextInput
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                placeholder="tu@email.com"
                placeholderTextColor={theme.textMuted}
                style={{ color: theme.text, fontFamily: fonts.regular, fontSize: 16, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.1)' }}
              />
            </View>

            <View>
              <Text style={{ color: theme.textMuted, fontFamily: fonts.mono, fontSize: 10, letterSpacing: 1, marginBottom: 8 }}>CONTRASEÑA</Text>
              <TextInput
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                placeholder="••••••••"
                placeholderTextColor={theme.textMuted}
                style={{ color: theme.text, fontFamily: fonts.regular, fontSize: 16, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.1)' }}
              />
            </View>
          </View>

          <TouchableOpacity 
            onPress={handleLogin}
            disabled={loading}
            style={{ marginTop: 30, paddingVertical: 16, borderWidth: 1, borderColor: theme.accent, alignItems: 'center', borderRadius: 4, backgroundColor: 'rgba(0, 229, 255, 0.05)' }}
          >
            {loading ? (
              <ActivityIndicator color={theme.accent} />
            ) : (
              <Text style={{ color: theme.accent, fontFamily: fonts.mono, fontSize: 12, letterSpacing: 3 }}>INICIAR SESIÓN</Text>
            )}
          </TouchableOpacity>

          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 30 }}>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text style={{ color: theme.textMuted, fontFamily: fonts.mono, fontSize: 10 }}>CREAR CUENTA</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Recovery')}>
              <Text style={{ color: theme.textMuted, fontFamily: fonts.mono, fontSize: 10 }}>RECUPERAR</Text>
            </TouchableOpacity>
          </View>

        </GlassPanel>

        {/* Logo Edo Amate */}
        <View style={{ marginTop: 40, alignItems: 'center', opacity: 0.4 }}>
          <Image source={{ uri: 'https://idkfreegetid.dpdns.org/logo-edo.svg' }} style={{ width: 100, height: 40, resizeMode: 'contain', tintColor: '#fff' }} />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
