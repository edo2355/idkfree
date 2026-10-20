#!/data/data/com.termux/files/usr/bin/bash
set +e
cd ~/idkfree/mobile || exit 1

echo "════════════════════════════════════════════════════"
echo "  ScreenBackground inteligente (detecta estructura)"
echo "════════════════════════════════════════════════════"
echo ""

apply_bg_smart() {
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

if '<ScreenBackground' not in src:
    # Buscar el return principal (el último "return (" antes de la primera llave de cierre)
    # Encontrar el return de mayor nivel (el que tiene indentación de 2 espacios)
    m = re.search(r'(  return \(\s*\n)(\s*)(<[A-Za-z]+)', src)
    if m:
        # El siguiente tag puede ser <View, <ScrollView, <KeyboardAvoidingView, etc
        first_tag_line_start = m.end(2)
        # Encontrar el cierre del primer tag de apertura (hasta el > final)
        # Buscar desde la posición del primer tag hasta el primer '>' que cierra
        rest = src[m.start(3):]
        # Contar depth de paréntesis y llaves para encontrar el final del tag
        depth_curly = 0
        depth_paren = 0
        i = 0
        while i < len(rest):
            c = rest[i]
            if c == '{': depth_curly += 1
            elif c == '}': depth_curly -= 1
            elif c == '(': depth_paren += 1
            elif c == ')': depth_paren -= 1
            elif c == '>' and depth_curly == 0 and depth_paren == 0:
                # Es el cierre del tag
                i += 1
                break
            i += 1

        tag_end = m.end(3) + i
        indent = m.group(2)

        # Insertar ScreenBackground después del tag de apertura
        insert_pos = tag_end
        # Ver si el primer hijo está en la siguiente línea
        insertion = f"\n{indent}  <ScreenBackground variant=\"{variant}\" />"
        src = src[:insert_pos] + insertion + src[insert_pos:]
        print(f"  ✅ {path.split('/')[-1]} → {variant}")
    else:
        print(f"  ⚠️  {path.split('/')[-1]} — no encontré return principal")
else:
    print(f"  ·  {path.split('/')[-1]} ya tenía")

if src != orig:
    open(path, 'w').write(src)
PY
}

apply_bg_smart "RegisterScreen"      "neural"
apply_bg_smart "SplashScreen"        "particles"
apply_bg_smart "SettingsScreen"      "hex"
apply_bg_smart "EditProfileScreen"   "topo"
apply_bg_smart "ChangePasswordScreen" "pulse"
apply_bg_smart "RecoveryScreen"      "radar"
apply_bg_smart "ConfigScreen"        "grid"
apply_bg_smart "HashtagScreen"       "wave"
apply_bg_smart "ChatScreen"          "radio"

echo ""
echo "▸ Typecheck"
npx tsc --noEmit 2>&1 | head -12
if [ ${PIPESTATUS[0]} -eq 0 ]; then
  echo "  ✅ TSC limpio"
  cd ~/idkfree
  git add -A
  git commit -m "feat(bg): ScreenBackground inteligente en 9 pantallas" 2>&1 | head -2
  git push 2>&1 | tail -2
else
  echo "  ❌ TSC con errores"
fi

echo ""
echo "════════════════════════════════════════════════════"
echo "  ✅ Backgrounds aplicados (smart)"
echo "════════════════════════════════════════════════════"
