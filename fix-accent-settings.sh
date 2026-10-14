#!/data/data/com.termux/files/usr/bin/bash
set +e
cd ~/idkfree/mobile || exit 1

echo "════════════════════════════════════════════════════"
echo "  FIX — Accent dinámico + Settings reorganizado"
echo "════════════════════════════════════════════════════"
echo ""

# ---------- 1. themeStore con accent ----------
echo "▸ 1. themeStore con accent"
cat > src/stores/themeStore.ts << 'TS'
import { create } from 'zustand';
import { useColorScheme } from 'react-native';
import { lightTheme } from '../theme/light';
import { darkTheme } from '../theme/dark';
import { DEFAULT_ACCENT, getAccent, type AccentName } from '../theme/accents';

type Theme = 'light' | 'dark' | 'auto';

interface ThemeState {
  theme: Theme;
  accent: AccentName;
  setTheme: (t: Theme) => void;
  setAccent: (a: AccentName) => void;
}

export const useThemeStore = create<ThemeState>((set) => ({
  theme: 'auto',
  accent: DEFAULT_ACCENT,
  setTheme: (theme) => set({ theme }),
  setAccent: (accent) => set({ accent }),
}));

export function useTheme() {
  const mode = useThemeStore((s) => s.theme);
  const accentName = useThemeStore((s) => s.accent);
  const system = useColorScheme();
  const actual: 'light' | 'dark' = mode === 'auto' ? ((system ?? 'dark') as any) : (mode as any);
  const base = actual === 'dark' ? darkTheme : lightTheme;
  const accentColor = getAccent(accentName, actual);
  return { ...base, accent: accentColor, accentName };
}
TS
echo "  ✅"

# ---------- 2. SettingsScreen reescrito ----------
echo "▸ 2. SettingsScreen con secciones"
cat > src/screens/SettingsScreen.tsx << 'TSX'
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
TSX
echo "  ✅"

# ---------- 3. Cargar accent al abrir perfil ----------
echo "▸ 3. ProfileScreen aplica accent al cargar"
python3 << 'PY'
path = 'src/screens/ProfileScreen.tsx'
src = open(path).read()
if 'setAccent' not in src:
    if 'useThemeStore' not in src:
        src = src.replace(
            "import { useTheme } from '../stores/themeStore';",
            "import { useTheme, useThemeStore } from '../stores/themeStore';",
            1
        )
    old = "      setProfile(res);"
    new = "      setProfile(res);\n      if ((res?.user as any)?.accent_color) {\n        useThemeStore.getState().setAccent((res.user as any).accent_color);\n      }"
    if old in src:
        src = src.replace(old, new, 1)
        open(path, 'w').write(src)
        print("  ✅")
    else:
        print("  ⚠️  no encontré 'setProfile(res)'")
else:
    print("  ·  ya aplicado")
PY

# ---------- 4. PostCard con accent en ❤️ ----------
echo "▸ 4. PostCard ❤️ con accent"
python3 << 'PY'
path = 'src/components/PostCard.tsx'
src = open(path).read()
orig = src
src = src.replace(
    "<HeartIcon size={22} color={liked ? theme.danger : theme.textMuted} filled={liked} />",
    "<HeartIcon size={22} color={liked ? theme.accent : theme.textMuted} filled={liked} />",
    1
)
if src != orig:
    open(path, 'w').write(src)
    print("  ✅")
else:
    print("  ·  ya estaba")
PY

# ---------- 5. ProfileTabs con accent ----------
echo "▸ 5. ProfileTabs tab activo con accent"
python3 << 'PY'
path = 'src/components/ProfileTabs.tsx'
src = open(path).read()
orig = src
src = src.replace(
    "borderBottomColor: theme.text,",
    "borderBottomColor: theme.accent,",
    1
)
if src != orig:
    open(path, 'w').write(src)
    print("  ✅")
else:
    print("  ·  ya estaba")
PY

# ---------- 6. Typecheck ----------
echo ""
echo "▸ 6. Typecheck"
npx tsc --noEmit 2>&1 | head -15
if [ ${PIPESTATUS[0]} -eq 0 ]; then
  echo "  ✅ TSC limpio"
  TSC_OK=1
else
  echo "  ❌ TSC con errores"
  TSC_OK=0
fi

# ---------- 7. Commit ----------
echo ""
if [ "$TSC_OK" = "1" ]; then
  echo "▸ 7. Commit + push"
  cd ~/idkfree
  git add -A
  git commit -m "feat(theme): accent colors dinámicos + Settings reorganizado con secciones" 2>&1 | head -2
  git push 2>&1 | tail -2
fi

echo ""
echo "════════════════════════════════════════════════════"
echo "  ✅ Accent + Settings listos"
echo "════════════════════════════════════════════════════"
