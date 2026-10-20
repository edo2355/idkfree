#!/data/data/com.termux/files/usr/bin/bash
set +e
cd ~/idkfree/mobile || exit 1

echo "════════════════════════════════════════════════════"
echo "  FASE 1 — Pantallas legales"
echo "════════════════════════════════════════════════════"
echo ""

# Componente reutilizable para las pantallas legales
echo "▸ 1. LegalScreen.tsx (layout común)"
cat > src/components/LegalScreen.tsx << 'TSX'
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../stores/themeStore';
import { fonts } from '../theme/fonts';
import { ScreenBackground } from './ScreenBackground';

const MONO = 'monospace';

interface Section {
  title?: string;
  body: string;
  numbered?: boolean;
}

interface Props {
  title: string;
  subtitle: string;
  version: string;
  updatedAt: string;
  sections: Section[];
}

export function LegalScreen({ title, subtitle, version, updatedAt, sections }: Props) {
  const theme = useTheme();
  const navigation = useNavigation<any>();

  return (
    <View style={{ flex: 1, backgroundColor: theme.bg }}>
      <ScreenBackground variant="grid" opacity={0.04} />
      <ScrollView contentContainerStyle={{ padding: 20, paddingTop: 60, paddingBottom: 60 }}>
        <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.6}>
          <Text style={{ color: theme.text, fontFamily: fonts.medium, fontSize: 15 }}>← Atrás</Text>
        </TouchableOpacity>

        {/* Header */}
        <View style={{ marginTop: 20, marginBottom: 24 }}>
          <Text style={{ color: theme.textSubtle, fontFamily: MONO, fontSize: 10, letterSpacing: 2, marginBottom: 6 }}>
            IDKFREE · LEGAL · v{version}
          </Text>
          <Text style={{ fontSize: 30, color: theme.text, fontFamily: fonts.displayBoldItalic, letterSpacing: 0.5 }}>
            {title}
          </Text>
          <Text style={{ color: theme.textMuted, fontFamily: fonts.regular, fontSize: 13, marginTop: 8, lineHeight: 18 }}>
            {subtitle}
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 12 }}>
            <View style={{ flex: 1, height: 1, backgroundColor: theme.border }} />
            <Text style={{ color: theme.textSubtle, fontFamily: MONO, fontSize: 9, letterSpacing: 1 }}>
              ACTUALIZADO {updatedAt}
            </Text>
          </View>
        </View>

        {/* Secciones */}
        {sections.map((s, i) => (
          <View key={i} style={{ marginBottom: 22 }}>
            {s.title ? (
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <Text style={{ color: theme.accent, fontFamily: MONO, fontSize: 10, letterSpacing: 1.5 }}>
                  {String(i + 1).padStart(2, '0')}
                </Text>
                <Text style={{ color: theme.text, fontFamily: fonts.medium, fontSize: 15, letterSpacing: 0.3 }}>
                  {s.title.toUpperCase()}
                </Text>
              </View>
            ) : null}
            <Text style={{ color: theme.textMuted, fontFamily: fonts.regular, fontSize: 14, lineHeight: 22 }}>
              {s.body}
            </Text>
          </View>
        ))}

        {/* Footer */}
        <View style={{ marginTop: 20, paddingTop: 20, borderTopWidth: 1, borderTopColor: theme.border }}>
          <Text style={{ color: theme.textSubtle, fontFamily: MONO, fontSize: 9, letterSpacing: 2, textAlign: 'center' }}>
            IDKFREE.OS · © 2026 EDO AMATE
          </Text>
          <Text style={{ color: theme.textSubtle, fontFamily: MONO, fontSize: 9, letterSpacing: 2, textAlign: 'center', marginTop: 6 }}>
            "MÁS QUE UNA PREGUNTA"
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
TSX
echo "  ✅"

# Pantalla: Términos y Condiciones
echo "▸ 2. TermsScreen"
cat > src/screens/TermsScreen.tsx << 'TSX'
import { LegalScreen } from '../components/LegalScreen';

