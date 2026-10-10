-- ============================================================
-- 003_posts.sql
-- Posts, likes, comentarios, follows, hashtags, menciones,
-- notificaciones
-- Adaptado a SQLite
-- ============================================================

-- Posts
CREATE TABLE IF NOT EXISTS posts (
  id          TEXT PRIMARY KEY,
  author_id   TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  body        TEXT,
  image_url   TEXT,
  visibility  TEXT NOT NULL DEFAULT 'followers'
              CHECK (visibility IN ('public', 'followers', 'private')),
  created_at  TEXT NOT NULL DEFAULT (datetime('now')),
  deleted_at  TEXT
);

CREATE INDEX IF NOT EXISTS idx_posts_author
  ON posts(author_id, created_at DESC) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_posts_feed
  ON posts(created_at DESC)
  WHERE deleted_at IS NULL AND visibility != 'private';

-- Likes
CREATE TABLE IF NOT EXISTS post_likes (
  user_id     TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  post_id     TEXT NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  created_at  TEXT NOT NULL DEFAULT (datetime('now')),
  PRIMARY KEY (user_id, post_id)
);

CREATE INDEX IF NOT EXISTS idx_likes_post ON post_likes(post_id);

-- Comentarios (con soporte para multimedia)
CREATE TABLE IF NOT EXISTS comments (
  id              TEXT PRIMARY KEY,
  post_id         TEXT NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  author_id       TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  body            TEXT,
  media_type      TEXT CHECK (media_type IN ('audio', 'photo', 'gif', 'video', 'text')),
  media_url       TEXT,
  media_duration  INTEGER,
  parent_id       TEXT REFERENCES comments(id) ON DELETE CASCADE,
  likes_count     INTEGER NOT NULL DEFAULT 0,
  replies_count   INTEGER NOT NULL DEFAULT 0,
  created_at      TEXT NOT NULL DEFAULT (datetime('now')),
  deleted_at      TEXT
);

CREATE INDEX IF NOT EXISTS idx_comments_post ON comments(post_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_comments_parent ON comments(parent_id);

-- Follows
CREATE TABLE IF NOT EXISTS follows (
  follower_id  TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  followed_id  TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at   TEXT NOT NULL DEFAULT (datetime('now')),
  PRIMARY KEY (follower_id, followed_id),
  CHECK (follower_id <> followed_id)
);

CREATE INDEX IF NOT EXISTS idx_follows_followed ON follows(followed_id);

-- Hashtags
CREATE TABLE IF NOT EXISTS hashtags (
  id          TEXT PRIMARY KEY,
  tag         TEXT UNIQUE NOT NULL,
  posts_count INTEGER NOT NULL DEFAULT 0,
  created_at  TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS post_hashtags (
  post_id     TEXT NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  hashtag_id  TEXT NOT NULL REFERENCES hashtags(id) ON DELETE CASCADE,
  PRIMARY KEY (post_id, hashtag_id)
);

-- Menciones
CREATE TABLE IF NOT EXISTS post_mentions (
  post_id           TEXT NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  mentioned_user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  PRIMARY KEY (post_id, mentioned_user_id)
);

-- Notificaciones
CREATE TABLE IF NOT EXISTS notifications (
  id          TEXT PRIMARY KEY,
  user_id     TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type        TEXT NOT NULL,
  actor_id    TEXT REFERENCES users(id) ON DELETE SET NULL,
  target_id   TEXT,
  body        TEXT,
  read_at     TEXT,
  created_at  TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_notif_user_unread
  ON notifications(user_id, read_at) WHERE read_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_notif_user_date
  ON notifications(user_id, created_at DESC);
