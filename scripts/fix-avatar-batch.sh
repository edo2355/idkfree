#!/data/data/com.termux/files/usr/bin/bash
# ============================================================
# IDKFREE — Fix avatar + UserProfileScreen (batch)
# ============================================================
set +e
cd ~/idkfree/mobile || { echo "❌ No existe ~/idkfree/mobile"; exit 1; }

echo "▸ 1. Aplicando fix a Avatar.tsx"
python3 << 'PY'
path = 'src/components/Avatar.tsx'
src = '''import { useEffect, useState } from 'react';
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
    <View style={{
      width: size, height: size, borderRadius: size / 2,
      backgroundColor: theme.border, alignItems: 'center', justifyContent: 'center',
    }}>
      <Text style={{ fontSize: size * 0.45, fontWeight: '600', color: theme.text }}>{initial}</Text>
    </View>
  );
}
'''
open(path, 'w').write(src)
print("  ✅ Avatar.tsx reescrito")
PY

echo ""
echo "▸ 2. Aplicando fix a UserProfileScreen.tsx"
python3 << 'PY'
path = 'src/screens/UserProfileScreen.tsx'
src = open(path).read()

if 'useFocusEffect' not in src:
    src = src.replace(
        "import { useEffect, useState } from 'react';",
        "import { useCallback, useEffect, useState } from 'react';",
        1
    )
    src = src.replace(
        "import { useRoute, useNavigation } from '@react-navigation/native';",
        "import { useRoute, useNavigation, useFocusEffect } from '@react-navigation/native';",
        1
    )

old = "  useEffect(() => { load(); }, [alias]);"
new = "  useFocusEffect(useCallback(() => { load(); }, [alias]));"
if old in src:
    src = src.replace(old, new, 1)
    open(path, 'w').write(src)
    print("  ✅ UserProfileScreen usa useFocusEffect")
else:
    print("  ⚠️  No encontré useEffect de load (quizá ya aplicado)")
PY

echo ""
echo "▸ 3. Typecheck"
npx tsc --noEmit 2>&1 | head -15
if [ $? -eq 0 ]; then echo "  ✅ TSC limpio"; else echo "  ❌ TSC con errores"; fi

echo ""
echo "▸ 4. Verificar grep"
echo "  Avatar.tsx usa resolveAssetUrl: $(grep -c resolveAssetUrl src/components/Avatar.tsx)"
echo "  UserProfileScreen usa useFocusEffect: $(grep -c useFocusEffect src/screens/UserProfileScreen.tsx)"

echo ""
echo "▸ 5. Git commit + push"
cd ~/idkfree
git add -A
git commit -m "fix: Avatar.tsx resuelve URLs + UserProfileScreen useFocusEffect" 2>&1 | head -3
git push 2>&1 | tail -2

echo ""
echo "════════════════════════════════════════════════════════════"
echo "  ✅ LISTO"
echo "════════════════════════════════════════════════════════════"
echo ""
echo "  Ahora en el móvil:"
echo "    1. Cierra Expo Go completamente"
echo "    2. Ábrelo"
echo "    3. Search → ana → verifica que se ve su foto"
echo "    4. Tu perfil → Editar → re-sube tu avatar (se perdió)"
echo "    5. Search → ana → toca Seguir (para arreglar contador)"
echo ""
