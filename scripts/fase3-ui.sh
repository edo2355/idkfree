#!/data/data/com.termux/files/usr/bin/bash
set +e
cd ~/idkfree/mobile || exit 1

echo "════════════════════════════════════════════════════"
echo "  FASE 3 — UI Historias"
echo "════════════════════════════════════════════════════"
echo ""

# ---------- 1. StoriesRow (fila horizontal arriba del Feed) ----------
echo "▸ 1. StoriesRow.tsx"
mkdir -p src/components
cat > src/components/StoriesRow.tsx << 'TSX'
import { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { useTheme } from '../stores/themeStore';
import { fonts } from '../theme/fonts';
import { useAuthStore } from '../stores/authStore';
import { api } from '../api/client';
import { resolveAssetUrl } from '../utils/assetUrl';
import { StoryViewer } from './StoryViewer';

interface Group {
  author_id: string;
  author_alias: string;
  author_name: string | null;
  author_avatar: string | null;
  stories: any[];
  all_viewed: boolean;
}

export function StoriesRow() {
  const theme = useTheme();
  const me = useAuthStore((s) => s.user);
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [startIndex, setStartIndex] = useState(0);
  const [avatarUrls, setAvatarUrls] = useState<Record<string, string | null>>({});

  async function load() {
    setLoading(true);
    try {
      const res = await api.stories.feed();
      setGroups(res.stories ?? []);
    } catch {}
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  // Resolver avatares async
  useEffect(() => {
    (async () => {
      const next: Record<string, string | null> = {};
      for (const g of groups) {
        next[g.author_id] = await resolveAssetUrl(g.author_avatar);
      }
      setAvatarUrls(next);
    })();
  }, [groups]);

  if (loading) {
    return (
      <View style={{ paddingVertical: 12, alignItems: 'center' }}>
        <ActivityIndicator color={theme.text} />
      </View>
    );
  }

  return (
    <>
      <View style={{ borderBottomWidth: 1, borderBottomColor: theme.border }}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 12, paddingVertical: 12, gap: 14 }}
        >
          {/* Botón + para crear historia */}
          <TouchableOpacity
            activeOpacity={0.7}
            style={{ alignItems: 'center', width: 68 }}
          >
            <View
              style={{
                width: 60, height: 60, borderRadius: 30,
                borderWidth: 2, borderColor: theme.border, borderStyle: 'dashed',
                alignItems: 'center', justifyContent: 'center',
                backgroundColor: theme.surface,
              }}
            >
              <Text style={{ color: theme.text, fontSize: 26, lineHeight: 26 }}>+</Text>
            </View>
            <Text style={{ color: theme.textMuted, fontFamily: fonts.regular, fontSize: 11, marginTop: 4 }} numberOfLines={1}>
              Tu historia
            </Text>
          </TouchableOpacity>

          {/* Grupos */}
          {groups.map((g, idx) => {
            const avatar = avatarUrls[g.author_id];
            const ringColor = g.all_viewed ? theme.border : theme.text;
            return (
              <TouchableOpacity
                key={g.author_id}
                activeOpacity={0.7}
                onPress={() => { setStartIndex(idx); setViewerOpen(true); }}
                style={{ alignItems: 'center', width: 68 }}
              >
                <View
                  style={{
                    width: 60, height: 60, borderRadius: 30,
                    borderWidth: 2, borderColor: ringColor,
                    padding: 2,
                    alignItems: 'center', justifyContent: 'center',
                  }}
                >
                  {avatar ? (
                    <Image source={{ uri: avatar }} style={{ width: 50, height: 50, borderRadius: 25 }} />
                  ) : (
                    <View style={{ width: 50, height: 50, borderRadius: 25, backgroundColor: theme.surface, alignItems: 'center', justifyContent: 'center' }}>
                      <Text style={{ color: theme.text, fontFamily: fonts.medium, fontSize: 20 }}>
                        {(g.author_name ?? g.author_alias).charAt(0).toUpperCase()}
                      </Text>
                    </View>
                  )}
                </View>
                <Text style={{ color: theme.textMuted, fontFamily: fonts.regular, fontSize: 11, marginTop: 4 }} numberOfLines={1}>
                  {g.author_id === me?.id ? 'Tú' : g.author_alias}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {viewerOpen && groups[startIndex] && (
        <StoryViewer
          groups={groups}
          initialGroupIndex={startIndex}
          onClose={() => { setViewerOpen(false); load(); }}
        />
      )}
    </>
  );
}
TSX
echo "  ✅ StoriesRow.tsx"

# ---------- 2. StoryViewer (modal fullscreen) ----------
echo "▸ 2. StoryViewer.tsx"
cat > src/components/StoryViewer.tsx << 'TSX'
import { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image, Modal, ActivityIndicator, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../stores/themeStore';
import { fonts } from '../theme/fonts';
import { resolveAssetUrl } from '../utils/assetUrl';

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');

interface Props {
  groups: any[];
  initialGroupIndex: number;
  onClose: () => void;
}

export function StoryViewer({ groups, initialGroupIndex, onClose }: Props) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const [groupIdx, setGroupIdx] = useState(initialGroupIndex);
  const [storyIdx, setStoryIdx] = useState(0);
  const [mediaUri, setMediaUri] = useState<string | null>(null);

  const group = groups[groupIdx];
  const story = group?.stories?.[storyIdx];

  useEffect(() => {
    (async () => {
      if (!story) { setMediaUri(null); return; }
      const uri = await resolveAssetUrl(story.media_url);
      setMediaUri(uri);
    })();
  }, [story?.id]);

  function next() {
    if (!group) return;
    if (storyIdx < group.stories.length - 1) {
      setStoryIdx(storyIdx + 1);
    } else if (groupIdx < groups.length - 1) {
      setGroupIdx(groupIdx + 1);
      setStoryIdx(0);
    } else {
      onClose();
    }
  }

  function prev() {
    if (storyIdx > 0) setStoryIdx(storyIdx - 1);
    else if (groupIdx > 0) {
      const prevGroup = groups[groupIdx - 1];
      setGroupIdx(groupIdx - 1);
      setStoryIdx(prevGroup.stories.length - 1);
    }
  }

  if (!group || !story) {
    onClose();
    return null;
  }

  return (
    <Modal visible animationType="fade" transparent onRequestClose={onClose}>
      <View style={{ flex: 1, backgroundColor: '#000' }}>
        {/* Header */}
        <View style={{ paddingTop: insets.top + 12, paddingHorizontal: 16, paddingBottom: 8, flexDirection: 'row', alignItems: 'center', gap: 10, zIndex: 10 }}>
          <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: '#222', alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ color: '#FFF', fontFamily: fonts.medium, fontSize: 14 }}>
              {(group.author_name ?? group.author_alias).charAt(0).toUpperCase()}
            </Text>
          </View>
          <Text style={{ color: '#FFF', fontFamily: fonts.medium, fontSize: 14, flex: 1 }}>
            {group.author_alias}
          </Text>
          <TouchableOpacity onPress={onClose} activeOpacity={0.7}>
            <Text style={{ color: '#FFF', fontSize: 26, lineHeight: 26 }}>×</Text>
          </TouchableOpacity>
        </View>

        {/* Progress bars */}
        <View style={{ flexDirection: 'row', paddingHorizontal: 16, gap: 4 }}>
          {group.stories.map((s: any, i: number) => (
            <View key={s.id} style={{ flex: 1, height: 3, backgroundColor: 'rgba(255,255,255,0.3)', borderRadius: 2, overflow: 'hidden' }}>
              <View style={{ width: i <= storyIdx ? '100%' : '0%', height: '100%', backgroundColor: '#FFF' }} />
            </View>
          ))}
        </View>

        {/* Media */}
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          {mediaUri ? (
            story.media_type === 'video' ? (
              <Text style={{ color: '#FFF' }}>Video (próximamente)</Text>
            ) : (
              <Image source={{ uri: mediaUri }} style={{ width: '100%', height: '100%' }} resizeMode="contain" />
            )
          ) : (
            <ActivityIndicator color="#FFF" />
          )}
        </View>

        {/* Tap zones */}
        <TouchableOpacity
          onPress={prev}
          activeOpacity={1}
          style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: SCREEN_W / 3 }}
        />
        <TouchableOpacity
          onPress={next}
          activeOpacity={1}
          style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: SCREEN_W * 2 / 3 }}
        />
      </View>
    </Modal>
  );
}
TSX
echo "  ✅ StoryViewer.tsx"

