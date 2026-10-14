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
