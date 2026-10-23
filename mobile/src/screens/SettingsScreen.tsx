import { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, LayoutAnimation, Platform, UIManager } from 'react-native';
import { idkAlert as Alert } from '../components/IDKAlert';
import { useNavigation } from '@react-navigation/native';
import { useTheme, useThemeStore } from '../stores/themeStore';
import { useAuthStore } from '../stores/authStore';
import { fonts } from '../theme/fonts';
import { api } from '../api/client';
import { ACCENTS, type AccentName } from '../theme/accents';
import { ScreenBackground } from '../components/ScreenBackground';
import { ConnectionHUD } from '../components/ConnectionHUD';

const MONO = 'monospace';

// Habilitar animación de layout en Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

// ---------- Grupo expandible ----------
function Group({ title, code, children, defaultOpen = false }: any) {
  const theme = useTheme();
  const [open, setOpen] = useState(defaultOpen);

  function toggle() {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setOpen((o: boolean) => !o);
  }

  return (
    <View style={{ marginTop: 18 }}>
      <TouchableOpacity onPress={toggle} activeOpacity={0.7} style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 10 }}>
        <Text style={{ color: theme.accent, fontFamily: MONO, fontSize: 10, letterSpacing: 1.5, marginRight: 8 }}>
          {code}
        </Text>
        <Text style={{ color: theme.text, fontFamily: fonts.medium, fontSize: 13, letterSpacing: 1, flex: 1 }}>
          {title}
        </Text>
        <Text style={{ color: theme.textMuted, fontFamily: MONO, fontSize: 14 }}>
          {open ? '−' : '+'}
        </Text>
      </TouchableOpacity>
      {open ? (
        <View style={{ marginTop: 4, borderLeftWidth: 1, borderLeftColor: theme.border, paddingLeft: 12 }}>
          {children}
        </View>
      ) : null}
    </View>
  );
}

// ---------- Fila ----------
function Row({ label, value, danger, onPress, accent }: any) {
  const theme = useTheme();
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={!onPress}
      activeOpacity={onPress ? 0.6 : 1}
      style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: theme.border }}
    >
      <Text style={{
        color: danger ? theme.danger : accent ? theme.accent : theme.text,
        fontFamily: fonts.regular,
        fontSize: 14,
        flex: 1,
      }}>
        {label}
      </Text>
      {value ? (
        <Text style={{ color: theme.textMuted, fontFamily: MONO, fontSize: 11, marginRight: 8, letterSpacing: 0.5 }}>
          {value}
        </Text>
      ) : null}
      {onPress ? <Text style={{ color: theme.textMuted, fontFamily: fonts.regular, fontSize: 15 }}>›</Text> : null}
    </TouchableOpacity>
  );
}

