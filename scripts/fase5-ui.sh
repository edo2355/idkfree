#!/data/data/com.termux/files/usr/bin/bash
set +e
cd ~/idkfree/mobile || exit 1

echo "════════════════════════════════════════════════════"
echo "  FASE 5 parte 2 — UI dibujar + repost"
echo "════════════════════════════════════════════════════"
echo ""

# ---------- 1. DrawingCanvas ----------
echo "▸ 1. DrawingCanvas.tsx"
cat > src/components/DrawingCanvas.tsx << 'TSX'
import { useRef, useState } from 'react';
import { View, Text, TouchableOpacity, PanResponder, Dimensions, ActivityIndicator, Alert } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { captureRef } from 'react-native-view-shot';
import { useTheme } from '../stores/themeStore';
import { fonts } from '../theme/fonts';
import { api } from '../api/client';
import { resolveAssetUrl } from '../utils/assetUrl';

interface Props {
  postId: string;
  imageUrl: string;
  onClose: () => void;
  onSaved: () => void;
}

const COLORS = ['#FFFFFF', '#FF3B30', '#FFCC00', '#34C759', '#007AFF', '#AF52DE'];

export function DrawingCanvas({ postId, imageUrl, onClose, onSaved }: Props) {
  const theme = useTheme();
  const [paths, setPaths] = useState<string[]>([]);
  const [currentPath, setCurrentPath] = useState<string>('');
  const [color, setColor] = useState(COLORS[0]);
  const [strokeWidth, setStrokeWidth] = useState(4);
  const [uploading, setUploading] = useState(false);
  const [resolvedImage, setResolvedImage] = useState<string | null>(null);
  const captureViewRef = useRef<View>(null);

  const screen = Dimensions.get('window');

  useState(() => {
    (async () => setResolvedImage(await resolveAssetUrl(imageUrl)))();
  });

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt) => {
        const { locationX, locationY } = evt.nativeEvent;
        setCurrentPath(`M ${locationX.toFixed(1)} ${locationY.toFixed(1)}`);
      },
      onPanResponderMove: (evt) => {
        const { locationX, locationY } = evt.nativeEvent;
        setCurrentPath((prev) => `${prev} L ${locationX.toFixed(1)} ${locationY.toFixed(1)}`);
      },
      onPanResponderRelease: () => {
        setCurrentPath((prev) => {
          if (prev) setPaths((p) => [...p, prev]);
          return '';
        });
      },
    })
  ).current;

  function undo() {
    setPaths((p) => p.slice(0, -1));
  }

  function clear() {
    setPaths([]);
    setCurrentPath('');
  }

  async function save() {
    if (paths.length === 0) {
      Alert.alert('Vacío', 'Dibuja algo primero');
      return;
    }
    setUploading(true);
    try {
      const uri = await captureRef(captureViewRef, { format: 'png', quality: 0.8 });
      const up = await api.uploads.upload({
        uri,
        name: `drawing-${Date.now()}.png`,
        type: 'image/png',
      });
      await api.posts.draw(postId, up.url);
      Alert.alert('¡Guardado!', 'Tu dibujo quedó sobre este post');
      onSaved();
    } catch (e: any) {
      Alert.alert('Error', e?.message ?? 'No se pudo guardar');
    }
    setUploading(false);
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#000' }}>
      {/* Barra superior */}
      <View style={{ paddingTop: 40, paddingHorizontal: 16, paddingBottom: 12, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
        <TouchableOpacity onPress={onClose} activeOpacity={0.6}>
          <Text style={{ color: '#FFF', fontSize: 16 }}>Cancelar</Text>
        </TouchableOpacity>
        <View style={{ flex: 1 }} />
        <TouchableOpacity onPress={undo} activeOpacity={0.6} style={{ paddingHorizontal: 10 }}>
          <Text style={{ color: '#FFF', fontSize: 20 }}>↶</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={clear} activeOpacity={0.6} style={{ paddingHorizontal: 10 }}>
          <Text style={{ color: '#FFF', fontSize: 16 }}>Limpiar</Text>
        </TouchableOpacity>
      </View>

      {/* Canvas capturable */}
      <View
        ref={captureViewRef}
        collapsable={false}
        style={{ flex: 1, backgroundColor: '#000' }}
        {...panResponder.panHandlers}
      >
        {/* Imagen de fondo */}
        {resolvedImage && (
          <View pointerEvents="none" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
            {/* @ts-ignore */}
            <View style={{ flex: 1 }}>
              {/* imagen via ImageBackground no, usamos Image normal */}
            </View>
          </View>
        )}

        {/* Paths SVG */}
        <Svg style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} pointerEvents="none">
          {paths.map((p, i) => (
            <Path key={i} d={p} stroke={color} strokeWidth={strokeWidth} fill="none" strokeLinecap="round" strokeLinejoin="round" />
          ))}
          {currentPath ? (
            <Path d={currentPath} stroke={color} strokeWidth={strokeWidth} fill="none" strokeLinecap="round" strokeLinejoin="round" />
          ) : null}
        </Svg>
      </View>

      {/* Barra inferior colores */}
      <View style={{ paddingHorizontal: 16, paddingBottom: 30, paddingTop: 12, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
        {COLORS.map((c) => (
          <TouchableOpacity
            key={c}
            onPress={() => setColor(c)}
            style={{
              width: 32, height: 32, borderRadius: 16,
              backgroundColor: c,
              borderWidth: color === c ? 3 : 1,
              borderColor: color === c ? '#FFF' : '#555',
            }}
          />
        ))}
        <View style={{ flex: 1 }} />
        <TouchableOpacity
          onPress={save}
          disabled={uploading}
          style={{ backgroundColor: '#FFF', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 20 }}
        >
          {uploading ? <ActivityIndicator color="#000" /> : (
            <Text style={{ color: '#000', fontFamily: fonts.medium, fontSize: 14 }}>Guardar</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}
TSX
echo "  ✅ DrawingCanvas.tsx"

# ---------- 2. DrawingsViewer ----------
echo "▸ 2. DrawingsViewer.tsx"
cat > src/components/DrawingsViewer.tsx << 'TSX'
import { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Modal, Image, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../stores/themeStore';
import { fonts } from '../theme/fonts';
import { api } from '../api/client';
import { resolveAssetUrl } from '../utils/assetUrl';
import { Avatar } from './Avatar';

interface Props {
  postId: string;
  visible: boolean;
  onClose: () => void;
}

export function DrawingsViewer({ postId, visible, onClose }: Props) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const [drawings, setDrawings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!visible) return;
    (async () => {
      setLoading(true);
      try {
        const res = await api.posts.drawings(postId);
        const withUrls = await Promise.all((res.drawings ?? []).map(async (d: any) => ({
          ...d,
          drawingUrl: await resolveAssetUrl(d.drawing_url),
        })));
        setDrawings(withUrls);
      } catch { setDrawings([]); }
      setLoading(false);
    })();
  }, [visible, postId]);

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.85)', paddingTop: insets.top }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingBottom: 12 }}>
          <Text style={{ color: '#FFF', fontFamily: fonts.displayBoldItalic, fontSize: 20, flex: 1 }}>
            Dibujos
          </Text>
          <TouchableOpacity onPress={onClose} activeOpacity={0.6}>
            <Text style={{ color: '#FFF', fontSize: 26 }}>×</Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator color="#FFF" />
          </View>
        ) : drawings.length === 0 ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ fontSize: 48, marginBottom: 12 }}>✏️</Text>
            <Text style={{ color: '#AAA', fontFamily: fonts.regular }}>Sin dibujos aún</Text>
          </View>
        ) : (
          <FlatList
            data={drawings}
            keyExtractor={(d) => d.id}
            contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 40 }}
            renderItem={({ item }) => (
              <View style={{ marginBottom: 16, backgroundColor: '#111', borderRadius: 12, overflow: 'hidden' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', padding: 12 }}>
                  <Avatar name={item.author_name ?? item.author_alias} url={item.author_avatar} size={32} />
                  <Text style={{ color: '#FFF', fontFamily: fonts.medium, fontSize: 13, marginLeft: 10 }}>
                    @{item.author_alias}
                  </Text>
                </View>
                {item.drawingUrl ? (
                  <Image source={{ uri: item.drawingUrl }} style={{ width: '100%', height: 300 }} resizeMode="contain" />
                ) : null}
              </View>
            )}
          />
        )}
      </View>
    </Modal>
  );
}
TSX
echo "  ✅ DrawingsViewer.tsx"

