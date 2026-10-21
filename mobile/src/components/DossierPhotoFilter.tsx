// ============================================================
// DossierPhotoFilter.tsx — Filtro Cinemático Cyber-Dossier / Noir
// ============================================================
import React from 'react';
import { View, Image, StyleSheet, Text, ViewStyle } from 'react-native';

interface Props {
  source: { uri: string } | number;
  style?: ViewStyle;
  variant?: 'noir' | 'surveillance' | 'classified';
  showCoordinates?: boolean;
}

export function DossierPhotoFilter({ 
  source, 
  style, 
  variant = 'noir',
  showCoordinates = false 
}: Props) {
  return (
    <View style={[styles.container, style]}>
      {/* Imagen base con escala de grises simulada y contraste */}
      <Image 
        source={source} 
        style={styles.image} 
        resizeMode="cover" 
      />

      {/* Capa de tinte y alto contraste estilo película B&W / vigilancia */}
      <View style={[
        styles.overlay, 
        variant === 'noir' && styles.noirOverlay,
        variant === 'surveillance' && styles.surveillanceOverlay,
        variant === 'classified' && styles.classifiedOverlay,
      ]} pointerEvents="none" />

      {/* Retícula geométrica y líneas de escaneo */}
      <View style={styles.gridOverlay} pointerEvents="none">
        <View style={styles.horizontalLine} />
        <View style={styles.verticalLine} />
      </View>

      {/* Coordenadas / Datos tácticos opcionales */}
      {showCoordinates && (
        <View style={styles.coordinatesContainer} pointerEvents="none">
          <Text style={styles.coordText}>23°00'21.8" S</Text>
          <Text style={styles.coordText}>43°12'33.6" W</Text>
        </View>
      )}

      {/* Cruces de precisión y marcas en esquinas */}
      <View style={[styles.crosshair, styles.topL]} pointerEvents="none"><Text style={styles.crossText}>+</Text></View>
      <View style={[styles.crosshair, styles.topR]} pointerEvents="none"><Text style={styles.crossText}>+</Text></View>
      <View style={[styles.crosshair, styles.botL]} pointerEvents="none"><Text style={styles.crossText}>+</Text></View>
      <View style={[styles.crosshair, styles.botR]} pointerEvents="none"><Text style={styles.crossText}>+</Text></View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: '#050505',
    borderWidth: 1,
    borderColor: '#333',
  },
  image: {
    width: '100%',
    height: '100%',
    opacity: 0.85,
    tintColor: '#E0E0E0', // Ayuda a unificar tonos monocromos en Android/iOS
  },
  overlay: {
    ...StyleSheet.absoluteFill,
  },
  noirOverlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
  },
  surveillanceOverlay: {
    backgroundColor: 'rgba(10, 25, 35, 0.5)', // Tinte azul militar nocturno
  },
  classifiedOverlay: {
    backgroundColor: 'rgba(35, 25, 15, 0.45)', // Tinte papel antiguo / sepia oscuro
  },
  gridOverlay: {
    ...StyleSheet.absoluteFill,
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0.15,
  },
  horizontalLine: {
    width: '100%',
    height: 1,
    backgroundColor: '#FFF',
  },
  verticalLine: {
    width: 1,
    height: '100%',
    backgroundColor: '#FFF',
    position: 'absolute',
  },
  coordinatesContainer: {
    position: 'absolute',
    top: 4,
    right: 6,
    zIndex: 2,
  },
  coordText: {
    fontFamily: 'monospace',
    fontSize: 7,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'right',
    letterSpacing: 0.5,
  },
  crosshair: {
    position: 'absolute',
    width: 12,
    height: 12,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 3,
  },
  crossText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '300',
    opacity: 0.8,
  },
  topL: { top: -1, left: 1 },
  topR: { top: -1, right: 1 },
  botL: { bottom: -3, left: 1 },
  botR: { bottom: -3, right: 1 },
});
