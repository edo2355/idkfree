// ============================================================
// KycScreen.tsx — Verificación de identidad (KYC)
// Estados: sin verificar / en revisión / verificada
// ============================================================
import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../stores/themeStore';
import { fonts } from '../theme/fonts';
import { ScreenBackground } from '../components/ScreenBackground';
import { IDKButton } from '../components/IDKButton';

type KycStatus = 'unverified' | 'pending' | 'verified';

const STATUS_INFO: Record<KycStatus, { icon: string; label: string; color: string; desc: string }> = {
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
};

const STEPS = [
  { code: '01', title: 'EMAIL', desc: 'Confirma tu correo electrónico' },
  { code: '02', title: 'TELÉFONO', desc: 'Verifica tu número de móvil' },
  { code: '03', title: 'DOCUMENTO', desc: 'Sube tu cédula, pasaporte o ID' },
  { code: '04', title: 'SELFIE', desc: 'Foto de tu rostro para comparar' },
];

export function KycScreen() {
  const theme = useTheme();
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const [status] = useState<KycStatus>('unverified');

  const info = STATUS_INFO[status];

  async function startVerification(): Promise<boolean> {
    // TODO: implementar flujo KYC real
    return true;
  }

  return (
    <View style={{ flex: 1, backgroundColor: theme.bg }}>
      <ScreenBackground variant="pulse" opacity={0.05} />
      <ScrollView
        contentContainerStyle={{ padding: 20, paddingTop: insets.top + 20, paddingBottom: 60 }}
      >
        {/* Header */}
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
          <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.6} style={{ marginRight: 12 }}>
            <Text style={{ color: theme.text, fontSize: 22 }}>←</Text>
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text style={{ color: theme.textSubtle, fontFamily: 'monospace', fontSize: 10, letterSpacing: 2 }}>
              // KYC_VERIFICATION_PROTOCOL
            </Text>
            <Text style={{ color: theme.text, fontFamily: fonts.displayBoldItalic, fontSize: 26, marginTop: 2 }}>
              Verificación
            </Text>
          </View>
        </View>

        {/* Estado actual */}
        <View
          style={{
            padding: 20,
            borderRadius: 8,
            backgroundColor: info.color + '15',
            borderWidth: 1,
            borderColor: info.color,
            marginBottom: 24,
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 10 }}>
            <Text style={{ color: info.color, fontFamily: 'monospace', fontSize: 22 }}>{info.icon}</Text>
            <Text style={{ color: info.color, fontFamily: 'monospace', fontSize: 13, fontWeight: '700', letterSpacing: 1.5 }}>
              {info.label}
            </Text>
          </View>
          <Text style={{ color: theme.textMuted, fontFamily: fonts.regular, fontSize: 12, lineHeight: 18 }}>
            {info.desc}
          </Text>
        </View>

        {/* Pasos */}
        <Text style={{ color: theme.textMuted, fontFamily: 'monospace', fontSize: 10, letterSpacing: 2, marginBottom: 12 }}>
          [ PASOS ]
        </Text>

        <View style={{ gap: 10, marginBottom: 32 }}>
          {STEPS.map((step) => (
            <View
              key={step.code}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                padding: 14,
                borderRadius: 8,
                backgroundColor: theme.surface,
                borderWidth: 1,
                borderColor: theme.border,
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
              <Text style={{ color: theme.textSubtle, fontFamily: 'monospace', fontSize: 14 }}>○</Text>
            </View>
          ))}
        </View>

        {/* CTA */}
        {status === 'unverified' && (
          <IDKButton size="lg" onPress={startVerification}>
            INICIAR VERIFICACIÓN
          </IDKButton>
        )}

        {/* Aviso legal */}
        <View style={{ marginTop: 24, padding: 14, borderRadius: 8, backgroundColor: theme.surface, borderWidth: 1, borderColor: theme.border }}>
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
