import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>IDKMEDIA iOS</Text>
      <Text style={styles.subtitle}>Esqueleto listo para compilar en Mac</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#050505', alignItems: 'center', justifyContent: 'center' },
  title: { color: '#00E5FF', fontSize: 32, fontWeight: '900' },
  subtitle: { color: '#888', fontSize: 16, marginTop: 10 },
});
