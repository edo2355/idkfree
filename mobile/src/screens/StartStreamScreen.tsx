import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../stores/themeStore';
import { fonts } from '../theme/fonts';
import { api } from '../api/client';
import { ScreenBackground } from '../components/ScreenBackground';

export function StartStreamScreen() {
  const theme = useTheme();
  const navigation = useNavigation<any>();
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleStart() {
    if (!title.trim()) return;
    setLoading(true);
    try {
      // 1. Le pedimos al backend que cree la sala del stream
      const res = await api.streams.start(title.trim());
      
      // 2. Navegamos a la pantalla de la cámara con el ID de la sala
      navigation.navigate('LiveStream', { 
        roomName: res.id || res.stream?.id, 
        isHost: true 
      });
    } catch (err: any) {
      alert(err?.message || 'Error al iniciar la transmisión');
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={{ flex: 1, backgroundColor: theme.bg, padding: 20, justifyContent: 'center' }}>
      <ScreenBackground variant="radio" />
      <Text style={{ color: theme.text, fontFamily: fonts.displayBoldItalic, fontSize: 32, marginBottom: 8 }}>
        Configurar Directo
      </Text>
      <Text style={{ color: theme.textMuted, fontFamily: fonts.regular, fontSize: 14, marginBottom: 30 }}>
        Ponle un título a tu transmisión para que la gente sepa de qué hablas.
      </Text>

      <TextInput
        value={title}
        onChangeText={setTitle}
        placeholder="Ej: Hablando de la vida en IDKFREE..."
        placeholderTextColor={theme.textSubtle}
        style={{
          backgroundColor: theme.surface,
          color: theme.text,
          fontFamily: fonts.regular,
          padding: 16,
          borderRadius: 12,
          borderWidth: 1,
          borderColor: theme.border,
          fontSize: 16,
          marginBottom: 24,
        }}
      />

      <TouchableOpacity
        onPress={handleStart}
        disabled={loading || !title.trim()}
        style={{
          backgroundColor: title.trim() ? theme.danger : theme.surface,
          padding: 16,
          borderRadius: 12,
          alignItems: 'center',
        }}
      >
        {loading ? (
          <ActivityIndicator color="#FFF" />
        ) : (
          <Text style={{ color: title.trim() ? '#FFF' : theme.textMuted, fontFamily: fonts.medium, fontSize: 16 }}>
            🔴 Iniciar Transmisión
          </Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginTop: 20, alignItems: 'center' }}>
        <Text style={{ color: theme.textMuted, fontFamily: fonts.regular }}>Cancelar</Text>
      </TouchableOpacity>
    </View>
  );
}
