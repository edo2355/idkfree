#!/data/data/com.termux/files/usr/bin/bash
set +e
cd ~/idkfree/mobile || exit 1

echo "════════════════════════════════════════════════════"
echo "  RESPONSIVE SETUP"
echo "════════════════════════════════════════════════════"
echo ""

# 1. Crear hook
echo "▸ 1. Creando hook useResponsive.ts"
mkdir -p src/hooks
cat > src/hooks/useResponsive.ts << 'TSX'
import { useWindowDimensions } from 'react-native';

export interface Responsive {
  width: number;
  height: number;
  isSmall: boolean;   // < 380 (móviles pequeños tipo Galaxy A0x)
  isMedium: boolean;  // 380-450
  isLarge: boolean;   // > 450 (tablets/grandes)
  scale: number;      // factor para tamaños proporcionales
  spacing: { xs: number; sm: number; md: number; lg: number; xl: number };
  font: { xs: number; sm: number; md: number; lg: number; xl: number; xxl: number };
}

export function useResponsive(): Responsive {
  const { width, height } = useWindowDimensions();

  const isSmall = width < 380;
  const isMedium = width >= 380 && width <= 450;
  const isLarge = width > 450;

  // Base de referencia: iPhone 12 (390px). Scale se ajusta 0.85–1.15
  const scale = Math.max(0.85, Math.min(1.15, width / 390));

  const spacing = {
    xs: Math.round(4 * scale),
    sm: Math.round(8 * scale),
    md: Math.round(12 * scale),
    lg: Math.round(16 * scale),
    xl: Math.round(24 * scale),
  };

  const font = {
    xs: Math.round(11 * scale),
    sm: Math.round(13 * scale),
    md: Math.round(15 * scale),
    lg: Math.round(18 * scale),
    xl: Math.round(22 * scale),
    xxl: Math.round(26 * scale),
  };

  return { width, height, isSmall, isMedium, isLarge, scale, spacing, font };
}
TSX
echo "  ✅ src/hooks/useResponsive.ts creado"

# 2. Typecheck
echo ""
echo "▸ 2. Typecheck"
npx tsc --noEmit 2>&1 | head -10
if [ ${PIPESTATUS[0]} -eq 0 ]; then
  echo "  ✅ TSC limpio"
  TSC_OK=1
else
  echo "  ❌ TSC con errores"
  TSC_OK=0
fi

# 3. Commit
echo ""
if [ "$TSC_OK" = "1" ]; then
  echo "▸ 3. Commit + push"
  cd ~/idkfree
  git add -A
  git commit -m "feat(responsive): hook useResponsive para adaptar a tamaños de pantalla" 2>&1 | head -2
  git push 2>&1 | tail -2
fi

echo ""
echo "════════════════════════════════════════════════════"
echo "  ✅ Hook listo — úsalo así:"
echo "════════════════════════════════════════════════════"
echo ""
echo "  import { useResponsive } from '../hooks/useResponsive';"
echo ""
echo "  const { isSmall, spacing, font } = useResponsive();"
echo ""
echo "  <View style={{ padding: spacing.lg }}>"
echo "    <Text style={{ fontSize: font.md }}>Hola</Text>"
echo "  </View>"
echo ""
