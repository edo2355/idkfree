export function resolveAssetUrl(url: string) {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  // Apuntar a la URL del backend en producción
  const BACKEND_URL = 'https://idkfreegetid.dpdns.org';
  return `${BACKEND_URL}${url.startsWith('/') ? '' : '/'}${url}`;
}
