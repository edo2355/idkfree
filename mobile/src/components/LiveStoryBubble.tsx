import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export function LiveStoryBubble({ userName, roomName, isHost }: any) {
  const navigation = useNavigation<any>();

  return (
    <TouchableOpacity 
      style={styles.container}
      onPress={() => navigation.navigate('LiveStream', { roomName, isHost })}
    >
      {/* Botón Táctico Cuadrado */}
      <View style={styles.tacticalSquare}>
        {/* El punto rojo de grabación */}
        <View style={styles.recDot} />
        {/* Esquinas tácticas */}
        <View style={[styles.corner, { top: 0, left: 0, borderTopWidth: 2, borderLeftWidth: 2 }]} />
        <View style={[styles.corner, { top: 0, right: 0, borderTopWidth: 2, borderRightWidth: 2 }]} />
        <View style={[styles.corner, { bottom: 0, left: 0, borderBottomWidth: 2, borderLeftWidth: 2 }]} />
        <View style={[styles.corner, { bottom: 0, right: 0, borderBottomWidth: 2, borderRightWidth: 2 }]} />
      </View>
      <Text style={styles.text}>[ EN VIVO ]</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', marginRight: 20 },
  tacticalSquare: {
    width: 70,
    height: 70,
    backgroundColor: '#0a0a0a',
    borderWidth: 1,
    borderColor: 'rgba(255, 0, 68, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  recDot: {
    width: 20,
    height: 20,
    backgroundColor: '#ff0044',
    borderRadius: 0, // Cuadrado, no redondo
  },
  corner: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderColor: '#ff0044', // Rojo táctico
  },
  text: {
    color: '#fff',
    fontFamily: 'monospace',
    fontSize: 10,
    letterSpacing: 1,
  }
});
