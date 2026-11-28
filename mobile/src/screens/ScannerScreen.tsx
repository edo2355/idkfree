import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronLeft, ScanLine, CheckCircle2, XCircle } from 'lucide-react-native';
import { api } from '../api/client';

export default function ScannerScreen() {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [scanResult, setScanResult] = useState<{ status: 'success' | 'error', message: string, ticket?: any } | null>(null);

  useEffect(() => {
    if (!permission?.granted) {
      requestPermission();
    }
  }, [permission]);

  if (!permission) {
    return <View style={styles.container}><Text style={{ color: '#fff' }}>Cargando cámara...</Text></View>;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={{ color: '#fff', textAlign: 'center', marginBottom: 20 }}>
          Necesitamos acceso a tu cámara para escanear los tickets.
        </Text>
        <TouchableOpacity style={styles.button} onPress={requestPermission}>
          <Text style={styles.buttonText}>Dar Permiso</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleBarCodeScanned = async ({ type, data }: { type: string, data: string }) => {
    if (scanned) return;
    setScanned(true);

    try {
      // Llamamos al backend para validar el QR
      // Nota: Asegúrate de que la ruta '/tickets/validate' sea la correcta en tu backend
      const response = await api.post('/tickets/validate', { qrPayload: data });
      
      setScanResult({
        status: 'success',
        message: 'Ticket Válido',
        ticket: response.ticket || response
      });
    } catch (error: any) {
      setScanResult({
        status: 'error',
        message: error.response?.data?.error || 'Ticket inválido o ya utilizado'
      });
    }
  };

  const resetScanner = () => {
    setScanned(false);
    setScanResult(null);
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ChevronLeft size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Validar Ticket</Text>
        <View style={{ width: 24 }} />
      </View>

      {!scanResult ? (
        <View style={styles.cameraContainer}>
          <CameraView
            style={StyleSheet.absoluteFillObject}
            facing="back"
            onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
            barcodeScannerSettings={{
              barcodeTypes: ["qr"],
            }}
          />
          {/* Overlay visual del escáner */}
          <View style={styles.overlay}>
            <View style={styles.scanFrame} />
            <View style={styles.instructionContainer}>
              <ScanLine size={24} color="#00E5FF" />
              <Text style={styles.instructionText}>Apunta la cámara al código QR del ticket</Text>
            </View>
          </View>
        </View>
      ) : (
        <View style={styles.resultContainer}>
          {scanResult.status === 'success' ? (
            <CheckCircle2 size={80} color="#22C55E" />
          ) : (
            <XCircle size={80} color="#FF3B30" />
          )}
          
          <Text style={[styles.resultTitle, { color: scanResult.status === 'success' ? '#22C55E' : '#FF3B30' }]}>
            {scanResult.message}
          </Text>

          {scanResult.ticket && (
            <View style={styles.ticketInfo}>
              <Text style={styles.ticketText}>Evento: {scanResult.ticket.event_name || 'N/A'}</Text>
              <Text style={styles.ticketText}>Asiento: {scanResult.ticket.seat_number || 'N/A'}</Text>
              <Text style={styles.ticketText}>ID: {scanResult.ticket.id || 'N/A'}</Text>
            </View>
          )}

          <TouchableOpacity style={styles.button} onPress={resetScanner}>
            <Text style={styles.buttonText}>Escanear otro ticket</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#050505' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 15, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 10 },
  backBtn: { padding: 5 },
  headerTitle: { color: '#fff', fontSize: 18, fontWeight: '600' },
  cameraContainer: { flex: 1, overflow: 'hidden' },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  scanFrame: { width: 250, height: 250, borderWidth: 2, borderColor: '#00E5FF', borderRadius: 20, backgroundColor: 'transparent' },
  instructionContainer: { position: 'absolute', bottom: 50, alignItems: 'center', gap: 10 },
  instructionText: { color: '#fff', fontSize: 14, fontWeight: '500' },
  resultContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 30 },
  resultTitle: { fontSize: 24, fontWeight: 'bold', marginTop: 20, marginBottom: 30, textAlign: 'center' },
  ticketInfo: { backgroundColor: 'rgba(255,255,255,0.05)', padding: 20, borderRadius: 16, width: '100%', marginBottom: 30, gap: 10 },
  ticketText: { color: '#ccc', fontSize: 15, fontFamily: 'monospace' },
  button: { backgroundColor: '#00E5FF', paddingVertical: 16, paddingHorizontal: 24, borderRadius: 12, width: '100%', alignItems: 'center' },
  buttonText: { color: '#000', fontSize: 16, fontWeight: 'bold' }
});