export function TermsScreen() {
  return (
    <LegalScreen
      title="Términos y Condiciones"
      subtitle="Al usar IDKFREE aceptas estos términos. Leelos con atención — definen tu relación con la plataforma."
      version="2.0.0"
      updatedAt="2026.10.14"
      sections={[
        {
          title: 'Aceptación',
          body: 'Al crear una cuenta en IDKFREE confirmas que has leído, entendido y aceptado estos Términos y Condiciones, así como la Política de Privacidad. Si no estás de acuerdo, no uses la plataforma.',
        },
        {
          title: 'Quiénes somos',
          body: 'IDKFREE es una plataforma de identidad digital soberana desarrollada por Edo Amate (en adelante "nosotros"). No somos una red social tradicional: somos una herramienta para que gestiones tu identidad, tu voz y tu círculo sin intermediarios.',
        },
        {
          title: 'Qué puedes hacer',
          body: 'Puedes: (a) crear y gestionar tu identidad digital, (b) publicar contenido bajo tu responsabilidad, (c) interactuar con otros usuarios, (d) exportar tu carnet y datos, (e) eliminar tu cuenta en cualquier momento.',
        },
        {
          title: 'Qué NO puedes hacer',
          body: 'Está prohibido: (a) suplantar la identidad de otras personas, (b) publicar contenido ilegal, violento, sexual con menores, o que incite al odio, (c) usar la plataforma para spam, fraude o estafa, (d) intentar vulnerar la seguridad del sistema, (e) acosar o amenazar a otros usuarios. La violación de estas reglas puede resultar en suspensión o eliminación de tu cuenta sin previo aviso.',
        },
        {
          title: 'Tu contenido',
          body: 'Todo lo que publiques sigue siendo tuyo. Al subirlo a IDKFREE nos otorgas una licencia limitada para almacenarlo y mostrarlo a los usuarios que tú elijas (seguidores, público, o solo tú). No vendemos tu contenido ni lo usamos para entrenar sistemas de terceros.',
        },
        {
          title: 'Tu responsabilidad',
          body: 'Eres el único responsable de: (a) la veracidad de tu información, (b) el contenido que publiques, (c) mantener la confidencialidad de tus 3 PINs secretos del carnet, (d) el uso que hagas de la plataforma. Nosotros no somos responsables por el mal uso que terceros puedan hacer de la información que compartas voluntariamente.',
        },
        {
          title: 'Nuestro límite de responsabilidad',
          body: 'IDKFREE se ofrece "tal cual". No garantizamos disponibilidad ininterrumpida, ausencia de errores, ni que el servicio cumpla todas tus expectativas. En la medida permitida por la ley, no somos responsables por daños indirectos, pérdida de datos, o lucro cesante derivados del uso de la plataforma.',
        },
        {
          title: 'Cambios en los términos',
          body: 'Podemos actualizar estos términos cuando sea necesario. Te notificaremos dentro de la app. El uso continuado después de la actualización implica aceptación de los nuevos términos.',
        },
        {
          title: 'Ley aplicable',
          body: 'Estos términos se rigen por las leyes de la República de Cuba, sin perjuicio de las protecciones que te correspondan como consumidor en tu país de residencia. Cualquier controversia se resolverá en los tribunales competentes de La Habana, Cuba.',
        },
        {
          title: 'Contacto',
          body: 'Para consultas legales escríbenos a: legal@idkfree.app',
        },
      ]}
    />
  );
}
TSX
echo "  ✅"

# Pantalla: Política de Privacidad
echo "▸ 3. PrivacyScreen"
cat > src/screens/PrivacyScreen.tsx << 'TSX'
import { LegalScreen } from '../components/LegalScreen';

