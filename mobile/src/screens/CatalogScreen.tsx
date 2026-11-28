import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, ActivityIndicator, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Search, ShoppingBag, Star, Package, Plus } from 'lucide-react-native';
import { Image } from 'expo-image'; // Optimizado para caché
import { GlassCard } from '../components/ui/GlassCard';
import { useAuthStore } from '../stores/authStore';
import { api } from '../api/client';

const CATEGORIES = ['all', 'digital', 'fisico', 'servicio'];

export function CatalogScreen() {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const { token } = useAuthStore();
  
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  const [activeTab, setActiveTab] = useState<'explore' | 'my-products'>('explore');
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');

  const fetchProducts = async () => {
    try {
      // Usamos la URL base de tu api client o la de Render
      const API_URL = process.env.EXPO_PUBLIC_API_URL || 'https://idkfree.onrender.com/api';
      const res = await fetch(`${API_URL}/catalog/products?category=${category}`);
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [category]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchProducts();
  }, [category]);

  const filteredProducts = products.filter(p => 
    p.title.toLowerCase().includes(search.toLowerCase())
  );

  const renderProduct = ({ item }: { item: any }) => (
    <TouchableOpacity 
      activeOpacity={0.8} 
      onPress={() => navigation.navigate('ProductDetail', { productId: item.id })}
      style={styles.cardWrapper}
    >
      <GlassCard style={styles.card} intensity={20}>
        {/* Imagen con Badge */}
        <View style={styles.imageContainer}>
          {item.image_url ? (
            <Image 
              source={{ uri: `https://idkfree.onrender.com${item.image_url}` }} 
              style={styles.cardImage} 
              contentFit="cover"
              transition={200}
            />
          ) : (
            <View style={styles.noImage}><Package size={40} color="#444" /></View>
          )}
          
          <View style={styles.badgesContainer}>
            {item.is_featured === 1 && (
              <View style={[styles.badge, { backgroundColor: '#F59E0B' }]}>
                <Star size={10} color="#000" />
                <Text style={styles.badgeTextDark}>DESTACADO</Text>
              </View>
            )}
            <View style={styles.badgeDark}>
              <Text style={styles.badgeTextLight}>{item.product_type?.toUpperCase() || 'PRODUCTO'}</Text>
            </View>
          </View>
        </View>

        {/* Información */}
        <View style={styles.cardContent}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle} numberOfLines={1}>{item.title}</Text>
            <Text style={styles.cardSeller}>@{item.seller_alias || 'vendedor'}</Text>
          </View>
          
          <View style={styles.priceRow}>
            <Text style={styles.cardPrice}>${item.price}</Text>
            {item.discount_price && (
              <Text style={styles.cardDiscount}>${item.discount_price}</Text>
            )}
          </View>

          <TouchableOpacity style={styles.buyButton} onPress={() => navigation.navigate('Checkout', { productId: item.id })}>
            <ShoppingBag size={16} color="#000" />
            <Text style={styles.buyButtonText}>Comprar Ahora</Text>
          </TouchableOpacity>
        </View>
      </GlassCard>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>IDK_MARKETPLACE</Text>
          <Text style={styles.subtitle}>Descubre productos y talentos</Text>
        </View>
        <TouchableOpacity style={styles.addBtn}>
          <Plus size={20} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'explore' && styles.tabActive]} 
          onPress={() => setActiveTab('explore')}
        >
          <Text style={[styles.tabText, activeTab === 'explore' && styles.tabTextActive]}>Explorar</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'my-products' && styles.tabActive]} 
          onPress={() => setActiveTab('my-products')}
        >
          <Text style={[styles.tabText, activeTab === 'my-products' && styles.tabTextActive]}>Mis Ventas</Text>
        </TouchableOpacity>
      </View>

      {/* Buscador y Filtros */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBox}>
          <Search size={18} color="#666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar en el catálogo..."
            placeholderTextColor="#666"
            value={search}
            onChangeText={setSearch}
          />
        </View>
      </View>

      {/* Categorías */}
      <View style={styles.categoriesWrapper}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={CATEGORIES}
          keyExtractor={item => item}
          contentContainerStyle={styles.categoriesList}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.categoryBtn, category === item && styles.categoryBtnActive]}
              onPress={() => setCategory(item)}
            >
              <Text style={[styles.categoryText, category === item && styles.categoryTextActive]}>
                {item === 'all' ? 'Todas' : item.toUpperCase()}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* Lista de Productos */}
      {loading ? (
        <View style={styles.center}><ActivityIndicator size="large" color="#00E5FF" /></View>
      ) : (
        <FlatList
          data={filteredProducts}
          keyExtractor={item => item.id.toString()}
          renderItem={renderProduct}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#00E5FF" />}
          ListEmptyComponent={<Text style={styles.emptyText}>No se encontraron productos.</Text>}
          // Optimizaciones para el Itel A100C
          initialNumToRender={4}
          maxToRenderPerBatch={4}
          windowSize={5}
          removeClippedSubviews={true}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#050505' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 15 },
  title: { color: '#fff', fontSize: 22, fontWeight: '900', letterSpacing: 1 },
  subtitle: { color: '#888', fontSize: 13, marginTop: 4 },
  addBtn: { backgroundColor: '#00E5FF', width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  
  tabsContainer: { flexDirection: 'row', paddingHorizontal: 20, gap: 10, marginBottom: 15 },
  tab: { flex: 1, paddingVertical: 10, alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  tabActive: { backgroundColor: '#fff', borderColor: '#fff' },
  tabText: { color: '#888', fontSize: 14, fontWeight: '700' },
  tabTextActive: { color: '#000' },

  searchContainer: { paddingHorizontal: 20, marginBottom: 15 },
  searchBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 14, paddingHorizontal: 15, height: 48, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  searchIcon: { marginRight: 10 },
  searchInput: { flex: 1, color: '#fff', fontSize: 15 },

  categoriesWrapper: { marginBottom: 15 },
  categoriesList: { paddingHorizontal: 20, gap: 10 },
  categoryBtn: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.05)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  categoryBtnActive: { backgroundColor: '#00E5FF', borderColor: '#00E5FF' },
  categoryText: { color: '#888', fontSize: 12, fontWeight: '700' },
  categoryTextActive: { color: '#000' },

  listContent: { paddingHorizontal: 20, paddingBottom: 40 },
  cardWrapper: { marginBottom: 20 },
  card: { padding: 0, overflow: 'hidden' },
  imageContainer: { width: '100%', height: 180, backgroundColor: '#111' },
  cardImage: { width: '100%', height: '100%' },
  noImage: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  badgesContainer: { position: 'absolute', top: 10, left: 10, gap: 5 },
  badge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  badgeDark: { backgroundColor: 'rgba(0,0,0,0.6)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)' },
  badgeTextDark: { color: '#000', fontSize: 10, fontWeight: '800' },
  badgeTextLight: { color: '#fff', fontSize: 10, fontWeight: '800' },

  cardContent: { padding: 16 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 },
  cardTitle: { color: '#fff', fontSize: 16, fontWeight: '700', flex: 1, marginRight: 10 },
  cardSeller: { color: '#888', fontSize: 12, fontWeight: '500' },
  priceRow: { flexDirection: 'row', alignItems: 'baseline', gap: 8, marginBottom: 15 },
  cardPrice: { color: '#00E5FF', fontSize: 22, fontWeight: '900' },
  cardDiscount: { color: '#666', fontSize: 14, textDecorationLine: 'line-through' },
  buyButton: { flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.1)', alignItems: 'center', justifyContent: 'center', paddingVertical: 12, borderRadius: 12, gap: 8 },
  buyButtonText: { color: '#fff', fontSize: 14, fontWeight: '700' },
  emptyText: { color: '#666', textAlign: 'center', marginTop: 40, fontSize: 15 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' }
});
