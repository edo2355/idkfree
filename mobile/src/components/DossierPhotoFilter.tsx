// ============================================================
// DossierPhotoFilter.tsx — Filtro estilo Mugshot / Dossier Policial
// ============================================================
import React from 'react';
import { View, Image, StyleSheet, ViewStyle } from 'react-native';

interface Props {
  source: { uri: string } | number;
  style?: ViewStyle;
  variant?: 'mugshot' | 'cyber' | 'classified';
}

export function DossierPhotoFilter({ source, style, variant = 'mugshot' }: Props) {
  return (
    <View style={[styles.container, style]}>
      {/* Imagen base */}
      <Image 
        source={source} 
        style={styles.image} 
        resizeMode="cover" 
      />

      {/* Capa de tinte según la variante (Cyber azul/verde o Monocromo archival) */}
      <View style={[
        styles.overlay, 
        variant === 'cyber' && styles.cyberOverlay,
        variant === 'classified' && styles.classifiedOverlay,
        variant === 'mugshot' && styles.mugshotOverlay
      ]} pointerEvents="none" />

      {/* Líneas de escaneo (Scanlines estilo terminal/dossier antiguo) */}
      <View style={styles.scanlines} pointerEvents="none" />

      {/* Esquinas tácticas */}
      <View style={[styles.corner, styles.topLeft]} pointerEvents="none" />
      <View style={[styles.corner, styles.topRight]} pointerEvents="none" />
      <View style={[styles.corner, styles.bottomLeft]} pointerEvents="none" />
      <View style={[styles.corner, styles.bottomRight]} pointerEvents="none" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: '#000',
    borderWidth: 1,
    borderColor: '#444',
  },
  image: {
    width: '100%',
    height: '100%',
    opacity: 0.9,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  mugshotOverlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)', // Alto contraste B&W
  },
  cyberOverlay: {
    backgroundColor: 'rgba(0, 45, 75, 0.4)', // Tinte ciberpunk Blade Runner
  },
  classifiedOverlay: {
    backgroundColor: 'rgba(60, 45, 25, 0.35)', // Tinte expediente desclasificado
  },
  scanlines: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.2,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  corner: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderColor: '#FFF',
    zIndex: 3,
  },
  topLeft: { top: 2, left: 2, borderTopWidth: 2, borderLeftWidth: 2 },
  topRight: { top: 2, right: 2, borderTopWidth: 2, borderRightWidth: 2 },
  bottomLeft: { bottom: 2, left: 2, borderBottomWidth: 2, borderLeftWidth: 2 },
  bottomRight: { bottom: 2, right: 2, borderBottomWidth: 2, borderRightWidth: 2 },
});
