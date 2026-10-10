import { useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../stores/themeStore';
import { fonts } from '../theme/fonts';
import { api } from '../api/client';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { ApiError } from '../../shared/api/client';

type Step = 'choose' | 'panic' | 'restore' | 'fenix';

/**
 * Parsea el payload del QR: "aldea:v1:<cardId>:<kind>:<secret>"
 */
function parseQRPayload(raw: string): { cardId: string; kind: string; secret: string } | null {
  const text = raw.trim();
  const parts = text.split(':');
  // aldea:v1:cardId:kind:secret
  if (parts.length >= 5 && parts[0] === 'aldea' && parts[1] === 'v1') {
    return { cardId: parts[2], kind: parts[3], secret: parts[4] };
  }
  return null;
}

export function RecoveryScreen() {
  const theme = useTheme();
  const navigation = useNavigation<any>();

  const [step, setStep] = useState<Step>('choose');
  const [qrRaw, setQrRaw] = useState('');
  const [pin, setPin] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleAction() {
    setError('');
    const parsed = parseQRPayload(qrRaw);
    if (!parsed) {
      setError('QR inválido. Pega el contenido del QR completo (aldea:v1:...)');
      return;
    }
    if (pin.length < 4 || pin.length > 8) {
      setError('El PIN debe tener entre 4 y 8 dígitos');
      return;
    }
    if (step === 'restore' && newPassword.length < 12) {
      setError('La nueva contraseña debe tener al menos 12 caracteres');
      return;
    }

    setLoading(true);
    try {
      if (step === 'panic') {
        await api.recovery.panic(parsed.cardId, parsed.secret, pin);
      } else if (step === 'restore') {
        await api.recovery.restore(parsed.cardId, parsed.secret, pin, newPassword);
      } else if (step === 'fenix') {
        await api.recovery.fenix(parsed.cardId, parsed.secret, pin);
      }
      navigation.navigate('Login');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Error de conexión');
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: theme.bg }} contentContainerStyle={{ padding: 24, paddingTop: 60, paddingBottom: 40 }}>
      <Text style={{ fontSize: 26, color: theme.text, textAlign: 'center', marginBottom: 8, fontFamily: fonts.displayBoldItalic, letterSpacing: 0.5 }}>
        Recuperar cuenta
      </Text>
      <Text style={{ color: theme.textMuted, fontFamily: fonts.regular, fontSize: 13, textAlign: 'center', marginBottom: 24 }}>
        Necesitas uno de tus 3 QRs del carnet
      </Text>

      {step === 'choose' && (
        <View>
          <View style={{ marginBottom: 12 }}>
            <Button variant="secondary" onPress={() => setStep('panic')}>
              🚨 Pánico — bloquear cuenta
            </Button>
          </View>
          <View style={{ marginBottom: 12 }}>
            <Button variant="secondary" onPress={() => setStep('restore')}>
              🔓 Restablecer contraseña
            </Button>
          </View>
          <View style={{ marginBottom: 12 }}>
            <Button variant="danger" onPress={() => setStep('fenix')}>
              🕊️ Fénix — borrar cuenta
            </Button>
          </View>
          <View style={{ height: 8 }} />
          <Button variant="ghost" onPress={() => navigation.goBack()}>Volver</Button>
        </View>
      )}

      {step !== 'choose' && (
        <>
          <Text style={{ color: theme.text, fontFamily: fonts.medium, fontSize: 14, marginBottom: 8 }}>
            {step === 'panic' && '🚨 Modo Pánico'}
            {step === 'restore' && '🔓 Restablecer contraseña'}
            {step === 'fenix' && '🕊️ Modo Fénix'}
          </Text>
          <Text style={{ color: theme.textMuted, fontFamily: fonts.regular, fontSize: 12, marginBottom: 16, lineHeight: 18 }}>
            {step === 'panic' && 'Bloquea tu cuenta temporalmente si te la han hackeado. Solo tú puedes desbloquearla.'}
            {step === 'restore' && 'Cambia la contraseña de tu cuenta sin necesitar la actual.'}
            {step === 'fenix' && 'Borra tu cuenta y todos tus datos PERMANENTEMENTE. Sin vuelta atrás.'}
          </Text>

          <Input
            label="Contenido del QR"
            value={qrRaw}
            onChangeText={setQrRaw}
            placeholder="aldea:v1:..."
            autoCapitalize="none"
            autoCorrect={false}
            hint="Copia el texto del QR escaneándolo con otra app"
          />

          <Input
            label={step === 'panic' ? 'PIN de Pánico' : step === 'restore' ? 'PIN de Restablecer' : 'PIN de Fénix'}
            value={pin}
            onChangeText={(v) => setPin(v.replace(/\D/g, '').slice(0, 8))}
            keyboardType="number-pad"
            maxLength={8}
            secureTextEntry
          />

          {step === 'restore' && (
            <Input
              label="Nueva contraseña"
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry
              hint="Mín 12, 1 mayúscula, 1 minúscula, 1 número"
            />
          )}

          {step === 'fenix' && (
            <View style={{ padding: 12, backgroundColor: theme.surfaceElevated, borderRadius: 8, marginBottom: 12, borderWidth: 1, borderColor: theme.danger }}>
              <Text style={{ color: theme.danger, fontFamily: fonts.medium, fontSize: 12 }}>
                ⚠️ Esta acción borra tu cuenta para siempre. No hay recuperación.
              </Text>
            </View>
          )}

          {error ? <Text style={{ color: theme.danger, marginBottom: 12, fontFamily: fonts.regular }}>{error}</Text> : null}

          <Button size="lg" loading={loading} onPress={handleAction}>
            {step === 'panic' ? 'Bloquear cuenta' : step === 'restore' ? 'Cambiar contraseña' : 'Borrar cuenta para siempre'}
          </Button>
          <View style={{ height: 8 }} />
          <Button variant="ghost" onPress={() => { setStep('choose'); setError(''); setQrRaw(''); setPin(''); setNewPassword(''); }}>
            Atrás
          </Button>
        </>
      )}
    </ScrollView>
  );
}
