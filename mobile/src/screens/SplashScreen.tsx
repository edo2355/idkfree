// ============================================================
// SplashScreen.tsx — Boot sequence IDKFREE
// Cyber-brutalist: terminal + progress bar + indicador ready
// ============================================================
import { useEffect, useState } from 'react';
import { View, Text, Image, useWindowDimensions } from 'react-native';
import { darkTheme } from '../theme/dark';
import { fonts } from '../theme/fonts';
import { ScreenBackground } from '../components/ScreenBackground';
import { CarnetTicketsBackground } from '../components/CarnetTicketsBackground';

const TIPS = [
  'No lo sé, gratis o libre',
  'Aquí no tienes que saberlo todo',
  'Sin algoritmo, sin presión',
  'Tu cuenta, siempre tuya',
  'Personas reales, ideas reales',
  'More than a question',
  'Un lugar para pensar en voz alta',
  'Menos ruido, más sentido',
];

const BOOT_STEPS = [
  { at: 0,  txt: 'BOOTING IDKFREE OS v2.0.0' },
  { at: 15, txt: 'VERIFYING IDENTITY' },
  { at: 30, txt: 'LOADING ALDEA v1' },
  { at: 50, txt: 'SYNCING CARNET' },
  { at: 68, txt: 'DECRYPTING QRs' },
  { at: 90, txt: 'FINALIZING' },
];

const LOAD_MS = 4800;   // duración de la barra hasta llegar a 100%
const READY_MS = 1200;  // tiempo que se queda en READY antes de pasar

interface Props {
  onFinish: () => void;
}

