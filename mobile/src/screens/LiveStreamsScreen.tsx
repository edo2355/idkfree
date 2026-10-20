import { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { api } from '../api/client';
import { useTheme } from '../stores/themeStore';
import { fonts } from '../theme/fonts';

export function LiveStreamsScreen() {
  const theme = useTheme();
  const navigation = useNavigation<any>();
  const [streams, setStreams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStreams();
    // Opcional: Polling cada 15 segundos para actualizar la lista
    const interval = setInterval(loadStreams, 15000);
    return () => clearInterval(interval);
  }, []);

  async function loadStreams() {
    try {
      const res = await api.streams.active();
      setStreams(res.streams || res || []);
    } catch (error) {
      console.log('Error cargando streams:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: theme.bg, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator color={theme.accent} size="large" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: theme.bg, paddingTop: 50 }}>
      <Text style={{ color: theme.text, fontFamily: fonts.displayBoldItalic, fontSize: 28, paddingHorizontal: 20, marginBottom: 20 }}>
        En Vivo Ahora
      </Text>

      <FlatList
        data={streams}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={{ paddingHorizontal: 15 }}
        ListEmptyComponent={
          <Text style={{ color: theme.textMuted, textAlign: 'center', marginTop: 50, fontFamily: fonts.regular }}>
            No hay transmisiones activas en este momento.
          </Text>
        }
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={{ flex: 1, margin: 5, height: 220, borderRadius: 12, overflow: 'hidden', backgroundColor: theme.surface, borderWidth: 1, borderColor: theme.border }}
            onPress={() => navigation.navigate('LiveStream', { roomName: item.id, isHost: false })}
          >
            {/* Aquí iría la miniatura del stream, si tienes una imagen */}
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#1A1A1A' }}>
              <Text style={{ fontSize: 40 }}>📡</Text>
            </View>
            
            <View style={{ padding: 10, backgroundColor: theme.surface }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                <View style={{ backgroundColor: '#EF4444', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, marginRight: 6 }}>
                  <Text style={{ color: '#FFF', fontSize: 10, fontWeight: 'bold' }}>EN VIVO</Text>
                </View>
                <Text style={{ color: theme.text, fontFamily: fonts.medium, fontSize: 12 }} numberOfLines={1}>
                  {item.hostName || item.hostId?.slice(0, 8) || 'Anónimo'}
                </Text>
              </View>
              <Text style={{ color: theme.textMuted, fontSize: 12 }} numberOfLines={1}>
                {item.title}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