// ---------- Pantalla ----------
export function SettingsScreen() {
  const theme = useTheme();
  const navigation = useNavigation<any>();
  const mode = useThemeStore((s) => s.theme);
  const setTheme = useThemeStore((s) => s.setTheme);
  const accent = useThemeStore((s) => s.accent);
  const setAccent = useThemeStore((s) => s.setAccent);
  const user = useAuthStore((s) => s.user);
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const [saving, setSaving] = useState(false);

  async function handleChangeAccent(name: AccentName) {
    setAccent(name);
    setSaving(true);
    try {
      await api.profile.update({ accent_color: name });
    } catch {}
    setSaving(false);
  }

  function handleLogout() {
    Alert.alert('Cerrar sesión', '¿Seguro que quieres salir?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Salir', style: 'destructive', onPress: () => clearAuth() },
    ]);
  }

  return (
    <View style={{ flex: 1, backgroundColor: theme.bg }}>
      <ScreenBackground variant="hex" opacity={0.04} />
      <ScrollView contentContainerStyle={{ padding: 20, paddingTop: 60, paddingBottom: 60 }}>
        <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.6}>
          <Text style={{ color: theme.text, fontFamily: fonts.medium, fontSize: 15 }}>← Atrás</Text>
        </TouchableOpacity>

        {/* Header */}
        <View style={{ marginTop: 20 }}>
          <Text style={{ color: theme.textSubtle, fontFamily: MONO, fontSize: 10, letterSpacing: 2, marginBottom: 6 }}>
            IDKFREE · SYS · v2.0.0
          </Text>
          <Text style={{ fontSize: 30, color: theme.text, fontFamily: fonts.displayBoldItalic, letterSpacing: 0.5 }}>
            Ajustes
          </Text>
          {user?.alias ? (
            <Text style={{ color: theme.textMuted, fontFamily: MONO, fontSize: 11, letterSpacing: 1, marginTop: 8 }}>
              NODE @{user.alias.toUpperCase()} · SESIÓN ACTIVA
            </Text>
          ) : null}
        </View>

        {/* ============ GRUPO 01 · CUENTA ============ */}
        <Group title="CUENTA" code="[01]" defaultOpen>
          <Row label="Editar perfil" onPress={() => navigation.navigate('EditProfile')} />
          <Row label="Cambiar contraseña" onPress={() => navigation.navigate('ChangePassword')} />
          <Row label="Carnet IDKFREE" onPress={() => navigation.navigate('Card')} />
        </Group>

        {/* ============ GRUPO 02 · APARIENCIA ============ */}
        <Group title="APARIENCIA" code="[02]" defaultOpen>
          <Row
            label="Tema"
            value={mode.toUpperCase()}
          />
          <View style={{ flexDirection: 'row', paddingVertical: 10, paddingBottom: 14, gap: 8 }}>
            {(['light', 'dark', 'auto'] as const).map((t) => (
              <TouchableOpacity
                key={t}
                onPress={() => setTheme(t)}
                activeOpacity={0.7}
                style={{
                  paddingHorizontal: 14,
                  paddingVertical: 8,
                  borderRadius: 20,
                  borderWidth: 1,
                  borderColor: mode === t ? theme.text : theme.border,
                  backgroundColor: mode === t ? theme.text : 'transparent',
                }}
              >
                <Text style={{ color: mode === t ? theme.bg : theme.text, fontFamily: MONO, fontSize: 11, letterSpacing: 1, textTransform: 'uppercase' }}>
                  {t}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Row label="Color de acento" value={accent.toUpperCase()} />
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10, paddingVertical: 12, paddingBottom: 16 }}>
            {(Object.keys(ACCENTS) as AccentName[]).map((name) => {
              const isActive = accent === name;
              const colorHex = ACCENTS[name][mode === 'light' ? 'light' : 'dark'];
              return (
                <TouchableOpacity
                  key={name}
                  onPress={() => handleChangeAccent(name)}
                  activeOpacity={0.7}
                  style={{ alignItems: 'center', width: 52 }}
                >
                  <View
                    style={{
                      width: 34,
                      height: 34,
                      borderRadius: 17,
                      backgroundColor: colorHex,
                      borderWidth: isActive ? 3 : 1,
                      borderColor: isActive ? theme.text : theme.border,
                    }}
                  />
                  <Text style={{ color: theme.textMuted, fontFamily: MONO, fontSize: 8, marginTop: 4, textTransform: 'capitalize', letterSpacing: 0.5 }}>
                    {name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </Group>

        {/* ============ GRUPO 03 · PRIVACIDAD ============ */}
        <Group title="PRIVACIDAD Y DATOS" code="[03]">
          <Row label="Tus datos" onPress={() => navigation.navigate('MyData')} />
          <Row label="Política de Privacidad" onPress={() => navigation.navigate('Privacy')} />
        </Group>

        {/* ============ GRUPO 04 · LEGAL ============ */}
        <Group title="LEGAL" code="[04]">
          <Row label="Términos y Condiciones" onPress={() => navigation.navigate('Terms')} />
        </Group>

        {/* ============ GRUPO 05 · CONEXIÓN ============ */}
        <Group title="CONEXIÓN" code="[05]">
          <Row label="Servidor" value="idkfreegetid.dpdns.org" />
          <Row label="Estado" value="● ONLINE" />
        </Group>

        {/* ============ GRUPO 09 · DIAGNÓSTICO ============ */}
        <Group title="DIAGNÓSTICO" code="[09]">
          <View style={{ padding: 12 }}>
            <ConnectionHUD />
          </View>
        </Group>

        {/* ============ GRUPO 06 · ACERCA DE ============ */}
        <Group title="ACERCA DE" code="[06]">
          <Row label="Sobre IDKFREE" onPress={() => navigation.navigate('About')} />
          <Row label="Versión" value="2.0.0" />
          <Row label="Desarrollado por" value="Edo Amate" />
          <Row label="Contacto" value="hello@idkfree.app" />
        </Group>

        {/* ============ KYC · VERIFICACIÓN ============ */}
        <View style={{ marginTop: 32 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <Text style={{ color: theme.textMuted, fontFamily: MONO, fontSize: 10, letterSpacing: 2 }}>
              [ 07 ] VERIFICACIÓN
            </Text>
            <View style={{ flex: 1, height: 1, backgroundColor: theme.border }} />
          </View>

          <TouchableOpacity
            onPress={() => navigation.navigate('Kyc')}
            activeOpacity={0.7}
            style={{
              padding: 16,
              borderRadius: 8,
              backgroundColor: 'rgba(234, 179, 8, 0.08)',
              borderWidth: 1,
              borderColor: '#EAB308',
              flexDirection: 'row',
              alignItems: 'center',
              gap: 12,
            }}
          >
            <Text style={{ fontSize: 20, color: '#EAB308' }}>[ ! ]</Text>
            <View style={{ flex: 1 }}>
              <Text style={{ color: '#EAB308', fontFamily: MONO, fontSize: 12, fontWeight: '700', letterSpacing: 1.5 }}>
                CUENTA SIN VERIFICAR
              </Text>
              <Text style={{ color: theme.textMuted, fontFamily: fonts.regular, fontSize: 11, marginTop: 4, lineHeight: 15 }}>
                Verifica tu identidad para desbloquear funciones avanzadas.
              </Text>
            </View>
            <Text style={{ color: '#EAB308', fontFamily: MONO, fontSize: 18 }}>›</Text>
          </TouchableOpacity>
        </View>

        {/* ============ SESIÓN ============ */}
        <View style={{ marginTop: 32 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <Text style={{ color: theme.textMuted, fontFamily: MONO, fontSize: 10, letterSpacing: 2 }}>
              [ 08 ] SESIÓN
            </Text>
            <View style={{ flex: 1, height: 1, backgroundColor: theme.border }} />
          </View>

          <TouchableOpacity
            onPress={handleLogout}
            activeOpacity={0.7}
            style={{
              paddingVertical: 14,
              borderRadius: 8,
              alignItems: 'center',
              backgroundColor: 'transparent',
              borderWidth: 1,
              borderColor: theme.border,
            }}
          >
            <Text style={{ color: theme.text, fontFamily: fonts.medium, fontSize: 14 }}>
              Cerrar sesión
            </Text>
          </TouchableOpacity>
        </View>

        {/* ============ ZONA DE PELIGRO ============ */}
        <View style={{ marginTop: 32, paddingTop: 20, borderTopWidth: 1, borderTopColor: 'rgba(239,68,68,0.3)' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <Text style={{ color: theme.danger, fontFamily: MONO, fontSize: 10, letterSpacing: 2 }}>
              [ ! ] ZONA DE PELIGRO
            </Text>
            <View style={{ flex: 1, height: 1, backgroundColor: 'rgba(239,68,68,0.3)' }} />
          </View>

          <TouchableOpacity
            onPress={() => navigation.navigate('MyData')}
            activeOpacity={0.7}
            style={{
              paddingVertical: 14,
              borderRadius: 8,
              alignItems: 'center',
              backgroundColor: 'transparent',
              borderWidth: 1,
              borderColor: theme.danger,
            }}
          >
            <Text style={{ color: theme.danger, fontFamily: fonts.medium, fontSize: 14 }}>
              Eliminar mi cuenta
            </Text>
          </TouchableOpacity>
        </View>

        

        {/* Footer */}
        <View style={{ marginTop: 40, alignItems: 'center' }}>
          <Text style={{ color: theme.textSubtle, fontFamily: MONO, fontSize: 9, letterSpacing: 2, textAlign: 'center' }}>
            IDKFREE.OS · v2.0.0
          </Text>
          <Text style={{ color: theme.textSubtle, fontFamily: MONO, fontSize: 8, letterSpacing: 2, textAlign: 'center', marginTop: 6 }}>
            © 2026 EDO AMATE
          </Text>
          <Text style={{ color: theme.textSubtle, fontFamily: MONO, fontSize: 8, letterSpacing: 4, textAlign: 'center', marginTop: 10 }}>
            "MÁS QUE UNA PREGUNTA"
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