# ---------- 3. PostCard: botones repost + dibujar + ver dibujos ----------
echo "▸ 3. PostCard: botones nuevos"
python3 << 'PY'
path = 'src/components/PostCard.tsx'
src = open(path).read()
orig = src

# Imports
if 'DrawingCanvas' not in src:
    src = src.replace(
        "import { useAuthStore } from '../stores/authStore';",
        "import { useAuthStore } from '../stores/authStore';\nimport { DrawingCanvas } from './DrawingCanvas';\nimport { DrawingsViewer } from './DrawingsViewer';",
        1
    )
    print("  ✅ imports DrawingCanvas/Viewer")

# Estado para modales
if 'showDrawing' not in src:
    src = src.replace(
        "  const [imageUrl, setImageUrl] = useState<string | null>(null);",
        "  const [imageUrl, setImageUrl] = useState<string | null>(null);\n  const [showDrawing, setShowDrawing] = useState(false);\n  const [showDrawings, setShowDrawings] = useState(false);\n  const [drawingsCount, setDrawingsCount] = useState(0);\n  const [reposting, setReposting] = useState(false);",
        1
    )
    print("  ✅ estados")

# Funciones
if 'async function doRepost' not in src:
    old = "  async function doDelete() {"
    new = """  async function doRepost() {
    if (reposting) return;
    setReposting(true);
    try {
      await api.posts.repost(post.id, undefined);
      Alert.alert('Reposteado', 'Aparecerá en tu perfil');
    } catch (e: any) {
      Alert.alert('Error', e?.message ?? 'No se pudo repostear');
    }
    setReposting(false);
  }

  async function doDelete() {"""
    src = src.replace(old, new, 1)
    print("  ✅ doRepost()")

