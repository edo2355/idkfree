import { useEffect, useState } from 'react';
import { View, Text, Image } from 'react-native';
import { darkTheme } from '../theme/dark';
import { fonts } from '../theme/fonts';
import { ScreenBackground } from '../components/ScreenBackground';

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

interface Props {
  onFinish: () => void;
}

export function SplashScreen({ onFinish }: Props) {
  const [tip, setTip] = useState(TIPS[0]);

  useEffect(() => {
    setTip(TIPS[Math.floor(Math.random() * TIPS.length)]);

    const interval = setInterval(() => {
      setTip(TIPS[Math.floor(Math.random() * TIPS.length)]);
    }, 1500);

    const timer = setTimeout(() => {
      clearInterval(interval);
      onFinish();
    }, 4500);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, [onFinish]);

  return (
    <View style={{ flex: 1, backgroundColor: darkTheme.bg, alignItems: 'center', justifyContent: 'center', padding: 32 }}>
      <Image
        source={require('../../assets/icon.png')}
        style={{ width: 120, height: 120, marginBottom: 24 }}
        resizeMode="contain"
      />

      <Text style={{ fontSize: 32, fontFamily: fonts.displayBoldItalic, color: darkTheme.text, letterSpacing: 1, marginBottom: 12 }}>
        IDKFREE
      </Text>

      <Text style={{ fontSize: 14, fontFamily: fonts.medium, color: darkTheme.textMuted, letterSpacing: 0.5, textAlign: 'center', paddingHorizontal: 16 }}>
        {tip}
      </Text>

      <View style={{ position: 'absolute', bottom: 40, alignItems: 'center' }}>
        <Text style={{ fontSize: 12, fontFamily: fonts.medium, color: darkTheme.textMuted, letterSpacing: 0.5, marginBottom: 2 }}>
          from
        </Text>
        <Image
          source={require('../../assets/logo-edo-white.png')}
          style={{ width: 186, height: 186, opacity: 0.9 }}
          resizeMode="contain"
        />
      </View>
    </View>
  );
}
