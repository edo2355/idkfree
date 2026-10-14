import { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme, useThemeStore } from '../stores/themeStore';
import { useAuthStore } from '../stores/authStore';
import { fonts } from '../theme/fonts';
import { api } from '../api/client';
import { ACCENTS, type AccentName } from '../theme/accents';

function Section({ title }: { title: string }) {
  const theme = useTheme();
  return (
    <Text style={{
      color: theme.textMuted,
      fontFamily: fonts.medium,
      fontSize: 11,
      letterSpacing: 1.5,
      marginTop: 28,
      marginBottom: 8,
    }}>
      {title}
    </Text>
  );
}

function Row({ label, value, danger, onPress }: { label: string; value?: string; danger?: boolean; onPress?: () => void }) {
  const theme = useTheme();
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={!onPress}
      activeOpacity={onPress ? 0.6 : 1}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: theme.border,
      }}
    >
      <Text style={{ color: danger ? theme.danger : theme.text, fontFamily: fonts.regular, fontSize: 15, flex: 1 }}>
        {label}
      </Text>
      {value ? (
        <Text style={{ color: theme.textMuted, fontFamily: fonts.regular, fontSize: 13, marginRight: 8 }}>
          {value}
        </Text>
      ) : null}
      {onPress ? <Text style={{ color: theme.textMuted, fontFamily: fonts.regular, fontSize: 15 }}>›</Text> : null}
    </TouchableOpacity>
  );
}

export function SettingsScreen() {
  const theme = useTheme();
  const navigation = useNavigation<any>();
  const mode = useThemeStore((s) => s.theme);
  const setTheme = useThemeStore((s) => s.setTheme);
  const accent = useThemeStore((s) => s.accent);
  const setAccent = useThemeStore((s) => s.setAccent);
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
    Alert.alert(
      'Cerrar sesión',
      '¿Seguro que quieres salir?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Salir', style: 'destructive', onPress: () => clearAuth() },
      ]
    );
  }

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: theme.bg }}
      contentContainerStyle={{ padding: 20, paddingTop: 60, paddingBottom: 60 }}
    >
      <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.6}>
        <Text style={{ color: theme.text, fontFamily: fonts.medium, fontSize: 15 }}>← Atrás</Text>
      </TouchableOpacity>

      <Text style={{ fontSize: 28, color: theme.text, fontFamily: fonts.displayBoldItalic, letterSpacing: 0.5, marginTop: 20 }}>
        Ajustes
      </Text>

      {/* CUENTA */}
      <Section title="CUENTA" />
      <Row label="Editar perfil" onPress={() => navigation.navigate('EditProfile')} />
      <Row label="Cambiar contraseña" onPress={() => navigation.navigate('ChangePassword')} />
      <Row label="Carnet IDKFREE" onPress={() => navigation.navigate('Card')} />

      {/* APARIENCIA */}
      <Section title="APARIENCIA" />
      <View style={{ flexDirection: 'row', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: theme.border }}>
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
              marginRight: 8,
            }}
          >
            <Text style={{ color: mode === t ? theme.bg : theme.text, fontFamily: fonts.medium, fontSize: 13, textTransform: 'capitalize' }}>
              {t}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Color de acento */}
      <Text style={{ color: theme.text, fontFamily: fonts.medium, fontSize: 13, marginTop: 16, marginBottom: 12 }}>
        Color de acento
      </Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
        {(Object.keys(ACCENTS) as AccentName[]).map((name) => {
          const isActive = accent === name;
          const colorHex = ACCENTS[name][mode === 'light' ? 'light' : 'dark'];
          return (
            <TouchableOpacity
              key={name}
              onPress={() => handleChangeAccent(name)}
              activeOpacity={0.7}
              style={{ alignItems: 'center', width: 60 }}
            >
              <View
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  backgroundColor: colorHex,
                  borderWidth: isActive ? 3 : 1,
                  borderColor: isActive ? theme.text : theme.border,
                }}
              />
              <Text style={{ color: theme.textMuted, fontFamily: fonts.regular, fontSize: 10, marginTop: 4, textTransform: 'capitalize' }}>
                {name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* CONEXIÓN */}
      <Section title="CONEXIÓN" />
      <Row label="Servidor" value="127.0.0.1:3000" />

      {/* ACERCA DE */}
      <Section title="ACERCA DE" />
      <Row label="Versión" value="2.0.0" />
      <Row label="Desarrollado por" value="Edo Amate" />
      <Row label="Sitio" value="idkfree.app" />

      {/* PELIGRO */}
      <Section title="CUENTA PELIGROSA" />
      <TouchableOpacity
        onPress={handleLogout}
        activeOpacity={0.7}
        style={{
          paddingVertical: 14,
          borderRadius: 8,
          alignItems: 'center',
          backgroundColor: theme.danger,
          marginTop: 8,
        }}
      >
        <Text style={{ color: '#FFFFFF', fontFamily: fonts.medium, fontSize: 14 }}>
          Cerrar sesión
        </Text>
      </TouchableOpacity>

      {/* Pie */}
      <Text style={{ color: theme.textSubtle, fontFamily: fonts.regular, fontSize: 11, textAlign: 'center', marginTop: 32, letterSpacing: 1 }}>
        IDKFREE · 2026 · v2.0.0
      </Text>
    </ScrollView>
  );
}
