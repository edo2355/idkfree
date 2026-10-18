// ============================================================
// client.ts
// ------------------------------------------------------------
// Cliente HTTP para hablar con el backend.
//
// Todas las peticiones pasan por aquí. Añade automáticamente
// el token JWT en las cabeceras.
// ============================================================

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

/**
 * Error personalizado con código HTTP.
 */
export class ApiError extends Error {
  status: number;
  details?: any;

  constructor(status: number, message: string, details?: any) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

/**
 * Hace una petición al backend.
 */
async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = localStorage.getItem('aldea_token');

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });

  // Leer la respuesta como JSON (o devolver vacío si no hay body)
  let data: any = null;
  const text = await res.text();
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
  }

  if (!res.ok) {
    const message = data?.error || `Error ${res.status}`;
    throw new ApiError(res.status, message, data?.details);
  }

  return data as T;
}

/**
 * API de Aldea.
 */
export const api = {
  // ----------------------------------------------------------
  // Autenticación
  // ----------------------------------------------------------
  auth: {
    register(data: {
      email: string;
      alias: string;
      password: string;
      name?: string;
      pins: { panic: string; recovery: string; destroy: string };
    }) {
      return request<{
        userId: string;
        alias: string;
        cardId: string;
        recoverySecret: string;
        qrPayload: string;
        warning: string;
      }>('/auth/register', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },

    login(email: string, password: string) {
      return request<{
        userId: string;
        alias: string;
        accessToken: string;
      }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
    },

    me() {
      return request<{
        user: {
          id: string;
          alias: string;
          name: string | null;
          created_at: string;
        };
      }>('/auth/me');
    },
  },

  // ----------------------------------------------------------
  // Posts
  // ----------------------------------------------------------
  posts: {
    create(data: { body?: string; imageUrl?: string; visibility?: string }) {
      return request<{ id: string }>('/posts', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },

    feed(params?: { limit?: number; offset?: number; hashtag?: string }) {
      const q = new URLSearchParams();
      if (params?.limit) q.set('limit', String(params.limit));
      if (params?.offset) q.set('offset', String(params.offset));
      if (params?.hashtag) q.set('hashtag', params.hashtag);
      return request<{ posts: any[] }>(`/feed?${q}`);
    },

    like(postId: string) {
      return request<{ ok: boolean }>(`/posts/${postId}/like`, {
        method: 'POST',
      });
    },

    unlike(postId: string) {
      return request<{ ok: boolean }>(`/posts/${postId}/like`, {
        method: 'DELETE',
      });
    },

    userPosts(userId: string) {
      return request<{ posts: any[] }>(`/users/${userId}/posts`);
    },

    delete(postId: string) {
      return request<{ ok: boolean }>(`/posts/${postId}`, {
        method: 'DELETE',
      });
    },
  },

  // ----------------------------------------------------------
  // Follows
  // ----------------------------------------------------------
  follows: {
    follow(userId: string) {
      return request<{ ok: boolean }>(`/users/${userId}/follow`, {
        method: 'POST',
      });
    },

    unfollow(userId: string) {
      return request<{ ok: boolean }>(`/users/${userId}/follow`, {
        method: 'DELETE',
      });
    },

    followers(userId: string) {
      return request<{ followers: any[] }>(`/users/${userId}/followers`);
    },

    following(userId: string) {
      return request<{ following: any[] }>(`/users/${userId}/following`);
    },
  },

  // ----------------------------------------------------------
  // Mensajes
  // ----------------------------------------------------------
  messages: {
    send(receiverId: string, body: string) {
      return request<{ message: any }>('/messages', {
        method: 'POST',
        body: JSON.stringify({ receiverId, body }),
      });
    },

    conversation(userId: string, limit = 50) {
      return request<{ messages: any[] }>(`/messages/${userId}?limit=${limit}`);
    },

    conversations() {
      return request<{ conversations: any[] }>('/conversations');
    },
  },

  // ----------------------------------------------------------
  // Notificaciones
  // ----------------------------------------------------------
  notifications: {
    list() {
      return request<{ notifications: any[]; unread: number }>('/notifications');
    },

    read(id: string) {
      return request<{ ok: boolean }>(`/notifications/${id}/read`, {
        method: 'PATCH',
      });
    },

    readAll() {
      return request<{ ok: boolean }>('/notifications/read-all', {
        method: 'POST',
      });
    },
  },

  // ----------------------------------------------------------
  // Recuperación
  // ----------------------------------------------------------
  recovery: {
    panic(cardId: string, pin: string) {
      return request<{ success: boolean; userId: string }>('/recovery/panic', {
        method: 'POST',
        body: JSON.stringify({ cardId, pin }),
      });
    },

    restore(cardId: string, pin: string) {
      return request<{ success: boolean; userId: string }>('/recovery/restore', {
        method: 'POST',
        body: JSON.stringify({ cardId, pin }),
      });
    },

    destroy(cardId: string, pin: string, confirmText: string) {
      return request<{ success: boolean }>('/recovery/destroy', {
        method: 'POST',
        body: JSON.stringify({ cardId, pin, confirmText }),
      });
    },
  },

  // ----------------------------------------------------------
  // Instituciones
  // ----------------------------------------------------------
  institutions: {
    create(data: {
      type: string;
      name: string;
      alias: string;
      description?: string;
      taxId?: string;
      website?: string;
    }) {
      return request<{ id: string; alias: string }>('/institutions', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },

    list() {
      return request<{ institutions: any[] }>('/institutions');
    },

    get(alias: string) {
      return request<{ institution: any }>(`/institutions/${alias}`);
    },
  },
};