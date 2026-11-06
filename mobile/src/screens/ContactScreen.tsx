import React from 'react';
import { View, Text, StyleSheet, Linking, TouchableOpacity, ScrollView } from 'react-native';

export function ContactScreen() {
  const handleEmail = () => {
    Linking.openURL('mailto:soporte@idkfree.app');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Contacto</Text>
      <Text style={styles.subtitle}>
        ¿Tienes alguna duda, sugerencia o necesitas soporte? Estamos para ayudarte.
      </Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Correo electrónico</Text>
        <Text style={styles.text}>
          Para consultas generales, soporte técnico o ejercicio de tus derechos de privacidad:
        </Text>
        <TouchableOpacity style={styles.button} onPress={handleEmail}>
          <Text style={styles.buttonText}>soporte@idkfree.app</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Reportar contenido</Text>
        <Text style={styles.text}>
          Si encontrás contenido que viola nuestros Términos de Uso (spam, acoso, contenido ilegal), podés reportarlo desde la misma publicación o escribiéndonos por correo.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Menores de edad</Text>
        <Text style={styles.text}>
          Si sos padre, madre o tutor legal y querés autorizar, revocar o consultar el uso de la cuenta de un menor a tu cargo, escribinos a soporte@idkfree.app indicando el alias del menor.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Eliminar tu cuenta</Text>
        <Text style={styles.text}>
          Podés solicitar la eliminación permanente de tu cuenta y todos tus datos escribiendo a soporte@idkfree.app desde el correo asociado a tu cuenta. Procesamos estas solicitudes en un plazo máximo de 30 días.
        </Text>
      </View>

      <Text style={styles.footer}>
        Respondemos en un plazo de 24 a 72 horas hábiles.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#050505' },
  content: { padding: 20, paddingBottom: 60 },
  title: { color: '#00e5ff', fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  subtitle: { color: '#d0d0d0', fontSize: 15, lineHeight: 22, marginBottom: 30 },
  section: { marginBottom: 28 },
  sectionTitle: { color: '#fff', fontSize: 17, fontWeight: 'bold', marginBottom: 8 },
  text: { color: '#d0d0d0', fontSize: 14, lineHeight: 22 },
  button: {
    marginTop: 12,
    backgroundColor: 'rgba(0,229,255,0.1)',
    borderWidth: 1,
    borderColor: '#00e5ff',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  buttonText: { color: '#00e5ff', fontWeight: 'bold', fontSize: 15 },
  footer: { color: '#666', fontSize: 12, textAlign: 'center', marginTop: 20, fontStyle: 'italic' },
});
