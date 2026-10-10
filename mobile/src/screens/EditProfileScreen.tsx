import { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../stores/themeStore';
import { fonts } from '../theme/fonts';
import { useAuthStore } from '../stores/authStore';
import { api } from '../api/client';

export function EditProfileScreen() {
  const theme = useTheme();
  const navigation = useNavigation<any>();
  const { user } = useAuthStore();

  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [avatar, setAvatar] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      if (!user) return;
      try {
        const res = await api.profile.get(user.alias);
        setName(res.user.name ?? '');
        setBio(res.user.bio ?? '');
        setAvatar(res.user.avatar_url ?? '');
      } catch {}
      setLoading(false);
    })();
  }, [user?.alias]);

  async function save() {
    setSaving(true);
    try {
      await api.profile.update({ name: name.trim() || null, bio: bio.trim() || null, avatar_url: avatar.trim() || null });
      navigation.goBack();
    } catch (e: any) {
      Alert.alert('Error', e?.message ?? 'No se pudo guardar');
    }
    setSaving(false);
  }

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: theme.bg, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator color={theme.text} />
      </View>
    );
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: theme.bg }} contentContainerStyle={{ padding: 20, paddingTop: 60 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.6}>
          <Text style={{ color: theme.text, fontFamily: fonts.medium, fontSize: 15 }}>← Atrás</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={save} disabled={saving} activeOpacity={0.6}>
          <Text style={{ color: theme.text, fontFamily: fonts.medium, fontSize: 15 }}>
            {saving ? 'Guardando...' : 'Guardar'}
          </Text>
        </TouchableOpacity>
      </View>

      <Text style={{ fontSize: 24, color: theme.text, fontFamily: fonts.displayBoldItalic, marginBottom: 24 }}>
        Editar perfil
      </Text>

      <Text style={{ color: theme.textMuted, fontFamily: fonts.medium, fontSize: 11, letterSpacing: 1.5, marginBottom: 6 }}>NOMBRE</Text>
      <TextInput
        value={name}
        onChangeText={setName}
        placeholder="Tu nombre"
        placeholderTextColor={theme.textSubtle}
        style={{ backgroundColor: theme.surface, color: theme.text, fontFamily: fonts.regular, fontSize: 15, padding: 14, borderRadius: 8, borderWidth: 1, borderColor: theme.border, marginBottom: 20 }}
      />

      <Text style={{ color: theme.textMuted, fontFamily: fonts.medium, fontSize: 11, letterSpacing: 1.5, marginBottom: 6 }}>BIO</Text>
      <TextInput
        value={bio}
        onChangeText={setBio}
        placeholder="Cuéntale algo al mundo"
        placeholderTextColor={theme.textSubtle}
        multiline
        maxLength={160}
        style={{ backgroundColor: theme.surface, color: theme.text, fontFamily: fonts.regular, fontSize: 15, padding: 14, borderRadius: 8, borderWidth: 1, borderColor: theme.border, marginBottom: 6, minHeight: 90, textAlignVertical: 'top' }}
      />
      <Text style={{ color: theme.textSubtle, fontFamily: fonts.regular, fontSize: 11, marginBottom: 20, alignSelf: 'flex-end' }}>
        {bio.length}/160
      </Text>

      <Text style={{ color: theme.textMuted, fontFamily: fonts.medium, fontSize: 11, letterSpacing: 1.5, marginBottom: 6 }}>AVATAR (URL)</Text>
      <TextInput
        value={avatar}
        onChangeText={setAvatar}
        placeholder="https://..."
        placeholderTextColor={theme.textSubtle}
        autoCapitalize="none"
        keyboardType="url"
        style={{ backgroundColor: theme.surface, color: theme.text, fontFamily: fonts.regular, fontSize: 15, padding: 14, borderRadius: 8, borderWidth: 1, borderColor: theme.border, marginBottom: 20 }}
      />

      <TouchableOpacity onPress={save} disabled={saving} activeOpacity={0.7} style={{ backgroundColor: theme.text, paddingVertical: 14, borderRadius: 8, alignItems: 'center', marginTop: 20 }}>
        {saving ? <ActivityIndicator color={theme.bg} /> : (
          <Text style={{ color: theme.bg, fontFamily: fonts.medium, fontSize: 15 }}>Guardar cambios</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}