export function SplashScreen({ onFinish }: Props) {
  const { width: SW } = useWindowDimensions();
  const [progress, setProgress] = useState(0);
  const [finished, setFinished] = useState(false);
  const [dotGreen, setDotGreen] = useState(false);
  const [tip, setTip] = useState(TIPS[0]);

  // Rotar tips
  useEffect(() => {
    setTip(TIPS[Math.floor(Math.random() * TIPS.length)]);
    const tipInterval = setInterval(() => {
      setTip(TIPS[Math.floor(Math.random() * TIPS.length)]);
    }, 1500);
    return () => clearInterval(tipInterval);
  }, []);

  // Progreso hasta 100%
  useEffect(() => {
    const tickMs = 50;
    const totalTicks = LOAD_MS / tickMs;
    let tick = 0;
    const progressInterval = setInterval(() => {
      tick++;
      const p = Math.min(100, Math.round((tick / totalTicks) * 100));
      setProgress(p);
      if (p >= 100) {
        clearInterval(progressInterval);
        setFinished(true);
      }
    }, tickMs);
    return () => clearInterval(progressInterval);
  }, []);

  // Secuencia final: punto azul → verde → onFinish
  useEffect(() => {
    if (!finished) return;
    const t1 = setTimeout(() => setDotGreen(true), 400);
    const t2 = setTimeout(() => onFinish(), 400 + READY_MS);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [finished, onFinish]);

  const visibleSteps = BOOT_STEPS.filter(s => progress >= s.at);
  const totalBlocks = 28;
  const filled = Math.round((progress / 100) * totalBlocks);
  const bar = '█'.repeat(filled) + '░'.repeat(totalBlocks - filled);
  const panelW = Math.min(SW - 48, 380);
  const dotColor = dotGreen ? '#22C55E' : '#3B82F6';

  return (
    <View style={{ flex: 1, backgroundColor: darkTheme.bg, alignItems: 'center', justifyContent: 'center', padding: 24 }}>

      <ScreenBackground variant="particles" />
      <CarnetTicketsBackground />

      {/* Logo + título */}
      <Image
        source={require('../../assets/icon.png')}
        style={{ width: 84, height: 84, marginBottom: 12 }}
        resizeMode="contain"
      />
      <Text
        style={{
          fontSize: 30,
          fontFamily: fonts.displayBoldItalic,
          color: darkTheme.text,
          letterSpacing: 1.5,
          marginBottom: 6,
        }}
      >
        IDKFREE
      </Text>
      <Text
        style={{
          fontSize: 10,
          fontFamily: 'monospace',
          color: darkTheme.textSubtle,
          letterSpacing: 3,
          marginBottom: 28,
        }}
      >
        [ SYSTEM BOOT · v2.0.0 ]
      </Text>

      {/* Panel de boot */}
      <View
        style={{
          width: panelW,
          borderWidth: 1,
          borderColor: finished ? '#22C55E' : darkTheme.border,
          backgroundColor: 'rgba(15,15,15,0.85)',
          padding: 16,
          marginBottom: 20,
        }}
      >
        {/* Steps */}
        <View style={{ minHeight: BOOT_STEPS.length * 18 }}>
          {visibleSteps.map((s, i) => (
            <View key={i} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 2 }}>
              <Text style={{ fontSize: 10, fontFamily: 'monospace', color: darkTheme.textSubtle, marginRight: 6 }}>&gt;</Text>
              <Text style={{ fontSize: 10, fontFamily: 'monospace', color: darkTheme.text, letterSpacing: 0.5, flex: 1 }}>{s.txt}</Text>
              <Text style={{ fontSize: 10, fontFamily: 'monospace', color: '#22C55E', letterSpacing: 1 }}>[OK]</Text>
            </View>
          ))}
        </View>

        {/* Barra */}
        <View style={{ marginTop: 12 }}>
          <Text
            style={{
              fontSize: 12,
              fontFamily: 'monospace',
              color: finished ? '#22C55E' : darkTheme.text,
              letterSpacing: 0.5,
              marginBottom: 6,
            }}
          >
            {bar}
          </Text>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={{ fontSize: 9, fontFamily: 'monospace', color: darkTheme.textSubtle, letterSpacing: 2 }}>
              {finished ? 'COMPLETE' : 'LOADING'}
            </Text>

            {/* Indicador ready */}
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <View
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: dotColor,
                  shadowColor: dotColor,
                  shadowOpacity: 0.9,
                  shadowRadius: 6,
                  shadowOffset: { width: 0, height: 0 },
                  elevation: 4,
                }}
              />
              <Text
                style={{
                  fontSize: 9,
                  fontFamily: 'monospace',
                  color: dotGreen ? '#22C55E' : (finished ? '#3B82F6' : darkTheme.text),
                  letterSpacing: 2,
                }}
              >
                {String(progress).padStart(3, ' ')}%
              </Text>
            </View>
          </View>
        </View>

        {/* Mensaje SYSTEM READY al 100% */}
        {finished && (
          <View style={{ marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: '#22C55E' }}>
            <Text
              style={{
                fontSize: 11,
                fontFamily: 'monospace',
                color: '#22C55E',
                letterSpacing: 3,
                textAlign: 'center',
                fontWeight: '700',
              }}
            >
              ✓ SYSTEM READY
            </Text>
          </View>
        )}
      </View>

      {/* Tip */}
      <Text
        style={{
          fontSize: 12,
          fontFamily: fonts.medium,
          color: darkTheme.textMuted,
          letterSpacing: 0.5,
          textAlign: 'center',
          paddingHorizontal: 24,
        }}
      >
        {tip}
      </Text>

      {/* Firma Edo */}
      <View style={{ position: 'absolute', bottom: 32, alignItems: 'center' }}>
        <Text style={{ fontSize: 10, fontFamily: 'monospace', color: darkTheme.textSubtle, letterSpacing: 2, marginBottom: 4 }}>
          [ CREADO POR ]
        </Text>
        <Image
          source={require('../../assets/logo-edo-white.png')}
          style={{ width: 140, height: 140, opacity: 0.9 }}
          resizeMode="contain"
        />
      </View>
    </View>
  );
}
