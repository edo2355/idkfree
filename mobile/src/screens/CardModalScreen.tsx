import { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Switch } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { useTheme } from '../stores/themeStore';
import { fonts } from '../theme/fonts';
import { Button } from '../components/Button';

interface Props {
  qrPayloads: { panic: string; restore: string; fenix: string };
  pins: { panic: string; recovery: string; destroy: string };
  onConfirm: () => void;
}

export function CardModalScreen({ qrPayloads, pins, onConfirm }: Props) {
  const theme = useTheme();
  const [confirmed, setConfirmed] = useState(false);

  return (
    <ScrollView style={{ flex: 1, backgroundColor: theme.bg }} contentContainerStyle={styles.container}>
      <Text style={{ fontSize: 26, color: theme.text, textAlign: 'center', marginBottom: 8, fontFamily: fonts.displayBoldItalic, letterSpacing: 0.5 }}>
        Tu Carnet IDKFREE
      </Text>
      <Text style={{ color: theme.danger, textAlign: 'center', marginBottom: 24, fontFamily: fonts.medium, fontSize: 13 }}>
        ⚠️ Es OBLIGATORIO guardarlo. No lo verás de nuevo.
      </Text>

      {/* QR Pánico */}
      <QRSection
        theme={theme}
        title="[!] QR de Pánico"
        subtitle="Úsalo si te ves en peligro — bloquea todo."
        payload={qrPayloads.panic}
      />

      {/* QR Restablecer */}
      <QRSection
        theme={theme}
        title="[OPEN] QR de Restablecer"
        subtitle="Para recuperar tu cuenta si olvidas la contraseña."
        payload={qrPayloads.restore}
      />

      {/* QR Fénix */}
      <QRSection
        theme={theme}
        title="[FENIX]️ QR Fénix"
        subtitle="Borra todo permanentemente. Sin vuelta atrás."
        payload={qrPayloads.fenix}
      />

      {/* PINs del carnet */}
      <Text style={{ color: theme.text, fontFamily: fonts.medium, marginTop: 16, marginBottom: 12, textAlign: 'center', fontSize: 16 }}>
        [KEY] Tus 3 PINs del carnet
      </Text>
      <PinRow theme={theme} label="[!] Pánico" value={pins.panic} />
      <PinRow theme={theme} label="[OPEN] Restablecer" value={pins.recovery} />
      <PinRow theme={theme} label="[FENIX]️ Fénix" value={pins.destroy} />

      <View style={{ padding: 14, backgroundColor: theme.surfaceElevated, borderRadius: 10, marginTop: 20, borderWidth: 1, borderColor: theme.border }}>
        <Text style={{ color: theme.text, fontFamily: fonts.medium, fontSize: 13, marginBottom: 6 }}>
          [LOCK] Tus 3 PINs secretos
        </Text>
        <Text style={{ color: theme.textMuted, fontFamily: fonts.regular, fontSize: 12, lineHeight: 18 }}>
          Estos NO se muestran aquí. Solo tú los sabes. Guárdalos mentalmente o en un gestor de contraseñas.
        </Text>
      </View>

      <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 24, marginBottom: 16 }}>
        <Switch value={confirmed} onValueChange={setConfirmed} />
        <Text style={{ color: theme.text, marginLeft: 12, flex: 1, fontSize: 14, fontFamily: fonts.regular }}>
          He guardado mis 3 QRs, mis 3 PINs del carnet, y recuerdo mis 3 PINs secretos.
        </Text>
      </View>

      <Button size="lg" disabled={!confirmed} onPress={onConfirm}>Continuar a IDKFREE</Button>
    </ScrollView>
  );
}

function QRSection({ theme, title, subtitle, payload }: any) {
  return (
    <View style={{ marginBottom: 24 }}>
      <Text style={{ color: theme.text, fontFamily: fonts.medium, fontSize: 15, marginBottom: 4 }}>
        {title}
      </Text>
      <Text style={{ color: theme.textMuted, fontFamily: fonts.regular, fontSize: 12, marginBottom: 12 }}>
        {subtitle}
      </Text>
      <View style={{ alignItems: 'center' }}>
        <View style={{ padding: 16, backgroundColor: 'white', borderRadius: 12 }}>
          <QRCode value={payload} size={200} />
        </View>
      </View>
    </View>
  );
}

function PinRow({ theme, label, value }: { theme: any; label: string; value: string }) {
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 12, backgroundColor: theme.surface, borderRadius: 8, marginBottom: 8 }}>
      <Text style={{ color: theme.text, fontSize: 14, fontFamily: fonts.regular }}>{label}</Text>
      <View style={{ flexDirection: 'row' }}>
        {value.split('').map((d, i) => (
          <View key={i} style={{ width: 28, height: 28, backgroundColor: theme.bg, borderColor: theme.border, borderWidth: 1, borderRadius: 4, alignItems: 'center', justifyContent: 'center', marginLeft: 4 }}>
            <Text style={{ color: theme.text, fontFamily: fonts.medium }}>{d}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({ container: { padding: 24, paddingTop: 40, paddingBottom: 60 } });
