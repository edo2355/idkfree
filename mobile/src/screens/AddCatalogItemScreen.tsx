import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { api } from '../api/client';

export function AddCatalogItemScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const itemToEdit = route.params?.item;
  const insets = useSafeAreaInsets();

  const [title, setTitle] = useState(itemToEdit ? itemToEdit.title : '');
  const [description, setDescription] = useState(itemToEdit ? itemToEdit.description : '');
  const [price, setPrice] = useState(itemToEdit ? String(itemToEdit.price) : '');
  const [type, setType] = useState(itemToEdit ? itemToEdit.type : 'product');
  const [category, setCategory] = useState(itemToEdit ? (itemToEdit.category || 'General') : 'General');

  async function handlePublish() {
    if (!title) return Alert.alert('ERROR', 'El título es obligatorio');
    try {
      if (itemToEdit) {
        await api.put(`/catalog/${itemToEdit.id}`, {
          title, description, price: parseFloat(price) || 0, type, category
        });
      } else {
        await api.post('/catalog', {
        title, description, price: parseFloat(price) || 0, type, currency: 'USD', category
        });
      }
      Alert.alert('SISTEMA', 'Item publicado correctamente');
      navigation.goBack();
    } catch (e: any) {
      Alert.alert('ERROR', e.message || 'No se pudo publicar');
    }
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.hud}>
        <Text style={styles.hudTitle}>{itemToEdit ? '[ EDITAR ITEM ]' : '[ NUEVO ITEM ]'}</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.hudClose}>[ X ]</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.form}>
        <Text style={styles.label}>TÍTULO</Text>
        <TextInput style={styles.input} value={title} onChangeText={setTitle} placeholder="Ej. Camiseta IDKFREE" placeholderTextColor="#444" />

        <Text style={styles.label}>DESCRIPCIÓN</Text>
        <TextInput style={[styles.input, { height: 80 }]} value={description} onChangeText={setDescription} placeholder="Detalles del producto o servicio" placeholderTextColor="#444" multiline />

        <Text style={styles.label}>PRECIO (USD)</Text>
        <TextInput style={styles.input} value={price} onChangeText={setPrice} placeholder="0.00" placeholderTextColor="#444" keyboardType="numeric" />

        
        <Text style={styles.label}>CATEGORÍA (Ej. Ropa, Servicios)</Text>
        <TextInput style={styles.input} value={category} onChangeText={setCategory} placeholder="General" placeholderTextColor="#444" />

        <Text style={styles.label}>TIPO</Text>
        <View style={{ flexDirection: 'row', gap: 10, marginBottom: 20 }}>
          <TouchableOpacity style={[styles.typeBtn, type === 'product' && styles.typeBtnActive]} onPress={() => setType('product')}>
            <Text style={[styles.typeText, type === 'product' && { color: '#000' }]}>PRODUCTO</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.typeBtn, type === 'service' && styles.typeBtnActive]} onPress={() => setType('service')}>
            <Text style={[styles.typeText, type === 'service' && { color: '#000' }]}>SERVICIO</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.submitBtn} onPress={handlePublish}>
          <Text style={styles.submitText}>{itemToEdit ? 'GUARDAR CAMBIOS' : 'PUBLICAR ITEM'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0a' },
  hud: { flexDirection: 'row', justifyContent: 'space-between', padding: 20, borderBottomWidth: 1, borderBottomColor: '#222' },
  hudTitle: { color: '#ffffff', fontFamily: 'monospace', fontSize: 14 },
  hudClose: { color: '#ff0044', fontFamily: 'monospace', fontSize: 16, fontWeight: 'bold' },
  form: { padding: 20 },
  label: { color: '#666', fontFamily: 'monospace', fontSize: 10, marginBottom: 5, marginTop: 15 },
  input: { backgroundColor: '#111', borderWidth: 1, borderColor: '#333', color: '#fff', padding: 12, fontFamily: 'monospace', fontSize: 14 },
  typeBtn: { flex: 1, padding: 15, borderWidth: 1, borderColor: '#333', alignItems: 'center' },
  typeBtnActive: { backgroundColor: '#333333', borderColor: '#555555' },
  typeText: { color: '#fff', fontFamily: 'monospace', fontSize: 12 },
  submitBtn: { backgroundColor: '#ffffff', padding: 18, alignItems: 'center', marginTop: 20 },
  submitText: { color: '#000', fontFamily: 'monospace', fontWeight: 'bold', fontSize: 14 }
});
