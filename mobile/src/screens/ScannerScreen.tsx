import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, Alert } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useAuth } from '../hooks/useAuth'; // Asumiendo que tienes un hook de auth

export default function ScannerScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [scanResult, setScanResult] = useState<any>(null);
  const { token } = useAuth();

  if (!permission) return <View />;
  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: 'center', marginBottom: 20 }}>Necesitamos permiso de cámara para escanear tickets</Text>
        <Button onPress={requestPermission} title="Dar Permiso" />
      </View>
    );
  }

  const handleBarCodeScanned = async ({ data }: { data: string }) => {
    if (scanned) return;
    setScanned(true);

    try {
      const res = await fetch('https://idkfree.onrender.com/api/tickets/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ qrPayload: data })
      });
      const result = await res.json();
      setScanResult(result);
      
      if (result.status === 'valid') {
        Alert.alert('✅ ACCESO PERMITIDO', `Asiento: ${result.ticket.section} - ${result.ticket.row}-${result.ticket.seat}`);
      } else if (result.status === 'used') {
        Alert.alert('⚠️ TICKET YA USADO', 'Este ticket ya fue escaneado.');
      } else {
        Alert.alert('❌ INVÁLIDO', 'El código QR no es válido.');
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo conectar con el servidor.');
    }

    setTimeout(() => { setScanned(false); setScanResult(null); }, 3000);
  };

  return (
    <View style={styles.container}>
      <CameraView
        style={StyleSheet.absoluteFillObject}
        barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
      />
      <View style={styles.overlay}>
        <View style={styles.scanBox} />
        <Text style={styles.instructions}>Apunta el QR del ticket dentro del cuadro</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center' },
  overlay: { ...StyleSheet.absoluteFillObject, justifyContent: 'center', alignItems: 'center' },
  scanBox: { width: 250, height: 250, borderWidth: 2, borderColor: '#00E5FF', borderRadius: 20, backgroundColor: 'transparent' },
  instructions: { color: 'white', marginTop: 20, fontWeight: 'bold', backgroundColor: 'rgba(0,0,0,0.5)', padding: 10, borderRadius: 8 }
});
