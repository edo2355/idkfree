import { useState } from 'react';
import { Text, Image, ScrollView, KeyboardAvoidingView, Platform, StyleSheet, TouchableOpacity, View, Modal } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../stores/themeStore';
import { fonts } from '../theme/fonts';
import { useAuthStore } from '../stores/authStore';
import { api } from '../api/client';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { ApiError } from '../../shared/api/client';
import { ConfigScreen } from './ConfigScreen';
import { SymbolIcon } from '../components/icons/SymbolIcon';

export function LoginScreen() {
  const theme = useTheme();
  const navigation = useNavigation<any>();
  const setAuth = useAuthStore((s) => s.setAuth);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showConfig, setShowConfig] = useState(false);

  async function handleLogin() {
    setError(''); setLoading(true);
    try {
      const res = await api.auth.login(email, password);
      setAuth({ id: res.userId, alias: res.alias }, res.accessToken);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Error de conexión');
    } finally { setLoading(false); }
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1, backgroundColor: theme.bg }}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Botón servidor arriba derecha */}
        <TouchableOpacity
          onPress={() => setShowConfig(true)}
          style={styles.serverBtn}
          activeOpacity={0.6}
        >
          <Text style={styles.serverBtnText}>SERVIDOR</Text>
        </TouchableOpacity>

        <View style={{ alignSelf: 'center', marginBottom: 12 }}><SymbolIcon size={140} color={theme.text} /></View>
        <Text style={{ fontSize: 34, fontFamily: fonts.displayBoldItalic, letterSpacing: 1, color: theme.text, textAlign: 'center' }}>IDKFREE</Text>
        <Text style={{ color: theme.textMuted, textAlign: 'center', marginBottom: 32, fontFamily: fonts.medium, letterSpacing: 0.5 }}>No lo sé, gratis o libre</Text>
        <Input label="Email" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" placeholder="tu@email.com" />
        <Input label="Contraseña" value={password} onChangeText={setPassword} secureTextEntry placeholder="••••••••" />
        {error ? <Text style={{ color: theme.danger, marginBottom: 12, fontFamily: fonts.regular }}>{error}</Text> : null}
        <Button size="lg" loading={loading} onPress={handleLogin}>Entrar</Button>
        <Text style={{ color: theme.text, textAlign: 'center', marginTop: 16, fontFamily: fonts.medium, letterSpacing: 0.5 }} onPress={() => navigation.navigate('Register')}>Crear cuenta</Text>
        <Text style={{ color: theme.text, textAlign: 'center', marginTop: 12, fontFamily: fonts.medium, letterSpacing: 0.5 }} onPress={() => navigation.navigate('Recovery')}>Recuperar cuenta</Text>

        {/* Firma from Edo Amate */}
        <View style={{ alignItems: 'center', marginTop: 30 }}>
          <Text style={{ fontSize: 10, fontFamily: fonts.medium, color: theme.textMuted, letterSpacing: 0.5, marginBottom: 6 }}>from</Text>
          <Image source={require('../../assets/logo-edo-white.png')} style={{ width: 148, height: 148, opacity: 0.85 }} resizeMode="contain" />
        </View>
      </ScrollView>

      <Modal visible={showConfig} transparent animationType="fade" onRequestClose={() => setShowConfig(false)}>
        <ConfigScreen onClose={() => setShowConfig(false)} />
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 24, paddingTop: 48, paddingBottom: 40 },
  serverBtn: {
    alignSelf: 'flex-end',
    paddingVertical: 6,
    paddingHorizontal: 10,
    marginBottom: 8,
  },
  serverBtnText: {
    fontSize: 10,
    fontFamily: 'SpaceGrotesk_500Medium',
    letterSpacing: 2,
    color: '#5F5F5F',
  },
});
