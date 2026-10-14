#!/data/data/com.termux/files/usr/bin/bash
set +e
cd ~/idkfree/mobile || exit 1

echo "════════════════════════════════════════════════════"
echo "  Bloque 2/6 — Perfil con números grandes OSHIMA"
echo "════════════════════════════════════════════════════"
echo ""

cp src/screens/ProfileScreen.tsx ~/ProfileScreen.bak
cp src/screens/UserProfileScreen.tsx ~/UserProfileScreen.bak
echo "▸ Backups creados"

# Crear componente reutilizable: StatsHero
echo "▸ Creando StatsHero.tsx"
cat > src/components/StatsHero.tsx << 'TSX'
import { View, Text } from 'react-native';
import { useTheme } from '../stores/themeStore';
import { fonts } from '../theme/fonts';

const MONO = 'monospace';

interface Props {
  stats: { posts: number; followers: number; following: number };
  level?: number;
  joinedAt?: string;
}

export function StatsHero({ stats, level, joinedAt }: Props) {
  const theme = useTheme();
  const lvl = level ?? Math.max(1, Math.floor((stats.posts + stats.followers + stats.following) / 5));

  return (
    <View style={{ marginTop: 20, paddingHorizontal: 20 }}>
      {/* Números grandes estilo OSHIMA */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 12 }}>
        <View style={{ alignItems: 'center', flex: 1 }}>
          <Text style={{ color: theme.text, fontFamily: MONO, fontSize: 42, fontWeight: '700', letterSpacing: -1, lineHeight: 46 }}>
            {String(stats.posts).padStart(2, '0')}
          </Text>
          <Text style={{ color: theme.textMuted, fontFamily: MONO, fontSize: 9, letterSpacing: 2, marginTop: 4 }}>
            POSTS
          </Text>
        </View>
        <View style={{ width: 1, height: 40, backgroundColor: theme.border }} />
        <View style={{ alignItems: 'center', flex: 1 }}>
          <Text style={{ color: theme.text, fontFamily: MONO, fontSize: 42, fontWeight: '700', letterSpacing: -1, lineHeight: 46 }}>
            {String(stats.followers).padStart(2, '0')}
          </Text>
          <Text style={{ color: theme.textMuted, fontFamily: MONO, fontSize: 9, letterSpacing: 2, marginTop: 4 }}>
            FLWR
          </Text>
        </View>
        <View style={{ width: 1, height: 40, backgroundColor: theme.border }} />
        <View style={{ alignItems: 'center', flex: 1 }}>
          <Text style={{ color: theme.text, fontFamily: MONO, fontSize: 42, fontWeight: '700', letterSpacing: -1, lineHeight: 46 }}>
            {String(stats.following).padStart(2, '0')}
          </Text>
          <Text style={{ color: theme.textMuted, fontFamily: MONO, fontSize: 9, letterSpacing: 2, marginTop: 4 }}>
            FLNG
          </Text>
        </View>
        <View style={{ width: 1, height: 40, backgroundColor: theme.border }} />
        <View style={{ alignItems: 'center', flex: 1 }}>
          <Text style={{ color: theme.accent, fontFamily: MONO, fontSize: 42, fontWeight: '700', letterSpacing: -1, lineHeight: 46 }}>
            {String(lvl).padStart(2, '0')}
          </Text>
          <Text style={{ color: theme.accent, fontFamily: MONO, fontSize: 9, letterSpacing: 2, marginTop: 4 }}>
            LEVEL
          </Text>
        </View>
      </View>

      {/* Metadata */}
      {joinedAt ? (
        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 12, marginTop: 8 }}>
          <Text style={{ color: theme.textSubtle, fontFamily: MONO, fontSize: 9, letterSpacing: 1.5 }}>
            SINCE {joinedAt}
          </Text>
          <Text style={{ color: theme.textSubtle, fontFamily: MONO, fontSize: 9 }}>·</Text>
          <Text style={{ color: theme.textSubtle, fontFamily: MONO, fontSize: 9, letterSpacing: 1.5 }}>
            ● ACTIVE
          </Text>
        </View>
      ) : null}
    </View>
  );
}
TSX
echo "  ✅"

# Reemplazar el bloque de stats en ProfileScreen
echo "▸ Actualizando ProfileScreen"
python3 << 'PY'
path = 'src/screens/ProfileScreen.tsx'
src = open(path).read()
orig = src

# Import
if 'StatsHero' not in src:
    src = src.replace(
        "import { ProfileTabs, type ProfileTab } from '../components/ProfileTabs';",
        "import { ProfileTabs, type ProfileTab } from '../components/ProfileTabs';\nimport { StatsHero } from '../components/StatsHero';",
        1
    )
    print("  ✅ import StatsHero")

