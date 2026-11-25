import { getUnsyncedVenues, markVenueSynced } from './offlineDb';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'https://idkfree.onrender.com';

export async function syncVenuesToCloud(token: string) {
  let count = 0;
  
  try {
    // 🔥 AQUÍ ESTABA EL ERROR: Faltaba el await porque ahora es asíncrono
    const unsynced = await getUnsyncedVenues(); 

    for (const venue of unsynced) {
      try {
        const response = await fetch(`${API_URL}/api/venues`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(venue)
        });

        if (response.ok) {
          await markVenueSynced(venue.id);
          count++;
        }
      } catch (err) {
        console.error(`Error sincronizando venue ${venue.id}:`, err);
      }
    }
  } catch (error) {
    console.error("Error general en sincronización:", error);
  }

  return count;
}
