#!/data/data/com.termux/files/usr/bin/bash
set +e
cd ~/idkfree/mobile || exit 1
TS=$(date +%s)
BAK=~/tmp/idkfree-bak-$TS
mkdir -p "$BAK"

echo "════════════════════════════════════════════════════"
echo "  FASE 2 — TABS + ICONOS SVG"
echo "════════════════════════════════════════════════════"
echo "  Backup: $BAK"
echo ""

# ---- 1. Leer AppTabs actual ----
echo "▸ 1. Leyendo AppTabs.tsx"
if [ ! -f src/navigation/AppTabs.tsx ]; then
  echo "  ❌ No existe src/navigation/AppTabs.tsx"
  exit 1
fi
cp src/navigation/AppTabs.tsx "$BAK/"
echo "  ─── CONTENIDO ───"
cat src/navigation/AppTabs.tsx
echo "  ─── FIN ───"
echo ""

# ---- 2. Crear iconos SVG faltantes (Chat, Create, Reels) ----
echo "▸ 2. Creando iconos SVG"

# ChatIcon (globo de chat)
if [ ! -f src/components/icons/ChatIcon.tsx ]; then
cat > src/components/icons/ChatIcon.tsx << 'TSX'
import Svg, { Path } from 'react-native-svg';

export function ChatIcon({ size = 24, color = '#FFF', filled = false }: { size?: number; color?: string; filled?: boolean }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"
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
echo "  ✅ ChatIcon creado"
else
echo "  ·  ChatIcon ya existe"
fi

# CreateIcon (más en caja)
if [ ! -f src/components/icons/CreateIcon.tsx ]; then
cat > src/components/icons/CreateIcon.tsx << 'TSX'
import Svg, { Path, Rect } from 'react-native-svg';

export function CreateIcon({ size = 24, color = '#FFF' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x="3" y="3" width="18" height="18" rx="4" stroke={color} strokeWidth={2} />
      <Path d="M12 8v8M8 12h8" stroke={color} strokeWidth={2} strokeLinecap="round" />
    </Svg>
  );
}
TSX
echo "  ✅ CreateIcon creado"
else
echo "  ·  CreateIcon ya existe"
fi

# ReelsIcon (claqueta/play)
if [ ! -f src/components/icons/ReelsIcon.tsx ]; then
cat > src/components/icons/ReelsIcon.tsx << 'TSX'
import Svg, { Path, Rect } from 'react-native-svg';

export function ReelsIcon({ size = 24, color = '#FFF', filled = false }: { size?: number; color?: string; filled?: boolean }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x="3" y="4" width="18" height="16" rx="3" stroke={color} strokeWidth={2} fill={filled ? color : 'none'} />
      <Path d="M3 8h18M8 4l3 4M14 4l3 4" stroke={color} strokeWidth={2} strokeLinecap="round" />
      <Path d="M10 12l5 3-5 3v-6z" fill={filled ? '#000' : color} />
    </Svg>
  );
}
TSX
echo "  ✅ ReelsIcon creado"
else
echo "  ·  ReelsIcon ya existe"
fi

# SettingsIcon (engranaje)
if [ ! -f src/components/icons/SettingsIcon.tsx ]; then
cat > src/components/icons/SettingsIcon.tsx << 'TSX'
import Svg, { Circle, Path } from 'react-native-svg';

export function SettingsIcon({ size = 24, color = '#FFF' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="3" stroke={color} strokeWidth={2} />
      <Path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"
        stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}
TSX
echo "  ✅ SettingsIcon creado"
else
echo "  ·  SettingsIcon ya existe"
fi

# ---- 3. Verificar react-native-svg ----
echo ""
echo "▸ 3. Verificando react-native-svg"
if [ -d node_modules/react-native-svg ]; then
  echo "  ✅ react-native-svg instalado"
else
  echo "  ⚠️  react-native-svg NO instalado — instalando..."
  npx expo install react-native-svg 2>&1 | tail -3
fi

# ---- 4. Typecheck ----
echo ""
echo "▸ 4. Typecheck"
npx tsc --noEmit 2>&1 | head -10
if [ ${PIPESTATUS[0]} -eq 0 ]; then
  echo "  ✅ TSC limpio"
  TSC_OK=1
else
  echo "  ❌ TSC con errores"
  TSC_OK=0
fi

# ---- 5. Commit ----
echo ""
if [ "$TSC_OK" = "1" ]; then
  echo "▸ 5. Commit + push"
  cd ~/idkfree
  git add -A
  git commit -m "feat(icons): ChatIcon, CreateIcon, ReelsIcon, SettingsIcon SVG" 2>&1 | head -2
  git push 2>&1 | tail -2
fi

echo ""
echo "════════════════════════════════════════════════════"
echo "  ✅ Iconos SVG listos"
echo "════════════════════════════════════════════════════"
echo "  Ahora abre AppTabs.tsx y usa:"
echo "    import { ChatIcon } from '../components/icons/ChatIcon';"
echo "    import { CreateIcon } from '../components/icons/CreateIcon';"
echo "    import { ReelsIcon } from '../components/icons/ReelsIcon';"
echo "════════════════════════════════════════════════════"
