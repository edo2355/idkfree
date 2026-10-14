#!/data/data/com.termux/files/usr/bin/bash
set +e
cd ~/idkfree/mobile || exit 1

echo "════════════════════════════════════════════════════"
echo "  About moderado — centrado en la app"
echo "════════════════════════════════════════════════════"
echo ""

# ---------- AboutScreen moderado ----------
echo "▸ Reescribiendo AboutScreen centrado en la app"
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

        {/* El origen */}
        <View style={{ marginTop: 40 }}>
          <Text style={{ color: theme.textSubtle, fontFamily: MONO, fontSize: 10, letterSpacing: 2, marginBottom: 10 }}>
            EL ORIGEN
          </Text>
          <Text style={{ color: theme.text, fontFamily: fonts.regular, fontSize: 16, lineHeight: 26 }}>
            En 2023 me hackearon una cuenta personal y nunca pude recuperarla.
            {'\n\n'}
            Cambiaron mi nombre, mi email, mi número de teléfono y mi foto. Yo era la misma persona, pero no tenía cómo demostrarlo. Ningún mecanismo de recuperación me devolvió la cuenta.
          </Text>
          <Text style={{ color: theme.text, fontFamily: fonts.regular, fontSize: 16, lineHeight: 26, marginTop: 14 }}>
            De ahí nació una pregunta simple: ¿y si existiera una plataforma donde tu identidad no pueda ser robada, porque la llave solo la tienes tú?
          </Text>
        </View>

        {/* Qué es IDKFREE */}
        <View style={{ marginTop: 32 }}>
          <Text style={{ color: theme.textSubtle, fontFamily: MONO, fontSize: 10, letterSpacing: 2, marginBottom: 10 }}>
            QUÉ ES IDKFREE
          </Text>
          <Text style={{ color: theme.text, fontFamily: fonts.regular, fontSize: 16, lineHeight: 26 }}>
            IDKFREE es una plataforma donde tu cuenta no se puede perder. No es una red social más, no es un clon de otra cosa. Es una app con su propio sistema de identidad digital, donde:
            {'\n\n'}
            · Tú controlas quién eres y quién te ve.
            {'\n\n'}
            · Tu cuenta se puede recuperar aunque te roben el email o el teléfono.
            {'\n\n'}
            · Nadie decide por ti qué dices, a quién sigues, o cómo usas la app.
          </Text>
        </View>

        {/* Qué incluye */}
        <View style={{ marginTop: 32 }}>
          <Text style={{ color: theme.textSubtle, fontFamily: MONO, fontSize: 10, letterSpacing: 2, marginBottom: 10 }}>
            QUÉ INCLUYE
          </Text>
          <View style={{ marginTop: 6, gap: 14 }}>
            {[
              ['Carnet digital', 'Tu identidad dentro de la app, con 3 QRs únicos que solo tú tienes.'],
              ['Recuperación real', 'PÁNICO · RESTABLECER · FÉNIX. Tres caminos por si te hackean o pierdes el acceso.'],
              ['Feed sin algoritmo', 'Publicaciones, historias, vibes. Sin publicidad, sin promociones pagas.'],
              ['Círculo de confianza', 'Solo tus amigos cercanos. Nadie más entra sin tu permiso.'],
              ['Mensajes directos', 'Chat con las personas que te importan.'],
              ['Modo legado', 'Contenido que se puede compartir cuando tú ya no estés.'],
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

        {/* Por qué gratis */}
        <View style={{ marginTop: 32 }}>
          <Text style={{ color: theme.textSubtle, fontFamily: MONO, fontSize: 10, letterSpacing: 2, marginBottom: 10 }}>
            POR QUÉ GRATIS
          </Text>
          <Text style={{ color: theme.text, fontFamily: fonts.regular, fontSize: 16, lineHeight: 26 }}>
            No es gratis porque alguien pague con tus datos. Es gratis porque la privacidad y el control sobre tu propia identidad no deberían ser un privilegio de quien puede pagar. Si algún día necesitamos cobrar para sostener el servicio, te lo diremos claramente — nunca vendiendo tu información.
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
              'SIEMPRE RECUPERABLE — tu cuenta nunca se pierde',
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
            Hice IDKFREE porque me hackearon una cuenta y nunca la pude recuperar. Ahora construyo una plataforma donde eso no le va a pasar a nadie más.
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
echo "  ✅"

# Typecheck
echo ""
echo "▸ Typecheck"
npx tsc --noEmit 2>&1 | head -10
if [ ${PIPESTATUS[0]} -eq 0 ]; then
  echo "  ✅ TSC limpio"
  cd ~/idkfree
  git add -A
  git commit -m "refactor(about): moderar narrativa — centrado en la app (identidad, recuperación, features) sin anécdota policial" 2>&1 | head -2
  git push 2>&1 | tail -2
fi

echo ""
echo "════════════════════════════════════════════════════"
echo "  ✅ About moderado"
echo "════════════════════════════════════════════════════"
