import { useEffect, useRef, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Image, Share, Alert } from 'react-native';
import ViewShot, { captureRef } from 'react-native-view-shot';
import { useNavigation } from '@react-navigation/native';
import QRCode from 'react-native-qrcode-svg';
import { useTheme } from '../stores/themeStore';
import { fonts } from '../theme/fonts';
import { api } from '../api/client';
import { exportCardAsPDF, saveImageToGallery } from '../utils/cardExport';

export function CardScreen() {
  const theme = useTheme();
  const navigation = useNavigation<any>();
  const [card, setCard] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState<'png' | 'pdf' | null>(null);
  const cardRef = useRef<ViewShot>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.card.get();
        setCard(res.card);
      } catch (e) { console.log('card error', e); }
      setLoading(false);
    })();
  }, []);

  if (loading || !card) {
    return (
      <View style={{ flex: 1, backgroundColor: theme.bg, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator color={theme.text} />
      </View>
    );
  }

  const hasPhoto = !!card.avatar_url;
  const initial = (card.name ?? card.alias).charAt(0).toUpperCase();
  const timestamp = new Date().toISOString().slice(0, 16).replace('T', ' · ');

  async function exportPNG() {
    if (!cardRef.current) return;
    setExporting('png');
    try {
      const uri = await captureRef(cardRef, { format: 'png', quality: 1, result: 'tmpfile' });
      // En Expo Go no podemos guardar en galería (permisos nativos no declarados).
      // Usamos Sharing para que el usuario decida dónde guardarlo.
      const Sharing = require('expo-sharing');
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri, { mimeType: 'image/png', dialogTitle: 'Guardar carnet IDKFREE' });
      } else {
        Alert.alert('Listo', 'Imagen generada en: ' + uri);
      }
    } catch (e: any) {
      Alert.alert('Error', e?.message ?? 'No se pudo guardar la imagen');
    }
    setExporting(null);
  }

  async function exportPDF() {
    setExporting('pdf');
    try {
      await exportCardAsPDF(card);
    } catch (e: any) {
      Alert.alert('Error', e?.message ?? 'No se pudo generar el PDF');
    }
    setExporting(null);
  }

  function shareAll() {
    Share.share({
      message: `Carnet IDKFREE — @${card.alias}\nID: ${card.cardIdShort}\n\nQRs:\nPanico: ${card.qrPayloads.panic ?? 'N/A'}\nRestablecer: ${card.qrPayloads.restore ?? 'N/A'}\nFenix: ${card.qrPayloads.fenix ?? 'N/A'}`,
    });
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: theme.bg }} contentContainerStyle={{ padding: 20, paddingTop: 60, paddingBottom: 40 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.6}>
          <Text style={{ color: theme.text, fontFamily: fonts.medium, fontSize: 15 }}>← Atrás</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={shareAll} activeOpacity={0.6}>
          <Text style={{ color: theme.text, fontFamily: fonts.medium, fontSize: 13 }}>Compartir</Text>
        </TouchableOpacity>
      </View>

      <Text style={{ fontSize: 26, color: theme.text, fontFamily: fonts.displayBoldItalic, letterSpacing: 0.5, marginBottom: 20 }}>
        Tu carnet
      </Text>

      {/* ========== CARNET V3 ========== */}
      <ViewShot ref={cardRef} options={{ format: 'png', quality: 1 }} style={{ backgroundColor: '#050505' }}>
      <View style={{ backgroundColor: theme.surface, borderWidth: 1, borderColor: theme.border, borderRadius: 20, padding: 20, marginBottom: 20 }}>

        {/* Barra estado superior */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <Text style={{ color: theme.text, fontFamily: fonts.medium, fontSize: 11, letterSpacing: 1.5 }}>
            ● IDKFREE
          </Text>
          <Text style={{ color: theme.textMuted, fontFamily: fonts.medium, fontSize: 10, letterSpacing: 1 }}>
            [SYS.OK]
          </Text>
        </View>
        <View style={{ height: 1, backgroundColor: theme.border, marginBottom: 20 }} />

        {/* Marco táctico foto */}
        <View style={{ alignItems: 'center', marginBottom: 20 }}>
          <View style={{ width: 180, height: 180, position: 'relative' }}>
            {/* Esquinas tácticas */}
            <View style={{ position: 'absolute', top: 0, left: 0, width: 14, height: 14, borderTopWidth: 2, borderLeftWidth: 2, borderColor: theme.text }} />
            <View style={{ position: 'absolute', top: 0, right: 0, width: 14, height: 14, borderTopWidth: 2, borderRightWidth: 2, borderColor: theme.text }} />
            <View style={{ position: 'absolute', bottom: 0, left: 0, width: 14, height: 14, borderBottomWidth: 2, borderLeftWidth: 2, borderColor: theme.text }} />
            <View style={{ position: 'absolute', bottom: 0, right: 0, width: 14, height: 14, borderBottomWidth: 2, borderRightWidth: 2, borderColor: theme.text }} />

            {/* Indicador REC */}
            <View style={{ position: 'absolute', top: 6, right: 8, width: 6, height: 6, borderRadius: 3, backgroundColor: theme.danger, zIndex: 2 }} />

            {/* Foto o placeholder */}
            <View style={{ flex: 1, margin: 6, backgroundColor: theme.bg, borderRadius: 4, justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}>
              {hasPhoto ? (
                <Image source={{ uri: card.avatar_url }} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
              ) : (
                <View style={{ width: 90, height: 90, borderRadius: 45, backgroundColor: theme.surfaceElevated, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: theme.border }}>
                  <Text style={{ fontSize: 42, color: theme.text, fontFamily: fonts.displayBoldItalic }}>
                    {initial}
                  </Text>
                </View>
              )}
            </View>
          </View>
        </View>

        {/* Identidad */}
        <View style={{ alignItems: 'center', marginBottom: 20 }}>
          <Text style={{ color: theme.text, fontFamily: fonts.displayBold, fontSize: 20, letterSpacing: 1, textAlign: 'center', marginBottom: 4 }}>
            {(card.name ?? card.alias).toUpperCase()}
          </Text>
          <Text style={{ color: theme.text, fontFamily: fonts.medium, fontSize: 14, letterSpacing: 0.5, marginBottom: 6 }}>
            @{card.alias}
          </Text>
          <Text style={{ color: theme.textSubtle, fontFamily: fonts.regular, fontSize: 12, letterSpacing: 1.5 }}>
            {card.cardIdShort}
          </Text>
        </View>

        <View style={{ height: 1, backgroundColor: theme.border, marginBottom: 20 }} />

        {/* Tres QRs */}
        <QRSection
          theme={theme}
          index="[01]"
          title="PÁNICO"
          payload={card.qrPayloads.panic}
        />
        <QRSection
          theme={theme}
          index="[02]"
          title="RESTABLECER"
          payload={card.qrPayloads.restore}
        />
        <QRSection
          theme={theme}
          index="[03]"
          title="FÉNIX"
          payload={card.qrPayloads.fenix}
        />

        {/* Barra estado inferior */}
        <View style={{ height: 1, backgroundColor: theme.border, marginTop: 8, marginBottom: 12 }} />
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <Text style={{ color: theme.textMuted, fontFamily: fonts.regular, fontSize: 10, letterSpacing: 1 }}>
            {timestamp}
          </Text>
          <Text style={{ color: theme.success, fontFamily: fonts.medium, fontSize: 10, letterSpacing: 1 }}>
            ▓▓▓▓▓▓▓▓▓░░░ ACTIVE
          </Text>
        </View>

        <Text style={{ color: theme.textSubtle, fontFamily: fonts.medium, fontSize: 9, letterSpacing: 2, textAlign: 'center', marginTop: 8, paddingBottom: 4 }}>
          "MÁS QUE UNA PREGUNTA"
        </Text>
      </View>
      </ViewShot>

      {/* Info bloque */}
      <View style={{ padding: 16, borderRadius: 10, backgroundColor: theme.surfaceElevated, borderWidth: 1, borderColor: theme.border, marginBottom: 20 }}>
        <Text style={{ color: theme.text, fontFamily: fonts.medium, fontSize: 13, marginBottom: 6 }}>
          🛡️  Cuenta protegida
        </Text>
        <Text style={{ color: theme.textMuted, fontFamily: fonts.regular, fontSize: 12, lineHeight: 18 }}>
          Los PINs del carnet solo se muestran UNA VEZ al registrarte. Si los perdiste, no se pueden recuperar.
        </Text>
      </View>

      <TouchableOpacity
        onPress={exportPNG}
        disabled={!!exporting}
        activeOpacity={0.7}
        style={{ paddingVertical: 14, borderRadius: 8, alignItems: 'center', borderWidth: 1, borderColor: theme.border, marginBottom: 10 }}
      >
        <Text style={{ color: theme.text, fontFamily: fonts.medium, fontSize: 14 }}>
          {exporting === 'png' ? 'Guardando...' : '📷 Guardar imagen (PNG)'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={exportPDF}
        disabled={!!exporting}
        activeOpacity={0.7}
        style={{ paddingVertical: 14, borderRadius: 8, alignItems: 'center', borderWidth: 1, borderColor: theme.border, marginBottom: 10 }}
      >
        <Text style={{ color: theme.text, fontFamily: fonts.medium, fontSize: 14 }}>
          {exporting === 'pdf' ? 'Generando...' : '📄 Exportar PDF (A6 imprimible)'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={shareAll}
        activeOpacity={0.7}
        style={{ paddingVertical: 14, borderRadius: 8, alignItems: 'center', backgroundColor: theme.text }}
      >
        <Text style={{ color: theme.bg, fontFamily: fonts.medium, fontSize: 14 }}>
          Compartir carnet completo
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

function QRSection({ theme, index, title, payload }: any) {
  if (!payload) {
    return (
      <View style={{ marginBottom: 20 }}>
        <Text style={{ color: theme.textMuted, fontFamily: fonts.medium, fontSize: 11, letterSpacing: 1.5, marginBottom: 4 }}>
          {index} {title}
        </Text>
        <Text style={{ color: theme.textSubtle, fontFamily: fonts.regular, fontSize: 11 }}>
          QR no disponible (usuario anterior al cambio)
        </Text>
      </View>
    );
  }
  return (
    <View style={{ marginBottom: 20, alignItems: 'center' }}>
      <Text style={{ color: theme.text, fontFamily: fonts.medium, fontSize: 11, letterSpacing: 2, marginBottom: 8 }}>
        {index} {title}
      </Text>
      <View style={{ padding: 12, backgroundColor: '#FFFFFF', borderRadius: 8 }}>
        <QRCode value={payload} size={160} color="#050505" backgroundColor="#FFFFFF" />
      </View>
    </View>
  );
}
