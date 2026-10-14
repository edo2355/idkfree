#!/data/data/com.termux/files/usr/bin/bash
set +e
cd ~/idkfree/mobile || exit 1

echo "════════════════════════════════════════════════════"
echo "  FIX Login (letras más grandes) + Stories (bug)"
echo "════════════════════════════════════════════════════"
echo ""

# ---------- 1. Backup ----------
cp src/screens/LoginScreen.tsx ~/login.bak
cp src/components/StoryViewer.tsx ~/storyviewer.bak
echo "▸ 1. Backups en ~/login.bak y ~/storyviewer.bak"
echo ""

# ---------- 2. LoginScreen: agrandar textos ----------
echo "▸ 2. LoginScreen — agrandar letras"
python3 << 'PY'
path = 'src/screens/LoginScreen.tsx'
src = open(path).read()
orig = src

# IDKFREE: 34 → 44
src = src.replace(
    "fontSize: 34, fontFamily: fonts.displayBoldItalic, letterSpacing: 1, color: theme.text, textAlign: 'center'",
    "fontSize: 44, fontFamily: fonts.displayBoldItalic, letterSpacing: 1, color: theme.text, textAlign: 'center'",
    1
)

# Subtítulo "No lo sé, gratis o libre"
src = src.replace(
    "<Text style={{ color: theme.textMuted, textAlign: 'center', marginBottom: 32, fontFamily: fonts.medium, letterSpacing: 0.5 }}>No lo sé, gratis o libre</Text>",
    "<Text style={{ fontSize: 17, color: theme.textMuted, textAlign: 'center', marginBottom: 36, fontFamily: fonts.medium, letterSpacing: 0.8 }}>No lo sé, gratis o libre</Text>",
    1
)

# "Crear cuenta"
src = src.replace(
    "<Text style={{ color: theme.text, textAlign: 'center', marginTop: 16, fontFamily: fonts.medium, letterSpacing: 0.5 }} onPress={() => navigation.navigate('Register')}>Crear cuenta</Text>",
    "<Text style={{ fontSize: 16, color: theme.text, textAlign: 'center', marginTop: 20, fontFamily: fonts.medium, letterSpacing: 0.5 }} onPress={() => navigation.navigate('Register')}>Crear cuenta</Text>",
    1
)

# "Recuperar cuenta"
src = src.replace(
    "<Text style={{ color: theme.text, textAlign: 'center', marginTop: 12, fontFamily: fonts.medium, letterSpacing: 0.5 }} onPress={() => navigation.navigate('Recovery')}>Recuperar cuenta</Text>",
    "<Text style={{ fontSize: 16, color: theme.text, textAlign: 'center', marginTop: 14, fontFamily: fonts.medium, letterSpacing: 0.5 }} onPress={() => navigation.navigate('Recovery')}>Recuperar cuenta</Text>",
    1
)

# "FROM" un poco más grande
src = src.replace(
    "fontSize: 12, fontFamily: fonts.medium, color: theme.textMuted, letterSpacing: 2, marginBottom: 8",
    "fontSize: 14, fontFamily: fonts.medium, color: theme.textMuted, letterSpacing: 3, marginBottom: 10",
    1
)

if src != orig:
    open(path, 'w').write(src)
    print("  ✅ LoginScreen agrandado")
else:
    print("  ⚠️  sin cambios (patrones no encontrados)")
PY

# ---------- 3. StoryViewer: fix del autoavance ----------
echo ""
echo "▸ 3. StoryViewer — fix error setState"
cat > src/components/StoryViewer.tsx << 'TSX'
import { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, Image, Modal, ActivityIndicator, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useVideoPlayer, VideoView } from 'expo-video';
import { useTheme } from '../stores/themeStore';
import { fonts } from '../theme/fonts';
import { resolveAssetUrl } from '../utils/assetUrl';

const { width: SCREEN_W } = Dimensions.get('window');
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
  const closedRef = useRef(false);

  const group = groups[groupIdx];
  const story = group?.stories?.[storyIdx];

  // Cerrar si no hay story — con useEffect (no durante render)
  useEffect(() => {
    if ((!group || !story) && !closedRef.current) {
      closedRef.current = true;
      onClose();
    }
  }, [group, story, onClose]);

  // Resolver URL
  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!story) { if (!cancelled) setMediaUri(null); return; }
      const uri = await resolveAssetUrl(story.media_url);
      if (!cancelled) setMediaUri(uri);
    })();
    return () => { cancelled = true; };
  }, [story?.id]);

  // Autoavance: solo si hay story válida
  useEffect(() => {
    if (!group || !story) return;
    setProgress(0);
    const startTime = Date.now();
    timerRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, (elapsed / STORY_DURATION_MS) * 100);
      setProgress(pct);
      if (pct >= 100) {
        clearInterval(timerRef.current);
        // Avanzar al siguiente (fuera del render actual)
        setTimeout(() => {
          if (storyIdx < group.stories.length - 1) {
            setStoryIdx(storyIdx + 1);
          } else if (groupIdx < groups.length - 1) {
            setGroupIdx(groupIdx + 1);
            setStoryIdx(0);
          } else {
            onClose();
          }
        }, 0);
      }
    }, 100);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [story?.id, groupIdx, storyIdx, group, groups.length, onClose]);

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

  if (!group || !story) return null;

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
echo "  ✅ StoryViewer reescrito (fix setState)"

# ---------- 4. Typecheck ----------
echo ""
echo "▸ 4. Typecheck"
npx tsc --noEmit 2>&1 | head -15
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
  git commit -m "fix(login): agrandar textos + fix(stories): setState-in-render" 2>&1 | head -2
  git push 2>&1 | tail -2
else
  echo "⚠️  TSC falló — revirtiendo"
  cp ~/login.bak ~/idkfree/mobile/src/screens/LoginScreen.tsx
  cp ~/storyviewer.bak ~/idkfree/mobile/src/components/StoryViewer.tsx
fi

echo ""
echo "════════════════════════════════════════════════════"
echo "  ✅ FIX Login + Stories listo"
echo "════════════════════════════════════════════════════"
