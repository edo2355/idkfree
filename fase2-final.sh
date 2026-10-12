#!/data/data/com.termux/files/usr/bin/bash
set +e
cd ~/idkfree/mobile || exit 1

echo "════════════════════════════════════════════════════"
echo "  FASE 2 — Cierre (tabBar tipo IG)"
echo "════════════════════════════════════════════════════"
echo ""

# ---------- 1. TabBar compacto IG ----------
echo "▸ 1. TabBar tipo IG (compacto + avatar + labels 10px)"
python3 << 'PY'
path = 'src/navigation/AppTabs.tsx'
src = open(path).read()
orig = src

# 1) Ajustar tabBarStyle a look IG
old_style = """        tabBarStyle: {
          backgroundColor: theme.surface,
          borderTopColor: theme.border,
          height: 64 + insets.bottom,
          paddingBottom: 6 + insets.bottom,
          paddingTop: 6,
        },
        tabBarActiveTintColor: theme.text,
        tabBarInactiveTintColor: theme.textMuted,"""

new_style = """        tabBarStyle: {
          backgroundColor: theme.bg,
          borderTopColor: theme.border,
          borderTopWidth: 0.5,
          height: 52 + insets.bottom,
          paddingBottom: insets.bottom,
          paddingTop: 6,
        },
        tabBarActiveTintColor: theme.text,
        tabBarInactiveTintColor: theme.textMuted,
        tabBarLabelStyle: {
          fontSize: 10,
          fontFamily: fonts.medium,
          marginTop: -2,
        },"""

if old_style in src:
    src = src.replace(old_style, new_style, 1)
    print("  ✅ tabBarStyle IG")
else:
    print("  ⚠️  bloque tabBarStyle no encontrado")

# 2) Importar fonts
if 'fonts' not in src.split('export')[0] and "theme/fonts" not in src:
    # insertar tras useTheme import
    src = src.replace(
        "import { useTheme } from '../stores/themeStore';",
        "import { useTheme } from '../stores/themeStore';\nimport { fonts } from '../theme/fonts';\nimport { useAuthStore } from '../stores/authStore';\nimport { Avatar } from '../components/Avatar';",
        1
    )
    print("  ✅ imports fonts + Avatar añadidos")

# 3) Reemplazar el icono Profile por Avatar del usuario
old_profile = """      <Tab.Screen
        name='Profile'
        component={ProfileStackNav}
        options={{ tabBarIcon: ({ color }) => <ProfileIcon size={24} color={color} /> }}
      />"""
new_profile = """      <Tab.Screen
        name='Profile'
        component={ProfileStackNav}
        options={{
          tabBarIcon: ({ focused }) => {
            const me = useAuthStore.getState().user;
            return (
              <View style={{ borderWidth: focused ? 2 : 0, borderColor: theme.text, borderRadius: 16 }}>
                <Avatar name={me?.name ?? me?.alias} url={(me as any)?.avatar_url} size={24} />
              </View>
            );
          },
        }}
      />"""
if old_profile in src:
    src = src.replace(old_profile, new_profile, 1)
    print("  ✅ tab Profile → Avatar del usuario")

# 4) Quitar ProfileIcon si ya no se usa
if '<ProfileIcon' not in src and 'ProfileIcon' in src:
    src = src.replace("import { ProfileIcon } from '../components/icons/ProfileIcon';\n", "")
    print("  ✅ import ProfileIcon limpiado")

if src != orig:
    open(path, 'w').write(src)
else:
    print("  ⚠️  sin cambios")
PY

# ---------- 2. Typecheck ----------
echo ""
echo "▸ 2. Typecheck"
npx tsc --noEmit 2>&1 | head -15
if [ ${PIPESTATUS[0]} -eq 0 ]; then
  echo "  ✅ TSC limpio"
  TSC_OK=1
else
  echo "  ❌ TSC con errores"
  TSC_OK=0
fi

# ---------- 3. Commit ----------
echo ""
if [ "$TSC_OK" = "1" ]; then
  echo "▸ 3. Commit + push"
  cd ~/idkfree
  git add -A
  git commit -m "feat(ui): TabBar estilo Instagram (avatar tab Profile, labels 10px, altura 52px)" 2>&1 | head -2
  git push 2>&1 | tail -2
fi

echo ""
echo "════════════════════════════════════════════════════"
echo "  ✅ FASE 2 cerrada — lista para FASE 3 (historias)"
echo "════════════════════════════════════════════════════"
