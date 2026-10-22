import { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, Image } from 'react-native';
import { idkAlert as Alert } from '../components/IDKAlert';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { CategorySelector } from '../components/CategorySelector';
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
  const [phoneNumber, setPhoneNumber] = useState(user?.phone_number || '');
  const [bio, setBio] = useState('');
  const [accountType, setAccountType] = useState('personal');
  const [category, setCategory] = useState('');
  const [links, setLinks] = useState<{title: string, url: string}[]>([]);
  
  const [avatar, setAvatar] = useState<string | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
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
        setAccountType(res.user.account_type ?? 'personal');
        setCategory(res.user.category ?? '');
        
        if (res.user.links) {
          try {
            setLinks(JSON.parse(res.user.links));
          } catch {}
        }

        const resolved = await resolveAssetUrl(res.user.avatar_url);
        setAvatarPreview(resolved);
      } catch {}
      setLoading(false);
    })();
  }, [user?.alias]);

  async function pickAvatar() {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) return Alert.alert('Permiso requerido', 'Necesitamos acceso a tu galería');
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.85,
      allowsEditing: true,
      aspect: [1, 1],
    });
    if (result.canceled) return;
    const asset = result.assets[0];
    setAvatarPreview(asset.uri);
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
      const resolved = await resolveAssetUrl(avatar);
      setAvatarPreview(resolved);
    }
    setUploading(false);
  }

  async function save(): Promise<boolean> {
    setSaving(true);
    try {
      const validLinks = links.filter(l => l.title.trim() && l.url.trim());
      await api.profile.update({
        name: name.trim() || null,
        bio: bio.trim() || null,
        avatar_url: avatar,
        account_type: accountType,
        category: accountType === 'personal' ? null : category.trim(),
        links: validLinks.length > 0 ? JSON.stringify(validLinks) : null,
      });
      setSaving(false);
      navigation.goBack();
      return true;
    } catch (e: any) {
      Alert.alert('Error', e?.message ?? 'No se pudo guardar');
      setSaving(false);
      return false;
    }
  }

  function updateLink(index: number, key: 'title' | 'url', value: string) {
    const newLinks = [...links];
    if (!newLinks[index]) newLinks[index] = { title: '', url: '' };
    newLinks[index][key] = value;
    setLinks(newLinks);
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
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 20, paddingTop: 60, paddingBottom: 40 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <TouchableOpacity onPress={() => navigation.goBack()}><Text style={{ color: theme.text, fontFamily: fonts.medium, fontSize: 15 }}>← Atrás</Text></TouchableOpacity>
          <TouchableOpacity onPress={save} disabled={saving || uploading}>
            <Text style={{ color: theme.text, fontFamily: fonts.medium, fontSize: 15 }}>{saving ? 'Guardando...' : 'Guardar'}</Text>
          </TouchableOpacity>
        </View>

        <Text style={{ fontSize: 24, color: theme.text, fontFamily: fonts.displayBoldItalic, marginBottom: 24 }}>Editar perfil</Text>

        {/* Avatar */}
        <View style={{ alignItems: 'center', marginBottom: 24 }}>
          <TouchableOpacity onPress={pickAvatar} disabled={uploading}>
            <View style={{ width: 110, height: 110, borderRadius: 55, backgroundColor: theme.surfaceElevated, borderWidth: 1, borderColor: theme.border, justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}>
              {avatarPreview ? <Image source={{ uri: avatarPreview }} style={{ width: '100%', height: '100%' }} /> : <Text style={{ color: theme.textMuted, fontSize: 32 }}>+</Text>}
              {uploading && <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', alignItems: 'center', justifyContent: 'center' }}><ActivityIndicator color="#FFF" /></View>}
            </View>
          </TouchableOpacity>
        </View>

        {/* Tipo de cuenta */}
        <Text style={{ color: theme.textMuted, fontFamily: fonts.medium, fontSize: 11, letterSpacing: 1.5, marginBottom: 6 }}>TIPO DE CUENTA</Text>
        <View style={{ flexDirection: 'row', gap: 8, marginBottom: 20 }}>
          {['personal', 'creator', 'business'].map(type => (
            <TouchableOpacity key={type} onPress={() => setAccountType(type)} style={{ flex: 1, paddingVertical: 10, alignItems: 'center', borderWidth: 1, borderRadius: 8, borderColor: accountType === type ? theme.accent : theme.border, backgroundColor: accountType === type ? 'rgba(168,85,247,0.1)' : 'transparent' }}>
              <Text style={{ color: accountType === type ? theme.accent : theme.text, fontFamily: fonts.medium, fontSize: 12, textTransform: 'capitalize' }}>{type === 'business' ? 'Empresa' : type === 'creator' ? 'Creador' : 'Personal'}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {accountType !== 'personal' && (
          <>
            <Text style={{ color: theme.textMuted, fontFamily: fonts.medium, fontSize: 11, letterSpacing: 1.5, marginBottom: 6 }}>CATEGORÍA</Text>
            <CategorySelector accountType={accountType} value={category} onChange={setCategory} />
          </>
        )}

        <Text style={{ color: theme.textMuted, fontFamily: fonts.medium, fontSize: 11, letterSpacing: 1.5, marginBottom: 6 }}>NOMBRE</Text>
        <TextInput value={name} onChangeText={setName} placeholder="Tu nombre" placeholderTextColor={theme.textSubtle} style={{ backgroundColor: theme.surface, color: theme.text, fontFamily: fonts.regular, fontSize: 15, padding: 14, borderRadius: 8, borderWidth: 1, borderColor: theme.border, marginBottom: 20 }} />

        <Text style={{ color: theme.textMuted, fontFamily: fonts.medium, fontSize: 11, letterSpacing: 1.5, marginBottom: 6 }}>BIO</Text>
        <TextInput value={bio} onChangeText={setBio} placeholder="Cuéntale algo al mundo" placeholderTextColor={theme.textSubtle} multiline maxLength={160} style={{ backgroundColor: theme.surface, color: theme.text, fontFamily: fonts.regular, fontSize: 15, padding: 14, borderRadius: 8, borderWidth: 1, borderColor: theme.border, marginBottom: 6, minHeight: 90, textAlignVertical: 'top' }} />

        <Text style={{ color: theme.textMuted, fontFamily: fonts.medium, fontSize: 11, letterSpacing: 1.5, marginBottom: 6, marginTop: 20 }}>ENLACES (Opcional)</Text>
        {[0, 1, 2].map(index => (
          <View key={index} style={{ flexDirection: 'row', gap: 8, marginBottom: 8 }}>
            <TextInput value={links[index]?.title || ''} onChangeText={(v) => updateLink(index, 'title', v)} placeholder="Título" placeholderTextColor={theme.textSubtle} style={{ flex: 1, backgroundColor: theme.surface, color: theme.text, padding: 10, borderRadius: 8, borderWidth: 1, borderColor: theme.border, fontSize: 13 }} />
            <TextInput value={links[index]?.url || ''} onChangeText={(v) => updateLink(index, 'url', v)} placeholder="https://..." placeholderTextColor={theme.textSubtle} style={{ flex: 2, backgroundColor: theme.surface, color: theme.text, padding: 10, borderRadius: 8, borderWidth: 1, borderColor: theme.border, fontSize: 13 }} />
          </View>
        ))}

        <View style={{ marginTop: 20 }}>
          <IDKButton size="lg" onPress={save}>GUARDAR CAMBIOS</IDKButton>
        </View>
      </ScrollView>
    </View>
  );
}
