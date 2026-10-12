#!/data/data/com.termux/files/usr/bin/bash
set +e
cd ~/idkfree/mobile

echo "════════════════════════════════════════════════════"
echo "  AUDITORÍA VISUAL — Archivos UI"
echo "════════════════════════════════════════════════════"
echo ""

for f in \
  src/navigation/AppTabs.tsx \
  src/navigation/RootNavigator.tsx \
  src/components/PostCard.tsx \
  src/screens/FeedScreen.tsx \
  src/screens/CreateScreen.tsx \
  src/screens/SettingsScreen.tsx \
  src/screens/ProfileScreen.tsx \
  src/components/CommentsModal.tsx ; do
  echo ""
  echo "════════════════════════════════════════════════════"
  echo "  📄 $f"
  echo "════════════════════════════════════════════════════"
  if [ -f "$f" ]; then
    echo "  Líneas totales: $(wc -l < $f)"
    echo ""
    echo "  ─── Estilos clave (grep) ───"
    grep -nE "padding|margin|borderRadius|borderWidth|backgroundColor|flexDirection|tabBar|screenOptions" "$f" 2>/dev/null | head -25
    echo ""
    echo "  ─── Imports ───"
    grep "^import" "$f" | head -15
  else
    echo "  ❌ NO EXISTE"
  fi
  echo ""
done

echo "════════════════════════════════════════════════════"
echo "  Iconos disponibles"
echo "════════════════════════════════════════════════════"
ls -la ~/idkfree/mobile/src/components/icons/ 2>/dev/null

echo ""
echo "════════════════════════════════════════════════════"
echo "  FIN AUDITORÍA VISUAL"
echo "════════════════════════════════════════════════════"
