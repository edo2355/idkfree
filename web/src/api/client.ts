const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export class ApiError extends Error {
  status: number;
  details?: any;
  constructor(status: number, message: string, details?: any) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('aldea_token'); // Ajusta si usas otro nombre en authStore

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  }

  let finalOptions = options;
  if (options.method && ['POST', 'PUT', 'PATCH'].includes(options.method) && !options.body) {
    finalOptions = { ...options, body: '{}' };
  }

  const res = await fetch(`${API_URL}${path}`, { ...finalOptions, headers });

  let data: any = null;
  const text = await res.text();
  if (text) {
    try { data = JSON.parse(text); } catch { data = text; }
  }

  if (!res.ok) {
    const message = data?.error || `Error ${res.status}`;
    throw new ApiError(res.status, message, data?.details);
  }

  return data as T;
}

export const api = {
  auth: {
    register: (d: any) => request<any>('/auth/register', { method: 'POST', body: JSON.stringify(d) }),
    login: (email: string, password: string) => request<any>('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
    me: () => request<any>('/auth/me'),
  },
  profile: {
    get: (alias: string) => request<any>(`/users/${alias}`),
    update: (d: any) => request<any>('/me/profile', { method: 'PATCH', body: JSON.stringify(d) }),
    suggestions: (limit = 10) => request<any>(`/users/suggestions?limit=${limit}`),
  },
  posts: {
    feed: (p?: { limit?: number }) => {
      const q = new URLSearchParams();
      if (p?.limit) q.set('limit', String(p.limit));
      return request<any>(`/feed?${q}`);
    },
    create: (d: any) => request<any>('/posts', { method: 'POST', body: JSON.stringify(d) }),
    userPosts: (id: string) => request<any>(`/users/${id}/posts`),
    like: (id: string) => request<any>(`/posts/${id}/like`, { method: 'POST' }),
    unlike: (id: string) => request<any>(`/posts/${id}/like`, { method: 'DELETE' }),
    reels: (limit = 30) => request<any>(`/reels?limit=${limit}`),
  },
  vibes: {
    list: (p?: { limit?: number }) => {
      const q = new URLSearchParams();
      if (p?.limit) q.set('limit', String(p.limit));
      return request<any>(`/vibes?${q}`);
    },
    userVibes: (alias: string) => request<any>(`/users/${alias}/vibes`),
    legacy: (p?: { limit?: number }) => request<any>(`/vibes/legacy?limit=${p?.limit || 50}`),
  },
  search: {
    users: (q: string) => request<any>(`/search/users?q=${encodeURIComponent(q)}`),
    posts: (q: string) => request<any>(`/search/posts?q=${encodeURIComponent(q)}`),
  },
  follows: {
    follow: (id: string) => request<any>(`/users/${id}/follow`, { method: 'POST' }),
    unfollow: (id: string) => request<any>(`/users/${id}/follow`, { method: 'DELETE' }),
  },
  messages: {
    conversations: () => request<any>('/messages'),
    conversation: (alias: string) => request<any>(`/messages/${encodeURIComponent(alias)}`),
    send: (to: string, body: string) => request<any>('/messages', { method: 'POST', body: JSON.stringify({ to, body }) }),
  },
  livekit: {
    getToken: (roomName: string, isHost: boolean) => request<any>(`/livekit/token?roomName=${roomName}&isHost=${isHost}`),
  },
  uploads: {
    upload: async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      const token = localStorage.getItem('aldea_token');
      const res = await fetch(`${API_URL}/uploads`, {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formData,
      });
      if (!res.ok) throw new Error('Error al subir archivo');
      return res.json();
    }
  },
  streams: {
    start: (title: string, description?: string) => request<any>('/streams/start', { method: 'POST', body: JSON.stringify({ title, description }) }),
    active: () => request<any>('/streams/active'),
  },
};
