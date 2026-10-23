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
  getBaseUrl: () => Promise<string> | string;
  storage: TokenStorage;
}

export function createApi(config: ApiConfig) {
  async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
    const token = await config.storage.getToken();
    const baseUrl = await config.getBaseUrl();
    const headers: HeadersInit = { 'Content-Type': 'application/json', ...options.headers };
    if (token) (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;

    // Fastify rechaza POST con Content-Type JSON y body vacío → mandamos '{}' si es necesario
    let finalOptions = options;
    if (options.method && ['POST', 'PUT', 'PATCH'].includes(options.method) && !options.body) {
      finalOptions = { ...options, body: '{}' };
    }

    const res = await fetch(`${baseUrl}${path}`, { ...finalOptions, headers });

    let data: any = null;
    const text = await res.text();
    if (text) { try { data = JSON.parse(text); } catch { data = text; } }

    if (!res.ok) {
      let msg: string;
      const err = data?.error;
      if (typeof err === 'string') msg = err;
      else if (err && typeof err === 'object') {
        // Zod flatten: { formErrors: [], fieldErrors: { campo: ['msg'] } }
        const fieldErrors = err.fieldErrors ?? {};
        const first = Object.entries(fieldErrors)[0];
        if (first) {
          const [field, errs] = first as [string, any];
          msg = `${field}: ${Array.isArray(errs) ? errs[0] : errs}`;
        } else if (Array.isArray(err.formErrors) && err.formErrors.length > 0) {
          msg = err.formErrors[0];
        } else {
          msg = `Error ${res.status}`;
        }
      } else {
        msg = `Error ${res.status}`;
      }
      throw new ApiError(res.status, msg, data?.details);
    }
    return data as T;
  }

  async function requestRaw(path: string, options: RequestInit = {}): Promise<any> {
    const token = await config.storage.getToken();
    const baseUrl = await config.getBaseUrl();
    const headers: Record<string, string> = { ...(options.headers as any) };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const res = await fetch(`${baseUrl}${path}`, { ...options, headers });
    let data: any = null;
    const text = await res.text();
    if (text) { try { data = JSON.parse(text); } catch { data = text; } }
    if (!res.ok) throw new ApiError(res.status, data?.error || `Error ${res.status}`, data?.details);
    return data;
  }

  return {
    post: <T>(path: string, body: any) => request<T>(path, { method: 'POST', body: JSON.stringify(body) }),
    put: <T>(path: string, body: any) => request<T>(path, { method: 'PUT', body: JSON.stringify(body) }),
    delete: <T>(path: string) => request<T>(path, { method: 'DELETE' }),
    auth: {
      register: (d: any) => request<any>('/auth/register', { method: 'POST', body: JSON.stringify(d) }),
      login: (email: string, password: string) => request<any>('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
      me: () => request<any>('/auth/me'),
    },
    card: {
      get: () => request<any>('/me/card'),
    },
    profile: {
      get: (alias: string) => request<any>(`/users/${alias}`),
      suggestions: (p?: { limit?: number }) => {
        const q = new URLSearchParams();
        if (p?.limit) q.set('limit', String(p.limit));
        return request<any>(`/users/suggestions?${q}`);
      },
      update: (d: any) => request<any>('/me/profile', { method: 'PATCH', body: JSON.stringify(d) }),
      changePassword: (currentPassword: string, newPassword: string) =>
        request<any>('/me/change-password', { method: 'POST', body: JSON.stringify({ currentPassword, newPassword }) }),
    },
    posts: {
      create: (d: any) => request<any>('/posts', { method: 'POST', body: JSON.stringify(d) }),
      feed: (p?: any) => {
        const q = new URLSearchParams();
        if (p?.limit) q.set('limit', String(p.limit));
        if (p?.hashtag) q.set('hashtag', p.hashtag);
        return request<any>(`/feed?${q}`);
      },
      userPosts: (id: string) => request<any>(`/users/${id}/posts`),
      reels: (p?: any) => {
        const q = new URLSearchParams();
        if (p?.limit) q.set('limit', String(p.limit));
        return request<any>(`/reels?${q}`);
      },
      delete: (id: string) => request<any>(`/posts/${id}`, { method: 'DELETE' }),
      repost: (id: string, body?: string) => request<any>(`/posts/${id}/repost`, { method: 'POST', body: JSON.stringify({ body: body ?? null }) }),
      drawings: (id: string) => request<any>(`/posts/${id}/drawings`),
      draw: (id: string, drawingUrl: string) => request<any>(`/posts/${id}/drawings`, { method: 'POST', body: JSON.stringify({ drawingUrl }) }),
      deleteDrawing: (id: string) => request<any>(`/drawings/${id}`, { method: 'DELETE' }),
      like: (id: string) => request<any>(`/posts/${id}/like`, { method: 'POST' }),
      unlike: (id: string) => request<any>(`/posts/${id}/like`, { method: 'DELETE' }),
      bookmark: (_id: string) => Promise.resolve({ ok: true }),
      unbookmark: (_id: string) => Promise.resolve({ ok: true }),
      bookmarks: () => Promise.resolve({ posts: [] }),
    },
    follows: {
      follow: (id: string) => request<any>(`/users/${id}/follow`, { method: 'POST' }),
      unfollow: (id: string) => request<any>(`/users/${id}/follow`, { method: 'DELETE' }),
      followers: (id: string) => request<any>(`/users/${id}/followers`),
      following: (id: string) => request<any>(`/users/${id}/following`),
    },
    comments: {
      create: (postId: string, body: string, parentId?: string) =>
        request<any>(`/posts/${postId}/comments`, { method: 'POST', body: JSON.stringify({ body, parentId }) }),
      list: (postId: string) => request<any>(`/posts/${postId}/comments`),
      replies: (commentId: string) => request<any>(`/comments/${commentId}/replies`),
      delete: (commentId: string) => request<any>(`/comments/${commentId}`, { method: 'DELETE' }),
      like: (commentId: string) => request<any>(`/comments/${commentId}/like`, { method: 'POST' }),
      unlike: (commentId: string) => request<any>(`/comments/${commentId}/like`, { method: 'DELETE' }),
    },
    notifications: {
      list: (p?: any) => {
        const q = new URLSearchParams();
        if (p?.limit) q.set('limit', String(p.limit));
        return request<any>(`/notifications?${q}`);
      },
      unreadCount: () => request<any>('/notifications/unread-count'),
      read: (id: string) => request<any>(`/notifications/${id}/read`, { method: 'PATCH' }),
      readAll: () => request<any>('/notifications/read-all', { method: 'POST' }),
      registerPushToken: (token: string, platform: 'ios' | 'android' | 'web') =>
        request<any>('/me/push-token', { method: 'POST', body: JSON.stringify({ token, platform }) }),
    },
    search: {
      users: (q: string) => request<any>(`/search/users?q=${encodeURIComponent(q)}`),
      posts: (q: string) => request<any>(`/search/posts?q=${encodeURIComponent(q)}`),
    },
    hashtags: {
      trending: (p?: any) => {
        const q = new URLSearchParams();
        if (p?.limit) q.set('limit', String(p.limit));
        return request<any>(`/hashtags/trending?${q}`);
      },
      get: (tag: string, p?: any) => {
        const q = new URLSearchParams();
        if (p?.limit) q.set('limit', String(p.limit));
        return request<any>(`/hashtags/${encodeURIComponent(tag)}?${q}`);
      },
    },
    vibes: {

      create: (mood: string, message?: string) =>

        request<any>('/vibes', { method: 'POST', body: JSON.stringify({ mood, message }) }),

      list: (p?: any) => {

        const q = new URLSearchParams();

        if (p?.limit) q.set('limit', String(p.limit));

        return request<any>(`/vibes?${q}`);

      },

      all: (p?: any) => {

        const q = new URLSearchParams();

        if (p?.limit) q.set('limit', String(p.limit));

        return request<any>(`/vibes/all?${q}`);

      },

      legacy: (p?: any) => {

        const q = new URLSearchParams();

        if (p?.limit) q.set('limit', String(p.limit));

        return request<any>(`/vibes/legacy?${q}`);

      },

      matches: () => request<any>('/vibes/matches'),

      delete: (id: string) => request<any>(`/vibes/${id}`, { method: 'DELETE' }),

      resonate: (id: string) => request<any>(`/vibes/${id}/resonate`, { method: 'POST' }),

      unresonate: (id: string) => request<any>(`/vibes/${id}/resonate`, { method: 'DELETE' }),

      userVibes: (alias: string) => request<any>(`/users/${alias}/vibes`),
    },
    legacy: {
      activate: (message?: string) =>
        request<any>('/me/legacy', { method: 'POST', body: JSON.stringify({ message }) }),
      deactivate: () => request<any>('/me/legacy', { method: 'DELETE' }),
      status: () => request<any>('/me/legacy'),
      circle: () => request<any>('/circle'),
      addToCircle: (memberId: string) => request<any>('/circle/add', { method: 'POST', body: JSON.stringify({ memberId }) }),
      acceptCircle: (ownerId: string) => request<any>('/circle/accept', { method: 'POST', body: JSON.stringify({ ownerId }) }),
      capsules: () => request<any>('/legacy/capsules'),
    },
    messages: {
      send: (to: string, body: string) =>
        request<any>('/messages', { method: 'POST', body: JSON.stringify({ to, body }) }),
      conversation: (alias: string) => request<any>(`/messages/${encodeURIComponent(alias)}`),
      conversations: () => request<any>('/messages'),
    },
    uploads: {
      // Sube un archivo. Recibe { uri, name, type }.
      // En RN no podemos usar fetch+FormData con URI local directamente en algunos casos.
      // Usamos XMLHttpRequest por compatibilidad.
      upload: async (file: { uri: string; name: string; type: string }): Promise<{ id: string; url: string; mime: string; size: number }> => {
        const baseUrl = await config.getBaseUrl();
        const token = await config.storage.getToken();
        const formData = new FormData();
        // @ts-ignore — React Native acepta este formato
        formData.append('file', { uri: file.uri, name: file.name, type: file.type } as any);
        return new Promise((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          xhr.open('POST', `${baseUrl}/uploads`);
          if (token) xhr.setRequestHeader('Authorization', `Bearer ${token}`);
          xhr.onload = () => {
            try {
              const json = JSON.parse(xhr.responseText);
              if (xhr.status >= 200 && xhr.status < 300) resolve(json);
              else reject(new ApiError(xhr.status, json?.error || `Error ${xhr.status}`));
            } catch (e) {
              reject(new ApiError(xhr.status, 'Respuesta inválida'));
            }
          };
          xhr.onerror = () => reject(new ApiError(0, 'Error de red'));
          xhr.send(formData);
        });
      },
      // Devuelve la URL absoluta a partir de la relativa (/uploads/xxx)
      absoluteUrl: async (relative: string): Promise<string> => {
        if (!relative) return '';
        if (relative.startsWith('http')) return relative;
        const baseUrl = await config.getBaseUrl();
        // baseUrl = 'http://host:port/api' -> 'http://host:port/uploads/xxx'
        const root = baseUrl.replace(/\/api$/, '');
        return root + relative;
      },
    },
    recovery: {
      panic: (cardId: string, secret: string, pin: string) =>
        request<any>('/auth/recover/panic', { method: 'POST', body: JSON.stringify({ cardId, secret, pin }) }),
      restore: (cardId: string, secret: string, pin: string, newPassword: string) =>
        request<any>('/auth/recover/restore', { method: 'POST', body: JSON.stringify({ cardId, secret, pin, newPassword }) }),
      fenix: (cardId: string, secret: string, pin: string) =>
        request<any>('/auth/recover/fenix', { method: 'POST', body: JSON.stringify({ cardId, secret, pin }) }),
      destroy: (cardId: string, pin: string, confirmText: string) =>
        request<any>('/recovery/destroy', { method: 'POST', body: JSON.stringify({ cardId, pin, confirmText }) }),
    },
    streams: {
      start: (title: string, description?: string) =>
        request<any>('/streams/start', { method: 'POST', body: JSON.stringify({ title, description }) }),
      end: (id: string) => request<any>(`/streams/${id}/end`, { method: 'POST' }),
      active: (p?: { limit?: number }) => {
        const q = new URLSearchParams();
        if (p?.limit) q.set('limit', String(p.limit));
        return request<any>(`/streams/active?${q}`);
      },
      get: (id: string) => request<any>(`/streams/${id}`),
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
    stories: {
      create: (d: { mediaUrl: string; mediaType: 'image' | 'video' }) =>
        request<any>('/stories', { method: 'POST', body: JSON.stringify(d) }),
      feed: () => request<any>('/stories/feed'),
      delete: (id: string) => request<any>(`/stories/${id}`, { method: 'DELETE' }),
    },
    livekit: {
    getToken: (roomName: string, isHost: boolean) => 
      request<any>(`/livekit/token?roomName=${roomName}&isHost=${isHost}`),
  },
  bookmarks: {
      list: () => Promise.resolve({ posts: [] }),
      add: (_postId: string) =>
        Promise.reject(new Error('Bookmarks no implementado')),
      remove: (_postId: string) =>
        Promise.reject(new Error('Bookmarks no implementado')),
    },
  };
}

export type ApiClient = ReturnType<typeof createApi>;
