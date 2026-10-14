import { useState } from 'react';
import { Text, Image, ScrollView, KeyboardAvoidingView, Platform, StyleSheet, TouchableOpacity, View, Modal } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Svg, { Line, Rect, Circle, Path } from 'react-native-svg';
import { useTheme } from '../stores/themeStore';
import { fonts } from '../theme/fonts';
import { useAuthStore } from '../stores/authStore';
import { api } from '../api/client';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { ApiError } from '../../shared/api/client';
import { ConfigScreen } from './ConfigScreen';
import { ScreenBackground } from '../components/ScreenBackground';

const MONO = 'monospace';

// ---------- Helpers SVG ----------
function BarcodeSVG({ width, height, color, seed }: any) {
  const bars: any[] = [];
  let s = 0;
  for (let i = 0; i < seed.length; i++) s = (s * 31 + seed.charCodeAt(i)) & 0xffffffff;
  const rand = () => {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    return s / 0x7fffffff;
  };
  let x = 0;
  while (x < width) {
    const w = Math.floor(rand() * 3) + 1;
    const gap = Math.floor(rand() * 3) + 1;
    bars.push({ x, w });
    x += w + gap;
  }
  return (
    <Svg width={width} height={height}>
      {bars.map((b, i) => <Rect key={i} x={b.x} y={0} width={b.w} height={height} fill={color} />)}
    </Svg>
  );
}

function TechLabel({ children, color, size = 9, spacing = 1.5 }: any) {
  return (
    <Text style={{ color, fontFamily: MONO, fontSize: size, letterSpacing: spacing, textTransform: 'uppercase' }}>
      {children}
    </Text>
  );
}

