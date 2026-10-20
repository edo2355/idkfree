#!/data/data/com.termux/files/usr/bin/bash
set +e
cd ~/idkfree/mobile || exit 1

echo "════════════════════════════════════════════════════"
echo "  About con la historia real de IDKFREE"
echo "════════════════════════════════════════════════════"
echo ""

cat > src/screens/AboutScreen.tsx << 'TSX'
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../stores/themeStore';
import { fonts } from '../theme/fonts';
import { ScreenBackground } from '../components/ScreenBackground';
import { SymbolIcon } from '../components/icons/SymbolIcon';

const MONO = 'monospace';

export function AboutScreen() {
  const theme = useTheme();
  const navigation = useNavigation<any>();

  return (
    <View style={{ flex: 1, backgroundColor: theme.bg }}>
      <ScreenBackground variant="neural" opacity={0.06} />
      <ScrollView contentContainerStyle={{ padding: 20, paddingTop: 60, paddingBottom: 60 }}>
        <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.6}>
          <Text style={{ color: theme.text, fontFamily: fonts.medium, fontSize: 15 }}>← Atrás</Text>
        </TouchableOpacity>

        {/* Logo */}
        <View style={{ alignItems: 'center', marginTop: 32 }}>
          <SymbolIcon size={80} color={theme.text} />
          <Text style={{ fontSize: 42, color: theme.text, fontFamily: fonts.displayBoldItalic, letterSpacing: 1, marginTop: 12 }}>
            IDKFREE
          </Text>
          <Text style={{ color: theme.textMuted, fontFamily: fonts.medium, fontSize: 14, letterSpacing: 0.5, marginTop: 4 }}>
            No lo sé, gratis o libre
          </Text>
          <Text style={{ color: theme.accent, fontFamily: MONO, fontSize: 10, letterSpacing: 3, marginTop: 12 }}>
            v2.0.0 · 2026
          </Text>
        </View>

        {/* La historia real */}
        <View style={{ marginTop: 40 }}>
          <Text style={{ color: theme.textSubtle, fontFamily: MONO, fontSize: 10, letterSpacing: 2, marginBottom: 10 }}>
            LA HISTORIA
          </Text>
          <Text style={{ color: theme.text, fontFamily: fonts.regular, fontSize: 16, lineHeight: 26 }}>
            En 2023 me hackearon mi cuenta de Instagram.
            {'\n\n'}
            <Text style={{ color: theme.accent, fontStyle: 'italic' }}>
              "El hacker cambió mi nombre, mi email, mi número de teléfono, mi foto."
            </Text>
            {'\n\n'}
            Instagram no me la devolvió. No había forma de probar que era yo. Todos mis datos personales quedaron a favor del atacante. Perdí años de fotos, conversaciones, contactos. Y no había ningún mecanismo que dijera:
            {'\n\n'}
            <Text style={{ color: theme.text, fontFamily: fonts.medium }}>
              "Esta persona es esta persona, sin importar qué hayan cambiado los demás."
            </Text>
          </Text>
        </View>

        {/* De la espina a la idea */}
        <View style={{ marginTop: 32 }}>
          <Text style={{ color: theme.textSubtle, fontFamily: MONO, fontSize: 10, letterSpacing: 2, marginBottom: 10 }}>
            DE LA ESPINA A LA IDEA
          </Text>
          <Text style={{ color: theme.text, fontFamily: fonts.regular, fontSize: 16, lineHeight: 26 }}>
            En Cuba, además, los policías te piden el carnet de identidad todo el tiempo. Y no siempre lo tienes encima. Me puse a pensar:
            {'\n\n'}
            <Text style={{ color: theme.accent, fontStyle: 'italic' }}>
              "¿Y si tu identidad digital fuera tan sólida como un carnet que nadie puede falsificar, y tan recuperable como para que nunca se pierda una cuenta?"
            </Text>
            {'\n\n'}
            De ahí nació IDKFREE. No es una red social más. Es un sistema donde tu identidad es tuya, y aunque te hackeen, hay una llave que solo tú tienes.
          </Text>
        </View>

        {/* Qué resuelve */}
        <View style={{ marginTop: 32 }}>
          <Text style={{ color: theme.textSubtle, fontFamily: MONO, fontSize: 10, letterSpacing: 2, marginBottom: 10 }}>
            QUÉ RESUELVE
          </Text>
          <Text style={{ color: theme.text, fontFamily: fonts.regular, fontSize: 16, lineHeight: 26 }}>
            IDKFREE da a cada usuario:
          </Text>
          <View style={{ marginTop: 14, gap: 12 }}>
            {[
              ['Un carnet propio', 'Con 3 QRs de recuperación. Tu identidad no depende de un email que te pueden robar.'],
              ['Recuperación real', 'PÁNICO borra todo. RESTABLECER recupera. FÉNIX renace. Tres caminos, tú eliges.'],
              ['Identidad inmutable', 'Aunque te cambien todo, tu llave sigue siendo tuya.'],
              ['Círculo de confianza', 'Las personas que de verdad importan, con su propio modo legado.'],
              ['Voz sin intermediarios', 'Feed, vibes, historias — sin algoritmo, sin censura arbitraria.'],
            ].map(([t, d], i) => (
              <View key={i} style={{ flexDirection: 'row', gap: 12, alignItems: 'flex-start' }}>
                <Text style={{ color: theme.accent, fontFamily: MONO, fontSize: 12, letterSpacing: 1, marginTop: 3 }}>
                  {String(i + 1).padStart(2, '0')}
                </Text>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: theme.text, fontFamily: fonts.medium, fontSize: 15 }}>{t}</Text>
                  <Text style={{ color: theme.textMuted, fontFamily: fonts.regular, fontSize: 13, marginTop: 2, lineHeight: 19 }}>{d}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* El carnet */}
        <View style={{ marginTop: 32, padding: 16, borderRadius: 10, borderWidth: 1, borderColor: theme.border, backgroundColor: theme.surface }}>
          <Text style={{ color: theme.textSubtle, fontFamily: MONO, fontSize: 10, letterSpacing: 2, marginBottom: 8 }}>
            ▸ EL CARNET QUE NUNCA SE PIERDE
          </Text>
          <Text style={{ color: theme.textMuted, fontFamily: fonts.regular, fontSize: 13, lineHeight: 20 }}>
            Tu carnet IDKFREE se genera al registrarte. Tiene 3 QRs únicos e irrepetibles. Aunque te hackeen el email, el teléfono, o cualquier dato público, con esos QRs recuperas tu cuenta. No dependes de la buena voluntad de ninguna empresa. Dependes de tu propia llave.
          </Text>
        </View>

        {/* Por qué gratis */}
        <View style={{ marginTop: 32 }}>
          <Text style={{ color: theme.textSubtle, fontFamily: MONO, fontSize: 10, letterSpacing: 2, marginBottom: 10 }}>
            POR QUÉ GRATIS
          </Text>
          <Text style={{ color: theme.text, fontFamily: fonts.regular, fontSize: 16, lineHeight: 26 }}>
            No es gratis porque alguien pague con tus datos. Es gratis porque la identidad no debería ser un privilegio de quien puede pagarla. Si algún día necesitamos cobrar para sostener el servicio, te lo diremos claramente — nunca lo haremos a tus espaldas ni vendiendo tu información.
          </Text>
        </View>

        {/* Principios */}
        <View style={{ marginTop: 32 }}>
          <Text style={{ color: theme.textSubtle, fontFamily: MONO, fontSize: 10, letterSpacing: 2, marginBottom: 10 }}>
            PRINCIPIOS
          </Text>
          <View style={{ gap: 14 }}>
            {[
              'TU IDENTIDAD, TU LLAVE — nadie puede quitártela',
              'SIN PERMISO — no pedimos permiso para existir',
              'SIN CENSURA — tú decides qué dices y a quién',
              'SIN DUEÑO — ni empresa, ni gobierno, ni hacker',
              'SIEMPRE RECUPERABLE — 3 QRs que nadie más tiene',
            ].map((p, i) => (
              <View key={i} style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
                <Text style={{ color: theme.accent, fontSize: 10 }}>▸</Text>
                <Text style={{ color: theme.text, fontFamily: MONO, fontSize: 12, letterSpacing: 1, flex: 1 }}>
                  {p}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Creador */}
        <View style={{ marginTop: 40, paddingTop: 24, borderTopWidth: 1, borderTopColor: theme.border }}>
          <Text style={{ color: theme.textSubtle, fontFamily: MONO, fontSize: 10, letterSpacing: 2, marginBottom: 10 }}>
            CREADO POR
          </Text>
          <Text style={{ color: theme.text, fontFamily: fonts.displayBoldItalic, fontSize: 28, letterSpacing: 0.5 }}>
            Edo Amate
          </Text>
          <Text style={{ color: theme.textMuted, fontFamily: fonts.regular, fontSize: 14, marginTop: 6, lineHeight: 20 }}>
            Desarrollador independiente. Cuba, 2026.
          </Text>
          <Text style={{ color: theme.textMuted, fontFamily: fonts.regular, fontSize: 14, marginTop: 12, lineHeight: 22 }}>
            Hice IDKFREE porque me hackearon una cuenta y nunca la pude recuperar. Ahora construyo una plataforma donde eso no le va a pasar a nadie más. Si te sirve, la hicimos bien.
          </Text>
          <View style={{ marginTop: 20, gap: 6 }}>
            <Text style={{ color: theme.textSubtle, fontFamily: MONO, fontSize: 10, letterSpacing: 1 }}>
              · @edo_amate
            </Text>
            <Text style={{ color: theme.textSubtle, fontFamily: MONO, fontSize: 10, letterSpacing: 1 }}>
              · eduardorafaelamatevaldes@gmail.com
            </Text>
            <Text style={{ color: theme.textSubtle, fontFamily: MONO, fontSize: 10, letterSpacing: 1 }}>
              · github.com/edo2355
            </Text>
          </View>
        </View>

        {/* Footer */}
        <View style={{ marginTop: 40, alignItems: 'center' }}>
          <Text style={{ color: theme.textSubtle, fontFamily: MONO, fontSize: 10, letterSpacing: 4, textAlign: 'center' }}>
            "MÁS QUE UNA PREGUNTA"
          </Text>
          <Text style={{ color: theme.textSubtle, fontFamily: MONO, fontSize: 9, letterSpacing: 2, textAlign: 'center', marginTop: 8 }}>
            IDKFREE.OS · © 2026 EDO AMATE
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
TSX
echo "  ✅ AboutScreen reescrito con la historia real"

# Typecheck
echo ""
echo "▸ Typecheck"
npx tsc --noEmit 2>&1 | head -12
if [ ${PIPESTATUS[0]} -eq 0 ]; then
  echo "  ✅ TSC limpio"
  cd ~/idkfree
  git add -A
  git commit -m "feat(about): historia real (hack 2023 + carnet Cuba) + qué resuelve + 5 principios" 2>&1 | head -2
  git push 2>&1 | tail -2
fi

echo ""
echo "════════════════════════════════════════════════════"
echo "  ✅ About con historia real listo"
echo "════════════════════════════════════════════════════"
