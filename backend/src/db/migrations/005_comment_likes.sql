CREATE TABLE IF NOT EXISTS comment_likes (
  user_id     TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  comment_id  TEXT NOT NULL REFERENCES comments(id) ON DELETE CASCADE,
  created_at  TEXT NOT NULL DEFAULT (datetime('now')),
  PRIMARY KEY (user_id, comment_id)
);

CREATE INDEX IF NOT EXISTS idx_comment_likes_comment ON comment_likes(comment_id);
