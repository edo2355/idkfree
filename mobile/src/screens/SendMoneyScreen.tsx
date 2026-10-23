import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { api } from '../api/client';
import * as ImagePicker from 'expo-image-picker';

type SendMethod = 'idkfree' | 'qvapay' | 'transfermovil' | 'paypal';

export function SendMoneyScreen() {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();

  const [method, setMethod] = useState<SendMethod>('idkfree');
  const [amount, setAmount] = useState('');
  const [destination, setDestination] = useState('');
  
  // Estados para el flujo post-envío
  const [isSent, setIsSent] = useState(false);
  const [receiptImage, setReceiptImage] = useState<string | null>(null);

  async function pickImage() {
    // Pedir permisos a la galería
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      return Alert.alert('PERMISO DENEGADO', 'Necesitamos acceso a tu galería para subir el comprobante.');
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setReceiptImage(result.assets[0].uri);
    }
  }

  function handleSend() {
    if (!amount || parseFloat(amount) <= 0) {
      return Alert.alert('ERROR', 'Ingresa un monto válido.');
    }
    if (!destination) {
      return Alert.alert('ERROR', 'Ingresa el destinatario.');
    }

    const labels: Record<SendMethod, string> = {
      idkfree: 'otro usuario de IDKFREE',
      qvapay: 'una cuenta QvaPay',
      transfermovil: 'una cuenta Transfermóvil',
      paypal: 'una cuenta PayPal',
    };

    Alert.alert(
      'CONFIRMAR ENVÍO',
      `¿Enviar $${amount} a ${labels[method]}?\n\nDestino: ${destination}`,
      [
        { text: 'CANCELAR', style: 'cancel' },
        {
          text: 'CONFIRMAR',
          onPress: () => setIsSent(true) // Pasamos a la pantalla de comprobante
        }
      ]
    );
  }

  async function finishTransaction() {
    try {
      await api.post('/payments/send', {
        provider: method,
        amount: parseFloat(amount),
        receiver_account: destination
      });
      Alert.alert('TRANSACCIÓN REGISTRADA', 'El envío ha sido guardado en el sistema. Verifica el historial.');
      navigation.goBack();
    } catch (e) {
      Alert.alert('ERROR', 'No se pudo registrar el envío.');
    }
  }

  const methods: { id: SendMethod; label: string; code: string; placeholder: string }[] = [
    { id: 'idkfree', label: 'IDKFREE', code: '[ IDK ]', placeholder: '@usuario_idkfree' },
    { id: 'qvapay', label: 'QVAPAY', code: '[ Q ]', placeholder: '@usuario_qvapay' },
    { id: 'transfermovil', label: 'TRANSFERMÓVIL', code: '[ TM ]', placeholder: '5XXXXXXX' },
    { id: 'paypal', label: 'PAYPAL', code: '[ P ]', placeholder: 'correo@paypal.com' },
  ];

  const currentMethod = methods.find(m => m.id === method)!;

  // ==========================================
  // VISTA 1: FORMULARIO DE ENVÍO
  // ==========================================
  if (!isSent) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.hud}>
          <Text style={styles.hudTitle}>[ ENVIAR DINERO ]</Text>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.hudClose}>[ X ]</Text>
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={{ padding: 20 }}>
          <Text style={styles.description}>
            Selecciona el método de envío y el destinatario. El monto se descontará de tu saldo IDKFREE.
          </Text>

          <View style={styles.methodsContainer}>
            {methods.map(m => (
              <TouchableOpacity
                key={m.id}
                style={[styles.methodBtn, method === m.id && styles.methodBtnActive]}
                onPress={() => setMethod(m.id)}
              >
                <Text style={styles.methodCode}>{m.code}</Text>
                <Text style={[styles.methodLabel, method === m.id && { color: '#fff' }]}>{m.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.formContainer}>
            <Text style={styles.label}>MONTO A ENVIAR (USD)</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#333', backgroundColor: '#0a0a0a', paddingHorizontal: 15 }}>
              <Text style={{ color: '#fff', fontFamily: 'monospace', fontSize: 24, marginRight: 5 }}>$</Text>
              <TextInput
                style={[styles.input, { borderWidth: 0, flex: 1, fontSize: 24, paddingVertical: 15 }]}
                placeholder="0.00"
                placeholderTextColor="#333"
                value={amount}
                onChangeText={setAmount}
                keyboardType="numeric"
              />
            </View>

            <Text style={styles.label}>DESTINATARIO ({currentMethod.label})</Text>
            <TextInput
              style={styles.input}
              placeholder={currentMethod.placeholder}
              placeholderTextColor="#444"
              value={destination}
              onChangeText={setDestination}
              autoCapitalize="none"
              keyboardType={method === 'transfermovil' ? 'numeric' : 'default'}
            />

            <TouchableOpacity style={styles.sendBtn} onPress={handleSend}>
              <Text style={styles.sendBtnText}>ENVIAR DINERO</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    );
  }

  // ==========================================
  // VISTA 2: ADJUNTAR COMPROBANTE
  // ==========================================
  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.hud}>
        <Text style={styles.hudTitle}>[ VERIFICACIÓN ]</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.hudClose}>[ X ]</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <View style={styles.successIcon}>
          <Text style={{ color: '#00E5FF', fontSize: 40 }}>✓</Text>
        </View>
        <Text style={styles.successTitle}>ENVÍO REGISTRADO</Text>
        <Text style={styles.successDesc}>
          Has enviado ${amount} a {destination}. Por favor, adjunta una captura del SMS o del comprobante de {currentMethod.label} para acelerar la verificación.
        </Text>

        <View style={styles.receiptContainer}>
          <Text style={styles.label}>COMPROBANTE DE PAGO</Text>
          
          {receiptImage ? (
            <View style={{ alignItems: 'center', marginBottom: 15 }}>
              <Image source={{ uri: receiptImage }} style={{ width: '100%', height: 200, borderWidth: 1, borderColor: '#333' }} resizeMode="contain" />
              <TouchableOpacity onPress={() => setReceiptImage(null)} style={{ marginTop: 10 }}>
                <Text style={{ color: '#ff0044', fontFamily: 'monospace', fontSize: 12 }}>[ ELIMINAR IMAGEN ]</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity style={styles.uploadBtn} onPress={pickImage}>
              <Text style={styles.uploadBtnText}>+ SUBIR COMPROBANTE</Text>
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity style={styles.sendBtn} onPress={finishTransaction}>
          <Text style={styles.sendBtnText}>FINALIZAR</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.sendBtn, { backgroundColor: 'transparent', borderWidth: 1, borderColor: '#333', marginTop: 10 }]} onPress={finishTransaction}>
          <Text style={[styles.sendBtnText, { color: '#666' }]}>SALTAR POR AHORA</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0a' },
  hud: { flexDirection: 'row', justifyContent: 'space-between', padding: 20, borderBottomWidth: 1, borderBottomColor: '#222' },
  hudTitle: { color: '#fff', fontFamily: 'monospace', fontSize: 14 },
  hudClose: { color: '#ff0044', fontFamily: 'monospace', fontSize: 16, fontWeight: 'bold' },
  description: { color: '#888', fontFamily: 'monospace', fontSize: 12, marginBottom: 20, lineHeight: 18 },
  methodsContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 25, gap: 6 },
  methodBtn: { flex: 1, alignItems: 'center', paddingVertical: 12, borderWidth: 1, borderColor: '#222' },
  methodBtnActive: { borderColor: '#fff', backgroundColor: '#111' },
  methodCode: { color: '#fff', fontFamily: 'monospace', fontSize: 11, fontWeight: 'bold', marginBottom: 4 },
  methodLabel: { color: '#555', fontFamily: 'monospace', fontSize: 8 },
  formContainer: { borderWidth: 1, borderColor: '#333', padding: 20, backgroundColor: '#0f0f0f' },
  label: { color: '#666', fontFamily: 'monospace', fontSize: 10, letterSpacing: 1, marginBottom: 8, marginTop: 15 },
  input: { backgroundColor: '#0a0a0a', borderWidth: 1, borderColor: '#333', color: '#fff', padding: 15, fontFamily: 'monospace', fontSize: 14 },
  sendBtn: { backgroundColor: '#fff', padding: 18, alignItems: 'center', marginTop: 30 },
  sendBtnText: { color: '#000', fontFamily: 'monospace', fontWeight: 'bold', fontSize: 13, letterSpacing: 1 },
  
  // Estilos de la vista de comprobante
  successIcon: { alignItems: 'center', marginBottom: 15 },
  successTitle: { color: '#fff', fontFamily: 'monospace', fontSize: 18, textAlign: 'center', marginBottom: 10 },
  successDesc: { color: '#888', fontFamily: 'monospace', fontSize: 12, textAlign: 'center', marginBottom: 30, lineHeight: 18 },
  receiptContainer: { borderWidth: 1, borderColor: '#333', padding: 20, backgroundColor: '#0f0f0f' },
  uploadBtn: { borderWidth: 1, borderColor: '#444', borderStyle: 'dashed', padding: 30, alignItems: 'center', marginTop: 10 },
  uploadBtnText: { color: '#fff', fontFamily: 'monospace', fontSize: 14 },
});