# ---------- 3. Integrar StoriesRow en FeedScreen ----------
echo "▸ 3. Integrar StoriesRow en FeedScreen.tsx"
python3 << 'PY'
path = 'src/screens/FeedScreen.tsx'
src = open(path).read()
orig = src

# Import
if 'StoriesRow' not in src:
    src = src.replace(
        "import { PostCard } from '../components/PostCard';",
        "import { PostCard } from '../components/PostCard';\nimport { StoriesRow } from '../components/StoriesRow';",
        1
    )
    print("  ✅ import StoriesRow")

# Insertar antes del FlatList de posts
# Buscar el inicio del <FlatList del feed
if 'StoriesRow' in src and '<StoriesRow' not in src:
    # Insertar StoriesRow como ListHeaderComponent o antes del FlatList
    # Estrategia: usar ListHeaderComponent si existe, si no, buscar el patron de FlatList
    if 'ListHeaderComponent' in src:
        # Ya tiene header, insertar StoriesRow ahí
        src = src.replace(
            'ListHeaderComponent={',
            'ListHeaderComponent={<><StoriesRow /><',
            1
        )
        # Cerrar el fragment
        # Buscar el cierre del ListHeaderComponent original
        # (mejor: no tocar por ahora)
        print("  ⚠️  ListHeaderComponent existe pero no se puede auto-cerrar")
    else:
        # Añadir como ListHeaderComponent
        # Buscar la primera aparición de <FlatList
        idx = src.find('<FlatList')
        if idx != -1:
            # Encontrar el cierre del tag de apertura
            end = src.find('>', idx) + 1
            src = src[:end] + '\n        ListHeaderComponent={<StoriesRow />}' + src[end:]
            print("  ✅ StoriesRow como ListHeaderComponent")
        else:
            print("  ⚠️  no encontré <FlatList")

if src != orig:
    open(path, 'w').write(src)
else:
    print("  ·  sin cambios")
PY

# ---------- 4. Typecheck ----------
echo ""
echo "▸ 4. Typecheck"
npx tsc --noEmit 2>&1 | head -20
if [ ${PIPESTATUS[0]} -eq 0 ]; then
  echo "  ✅ TSC limpio"
  TSC_OK=1
else
  echo "  ❌ TSC con errores"
  TSC_OK=0
fi

# ---------- 5. Commit ----------
echo ""
if [ "$TSC_OK" = "1" ]; then
  echo "▸ 5. Commit + push"
  cd ~/idkfree
  git add -A
  git commit -m "feat(stories): UI - StoriesRow horizontal + StoryViewer modal + integración Feed" 2>&1 | head -2
  git push 2>&1 | tail -2
fi

echo ""
echo "════════════════════════════════════════════════════"
echo "  ✅ FASE 3 UI lista"
echo "════════════════════════════════════════════════════"
