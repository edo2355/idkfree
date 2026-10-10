import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme, useThemeStore } from '../stores/themeStore';
import { useAuthStore } from '../stores/authStore';
import { fonts } from '../theme/fonts';
import { ACCENTS } from '../theme/accents';

export function SettingsScreen() {
  const theme = useTheme();
  const navigation = useNavigation<any>();
  const { theme: mode, setTheme } = useThemeStore();
  const { clearAuth } = useAuthStore();

  function Row({ label, onPress, danger }: { label: string; onPress?: () => void; danger?: boolean }) {
    return (
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.6}
        style={{
          paddingVertical: 16,
          borderBottomWidth: 1,
          borderBottomColor: theme.border,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Text style={{ color: danger ? theme.danger : theme.text, fontFamily: fonts.regular, fontSize: 15 }}>
          {label}
        </Text>
        <Text style={{ color: theme.textMuted, fontFamily: fonts.regular, fontSize: 15 }}>›</Text>
      </TouchableOpacity>
    );
  }

  function SectionTitle({ children }: { children: string }) {
    return (
      <Text style={{ color: theme.textMuted, fontFamily: fonts.medium, fontSize: 11, letterSpacing: 1.5, marginTop: 24, marginBottom: 8 }}>
        {children}
      </Text>
    );
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: theme.bg }} contentContainerStyle={{ padding: 20, paddingTop: 60, paddingBottom: 60 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 24 }}>
        <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.6}>
          <Text style={{ color: theme.text, fontFamily: fonts.medium, fontSize: 15 }}>← Atrás</Text>
        </TouchableOpacity>
      </View>

      <Text style={{ fontSize: 28, color: theme.text, fontFamily: fonts.displayBoldItalic, letterSpacing: 0.5 }}>
        Ajustes
      </Text>

      {/* Apariencia */}
      <SectionTitle>APARIENCIA</SectionTitle>
      <View style={{ flexDirection: 'row', gap: 8 }}>
        {(['dark', 'light', 'auto'] as const).map((t) => (
          <TouchableOpacity
            key={t}
            onPress={() => setTheme(t)}
            activeOpacity={0.7}
            style={{
              flex: 1,
              paddingVertical: 12,
              borderRadius: 8,
              alignItems: 'center',
              borderWidth: 1,
              borderColor: mode === t ? theme.text : theme.border,
              backgroundColor: mode === t ? theme.text : 'transparent',
            }}
          >
            <Text style={{ color: mode === t ? theme.bg : theme.text, fontFamily: fonts.medium, fontSize: 13, textTransform: 'capitalize' }}>
              {t === 'dark' ? 'Oscuro' : t === 'light' ? 'Claro' : 'Auto'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Color de acento */}
      <SectionTitle>COLOR DE ACENTO</SectionTitle>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
        {Object.entries(ACCENTS).map(([key, a]) => (
          <View key={key} style={{ alignItems: 'center', width: 56 }}>
            <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: mode === 'dark' ? a.dark : a.light, borderWidth: 2, borderColor: theme.border }} />
            <Text style={{ color: theme.textMuted, fontFamily: fonts.regular, fontSize: 10, marginTop: 4, textTransform: 'capitalize' }}>{a.name}</Text>
          </View>
        ))}
      </View>

      {/* Cuenta */}
      <SectionTitle>CUENTA</SectionTitle>
      <Row label="Editar perfil" onPress={() => navigation.navigate('EditProfile')} />
      <Row label="Cambiar contraseña" onPress={() => navigation.navigate("ChangePassword")} />
      <Row label="Carnet digital" onPress={() => navigation.navigate("Card")} />

      {/* Privacidad */}
      <SectionTitle>PRIVACIDAD</SectionTitle>
      <Row label="Seguridad" />
      <Row label="Notificaciones" />

      {/* Acerca de */}
      <SectionTitle>ACERCA DE</SectionTitle>
      <Row label="Versión 2.0.0" />
      <Row label="Acerca de IDKFREE" />
      <Row label="Ayuda" />

      {/* Cerrar sesión */}
      <SectionTitle>SESIÓN</SectionTitle>
      <Row label="Cerrar sesión" danger onPress={clearAuth} />

      <Text style={{ color: theme.textSubtle, fontFamily: fonts.regular, fontSize: 11, textAlign: 'center', marginTop: 32 }}>
        IDKFREE · More than a question
      </Text>
    </ScrollView>
  );
}
