import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system/legacy';
import * as IntentLauncher from 'expo-intent-launcher';

export function ErrorLogsScreen() {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const [logs, setLogs] = useState<any[]>([]);

  useEffect(() => {
    loadLogs();
  }, []);

  async function loadLogs() {
    try {
      // Asumimos que errorLogger.ts guarda los logs en AsyncStorage bajo esta clave
      const savedLogs = await AsyncStorage.getItem('@idkfree_error_logs');
      if (savedLogs) {
        setLogs(JSON.parse(savedLogs));
      } else {
        // Datos de prueba si no hay logs reales
        setLogs([
          { id: '1', time: new Date().toISOString(), message: 'Error de prueba: No autenticado', stack: '...' },
          { id: '2', time: new Date().toISOString(), message: 'Error de prueba: Network request failed', stack: '...' }
        ]);
      }
    } catch (e) {
      Alert.alert('ERROR', 'No se pudieron cargar los logs');
    }
  }

  async function clearLogs() {
    try {
      await AsyncStorage.removeItem('@idkfree_error_logs');
      setLogs([]);
      Alert.alert('SISTEMA', 'Logs eliminados');
    } catch (e) {}
  }


    async function generatePDF() {
    if (logs.length === 0) return Alert.alert('SISTEMA', 'No hay logs para exportar');

    try {
      const isSharingAvailable = await Sharing.isAvailableAsync();
      if (!isSharingAvailable) {
        Alert.alert('ERROR', 'Tu dispositivo no soporta la función de compartir archivos.');
        return;
      }

      const htmlContent = `
        <html>
          <body style="background-color: #0a0a0a; color: #ffffff; font-family: monospace; padding: 20px;">
            <h1 style="color: #00E5FF; text-align: center;">[ IDKFREE SYSTEM REPORT ]</h1>
            <p style="text-align: center; color: #888;">Fecha: ${new Date().toLocaleString()}</p>
            <hr style="border-color: #333; margin: 20px 0;" />
            ${logs.map(l => `
              <div style="margin-bottom: 15px; border-bottom: 1px solid #222; padding-bottom: 10px;">
                <p style="color: #ff0044; font-weight: bold; font-size: 14px;">> ${l.message}</p>
                <p style="color: #888; font-size: 12px;">TIMESTAMP: ${new Date(l.time).toLocaleString()}</p>
                <pre style="color: #666; font-size: 10px; white-space: pre-wrap; background-color: #111; padding: 10px; border: 1px solid #333;">${l.stack || 'No stack trace available'}</pre>
              </div>
            `).join('')}
            <p style="color: #666; font-size: 10px; margin-top: 50px; text-align: center;">[ FIN DEL REPORTE ]</p>
          </body>
        </html>
      `;

      // 1. Generar el PDF
      const { uri } = await Print.printToFileAsync({ html: htmlContent });

      if (Platform.OS === 'android') {
        // En Android, obtener la URI de contenido y abrir el PDF con una app externa
        const contentUri = await FileSystem.getContentUriAsync(uri);
        await IntentLauncher.startActivityAsync('android.intent.action.VIEW', {
          data: contentUri,
          flags: 1,
          type: 'application/pdf',
        });
      } else {
        // En iOS, usar Sharing directamente
        await Sharing.shareAsync(uri, { 
          mimeType: 'application/pdf', 
          dialogTitle: 'Compartir Reporte de Errores',
          UTI: '.pdf'
        });
      }

    } catch (error: any) {
      console.error('Error generando PDF:', error);
      Alert.alert('ERROR', `No se pudo generar el PDF: ${error.message || 'Error desconocido'}`);
    }
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.hud}>
        <Text style={styles.hudTitle}>[ LOGS DE ERROR ]</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.hudClose}>[ X ]</Text>
        </TouchableOpacity>
      </View>

      <View style={{ flexDirection: 'row', justifyContent: 'flex-end', padding: 10, gap: 10 }}>
        <TouchableOpacity onPress={generatePDF} style={{ borderWidth: 1, borderColor: '#00E5FF', padding: 5 }}>
          <Text style={{ color: '#00E5FF', fontFamily: 'monospace', fontSize: 12 }}>[ GENERAR PDF ]</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={clearLogs} style={{ borderWidth: 1, borderColor: '#ff0044', padding: 5 }}>
          <Text style={{ color: '#ff0044', fontFamily: 'monospace', fontSize: 12 }}>[ BORRAR LOGS ]</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={logs}
        keyExtractor={(item, index) => item.id || String(index)}
        contentContainerStyle={{ padding: 10 }}
        renderItem={({ item }) => (
          <View style={styles.logCard}>
            <Text style={styles.logTime}>{new Date(item.time).toLocaleString()}</Text>
            <Text style={styles.logMessage}>{item.message}</Text>
            {item.stack && <Text style={styles.logStack} numberOfLines={3}>{item.stack}</Text>}
          </View>
        )}
        ListEmptyComponent={
          <Text style={{ color: '#666', fontFamily: 'monospace', textAlign: 'center', marginTop: 50 }}>No hay errores registrados.</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0a' },
  hud: { flexDirection: 'row', justifyContent: 'space-between', padding: 20, borderBottomWidth: 1, borderBottomColor: '#222' },
  hudTitle: { color: '#fff', fontFamily: 'monospace', fontSize: 14 },
  hudClose: { color: '#ff0044', fontFamily: 'monospace', fontSize: 16, fontWeight: 'bold' },
  logCard: { backgroundColor: '#111', borderWidth: 1, borderColor: '#333', padding: 10, marginBottom: 10 },
  logTime: { color: '#666', fontFamily: 'monospace', fontSize: 10, marginBottom: 5 },
  logMessage: { color: '#ff0044', fontFamily: 'monospace', fontSize: 13, fontWeight: 'bold' },
  logStack: { color: '#888', fontFamily: 'monospace', fontSize: 10, marginTop: 5 },
});
