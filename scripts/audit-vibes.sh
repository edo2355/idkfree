#!/data/data/com.termux/files/usr/bin/bash
set +e
cd ~/idkfree/mobile

echo "════════════════════════════════════════════════════"
echo "  AUDITORÍA — Estado actual de Vibes"
echo "════════════════════════════════════════════════════"
echo ""

echo "▸ Archivos relacionados con vibes:"
ls -la src/screens/VibesScreen.tsx 2>/dev/null && echo "  ✅ VibesScreen existe" || echo "  ❌ VibesScreen NO existe"
ls -la src/screens/ 2>/dev/null | grep -i vibe

echo ""
echo "▸ Referencias a vibes en código:"
grep -rn "api.vibes\|navigate('Vibes')\|VibesScreen" src/ 2>/dev/null | head -15

echo ""
echo "▸ Rutas de navegación:"
grep -n "Vibes" src/navigation/*.tsx 2>/dev/null

echo ""
echo "▸ Backend vibes:"
ls ~/idkfree/backend/src/routes/vibes.ts 2>/dev/null && echo "  ✅ backend routes/vibes.ts"
ls ~/idkfree/backend/src/services/vibesService.ts 2>/dev/null && echo "  ✅ backend vibesService.ts"

echo ""
echo "▸ Contenido actual de VibesScreen (primeras 50 líneas):"
head -50 src/screens/VibesScreen.tsx 2>/dev/null

echo ""
echo "════════════════════════════════════════════════════"
