export interface TokenStorage {
  getToken(): Promise<string | null> | string | null;
  setToken(token: string): Promise<void> | void;
  removeToken(): Promise<void> | void;
}

export class ApiError extends Error {
  status: number;
  details?: any;
  constructor(status: number, message: string, details?: any) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

export interface ApiConfig {
  baseUrl: string;
  storage: TokenStorage;
}

export function createApi(config: ApiConfig) {
  async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
    const token = await config.storage.getToken();
    const headers: HeadersInit = { 'Content-Type': 'application/json', ...options.headers };
    if (token) (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;

    const res = await fetch(`${config.baseUrl}${path}`, { ...options, headers });

    let data: any = null;
    const text = await res.text();
    if (text) { try { data = JSON.parse(text); } catch { data = text; } }

    if (!res.ok) throw new ApiError(res.status, data?.error || `Error ${res.status}`, data?.details);
    return data as T;
  }

  async function requestRaw(path: string, options: RequestInit = {}): Promise<any> {
    const token = await config.storage.getToken();
    const headers: Record<string, string> = { ...(options.headers as any) };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const res = await fetch(`${config.baseUrl}${path}`, { ...options, headers });
    let data: any = null;
    const text = await res.text();
    if (text) { try { data = JSON.parse(text); } catch { data = text; } }
    if (!res.ok) throw new ApiError(res.status, data?.error || `Error ${res.status}`, data?.details);
    return data;
  }

  return {
    uploads: {
      upload: (file: { uri: string; name?: string; type?: string }) => {
        const form = new FormData();
        form.append('file', {
          uri: file.uri,
          name: file.name ?? 'upload.jpg',
          type: file.type ?? 'image/jpeg',
        } as any);
        return requestRaw('/uploads', { method: 'POST', body: form });
      },
    },
    auth: {
      register: (d: any) => request<any>('/auth/register', { method: 'POST', body: JSON.stringify(d) }),
      login: (email: string, password: string) => request<any>('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
      me: () => request<any>('/auth/me'),
    },
    profile: {
      get: (alias: string) => request<any>(`/users/${alias}`),
      update: (d: any) => request<any>('/me/profile', { method: 'PATCH', body: JSON.stringify(d) }),
      changePassword: (currentPassword: string, newPassword: string) =>
        request<any>('/me/change-password', { method: 'POST', body: JSON.stringify({ currentPassword, newPassword }) }),
    },
    posts: {
      create: (d: any) => request<any>('/posts', { method: 'POST', body: JSON.stringify(d) }),
      reels: (p?: { limit?: number; offset?: number }) => {
        const q = new URLSearchParams();
        if (p?.limit) q.set('limit', String(p.limit));
        if (p?.offset) q.set('offset', String(p.offset));
        return request<any>(`/reels?${q}`);
      },
      feed: (p?: any) => { const q = new URLSearchParams(); if (p?.limit) q.set('limit', String(p.limit)); return request<any>(`/feed?${q}`); },
      userPosts: (id: string) => request<any>(`/users/${id}/posts`),
      delete: (id: string) => request<any>(`/posts/${id}`, { method: 'DELETE' }),
      bookmark: (id: string) => request<any>(`/posts/${id}/bookmark`, { method: 'POST' }),
      unbookmark: (id: string) => request<any>(`/posts/${id}/bookmark`, { method: 'DELETE' }),
      bookmarks: () => request<any>('/me/bookmarks'),
    },
    follows: {
      follow: (id: string) => request<any>(`/users/${id}/follow`, { method: 'POST' }),
      unfollow: (id: string) => request<any>(`/users/${id}/follow`, { method: 'DELETE' }),
      followers: (id: string) => request<any>(`/users/${id}/followers`),
      following: (id: string) => request<any>(`/users/${id}/following`),
    },
    messages: {
      send: (receiverId: string, body: string) => request<any>('/messages', { method: 'POST', body: JSON.stringify({ receiverId, body }) }),
      conversation: (userId: string) => request<any>(`/messages/${userId}`),
      conversations: () => request<any>('/conversations'),
    },
    notifications: {
      list: () => request<any>('/notifications'),
      read: (id: string) => request<any>(`/notifications/${id}/read`, { method: 'PATCH' }),
      readAll: () => request<any>('/notifications/read-all', { method: 'POST' }),
    },
    recovery: {
      panic: (cardId: string, pin: string) => request<any>('/recovery/panic', { method: 'POST', body: JSON.stringify({ cardId, pin }) }),
      restore: (cardId: string, pin: string) => request<any>('/recovery/restore', { method: 'POST', body: JSON.stringify({ cardId, pin }) }),
      destroy: (cardId: string, pin: string, confirmText: string) => request<any>('/recovery/destroy', { method: 'POST', body: JSON.stringify({ cardId, pin, confirmText }) }),
    },
    search: {
      users: (q: string) => request<any>(`/search/users?q=${encodeURIComponent(q)}`),
      posts: (q: string) => request<any>(`/search/posts?q=${encodeURIComponent(q)}`),
    },
    institutions: {
      create: (d: any) => request<any>('/institutions', { method: 'POST', body: JSON.stringify(d) }),
      list: () => request<any>('/institutions'),
      get: (alias: string) => request<any>(`/institutions/${alias}`),
    },
    signals: {
      send: (toUserId: string, signalType: string, message?: string) =>
        request<any>('/signals', { method: 'POST', body: JSON.stringify({ toUserId, signalType, message }) }),
      matches: () => request<any>('/matches'),
      sent: () => request<any>('/signals/sent'),
    },
    legacy: {
      circle: () => request<any>('/circle'),
      addToCircle: (memberId: string) => request<any>('/circle/add', { method: 'POST', body: JSON.stringify({ memberId }) }),
      acceptCircle: (ownerId: string) => request<any>('/circle/accept', { method: 'POST', body: JSON.stringify({ ownerId }) }),
      status: () => request<any>('/legacy/status'),
      capsules: () => request<any>('/legacy/capsules'),
    },
  };
}

export type ApiClient = ReturnType<typeof createApi>;