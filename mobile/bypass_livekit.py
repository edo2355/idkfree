import os

# 1. Comentar registerGlobals en index.ts y App.tsx
for file_path in ['mobile/index.ts', 'mobile/App.tsx']:
    if os.path.exists(file_path):
        with open(file_path, 'r') as f:
            content = f.read()
        content = content.replace("import { registerGlobals } from '@livekit/react-native';", "// import { registerGlobals } from '@livekit/react-native';")
        content = content.replace("registerGlobals();", "// registerGlobals();")
        with open(file_path, 'w') as f:
            f.write(content)
        print(f"✅ {file_path} modificado (LiveKit bypass).")

# 2. Crear pantallas falsas para LiveStream y Call
dummy_screen = """import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export function {comp_name}() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>LiveKit deshabilitado en Expo Go</Text>
      <Text style={styles.subtext}>Usa la APK compilada para ver el video.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0a', justifyContent: 'center', alignItems: 'center' },
  text: { color: '#00E5FF', fontSize: 18, fontWeight: 'bold' },
  subtext: { color: '#ffffff', marginTop: 10, opacity: 0.7 }
});
"""

# Sobrescribir LiveStreamScreen
with open('mobile/src/screens/LiveStreamScreen.tsx', 'w') as f:
    f.write(dummy_screen.replace('{comp_name}', 'LiveStreamScreen'))
print("✅ LiveStreamScreen.tsx reemplazado temporalmente.")

# Sobrescribir CallScreen
with open('mobile/src/screens/CallScreen.tsx', 'w') as f:
    f.write(dummy_screen.replace('{comp_name}', 'CallScreen'))
print("✅ CallScreen.tsx reemplazado temporalmente.")

print("\n🚀 ¡Listo! LiveKit ha sido temporalmente desactivado para Expo Go.")
