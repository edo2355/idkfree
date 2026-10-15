// ============================================================
// RegisterScreen.tsx — Registro Táctico corregido
// ============================================================
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator,  } from 'react-native';
import { idkAlert as Alert } from '../components/IDKAlert';
import { useAuthStore } from '../stores/authStore';
import { api } from '../api/client';
import { fonts } from '../theme/fonts';

export function RegisterScreen({ navigation }: any) {
  const setAuth = useAuthStore((s) => s.setAuth);

  const [alias, setAlias] = useState('');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [pinPanic, setPinPanic] = useState('');
  const [pinRestore, setPinRestore] = useState('');
  const [pinFenix, setPinFenix] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!alias || !email || !password) {
      Alert.alert('SISTEMA', 'Campos obligatorios incompletos (alias, email, contraseña).');
      return;
    }

    setLoading(true);
    try {
      const payload: any = {
        alias,
        email,
        password,
        secretPins: [
          pinPanic || '0000',
          pinRestore || '0000',
          pinFenix || '0000',
        ],
      };
      // name solo si no está vacío (el schema es min(1).optional())
      if (name && name.trim().length > 0) payload.name = name.trim();

      const res = await api.auth.register(payload);

      if (res?.accessToken && res?.userId) {
        setAuth(
          { id: res.userId, alias: res.alias, name: res.name ?? null, email: res.email ?? null, avatar_url: null },
          res.accessToken
        );
      } else {
        Alert.alert('SISTEMA', 'Respuesta inesperada del servidor.');
      }
    } catch (err: any) {
      Alert.alert('ERROR DE REGISTRO', err?.message || 'Error al conectar con la red.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        {/* Cabecera Táctica */}
        <View style={styles.header}>
          <Text style={styles.systemTag}>// IDKFREE_REGISTRY_PROTOCOL</Text>
          <Text style={styles.title}>Crear Carnet</Text>
          <Text style={styles.subtitle}>Inicializa tus credenciales cifradas en la red.</Text>
        </View>

        {/* Inputs de Identidad */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>[01] IDENTIDAD</Text>
          
          <Text style={styles.label}>ALIAS (@) *</Text>
          <TextInput
            style={styles.input}
            placeholder="alias_unico"
            placeholderTextColor="#555"
            value={alias}
            onChangeText={setAlias}
            autoCapitalize="none"
          />

          <Text style={styles.label}>EMAIL *</Text>
          <TextInput
            style={styles.input}
            placeholder="contacto@red.com"
            placeholderTextColor="#555"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Text style={styles.label}>NOMBRE / APODO</Text>
          <TextInput
            style={styles.input}
            placeholder="Nombre público"
            placeholderTextColor="#555"
            value={name}
            onChangeText={setName}
          />

          <Text style={styles.label}>CONTRASEÑA *</Text>
          <TextInput
            style={styles.input}
            placeholder="••••••••••••"
            placeholderTextColor="#555"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>

        {/* Bloque Táctico de PINs de Seguridad */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>[02] LLAVES Y PINS DE SEGURIDAD</Text>
          <Text style={styles.pinHint}>
            Configura tus códigos de emergencia (4 dígitos para protocolos de tu carnet).
          </Text>

          <View style={styles.pinRow}>
            <View style={styles.pinBox}>
              <Text style={styles.pinLabel}>PÁNICO</Text>
              <TextInput
                style={styles.pinInput}
                placeholder="0000"
                placeholderTextColor="#444"
                keyboardType="numeric"
                maxLength={4}
                secureTextEntry
                value={pinPanic}
                onChangeText={setPinPanic}
              />
            </View>

            <View style={styles.pinBox}>
              <Text style={styles.pinLabel}>RESTAURAR</Text>
              <TextInput
                style={styles.pinInput}
                placeholder="0000"
                placeholderTextColor="#444"
                keyboardType="numeric"
                maxLength={4}
                secureTextEntry
                value={pinRestore}
                onChangeText={setPinRestore}
              />
            </View>

            <View style={styles.pinBox}>
              <Text style={styles.pinLabel}>FÉNIX</Text>
              <TextInput
                style={styles.pinInput}
                placeholder="0000"
                placeholderTextColor="#444"
                keyboardType="numeric"
                maxLength={4}
                secureTextEntry
                value={pinFenix}
                onChangeText={setPinFenix}
              />
            </View>
          </View>
        </View>

        {/* Botón de Acción Táctico */}
        <TouchableOpacity 
          style={[styles.button, loading && styles.buttonDisabled]} 
          onPress={handleRegister}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#000" />
          ) : (
            <Text style={styles.buttonText}>GENERAR CARNET TÁCTICO ◆</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.linkButton} 
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.linkText}>¿Ya posees credenciales? Iniciar Sesión</Text>
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
    marginBottom: 28,
    borderBottomWidth: 1,
    borderBottomColor: '#222',
    paddingBottom: 16,
  },
  systemTag: {
    fontFamily: 'monospace',
    fontSize: 10,
    color: '#32D3EE',
    letterSpacing: 1.5,
    marginBottom: 6,
  },
  title: {
    fontFamily: fonts.displayBoldItalic,
    fontSize: 32,
    color: '#FFF',
  },
  subtitle: {
    fontFamily: 'monospace',
    fontSize: 12,
    color: '#888',
    marginTop: 4,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: 'monospace',
    fontSize: 11,
    color: '#AB55F7',
    letterSpacing: 1,
    marginBottom: 12,
  },
  label: {
    fontFamily: 'monospace',
    fontSize: 10,
    color: '#AAA',
    marginBottom: 6,
    marginTop: 10,
  },
  input: {
    backgroundColor: '#0F0F0F',
    borderWidth: 1,
    borderColor: '#262626',
    borderRadius: 2,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: '#FFF',
    fontFamily: 'monospace',
    fontSize: 13,
  },
  pinHint: {
    fontFamily: 'monospace',
    fontSize: 10,
    color: '#666',
    marginBottom: 12,
  },
  pinRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  pinBox: {
    width: '30%',
  },
  pinLabel: {
    fontFamily: 'monospace',
    fontSize: 9,
    color: '#888',
    textAlign: 'center',
    marginBottom: 4,
  },
  pinInput: {
    backgroundColor: '#0F0F0F',
    borderWidth: 1,
    borderColor: '#333',
    paddingVertical: 10,
    textAlign: 'center',
    color: '#32D3EE',
    fontFamily: 'monospace',
    fontSize: 16,
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#FFF',
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#FFF',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    fontFamily: 'monospace',
    fontSize: 12,
    fontWeight: 'bold',
    color: '#000',
    letterSpacing: 1,
  },
  linkButton: {
    marginTop: 20,
    alignItems: 'center',
  },
  linkText: {
    fontFamily: 'monospace',
    fontSize: 11,
    color: '#888',
    textDecorationLine: 'underline',
  },
});
