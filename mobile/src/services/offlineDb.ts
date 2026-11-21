import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('idkmedia_offline.db');

export function initDb() {
  db.execSync(`
    CREATE TABLE IF NOT EXISTS local_venues (
      id TEXT PRIMARY KEY,
      name TEXT,
      type TEXT,
      country TEXT,
      city TEXT,
      address TEXT,
      capacity INTEGER,
      shape TEXT,
      sections_json TEXT,
      synced INTEGER DEFAULT 0
    );
  `);
}

export function saveVenueOffline(venue: any) {
  db.runSync(
    `INSERT OR REPLACE INTO local_venues (id, name, type, country, city, address, capacity, shape, sections_json, synced)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 0)`,
    [venue.id, venue.name, venue.type, venue.country, venue.city, venue.address, venue.capacity, venue.shape, JSON.stringify(venue.sections)]
  );
}

export function getUnsyncedVenues() {
  return db.getAllSync(`SELECT * FROM local_venues WHERE synced = 0`);
}

export function markVenueSynced(id: string) {
  db.runSync(`UPDATE local_venues SET synced = 1 WHERE id = ?`, [id]);
}
