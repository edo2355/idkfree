// ============================================================
// KycScreen.tsx — Verificación de identidad (KYC) con cámara real
// ============================================================
import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, Image,
  TextInput, ActivityIndicator, Alert, Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { useTheme } from '../stores/themeStore';
import { fonts } from '../theme/fonts';
import { ScreenBackground } from '../components/ScreenBackground';
import { IDKButton } from '../components/IDKButton';
import { api, ApiError } from '../api/client';

type KycStatus = 'loading' | 'unverified' | 'pending' | 'verified' | 'rejected' | 'error';

const STATUS_INFO: Record<Exclude<KycStatus, 'loading' | 'error'>, { icon: string; label: string; color: string; desc: string }> = {
  unverified: {
    icon: '[ ! ]',
    label: 'CUENTA SIN VERIFICAR',
    color: '#EAB308',
    desc: 'Verifica tu identidad para desbloquear funciones avanzadas y aumentar tu nivel de confianza en la red.',
  },
  pending: {
    icon: '[ ⟳ ]',
    label: 'VERIFICACIÓN EN CURSO',
    color: '#3B82F6',
    desc: 'Estamos revisando tus documentos. El proceso puede tardar hasta 48 horas.',
  },
  verified: {
    icon: '[ ✓ ]',
    label: 'CUENTA VERIFICADA',
    color: '#22C55E',
    desc: 'Tu identidad ha sido verificada. Ahora tienes acceso completo a todas las funciones.',
  },
  rejected: {
    icon: '[ × ]',
    label: 'VERIFICACIÓN RECHAZADA',
    color: '#EF4444',
    desc: 'Tu verificación fue rechazada. Revisa los datos y vuelve a enviar tus documentos.',
  },
};

const STEPS = [
  { code: '01', title: 'EMAIL', desc: 'Confirma tu correo electrónico' },
  { code: '02', title: 'TELÉFONO', desc: 'Verifica tu número de móvil' },
  { code: '03', title: 'DOCUMENTO', desc: 'Sube tu cédula, pasaporte o ID' },
  { code: '04', title: 'SELFIE', desc: 'Foto de tu rostro para comparar' },
];

const DOC_TYPES = [
  { value: 'id_card', label: 'CARNET DE IDENTIDAD' },
  { value: 'passport', label: 'PASAPORTE' },
  { value: 'driver_license', label: 'LICENCIA DE CONDUCIR' },
];

