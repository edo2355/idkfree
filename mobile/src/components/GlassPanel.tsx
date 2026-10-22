import { BlurView } from 'expo-blur';
import { View, StyleSheet, ViewStyle } from 'react-native';

interface GlassPanelProps {
  children: React.ReactNode;
  style?: ViewStyle;
  intensity?: number;
}

export function GlassPanel({ children, style, intensity = 40 }: GlassPanelProps) {
  return (
    <View style={[styles.container, style]}>
      <BlurView intensity={intensity} tint="dark" style={StyleSheet.absoluteFill} />
      <View style={styles.content}>
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    backgroundColor: 'rgba(20, 20, 20, 0.2)', // Un tinte oscuro sobre el blur
  },
  content: {
    padding: 20,
  }
});
