import { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, Image } from 'react-native';
import { idkAlert as Alert } from '../components/IDKAlert';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { useTheme } from '../stores/themeStore';
import { fonts } from '../theme/fonts';
import { useAuthStore } from '../stores/authStore';
import { api } from '../api/client';
import { resolveAssetUrl } from '../utils/assetUrl';
import { ScreenBackground } from '../components/ScreenBackground';
import { IDKButton } from '../components/IDKButton';

export function EditProfileScreen() {
  const theme = useTheme();
  const navigation = useNavigation<any>();
  const { user } = useAuthStore();

  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [avatar, setAvatar] = useState<string | null>(null); // URL guardada
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null); // URI local o URL resuelta
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    (async () => {
      if (!user) return;
      try {
        const res = await api.profile.get(user.alias);
        setName(res.user.name ?? '');
        setBio(res.user.bio ?? '');
        setAvatar(res.user.avatar_url ?? null);
        const resolved = await resolveAssetUrl(res.user.avatar_url);
        setAvatarPreview(resolved);
      } catch {}
      setLoading(false);
    })();
  }, [user?.alias]);

  async function pickAvatar() {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      Alert.alert('Permiso requerido', 'Necesitamos acceso a tu galería');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.85,
      allowsEditing: true,
      aspect: [1, 1],
    });
    if (result.canceled) return;
    const asset = result.assets[0];
    setAvatarPreview(asset.uri);
    // Subir al backend
    setUploading(true);
    try {
      const res = await api.uploads.upload({
        uri: asset.uri,
        name: asset.fileName ?? `avatar-${Date.now()}.jpg`,
        type: asset.mimeType ?? 'image/jpeg',
      });
      setAvatar(res.url);
    } catch (e: any) {
      Alert.alert('Error', e?.message ?? 'No se pudo subir la imagen');
      // Revertir preview
      const resolved = await resolveAssetUrl(avatar);
      setAvatarPreview(resolved);
    }
    setUploading(false);
  }

  async function removeAvatar() {
    setAvatar(null);
    setAvatarPreview(null);
  }

  async function save(): Promise<boolean> {
    setSaving(true);
    try {
      await api.profile.update({
        name: name.trim() || null,
        bio: bio.trim() || null,
        avatar_url: avatar,
      });
      setSaving(false);
      return true;
    } catch (e: any) {
      Alert.alert('Error', e?.message ?? 'No se pudo guardar');
      setSaving(false);
      return false;
    }
  }

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: theme.bg, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator color={theme.text} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: theme.bg }}>
      <ScreenBackground variant="topo" />
      <ScrollView style={{ flex: 1, backgroundColor: theme.bg }} contentContainerStyle={{ padding: 20, paddingTop: 60, paddingBottom: 40 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.6}>
          <Text style={{ color: theme.text, fontFamily: fonts.medium, fontSize: 15 }}>← Atrás</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={save} disabled={saving || uploading} activeOpacity={0.6}>
          <Text style={{ color: theme.text, fontFamily: fonts.medium, fontSize: 15 }}>
            {saving ? 'Guardando...' : 'Guardar'}
          </Text>
        </TouchableOpacity>
      </View>

      <Text style={{ fontSize: 24, color: theme.text, fontFamily: fonts.displayBoldItalic, marginBottom: 24 }}>
        Editar perfil
      </Text>

      {/* Avatar */}
      <View style={{ alignItems: 'center', marginBottom: 24 }}>
        <TouchableOpacity onPress={pickAvatar} activeOpacity={0.8} disabled={uploading}>
          <View
            style={{
              width: 110,
              height: 110,
              borderRadius: 55,
              backgroundColor: theme.surfaceElevated,
              borderWidth: 1,
              borderColor: theme.border,
              justifyContent: 'center',
              alignItems: 'center',
              overflow: 'hidden',
            }}
          >
            {avatarPreview ? (
              <Image source={{ uri: avatarPreview }} style={{ width: '100%', height: '100%' }} />
            ) : (
              <Text style={{ color: theme.textMuted, fontSize: 32 }}>+</Text>
            )}
            {uploading ? (
              <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', alignItems: 'center', justifyContent: 'center' }}>
                <ActivityIndicator color="#FFFFFF" />
              </View>
            ) : null}
          </View>
        </TouchableOpacity>
        <Text style={{ color: theme.textMuted, fontFamily: fonts.regular, fontSize: 12, marginTop: 10 }}>
          Toca para cambiar la foto
        </Text>
        {avatar ? (
          <TouchableOpacity onPress={removeAvatar} activeOpacity={0.7} style={{ marginTop: 8 }}>
            <Text style={{ color: theme.danger, fontFamily: fonts.medium, fontSize: 12 }}>
              Quitar foto
            </Text>
          </TouchableOpacity>
        ) : null}
      </View>

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

      <View style={{ marginTop: 20 }}>
        <IDKButton size="lg" onPress={save}>
          GUARDAR CAMBIOS
        </IDKButton>
      </View>
    </ScrollView>
  </View>
  );
}
