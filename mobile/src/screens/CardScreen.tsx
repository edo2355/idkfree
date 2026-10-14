import { useEffect, useRef, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Image, Share, Alert } from 'react-native';
import ViewShot, { captureRef } from 'react-native-view-shot';
import { useNavigation } from '@react-navigation/native';
import QRCode from 'react-native-qrcode-svg';
import Svg, { Line, Rect, Circle, Path } from 'react-native-svg';
import { useTheme } from '../stores/themeStore';
import { useAuthStore } from '../stores/authStore';
import { fonts } from '../theme/fonts';
import { api } from '../api/client';
import { exportCardAsPDF } from '../utils/cardExport';
import { ScreenBackground } from '../components/ScreenBackground';

// Fuente monoespaciada (sistema)
const MONO = 'monospace';

// ---------- Helpers ----------
function hexFrom(str: string, len = 4): string {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) & 0xffffff;
  return h.toString(16).toUpperCase().padStart(6, '0').slice(0, len);
}

function makeBarcode(width: number, seed: string) {
  const bars: any[] = [];
  let s = 0;
  for (let i = 0; i < seed.length; i++) s = (s * 31 + seed.charCodeAt(i)) & 0xffffffff;
  const rand = () => {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    return s / 0x7fffffff;
  };
  let x = 0;
  while (x < width) {
    const w = Math.floor(rand() * 4) + 1;
    const gap = Math.floor(rand() * 3) + 1;
    bars.push({ x, w });
    x += w + gap;
  }
  return bars;
}

// ---------- Componentes internos ----------
function TechLabel({ children, color, size = 9 }: any) {
  return (
    <Text style={{ color, fontFamily: MONO, fontSize: size, letterSpacing: 1.5, textTransform: 'uppercase' }}>
      {children}
    </Text>
  );
}

function DataRow({ label, value, theme, danger }: any) {
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4, borderBottomWidth: 1, borderBottomColor: theme.border }}>
      <TechLabel color={theme.textMuted}>{label}</TechLabel>
      <Text style={{ color: danger ? theme.danger : theme.text, fontFamily: MONO, fontSize: 11, letterSpacing: 1 }}>
        {value}
      </Text>
    </View>
  );
}

function BarcodeSVG({ width, height, color, seed }: any) {
  const bars = makeBarcode(width, seed);
  return (
    <Svg width={width} height={height} style={{ marginVertical: 6 }}>
      {bars.map((b: any, i: number) => (
        <Rect key={i} x={b.x} y={0} width={b.w} height={height} fill={color} />
      ))}
    </Svg>
  );
}

function WaveformSVG({ width, height, color }: any) {
  const path = (() => {
    let d = `M 0 ${height / 2}`;
    for (let x = 0; x <= width; x += 3) {
      const y = height / 2 + Math.sin(x / 7) * (height / 3) * Math.abs(Math.sin(x / 23));
      d += ` L ${x} ${y}`;
    }
    return d;
  })();
  return (
    <Svg width={width} height={height}>
      <Path d={path} stroke={color} strokeWidth={1} fill="none" />
    </Svg>
  );
}

function HexCluster({ size, color }: any) {
  const s = size;
  const hexPath = (cx: number, cy: number, r: number) => {
    let d = '';
    for (let i = 0; i < 6; i++) {
      const a = (Math.PI / 3) * i - Math.PI / 6;
      const x = cx + r * Math.cos(a);
      const y = cy + r * Math.sin(a);
      d += (i === 0 ? 'M' : 'L') + ` ${x} ${y} `;
    }
    return d + 'Z';
  };
  return (
    <Svg width={s * 4} height={s * 2}>
      {[0, 1, 2, 3].map((i) => (
        <Path
          key={i}
          d={hexPath(s / 2 + i * (s * 0.85), s / 2, s / 2 - 1)}
          stroke={color}
          strokeWidth={1}
          fill="none"
        />
      ))}
    </Svg>
  );
}

