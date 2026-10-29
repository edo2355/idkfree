const API_URL = import.meta.env.VITE_API_URL || 'https://idkfreegetid.dpdns.org/api';

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('aldea_token');
  const headers: HeadersInit = { 'Content-Type': 'application/json', ...options.headers };
  if (token) (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  let opts = options;
  if (options.method && ['POST', 'PUT', 'PATCH'].includes(options.method) && !options.body) {
    opts = { ...options, body: '{}' };
  }
  const res = await fetch(`${API_URL}${path}`, { ...opts, headers });
  const text = await res.text();
  let data: any = null;
  if (text) { try { data = JSON.parse(text); } catch { data = text; } }
  if (!res.ok) throw new Error(data?.error || `Error ${res.status}`);
  return data as T;
}

export interface Supplier {
  id: string;
  user_id: string;
  company_name: string;
  country_code: string;
  categories: string | null;
  min_order_value: number | null;
  currency: string;
  shipping_methods: string | null;
  contact_whatsapp?: string | null;
  contact_email?: string | null;
  contact_wechat?: string | null;
  website: string | null;
  description: string | null;
  verified_at: string | null;
  verified_by: string | null;
  created_at: string;
  verified?: 0 | 1;
  contacts_visible?: boolean;
}

export interface ListFilters {
  country?: string; category?: string; verified?: boolean;
  q?: string; limit?: number; offset?: number;
}

export async function listSuppliers(filters: ListFilters = {}) {
  const p = new URLSearchParams();
  if (filters.country) p.set('country', filters.country);
  if (filters.category) p.set('category', filters.category);
  if (filters.verified) p.set('verified', '1');
  if (filters.q) p.set('q', filters.q);
  if (filters.limit) p.set('limit', String(filters.limit));
  if (filters.offset) p.set('offset', String(filters.offset));
  const qs = p.toString();
  return request<{ suppliers: Supplier[]; total: number }>(`/suppliers${qs ? '?' + qs : ''}`);
}

export async function getSupplier(id: string) {
  return request<{ supplier: Supplier; contacts_visible: boolean }>(`/suppliers/${id}`);
}

export async function getMySupplier() {
  return request<{ supplier: Supplier }>('/suppliers/me');
}

export async function upsertMySupplier(data: Partial<Supplier> & { company_name: string }) {
  return request<{ supplier: Supplier }>('/suppliers/me', { method: 'POST', body: JSON.stringify(data) });
}