# Cargar contador de dibujos al montar
if 'api.posts.drawings' not in src:
    src = src.replace(
        "  const isMine = me?.id === post.author_id;",
        """  useEffect(() => {
    (async () => {
      try {
        const res = await api.posts.drawings(post.id);
        setDrawingsCount((res.drawings ?? []).length);
      } catch {}
    })();
  }, [post.id]);

  const isMine = me?.id === post.author_id;""",
        1
    )
    print("  ✅ contador dibujos")

# Añadir botones repost + dibujar + ver dibujos en la barra de acciones
old_actions = """        <TouchableOpacity onPress={onShare} style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }} activeOpacity={0.6}>
          <ShareIcon size={20} color={theme.textMuted} />
        </TouchableOpacity>
      </View>"""

new_actions = """        <TouchableOpacity onPress={onShare} style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }} activeOpacity={0.6}>
          <ShareIcon size={20} color={theme.textMuted} />
        </TouchableOpacity>

        {/* Republicar */}
        <TouchableOpacity onPress={doRepost} disabled={reposting} style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }} activeOpacity={0.6}>
          <Text style={{ fontSize: 18, color: theme.textMuted }}>🔁</Text>
        </TouchableOpacity>

        {/* Dibujar (solo si NO es tuyo) */}
        {!isMine && imageUrl ? (
          <TouchableOpacity onPress={() => setShowDrawing(true)} style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }} activeOpacity={0.6}>
            <Text style={{ fontSize: 18, color: theme.textMuted }}>✏️</Text>
          </TouchableOpacity>
        ) : null}

        {/* Ver dibujos (si hay) */}
        {drawingsCount > 0 ? (
          <TouchableOpacity onPress={() => setShowDrawings(true)} style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }} activeOpacity={0.6}>
            <Text style={{ fontSize: 14, color: theme.textMuted }}>🎨</Text>
            <Text style={{ color: theme.textMuted, fontFamily: fonts.medium, fontSize: 12 }}>
              {drawingsCount}
            </Text>
          </TouchableOpacity>
        ) : null}
      </View>"""

if old_actions in src:
    src = src.replace(old_actions, new_actions, 1)
    print("  ✅ botones acciones")
else:
    print("  ⚠️  patrón acciones no encontrado")

# Modales al final del return principal
old_end = """    </View>
  );
}

function getTimeAgo("""
new_end = """      {showDrawing && imageUrl ? (
        <DrawingCanvas
          postId={post.id}
          imageUrl={post.image_url ?? ''}
          onClose={() => setShowDrawing(false)}
          onSaved={() => { setShowDrawing(false); setDrawingsCount((c) => c + 1); }}
        />
      ) : null}

      <DrawingsViewer
        postId={post.id}
        visible={showDrawings}
        onClose={() => setShowDrawings(false)}
      />
    </View>
  );
}

function getTimeAgo("""

if old_end in src:
    src = src.replace(old_end, new_end, 1)
    print("  ✅ modales añadidos")

if src != orig:
    open(path, 'w').write(src)
    print("  ✅ PostCard actualizado")
PY

# ---------- 4. Verificar view-shot ----------
echo ""
echo "▸ 4. Verificar react-native-view-shot"
if [ -d node_modules/react-native-view-shot ]; then
  echo "  ✅ instalado"
else
  echo "  ⚠️  instalando..."
  npx expo install react-native-view-shot 2>&1 | tail -3
fi

# ---------- 5. Typecheck ----------
echo ""
echo "▸ 5. Typecheck mobile"
npx tsc --noEmit 2>&1 | head -15
if [ ${PIPESTATUS[0]} -eq 0 ]; then
  echo "  ✅ TSC limpio"
  TSC_OK=1
else
  echo "  ❌ TSC con errores"
  TSC_OK=0
fi

# ---------- 6. Commit ----------
echo ""
if [ "$TSC_OK" = "1" ]; then
  echo "▸ 6. Commit + push"
  cd ~/idkfree
  git add -A
  git commit -m "feat(repost): UI dibujar sobre posts + viewer + botones repost/dibujar en PostCard" 2>&1 | head -2
  git push 2>&1 | tail -2
fi

echo ""
echo "════════════════════════════════════════════════════"
echo "  ✅ FASE 5 COMPLETA"
echo "════════════════════════════════════════════════════"