// ---------- Pantalla ----------
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
    setError('');
    setLoading(true);
    try {
      const res = await api.auth.login(email, password);
      setAuth({ id: res.userId, alias: res.alias }, res.accessToken);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Error de conexión');
    } finally { setLoading(false); }
  }

  const timestamp = new Date().toISOString().slice(0, 16).replace('T', ' · ');

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1, backgroundColor: theme.bg }}
    >
      <ScreenBackground variant="neural" opacity={0.07} />

      <ScrollView contentContainerStyle={styles.container}>
        {/* Botón servidor arriba derecha */}
        <TouchableOpacity
          onPress={() => setShowConfig(true)}
          style={styles.serverBtn}
          activeOpacity={0.6}
        >
          <TechLabel color={theme.textSubtle} size={9} spacing={2}>SERVIDOR</TechLabel>
        </TouchableOpacity>

        {/* Header técnico */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: theme.danger }} />
            <TechLabel color={theme.textMuted} size={8}>IDKFREE.OS</TechLabel>
          </View>
          <TechLabel color={theme.textSubtle} size={8}>v2.0.0 · 2026</TechLabel>
        </View>

        {/* Barcode superior */}
        <View style={{ alignItems: 'center', marginBottom: 24 }}>
          <BarcodeSVG width={280} height={10} color={theme.text} seed="idkfree-boot" />
        </View>

        {/* Logo IDKFREE monoespaciado grande */}
        <View style={{ alignItems: 'center', marginBottom: 12 }}>
          <Text style={{
            color: theme.text,
            fontFamily: MONO,
            fontSize: 40,
            fontWeight: '700',
            letterSpacing: 8,
            textAlign: 'center',
          }}>
            IDKFREE
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 8 }}>
            <View style={{ width: 40, height: 1, backgroundColor: theme.border }} />
            <TechLabel color={theme.textMuted} size={9} spacing={2}>AUTH.CMD</TechLabel>
            <View style={{ width: 40, height: 1, backgroundColor: theme.border }} />
          </View>
        </View>

        {/* Subtítulo */}
        <Text style={{
          fontSize: 15,
          color: theme.textMuted,
          textAlign: 'center',
          marginBottom: 32,
          fontFamily: fonts.regular,
          letterSpacing: 0.3,
        }}>
          No lo sé, gratis o libre
        </Text>

        {/* Divider código */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <TechLabel color={theme.accent} size={9}>[ INPUT ]</TechLabel>
          <TechLabel color={theme.textSubtle} size={8}>SYS.REQ.01</TechLabel>
        </View>

        {/* Inputs */}
        <Input label="Email" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" placeholder="tu@email.com" />
        <Input label="Contraseña" value={password} onChangeText={setPassword} secureTextEntry placeholder="••••••••" />

        {error ? (
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
            paddingVertical: 10,
            paddingHorizontal: 12,
            borderRadius: 4,
            borderWidth: 1,
            borderColor: theme.danger,
            backgroundColor: 'rgba(239,68,68,0.08)',
            marginTop: 8,
          }}>
            <Text style={{ color: theme.danger, fontFamily: MONO, fontSize: 11, letterSpacing: 1 }}>
              ⚠ {String(error).toUpperCase()}
            </Text>
          </View>
        ) : null}

        {/* Botón */}
        <View style={{ marginTop: 20 }}>
          <Button size="lg" loading={loading} onPress={handleLogin}>Entrar</Button>
        </View>

        {/* Links técnicos */}
        <View style={{ marginTop: 24, gap: 12 }}>
          <TouchableOpacity
            onPress={() => navigation.navigate('Register')}
            activeOpacity={0.7}
            style={{ flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 8 }}
          >
            <Text style={{ color: theme.accent, fontFamily: MONO, fontSize: 11, letterSpacing: 2 }}>▸</Text>
            <Text style={{ color: theme.text, fontFamily: fonts.medium, fontSize: 14, letterSpacing: 0.5 }}>
              Crear cuenta
            </Text>
            <View style={{ flex: 1, height: 1, backgroundColor: theme.border, marginLeft: 8 }} />
            <TechLabel color={theme.textSubtle} size={8}>REG</TechLabel>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate('Recovery')}
            activeOpacity={0.7}
            style={{ flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 8 }}
          >
            <Text style={{ color: theme.accent, fontFamily: MONO, fontSize: 11, letterSpacing: 2 }}>▸</Text>
            <Text style={{ color: theme.text, fontFamily: fonts.medium, fontSize: 14, letterSpacing: 0.5 }}>
              Recuperar cuenta
            </Text>
            <View style={{ flex: 1, height: 1, backgroundColor: theme.border, marginLeft: 8 }} />
            <TechLabel color={theme.textSubtle} size={8}>REC</TechLabel>
          </TouchableOpacity>
        </View>

        {/* Divider antes de firma */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 40, marginBottom: 20 }}>
          <View style={{ flex: 1, height: 1, backgroundColor: theme.border }} />
          <TechLabel color={theme.textSubtle} size={8} spacing={3}>[ CREADO POR ]</TechLabel>
          <View style={{ flex: 1, height: 1, backgroundColor: theme.border }} />
        </View>

        {/* Firma Edo Amate */}
        <View style={{ alignItems: 'center', marginBottom: 20 }}>
          <Image
            source={require('../../assets/logo-edo-white.png')}
            style={{ width: 240, height: 100, opacity: 0.9 }}
            resizeMode="contain"
          />
        </View>

        {/* Footer técnico */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 20 }}>
          <TechLabel color={theme.textSubtle} size={8}>{timestamp}</TechLabel>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <View style={{ width: 5, height: 5, borderRadius: 3, backgroundColor: theme.success }} />
            <TechLabel color={theme.textSubtle} size={8}>SYS.OK</TechLabel>
          </View>
        </View>

        {/* Barcode inferior */}
        <View style={{ alignItems: 'center', marginTop: 16 }}>
          <BarcodeSVG width={280} height={8} color={theme.text} seed="idkfree-tail" />
        </View>

        <Text style={{
          color: theme.textSubtle,
          fontFamily: MONO,
          fontSize: 8,
          letterSpacing: 4,
          textAlign: 'center',
          marginTop: 14,
        }}>
          "MÁS QUE UNA PREGUNTA"
        </Text>

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
});
