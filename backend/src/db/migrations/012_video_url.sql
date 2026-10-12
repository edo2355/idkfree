-- 012_video_url.sql
-- Añade URL de video a los posts (para reels)
ALTER TABLE posts ADD COLUMN video_url TEXT;
