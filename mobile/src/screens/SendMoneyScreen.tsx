import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, Image, KeyboardAvoidingView, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Check, Trash2, CloudUpload, Send, AtSign, Wallet, Smartphone, CreditCard } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { api } from '../api/client';
import { GlassCard } from '../components/ui/GlassCard';

type SendMethod = 'idkfree' | 'qvapay' | 'transfermovil' | 'paypal';

const METHODS: { id: SendMethod; label: string; icon: any; placeholder: string }[] = [
  { id: 'idkfree', label: 'IDKFREE', icon: AtSign, placeholder: '@usuario_idkfree' },
  { id: 'qvapay', label: 'QvaPay', icon: Wallet, placeholder: '@usuario_qvapay' },
  { id: 'transfermovil', label: 'Transfermóvil', icon: Smartphone, placeholder: '5XXXXXXX' },
  { id: 'paypal', label: 'PayPal', icon: CreditCard, placeholder: 'correo@paypal.com' },
];

export function SendMoneyScreen() {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  
  const [method, setMethod] = useState<SendMethod>('idkfree');
  const [amount, setAmount] = useState('');
  const [destination, setDestination] = useState('');
  const [isSent, setIsSent] = useState(false);
  const [receiptImage, setReceiptImage] = useState<string | null>(null);

  const currentMethod = METHODS.find(m => m.id === method)!;

  async function pickImage() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') return Alert.alert('Permiso denegado', 'Necesitamos acceso a tu galería.');
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, allowsEditing: true, quality: 0.8 });
    if (!result.canceled && result.assets && result.assets.length > 0) setReceiptImage(result.assets[0].uri);
  }

  function handleSend() {
    if (!amount || parseFloat(amount) <= 0) return Alert.alert('Error', 'Ingresa un monto válido.');
    if (!destination) return Alert.alert('Error', 'Ingresa el destinatario.');
    Alert.alert('Confirmar Envío', `¿Enviar $${amount} a ${currentMethod.label}?\nDestino: ${destination}`, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Confirmar', onPress: () => setIsSent(true) }
    ]);
  }

  async function finishTransaction() {
    try {
      await api.post('/payments/send', { provider: method, amount: parseFloat(amount), receiver_account: destination });
      Alert.alert('Transacción Exitosa', 'El envío ha sido registrado.');
      navigation.goBack();
    } catch (e) { Alert.alert('Error', 'No se pudo registrar el envío.'); }
  }

  if (isSent) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <View style={styles.successHeader}>
              <View style={styles.successIconWrapper}><Check size={40} color="#00E5FF" /></View>
              <Text style={styles.successTitle}>Envío Registrado</Text>
              <Text style={styles.successDesc}>Has enviado ${amount} a {destination}. Adjunta una captura del comprobante.</Text>
            </View>
            <GlassCard style={styles.glassPanel}>
              <Text style={styles.label}>COMPROBANTE DE PAGO</Text>
              {receiptImage ? (
                <View style={{ alignItems: 'center' }}>
                  <Image source={{ uri: receiptImage }} style={styles.receiptImage} resizeMode="contain" />
                  <TouchableOpacity onPress={() => setReceiptImage(null)} style={styles.removeImageBtn}>
                    <Trash2 size={16} color="#FF3B30" /><Text style={styles.removeImageText}>Eliminar Imagen</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity style={styles.uploadBtn} onPress={pickImage}>
                  <CloudUpload size={32} color="#888" /><Text style={styles.uploadBtnText}>Subir Comprobante</Text>
                </TouchableOpacity>
              )}
            </GlassCard>
            <TouchableOpacity style={styles.primaryBtn} onPress={finishTransaction}><Text style={styles.primaryBtnText}>Finalizar</Text></TouchableOpacity>
            <TouchableOpacity style={styles.secondaryBtn} onPress={finishTransaction}><Text style={styles.secondaryBtnText}>Saltar por ahora</Text></TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={styles.description}>Selecciona el método de envío y el destinatario.</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.methodsContainer}>
            {METHODS.map((m) => {
              const isActive = method === m.id;
              const IconComp = m.icon;
              return (
                <TouchableOpacity key={m.id} style={[styles.methodBtn, isActive && styles.methodBtnActive]} onPress={() => setMethod(m.id)}>
                  <IconComp size={20} color={isActive ? '#00E5FF' : '#888'} />
                  <Text style={[styles.methodLabel, isActive && { color: '#fff' }]}>{m.label}</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
          <GlassCard style={styles.glassPanel}>
            <Text style={styles.label}>MONTO A ENVIAR (USD)</Text>
            <View style={styles.amountContainer}>
              <Text style={styles.currencySymbol}>$</Text>
              <TextInput style={styles.amountInput} placeholder="0.00" placeholderTextColor="#444" value={amount} onChangeText={setAmount} keyboardType="numeric" />
            </View>
            <Text style={styles.label}>DESTINATARIO ({currentMethod.label})</Text>
            <View style={styles.inputContainer}>
              <TextInput style={styles.textInput} placeholder={currentMethod.placeholder} placeholderTextColor="#666" value={destination} onChangeText={setDestination} autoCapitalize="none" keyboardType={method === 'transfermovil' ? 'numeric' : 'default'} />
            </View>
            <TouchableOpacity style={styles.sendBtnWrapper} onPress={handleSend}>
              <LinearGradient colors={['#00E5FF', '#0055FF']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.sendBtnGradient}>
                <Text style={styles.sendBtnText}>Enviar Dinero</Text><Send size={18} color="#fff" />
              </LinearGradient>
            </TouchableOpacity>
          </GlassCard>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#050505' },
  scrollContent: { padding: 20, paddingBottom: 40 },
  description: { color: '#888', fontSize: 14, marginBottom: 20, lineHeight: 20 },
  methodsContainer: { gap: 10, paddingBottom: 20 },
  methodBtn: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 16, borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.05)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', gap: 8 },
  methodBtnActive: { backgroundColor: 'rgba(0, 229, 255, 0.1)', borderColor: '#00E5FF' },
  methodLabel: { color: '#888', fontSize: 14, fontWeight: '600' },
  glassPanel: { padding: 20 },
  label: { color: '#888', fontSize: 12, fontWeight: '700', letterSpacing: 1, marginBottom: 8, marginTop: 15 },
  amountContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: 16, paddingHorizontal: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  currencySymbol: { color: '#00E5FF', fontSize: 28, fontWeight: 'bold', marginRight: 8 },
  amountInput: { flex: 1, color: '#fff', fontSize: 36, fontWeight: '800', paddingVertical: 16 },
  inputContainer: { backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: 16, paddingHorizontal: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  textInput: { color: '#fff', fontSize: 16, paddingVertical: 16 },
  sendBtnWrapper: { marginTop: 30, borderRadius: 16, overflow: 'hidden' },
  sendBtnGradient: { flexDirection: 'row', paddingVertical: 18, alignItems: 'center', justifyContent: 'center', gap: 10 },
  sendBtnText: { color: '#fff', fontSize: 16, fontWeight: '700', letterSpacing: 0.5 },
  successHeader: { alignItems: 'center', marginBottom: 30, marginTop: 20 },
  successIconWrapper: { width: 80, height: 80, borderRadius: 40, backgroundColor: 'rgba(0, 229, 255, 0.1)', alignItems: 'center', justifyContent: 'center', marginBottom: 16, borderWidth: 1, borderColor: 'rgba(0, 229, 255, 0.3)' },
  successTitle: { color: '#fff', fontSize: 24, fontWeight: '800', marginBottom: 10 },
  successDesc: { color: '#888', fontSize: 14, textAlign: 'center', lineHeight: 22, paddingHorizontal: 20 },
  uploadBtn: { borderWidth: 1, borderColor: '#444', borderStyle: 'dashed', borderRadius: 16, padding: 30, alignItems: 'center', marginTop: 10, backgroundColor: 'rgba(255,255,255,0.02)' },
  uploadBtnText: { color: '#888', fontSize: 14, fontWeight: '600', marginTop: 10 },
  receiptImage: { width: '100%', height: 200, borderRadius: 12, marginTop: 10 },
  removeImageBtn: { flexDirection: 'row', alignItems: 'center', marginTop: 12, gap: 6 },
  removeImageText: { color: '#FF3B30', fontSize: 14, fontWeight: '600' },
  primaryBtn: { backgroundColor: '#00E5FF', paddingVertical: 18, borderRadius: 16, alignItems: 'center', marginTop: 20 },
  primaryBtnText: { color: '#000', fontSize: 16, fontWeight: '800' },
  secondaryBtn: { paddingVertical: 18, alignItems: 'center', marginTop: 10 },
  secondaryBtnText: { color: '#888', fontSize: 14, fontWeight: '600' },
});
