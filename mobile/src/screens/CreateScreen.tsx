import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, Image, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { useTheme } from '../stores/themeStore';
import { fonts } from '../theme/fonts';
import { api } from '../api/client';
import { HeaderBar } from '../components/HeaderBar';

export function CreateScreen() {
  const theme = useTheme();
  const navigation = useNavigation<any>();
  const [body, setBody] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [posting, setPosting] = useState(false);
  const [uploading, setUploading] = useState(false);

  async function pickImage() {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      Alert.alert('Permiso requerido', 'Necesitamos acceso a tu galería');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.85,
      allowsEditing: true,
    });
    if (result.canceled) return;
    const asset = result.assets[0];
    setImageUri(asset.uri);
    // Subir al backend
    setUploading(true);
    try {
      const res = await api.uploads.upload({
        uri: asset.uri,
        name: asset.fileName ?? `photo-${Date.now()}.jpg`,
        type: asset.mimeType ?? 'image/jpeg',
      });
      setUploadedUrl(res.url);
    } catch (e: any) {
      Alert.alert('Error', e?.message ?? 'No se pudo subir la imagen');
      setImageUri(null);
    }
    setUploading(false);
  }

  function removeImage() {
    setImageUri(null);
    setUploadedUrl(null);
  }

  async function handlePublish() {
    if (!body.trim() && !uploadedUrl) return;
    setPosting(true);
    try {
      await api.posts.create({
        body: body.trim() || null,
        imageUrl: uploadedUrl,
        visibility: 'followers',
      });
      setBody('');
      setImageUri(null);
      setUploadedUrl(null);
      navigation.navigate('Feed');
    } catch (e: any) {
      Alert.alert('Error', e?.message ?? 'No se pudo publicar');
    }
    setPosting(false);
  }

  const canPublish = (body.trim() || uploadedUrl) && !posting && !uploading;

  return (
    <View style={{ flex: 1, backgroundColor: theme.bg }}>
      <HeaderBar />
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <Text style={{ fontSize: 22, color: theme.text, fontFamily: fonts.displayBoldItalic, letterSpacing: 0.5, marginBottom: 4 }}>
          Crear
        </Text>
        <Text style={{ color: theme.textMuted, fontFamily: fonts.regular, fontSize: 13, marginBottom: 20 }}>
          Comparte algo con tu comunidad
        </Text>

        <TextInput
          value={body}
          onChangeText={setBody}
          placeholder="¿Qué estás pensando?"
          placeholderTextColor={theme.textSubtle}
          multiline
          style={{
            backgroundColor: theme.surface,
            color: theme.text,
            fontFamily: fonts.regular,
            fontSize: 15,
            padding: 16,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: theme.border,
            minHeight: 120,
            textAlignVertical: 'top',
            marginBottom: 16,
          }}
        />

        {/* Preview imagen */}
        {imageUri && (
          <View style={{ position: 'relative', marginBottom: 16 }}>
            <Image
              source={{ uri: imageUri }}
              style={{ width: '100%', height: 260, borderRadius: 12 }}
              resizeMode="cover"
            />
            {uploading && (
              <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: 12, alignItems: 'center', justifyContent: 'center' }}>
                <ActivityIndicator color="#FFFFFF" />
                <Text style={{ color: '#FFFFFF', fontFamily: fonts.medium, fontSize: 13, marginTop: 8 }}>Subiendo...</Text>
              </View>
            )}
            {!uploading && (
              <TouchableOpacity
                onPress={removeImage}
                activeOpacity={0.7}
                style={{ position: 'absolute', top: 10, right: 10, width: 32, height: 32, borderRadius: 16, backgroundColor: 'rgba(0,0,0,0.7)', alignItems: 'center', justifyContent: 'center' }}
              >
                <Text style={{ color: '#FFFFFF', fontSize: 18, lineHeight: 18 }}>×</Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* Botones de acción */}
        <Text style={{ color: theme.textMuted, fontFamily: fonts.medium, fontSize: 11, letterSpacing: 1.5, marginBottom: 10 }}>
          AÑADIR
        </Text>
        <View style={{ flexDirection: 'row', gap: 10, marginBottom: 24 }}>
          <TouchableOpacity
            onPress={pickImage}
            activeOpacity={0.7}
            style={{
              flex: 1,
              aspectRatio: 1,
              borderRadius: 12,
              backgroundColor: theme.surface,
              borderWidth: 1,
              borderColor: theme.border,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text style={{ fontSize: 32, marginBottom: 6 }}>📷</Text>
            <Text style={{ color: theme.text, fontFamily: fonts.medium, fontSize: 12 }}>Foto</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate('Vibes')}
            activeOpacity={0.7}
            style={{
              flex: 1,
              aspectRatio: 1,
              borderRadius: 12,
              backgroundColor: theme.surface,
              borderWidth: 1,
              borderColor: theme.border,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text style={{ fontSize: 32, marginBottom: 6 }}>✨</Text>
            <Text style={{ color: theme.text, fontFamily: fonts.medium, fontSize: 12 }}>Vibe</Text>
          </TouchableOpacity>

          <View
            style={{
              flex: 1,
              aspectRatio: 1,
              borderRadius: 12,
              backgroundColor: theme.surface,
              borderWidth: 1,
              borderColor: theme.border,
              alignItems: 'center',
              justifyContent: 'center',
              opacity: 0.4,
            }}
          >
            <Text style={{ fontSize: 32, marginBottom: 6 }}>🎥</Text>
            <Text style={{ color: theme.text, fontFamily: fonts.medium, fontSize: 12 }}>Video</Text>
            <Text style={{ color: theme.textSubtle, fontFamily: fonts.regular, fontSize: 9, marginTop: 2 }}>Pronto</Text>
          </View>
        </View>

        <TouchableOpacity
          onPress={handlePublish}
          disabled={!canPublish}
          activeOpacity={0.7}
          style={{
            paddingVertical: 16,
            borderRadius: 10,
            alignItems: 'center',
            backgroundColor: canPublish ? theme.text : theme.surface,
          }}
        >
          {posting ? (
            <ActivityIndicator color={theme.bg} />
          ) : (
            <Text style={{ color: canPublish ? theme.bg : theme.textMuted, fontFamily: fonts.medium, fontSize: 15 }}>
              Publicar
            </Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
