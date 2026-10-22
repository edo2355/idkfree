import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Alert } from 'react-native';
import { ErrorLogger } from '../utils/errorLogger';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

export function DebugOverlay() {
  const [logs, setLogs] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = ErrorLogger.subscribe(setLogs);
    return unsubscribe;
  }, []);

  const exportToPDF = async () => {
    try {
      const html = `
        <html>
          <body style="font-family: monospace; padding: 20px;">
            <h1>Reporte de Errores - IDKFREE</h1>
            <p>Fecha: ${new Date().toLocaleString()}</p>
            <h3>Logs de la sesión:</h3>
            <pre style="background: #f4f4f4; padding: 10px; white-space: pre-wrap;">${logs.join('\n')}</pre>
          </body>
        </html>
      `;
      const { uri } = await Print.printToFileAsync({ html });
      await Sharing.shareAsync(uri, { mimeType: 'application/pdf', dialogTitle: 'Compartir Reporte' });
    } catch (error) {
      Alert.alert('Error', 'No se pudo generar el PDF');
    }
  };

  return (
    <>
      <TouchableOpacity style={styles.floatingButton} onPress={() => setIsOpen(!isOpen)}>
        <Text style={{ color: '#FFF', fontWeight: 'bold' }}>🐞</Text>
      </TouchableOpacity>

      {isOpen && (
        <View style={styles.panel}>
          <View style={styles.header}>
            <Text style={styles.title}>Consola de Errores</Text>
            <View style={{ flexDirection: 'row', gap: 10 }}>
              <TouchableOpacity onPress={exportToPDF}>
                <Text style={{ color: '#00f2fe', fontWeight: 'bold' }}>PDF</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => { ErrorLogger.clear(); setIsOpen(false); }}>
                <Text style={{ color: '#ff4d4f', fontWeight: 'bold' }}>Cerrar</Text>
              </TouchableOpacity>
            </View>
          </View>
          <ScrollView style={{ flex: 1 }}>
            {logs.length === 0 ? <Text style={styles.empty}>No hay errores registrados.</Text> : null}
            {logs.map((log, i) => (
              <Text key={i} style={styles.logText}>{log}</Text>
            ))}
          </ScrollView>
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  floatingButton: { position: 'absolute', bottom: 100, right: 20, width: 50, height: 50, borderRadius: 25, backgroundColor: '#ff4d4f', zIndex: 9999, justifyContent: 'center', alignItems: 'center', elevation: 5 },
  panel: { position: 'absolute', bottom: 160, right: 20, width: 320, height: 400, backgroundColor: 'rgba(0,0,0,0.95)', borderRadius: 10, padding: 10, zIndex: 9998, borderWidth: 1, borderColor: '#ff4d4f' },
  header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10, borderBottomWidth: 1, borderBottomColor: '#333', paddingBottom: 5 },
  title: { color: '#FFF', fontWeight: 'bold' },
  empty: { color: '#888', fontStyle: 'italic', textAlign: 'center', marginTop: 20 },
  logText: { color: '#32D3EE', fontSize: 10, marginBottom: 5, fontFamily: 'monospace' }
});
