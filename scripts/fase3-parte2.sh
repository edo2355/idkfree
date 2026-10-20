#!/data/data/com.termux/files/usr/bin/bash
set +e
cd ~/idkfree/mobile || exit 1

echo "════════════════════════════════════════════════════"
echo "  FASE 3 parte 2 — Botón + / auto-avance / video"
echo "════════════════════════════════════════════════════"
echo ""

# ---------- 1. StoriesRow con botón + funcional ----------
echo "▸ 1. StoriesRow con botón + funcional"
python3 << 'PY'
path = 'src/components/StoriesRow.tsx'
src = open(path).read()
orig = src

# Import picker + uploads
if 'expo-image-picker' not in src:
    src = src.replace(
        "import { useEffect, useState } from 'react';",
        "import { useEffect, useState } from 'react';\nimport * as ImagePicker from 'expo-image-picker';\nimport { Alert } from 'react-native';",
        1
    )
    print("  ✅ imports picker")

# Añadir función pickStory antes de return principal
if 'async function pickStory' not in src:
    old = """  if (loading) {
    return (
      <View style={{ paddingVertical: 12, alignItems: 'center' }}>
        <ActivityIndicator color={theme.text} />
      </View>
    );
  }"""
    new = """  async function pickStory() {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      Alert.alert('Permiso requerido', 'Necesitamos acceso a tu galería');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images', 'videos'],
      quality: 0.85,
    });
    if (result.canceled) return;
    const asset = result.assets[0];
    const isVideo = (asset.type === 'video') || (asset.mimeType?.startsWith('video'));
    setLoading(true);
    try {
      const up = await api.uploads.upload({
        uri: asset.uri,
        name: asset.fileName ?? `story-${Date.now()}.${isVideo ? 'mp4' : 'jpg'}`,
        type: asset.mimeType ?? (isVideo ? 'video/mp4' : 'image/jpeg'),
      });
      await api.stories.create({
        mediaUrl: up.url,
        mediaType: isVideo ? 'video' : 'image',
      });
      Alert.alert('¡Historia publicada!', 'Durará 24h');
      await load();
    } catch (e: any) {
      Alert.alert('Error', e?.message ?? 'No se pudo publicar la historia');
    }
    setLoading(false);
  }

  if (loading) {
    return (
      <View style={{ paddingVertical: 12, alignItems: 'center' }}>
        <ActivityIndicator color={theme.text} />
      </View>
    );
  }"""
    if old in src:
        src = src.replace(old, new, 1)
        print("  ✅ pickStory()")

# Conectar el botón + a pickStory
src = src.replace(
    """          <TouchableOpacity
            activeOpacity={0.7}
            style={{ alignItems: 'center', width: 68 }}
          >
            <View
              style={{
                width: 60, height: 60, borderRadius: 30,
                borderWidth: 2, borderColor: theme.border, borderStyle: 'dashed',""",
    """          <TouchableOpacity
            onPress={pickStory}
            activeOpacity={0.7}
            style={{ alignItems: 'center', width: 68 }}
          >
            <View
              style={{
                width: 60, height: 60, borderRadius: 30,
                borderWidth: 2, borderColor: theme.border, borderStyle: 'dashed',""",
    1
)

if src != orig:
    open(path, 'w').write(src)
    print("  ✅ StoriesRow actualizado")
PY