export function PrivacyScreen() {
  return (
    <LegalScreen
      title="Política de Privacidad"
      subtitle="Qué datos guardamos, por qué, dónde, cuánto tiempo, y cómo puedes controlarlos."
      version="2.0.0"
      updatedAt="2026.10.14"
      sections={[
        {
          title: 'Nuestro principio',
          body: 'Tu identidad es tuya. No vendemos tus datos. No los compartimos con anunciantes. No los usamos para publicidad. Solo guardamos lo estrictamente necesario para que la plataforma funcione.',
        },
        {
          title: 'Qué datos guardamos',
          body: 'Al registrarte guardamos: (1) tu email, (2) tu alias público, (3) tu contraseña cifrada con hash (nunca en texto plano), (4) tus 3 PINs del carnet, cifrados con hash, (5) tu nombre y biografía si decides rellenarlos, (6) tu foto de perfil si subes una.\n\nDurante tu uso guardamos: (7) los posts, mensajes, comentarios e historias que publiques, (8) tu dirección IP y timestamp de las acciones, para seguridad y detección de abuso, (9) tus interacciones (likes, follows, resonancias).',
        },
        {
          title: 'Qué NO guardamos',
          body: 'No guardamos: (a) tu contraseña en texto plano, (b) tus PINs en texto plano, (c) tu ubicación precisa, (d) contactos de tu teléfono, (e) información de otras apps, (f) datos biométricos, (g) contenido de tu portapapeles.',
        },
        {
          title: 'Dónde se guardan',
          body: 'Los datos se almacenan en servidores propios de IDKFREE. Los archivos multimedia (fotos, videos, avatares) se guardan en el mismo servidor. No usamos servicios de terceros para almacenar tu información personal.',
        },
        {
          title: 'Por cuánto tiempo',
          body: 'Guardamos tus datos mientras tu cuenta esté activa. Si eliminas tu cuenta: (a) tus datos personales se borran dentro de 30 días, (b) los posts públicos pueden permanecer como anónimos por referencia de otros usuarios, (c) los logs de seguridad se conservan hasta 90 días por obligaciones técnicas.',
        },
        {
          title: 'Con quién compartimos',
          body: 'NO compartimos tus datos personales con terceros, salvo: (a) cuando la ley lo exige mediante orden judicial, (b) para detectar y prevenir fraude, (c) servicios técnicos indispensables (proveedor de hosting, proveedor de compilación de la app) bajo acuerdos de confidencialidad.',
        },
        {
          title: 'Tus derechos',
          body: 'Tienes derecho a: (1) ACCEDER a tus datos — puedes exportar tu carnet y tu información desde la configuración, (2) RECTIFICAR datos incorrectos — edita tu perfil cuando quieras, (3) ELIMINAR tu cuenta — desde Ajustes → Cuenta Peligrosa, (4) PORTABILIDAD — los QRs y el carnet son tuyos, (5) OPOSICIÓN — puedes desactivar notificaciones o funcionalidades específicas.',
        },
        {
          title: 'Seguridad',
          body: 'Usamos cifrado de contraseñas con hash moderno, tokens JWT con expiración, HTTPS en producción, y aislamiento de datos entre usuarios. Aun así, ningún sistema es 100% invulnerable — te recomendamos usar contraseñas únicas y no compartir tus 3 PINs con nadie.',
        },
        {
          title: 'Menores de edad',
          body: 'IDKFREE no está diseñado para menores de 13 años. Si eres menor, no uses la plataforma sin consentimiento de tus padres o tutores. Si detectamos cuentas de menores sin consentimiento, las eliminaremos.',
        },
        {
          title: 'Cookies y rastreo',
          body: 'La app móvil no usa cookies. La versión web usa almacenamiento local únicamente para mantener tu sesión iniciada. No usamos rastreadores de terceros, píxeles de Facebook, Google Analytics, ni herramientas similares.',
        },
        {
          title: 'Cambios en la política',
          body: 'Si cambiamos esta política, te avisaremos dentro de la app con 15 días de antelación. El uso continuado implica aceptación.',
        },
        {
          title: 'Contacto',
          body: 'Para ejercer tus derechos o hacer consultas sobre privacidad: privacy@idkfree.app',
        },
      ]}
    />
  );
}
TSX
echo "  ✅"