export function KycScreen() {
  const theme = useTheme();
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();

  const [status, setStatus] = useState<KycStatus>('loading');
  const [docType, setDocType] = useState('id_card');
  const [docNumber, setDocNumber] = useState('');
  const [docPhoto, setDocPhoto] = useState<string | null>(null);
  const [selfiePhoto, setSelfiePhoto] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [adminNotes, setAdminNotes] = useState('');

  // Cargar estado real del backend al montar
  useEffect(() => {
    (async () => {
      try {
        const res = await api.kyc.status();
        const s = (res?.status as KycStatus) || 'unverified';
        setStatus(s);
        if (res?.admin_notes) setAdminNotes(res.admin_notes);
      } catch (err: any) {
        if (err instanceof ApiError && err.status === 401) {
          setStatus('error');
          setError('Sesión expirada. Vuelve a iniciar sesión.');
        } else {
          setStatus('unverified');
        }
      }
    })();
  }, []);

  async function pickImage(setter: (v: string | null) => void, isSelfie: boolean) {
    try {
      const perm = await ImagePicker.requestCameraPermissionsAsync();
      if (!perm.granted) {
        Alert.alert('Permiso denegado', 'Necesitamos acceso a tu cámara para verificar tu identidad.');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ['images'] as any,
        allowsEditing: true,
        aspect: isSelfie ? [1, 1] : [16, 9],
        quality: 0.6,
        base64: true,
      });

      if (result.canceled || !result.assets?.[0]?.base64) return;

      const asset = result.assets[0];
      const mime = asset.mimeType || 'image/jpeg';
      setter(`data:${mime};base64,${asset.base64}`);
    } catch (err: any) {
      Alert.alert('Error', err.message || 'No se pudo abrir la cámara.');
    }
  }

  async function handleSubmit() {
    setError('');
    if (!docNumber.trim()) return setError('Ingresa tu número de documento.');
    if (!docPhoto) return setError('Debes tomar una foto del documento.');
    if (!selfiePhoto) return setError('Debes tomarte una selfie.');

    setSubmitting(true);
    try {
      await api.kyc.submit({
        document_type: docType,
        document_number: docNumber.trim(),
        document_photo: docPhoto,
        selfie_photo: selfiePhoto,
      });
      setStatus('pending');
    } catch (err: any) {
      if (err instanceof ApiError) {
        setError(err.status === 401 ? 'Sesión expirada' : err.message);
      } else {
        setError('Error de red. Intenta de nuevo.');
      }
    } finally {
      setSubmitting(false);
    }
  }

  // Pantalla de carga
  if (status === 'loading') {
    return (
      <View style={{ flex: 1, backgroundColor: theme.bg, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator color="#00E5FF" size="large" />
        <Text style={{ color: theme.textMuted, marginTop: 12, fontFamily: 'monospace', fontSize: 12, letterSpacing: 1.5 }}>
          [ CONSULTANDO ESTADO ]
        </Text>
      </View>
    );
  }

  const info = status === 'error' ? null : STATUS_INFO[status as Exclude<KycStatus, 'loading' | 'error'>];

  return (
    <View style={{ flex: 1, backgroundColor: theme.bg }}>
      <ScreenBackground variant="pulse" opacity={0.05} />
      <ScrollView
        contentContainerStyle={{ padding: 24, paddingTop: insets.top + 24, paddingBottom: insets.bottom + 32 }}
      >
        {/* Header */}
        <Text style={{ color: theme.textSubtle, fontFamily: 'monospace', fontSize: 10, letterSpacing: 2, marginBottom: 6 }}>
          [ KYC — VERIFICACIÓN ]
        </Text>
        <Text style={{ color: theme.text, fontFamily: fonts.regular, fontSize: 22, fontWeight: '700', marginBottom: 20 }}>
          Identidad
        </Text>

        {/* Estado */}
        {info && (
          <View
            style={{
              padding: 16, borderRadius: 8, marginBottom: 24,
              backgroundColor: theme.surface, borderWidth: 1, borderColor: info.color,
            }}
          >
            <Text style={{ color: info.color, fontFamily: 'monospace', fontSize: 13, letterSpacing: 1.5, fontWeight: '700', marginBottom: 6 }}>
              {info.icon} {info.label}
            </Text>
            <Text style={{ color: theme.textMuted, fontFamily: fonts.regular, fontSize: 12, lineHeight: 18 }}>
              {info.desc}
            </Text>
            {status === 'rejected' && adminNotes ? (
              <View style={{ marginTop: 10, paddingTop: 10, borderTopWidth: 1, borderTopColor: theme.border }}>
                <Text style={{ color: '#EF4444', fontFamily: 'monospace', fontSize: 10, letterSpacing: 1.5, marginBottom: 4 }}>
                  [ MOTIVO DEL RECHAZO ]
                </Text>
                <Text style={{ color: theme.textMuted, fontFamily: fonts.regular, fontSize: 11 }}>
                  {adminNotes}
                </Text>
              </View>
            ) : null}
          </View>
        )}

        {status === 'error' && (
          <View style={{ padding: 16, borderRadius: 8, marginBottom: 24, backgroundColor: theme.surface, borderWidth: 1, borderColor: '#EF4444' }}>
            <Text style={{ color: '#EF4444', fontFamily: 'monospace', fontSize: 12 }}>[ ERROR ] {error}</Text>
          </View>
        )}

        {/* Formulario (solo si unverified o rejected) */}
        {(status === 'unverified' || status === 'rejected') && (
          <>
            {/* Tipo de documento */}
            <Text style={{ color: theme.textSubtle, fontFamily: 'monospace', fontSize: 10, letterSpacing: 2, marginBottom: 10 }}>
              [ TIPO DE DOCUMENTO ]
            </Text>
            <View style={{ gap: 8, marginBottom: 20 }}>
              {DOC_TYPES.map((d) => (
                <TouchableOpacity
                  key={d.value}
                  onPress={() => setDocType(d.value)}
                  style={{
                    padding: 12, borderRadius: 8, borderWidth: 1,
                    borderColor: docType === d.value ? '#00E5FF' : theme.border,
                    backgroundColor: docType === d.value ? 'rgba(0,229,255,0.08)' : theme.surface,
                  }}
                >
                  <Text style={{
                    color: docType === d.value ? '#00E5FF' : theme.text,
                    fontFamily: 'monospace', fontSize: 11, letterSpacing: 1.5,
                  }}>
                    {docType === d.value ? '[ x ]' : '[   ]'} {d.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Número de documento */}
            <Text style={{ color: theme.textSubtle, fontFamily: 'monospace', fontSize: 10, letterSpacing: 2, marginBottom: 8 }}>
              [ NÚMERO DE DOCUMENTO ]
            </Text>
            <TextInput
              value={docNumber}
              onChangeText={setDocNumber}
              placeholder="Ej. 85010112345"
              placeholderTextColor={theme.textSubtle}
              autoCapitalize="characters"
              style={{
                backgroundColor: theme.surface, borderWidth: 1, borderColor: theme.border,
                borderRadius: 8, padding: 14, color: theme.text, fontFamily: 'monospace',
                fontSize: 13, marginBottom: 20,
              }}
            />

            {/* Foto del documento */}
            <Text style={{ color: theme.textSubtle, fontFamily: 'monospace', fontSize: 10, letterSpacing: 2, marginBottom: 8 }}>
              [ FOTO DEL DOCUMENTO ]
            </Text>
            {docPhoto ? (
              <View style={{ marginBottom: 20 }}>
                <Image source={{ uri: docPhoto }} style={{ width: '100%', height: 180, borderRadius: 8, resizeMode: 'contain', backgroundColor: '#000' }} />
                <TouchableOpacity onPress={() => setDocPhoto(null)} style={{ marginTop: 8, alignSelf: 'flex-start' }}>
                  <Text style={{ color: '#EF4444', fontFamily: 'monospace', fontSize: 11 }}>[ × ] ELIMINAR FOTO</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                onPress={() => pickImage(setDocPhoto, false)}
                style={{
                  padding: 24, borderRadius: 8, borderWidth: 1, borderColor: theme.border,
                  borderStyle: 'dashed', backgroundColor: theme.surface, alignItems: 'center', marginBottom: 20,
                }}
              >
                <Text style={{ color: '#00E5FF', fontFamily: 'monospace', fontSize: 12, letterSpacing: 1.5 }}>
                  [ + ] TOMAR FOTO
                </Text>
              </TouchableOpacity>
            )}

            {/* Selfie */}
            <Text style={{ color: theme.textSubtle, fontFamily: 'monospace', fontSize: 10, letterSpacing: 2, marginBottom: 8 }}>
              [ SELFIE ]
            </Text>
            {selfiePhoto ? (
              <View style={{ marginBottom: 20 }}>
                <Image source={{ uri: selfiePhoto }} style={{ width: '100%', height: 200, borderRadius: 8, resizeMode: 'contain', backgroundColor: '#000' }} />
                <TouchableOpacity onPress={() => setSelfiePhoto(null)} style={{ marginTop: 8, alignSelf: 'flex-start' }}>
                  <Text style={{ color: '#EF4444', fontFamily: 'monospace', fontSize: 11 }}>[ × ] ELIMINAR SELFIE</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                onPress={() => pickImage(setSelfiePhoto, true)}
                style={{
                  padding: 24, borderRadius: 8, borderWidth: 1, borderColor: theme.border,
                  borderStyle: 'dashed', backgroundColor: theme.surface, alignItems: 'center', marginBottom: 20,
                }}
              >
                <Text style={{ color: '#00E5FF', fontFamily: 'monospace', fontSize: 12, letterSpacing: 1.5 }}>
                  [ + ] TOMAR SELFIE
                </Text>
              </TouchableOpacity>
            )}

            {/* Error de submit */}
            {error ? (
              <View style={{ padding: 12, borderRadius: 8, backgroundColor: '#EF444422', borderWidth: 1, borderColor: '#EF4444', marginBottom: 16 }}>
                <Text style={{ color: '#EF4444', fontFamily: 'monospace', fontSize: 11 }}>[ ERROR ] {error}</Text>
              </View>
            ) : null}

            {/* CTA */}
            {submitting ? (
              <View style={{ padding: 16, alignItems: 'center' }}>
                <ActivityIndicator color="#00E5FF" />
                <Text style={{ color: theme.textMuted, fontFamily: 'monospace', fontSize: 11, marginTop: 8 }}>ENVIANDO...</Text>
              </View>
            ) : (
              <IDKButton size="lg" onPress={handleSubmit}>
                ENVIAR VERIFICACIÓN
              </IDKButton>
            )}
          </>
        )}

        {/* Pasos (decorativos) */}
        <View style={{ marginTop: 32 }}>
          <Text style={{ color: theme.textMuted, fontFamily: 'monospace', fontSize: 10, letterSpacing: 2, marginBottom: 12 }}>
            [ PASOS ]
          </Text>
          <View style={{ gap: 10, marginBottom: 24 }}>
            {STEPS.map((step) => {
              const completed =
                (step.code === '03' && !!docPhoto) || (step.code === '04' && !!selfiePhoto);
              return (
                <View
                  key={step.code}
                  style={{
                    flexDirection: 'row', alignItems: 'center', padding: 14, borderRadius: 8,
                    backgroundColor: theme.surface, borderWidth: 1, borderColor: theme.border,
                  }}
                >
                  <Text style={{ color: theme.textSubtle, fontFamily: 'monospace', fontSize: 11, letterSpacing: 1.5, width: 32 }}>
                    [{step.code}]
                  </Text>
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: theme.text, fontFamily: 'monospace', fontSize: 12, fontWeight: '700', letterSpacing: 1 }}>
                      {step.title}
                    </Text>
                    <Text style={{ color: theme.textMuted, fontFamily: fonts.regular, fontSize: 11, marginTop: 2 }}>
                      {step.desc}
                    </Text>
                  </View>
                  <Text style={{ color: completed ? '#22C55E' : theme.textSubtle, fontFamily: 'monospace', fontSize: 14 }}>
                    {completed ? '●' : '○'}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Aviso legal */}
        <View style={{ padding: 14, borderRadius: 8, backgroundColor: theme.surface, borderWidth: 1, borderColor: theme.border }}>
          <Text style={{ color: theme.textSubtle, fontFamily: 'monospace', fontSize: 10, letterSpacing: 1.5, marginBottom: 6 }}>
            [ PRIVACIDAD ]
          </Text>
          <Text style={{ color: theme.textMuted, fontFamily: fonts.regular, fontSize: 11, lineHeight: 16 }}>
            Tus documentos se cifran y solo se usan para verificar tu identidad. No se comparten con terceros.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({});