// QR con marco técnico
function QRSection({ theme, index, title, payload, code }: any) {
  if (!payload) {
    return (
      <View style={{ marginBottom: 20 }}>
        <TechLabel color={theme.textMuted}>{index} {title}</TechLabel>
        <Text style={{ color: theme.textSubtle, fontFamily: fonts.regular, fontSize: 11, marginTop: 4 }}>
          QR no disponible
        </Text>
      </View>
    );
  }

  const isDanger = title === 'PÁNICO';

  return (
    <View style={{ marginBottom: 18 }}>
      {/* Header del QR */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: isDanger ? theme.danger : theme.accent }} />
          <TechLabel color={isDanger ? theme.danger : theme.text} size={10}>
            {index} · {title}
          </TechLabel>
        </View>
        <TechLabel color={theme.textMuted} size={8}>{code}</TechLabel>
      </View>

      {/* QR */}
      <View style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
        <View style={{
          padding: 8,
          backgroundColor: '#FFFFFF',
          borderRadius: 4,
          borderWidth: 1,
          borderColor: isDanger ? theme.danger : theme.border,
        }}>
          <QRCode value={payload} size={120} color="#050505" backgroundColor="#FFFFFF" />
        </View>
        <View style={{ flex: 1 }}>
          <TechLabel color={theme.textSubtle} size={8}>PAYLOAD</TechLabel>
          <Text
            style={{ color: theme.textMuted, fontFamily: MONO, fontSize: 8, lineHeight: 11, marginTop: 2 }}
            numberOfLines={6}
          >
            {String(payload).slice(0, 60)}…
          </Text>
          <View style={{ marginTop: 8 }}>
            <TechLabel color={theme.textSubtle} size={8}>STATUS</TechLabel>
            <Text style={{ color: theme.success, fontFamily: MONO, fontSize: 9, marginTop: 2 }}>
              ● READY
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

// ---------- Pantalla principal ----------
export function CardScreen() {
  const theme = useTheme();
  const navigation = useNavigation<any>();
  const user = useAuthStore((s) => s.user);
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
  const shortHex = hexFrom(card.cardIdShort ?? card.alias, 4);
  const fullHex = hexFrom((card.cardId ?? card.alias) + 'x', 6);
  const memberSince = (card.created_at ?? '2026-01-01').slice(0, 10).replace(/-/g, '.');
  const nodeId = `NODE-${(card.alias ?? 'user').toUpperCase().slice(0, 4)}`;
  const coords = '10.59.135.195:3000';

  // Stats (si no vienen en card, usamos defaults)
  const postsCount = card.stats?.posts ?? 7;
  const followersCount = card.stats?.followers ?? 12;
  const followingCount = card.stats?.following ?? 8;
  const level = Math.max(1, Math.floor((postsCount + followersCount) / 5));

  async function exportPNG() {
    if (!cardRef.current) return;
    setExporting('png');
    try {
      const uri = await captureRef(cardRef, { format: 'png', quality: 1, result: 'tmpfile' });
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
    <ScrollView
      style={{ flex: 1, backgroundColor: theme.bg }}
      contentContainerStyle={{ padding: 16, paddingTop: 60, paddingBottom: 40 }}
    >
      <ScreenBackground variant="hex" opacity={0.06} />

      {/* Header top */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.6}>
          <Text style={{ color: theme.text, fontFamily: fonts.medium, fontSize: 15 }}>← Atrás</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={shareAll} activeOpacity={0.6}>
          <Text style={{ color: theme.text, fontFamily: fonts.medium, fontSize: 13 }}>Compartir</Text>
        </TouchableOpacity>
      </View>

      <Text style={{ fontSize: 26, color: theme.text, fontFamily: fonts.displayBoldItalic, letterSpacing: 0.5, marginBottom: 4 }}>
        Tu carnet
      </Text>
      <Text style={{ color: theme.textMuted, fontFamily: MONO, fontSize: 10, letterSpacing: 2, marginBottom: 20 }}>
        IDKFREE.CARD · {nodeId}
      </Text>

      {/* ========== CARNET ========== */}
      <ViewShot ref={cardRef} options={{ format: 'png', quality: 1 }} style={{ backgroundColor: '#050505' }}>
        <View style={{
          backgroundColor: theme.bg,
          borderWidth: 1,
          borderColor: theme.border,
          borderRadius: 4,
          padding: 16,
          marginBottom: 20,
        }}>
          <ScreenBackground variant="hex" opacity={0.05} />

          {/* Header del carnet */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: theme.danger }} />
              <Text style={{ color: theme.text, fontFamily: MONO, fontSize: 14, letterSpacing: 4, fontWeight: '700' }}>
                IDKFREE
              </Text>
            </View>
            <TechLabel color={theme.textMuted} size={9}>{shortHex}</TechLabel>
          </View>

          {/* Barcode superior */}
          <View style={{ alignItems: 'center', marginTop: 6 }}>
            <BarcodeSVG width={260} height={12} color={theme.text} seed={card.cardId ?? card.alias} />
          </View>

          <View style={{ height: 1, backgroundColor: theme.border, marginVertical: 12 }} />

          {/* Split: Foto + Datos */}
          <View style={{ flexDirection: 'row', gap: 12 }}>
            {/* Foto con marco táctico */}
            <View style={{ position: 'relative' }}>
              {/* Esquinas */}
              <View style={{ position: 'absolute', top: -4, left: -4, width: 12, height: 12, borderTopWidth: 2, borderLeftWidth: 2, borderColor: theme.text, zIndex: 2 }} />
              <View style={{ position: 'absolute', top: -4, right: -4, width: 12, height: 12, borderTopWidth: 2, borderRightWidth: 2, borderColor: theme.text, zIndex: 2 }} />
              <View style={{ position: 'absolute', bottom: -4, left: -4, width: 12, height: 12, borderBottomWidth: 2, borderLeftWidth: 2, borderColor: theme.text, zIndex: 2 }} />
              <View style={{ position: 'absolute', bottom: -4, right: -4, width: 12, height: 12, borderBottomWidth: 2, borderRightWidth: 2, borderColor: theme.text, zIndex: 2 }} />

              {/* Foto */}
              <View style={{ width: 110, height: 130, backgroundColor: theme.surfaceElevated, borderWidth: 1, borderColor: theme.border, overflow: 'hidden', justifyContent: 'center', alignItems: 'center' }}>
                {hasPhoto ? (
                  <Image source={{ uri: card.avatar_url }} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
                ) : (
                  <Text style={{ fontSize: 48, color: theme.text, fontFamily: fonts.displayBoldItalic }}>{initial}</Text>
                )}
              </View>

              {/* ID sobre foto */}
              <View style={{ position: 'absolute', bottom: 4, left: 4, right: 4, backgroundColor: 'rgba(0,0,0,0.7)', paddingHorizontal: 4, paddingVertical: 2 }}>
                <Text style={{ color: '#FFF', fontFamily: MONO, fontSize: 8, letterSpacing: 1, textAlign: 'center' }}>
                  {card.cardIdShort ?? 'IDK-0000-0000'}
                </Text>
              </View>
            </View>

            {/* Panel de datos */}
            <View style={{ flex: 1 }}>
              <DataRow label="ALIAS" value={`@${card.alias}`} theme={theme} />
              <DataRow label="NAME" value={(card.name ?? '—').toUpperCase()} theme={theme} />
              <DataRow label="SINCE" value={memberSince} theme={theme} />
              <DataRow label="NODE" value={coords} theme={theme} />
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6, marginTop: 2 }}>
                <TechLabel color={theme.textMuted}>STATUS</TechLabel>
                <Text style={{ color: theme.success, fontFamily: MONO, fontSize: 11, letterSpacing: 1 }}>
                  ● ACTIVE
                </Text>
              </View>
            </View>
          </View>

          {/* Hex cluster + wave */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 }}>
            <HexCluster size={18} color={theme.accent} />
            <WaveformSVG width={130} height={30} color={theme.text} />
          </View>

          {/* Números grandes estilo OSHIMA */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: 14, paddingTop: 12, borderTopWidth: 1, borderTopColor: theme.border }}>
            <View style={{ alignItems: 'center' }}>
              <Text style={{ color: theme.text, fontFamily: MONO, fontSize: 22, fontWeight: '700', letterSpacing: 2 }}>{postsCount}</Text>
              <TechLabel color={theme.textMuted} size={8}>POSTS</TechLabel>
            </View>
            <View style={{ alignItems: 'center' }}>
              <Text style={{ color: theme.text, fontFamily: MONO, fontSize: 22, fontWeight: '700', letterSpacing: 2 }}>{followersCount}</Text>
              <TechLabel color={theme.textMuted} size={8}>FLWR</TechLabel>
            </View>
            <View style={{ alignItems: 'center' }}>
              <Text style={{ color: theme.text, fontFamily: MONO, fontSize: 22, fontWeight: '700', letterSpacing: 2 }}>{followingCount}</Text>
              <TechLabel color={theme.textMuted} size={8}>FLNG</TechLabel>
            </View>
            <View style={{ alignItems: 'center' }}>
              <Text style={{ color: theme.accent, fontFamily: MONO, fontSize: 22, fontWeight: '700', letterSpacing: 2 }}>{level}</Text>
              <TechLabel color={theme.textMuted} size={8}>LEVEL</TechLabel>
            </View>
          </View>

          {/* Hex completo */}
          <View style={{ alignItems: 'center', marginTop: 12 }}>
            <Text style={{ color: theme.textMuted, fontFamily: MONO, fontSize: 9, letterSpacing: 3 }}>
              #{fullHex}
            </Text>
          </View>

          {/* Divider conceptual */}
          <View style={{ height: 1, backgroundColor: theme.border, marginVertical: 14 }} />

          {/* Concepto IDKFREE */}
          <View style={{ alignItems: 'center', marginBottom: 14 }}>
            <Text style={{ color: theme.text, fontFamily: MONO, fontSize: 11, letterSpacing: 3, textAlign: 'center' }}>
              IDENTIDAD SOBERANA
            </Text>
            <Text style={{ color: theme.textMuted, fontFamily: MONO, fontSize: 9, letterSpacing: 2, marginTop: 4, textAlign: 'center' }}>
              SIN PERMISO · SIN CENSURA · SIN DUEÑO
            </Text>
            <Text style={{ color: theme.accent, fontFamily: MONO, fontSize: 9, letterSpacing: 2, marginTop: 6, textAlign: 'center' }}>
              ▓ TU IDENTIDAD, TU LLAVE ▓
            </Text>
          </View>

          {/* Divider */}
          <View style={{ height: 1, backgroundColor: theme.border, marginBottom: 14 }} />

          {/* Título QRs */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <TechLabel color={theme.text} size={11}>RECOVERY KEYS</TechLabel>
            <TechLabel color={theme.textMuted} size={8}>3/3 AVAILABLE</TechLabel>
          </View>

          {/* 3 QRs */}
          <QRSection
            theme={theme}
            index="[01]"
            title="PÁNICO"
            payload={card.qrPayloads.panic}
            code={`#${hexFrom(card.alias + '1', 4)}`}
          />
          <QRSection
            theme={theme}
            index="[02]"
            title="RESTABLECER"
            payload={card.qrPayloads.restore}
            code={`#${hexFrom(card.alias + '2', 4)}`}
          />
          <QRSection
            theme={theme}
            index="[03]"
            title="FÉNIX"
            payload={card.qrPayloads.fenix}
            code={`#${hexFrom(card.alias + '3', 4)}`}
          />

          {/* Footer técnico */}
          <View style={{ height: 1, backgroundColor: theme.border, marginTop: 4, marginBottom: 12 }} />

          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <Text style={{ color: theme.textMuted, fontFamily: MONO, fontSize: 9, letterSpacing: 1 }}>
              {timestamp}
            </Text>
            <Text style={{ color: theme.success, fontFamily: MONO, fontSize: 9, letterSpacing: 1 }}>
              ▓▓▓▓▓▓▓▓▓░░░ ACTIVE
            </Text>
          </View>

          {/* Barcode inferior */}
          <View style={{ alignItems: 'center', marginTop: 4 }}>
            <BarcodeSVG width={260} height={10} color={theme.text} seed={card.alias + 'B'} />
          </View>

          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 }}>
            <Text style={{ color: theme.textSubtle, fontFamily: MONO, fontSize: 8, letterSpacing: 2 }}>
              IDKFREE.OS v2.0.0
            </Text>
            <Text style={{ color: theme.textSubtle, fontFamily: MONO, fontSize: 8, letterSpacing: 2 }}>
              © 2026 EDO AMATE
            </Text>
          </View>

          <Text style={{ color: theme.textSubtle, fontFamily: MONO, fontSize: 8, letterSpacing: 4, textAlign: 'center', marginTop: 10 }}>
            "MÁS QUE UNA PREGUNTA"
          </Text>
        </View>
      </ViewShot>

      {/* Info bloque */}
      <View style={{ padding: 16, borderRadius: 8, backgroundColor: theme.surfaceElevated, borderWidth: 1, borderColor: theme.border, marginBottom: 20 }}>
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
