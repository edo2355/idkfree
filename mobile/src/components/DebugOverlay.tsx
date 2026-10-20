import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { ErrorLogger } from '../utils/errorLogger';

export function DebugOverlay() {
  const [logs, setLogs] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = ErrorLogger.subscribe(setLogs);
    return unsubscribe;
  }, []);

  return (
    <>
      <TouchableOpacity 
        style={styles.floatingButton} 
        onPress={() => setIsOpen(!isOpen)}
      >
        <Text style={{ color: '#FFF', fontWeight: 'bold' }}>🐞</Text>
      </TouchableOpacity>

      {isOpen && (
        <View style={styles.panel}>
          <View style={styles.header}>
            <Text style={styles.title}>Consola de Errores</Text>
            <TouchableOpacity onPress={() => { ErrorLogger.clear(); setIsOpen(false); }}>
              <Text style={{ color: '#ff4d4f', fontWeight: 'bold' }}>Cerrar</Text>
            </TouchableOpacity>
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
  panel: { position: 'absolute', bottom: 160, right: 20, width: 300, height: 300, backgroundColor: 'rgba(0,0,0,0.9)', borderRadius: 10, padding: 10, zIndex: 9998, borderWidth: 1, borderColor: '#ff4d4f' },
  header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10, borderBottomWidth: 1, borderBottomColor: '#333', paddingBottom: 5 },
  title: { color: '#FFF', fontWeight: 'bold' },
  empty: { color: '#888', fontStyle: 'italic', textAlign: 'center', marginTop: 20 },
  logText: { color: '#32D3EE', fontSize: 10, marginBottom: 5, fontFamily: 'monospace' }
});
