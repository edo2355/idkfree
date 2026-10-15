// ============================================================
// ScannerScreen.tsx — Lector Táctico de QR (Carnet IDKFREE)
// ============================================================
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { fonts } from '../theme/fonts';

export function ScannerScreen({ navigation }: any) {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);

  if (!permission) {
    return <View style={styles.container} />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.systemTag}>// SECURITY_ACCESS_REQUIRED</Text>
        <Text style={styles.permissionText}>Se requiere acceso a la cámara para escanear carnets orbitales.</Text>
        <TouchableOpacity style={styles.button} onPress={requestPermission}>
          <Text style={styles.buttonText}>CONCEDER ACCESO ✦</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleBarCodeScanned = ({ type, data }: { type: string; data: string }) => {
    if (scanned) return;
    setScanned(true);

    if (data.startsWith('aldea:v1:')) {
      Alert.alert(
        'CARNET DETECTADO',
        `Payload orbital reconocido:\n${data}`,
        [
          { text: 'REGRESAR', onPress: () => setScanned(false) },
          { 
            text: 'EJECUTAR', 
            onPress: () => {
              // Aquí procesamos la acción del carnet escaneado
              navigation.goBack();
            }
          }
        ]
      );
    } else {
      Alert.alert('CÓDIGO NO VÁLIDO', `El QR escaneado no pertenece al sistema IDKFREE:\n${data}`, [
        { text: 'REINTENTAR', onPress: () => setScanned(false) }
      ]);
    }
  };

  return (
    <View style={styles.container}>
      <CameraView
        style={StyleSheet.absoluteFillObject}
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ['qr'],
        }}
      />

      {/* Overlay Táctico */}
      <View style={styles.overlay} pointerEvents="none">
        <View style={styles.header}>
          <Text style={styles.systemTag}>// ORBITAL_SCANNER_ACTIVE</Text>
          <Text style={styles.title}>Lector de Carnet</Text>
        </View>

        {/* Marco de enfoque táctico */}
        <View style={styles.scannerFrame}>
          <View style={[styles.corner, styles.tl]}><Text style={styles.cross}>+</Text></View>
          <View style={[styles.corner, styles.tr]}><Text style={styles.cross}>+</Text></View>
          <View style={[styles.corner, styles.bl]}><Text style={styles.cross}>+</Text></View>
          <View style={[styles.corner, styles.br]}><Text style={styles.cross}>+</Text></View>
        </View>

        <Text style={styles.footerText}>Apunta al código QR del carnet digital</Text>
      </View>

      <TouchableOpacity style={styles.closeButton} onPress={() => navigation.goBack()}>
        <Text style={styles.closeText}>[ X CERRAR ]</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#050505',
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#050505',
    padding: 24,
  },
  permissionText: {
    fontFamily: 'monospace',
    color: '#888',
    textAlign: 'center',
    marginBottom: 20,
    fontSize: 13,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'space-between',
    padding: 30,
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    marginTop: 40,
  },
  systemTag: {
    fontFamily: 'monospace',
    fontSize: 10,
    color: '#32D3EE',
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  title: {
    fontFamily: fonts.displayBoldItalic,
    fontSize: 24,
    color: '#FFF',
  },
  scannerFrame: {
    width: 240,
    height: 240,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  corner: {
    position: 'absolute',
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tl: { top: -2, left: -2 },
  tr: { top: -2, right: -2 },
  bl: { bottom: -2, left: -2 },
  br: { bottom: -2, right: -2 },
  cross: {
    color: '#32D3EE',
    fontSize: 14,
    fontWeight: 'bold',
  },
  footerText: {
    fontFamily: 'monospace',
    fontSize: 11,
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 40,
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    right: 24,
    zIndex: 10,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#333',
  },
  closeText: {
    fontFamily: 'monospace',
    fontSize: 11,
    color: '#FFF',
  },
  button: {
    backgroundColor: '#32D3EE',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  buttonText: {
    fontFamily: 'monospace',
    fontSize: 12,
    fontWeight: 'bold',
    color: '#000',
  },
});
