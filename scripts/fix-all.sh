#!/data/data/com.termux/files/usr/bin/bash
# ============================================================
# IDKFREE — Fix batch: Avatar + UserProfile + verificación
# ============================================================
set +e
cd ~/idkfree/mobile || { echo "❌ No existe mobile/"; exit 1; }

echo "════════════════════════════════════════════════════"
echo "  IDKFREE — FIX BATCH"
echo "════════════════════════════════════════════════════"
echo ""

# ---------- FIX 1: Avatar.tsx ----------
echo "▸ 1/5  Reescribiendo Avatar.tsx"
cat > src/components/Avatar.tsx << 'TSX'
import { useEffect, useState } from 'react';
import { View, Text, Image } from 'react-native';
import { useTheme } from '../stores/themeStore';
import { resolveAssetUrl } from '../utils/assetUrl';

interface Props { name?: string | null; url?: string | null; size?: number; }

export function Avatar({ name, url, size = 40 }: Props) {
  const theme = useTheme();
  const initial = name?.[0]?.toUpperCase() ?? '?';
  const [resolved, setResolved] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!url) { if (!cancelled) setResolved(null); return; }
      const u = await resolveAssetUrl(url);
      if (!cancelled) setResolved(u);
    })();
    return () => { cancelled = true; };
  }, [url]);

  if (resolved) {
    return <Image source={{ uri: resolved }} style={{ width: size, height: size, borderRadius: size / 2 }} />;
  }
  return (
    <View style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: theme.border, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ fontSize: size * 0.45, fontWeight: '600', color: theme.text }}>{initial}</Text>
    </View>
  );
}
TSX
echo "   ✅ Avatar.tsx actualizado"

# ---------- FIX 2: UserProfileScreen ----------
echo "▸ 2/5  Añadiendo useFocusEffect a UserProfileScreen"
python3 << 'PY'
path = 'src/screens/UserProfileScreen.tsx'
src = open(path).read()

if 'useCallback' not in src.split('\n')[0]:
    src = src.replace(
        "import { useEffect, useState } from 'react';",
        "import { useCallback, useEffect, useState } from 'react';", 1)
if 'useFocusEffect' not in src:
    src = src.replace(
        "import { useRoute, useNavigation } from '@react-navigation/native';",
        "import { useRoute, useNavigation, useFocusEffect } from '@react-navigation/native';", 1)
old = "  useEffect(() => { load(); }, [alias]);"
new = "  useFocusEffect(useCallback(() => { load(); }, [alias]));"
if old in src:
    src = src.replace(old, new, 1)
    open(path, 'w').write(src)
    print("   ✅ useFocusEffect aplicado")
else:
    print("   ⚠️  ya aplicado o no encontrado")
PY

# ---------- TYPECHECK ----------
echo "▸ 3/5  Typecheck"
npx tsc --noEmit 2>&1 | head -10
if [ ${PIPESTATUS[0]} -eq 0 ]; then
  echo "   ✅ TSC limpio"
  TSC_OK=1
else
  echo "   ❌ TSC con errores — NO se commiteará"
  TSC_OK=0
fi

# ---------- GREP VERIFY ----------
echo "▸ 4/5  Verificación"
echo "   Avatar usa resolveAssetUrl: $(grep -c resolveAssetUrl src/components/Avatar.tsx)"
echo "   UserProfile usa useFocusEffect: $(grep -c useFocusEffect src/screens/UserProfileScreen.tsx)"

# ---------- COMMIT + PUSH ----------
echo "▸ 5/5  Git commit + push"
if [ "$TSC_OK" = "1" ]; then
  cd ~/idkfree
  git add -A
  git commit -m "fix: Avatar.tsx resuelve URLs + UserProfileScreen useFocusEffect" 2>&1 | head -2
  git push 2>&1 | tail -2
  echo "   ✅ Pusheado"
else
  echo "   ⏭  Saltado por errores de tsc"
fi

echo ""
echo "════════════════════════════════════════════════════"
echo "  ✅ FIN"
echo "════════════════════════════════════════════════════"
echo ""
echo "  AHORA EN EL MÓVIL:"
echo "  1. Cierra Expo Go completamente"
echo "  2. Ábrelo"
echo "  3. Search → ana → ¿se ve su foto?"
echo "  4. Editar perfil → re-sube tu avatar (se perdió)"
echo "  5. Search → ana → Seguir (re-crear follow)"
echo ""
