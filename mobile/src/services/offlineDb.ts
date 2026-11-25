import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@idkmedia_offline_venues';

export async function initDb() {
  console.log("✅ Almacenamiento local (AsyncStorage) listo.");
}

export async function saveVenueOffline(venue: any) {
  try {
    const existing = await getUnsyncedVenues();
    const newVenues = [...existing, { ...venue, synced: 0 }];
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newVenues));
  } catch (error) {
    console.error("Error guardando venue:", error);
  }
}

export async function getUnsyncedVenues() {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEY);
    if (data) {
      const venues = JSON.parse(data);
      return venues.filter((v: any) => v.synced === 0);
    }
    return [];
  } catch (error) {
    console.error("Error leyendo venues:", error);
    return [];
  }
}

export async function markVenueSynced(id: string) {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEY);
    if (data) {
      const venues = JSON.parse(data);
      const updated = venues.map((v: any) => v.id === id ? { ...v, synced: 1 } : v);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    }
  } catch (error) {
    console.error("Error marcando venue como sincronizado:", error);
  }
}
