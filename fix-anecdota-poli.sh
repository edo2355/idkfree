#!/data/data/com.termux/files/usr/bin/bash
set +e
cd ~/idkfree/mobile || exit 1

echo "════════════════════════════════════════════════════"
echo "  Anécdota policial protagónica — About + Card"
echo "════════════════════════════════════════════════════"
echo ""

# ---------- 1. AboutScreen con anécdota reforzada ----------
echo "▸ 1. AboutScreen — anécdota policial reforzada"
python3 << 'PY'
path = 'src/screens/AboutScreen.tsx'
src = open(path).read()

# Reemplazar la sección "DE LA ESPINA A LA IDEA" completa
old = """        {/* De la espina a la idea */}
        <View style={{ marginTop: 32 }}>
          <Text style={{ color: theme.textSubtle, fontFamily: MONO, fontSize: 10, letterSpacing: 2, marginBottom: 10 }}>
            DE LA ESPINA A LA IDEA
          </Text>
          <Text style={{ color: theme.text, fontFamily: fonts.regular, fontSize: 16, lineHeight: 26 }}>
            En Cuba, además, los policías te piden el carnet de identidad todo el tiempo. Y no siempre lo tienes encima. Me puse a pensar:
            {'\\n\\n'}
            <Text style={{ color: theme.accent, fontStyle: 'italic' }}>
              "¿Y si tu identidad digital fuera tan sólida como un carnet que nadie puede falsificar, y tan recuperable como para que nunca se pierda una cuenta?"
            </Text>
            {'\\n\\n'}
            De ahí nació IDKFREE. No es una red social más. Es un sistema donde tu identidad es tuya, y aunque te hackeen, hay una llave que solo tú tienes.
          </Text>
        </View>"""

new = """        {/* De la espina a la idea */}
        <View style={{ marginTop: 32 }}>
          <Text style={{ color: theme.textSubtle, fontFamily: MONO, fontSize: 10, letterSpacing: 2, marginBottom: 10 }}>
            DE LA ESPINA A LA IDEA
          </Text>
          <Text style={{ color: theme.text, fontFamily: fonts.regular, fontSize: 16, lineHeight: 26 }}>
            Pero esa espina no fue sola. En Cuba, los policías te piden el carnet de identidad todo el tiempo. En la calle, en la cola del pan, en la terminal, en cualquier esquina. Y no siempre lo tienes encima — se te moja, se te pierde, se te rompe, o simplemente lo dejaste en casa.
          </Text>
          <Text style={{ color: theme.text, fontFamily: fonts.regular, fontSize: 16, lineHeight: 26, marginTop: 14 }}>
            Y ahí me cayó la ficha completa:
          </Text>

          {/* Cita destacada */}
          <View style={{
            marginTop: 16,
            paddingLeft: 14,
            borderLeftWidth: 3,
            borderLeftColor: theme.accent,
          }}>
            <Text style={{ color: theme.text, fontFamily: fonts.regular, fontSize: 17, lineHeight: 26, fontStyle: 'italic' }}>
              ¿Y si tu carnet fuera digital, imposible de falsificar, imposible de robar, y encima te sirviera para recuperar TODAS tus cuentas si algún día te hackean?
            </Text>
          </View>

          <Text style={{ color: theme.text, fontFamily: fonts.regular, fontSize: 16, lineHeight: 26, marginTop: 16 }}>
            Un carnet que puedas enseñar cuando te lo pidan, aunque estés a 5000 km de tu casa.
            {'\n\n'}
            Un carnet que no le importa si el hacker cambió tu nombre en Instagram, porque tu llave no vive en Instagram — vive contigo.
            {'\n\n'}
            Un carnet que si te hackean, con mostrar 3 QRs, el mundo entero sabe quién eres de verdad.
          </Text>

          <Text style={{ color: theme.text, fontFamily: fonts.regular, fontSize: 16, lineHeight: 26, marginTop: 16 }}>
            De ahí nació IDKFREE. Un carnet que resuelve el hack de 2023 Y el problema del policía en la esquina al mismo tiempo.
          </Text>
        </View>"""

if old in src:
    src = src.replace(old, new, 1)
    open(path, 'w').write(src)
    print("  ✅ anécdota reforzada en About")
else:
    print("  ⚠️  no encontré la sección — buscando variante")

    # Variante por si los \n escapados son distintos
    if 'En Cuba, además, los policías' in src:
        print("  ·  sección existe, pero formato distinto")
PY
PY

# ---------- 2. CardScreen con anécdota en el header ----------
echo ""
echo "▸ 2. CardScreen — anécdota como contexto"
python3 << 'PY'
path = 'src/screens/CardScreen.tsx'
src = open(path).read()

# Añadir subtítulo bajo "Tu carnet" contando la historia corta
old = """      <Text style={{ fontSize: 26, color: theme.text, fontFamily: fonts.displayBoldItalic, letterSpacing: 0.5, marginBottom: 4 }}>
        Tu carnet
      </Text>
      <Text style={{ color: theme.textMuted, fontFamily: MONO, fontSize: 10, letterSpacing: 2, marginBottom: 20 }}>
        IDKFREE.CARD · {nodeId}
      </Text>"""

new = """      <Text style={{ fontSize: 26, color: theme.text, fontFamily: fonts.displayBoldItalic, letterSpacing: 0.5, marginBottom: 4 }}>
        Tu carnet
      </Text>
      <Text style={{ color: theme.textMuted, fontFamily: MONO, fontSize: 10, letterSpacing: 2, marginBottom: 8 }}>
        IDKFREE.CARD · {nodeId}
      </Text>
      <Text style={{ color: theme.textMuted, fontFamily: fonts.regular, fontSize: 12, lineHeight: 18, marginBottom: 20 }}>
        Este carnet existe porque en 2023 me hackearon una cuenta y nunca la pude recuperar. Y porque en Cuba te piden el carnet todo el tiempo. Ahora tenés uno que no se pierde, no se falsifica y te devuelve todas tus cuentas.
      </Text>"""

if old in src:
    src = src.replace(old, new, 1)
    open(path, 'w').write(src)
    print("  ✅ anécdota añadida al CardScreen")
else:
    print("  ⚠️  patrón del header no encontrado")
PY

# ---------- 3. Typecheck ----------
echo ""
echo "▸ 3. Typecheck"
npx tsc --noEmit 2>&1 | head -12
if [ ${PIPESTATUS[0]} -eq 0 ]; then
  echo "  ✅ TSC limpio"
  TSC_OK=1
else
  echo "  ❌ TSC con errores"
  TSC_OK=0
fi

# ---------- 4. Commit ----------
echo ""
if [ "$TSC_OK" = "1" ]; then
  echo "▸ 4. Commit + push"
  cd ~/idkfree
  git add -A
  git commit -m "feat(about,card): anécdota policial protagónica + cita destacada + contexto del carnet" 2>&1 | head -2
  git push 2>&1 | tail -2
fi

echo ""
echo "════════════════════════════════════════════════════"
echo "  ✅ Anécdota integrada"
echo "════════════════════════════════════════════════════"