# Reemplazar el bloque de stats viejo
old_stats = """      {/* Stats */}
      <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 20, gap: 32 }}>
        <View style={{ alignItems: 'center' }}>
          <Text style={{ color: theme.text, fontSize: 18, fontFamily: fonts.medium }}>{stats.posts}</Text>
          <Text style={{ color: theme.textMuted, fontSize: 12, fontFamily: fonts.regular }}>Posts</Text>
        </View>
        <View style={{ alignItems: 'center' }}>
          <Text style={{ color: theme.text, fontSize: 18, fontFamily: fonts.medium }}>{stats.followers}</Text>
          <Text style={{ color: theme.textMuted, fontSize: 12, fontFamily: fonts.regular }}>Seguidores</Text>
        </View>
        <View style={{ alignItems: 'center' }}>
          <Text style={{ color: theme.text, fontSize: 18, fontFamily: fonts.medium }}>{stats.following}</Text>
          <Text style={{ color: theme.textMuted, fontSize: 12, fontFamily: fonts.regular }}>Siguiendo</Text>
        </View>
      </View>"""

new_stats = """      {/* Stats Hero OSHIMA */}
      <StatsHero
        stats={stats}
        joinedAt={u.created_at ? String(u.created_at).slice(0, 10).replace(/-/g, '.') : undefined}
      />"""

if old_stats in src:
    src = src.replace(old_stats, new_stats, 1)
    print("  ✅ stats viejos reemplazados")
else:
    print("  ⚠️  patrón stats no encontrado")

if src != orig:
    open(path, 'w').write(src)
PY

# Mismo cambio en UserProfileScreen
echo "▸ Actualizando UserProfileScreen"
python3 << 'PY'
path = 'src/screens/UserProfileScreen.tsx'
src = open(path).read()
orig = src

if 'StatsHero' not in src:
    src = src.replace(
        "import { ProfileTabs, type ProfileTab } from '../components/ProfileTabs';",
        "import { ProfileTabs, type ProfileTab } from '../components/ProfileTabs';\nimport { StatsHero } from '../components/StatsHero';",
        1
    )
    print("  ✅ import StatsHero")

old_stats = """      {/* Stats */}
      <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 20, gap: 32 }}>
        <View style={{ alignItems: 'center' }}>
          <Text style={{ color: theme.text, fontSize: 18, fontFamily: fonts.medium }}>{stats.posts}</Text>
          <Text style={{ color: theme.textMuted, fontSize: 12, fontFamily: fonts.regular }}>Posts</Text>
        </View>
        <View style={{ alignItems: 'center' }}>
          <Text style={{ color: theme.text, fontSize: 18, fontFamily: fonts.medium }}>{stats.followers}</Text>
          <Text style={{ color: theme.textMuted, fontSize: 12, fontFamily: fonts.regular }}>Seguidores</Text>
        </View>
        <View style={{ alignItems: 'center' }}>
          <Text style={{ color: theme.text, fontSize: 18, fontFamily: fonts.medium }}>{stats.following}</Text>
          <Text style={{ color: theme.textMuted, fontSize: 12, fontFamily: fonts.regular }}>Siguiendo</Text>
        </View>
      </View>"""

new_stats = """      {/* Stats Hero OSHIMA */}
      <StatsHero
        stats={stats}
        joinedAt={u.created_at ? String(u.created_at).slice(0, 10).replace(/-/g, '.') : undefined}
      />"""

if old_stats in src:
    src = src.replace(old_stats, new_stats, 1)
    print("  ✅ stats viejos reemplazados")
else:
    print("  ⚠️  patrón stats no encontrado")

if src != orig:
    open(path, 'w').write(src)
PY

# Typecheck
echo ""
echo "▸ Typecheck"
npx tsc --noEmit 2>&1 | head -12
if [ ${PIPESTATUS[0]} -eq 0 ]; then
  echo "  ✅ TSC limpio"
  TSC_OK=1
else
  echo "  ❌ TSC con errores"
  TSC_OK=0
fi

# Commit
echo ""
if [ "$TSC_OK" = "1" ]; then
  echo "▸ Commit + push"
  cd ~/idkfree
  git add -A
  git commit -m "feat(profile): StatsHero con números grandes estilo OSHIMA (POSTS/FLWR/FLNG/LEVEL) + SINCE" 2>&1 | head -2
  git push 2>&1 | tail -2
else
  cp ~/ProfileScreen.bak ~/idkfree/mobile/src/screens/ProfileScreen.tsx
  cp ~/UserProfileScreen.bak ~/idkfree/mobile/src/screens/UserProfileScreen.tsx
  echo "  ↩️  Revertidos"
fi

echo ""
echo "════════════════════════════════════════════════════"
echo "  ✅ Bloque 2/6 (Stats OSHIMA) listo"
echo "════════════════════════════════════════════════════"
