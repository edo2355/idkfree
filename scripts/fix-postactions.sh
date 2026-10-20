#!/data/data/com.termux/files/usr/bin/bash
set +e
cd ~/idkfree/mobile || exit 1

echo "════════════════════════════════════════════════════"
echo "  PostCard — acciones lindas + RepostIcon SVG"
echo "════════════════════════════════════════════════════"
echo ""

# ---------- 1. RepostIcon SVG ----------
echo "▸ 1. RepostIcon.tsx"
cat > src/components/icons/RepostIcon.tsx << 'TSX'
import Svg, { Path } from 'react-native-svg';

export function RepostIcon({ size = 22, color = '#FFF', filled = false }: { size?: number; color?: string; filled?: boolean }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M17 1l4 4-4 4"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <Path
        d="M3 11V9a4 4 0 0 1 4-4h14"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill={filled ? color : 'none'}
      />
      <Path
        d="M7 23l-4-4 4-4"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <Path
        d="M21 13v2a4 4 0 0 1-4 4H3"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill={filled ? color : 'none'}
      />
    </Svg>
  );
}
TSX
echo "  ✅"

# ---------- 2. BookmarkIcon SVG ----------
echo "▸ 2. BookmarkIcon.tsx"
cat > src/components/icons/BookmarkIcon.tsx << 'TSX'
import Svg, { Path } from 'react-native-svg';

export function BookmarkIcon({ size = 22, color = '#FFF', filled = false }: { size?: number; color?: string; filled?: boolean }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill={filled ? color : 'none'}
      />
    </Svg>
  );
}
TSX
echo "  ✅"

# ---------- 3. PostCard: barra de acciones bonita ----------
echo "▸ 3. PostCard barra de acciones"
python3 << 'PY'
path = 'src/components/PostCard.tsx'
src = open(path).read()
orig = src

# Importar RepostIcon y BookmarkIcon
if 'RepostIcon' not in src:
    src = src.replace(
        "import { ShareIcon } from './icons/ShareIcon';",
        "import { ShareIcon } from './icons/ShareIcon';\nimport { RepostIcon } from './icons/RepostIcon';\nimport { BookmarkIcon } from './icons/BookmarkIcon';",
        1
    )
    print("  ✅ imports")

# Estado de bookmark
if 'saved' not in src:
    src = src.replace(
        "  const [reposting, setReposting] = useState(false);",
        "  const [reposting, setReposting] = useState(false);\n  const [saved, setSaved] = useState(false);",
        1
    )
    print("  ✅ estado saved")

# Reemplazar toda la barra de acciones
old_actions = """      {/* Actions */}
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 24, marginTop: 4 }}>
        <TouchableOpacity onPress={toggleLike} disabled={busy} style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }} activeOpacity={0.6}>
          <HeartIcon size={22} color={liked ? theme.accent : theme.textMuted} filled={liked} />
          {likesCount > 0 ? (
            <Text style={{ color: liked ? theme.danger : theme.textMuted, fontFamily: fonts.medium, fontSize: 13 }}>
              {likesCount}
            </Text>
          ) : null}
        </TouchableOpacity>

        <TouchableOpacity onPress={onComment} style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }} activeOpacity={0.6}>
          <CommentIcon size={22} color={theme.textMuted} />
          {(post.comments_count ?? 0) > 0 ? (
            <Text style={{ color: theme.textMuted, fontFamily: fonts.medium, fontSize: 13 }}>
              {post.comments_count}
            </Text>
          ) : null}
        </TouchableOpacity>

        <TouchableOpacity onPress={onShare} style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }} activeOpacity={0.6}>
          <ShareIcon size={20} color={theme.textMuted} />
        </TouchableOpacity>

        {/* Republicar */}
        <TouchableOpacity onPress={doRepost} disabled={reposting} style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }} activeOpacity={0.6}>
          <Text style={{ fontSize: 20, opacity: reposting ? 0.3 : 0.5 }}>🔁</Text>
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

new_actions = """      {/* Actions */}
      <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8 }}>
        {/* Grupo izquierda: like, comentario, share */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 20 }}>
          <TouchableOpacity onPress={toggleLike} disabled={busy} style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }} activeOpacity={0.6}>
            <HeartIcon size={22} color={liked ? theme.accent : theme.textMuted} filled={liked} />
            {likesCount > 0 ? (
              <Text style={{ color: liked ? theme.accent : theme.textMuted, fontFamily: fonts.medium, fontSize: 13 }}>
                {likesCount}
              </Text>
            ) : null}
          </TouchableOpacity>

          <TouchableOpacity onPress={onComment} style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }} activeOpacity={0.6}>
            <CommentIcon size={22} color={theme.textMuted} />
            {(post.comments_count ?? 0) > 0 ? (
              <Text style={{ color: theme.textMuted, fontFamily: fonts.medium, fontSize: 13 }}>
                {post.comments_count}
              </Text>
            ) : null}
          </TouchableOpacity>

          <TouchableOpacity onPress={doRepost} disabled={reposting} activeOpacity={0.6}>
            <RepostIcon size={22} color={reposting ? theme.accent : theme.textMuted} filled={reposting} />
          </TouchableOpacity>

          <TouchableOpacity onPress={onShare} activeOpacity={0.6}>
            <ShareIcon size={20} color={theme.textMuted} />
          </TouchableOpacity>

          {!isMine && imageUrl ? (
            <TouchableOpacity onPress={() => setShowDrawing(true)} activeOpacity={0.6}>
              <Text style={{ fontSize: 18, color: theme.textMuted }}>✏️</Text>
            </TouchableOpacity>
          ) : null}

          {drawingsCount > 0 ? (
            <TouchableOpacity onPress={() => setShowDrawings(true)} style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }} activeOpacity={0.6}>
              <Text style={{ fontSize: 16, color: theme.textMuted }}>🎨</Text>
              <Text style={{ color: theme.textMuted, fontFamily: fonts.medium, fontSize: 12 }}>
                {drawingsCount}
              </Text>
            </TouchableOpacity>
          ) : null}
        </View>

        {/* Espacio */}
        <View style={{ flex: 1 }} />

        {/* Bookmark (guardar) */}
        <TouchableOpacity onPress={() => setSaved((s) => !s)} activeOpacity={0.6}>
          <BookmarkIcon size={22} color={saved ? theme.accent : theme.textMuted} filled={saved} />
        </TouchableOpacity>
      </View>"""

if old_actions in src:
    src = src.replace(old_actions, new_actions, 1)
    print("  ✅ barra de acciones reorganizada")
else:
    print("  ⚠️  patrón actions no encontrado")
    # Diagnóstico
    if 'Actions' in src:
        print("  ·  'Actions' existe, revisá el código")

if src != orig:
    open(path, 'w').write(src)
    print("  ✅ PostCard guardado")
PY

# ---------- 4. Typecheck ----------
echo ""
echo "▸ 4. Typecheck"
npx tsc --noEmit 2>&1 | head -12
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
  git commit -m "feat(post): RepostIcon + BookmarkIcon SVG + barra de acciones reorganizada" 2>&1 | head -2
  git push 2>&1 | tail -2
fi

echo ""
echo "════════════════════════════════════════════════════"
echo "  ✅ PostCard lindo"
echo "════════════════════════════════════════════════════"
