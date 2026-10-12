export interface User {
  id: string;
  alias: string;
  name: string | null;
  bio?: string | null;
  avatar_url?: string | null;
  created_at?: string;
  followers_count?: number;
  following_count?: number;
  posts_count?: number;
}

export interface Post {
  id: string;
  author_id: string;
  author_alias: string;
  author_name: string | null;
  author_avatar: string | null;
  body: string | null;
  image_url: string | null;
  video_url?: string | null;
  visibility?: string;
  created_at: string;
  likes_count?: number;
  comments_count?: number;
  liked_by_me?: boolean;
}

export interface Comment {
  id: string;
  post_id: string;
  author_id: string;
  author_alias: string;
  author_name: string | null;
  author_avatar: string | null;
  body: string;
  parent_id: string | null;
  likes_count: number;
  replies_count: number;
  created_at: string;
}

export interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  body: string;
  read_at: string | null;
  created_at: string;
}

export interface Conversation {
  other_id: string;
  other_alias: string;
  other_name: string | null;
  other_avatar: string | null;
  last_message: string;
  last_at: string;
  unread_count: number;
}

export interface Notification {
  id: string;
  type: string;
  actor_alias: string | null;
  actor_name: string | null;
  actor_avatar: string | null;
  target_id: string | null;
  body: string | null;
  read_at: string | null;
  created_at: string;
}

export interface RegisterInput {
  email: string;
  alias: string;
  password: string;
  name?: string;
  pins?: { panic?: string; recovery?: string; destroy?: string };
  secretPins: [string, string, string];
}

export interface RegisterResult {
  userId: string;
  alias: string;
  cardId: string;
  qrPayloads: {
    panic: string;
    restore: string;
    fenix: string;
  };
  pins: {
    panic: string;
    recovery: string;
    destroy: string;
  };
  warning: string;
}

export interface LoginResult {
  userId: string;
  alias: string;
  accessToken: string;
}

export type SignalType = 'friendship' | 'dating' | 'networking' | 'curiosity';


export interface Story {
  id: string;
  author_id: string;
  author_alias: string;
  author_name: string | null;
  author_avatar: string | null;
  media_url: string;
  media_type: 'image' | 'video';
  created_at: string;
  expires_at: string;
  viewers_count?: number;
  viewed_by_me?: boolean;
}

export interface StoryGroup {
  author_id: string;
  author_alias: string;
  author_name: string | null;
  author_avatar: string | null;
  stories: Story[];
  all_viewed: boolean;
}

export interface DrawnPost {
  id: string;
  post_id: string;
  author_id: string;
  author_alias: string;
  drawing_url: string;
  created_at: string;
}
