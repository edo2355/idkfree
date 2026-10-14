import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../stores/themeStore';
import { fonts } from '../theme/fonts';
import { api } from '../api/client';
import { ScreenBackground } from '../components/ScreenBackground';

export function ChangePasswordScreen() {
  const theme = useTheme();
  const navigation = useNavigation<any>();
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  async function save() {
    setError('');
    if (next.length < 8) { setError('Mínimo 8 caracteres'); return; }
    if (next !== confirm) { setError('Las contraseñas no coinciden'); return; }
    setSaving(true);
    try {
      await api.profile.changePassword(current, next);
      Alert.alert('Listo', 'Contraseña actualizada');
      navigation.goBack();
    } catch (e: any) {
      setError(e?.message ?? 'No se pudo cambiar');
    }
    setSaving(false);
  }

  const inputStyle = {
    backgroundColor: theme.surface,
    color: theme.text,
    fontFamily: fonts.regular,
    fontSize: 15,
    padding: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.border,
    marginBottom: 16,
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.bg }}>
      <ScreenBackground variant="pulse" />
      <ScrollView style={{ flex: 1, backgroundColor: theme.bg }} contentContainerStyle={{ padding: 20, paddingTop: 60, paddingBottom: 40 }}>
      <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.6} style={{ marginBottom: 24 }}>
        <Text style={{ color: theme.text, fontFamily: fonts.medium, fontSize: 15 }}>← Atrás</Text>
      </TouchableOpacity>

      <Text style={{ fontSize: 26, color: theme.text, fontFamily: fonts.displayBoldItalic, letterSpacing: 0.5, marginBottom: 24 }}>
        Cambiar contraseña
      </Text>

      <Text style={{ color: theme.textMuted, fontFamily: fonts.medium, fontSize: 11, letterSpacing: 1.5, marginBottom: 6 }}>CONTRASEÑA ACTUAL</Text>
      <TextInput value={current} onChangeText={setCurrent} secureTextEntry placeholder="••••••••" placeholderTextColor={theme.textSubtle} style={inputStyle} />

      <Text style={{ color: theme.textMuted, fontFamily: fonts.medium, fontSize: 11, letterSpacing: 1.5, marginBottom: 6 }}>NUEVA CONTRASEÑA</Text>
      <TextInput value={next} onChangeText={setNext} secureTextEntry placeholder="Mínimo 8 caracteres" placeholderTextColor={theme.textSubtle} style={inputStyle} />

      <Text style={{ color: theme.textMuted, fontFamily: fonts.medium, fontSize: 11, letterSpacing: 1.5, marginBottom: 6 }}>CONFIRMAR NUEVA</Text>
      <TextInput value={confirm} onChangeText={setConfirm} secureTextEntry placeholder="Repite la contraseña" placeholderTextColor={theme.textSubtle} style={inputStyle} />

      {error ? <Text style={{ color: theme.danger, fontFamily: fonts.medium, fontSize: 13, marginBottom: 12 }}>{error}</Text> : null}

      <TouchableOpacity onPress={save} disabled={saving} activeOpacity={0.7} style={{ backgroundColor: theme.text, paddingVertical: 14, borderRadius: 8, alignItems: 'center', marginTop: 8 }}>
        {saving ? <ActivityIndicator color={theme.bg} /> : (
          <Text style={{ color: theme.bg, fontFamily: fonts.medium, fontSize: 15 }}>Guardar</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  </View>
  );
}
