import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronLeft, ArrowDownCircle, Send } from 'lucide-react-native';
import { GlassCard } from '../components/ui/GlassCard';
import { LinearGradient } from 'expo-linear-gradient';

export function WalletScreen() {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ChevronLeft size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mi Billetera</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <LinearGradient colors={['#00E5FF', '#0055FF']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.balanceCardWrapper}>
          <GlassCard style={styles.balanceCard} intensity={40}>
            <Text style={styles.balanceLabel}>SALDO DISPONIBLE</Text>
            <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
              <Text style={styles.balanceCurrency}>$</Text>
              <Text style={styles.balanceAmount}>0.00</Text>
              <Text style={styles.balanceUSD}> USD</Text>
            </View>
          </GlassCard>
        </LinearGradient>

        <View style={styles.actions}>
          <TouchableOpacity style={styles.actionBtn} onPress={() => navigation.navigate('Checkout', { amount: 10, concept: 'Recarga de Saldo' })}>
            <ArrowDownCircle size={24} color="#00E5FF" />
            <Text style={styles.actionBtnText}>Depositar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn} onPress={() => navigation.navigate('SendMoney')}>
            <Send size={24} color="#fff" />
            <Text style={styles.actionBtnText}>Enviar</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>MÉTODOS DE PAGO</Text>
        <GlassCard style={styles.gatewaysCard}>
          <View style={styles.gatewayItem}><Text style={styles.gatewayText}>QvaPay</Text><View style={[styles.badge, { backgroundColor: 'rgba(0, 229, 255, 0.2)' }]}><Text style={[styles.badgeText, { color: '#00E5FF' }]}>ACTIVO</Text></View></View>
          <View style={styles.divider} />
          <View style={styles.gatewayItem}><Text style={styles.gatewayText}>Transfermóvil</Text><View style={[styles.badge, { backgroundColor: 'rgba(0, 229, 255, 0.2)' }]}><Text style={[styles.badgeText, { color: '#00E5FF' }]}>ACTIVO</Text></View></View>
          <View style={styles.divider} />
          <View style={styles.gatewayItem}><Text style={styles.gatewayText}>Stripe</Text><View style={[styles.badge, { backgroundColor: 'rgba(255, 255, 255, 0.1)' }]}><Text style={[styles.badgeText, { color: '#888' }]}>PRÓXIMAMENTE</Text></View></View>
        </GlassCard>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#050505' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)' },
  backBtn: { padding: 5 },
  headerTitle: { color: '#fff', fontSize: 18, fontWeight: '600' },
  content: { padding: 20 },
  balanceCardWrapper: { borderRadius: 24, marginBottom: 24, shadowColor: '#00E5FF', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 20, elevation: 10 },
  balanceCard: { backgroundColor: 'rgba(0, 0, 0, 0.4)', borderColor: 'rgba(255,255,255,0.2)', paddingVertical: 40, alignItems: 'center' },
  balanceLabel: { color: 'rgba(255,255,255,0.7)', fontSize: 12, fontWeight: '600', letterSpacing: 1, marginBottom: 10 },
  balanceCurrency: { color: '#fff', fontSize: 24, fontWeight: 'bold', marginRight: 5 },
  balanceAmount: { color: '#fff', fontSize: 56, fontWeight: '800', letterSpacing: -2 },
  balanceUSD: { color: 'rgba(255,255,255,0.7)', fontSize: 16, fontWeight: '500' },
  actions: { flexDirection: 'row', gap: 15, marginBottom: 30 },
  actionBtn: { flex: 1, backgroundColor: 'rgba(255,255,255,0.05)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', borderRadius: 16, padding: 18, alignItems: 'center', gap: 8 },
  actionBtnText: { color: '#fff', fontSize: 14, fontWeight: '600' },
  sectionTitle: { color: '#888', fontSize: 12, fontWeight: '700', letterSpacing: 1.5, marginBottom: 12, marginLeft: 5 },
  gatewaysCard: { padding: 0 },
  gatewayItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 18 },
  gatewayText: { color: '#fff', fontSize: 16, fontWeight: '500' },
  divider: { height: 1, backgroundColor: 'rgba(255,255,255,0.05)' },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  badgeText: { fontSize: 10, fontWeight: 'bold', letterSpacing: 0.5 },
});