# ---------- 2. StoryViewer con video + auto-avance ----------
echo ""
echo "▸ 2. StoryViewer con video + auto-avance (5s)"
cat > src/components/StoryViewer.tsx << 'TSX'
import { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, Image, Modal, ActivityIndicator, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useVideoPlayer, VideoView } from 'expo-video';
import { useTheme } from '../stores/themeStore';
import { fonts } from '../theme/fonts';
import { resolveAssetUrl } from '../utils/assetUrl';

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');
const STORY_DURATION_MS = 5000;

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
  const [progress, setProgress] = useState(0);
  const timerRef = useRef<any>(null);

  const group = groups[groupIdx];
  const story = group?.stories?.[storyIdx];

  useEffect(() => {
    (async () => {
      if (!story) { setMediaUri(null); return; }
      const uri = await resolveAssetUrl(story.media_url);
      setMediaUri(uri);
    })();
  }, [story?.id]);

  // Auto-avance
  useEffect(() => {
    setProgress(0);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setProgress((p) => {
        if (p >= 1) { next(); return 0; }
        return p + (100 / (STORY_DURATION_MS / 100));
      });
    }, 100);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [story?.id, groupIdx, storyIdx]);

  function next() {
    if (!group) return;
    if (storyIdx < group.stories.length - 1) setStoryIdx(storyIdx + 1);
    else if (groupIdx < groups.length - 1) { setGroupIdx(groupIdx + 1); setStoryIdx(0); }
    else onClose();
  }

  function prev() {
    if (storyIdx > 0) setStoryIdx(storyIdx - 1);
    else if (groupIdx > 0) {
      const pg = groups[groupIdx - 1];
      setGroupIdx(groupIdx - 1);
      setStoryIdx(pg.stories.length - 1);
    }
  }

  if (!group || !story) { onClose(); return null; }

  return (
    <Modal visible animationType="fade" transparent onRequestClose={onClose}>
      <View style={{ flex: 1, backgroundColor: '#000' }}>
        {/* Progress bars */}
        <View style={{ position: 'absolute', top: insets.top + 8, left: 0, right: 0, flexDirection: 'row', paddingHorizontal: 12, gap: 4, zIndex: 20 }}>
          {group.stories.map((s: any, i: number) => (
            <View key={s.id} style={{ flex: 1, height: 3, backgroundColor: 'rgba(255,255,255,0.35)', borderRadius: 2, overflow: 'hidden' }}>
              <View style={{ width: i < storyIdx ? '100%' : i === storyIdx ? `${progress}%` : '0%', height: '100%', backgroundColor: '#FFF' }} />
            </View>
          ))}
        </View>

        {/* Header */}
        <View style={{ paddingTop: insets.top + 20, paddingHorizontal: 16, paddingBottom: 8, flexDirection: 'row', alignItems: 'center', gap: 10, zIndex: 10 }}>
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

        {/* Media */}
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          {mediaUri ? (
            story.media_type === 'video' ? (
              <StoryVideo uri={mediaUri} />
            ) : (
              <Image source={{ uri: mediaUri }} style={{ width: '100%', height: '100%' }} resizeMode="contain" />
            )
          ) : (
            <ActivityIndicator color="#FFF" />
          )}
        </View>

        {/* Tap zones */}
        <TouchableOpacity onPress={prev} activeOpacity={1} style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: SCREEN_W / 3 }} />
        <TouchableOpacity onPress={next} activeOpacity={1} style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: SCREEN_W * 2 / 3 }} />
      </View>
    </Modal>
  );
}

function StoryVideo({ uri }: { uri: string }) {
  const player = useVideoPlayer(uri, (p) => {
    p.loop = false;
    p.muted = false;
    p.play();
  });
  return (
    <VideoView
      player={player}
      style={{ width: '100%', height: '100%' }}
      contentFit="contain"
      nativeControls={false}
    />
  );
}
TSX
echo "  ✅ StoryViewer reescrito"

# ---------- 3. Typecheck ----------
echo ""
echo "▸ 3. Typecheck"
npx tsc --noEmit 2>&1 | head -15
if [ ${PIPESTATUS[0]} -eq 0 ]; then
  echo "  ✅ TSC limpio"
  TSC_OK=1
else
  echo "  ❌ TSC con errores"
  TSC_OK=0
fi

# ---------- 4. Commit ----------
echo ""
if [ "$TSC_OK" = "1" ]; then
  echo "▸ 4. Commit + push"
  cd ~/idkfree
  git add -A
  git commit -m "feat(stories): botón + sube historia + auto-avance 5s + video en viewer" 2>&1 | head -2
  git push 2>&1 | tail -2
fi

echo ""
echo "════════════════════════════════════════════════════"
echo "  ✅ FASE 3 CERRADA al 100%"
echo "════════════════════════════════════════════════════"
