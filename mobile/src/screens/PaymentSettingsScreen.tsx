import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { api } from '../api/client';

type Gateway = 'qvapay' | 'transfermovil' | 'recharge' | 'stripe' | 'mercadopago' | 'paypal';

export function PaymentSettingsScreen() {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const [selectedGateway, setSelectedGateway] = useState<Gateway | null>(null);

  const [qvapayUser, setQvapayUser] = useState('');
  const [transfermovilPhone, setTransfermovilPhone] = useState('');
  const [transfermovilCard, setTransfermovilCard] = useState('');
  const [rechargePhone, setRechargePhone] = useState('');
  const [stripeEmail, setStripeEmail] = useState('');
  const [mpEmail, setMpEmail] = useState('');
  const [paypalEmail, setPaypalEmail] = useState('');

  async function saveManualAccount() {
    try {
      let accountData = '';
      if (selectedGateway === 'qvapay') accountData = qvapayUser;
      else if (selectedGateway === 'transfermovil') accountData = transfermovilCard;
      else if (selectedGateway === 'recharge') accountData = rechargePhone;

      if (!accountData) return Alert.alert('ERROR', 'El campo está vacío.');

      await api.post('/payments/accounts', { provider: selectedGateway, account_data: accountData });
      Alert.alert('SISTEMA', 'Cuenta guardada correctamente en el servidor.');
    } catch (e) {
      Alert.alert('ERROR', 'No se pudo guardar la cuenta.');
    }
  }

  function startOAuthFlow(provider: string) {
    Alert.alert(
      'VINCULACIÓN SEGURA',
      `Serás redirigido al sitio de ${provider} para autorizar el cobro de tus ventas.\n\nAl finalizar, tu cuenta quedará enlazada automáticamente.`
    );
    // En el futuro, aquí se llamará al backend para generar la URL de OAuth y abrir el navegador.
  }

  const gateways: { id: Gateway; label: string; code: string }[] = [
    { id: 'qvapay', label: 'QVAPAY', code: '[ Q ]' },
    { id: 'transfermovil', label: 'TRANSFERMÓVIL', code: '[ TM ]' },
    { id: 'recharge', label: 'RECARGA MÓVIL', code: '[ R ]' },
    { id: 'stripe', label: 'STRIPE', code: '[ S ]' },
    { id: 'mercadopago', label: 'MERCADO PAGO', code: '[ MP ]' },
    { id: 'paypal', label: 'PAYPAL', code: '[ P ]' },
  ];

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.hud}>
        <Text style={styles.hudTitle}>[ CUENTAS DE COBRO ]</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.hudClose}>[ X ]</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <Text style={styles.description}>
          Elige una pasarela para enlazar tu cuenta de cobro. Los fondos de tus ventas se enviarán directamente a la cuenta que configures.
        </Text>

        <View style={styles.gatewaysContainer}>
          {gateways.map((gw) => (
            <TouchableOpacity
              key={gw.id}
              style={[styles.gatewayBtn, selectedGateway === gw.id && styles.gatewayBtnActive]}
              onPress={() => setSelectedGateway(gw.id)}
            >
              <View style={styles.logoContainer}>
                <Text style={styles.logoText}>{gw.code}</Text>
              </View>
              <Text style={[styles.gatewayText, selectedGateway === gw.id && { color: '#fff' }]}>{gw.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* --- FORMULARIOS --- */}

        {selectedGateway === 'qvapay' && (
          <View style={styles.formContainer}>
            <Text style={styles.formTitle}>[ CONFIGURAR QVAPAY ]</Text>
            <Text style={styles.label}>USUARIO DE QVAPAY</Text>
            <TextInput style={styles.input} placeholder="@tu_usuario" placeholderTextColor="#444" value={qvapayUser} onChangeText={setQvapayUser} autoCapitalize="none" />
            <Text style={styles.hint}>Ingresa tu usuario exacto de QvaPay. Los fondos se transferirán aquí en USD.</Text>
            <TouchableOpacity style={styles.saveBtn} onPress={saveManualAccount}>
              <Text style={styles.saveBtnText}>ENLAZAR QVAPAY</Text>
            </TouchableOpacity>
          </View>
        )}

        {selectedGateway === 'transfermovil' && (
          <View style={styles.formContainer}>
            <Text style={styles.formTitle}>[ CONFIGURAR TRANSFERMÓVIL ]</Text>
            <Text style={styles.label}>TELÉFONO (PAGO MÓVIL)</Text>
            <TextInput style={styles.input} placeholder="5XXXXXXX" placeholderTextColor="#444" value={transfermovilPhone} onChangeText={setTransfermovilPhone} keyboardType="numeric" />
            <Text style={styles.label}>TARJETA (16 DÍGITOS)</Text>
            <TextInput style={styles.input} placeholder="9226 XXXX XXXX XXXX" placeholderTextColor="#444" value={transfermovilCard} onChangeText={setTransfermovilCard} keyboardType="numeric" />
            <Text style={styles.hint}>Los fondos se enviarán en CUP a esta tarjeta o teléfono.</Text>
            <TouchableOpacity style={styles.saveBtn} onPress={saveManualAccount}>
              <Text style={styles.saveBtnText}>ENLAZAR TRANSFERMÓVIL</Text>
            </TouchableOpacity>
          </View>
        )}

        {selectedGateway === 'recharge' && (
          <View style={styles.formContainer}>
            <Text style={styles.formTitle}>[ CONFIGURAR RECARGA MÓVIL ]</Text>
            <Text style={styles.label}>NÚMERO DE TELÉFONO CUBANO</Text>
            <TextInput style={styles.input} placeholder="5XXXXXXX" placeholderTextColor="#444" value={rechargePhone} onChangeText={setRechargePhone} keyboardType="numeric" />
            <Text style={styles.hint}>Recibirás el pago en forma de recarga de saldo (ETECSA/Nauta).</Text>
            <TouchableOpacity style={styles.saveBtn} onPress={saveManualAccount}>
              <Text style={styles.saveBtnText}>ENLAZAR RECARGA</Text>
            </TouchableOpacity>
          </View>
        )}

        {selectedGateway === 'stripe' && (
          <View style={styles.formContainer}>
            <Text style={styles.formTitle}>[ CONECTAR CON STRIPE ]</Text>
            <Text style={styles.label}>CORREO ELECTRÓNICO</Text>
            <TextInput style={styles.input} placeholder="tu@correo.com" placeholderTextColor="#444" value={stripeEmail} onChangeText={setStripeEmail} keyboardType="email-address" autoCapitalize="none" />
            <Text style={styles.hint}>Serás redirigido a Stripe para completar la verificación de tu cuenta.</Text>
            <TouchableOpacity style={styles.saveBtn} onPress={() => startOAuthFlow('Stripe')}>
              <Text style={styles.saveBtnText}>CONECTAR CON STRIPE</Text>
            </TouchableOpacity>
          </View>
        )}

        {selectedGateway === 'mercadopago' && (
          <View style={styles.formContainer}>
            <Text style={styles.formTitle}>[ CONECTAR CON MERCADO PAGO ]</Text>
            <Text style={styles.label}>CORREO ELECTRÓNICO</Text>
            <TextInput style={styles.input} placeholder="tu@correo.com" placeholderTextColor="#444" value={mpEmail} onChangeText={setMpEmail} keyboardType="email-address" autoCapitalize="none" />
            <Text style={styles.hint}>Serás redirigido a Mercado Pago para autorizar el cobro de tus ventas.</Text>
            <TouchableOpacity style={styles.saveBtn} onPress={() => startOAuthFlow('Mercado Pago')}>
              <Text style={styles.saveBtnText}>CONECTAR CON MERCADO PAGO</Text>
            </TouchableOpacity>
          </View>
        )}

        {selectedGateway === 'paypal' && (
          <View style={styles.formContainer}>
            <Text style={styles.formTitle}>[ CONECTAR CON PAYPAL ]</Text>
            <Text style={styles.label}>CORREO ELECTRÓNICO</Text>
            <TextInput style={styles.input} placeholder="tu@correo.com" placeholderTextColor="#444" value={paypalEmail} onChangeText={setPaypalEmail} keyboardType="email-address" autoCapitalize="none" />
            <Text style={styles.hint}>Serás redirigido a PayPal para vincular tu cuenta de vendedor.</Text>
            <TouchableOpacity style={styles.saveBtn} onPress={() => startOAuthFlow('PayPal')}>
              <Text style={styles.saveBtnText}>CONECTAR CON PAYPAL</Text>
            </TouchableOpacity>
          </View>
        )}

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
  gatewaysContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 30, gap: 10 },
  gatewayBtn: { width: '31%', alignItems: 'center', padding: 10, borderWidth: 1, borderColor: '#222', marginBottom: 10 },
  gatewayBtnActive: { borderColor: '#fff', backgroundColor: '#111' },
  logoContainer: { width: 50, height: 50, backgroundColor: '#1a1a1a', justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
  logoText: { color: '#fff', fontFamily: 'monospace', fontSize: 14, fontWeight: 'bold' },
  gatewayText: { color: '#555', fontFamily: 'monospace', fontSize: 8, textAlign: 'center' },
  formContainer: { borderWidth: 1, borderColor: '#333', padding: 20, backgroundColor: '#0f0f0f' },
  formTitle: { color: '#fff', fontFamily: 'monospace', fontSize: 12, marginBottom: 20, fontWeight: 'bold' },
  label: { color: '#666', fontFamily: 'monospace', fontSize: 10, letterSpacing: 1, marginBottom: 8, marginTop: 15 },
  input: { backgroundColor: '#0a0a0a', borderWidth: 1, borderColor: '#333', color: '#fff', padding: 15, fontFamily: 'monospace', fontSize: 14 },
  hint: { color: '#444', fontFamily: 'monospace', fontSize: 10, marginTop: 8, lineHeight: 14 },
  saveBtn: { backgroundColor: '#fff', padding: 15, alignItems: 'center', marginTop: 30 },
  saveBtnText: { color: '#000', fontFamily: 'monospace', fontWeight: 'bold', fontSize: 12 },
});
