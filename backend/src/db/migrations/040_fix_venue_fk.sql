PRAGMA foreign_keys=off;
ALTER TABLE events RENAME TO events_old;
CREATE TABLE events (
  id TEXT PRIMARY KEY,
  organizer_id TEXT NOT NULL,
  venue_id TEXT NOT NULL,
  name TEXT NOT NULL,
  event_date DATETIME NOT NULL,
  status TEXT DEFAULT 'draft',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO events SELECT * FROM events_old;
DROP TABLE events_old;
PRAGMA foreign_keys=on;
