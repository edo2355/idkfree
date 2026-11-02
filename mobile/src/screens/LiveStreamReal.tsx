import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function LiveStreamReal() {
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>🚧</Text>
      <Text style={styles.title}>Transmisión en Vivo</Text>
      <Text style={styles.subtitle}>
        Esta función está desactivada temporalmente mientras actualizamos el sistema de video.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#050505',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  icon: {
    fontSize: 60,
    marginBottom: 20,
  },
  title: {
    color: '#00e5ff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    color: '#a0a0a0',
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
});
