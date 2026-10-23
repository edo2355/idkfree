import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export function WalletScreen() {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* HUD Superior */}
      <View style={styles.hud}>
        <Text style={styles.hudTitle}>[ IDKFREE WALLET ]</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Tarjeta de Saldo */}
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>SALDO DISPONIBLE</Text>
          <Text style={styles.balanceAmount}>$0.00</Text>
          <Text style={styles.balanceCurrency}>USD</Text>
        </View>

        {/* Acciones Rápidas */}
        <View style={styles.actions}>
          <TouchableOpacity 
            style={styles.actionBtn} 
            onPress={() => navigation.navigate('Checkout', { amount: 10, concept: 'Recarga de Saldo' })}
          >
            <Text style={styles.actionBtnText}>[ DEPOSITAR ]</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionBtn, { borderColor: '#00E5FF' }]}
            onPress={() => navigation.navigate('SendMoney')}
          >
            <Text style={styles.actionBtnText}>[ ENVIAR ]</Text>
          </TouchableOpacity>
        </View>

        {/* Pasarelas Disponibles */}
        <Text style={styles.sectionTitle}>MÉTODOS DE PAGO DISPONIBLES</Text>
        <View style={styles.gateways}>
          <View style={styles.gatewayItem}><Text style={styles.gatewayText}>QvaPay</Text><Text style={styles.gatewayStatus}>ACTIVO</Text></View>
          <View style={styles.gatewayItem}><Text style={styles.gatewayText}>Transfermóvil</Text><Text style={styles.gatewayStatus}>ACTIVO</Text></View>
          <View style={styles.gatewayItem}><Text style={styles.gatewayText}>Stripe</Text><Text style={styles.gatewayStatusOff}>PRÓXIMAMENTE</Text></View>
          <View style={styles.gatewayItem}><Text style={styles.gatewayText}>MercadoPago</Text><Text style={styles.gatewayStatusOff}>PRÓXIMAMENTE</Text></View>
        </View>

        {/* Historial */}
        <Text style={styles.sectionTitle}>HISTORIAL DE TRANSACCIONES</Text>
        <View style={styles.history}>
          <Text style={styles.emptyText}>No hay transacciones recientes.</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0a' },
  hud: { flexDirection: 'row', justifyContent: 'space-between', padding: 20, borderBottomWidth: 1, borderBottomColor: '#222' },
  hudTitle: { color: '#fff', fontFamily: 'monospace', fontSize: 14 },
  content: { padding: 20 },
  balanceCard: { borderWidth: 1, borderColor: '#333', padding: 30, alignItems: 'center', backgroundColor: '#0f0f0f', marginBottom: 20 },
  balanceLabel: { color: '#666', fontFamily: 'monospace', fontSize: 12, marginBottom: 10 },
  balanceAmount: { color: '#fff', fontFamily: 'monospace', fontSize: 48, fontWeight: 'bold' },
  balanceCurrency: { color: '#00E5FF', fontFamily: 'monospace', fontSize: 14, marginTop: 5 },
  actions: { flexDirection: 'row', gap: 10, marginBottom: 30 },
  actionBtn: { flex: 1, borderWidth: 1, borderColor: '#00E5FF', padding: 15, alignItems: 'center' },
  actionBtnText: { color: '#00E5FF', fontFamily: 'monospace', fontSize: 12, fontWeight: 'bold' },
  sectionTitle: { color: '#555', fontFamily: 'monospace', fontSize: 11, letterSpacing: 2, marginBottom: 15, marginTop: 10 },
  gateways: { borderWidth: 1, borderColor: '#222', marginBottom: 30 },
  gatewayItem: { flexDirection: 'row', justifyContent: 'space-between', padding: 15, borderBottomWidth: 1, borderBottomColor: '#222' },
  gatewayText: { color: '#fff', fontFamily: 'monospace', fontSize: 13 },
  gatewayStatus: { color: '#00E5FF', fontFamily: 'monospace', fontSize: 10 },
  gatewayStatusOff: { color: '#666', fontFamily: 'monospace', fontSize: 10 },
  history: { padding: 20, borderWidth: 1, borderColor: '#222', alignItems: 'center' },
  emptyText: { color: '#444', fontFamily: 'monospace', fontSize: 12 },
});
