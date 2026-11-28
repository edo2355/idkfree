import React, { useState, useEf[200~cat << 'EOF' > src/screens/ProfileScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, Alert, Linking } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Settings, MapPin, Link as LinkIcon, Calendar, Send, CheckCircle2, Unlink } from 'lucide-react-native';
import { GlassCard } from '../components/ui/GlassCard';
import { useAuthStore } from '../stores/authStore';

const TELEGRAM_BOT_USERNAME = 'IDKMEDIA_Oficial_bot'; // Asegúrate que este sea el nombre

export function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const { token } = useAuthStore();
  
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [telegramLinked, setTelegramLinked] = useState(false);
  const [linkingTelegram, setLinkingTelegram] = useState(false);

  const API_URL = process.env.EXPO_PUBLIC_API_URL || 'https://idkfree.onrender.com/api';

  const fetchProfile = async () => {
    if (!token) return;
    try {
      const res = await fetch(`${API_URL}/social/profile`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setProfile(data);
        setTelegramLinked(!!data.telegram_chat_id);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [token]);

  const handleLinkTelegram = async () => {
    if (!profile) return;
    const url = `https://t.me/${TELEGRAM_BOT_USERNAME}?start=${profile.id}`;
    
    // Abrimos la app de Telegram o el navegador
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      Alert.alert('Error', 'No se pudo abrir Telegram');
      return;
    }

    setLinkingTelegram(true);
    Alert.alert('Instrucción', 'Ve a Telegram y presiona "Start" para vincular.');

    // Polling cada 3 segundos por 1 minuto
    let attempts = 0;
    const interval = setInterval(async () => {
      attempts++;
      const res = await fetch(`${API_URL}/telegram/status`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        if (data.linked) {
          setTelegramLinked(true);
          setLinkingTelegram(false);
          Alert.alert('¡Éxito!', 'Telegram vinculado exitosamente.');
          clearInterval(interval);
        }
      }
      if (attempts > 20) {
        clearInterval(interval);
        setLinkingTelegram(false);
      }
    }, 3000);
  };

  const handleUnlinkTelegram = () => {
    Alert.alert('Desvincular', '¿Estás seguro de que quieres desvincular tu Telegram?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Sí, desvincular', style: 'destructive', onPress: async () => {
          try {
            const res = await fetch(`${API_URL}/telegram/unlink`, {
              method: 'POST',
              headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) setTelegramLinked(false);
          } catch (e) { Alert.alert('Error', 'No se pudo desvincular'); }
      }}
    ]);
  };

  if (loading) {
    return <View style={styles.center}><ActivityIndicator size="large" color="#00E5FF" /></View>;
  }

  if (!profile) {
    return <View style={styles.center}><Text style={{ color: '#666' }}>No se pudo cargar el perfil.</Text></View>;
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView contentContainerStyle={styles.content}>
        
        {/* Banner */}
        <View style={styles.banner} />
        
        {/* Avatar y Datos Principales */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>{profile.alias?.charAt(0).toUpperCase() || 'U'}</Text>
          </View>
          <TouchableOpacity style={styles.editBtn}>
            <Settings size={16} color="#fff" />
            <Text style={styles.editBtnText}>Editar</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.name}>{profile.name || profile.alias}</Text>
          <Text style={styles.alias}>@{profile.alias}</Text>
          <Text style={styles.bio}>{profile.bio || 'Sin biografía aún.'}</Text>
          
          <View style={styles.metaRow}>
            <View style={styles.metaItem}><MapPin size={14} color="#888" /><Text style={styles.metaText}>La Habana, Cuba</Text></View>
            <View style={styles.metaItem}><Calendar size={14} color="#888" /><Text style={styles.metaText}>Se unió {new Date(profile.createdAt || Date.now()).toLocaleDateString()}</Text></View>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statItem}><Text style={styles.statNumber}>0</Text><Text style={styles.statLabel}>Posts</Text></View>
            <View style={styles.statItem}><Text style={styles.statNumber}>0</Text><Text style={styles.statLabel}>Seguidores</Text></View>
            <View style={styles.statItem}><Text style={styles.statNumber}>0</Text><Text style={styles.statLabel}>Siguiendo</Text></View>
          </View>
        </View>

        {/* Integración Telegram */}
        <Text style={styles.sectionTitle}>INTEGRACIONES</Text>
        <GlassCard style={styles.telegramCard} intensity={20}>
          <View style={styles.telegramInfo}>
            <View style={styles.telegramIconBg}>
              <Send size={24} color="#3B82F6" />
            </View>
            <View style={styles.telegramTextContainer}>
              <Text style={styles.telegramTitle}>Bot de Telegram</Text>
              <Text style={styles.telegramDesc}>
                {telegramLinked ? 'Vinculado. Recibirás notificaciones.' : 'Vincula tu cuenta para notificaciones.'}
              </Text>
            </View>
          </View>

          {telegramLinked ? (
            <View style={styles.telegramActions}>
              <View style={styles.linkedBadge}>
                <CheckCircle2 size={14} color="#22C55E" />
                <Text style={styles.linkedBadgeText}>VINCULADO</Text>
              </View>
              <TouchableOpacity onPress={handleUnlinkTelegram} style={styles.unlinkBtn}>
                <Unlink size={18} color="#FF3B30" />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity style={styles.linkBtn} onPress={handleLinkTelegram} disabled={linkingTelegram}>
              {linkingTelegram ? <ActivityIndicator size="small" color="#fff" /> : <Send size={16} color="#fff" />}
              <Text style={styles.linkBtnText}>{linkingTelegram ? 'ESPERANDO...' : 'VINCULAR'}</Text>
            </TouchableOpacity>
          )}
        </GlassCard>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#050505' },
  content: { paddingBottom: 40 },
  center: { flex: 1, backgroundColor: '#050505', justifyContent: 'center', alignItems: 'center' },
  
  banner: { height: 120, backgroundColor: '#0055FF', opacity: 0.3 },
  profileHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', paddingHorizontal: 20, marginTop: -40 },
  avatarContainer: { width: 90, height: 90, borderRadius: 45, backgroundColor: '#050505', borderWidth: 4, borderColor: '#0a0a0a', alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: '#00E5FF', fontSize: 36, fontWeight: '900' },
  editBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.1)', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, gap: 6 },
  editBtnText: { color: '#fff', fontSize: 13, fontWeight: '600' },

  infoContainer: { paddingHorizontal: 20, marginTop: 10 },
  name: { color: '#fff', fontSize: 24, fontWeight: '800' },
  alias: { color: '#00E5FF', fontSize: 15, fontWeight: '600', marginBottom: 10 },
  bio: { color: '#ccc', fontSize: 14, lineHeight: 20, marginBottom: 15 },
  metaRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 15, marginBottom: 20 },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  metaText: { color: '#888', fontSize: 12 },

  statsRow: { flexDirection: 'row', justifyContent: 'space-around', borderTopWidth: 1, borderBottomWidth: 1, borderColor: 'rgba(255,255,255,0.05)', paddingVertical: 15, marginBottom: 20 },
  statItem: { alignItems: 'center' },
  statNumber: { color: '#fff', fontSize: 18, fontWeight: '800' },
  statLabel: { color: '#888', fontSize: 12, marginTop: 2 },

  sectionTitle: { color: '#888', fontSize: 12, fontWeight: '700', letterSpacing: 1.5, marginHorizontal: 20, marginBottom: 10, marginTop: 10 },
  telegramCard: { marginHorizontal: 20, padding: 16, flexDirection: 'column', gap: 16 },
  telegramInfo: { flexDirection: 'row', alignItems: 'center', gap: 15 },
  telegramIconBg: { width: 50, height: 50, borderRadius: 25, backgroundColor: 'rgba(59, 130, 246, 0.1)', alignItems: 'center', justifyContent: 'center' },
  telegramTextContainer: { flex: 1 },
  telegramTitle: { color: '#fff', fontSize: 16, fontWeight: '700' },
  telegramDesc: { color: '#888', fontSize: 12, marginTop: 4 },
  
  telegramActions: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  linkedBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(34, 197, 94, 0.1)', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 12 },
  linkedBadgeText: { color: '#22C55E', fontSize: 11, fontWeight: '800' },
  unlinkBtn: { padding: 8 },
  
  linkBtn: { flexDirection: 'row', backgroundColor: '#3B82F6', paddingVertical: 12, borderRadius: 12, alignItems: 'center', justifyContent: 'center', gap: 8 },
  linkBtnText: { color: '#fff', fontSize: 14, fontWeight: '700' },
});
