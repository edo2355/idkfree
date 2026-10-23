import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, ScrollView } from 'react-native';
import { MoreVertical } from 'lucide-react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { api } from '../api/client';
import { useAuthStore } from '../stores/authStore';

export function CatalogScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const { userId, alias } = route.params || { userId: 'me', alias: 'Mi Catálogo' };

  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const currentUser = useAuthStore((s) => s.user);
  const isMyCatalog = currentUser?.alias === alias;

  useEffect(() => {
    async function load() {
      try {
        const res = await api.get(`/catalog/${userId}`);
        setItems(res.items || []);
      } catch (e) {
        console.log('Error catálogo', e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [userId]);


  function handleOptions(item: any) {
    Alert.alert(
      'OPCIONES',
      `¿Qué deseas hacer con "${item.title}"?`,
      [
        { text: 'Editar', onPress: () => navigation.navigate('AddCatalogItem', { item }) },
        { text: 'Eliminar', style: 'destructive', onPress: () => handleDelete(item.id) },
        { text: 'Cancelar', style: 'cancel' }
      ]
    );
  }

  async function handleDelete(id: string) {
    try {
      await api.delete(`/catalog/${id}`);
      setItems(items.filter(i => i.id !== id));
      Alert.alert('SISTEMA', 'Item eliminado');
    } catch (e) {
      Alert.alert('ERROR', 'No se pudo eliminar el item');
    }
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* HUD Superior */}
      <View style={styles.hud}>
        <Text style={styles.hudTitle}>[ CATALOG: {alias} ]</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.hudClose}>[ X ]</Text>
        </TouchableOpacity>
      </View>

      
      {/* Barra de Categorías */}
      <View style={{ flexDirection: 'row', padding: 10, borderBottomWidth: 1, borderBottomColor: '#222', overflow: 'hidden' }}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10 }}>
          {['Todos', 'General', 'Ropa', 'Servicios', 'Electrónica'].map((cat) => (
            <TouchableOpacity 
              key={cat} 
              onPress={() => setSelectedCategory(cat)}
              style={{ borderWidth: 1, borderColor: selectedCategory === cat ? '#ffffff' : '#333', paddingHorizontal: 15, paddingVertical: 5 }}
            >
              <Text style={{ color: selectedCategory === cat ? '#ffffff' : '#666', fontFamily: 'monospace', fontSize: 12 }}>{cat.toUpperCase()}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#ffffff" style={{ marginTop: 50 }} />
      ) : (
        <FlatList
          data={selectedCategory === 'Todos' ? items : items.filter(i => i.category === selectedCategory)}
          numColumns={1}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 10, paddingBottom: 100 }}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.cardImagePlaceholder}>
                <Text style={{ color: '#333', fontFamily: 'monospace' }}>NO_IMG</Text>
              </View>
              <View style={[styles.cardContent, { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }]}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.cardTitle} numberOfLines={1}>{item.title}</Text>
                  <Text style={styles.cardPrice}>{item.price} {item.currency}</Text>
                  <Text style={styles.cardType}>[{item.type.toUpperCase()}]</Text>
                </View>
                {isMyCatalog && (
                  <TouchableOpacity onPress={() => handleOptions(item)} style={{ padding: 5 }}>
                    <MoreVertical size={20} color="#888" />
                  </TouchableOpacity>
                )}
              </View>
            </View>
          )}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No hay items publicados.</Text>
          }
        />
      )}

      {/* Botón flotante para añadir (solo si es mi perfil) */}
      {isMyCatalog && (
        <TouchableOpacity 
          style={styles.fab} 
          onPress={() => navigation.navigate('AddCatalogItem')}
        >
          <Text style={styles.fabText}>+</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0a' },
  hud: { flexDirection: 'row', justifyContent: 'space-between', padding: 20, borderBottomWidth: 1, borderBottomColor: '#222' },
  hudTitle: { color: '#ffffff', fontFamily: 'monospace', fontSize: 14 },
  hudClose: { color: '#ff0044', fontFamily: 'monospace', fontSize: 16, fontWeight: 'bold' },
  card: { flex: 1, margin: 5, backgroundColor: '#111', borderWidth: 1, borderColor: '#333', borderRadius: 0 },
  cardImagePlaceholder: { height: 200, backgroundColor: '#0f0f0f', justifyContent: 'center', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#222' },
  cardContent: { padding: 10 },
  cardTitle: { color: '#fff', fontFamily: 'monospace', fontSize: 13, marginBottom: 5 },
  cardPrice: { color: '#ffffff', fontFamily: 'monospace', fontSize: 14, fontWeight: 'bold' },
  cardType: { color: '#666', fontFamily: 'monospace', fontSize: 10, marginTop: 5 },
  emptyText: { color: '#666', fontFamily: 'monospace', textAlign: 'center', marginTop: 50 },
  fab: { position: 'absolute', bottom: 30, right: 30, width: 60, height: 60, backgroundColor: '#ffffff', justifyContent: 'center', alignItems: 'center', borderRadius: 0, borderWidth: 2, borderColor: '#fff' },
  fabText: { color: '#000', fontSize: 30, fontWeight: 'bold' }
});