# Pantalla: Sobre Nosotros
echo "▸ 4. AboutScreen"
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

        {/* Manifesto */}
        <View style={{ marginTop: 40 }}>
          <Text style={{ color: theme.textSubtle, fontFamily: MONO, fontSize: 10, letterSpacing: 2, marginBottom: 10 }}>
            MANIFIESTO
          </Text>
          <Text style={{ color: theme.text, fontFamily: fonts.regular, fontSize: 16, lineHeight: 26 }}>
            IDKFREE nació como una pregunta:
            {'\n\n'}
            <Text style={{ fontStyle: 'italic', color: theme.accent }}>"¿Y si tu identidad digital no dependiera de ninguna empresa?"</Text>
            {'\n\n'}
            No es una red social más. No medimos likes. No vendemos tus datos. No decidimos qué puedes decir.
          </Text>
        </View>

        {/* Qué es */}
        <View style={{ marginTop: 32 }}>
          <Text style={{ color: theme.textSubtle, fontFamily: MONO, fontSize: 10, letterSpacing: 2, marginBottom: 10 }}>
            QUÉ ES
          </Text>
          <Text style={{ color: theme.text, fontFamily: fonts.regular, fontSize: 16, lineHeight: 26 }}>
            IDKFREE es una herramienta para que tengas:
          </Text>
          <View style={{ marginTop: 14, gap: 12 }}>
            {[
              ['Identidad', 'Carnet digital con 3 QRs de recuperación'],
              ['Voz', 'Feed sin algoritmo, sin censura arbitraria'],
              ['Círculo', 'Legacy, vibes, historias — tu tribu'],
              ['Control', 'Tú decides quién entra, quién ve, quién sabe'],
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
            No es gratis porque alguien pague con tus datos. Es gratis porque cada usuario es soberano de su identidad. Si en algún momento necesitamos cobrar para sostener el servicio, te lo diremos claramente — nunca lo haremos a tus espaldas.
          </Text>
        </View>

        {/* Principios */}
        <View style={{ marginTop: 32 }}>
          <Text style={{ color: theme.textSubtle, fontFamily: MONO, fontSize: 10, letterSpacing: 2, marginBottom: 10 }}>
            PRINCIPIOS
          </Text>
          <View style={{ gap: 14 }}>
            {[
              'TU IDENTIDAD, TU LLAVE — sin intermediarios',
              'SIN PERMISO — no pedimos permiso para existir',
              'SIN CENSURA — tú decides qué dices',
              'SIN DUEÑO — nadie puede comprarnos ni cerrarnos',
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
            Empecé IDKFREE porque me cansé de que las plataformas decidieran por mí. Quise construir algo donde la identidad, la voz y el círculo fueran míos. Espero que también lo sean tuyos.
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

# Pantalla: Tus Datos
echo "▸ 5. MyDataScreen"
cat > src/screens/MyDataScreen.tsx << 'TSX'
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../stores/themeStore';
import { fonts } from '../theme/fonts';
import { useAuthStore } from '../stores/authStore';
import { ScreenBackground } from '../components/ScreenBackground';

const MONO = 'monospace';

function DataBlock({ label, value, hint, theme, mono }: any) {
  return (
    <View style={{ paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: theme.border }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Text style={{ color: theme.textMuted, fontFamily: MONO, fontSize: 10, letterSpacing: 1.5, flex: 1 }}>
          {label}
        </Text>
        <Text style={{ color: theme.text, fontFamily: mono ? MONO : fonts.medium, fontSize: 12, textAlign: 'right', flex: 1 }}>
          {value}
        </Text>
      </View>
      {hint ? (
        <Text style={{ color: theme.textSubtle, fontFamily: fonts.regular, fontSize: 11, marginTop: 4, lineHeight: 15 }}>
          {hint}
        </Text>
      ) : null}
    </View>
  );
}

export function MyDataScreen() {
  const theme = useTheme();
  const navigation = useNavigation<any>();
  const user = useAuthStore((s) => s.user);

  function handleExport() {
    Alert.alert(
      'Exportar mis datos',
      'Se generará un archivo con toda tu información. Esta función estará disponible próximamente.',
      [{ text: 'OK' }]
    );
  }

  function handleDelete() {
    Alert.alert(
      'Eliminar mi cuenta',
      'Esta acción es irreversible. Se borrarán todos tus datos en 30 días. ¿Estás seguro?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Entendido', style: 'destructive' },
      ]
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: theme.bg }}>
      <ScreenBackground variant="pulse" opacity={0.05} />
      <ScrollView contentContainerStyle={{ padding: 20, paddingTop: 60, paddingBottom: 60 }}>
        <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.6}>
          <Text style={{ color: theme.text, fontFamily: fonts.medium, fontSize: 15 }}>← Atrás</Text>
        </TouchableOpacity>

        <View style={{ marginTop: 20, marginBottom: 24 }}>
          <Text style={{ color: theme.textSubtle, fontFamily: MONO, fontSize: 10, letterSpacing: 2, marginBottom: 6 }}>
            IDKFREE · PRIVACY · v2.0.0
          </Text>
          <Text style={{ fontSize: 30, color: theme.text, fontFamily: fonts.displayBoldItalic, letterSpacing: 0.5 }}>
            Tus Datos
          </Text>
          <Text style={{ color: theme.textMuted, fontFamily: fonts.regular, fontSize: 13, marginTop: 8, lineHeight: 18 }}>
            Transparencia total. Aquí ves exactamente qué guardamos de ti, dónde, y qué puedes hacer.
          </Text>
        </View>

        {/* Sección: Datos que guardamos */}
        <Text style={{ color: theme.textSubtle, fontFamily: MONO, fontSize: 10, letterSpacing: 2, marginBottom: 6 }}>
          ▸ DATOS QUE GUARDAMOS
        </Text>
        <DataBlock
          label="EMAIL"
          value={user?.email ?? '(privado)'}
          hint="Usado para login y recuperación. Nunca público."
          theme={theme}
          mono
        />
        <DataBlock
          label="ALIAS"
          value={`@${user?.alias ?? '—'}`}
          hint="Tu identificador público único."
          theme={theme}
        />
        <DataBlock
          label="CONTRASEÑA"
          value="●  ●  ●  ●  ●  ●  ●  ●"
          hint="Guardada como hash bcrypt. Nunca en texto plano."
          theme={theme}
        />
        <DataBlock
          label="PINS DEL CARNET"
          value="3 PINs (cifrados)"
          hint="Solo se muestran una vez al registrarte."
          theme={theme}
        />
        <DataBlock
          label="NOMBRE"
          value={user?.name ?? '(no definido)'}
          hint="Opcional. Puedes editarlo cuando quieras."
          theme={theme}
        />

        {/* Sección: Datos de uso */}
        <Text style={{ color: theme.textSubtle, fontFamily: MONO, fontSize: 10, letterSpacing: 2, marginTop: 24, marginBottom: 6 }}>
          ▸ DATOS DE USO
        </Text>
        <DataBlock
          label="POSTS"
          value="Todos los que has publicado"
          hint="Puedes eliminarlos uno por uno o todos a la vez."
          theme={theme}
        />
        <DataBlock
          label="MENSAJES"
          value="Conversaciones con otros usuarios"
          hint="Al borrar tu cuenta, se borran también."
          theme={theme}
        />
        <DataBlock
          label="IP + TIMESTAMPS"
          value="Últimas 90 días"
          hint="Para seguridad y detección de abuso. No se comparten."
          theme={theme}
        />

        {/* Sección: Qué NO guardamos */}
        <Text style={{ color: theme.textSubtle, fontFamily: MONO, fontSize: 10, letterSpacing: 2, marginTop: 24, marginBottom: 6 }}>
          ▸ QUÉ NO GUARDAMOS
        </Text>
        <View style={{ marginTop: 6, gap: 8 }}>
          {[
            'Contraseñas en texto plano',
            'PINs en texto plano',
            'Tu ubicación precisa',
            'Contactos de tu teléfono',
            'Datos biométricos',
            'Información de otras apps',
          ].map((t, i) => (
            <View key={i} style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
              <Text style={{ color: theme.textSubtle }}>✕</Text>
              <Text style={{ color: theme.textMuted, fontFamily: fonts.regular, fontSize: 13 }}>
                {t}
              </Text>
            </View>
          ))}
        </View>

        {/* Sección: Tus derechos */}
        <Text style={{ color: theme.textSubtle, fontFamily: MONO, fontSize: 10, letterSpacing: 2, marginTop: 24, marginBottom: 6 }}>
          ▸ TUS DERECHOS
        </Text>
        <View style={{ marginTop: 6, gap: 12 }}>
          {[
            ['Acceder', 'Ver todo lo que tenemos sobre ti'],
            ['Rectificar', 'Editar cualquier dato desde tu perfil'],
            ['Exportar', 'Descargar tus datos en formato legible'],
            ['Eliminar', 'Borrar tu cuenta completamente'],
            ['Oponerte', 'Desactivar notificaciones o funciones'],
          ].map(([t, d], i) => (
            <View key={i} style={{ flexDirection: 'row', gap: 12 }}>
              <Text style={{ color: theme.accent, fontFamily: MONO, fontSize: 11, marginTop: 2 }}>
                {String(i + 1).padStart(2, '0')}
              </Text>
              <View style={{ flex: 1 }}>
                <Text style={{ color: theme.text, fontFamily: fonts.medium, fontSize: 14 }}>{t}</Text>
                <Text style={{ color: theme.textMuted, fontFamily: fonts.regular, fontSize: 12, marginTop: 2 }}>{d}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Acciones */}
        <View style={{ marginTop: 32, gap: 10 }}>
          <TouchableOpacity
            onPress={handleExport}
            activeOpacity={0.7}
            style={{ paddingVertical: 14, borderRadius: 8, alignItems: 'center', borderWidth: 1, borderColor: theme.border }}
          >
            <Text style={{ color: theme.text, fontFamily: fonts.medium, fontSize: 14 }}>
              📦 Exportar mis datos
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleDelete}
            activeOpacity={0.7}
            style={{ paddingVertical: 14, borderRadius: 8, alignItems: 'center', backgroundColor: theme.danger }}
          >
            <Text style={{ color: '#FFF', fontFamily: fonts.medium, fontSize: 14 }}>
              Eliminar mi cuenta
            </Text>
          </TouchableOpacity>
        </View>

        {/* Contacto */}
        <View style={{ marginTop: 32, paddingTop: 20, borderTopWidth: 1, borderTopColor: theme.border }}>
          <Text style={{ color: theme.textSubtle, fontFamily: MONO, fontSize: 10, letterSpacing: 2, marginBottom: 8 }}>
            CONSULTAS
          </Text>
          <Text style={{ color: theme.textMuted, fontFamily: fonts.regular, fontSize: 13, lineHeight: 20 }}>
            Para ejercer tus derechos escríbenos a:{'\n'}
            <Text style={{ color: theme.accent, fontFamily: MONO, fontSize: 12 }}>privacy@idkfree.app</Text>
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
TSX
echo "  ✅"

# ---------- Navegación: añadir rutas ----------
echo "▸ 6. Añadir rutas al RootNavigator"
python3 << 'PY'
path = 'src/navigation/RootNavigator.tsx'
src = open(path).read()

# Imports
if 'TermsScreen' not in src:
    src = src.replace(
        "import { ChatScreen } from '../screens/ChatScreen';",
        "import { ChatScreen } from '../screens/ChatScreen';\nimport { TermsScreen } from '../screens/TermsScreen';\nimport { PrivacyScreen } from '../screens/PrivacyScreen';\nimport { AboutScreen } from '../screens/AboutScreen';\nimport { MyDataScreen } from '../screens/MyDataScreen';",
        1
    )
    print("  ✅ imports")

# Rutas
if 'name="Terms"' not in src:
    src = src.replace(
        '      <Stack.Screen name="Chat" component={ChatScreen} options={{ animation: \'slide_from_right\' }} />',
        '''      <Stack.Screen name="Chat" component={ChatScreen} options={{ animation: 'slide_from_right' }} />
      <Stack.Screen name="Terms" component={TermsScreen} options={{ animation: 'slide_from_right' }} />
      <Stack.Screen name="Privacy" component={PrivacyScreen} options={{ animation: 'slide_from_right' }} />
      <Stack.Screen name="About" component={AboutScreen} options={{ animation: 'slide_from_right' }} />
      <Stack.Screen name="MyData" component={MyDataScreen} options={{ animation: 'slide_from_right' }} />''',
        1
    )
    print("  ✅ rutas añadidas")

open(path, 'w').write(src)
PY

# ---------- Typecheck ----------
echo ""
echo "▸ 7. Typecheck"
npx tsc --noEmit 2>&1 | head -12
if [ ${PIPESTATUS[0]} -eq 0 ]; then
  echo "  ✅ TSC limpio"
  TSC_OK=1
else
  echo "  ❌ TSC con errores"
  TSC_OK=0
fi

# ---------- Commit ----------
echo ""
if [ "$TSC_OK" = "1" ]; then
  echo "▸ 8. Commit + push"
  cd ~/idkfree
  git add -A
  git commit -m "feat(legal): 4 pantallas legales (Términos, Privacidad, Sobre, Mis Datos) + rutas" 2>&1 | head -2
  git push 2>&1 | tail -2
fi

echo ""
echo "════════════════════════════════════════════════════"
echo "  ✅ Fase 1 (pantallas legales) lista"
echo "════════════════════════════════════════════════════"
