export function resolveAssetUrl(url?: string | null): string {
  if (!url) return '';
  if (url.startsWith('http')) return url; // Ya es una URL absoluta
  
  // Si es relativa, le pegamos la URL del backend
  const baseUrl = (import.meta.env.VITE_API_URL || 'http://localhost:3000/api').replace('/api', '');
  return `${baseUrl}${url.startsWith('/') ? '' : '/'}${url}`;
}
