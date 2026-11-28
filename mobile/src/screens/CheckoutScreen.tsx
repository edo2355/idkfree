import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronLeft, ShieldCheck, CreditCard, Wallet, ArrowRight } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { GlassCard } from '../components/ui/GlassCard';
import { useAuthStore } from '../stores/authStore';

export function CheckoutScreen() {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const route = useRoute<any>();
  const { token } = useAuthStore();

  const [loading, setLoading] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<'qvapay' | 'transfermovil'>('qvapay');

  // Datos del producto que vienen desde CatalogScreen
  const product = route.params?.product || {
    id: 'demo-1',
    title: 'Entrada VIP - Concierto',
    price: 50.00,
    seller_alias: 'idkmedia',
    product_type: 'ticket'
  };

  const serviceFee = product.price * 0.05; // 5% de comisión
  const total = product.price + serviceFee;

  const handlePayment = async () => {
    if (!token) {
      Alert.alert('Error', 'Debes iniciar sesión para comprar.');
      return;
    }

    // Vibración táctil (Haptics) para confirmar
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setLoading(true);

    try {
      const API_URL = process.env.EXPO_PUBLIC_API_URL || 'https://idkfree.onrender.com/api';
      
      // Llamamos al backend para crear el pago
      const res = await fetch(`${API_URL}/payments/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          amount: total,
          concept: `Compra de ${product.title}`,
          provider: selectedMethod
        })
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Error al procesar el pago');

      // Éxito: Aquí en el futuro abriremos el link de pago de QvaPay
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert(
        '¡Pago Iniciado!',
        `Redirigiendo a ${selectedMethod === 'qvapay' ? 'QvaPay' : 'Transfermóvil'}...`,
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );

    } catch (error: any) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert('Error de Pago', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ChevronLeft size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Checkout</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        
        {/* Resumen del Producto */}
        <GlassCard style={styles.card} intensity={20}>
          <Text style={styles.sectionTitle}>RESUMEN DE COMPRA</Text>
          <View style={styles.productInfo}>
            <Text style={styles.productTitle}>{product.title}</Text>
            <Text style={styles.productSeller}>Vendido por @{product.seller_alias}</Text>
          </View>
          
          <View style={styles.divider} />

          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Subtotal</Text>
            <Text style={styles.priceValue}>${product.price.toFixed(2)}</Text>
          </View>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Comisión de servicio (5%)</Text>
            <Text style={styles.priceValue}>${serviceFee.toFixed(2)}</Text>
          </View>
          
          <View style={styles.divider} />

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total a Pagar</Text>
            <Text style={styles.totalValue}>${total.toFixed(2)}</Text>
          </View>
        </GlassCard>

        {/* Métodos de Pago */}
        <Text style={[styles.sectionTitle, { marginLeft: 5, marginTop: 20 }]}>MÉTODO DE PAGO</Text>
        
        <TouchableOpacity 
          style={[styles.methodCard, selectedMethod === 'qvapay' && styles.methodCardActive]}
          onPress={() => { setSelectedMethod('qvapay'); Haptics.selectionAsync(); }}
        >
          <View style={styles.methodIconBg}>
            <Wallet size={24} color="#00E5FF" />
          </View>
          <View style={styles.methodInfo}>
            <Text style={styles.methodName}>QvaPay</Text>
            <Text style={styles.methodDesc}>Paga con tu saldo o tarjeta</Text>
          </View>
          <View style={[styles.radio, selectedMethod === 'qvapay' && styles.radioActive]} />
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.methodCard, selectedMethod === 'transfermovil' && styles.methodCardActive]}
          onPress={() => { setSelectedMethod('transfermovil'); Haptics.selectionAsync(); }}
        >
          <View style={styles.methodIconBg}>
            <CreditCard size={24} color="#00E5FF" />
          </View>
          <View style={styles.methodInfo}>
            <Text style={styles.methodName}>Transfermóvil</Text>
            <Text style={styles.methodDesc}>Pago móvil cubano</Text>
          </View>
          <View style={[styles.radio, selectedMethod === 'transfermovil' && styles.radioActive]} />
        </TouchableOpacity>

        {/* Nota de seguridad */}
        <View style={styles.securityNote}>
          <ShieldCheck size={16} color="#22C55E" />
          <Text style={styles.securityText}>Pago 100% seguro. Tus datos están encriptados.</Text>
        </View>

      </ScrollView>

      {/* Botón de Pago Flotante */}
      <View style={[styles.footer, { paddingBottom: insets.bottom || 20 }]}>
        <TouchableOpacity style={styles.payBtn} onPress={handlePayment} disabled={loading}>
          <LinearGradient 
            colors={loading ? ['#333', '#333'] : ['#00E5FF', '#0055FF']} 
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} 
            style={styles.payGradient}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Text style={styles.payBtnText}>Pagar ${total.toFixed(2)}</Text>
                <ArrowRight size={20} color="#fff" />
              </>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#050505' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)' },
  backBtn: { padding: 5 },
  headerTitle: { color: '#fff', fontSize: 18, fontWeight: '600' },
  content: { padding: 20, paddingBottom: 120 },
  
  card: { padding: 20 },
  sectionTitle: { color: '#888', fontSize: 12, fontWeight: '700', letterSpacing: 1.5, marginBottom: 15 },
  
  productInfo: { marginBottom: 10 },
  productTitle: { color: '#fff', fontSize: 18, fontWeight: '700' },
  productSeller: { color: '#888', fontSize: 13, marginTop: 4 },
  
  divider: { height: 1, backgroundColor: 'rgba(255,255,255,0.05)', marginVertical: 15 },
  
  priceRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  priceLabel: { color: '#888', fontSize: 14 },
  priceValue: { color: '#fff', fontSize: 14, fontWeight: '500' },
  
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  totalLabel: { color: '#fff', fontSize: 16, fontWeight: '700' },
  totalValue: { color: '#00E5FF', fontSize: 24, fontWeight: '900' },

  methodCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.03)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', borderRadius: 16, padding: 16, marginBottom: 12 },
  methodCardActive: { borderColor: '#00E5FF', backgroundColor: 'rgba(0, 229, 255, 0.05)' },
  methodIconBg: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(0, 229, 255, 0.1)', alignItems: 'center', justifyContent: 'center', marginRight: 15 },
  methodInfo: { flex: 1 },
  methodName: { color: '#fff', fontSize: 16, fontWeight: '600' },
  methodDesc: { color: '#888', fontSize: 12, marginTop: 2 },
  radio: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: '#444' },
  radioActive: { borderColor: '#00E5FF', backgroundColor: '#00E5FF' },

  securityNote: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 20 },
  securityText: { color: '#22C55E', fontSize: 12, fontWeight: '500' },

  footer: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#0a0a0a', borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.05)', paddingHorizontal: 20, paddingTop: 15 },
  payBtn: { borderRadius: 16, overflow: 'hidden' },
  payGradient: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 18, gap: 10 },
  payBtnText: { color: '#fff', fontSize: 18, fontWeight: '800' },
});
