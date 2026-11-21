import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, Alert } from 'react-native';
import { saveVenueOffline, initDb, getUnsyncedVenues } from '../services/offlineDb';
import { syncVenuesToCloud } from '../services/syncService';
import { useAuth } from '../hooks/useAuth';

export default function OfflineVenueScreen() {
  const [name, setName] = useState('');
  const [capacity, setCapacity] = useState('');
  const [unsynced, setUnsynced] = useState<any[]>([]);
  const { token } = useAuth();

  useEffect(() => {
    initDb();
    setUnsynced(getUnsyncedVenues());
  }, []);

  const handleSave = () => {
    if (!name || !capacity) return Alert.alert('Error', 'Llena todos los campos');
    
    const venue = {
      id: Date.now().toString(),
      name,
      type: 'stadium',
      country: 'CU',
      city: 'La Habana',
      address: 'Dirección de prueba',
      capacity: parseInt(capacity),
      shape: 'rectangular',
      sections: [
        { name: 'General', layoutType: 'straight', price: 50, color: '#3B82F6', rows: [{ name: 'A', index: 1, seats: [{ number: 1, label: '1', x: 100, y: 100 }] }] }
      ]
    };

    saveVenueOffline(venue);
    setUnsynced(getUnsyncedVenues());
    setName(''); setCapacity('');
    Alert.alert('Guardado', 'Recinto guardado localmente.');
  };

  const handleSync = async () => {
    if (!token) return Alert.alert('Error', 'No hay sesión activa');
    const count = await syncVenuesToCloud(token);
    setUnsynced(getUnsyncedVenues());
    Alert.alert('Sincronización', `Se sincronizaron ${count} recintos.`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Crear Recinto Offline</Text>
      <TextInput placeholder="Nombre del recinto" value={name} onChangeText={setName} style={styles.input} />
      <TextInput placeholder="Capacidad" value={capacity} onChangeText={setCapacity} keyboardType="numeric" style={styles.input} />
      <Button title="Guardar Localmente" onPress={handleSave} />
      
      <Text style={styles.subtitle}>Recintos sin sincronizar: {unsynced.length}</Text>
      <FlatList
        data={unsynced}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <Text style={styles.item}>{item.name} - {item.capacity} cap.</Text>}
      />
      <Button title="Sincronizar con la Nube" onPress={handleSync} color="#2563EB" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 10, borderRadius: 5 },
  subtitle: { fontSize: 16, fontWeight: 'bold', marginTop: 20, marginBottom: 10 },
  item: { padding: 10, borderBottomWidth: 1, borderColor: '#eee' }
});
