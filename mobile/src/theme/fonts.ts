// IDKFREE — Tipografía
import {
  PlayfairDisplay_400Regular,
  PlayfairDisplay_700Bold,
  PlayfairDisplay_700Bold_Italic,
} from '@expo-google-fonts/playfair-display';
import {
  SpaceGrotesk_400Regular,
  SpaceGrotesk_500Medium,
  SpaceGrotesk_700Bold,
} from '@expo-google-fonts/space-grotesk';

export const fontAssets = {
  // Google Fonts (gratis)
  PlayfairDisplay_400Regular,
  PlayfairDisplay_700Bold,
  PlayfairDisplay_700Bold_Italic,
  SpaceGrotesk_400Regular,
  SpaceGrotesk_500Medium,
  SpaceGrotesk_700Bold,

  // Fuentes personalizadas del proyecto (locales)
  DarkFuture_Italic: require('../../assets/fonts/Dark Future Italic.ttf'),
  Voga_Medium: require('../../assets/fonts/CDType - Voga Medium.otf'),
  EurostileExtended_Black: require('../../assets/fonts/EurostileExtendedBlack.ttf'),
  MonumentExtended_Ultrabold: require('../../assets/fonts/MonumentExtended-Ultrabold.otf'),
};

export const fonts = {
  // Editorial / display (serif)
  displayRegular: 'PlayfairDisplay_400Regular',
  displayBold: 'PlayfairDisplay_700Bold',
  displayBoldItalic: 'PlayfairDisplay_700Bold_Italic',

  // UI / body (geométrica)
  regular: 'SpaceGrotesk_400Regular',
  medium: 'SpaceGrotesk_500Medium',
  bold: 'SpaceGrotesk_700Bold',

  // IDKFREE específicas
  eurostile: 'EurostileExtended_Black',   // para "FREE" del logo
  monument: 'MonumentExtended_Ultrabold', // alternativa extendida

  // Edo Amate (firma)
  edoDark: 'DarkFuture_Italic',  // para "edo"
  edoVoga: 'Voga_Medium',         // para "AMATE"
};
