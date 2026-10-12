#!/data/data/com.termux/files/usr/bin/bash
# ============================================================
# IDKFREE — FASE 2: UI tipo Instagram (batch inteligente)
# Hace backup, modifica, verifica tsc, commitea
# ============================================================
set +e
cd ~/idkfree/mobile || exit 1
TS=$(date +%s)

echo "════════════════════════════════════════════════════"
echo "  FASE 2 — UI tipo Instagram"
echo "════════════════════════════════════════════════════"
echo ""

# Backup
mkdir -p /tmp/idkfree-bak-$TS 2>/dev/null || mkdir -p ~/tmp/idkfree-bak-$TS
BAK=~/tmp/idkfree-bak-$TS
mkdir -p "$BAK"
cp src/components/HeaderBar.tsx "$BAK/" 2>/dev/null
cp src/screens/FeedScreen.tsx "$BAK/" 2>/dev/null
cp src/components/PostCard.tsx "$BAK/" 2>/dev/null
echo "📦 Backup en $BAK"
echo ""

# ---------- Transformaciones ----------
python3 << 'PY'
import re, os

def read(p):
    try: return open(p).read()
    except: return None

def write(p, s):
    open(p, 'w').write(s)

# ---------- 1. HeaderBar: logo centrado ----------
hb = read('src/components/HeaderBar.tsx')
if hb and 'position' not in hb.split('return')[0]:
    # Buscar el JSX return y estructurarlo como IG: [⚙️] [logo] [💬🔔avatar]
    # Estrategia: envolver el logo en un contenedor centrado absolute
    # Solo si podemos detectar el patrón actual
    if '<Text' in hb and 'IDKFREE' in hb:
        # Reemplazar el bloque del logo por versión centrada
        # Patrón típico: <Text style={...}>IDKFREE</Text>
        hb2 = re.sub(
            r'(<Text[^>]*>)\s*IDKFREE\s*(</Text>)',
            r'<View style={{position:"absolute",left:0,right:0,alignItems:"center",pointerEvents:"none"}}>\1IDKFREE\2</View>',
            hb, count=1
        )
        if hb2 != hb:
            write('src/components/HeaderBar.tsx', hb2)
            print("✅ HeaderBar: logo centrado")
        else:
            print("⚠️  HeaderBar: patrón IDKFREE no encontrado, saltado")
    else:
        print("⚠️  HeaderBar: no parece tener logo, saltado")
else:
    print("⚠️  HeaderBar: no se pudo leer, saltado")

# ---------- 2. PostCard: quitar bordes (IG style) ----------
pc = read('src/components/PostCard.tsx')
if pc:
    changed = False
    # Quitar borderRadius, borderWidth, borderColor del View contenedor principal
    # Buscar el style del primer View que tenga backgroundColor: theme.surface
    pc2 = pc.replace(
        "backgroundColor: theme.surface,\n        borderColor: theme.border,\n        borderWidth: 1,\n        borderRadius: 12,\n        padding: 16,\n        marginBottom: 12,",
        "backgroundColor: theme.bg,\n        borderBottomWidth: 1,\n        borderBottomColor: theme.border,\n        paddingTop: 12,\n        paddingBottom: 12,\n        marginBottom: 0,"
    )
    if pc2 != pc:
        changed = True
        pc = pc2
    # También el bloque con el orden alternativo
    pc2 = pc.replace(
        "borderRadius: 12,\n        borderColor: theme.border,\n        borderWidth: 1,",
        "borderBottomWidth: 1,\n        borderBottomColor: theme.border,"
    )
    if pc2 != pc:
        changed = True
        pc = pc2
    if changed:
        write('src/components/PostCard.tsx', pc)
        print("✅ PostCard: bordes reemplazados por separador sutil")
    else:
        print("⚠️  PostCard: patrón no encontrado, saltado (revisar manualmente)")
else:
    print("⚠️  PostCard: no se pudo leer")

# ---------- 3. FeedScreen: separador sutil ----------
fs = read('src/screens/FeedScreen.tsx')
if fs:
    # Reducir paddingHorizontal global si existe
    fs2 = re.sub(
        r'paddingHorizontal:\s*16',
        'paddingHorizontal: 0',
        fs
    )
    if fs2 != fs:
        write('src/screens/FeedScreen.tsx', fs2)
        print("✅ FeedScreen: paddingHorizontal global a 0 (edge-to-edge)")
    else:
        print("·  FeedScreen: sin cambios (ya estaba o no aplica)")
else:
    print("⚠️  FeedScreen: no se pudo leer")

print("")
print("=== CAMBIOS APLICADOS ===")
PY

echo ""
echo "▸ Typecheck"
npx tsc --noEmit 2>&1 | head -15
if [ ${PIPESTATUS[0]} -eq 0 ]; then
  echo "  ✅ TSC limpio"
  TSC_OK=1
else
  echo "  ❌ TSC con errores → revirtiendo"
  cp "$BAK/HeaderBar.tsx" src/components/ 2>/dev/null
  cp "$BAK/PostCard.tsx" src/components/ 2>/dev/null
  cp "$BAK/FeedScreen.tsx" src/screens/ 2>/dev/null
  echo "  ↩️  Revertido desde backup"
  TSC_OK=0
fi

if [ "$TSC_OK" = "1" ]; then
  echo ""
  echo "▸ Commit + push"
  cd ~/idkfree
  git add -A
  git commit -m "feat(ui): PostCard edge-to-edge + HeaderBar logo centrado (FASE 2 - parte 1)" 2>&1 | head -2
  git push 2>&1 | tail -2
fi

echo ""
echo "════════════════════════════════════════════════════"
echo "  FIN FASE 2 (parte 1)"
echo "════════════════════════════════════════════════════"
echo ""
echo "  Backup en: $BAK"
echo "  Si algo sale mal en Expo: cp $BAK/* src/..."
echo ""
