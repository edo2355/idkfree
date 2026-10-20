#!/data/data/com.termux/files/usr/bin/bash
set +e
cd ~/idkfree/mobile || exit 1

echo "════════════════════════════════════════════════════"
echo "  FASE 4 — Vibes (burbujas + tabs + legacy)"
echo "════════════════════════════════════════════════════"
echo ""

# ---------- 1. Globo 💭 en HeaderBar ----------
echo "▸ 1. HeaderBar: globo 💭"
python3 << 'PY'
path = 'src/components/HeaderBar.tsx'
src = open(path).read()
if 'Vibes' not in src:
    src = src.replace(
        """        <TouchableOpacity onPress={() => navigation.navigate('Chats')} activeOpacity={0.6}>
          <CommentIcon size={22} color={theme.text} />
        </TouchableOpacity>""",
        """        <TouchableOpacity onPress={() => navigation.navigate('Vibes')} activeOpacity={0.6}>
          <Text style={{ fontSize: 20 }}>💭</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Chats')} activeOpacity={0.6}>
          <CommentIcon size={22} color={theme.text} />
        </TouchableOpacity>""", 1)
    open(path, 'w').write(src)
    print("  ✅ globo añadido")
else:
    print("  ·  ya existe")
PY

# ---------- 2. Quitar Vibe del composer ----------
echo "▸ 2. Quitar Vibe del composer"
python3 << 'PY'
path = 'src/screens/CreateScreen.tsx'
src = open(path).read()
old_start = src.find("<TouchableOpacity\n            onPress={() => navigation.navigate('Vibes')}")
if old_start != -1:
    old_end = src.find("</TouchableOpacity>", old_start) + len("</TouchableOpacity>")
    src = src[:old_start] + src[old_end:]
    open(path, 'w').write(src)
    print("  ✅ botón Vibe quitado")
else:
    print("  ·  ya quitado o no encontrado")
PY

# ---------- 3. NotesRow (burbujas tipo IG arriba del feed) ----------
echo "▸ 3. NotesRow.tsx"
cat > src/components/NotesRow.tsx << 'TSX'
import { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Modal, TextInput, Alert, ActivityIndicator } from 'react-native';
import { useTheme } from '../stores/themeStore';
import { fonts } from '../theme/fonts';
import { useAuthStore } from '../stores/authStore';
import { api } from '../api/client';
import { Avatar } from './Avatar';

const MOODS = [
  { key: 'silencio', emoji: '🤫' },
  { key: 'charlar', emoji: '💬' },
  { key: 'crear', emoji: '🎨' },
  { key: 'tranquilo', emoji: '🌊' },
  { key: 'nose', emoji: '🤷' },
];

