// ============================================================
// RecoveryScreen.tsx — Protocolo de Recuperación Táctica
// Acepta params del Scanner (cardId, action, secret)
// ============================================================
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { idkAlert as Alert } from '../components/IDKAlert';
import { fonts } from '../theme/fonts';
import { api } from '../api/client';
import { ApiError } from '../../shared/api/client';

type Action = 'panic' | 'restore' | 'fenix';

const ACTION_LABELS: Record<Action, string> = {
  panic: 'PÁNICO · BLOQUEAR CUENTA',
  restore: 'RESTABLECER CONTRASEÑA',
  fenix: 'FÉNIX · BORRAR CUENTA',
};

const ACTION_DESC: Record<Action, string> = {
  panic: 'Bloquea tu cuenta temporalmente. Solo tú puedes desbloquearla con el PIN de pánico.',
  restore: 'Cambia la contraseña sin necesitar la actual. Requiere PIN de restablecer + nueva contraseña.',
  fenix: 'Borra tu cuenta de forma permanente. Esta acción NO se puede deshacer.',
};

export function RecoveryScreen({ navigation, route }: any) {
  const params = route?.params ?? {};
  const [cardId, setCardId] = useState(params.cardId ?? '');
  const [secret, setSecret] = useState(params.secret ?? '');
  const [action, setAction] = useState<Action | null>(params.action ?? null);
  const [pin, setPin] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Sincroniza params cuando el Scanner navega de vuelta con datos
  useEffect(() => {
    if (params.cardId) setCardId(params.cardId);
    if (params.secret) setSecret(params.secret);
    if (params.action) setAction(params.action);
    if (params.cardId || params.action) {
      // limpiar PIN para que el usuario lo reingrese
      setPin('');
      setNewPassword('');
    }
  }, [params.cardId, params.secret, params.action]);

  async function handleExecute() {
    if (!cardId || !secret || !action || !pin) {
      Alert.alert('DATOS INCOMPLETOS', 'Faltan cardId, secret, acción o PIN.');
      return;
    }
    if (action === 'restore' && !newPassword) {
      Alert.alert('FALTA CONTRASEÑA', 'Debes ingresar la nueva contraseña.');
      return;
    }

    setLoading(true);
    try {
      if (action === 'panic') {
        await api.recovery.panic(cardId, secret, pin);
        Alert.alert('✓ CUENTA BLOQUEADA', 'Tu cuenta ha sido bloqueada. Usa el PIN de pánico para desbloquearla.',
          [{ text: 'OK', onPress: () => navigation.navigate('Login') }]);
      } else if (action === 'restore') {
        await api.recovery.restore(cardId, secret, pin, newPassword);
        Alert.alert('✓ CONTRASEÑA ACTUALIZADA', 'Ya puedes iniciar sesión con tu nueva contraseña.',
          [{ text: 'OK', onPress: () => navigation.navigate('Login') }]);
      } else if (action === 'fenix') {
        await api.recovery.fenix(cardId, secret, pin);
        Alert.alert('[X] CUENTA BORRADA', 'Tu cuenta ha sido destruida.',
          [{ text: 'OK', onPress: () => navigation.navigate('Login') }]);
      }
    } catch (e: any) {
      const msg = e instanceof ApiError ? e.message : (e?.message ?? 'Error desconocido');
      Alert.alert('ERROR DE RECUPERACIÓN', msg);
    }
    setLoading(false);
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Text style={styles.systemTag}>// PROTOCOL_RESTORE_V1</Text>
          <Text style={styles.title}>Recuperación</Text>
          <Text style={styles.subtitle}>Restablecimiento de credenciales de carnet.</Text>
        </View>

        <TouchableOpacity style={styles.scanButton} onPress={() => navigation.navigate('Scanner')}>
          <Text style={styles.scanButtonText}>[ ESCANEAR QR DE RESTAURACIÓN ]</Text>
        </TouchableOpacity>

        <View style={styles.dividerRow}>
          <View style={styles.line} />
          <Text style={styles.dividerText}>O INGRESO MANUAL</Text>
          <View style={styles.line} />
        </View>

        {/* Acción */}
        <Text style={styles.label}>TIPO DE PROTOCOLO *</Text>
        <View style={styles.actionRow}>
          {(['panic', 'restore', 'fenix'] as Action[]).map((a) => (
            <TouchableOpacity
              key={a}
              onPress={() => setAction(a)}
              style={[styles.actionBtn, action === a && styles.actionBtnActive]}
            >
              <Text style={[styles.actionBtnText, action === a && styles.actionBtnTextActive]}>
                {a.toUpperCase()}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {action && (
          <Text style={styles.actionDesc}>{ACTION_DESC[action]}</Text>
        )}

        <View style={styles.box}>
          <Text style={styles.boxTitle}>[RESTORE_KEY_INJECTION]</Text>

          <Text style={styles.label}>CARD ID</Text>
          <TextInput
            style={styles.input}
            placeholder="IDK-XXXX-XXXX-XXXX"
            placeholderTextColor="#444"
            value={cardId}
            onChangeText={setCardId}
            autoCapitalize="none"
          />

          <Text style={styles.label}>SECRETO DEL QR</Text>
          <TextInput
            style={styles.input}
            placeholder="••••••••"
            placeholderTextColor="#444"
            value={secret}
            onChangeText={setSecret}
            autoCapitalize="none"
          />

          <Text style={styles.label}>PIN {action ? `DE ${ACTION_LABELS[action].split('·')[0].trim()}` : ''} *</Text>
          <TextInput
            style={styles.input}
            placeholder="••••"
            placeholderTextColor="#444"
            secureTextEntry
            keyboardType="numeric"
            value={pin}
            onChangeText={setPin}
            maxLength={8}
          />

          {action === 'restore' && (
            <>
              <Text style={styles.label}>NUEVA CONTRASEÑA *</Text>
              <TextInput
                style={styles.input}
                placeholder="Mín 12, 1 mayúscula, 1 minúscula, 1 número"
                placeholderTextColor="#444"
                secureTextEntry
                value={newPassword}
                onChangeText={setNewPassword}
              />
            </>
          )}

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleExecute}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#000" />
            ) : (
              <Text style={styles.buttonText}>EJECUTAR PROTOCOLO</Text>
            )}
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>← CANCELAR Y VOLVER</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#050505' },
  scrollContent: { padding: 24, paddingTop: 60 },
  header: { marginBottom: 20 },
  systemTag: { fontFamily: 'monospace', fontSize: 10, color: '#EF4444', letterSpacing: 1.5, marginBottom: 6 },
  title: { fontFamily: fonts.displayBoldItalic, fontSize: 34, color: '#FFF' },
  subtitle: { fontFamily: 'monospace', fontSize: 12, color: '#777', marginTop: 4 },
  scanButton: { backgroundColor: '#0F0F0F', borderWidth: 1, borderColor: '#32D3EE', paddingVertical: 14, alignItems: 'center', marginBottom: 20 },
  scanButtonText: { fontFamily: 'monospace', fontSize: 11, fontWeight: 'bold', color: '#32D3EE', letterSpacing: 1 },
  dividerRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 16 },
  line: { flex: 1, height: 1, backgroundColor: '#222' },
  dividerText: { fontFamily: 'monospace', fontSize: 9, color: '#555', marginHorizontal: 10 },
  label: { fontFamily: 'monospace', fontSize: 10, color: '#888', marginBottom: 6, marginTop: 12, letterSpacing: 1 },
  actionRow: { flexDirection: 'row', gap: 6 },
  actionBtn: { flex: 1, paddingVertical: 10, alignItems: 'center', borderWidth: 1, borderColor: '#2A2A2A', backgroundColor: '#0A0A0A' },
  actionBtnActive: { borderColor: '#32D3EE', backgroundColor: 'rgba(50,211,238,0.12)' },
  actionBtnText: { fontFamily: 'monospace', fontSize: 10, color: '#666', letterSpacing: 1 },
  actionBtnTextActive: { color: '#32D3EE', fontWeight: 'bold' },
  actionDesc: { fontFamily: 'monospace', fontSize: 10, color: '#666', marginTop: 8, lineHeight: 15 },
  box: { backgroundColor: '#0A0A0A', borderWidth: 1, borderColor: '#222', padding: 20, marginTop: 8 },
  boxTitle: { fontFamily: 'monospace', fontSize: 11, color: '#32D3EE', letterSpacing: 1, marginBottom: 8 },
  input: { backgroundColor: '#121212', borderWidth: 1, borderColor: '#2A2A2A', paddingHorizontal: 12, paddingVertical: 10, color: '#FFF', fontFamily: 'monospace', fontSize: 13 },
  button: { backgroundColor: '#32D3EE', paddingVertical: 14, alignItems: 'center', marginTop: 24 },
  buttonDisabled: { opacity: 0.5 },
  buttonText: { fontFamily: 'monospace', fontSize: 11, fontWeight: 'bold', color: '#000', letterSpacing: 1 },
  backButton: { marginTop: 24, alignItems: 'center' },
  backText: { fontFamily: 'monospace', fontSize: 11, color: '#666' },
});
