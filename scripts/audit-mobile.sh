#!/data/data/com.termux/files/usr/bin/bash
set +e
cd ~/idkfree/mobile

echo "════════════════════════════════════════════════════"
echo "  AUDITORÍA MOBILE — Qué quedó pendiente"
echo "════════════════════════════════════════════════════"
echo ""

echo "▸ 1. Login (letras grandes)"
grep -c "fontSize: 44" src/screens/LoginScreen.tsx
echo "  ↑ esperado: 1"

echo ""
echo "▸ 2. HeaderBar sin gear/bell"
echo "  Settings: $(grep -c 'navigate(.*Settings' src/components/HeaderBar.tsx)"
echo "  Notifications: $(grep -c 'navigate(.*Notifications' src/components/HeaderBar.tsx)"
echo "  ↑ esperado: 0"

echo ""
echo "▸ 3. NotesRow sin 'Tu nota'"
grep -c "Tu nota" src/components/NotesRow.tsx
echo "  ↑ esperado: 0"

echo ""
echo "▸ 4. StoryViewer fix"
grep -c "useEffect" src/components/StoryViewer.tsx
echo "  ↑ esperado: 4+"

echo ""
echo "▸ 5. PostCard 🔁"
grep -c "opacity: 0.5" src/components/PostCard.tsx
echo "  ↑ esperado: 1+"

echo ""
echo "▸ 6. PostCard botones tamaño 22"
grep -c "size={22}" src/components/PostCard.tsx
echo "  ↑ esperado: 3+"

echo ""
echo "▸ 7. ChatsScreen con NotesRow"
grep -c "NotesRow" src/screens/ChatsScreen.tsx
echo "  ↑ esperado: 1+"

echo ""
echo "▸ 8. AppTabs — el + de Create"
grep -n "Create\|tabBarIcon" src/navigation/AppTabs.tsx | head -10

echo ""
echo "▸ 9. RegisterScreen — diseño"
head -30 src/screens/RegisterScreen.tsx | tail -20

echo ""
echo "▸ 10. VibesScreen — tabs"
grep -c "RECIENTES\|TODOS\|LEGADO" src/screens/VibesScreen.tsx
echo "  ↑ esperado: 3"

echo ""
echo "▸ 11. ProfileScreen — grid IG?"
grep -c "FlatList\|numColumns" src/screens/ProfileScreen.tsx
echo "  numColumns: $(grep -c 'numColumns' src/screens/ProfileScreen.tsx)"

echo ""
echo "▸ 12. TSC"
npx tsc --noEmit 2>&1 | head -10
if [ ${PIPESTATUS[0]} -eq 0 ]; then echo "  ✅ limpio"; else echo "  ❌ errores"; fi

echo ""
echo "▸ 13. Git status"
cd ~/idkfree && git status --short | head -10

echo ""
echo "════════════════════════════════════════════════════"
