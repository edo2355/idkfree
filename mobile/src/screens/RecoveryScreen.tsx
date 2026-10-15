// ============================================================
// RecoveryScreen.tsx — Protocolo de Recuperación Táctica + QR Scanner
// ============================================================
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { fonts } from '../theme/fonts';

export function RecoveryScreen({ navigation }: any) {
  const [identityKey, setIdentityKey] = useState('');
  const [secretPhrase, setSecretPhrase] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRecovery = async () => {
    if (!identityKey || !secretPhrase) {
      Alert.alert('RECOVERY_ERROR', 'Ingrese el ID o alias y la clave de restauración.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      Alert.alert('PROTOCOLO INICIADO', 'Si los datos coinciden, se han enviado las instrucciones de restauración.');
    }, 1500);
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        {/* Encabezado */}
        <View style={styles.header}>
          <Text style={styles.systemTag}>// PROTOCOL_RESTORE_V1</Text>
          <Text style={styles.title}>Recuperación</Text>
          <Text style={styles.subtitle}>Restablecimiento de credenciales de carnet.</Text>
        </View>

        {/* Botón Táctico de Escáner QR */}
        <TouchableOpacity 
          style={styles.scanButton}
          onPress={() => navigation.navigate('Scanner')}
        >
          <Text style={styles.scanButtonText}>📷 ESCANEAR QR DE RESTAURACIÓN ✦</Text>
        </TouchableOpacity>

        <View style={styles.dividerRow}>
          <View style={styles.line} />
          <Text style={styles.dividerText}>O INGRESO MANUAL</Text>
          <View style={styles.line} />
        </View>

        <View style={styles.box}>
          <Text style={styles.boxTitle}>[RESTORE_KEY_INJECTION]</Text>
          
          <Text style={styles.label}>ALIAS O IDK-ID *</Text>
          <TextInput
            style={styles.input}
            placeholder="IDK-XXXX-XXXX / @alias"
            placeholderTextColor="#444"
            value={identityKey}
            onChangeText={setIdentityKey}
            autoCapitalize="none"
          />

          <Text style={styles.label}>CLAVE SECRETA DE RESTAURACIÓN / RECOVERY PIN *</Text>
          <TextInput
            style={styles.input}
            placeholder="••••-••••-••••"
            placeholderTextColor="#444"
            secureTextEntry
            value={secretPhrase}
            onChangeText={setSecretPhrase}
          />

          <TouchableOpacity 
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleRecovery}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#000" />
            ) : (
              <Text style={styles.buttonText}>EJECUTAR RESTAURACIÓN ✦</Text>
            )}
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backText}>← CANCELAR Y VOLVER</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#050505',
  },
  scrollContent: {
    padding: 24,
    paddingTop: 60,
  },
  header: {
    marginBottom: 20,
  },
  systemTag: {
    fontFamily: 'monospace',
    fontSize: 10,
    color: '#EF4444',
    letterSpacing: 1.5,
    marginBottom: 6,
  },
  title: {
    fontFamily: fonts.displayBoldItalic,
    fontSize: 34,
    color: '#FFF',
  },
  subtitle: {
    fontFamily: 'monospace',
    fontSize: 12,
    color: '#777',
    marginTop: 4,
  },
  scanButton: {
    backgroundColor: '#0F0F0F',
    borderWidth: 1,
    borderColor: '#32D3EE',
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 20,
  },
  scanButtonText: {
    fontFamily: 'monospace',
    fontSize: 11,
    fontWeight: 'bold',
    color: '#32D3EE',
    letterSpacing: 1,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#222',
  },
  dividerText: {
    fontFamily: 'monospace',
    fontSize: 9,
    color: '#555',
    marginHorizontal: 10,
  },
  box: {
    backgroundColor: '#0A0A0A',
    borderWidth: 1,
    borderColor: '#222',
    padding: 20,
    borderRadius: 2,
  },
  boxTitle: {
    fontFamily: 'monospace',
    fontSize: 11,
    color: '#32D3EE',
    letterSpacing: 1,
    marginBottom: 16,
  },
  label: {
    fontFamily: 'monospace',
    fontSize: 10,
    color: '#888',
    marginBottom: 6,
    marginTop: 10,
  },
  input: {
    backgroundColor: '#121212',
    borderWidth: 1,
    borderColor: '#2A2A2A',
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: '#FFF',
    fontFamily: 'monospace',
    fontSize: 13,
  },
  button: {
    backgroundColor: '#32D3EE',
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 24,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    fontFamily: 'monospace',
    fontSize: 11,
    fontWeight: 'bold',
    color: '#000',
    letterSpacing: 1,
  },
  backButton: {
    marginTop: 24,
    alignItems: 'center',
  },
  backText: {
    fontFamily: 'monospace',
    fontSize: 11,
    color: '#666',
  },
});