export function NotesRow() {
  const theme = useTheme();
  const me = useAuthStore((s) => s.user);
  const [vibes, setVibes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [composerOpen, setComposerOpen] = useState(false);
  const [mood, setMood] = useState('nose');
  const [message, setMessage] = useState('');
  const [posting, setPosting] = useState(false);

  async function load() {
    try {
      const res = await api.vibes.list({ limit: 30 });
      setVibes(res.vibes ?? []);
    } catch {}
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function create() {
    if (!message.trim() || posting) return;
    setPosting(true);
    try {
      await api.vibes.create(mood, message.trim());
      setMessage('');
      setMood('nose');
      setComposerOpen(false);
      await load();
    } catch (e: any) {
      Alert.alert('Error', e?.message ?? 'No se pudo publicar');
    }
    setPosting(false);
  }

  const myVibe = vibes.find((v) => v.author_id === me?.id);

  if (loading) {
    return (
      <View style={{ paddingVertical: 10, alignItems: 'center' }}>
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
          contentContainerStyle={{ paddingHorizontal: 12, paddingVertical: 10, gap: 12 }}
        >
          {/* Mi nota */}
          <TouchableOpacity
            onPress={() => setComposerOpen(true)}
            activeOpacity={0.7}
            style={{ alignItems: 'center', width: 64 }}
          >
            <View style={{
              width: 56, height: 56, borderRadius: 28,
              backgroundColor: theme.surface, borderWidth: 1, borderColor: theme.border,
              alignItems: 'center', justifyContent: 'center',
              padding: 2,
            }}>
              {myVibe ? (
                <View style={{ width: '100%', height: '100%', borderRadius: 26, alignItems: 'center', justifyContent: 'center', backgroundColor: theme.surfaceElevated }}>
                  <Text style={{ fontSize: 22 }}>{MOODS.find((m) => m.key === myVibe.mood)?.emoji ?? '💭'}</Text>
                </View>
              ) : (
                <Text style={{ color: theme.textMuted, fontSize: 22 }}>+</Text>
              )}
            </View>
            <Text style={{ color: theme.textMuted, fontFamily: fonts.regular, fontSize: 10, marginTop: 4 }} numberOfLines={1}>
              Tu nota
            </Text>
          </TouchableOpacity>

          {/* Notas de otros */}
          {vibes.filter((v) => v.author_id !== me?.id).slice(0, 15).map((v) => (
            <TouchableOpacity
              key={v.id}
              activeOpacity={0.7}
              style={{ alignItems: 'center', width: 64 }}
            >
              <View style={{ width: 56, height: 56, borderRadius: 28, padding: 2, borderWidth: 1, borderColor: theme.border }}>
                <View style={{ flex: 1, borderRadius: 25, overflow: 'hidden', alignItems: 'center', justifyContent: 'center', backgroundColor: theme.surface }}>
                  <Text style={{ fontSize: 22 }}>{MOODS.find((m) => m.key === v.mood)?.emoji ?? '💭'}</Text>
                </View>
              </View>
              <Text style={{ color: theme.textMuted, fontFamily: fonts.regular, fontSize: 10, marginTop: 4 }} numberOfLines={1}>
                {v.author_alias}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Composer modal */}
      <Modal visible={composerOpen} transparent animationType="slide" onRequestClose={() => setComposerOpen(false)}>
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-end' }}>
          <View style={{ backgroundColor: theme.bg, padding: 20, borderTopLeftRadius: 20, borderTopRightRadius: 20 }}>
            <Text style={{ color: theme.text, fontFamily: fonts.displayBoldItalic, fontSize: 20, marginBottom: 12 }}>
              Tu nota
            </Text>
            <View style={{ flexDirection: 'row', gap: 8, marginBottom: 14, flexWrap: 'wrap' }}>
              {MOODS.map((m) => (
                <TouchableOpacity
                  key={m.key}
                  onPress={() => setMood(m.key)}
                  style={{
                    paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20,
                    backgroundColor: mood === m.key ? theme.text : theme.surface,
                  }}
                >
                  <Text style={{ fontSize: 18 }}>{m.emoji}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <TextInput
              value={message}
              onChangeText={setMessage}
              placeholder="¿Qué estás pensando?"
              placeholderTextColor={theme.textSubtle}
              maxLength={60}
              multiline
              style={{
                backgroundColor: theme.surface, color: theme.text,
                fontFamily: fonts.regular, fontSize: 15, padding: 12, borderRadius: 10,
                minHeight: 60, textAlignVertical: 'top',
              }}
            />
            <View style={{ flexDirection: 'row', gap: 10, marginTop: 14 }}>
              <TouchableOpacity
                onPress={() => setComposerOpen(false)}
                style={{ flex: 1, paddingVertical: 12, borderRadius: 10, alignItems: 'center', backgroundColor: theme.surface }}
              >
                <Text style={{ color: theme.text, fontFamily: fonts.medium }}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={create}
                disabled={posting || !message.trim()}
                style={{ flex: 1, paddingVertical: 12, borderRadius: 10, alignItems: 'center', backgroundColor: message.trim() ? theme.text : theme.surface }}
              >
                {posting ? <ActivityIndicator color={theme.bg} /> : (
                  <Text style={{ color: message.trim() ? theme.bg : theme.textMuted, fontFamily: fonts.medium }}>
                    Publicar
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}
TSX
echo "  ✅ NotesRow.tsx"

# ---------- 4. Integrar NotesRow en FeedScreen ----------
echo "▸ 4. Integrar NotesRow en Feed"
python3 << 'PY'
path = 'src/screens/FeedScreen.tsx'
src = open(path).read()
orig = src

if 'NotesRow' not in src:
    src = src.replace(
        "import { StoriesRow } from '../components/StoriesRow';",
        "import { StoriesRow } from '../components/StoriesRow';\nimport { NotesRow } from '../components/NotesRow';",
        1
    )

src = src.replace(
        "ListHeaderComponent={<StoriesRow />}",
        "ListHeaderComponent={<><StoriesRow /><NotesRow /></>}",
        1
)

if src != orig:
    open(path, 'w').write(src)
    print("  ✅ NotesRow integrado")
else:
    print("  ·  sin cambios")
PY

# ---------- 5. VibesScreen con 3 tabs ----------
echo "▸ 5. VibesScreen con tabs Recientes/Todos/Legado"
cat > src/screens/VibesScreen.tsx << 'TSX'
import { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../stores/themeStore';
import { fonts } from '../theme/fonts';
import { api } from '../api/client';
import { Avatar } from '../components/Avatar';

type Tab = 'recientes' | 'todos' | 'legado';

const MOODS: Record<string, string> = {
  silencio: '🤫',
  charlar: '💬',
  crear: '🎨',
  tranquilo: '🌊',
  nose: '🤷',
};

export function VibesScreen() {
  const theme = useTheme();
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const [tab, setTab] = useState<Tab>('recientes');
  const [vibes, setVibes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  async function load() {
    setLoading(true);
    try {
      let res;
      if (tab === 'legado') {
        res = await api.vibes.legacy({ limit: 50 });
      } else if (tab === 'todos') {
        res = await api.vibes.all({ limit: 50 });
      } else {
        res = await api.vibes.list({ limit: 50 });
      }
      setVibes(res.vibes ?? []);
    } catch { setVibes([]); }
    setLoading(false);
  }

  useEffect(() => { load(); }, [tab]);

  async function onRefresh() {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  }

  return (
    <View style={{ flex: 1, backgroundColor: theme.bg, paddingTop: insets.top }}>
      {/* Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingBottom: 12 }}>
        <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.6} style={{ padding: 4 }}>
          <Text style={{ color: theme.text, fontSize: 22 }}>←</Text>
        </TouchableOpacity>
        <Text style={{ color: theme.text, fontSize: 22, fontFamily: fonts.displayBoldItalic, marginLeft: 8, flex: 1 }}>
          Vibes
        </Text>
      </View>

      {/* Tabs */}
      <View style={{ flexDirection: 'row', paddingHorizontal: 16, gap: 8, marginBottom: 12 }}>
        {(['recientes', 'todos', 'legado'] as Tab[]).map((t) => (
          <TouchableOpacity
            key={t}
            onPress={() => setTab(t)}
            activeOpacity={0.7}
            style={{
              flex: 1, paddingVertical: 8, borderRadius: 20,
              backgroundColor: tab === t ? theme.text : theme.surface,
              alignItems: 'center',
            }}
          >
            <Text style={{
              color: tab === t ? theme.bg : theme.textMuted,
              fontFamily: fonts.medium, fontSize: 12, letterSpacing: 0.5,
            }}>
              {t === 'recientes' ? 'RECIENTES' : t === 'todos' ? 'TODOS' : 'LEGADO'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator color={theme.text} />
        </View>
      ) : (
        <FlatList
          data={vibes}
          keyExtractor={(v) => v.id}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 40 }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.text} />}
          ListEmptyComponent={
            <View style={{ paddingVertical: 60, alignItems: 'center' }}>
              <Text style={{ fontSize: 48, marginBottom: 12 }}>
                {tab === 'legado' ? '🕯️' : '💭'}
              </Text>
              <Text style={{ color: theme.textMuted, fontFamily: fonts.regular, textAlign: 'center' }}>
                {tab === 'legado'
                  ? 'Aún no hay vibes en modo legado'
                  : tab === 'todos'
                  ? 'Aún no hay vibes públicas'
                  : 'Sin vibes recientes'}
              </Text>
            </View>
          }
          renderItem={({ item }) => (
            <View style={{
              backgroundColor: theme.surface, borderWidth: 1, borderColor: theme.border,
              borderRadius: 14, padding: 14, marginBottom: 10,
            }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                <Avatar name={item.author_name ?? item.author_alias} url={item.author_avatar} size={36} />
                <View style={{ marginLeft: 10, flex: 1 }}>
                  <Text style={{ color: theme.text, fontFamily: fonts.medium, fontSize: 14 }}>
                    {item.author_name ?? item.author_alias}
                  </Text>
                  <Text style={{ color: theme.textMuted, fontFamily: fonts.regular, fontSize: 11 }}>
                    @{item.author_alias}
                  </Text>
                </View>
                <Text style={{ fontSize: 28 }}>{MOODS[item.mood] ?? '💭'}</Text>
              </View>
              {item.message ? (
                <Text style={{ color: theme.text, fontFamily: fonts.regular, fontSize: 15, lineHeight: 21 }}>
                  {item.message}
                </Text>
              ) : null}
              {item.resonances_count > 0 ? (
                <Text style={{ color: theme.textMuted, fontFamily: fonts.regular, fontSize: 11, marginTop: 8 }}>
                  💜 {item.resonances_count} resonancias
                </Text>
              ) : null}
            </View>
          )}
        />
      )}
    </View>
  );
}
TSX
echo "  ✅ VibesScreen reescrito"

# ---------- 6. Backend: api.vibes.legacy y api.vibes.all ----------
echo "▸ 6. Cliente API: legacy + all"
python3 << 'PY'
path = '../shared/api/client.ts'
src = open(path).read()
orig = src

if 'legacy:' not in src.split('vibes:')[1].split('},')[0] if 'vibes:' in src else False:
    pass

# Añadir legacy y all a vibes si no existen
if 'vibes:' in src and 'legacy:' not in src.split('vibes:')[1].split('},')[0]:
    old = """      list: (p?: any) => {
        const q = new URLSearchParams();
        if (p?.limit) q.set('limit', String(p.limit));
        return request<any>(`/vibes?${q}`);
      },"""
    new = """      list: (p?: any) => {
        const q = new URLSearchParams();
        if (p?.limit) q.set('limit', String(p.limit));
        return request<any>(`/vibes?${q}`);
      },
      all: (p?: any) => {
        const q = new URLSearchParams();
        if (p?.limit) q.set('limit', String(p.limit));
        return request<any>(`/vibes/all?${q}`);
      },
      legacy: (p?: any) => {
        const q = new URLSearchParams();
        if (p?.limit) q.set('limit', String(p.limit));
        return request<any>(`/vibes/legacy?${q}`);
      },"""
    if old in src:
        src = src.replace(old, new, 1)
        open(path, 'w').write(src)
        print("  ✅ api.vibes.all + legacy")
    else:
        print("  ⚠️  patrón list no encontrado")
else:
    print("  ·  ya existen")
PY

# Sincronizar copia mobile
cp ../shared/api/client.ts shared/api/client.ts 2>/dev/null

# ---------- 7. Backend rutas: /vibes/all y /vibes/legacy ----------
echo "▸ 7. Backend: rutas /vibes/all y /vibes/legacy"
python3 << 'PY'
path = '../backend/src/routes/vibes.ts'
try:
    src = open(path).read()
except:
    print("  ⚠️  routes/vibes.ts no existe")
    exit()

if '/vibes/all' not in src:
    # Insertar antes del cierre de vibesRoutes
    old = "}\n"
    # Buscar el final de la función vibesRoutes
    idx = src.rfind("}")
    insertion = """
  // GET /api/vibes/all — todas las vibes (público)
  app.get('/vibes/all', { preHandler: [requireAuth] }, async (req, reply) => {
    const { limit } = req.query as any;
    try {
      const res = await query(
        `SELECT v.id, v.author_id, v.mood, v.message, v.created_at,
                u.alias AS author_alias, u.name AS author_name, u.avatar_url AS author_avatar,
                (SELECT COUNT(*) FROM vibe_resonances WHERE vibe_id = v.id) AS resonances_count
         FROM vibes v
         JOIN users u ON u.id = v.author_id
         WHERE v.deleted_at IS NULL
         ORDER BY v.created_at DESC
         LIMIT $1`,
        [limit ? parseInt(limit) : 50]
      );
      return reply.send({ vibes: res.rows });
    } catch (err: any) {
      app.log.error(err);
      return reply.code(500).send({ error: 'Error interno' });
    }
  });

  // GET /api/vibes/legacy — vibes en modo legado
  app.get('/vibes/legacy', { preHandler: [requireAuth] }, async (req, reply) => {
    const { limit } = req.query as any;
    try {
      const res = await query(
        `SELECT v.id, v.author_id, v.mood, v.message, v.created_at,
                u.alias AS author_alias, u.name AS author_name, u.avatar_url AS author_avatar
         FROM vibes v
         JOIN users u ON u.id = v.author_id
         WHERE v.deleted_at IS NULL
           AND u.legacy_mode = 1
         ORDER BY v.created_at DESC
         LIMIT $1`,
        [limit ? parseInt(limit) : 50]
      );
      return reply.send({ vibes: res.rows });
    } catch (err: any) {
      app.log.error(err);
      return reply.code(500).send({ error: 'Error interno' });
    }
  });
"""
    src = src[:idx] + insertion + src[idx:]
    open(path, 'w').write(src)
    print("  ✅ rutas /vibes/all + /vibes/legacy añadidas")
else:
    print("  ·  ya existen")

# Verificar que query esté importado
if 'query' not in src.split('\n')[0:15]:
    if "import { query }" not in src:
        src = "import { query } from '../db/pool.js';\n" + src
        open(path, 'w').write(src)
        print("  ✅ import query añadido")
PY

# ---------- 8. Recompilar backend ----------
echo ""
echo "▸ 8. Recompilar backend"
cd ../backend
npx tsc 2>&1 | head -10
if [ ${PIPESTATUS[0]} -eq 0 ]; then
  echo "  ✅ backend TSC limpio"
  pkill -f "dist/server.js"; sleep 2
  nohup node dist/server.js > server.log 2>&1 &
  sleep 4
  curl -s -m 2 http://127.0.0.1:3000/health >/dev/null && echo "  ✅ backend arriba"
else
  echo "  ❌ backend TSC con errores"
fi
cd ../mobile

# ---------- 9. Typecheck mobile ----------
echo ""
echo "▸ 9. Typecheck mobile"
npx tsc --noEmit 2>&1 | head -15
if [ ${PIPESTATUS[0]} -eq 0 ]; then
  echo "  ✅ mobile TSC limpio"
  TSC_OK=1
else
  echo "  ❌ mobile TSC con errores"
  TSC_OK=0
fi

# ---------- 10. Commit ----------
echo ""
if [ "$TSC_OK" = "1" ]; then
  echo "▸ 10. Commit + push"
  cd ~/idkfree
  git add -A
  git commit -m "feat(vibes): burbujas tipo Notas IG + VibesScreen con tabs + /vibes/all + /vibes/legacy" 2>&1 | head -2
  git push 2>&1 | tail -2
fi

echo ""
echo "════════════════════════════════════════════════════"
echo "  ✅ FASE 4 COMPLETA"
echo "════════════════════════════════════════════════════"
