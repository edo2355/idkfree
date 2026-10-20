#!/data/data/com.termux/files/usr/bin/bash
# ============================================================
# IDKFREE — FASE 2 MEGA: lee + modifica + verifica + commit
# ============================================================
set +e
cd ~/idkfree/mobile || exit 1
TS=$(date +%s)
BAK=~/tmp/idkfree-bak-$TS
mkdir -p "$BAK"

echo "════════════════════════════════════════════════════════════"
echo "  FASE 2 MEGA SCRIPT"
echo "════════════════════════════════════════════════════════════"
echo ""

# ============ PARTE 1: LEER ARCHIVOS ============
echo "▸ 1. CONTENIDO ACTUAL DE ARCHIVOS CLAVE"
echo "════════════════════════════════════════════════════════════"
for f in src/components/HeaderBar.tsx src/screens/FeedScreen.tsx src/components/PostCard.tsx; do
  echo ""
  echo "───── $f ─────"
  if [ -f "$f" ]; then
    cp "$f" "$BAK/"
    wc -l "$f"
    echo "--- primeras 60 líneas ---"
    head -60 "$f"
    echo "..."
  else
    echo "❌ NO EXISTE"
  fi
done

echo ""
echo "════════════════════════════════════════════════════════════"
echo "▸ 2. APLICANDO CAMBIOS"
echo "════════════════════════════════════════════════════════════"

python3 << 'PY'
import re, os

def read(p):
    try: return open(p).read()
    except: return None

def write(p, s):
    open(p, 'w').write(s)

# ---- HeaderBar ----
hb = read('src/components/HeaderBar.tsx')
if hb:
    print("HeaderBar: procesando...")
    # Cambio 1: centrar logo IDKFREE
    if 'IDKFREE' in hb and 'position:"absolute"' not in hb and "position: 'absolute'" not in hb:
        # Ver si hay un <Text>IDKFREE</Text>
        m = re.search(r'<Text[^>]*>\s*IDKFREE\s*</Text>', hb)
        if m:
            logo_orig = m.group(0)
            logo_centered = f'''<View style={{{{position:'absolute',left:0,right:0,alignItems:'center',pointerEvents:'none'}}}}>{logo_orig}</View>'''
            hb = hb.replace(logo_orig, logo_centered, 1)
            write('src/components/HeaderBar.tsx', hb)
            print("  ✅ logo centrado")
        else:
            print("  ⚠️  no encontré <Text>IDKFREE</Text>")
    else:
        print("  ⚠️  ya está centrado o no aplica")
else:
    print("HeaderBar: NO LEÍDO")

# ---- PostCard ----
pc = read('src/components/PostCard.tsx')
if pc:
    print("PostCard: procesando...")
    orig = pc
    # Patrón 1: bloque completo con backgroundColor: theme.surface
    patterns = [
        ("""backgroundColor: theme.surface,
        borderColor: theme.border,
        borderWidth: 1,
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,""",
         """backgroundColor: theme.bg,
        borderBottomWidth: 1,
        borderBottomColor: theme.border,
        paddingTop: 12,
        paddingBottom: 12,
        marginBottom: 0,"""),
    ]
    replaced = False
    for old, new in patterns:
        if old in pc:
            pc = pc.replace(old, new, 1)
            replaced = True
            break
    if not replaced:
        # Buscar por regex el bloque estilo
        pc = re.sub(
            r"backgroundColor:\s*theme\.surface\s*,\s*\n\s*borderColor:\s*theme\.border\s*,\s*\n\s*borderWidth:\s*1\s*,\s*\n\s*borderRadius:\s*12\s*,\s*\n\s*padding:\s*16\s*,\s*\n\s*marginBottom:\s*12",
            "backgroundColor: theme.bg,\n        borderBottomWidth: 1,\n        borderBottomColor: theme.border,\n        paddingTop: 12,\n        paddingBottom: 12,\n        marginBottom: 0",
            pc, count=1
        )
        replaced = (pc != orig)
    if replaced and pc != orig:
        write('src/components/PostCard.tsx', pc)
        print("  ✅ bordes → separador sutil estilo IG")
    else:
        print("  ⚠️  no encontré el bloque de estilo (revisar manual)")

# ---- FeedScreen ----
fs = read('src/screens/FeedScreen.tsx')
if fs:
    print("FeedScreen: procesando...")
    orig = fs
    # Padding horizontal 16 → 0 (edge-to-edge)
    fs = re.sub(r'paddingHorizontal:\s*16', 'paddingHorizontal: 0', fs)
    # Quitar contentContainerStyle padding si aplica
    if fs != orig:
        write('src/screens/FeedScreen.tsx', fs)
        print("  ✅ paddingHorizontal 16 → 0")
    else:
        print("  ·  sin cambios")

print("")
print("=== CAMBIOS APLICADOS ===")
PY

# ============ PARTE 3: TYPECHECK ============
echo ""
echo "▸ 3. TYPECHECK"
npx tsc --noEmit 2>&1 | head -15
TSC=$?

# ============ PARTE 4: COMMIT ============
echo ""
if [ "$TSC" = "0" ]; then
  echo "▸ 4. ✅ TSC limpio → commit + push"
  cd ~/idkfree
  git add -A
  git commit -m "feat(ui): PostCard edge-to-edge + HeaderBar logo centrado (FASE 2 parte 1)" 2>&1 | head -2
  git push 2>&1 | tail -2
else
  echo "▸ 4. ❌ TSC con errores → REVIRTIENDO"
  cp "$BAK"/* src/components/ 2>/dev/null
  cp "$BAK"/* src/screens/ 2>/dev/null
  echo "   ↩️  Revertido desde backup $BAK"
fi

echo ""
echo "════════════════════════════════════════════════════════════"
echo "  FIN"
echo "════════════════════════════════════════════════════════════"
echo "  Backup: $BAK"
echo ""
