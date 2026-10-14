import { useState } from 'react';
import { Text, ScrollView, KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../stores/themeStore';
import { fonts } from '../theme/fonts';
import { api } from '../api/client';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { CardModalScreen } from './CardModalScreen';
import { ApiError } from '../../shared/api/client';
import { ScreenBackground } from '../components/ScreenBackground';

export function RegisterScreen() {
  const theme = useTheme();
  const navigation = useNavigation<any>();

  const [email, setEmail] = useState('');
  const [alias, setAlias] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  // 3 PINs secretos (obligatorios)
  const [pin1, setPin1] = useState('');
  const [pin2, setPin2] = useState('');
  const [pin3, setPin3] = useState('');

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [cardData, setCardData] = useState<any>(null);

  async function handleRegister() {
    setError('');

    // Validación local
    if (pin1.length < 4 || pin2.length < 4 || pin3.length < 4) {
      setError('Los 3 PINs secretos deben tener al menos 4 dígitos');
      return;
    }
    const secrets = [pin1, pin2, pin3];
    if (new Set(secrets).size !== 3) {
      setError('Los 3 PINs secretos deben ser diferentes entre sí');
      return;
    }

    setLoading(true);
    try {
      const res = await api.auth.register({
        email,
        alias,
        password,
        name: name || undefined,
        secretPins: secrets,
      });
      setCardData(res);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Error de conexión');
    } finally {
      setLoading(false);
    }
  }

  if (cardData) {
    return (
      <CardModalScreen
        qrPayloads={cardData.qrPayloads}
        pins={cardData.pins}
        onConfirm={() => navigation.navigate('Login')}
      />
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1, backgroundColor: theme.bg }}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={{ fontSize: 28, color: theme.text, textAlign: 'center', marginBottom: 24, fontFamily: fonts.displayBoldItalic, letterSpacing: 0.5 }}>
          Crear cuenta
        </Text>

        <Input label="Email" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" />
        <Input label="Alias" value={alias} onChangeText={(v) => setAlias(v.toLowerCase())} autoCapitalize="none" hint="minúsculas, números, _" />
        <Input label="Nombre (opcional)" value={name} onChangeText={setName} />
        <Input label="Contraseña" value={password} onChangeText={setPassword} secureTextEntry hint="Mín 12, 1 mayúscula, 1 minúscula, 1 número" />

        <Text style={{ color: theme.text, fontFamily: fonts.medium, fontSize: 15, marginTop: 20, marginBottom: 8 }}>
          🔒 Tus 3 PINs secretos
        </Text>
        <Text style={{ color: theme.textMuted, fontFamily: fonts.regular, fontSize: 12, marginBottom: 12, lineHeight: 18 }}>
          Solo tú los sabrás. NO se imprimen en el carnet. 4-8 dígitos cada uno, todos diferentes.
        </Text>

        <Input
          label="PIN Secreto 1"
          value={pin1}
          onChangeText={(v) => setPin1(v.replace(/\D/g, '').slice(0, 8))}
          keyboardType="number-pad"
          maxLength={8}
          secureTextEntry
        />
        <Input
          label="PIN Secreto 2"
          value={pin2}
          onChangeText={(v) => setPin2(v.replace(/\D/g, '').slice(0, 8))}
          keyboardType="number-pad"
          maxLength={8}
          secureTextEntry
        />
        <Input
          label="PIN Secreto 3"
          value={pin3}
          onChangeText={(v) => setPin3(v.replace(/\D/g, '').slice(0, 8))}
          keyboardType="number-pad"
          maxLength={8}
          secureTextEntry
        />

        {error ? (
          <Text style={{ color: theme.danger, marginBottom: 12, fontFamily: fonts.regular }}>{error}</Text>
        ) : null}

        <Button size="lg" loading={loading} onPress={handleRegister}>Crear cuenta</Button>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({ container: { padding: 24, paddingTop: 60, paddingBottom: 40 } });
