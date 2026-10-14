#!/data/data/com.termux/files/usr/bin/bash
set +e
cd ~/idkfree/mobile || exit 1

echo "════════════════════════════════════════════════════"
echo "  ScreenBackground en TODAS las pantallas"
echo "════════════════════════════════════════════════════"
echo ""

apply_bg() {
  local screen="$1"
  local variant="$2"
  local path="src/screens/$screen.tsx"

  if [ ! -f "$path" ]; then
    echo "  ⚠️  $screen no existe"
    return
  fi

  python3 << PY
import re
path = "$path"
variant = "$variant"
src = open(path).read()
orig = src

# Import
if 'ScreenBackground' not in src:
    m = list(re.finditer(r"import [^;]+;", src))
    if m:
        last = m[-1]
        src = src[:last.end()] + f"\nimport {{ ScreenBackground }} from '../components/ScreenBackground';" + src[last.end():]

# Añadir ScreenBackground tras el primer <View style={{ flex: 1, backgroundColor: theme.bg }}>
if '<ScreenBackground' not in src:
    # Caso 1: View principal
    pattern = r'(return \(\s*\n\s*)<View style=\{\{ flex: 1, backgroundColor: theme\.bg \}\}>'
    new = r'\1<View style={{ flex: 1, backgroundColor: theme.bg }}>\n      <ScreenBackground variant="' + variant + '" />'
    src2 = re.sub(pattern, new, src, count=1)
    if src2 != src:
        src = src2
    else:
        # Caso 2: Return con ScrollView directo
        pattern2 = r'(return \(\s*\n\s*)<ScrollView'
        new2 = r'\1<View style={{ flex: 1, backgroundColor: theme.bg }}>\n      <ScreenBackground variant="' + variant + '" />\n      <ScrollView'
        src3 = re.sub(pattern2, new2, src, count=1)
        if src3 != src:
            src = src3
            # Cerrar el View antes del último );
            # Buscar el último </ScrollView>\n  );\n} y añadir </View>
            src = re.sub(r'(</ScrollView>\s*\n\s*)\);\s*\n\}', r'\1</View>\n  );\n}', src, count=1)

if src != orig:
    open(path, 'w').write(src)
    print(f"  ✅ {path.split('/')[-1]} → {variant}")
else:
    print(f"  ⚠️  {path.split('/')[-1]} sin cambios")
PY
}

apply_bg "RegisterScreen"      "neural"
apply_bg "SplashScreen"        "particles"
apply_bg "SettingsScreen"      "hex"
apply_bg "EditProfileScreen"   "topo"
apply_bg "ChangePasswordScreen" "pulse"
apply_bg "RecoveryScreen"      "radar"
apply_bg "ConfigScreen"        "grid"
apply_bg "HashtagScreen"       "wave"
apply_bg "ChatScreen"          "radio"

echo ""
echo "▸ Typecheck"
npx tsc --noEmit 2>&1 | head -12
if [ ${PIPESTATUS[0]} -eq 0 ]; then
  echo "  ✅ TSC limpio"
  cd ~/idkfree
  git add -A
  git commit -m "feat(bg): ScreenBackground en Register, Splash, Settings, EditProfile, ChangePassword, Recovery, Config, Hashtag, Chat" 2>&1 | head -2
  git push 2>&1 | tail -2
else
  echo "  ❌ TSC con errores"
fi

echo ""
echo "════════════════════════════════════════════════════"
echo "  ✅ Backgrounds aplicados a todas las pantallas"
echo "════════════════════════════════════════════════════"
