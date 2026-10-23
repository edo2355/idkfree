import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, ScrollView, TextInput } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as WebBrowser from 'expo-web-browser';
import QRCode from 'react-native-qrcode-svg';
import { api } from '../api/client';

export function CheckoutScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();

  const { amount = 10, concept = 'Suscripción IDKFREE+' } = route.params || {};
  const [loading, setLoading] = useState<string | null>(null);
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);

  // QR de prueba para Transfermóvil (en producción, esto se genera dinámicamente desde el backend)
  const transfermovilData = `00020101021243650016transfermovil.com0102USD5204000053038405802CU5913IDKFREE_STORE6006HAVANA6304ABCD`;

  async function handleQvaPay() {
    setLoading('qvapay');
    try {
      const res = await api.post('/payments/create', {
        amount,
        currency: 'USD',
        provider: 'qvapay',
        metadata: { concept }
      });

      if (res.url) {
        const result = await WebBrowser.openBrowserAsync(res.url);
        if (result.type === 'dismiss') {
          Alert.alert('PAGO', 'Ventana de pago cerrada. Verifica tu saldo en QvaPay.');
        }
      } else {
        Alert.alert('ERROR', 'No se recibió la URL de pago.');
      }
    } catch (error: any) {
      Alert.alert('ERROR', 'No se pudo conectar con QvaPay. Intenta más tarde.');
    } finally {
      setLoading(null);
    }
  }

  function handleComingSoon(method: string) {
    Alert.alert(
      'PRÓXIMAMENTE',
      `El método ${method.toUpperCase()} estará disponible muy pronto. Estamos trabajando en la integración.`,
      [{ text: 'ENTENDIDO', style: 'default' }]
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* HUD Superior */}
      <View style={styles.hud}>
        <Text style={styles.hudTitle}>[ CHECKOUT ]</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.hudClose}>[ X ]</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Resumen del pago */}
        <View style={styles.summary}>
          <Text style={styles.concept}>{concept}</Text>
          <Text style={styles.amount}>${amount.toFixed(2)} USD</Text>
          <Text style={styles.subtext}>Selecciona tu método de pago</Text>
        </View>

        {/* QvaPay */}
        <TouchableOpacity 
          style={[styles.methodBtn, { borderColor: '#00E5FF' }]}
          onPress={handleQvaPay}
          disabled={loading !== null}
        >
          <View style={{ flex: 1 }}>
            <Text style={styles.methodTitle}>QVAPAY</Text>
            <Text style={styles.methodDesc}>Cripto / Saldo Móvil · Cuba</Text>
          </View>
          {loading === 'qvapay' ? (
            <ActivityIndicator color="#00E5FF" />
          ) : (
            <Text style={styles.arrow}>→</Text>
          )}
        </TouchableOpacity>

        {/* Transfermóvil con QR (Cuba) */}
        <TouchableOpacity 
          style={[styles.methodBtn, { borderColor: '#00E5FF' }]}
          onPress={() => setSelectedMethod(selectedMethod === 'transfermovil' ? null : 'transfermovil')}
        >
          <View style={{ flex: 1 }}>
            <Text style={styles.methodTitle}>TRANSFERMÓVIL</Text>
            <Text style={styles.methodDesc}>Pago Móvil / QR · Cuba</Text>
          </View>
          <Text style={styles.arrow}>{selectedMethod === 'transfermovil' ? '↑' : '↓'}</Text>
        </TouchableOpacity>

        {/* QR de Transfermóvil (se expande) */}
        {selectedMethod === 'transfermovil' && (
          <View style={styles.qrContainer}>
            <QRCode
              value={transfermovilData}
              size={200}
              backgroundColor="#ffffff"
              color="#0a0a0a"
            />
            <Text style={styles.qrText}>Escanea este código con Transfermóvil</Text>
            <Text style={styles.qrSubtext}>Cuenta: 9226 0000 1234 5678</Text>
            <Text style={styles.qrSubtext}>Titular: IDKFREE STORE</Text>
          </View>
        )}

        {/* Stripe (Coming Soon) */}
        <TouchableOpacity 
          style={[styles.methodBtn, { borderColor: '#333', opacity: 0.6 }]}
          onPress={() => handleComingSoon('Stripe')}
        >
          <View style={{ flex: 1 }}>
            <Text style={styles.methodTitle}>STRIPE (COMING SOON)</Text>
            <Text style={styles.methodDesc}>Tarjetas Internacionales</Text>
          </View>
          <View style={styles.soonBadge}>
            <Text style={styles.soonText}>PRÓXIMO</Text>
          </View>
        </TouchableOpacity>

        {/* MercadoPago (Coming Soon) */}
        <TouchableOpacity 
          style={[styles.methodBtn, { borderColor: '#333', opacity: 0.6 }]}
          onPress={() => handleComingSoon('Mercado Pago')}
        >
          <View style={{ flex: 1 }}>
            <Text style={styles.methodTitle}>MERCADO PAGO (COMING SOON)</Text>
            <Text style={styles.methodDesc}>LATAM (Argentina, México, etc.)</Text>
          </View>
          <View style={styles.soonBadge}>
            <Text style={styles.soonText}>PRÓXIMO</Text>
          </View>
        </TouchableOpacity>

        {/* Info de seguridad */}
        <View style={styles.securityNote}>
          <Text style={styles.securityText}>
            🔒 Todas las transacciones son encriptadas. No almacenamos datos de tu tarjeta.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0a' },
  hud: { flexDirection: 'row', justifyContent: 'space-between', padding: 20, borderBottomWidth: 1, borderBottomColor: '#222' },
  hudTitle: { color: '#fff', fontFamily: 'monospace', fontSize: 14 },
  hudClose: { color: '#ff0044', fontFamily: 'monospace', fontSize: 16, fontWeight: 'bold' },
  scrollContent: { padding: 20 },
  summary: { alignItems: 'center', marginBottom: 30, paddingBottom: 20, borderBottomWidth: 1, borderBottomColor: '#1a1a1a' },
  concept: { color: '#888', fontFamily: 'monospace', fontSize: 12, marginBottom: 10, letterSpacing: 2 },
  amount: { color: '#fff', fontFamily: 'monospace', fontSize: 42, fontWeight: 'bold' },
  subtext: { color: '#555', fontFamily: 'monospace', fontSize: 11, marginTop: 10, letterSpacing: 1 },
  methodBtn: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, padding: 20, backgroundColor: '#0f0f0f', marginBottom: 12 },
  methodTitle: { color: '#fff', fontFamily: 'monospace', fontSize: 14, fontWeight: 'bold', marginBottom: 4 },
  methodDesc: { color: '#666', fontFamily: 'monospace', fontSize: 11 },
  arrow: { color: '#00E5FF', fontFamily: 'monospace', fontSize: 20 },
  qrContainer: { alignItems: 'center', padding: 20, backgroundColor: '#fff', marginBottom: 12 },
  qrText: { color: '#0a0a0a', fontFamily: 'monospace', fontSize: 12, marginTop: 15, fontWeight: 'bold' },
  qrSubtext: { color: '#333', fontFamily: 'monospace', fontSize: 11, marginTop: 5 },
  soonBadge: { backgroundColor: '#333', paddingHorizontal: 8, paddingVertical: 4 },
  soonText: { color: '#888', fontFamily: 'monospace', fontSize: 9, fontWeight: 'bold' },
  securityNote: { marginTop: 20, padding: 15, backgroundColor: '#0f0f0f', borderWidth: 1, borderColor: '#1a1a1a' },
  securityText: { color: '#555', fontFamily: 'monospace', fontSize: 10, textAlign: 'center' },
});
