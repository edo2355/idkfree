import { getUnsyncedVenues, markVenueSynced } from './offlineDb';

export async function syncVenuesToCloud(token: string) {
  const unsynced = getUnsyncedVenues();
  let syncedCount = 0;

  for (const venue of unsynced) {
    try {
      const payload = {
        name: venue.name,
        type: venue.type,
        country: venue.country,
        city: venue.city,
        address: venue.address,
        capacity: venue.capacity,
        shape: venue.shape,
        sections: JSON.parse(venue.sections_json)
      };

      const res = await fetch('https://idkfree.onrender.com/api/venues/full', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        markVenueSynced(venue.id);
        syncedCount++;
      }
    } catch (error) {
      console.error('Error sincronizando venue:', error);
    }
  }
  return syncedCount;
}
