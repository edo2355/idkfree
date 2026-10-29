import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getSupplier, type Supplier } from '../api/suppliers';
import './Suppliers.css';

const COUNTRIES: Record<string, { name: string; flag: string }> = {
  CN: { name: 'China', flag: '🇨🇳' }, ES: { name: 'España', flag: '🇪🇸' },
  MX: { name: 'México', flag: '🇲🇽' }, PA: { name: 'Panamá', flag: '🇵🇦' },
  US: { name: 'USA', flag: '🇺🇸' }, DO: { name: 'Rep. Dominicana', flag: '🇩🇴' },
  BR: { name: 'Brasil', flag: '🇧🇷' }, AR: { name: 'Argentina', flag: '🇦🇷' },
  CO: { name: 'Colombia', flag: '🇨🇴' }, IT: { name: 'Italia', flag: '🇮🇹' },
  FR: { name: 'Francia', flag: '🇫🇷' }, DE: { name: 'Alemania', flag: '🇩🇪' },
  GB: { name: 'Reino Unido', flag: '🇬🇧' }, TR: { name: 'Turquía', flag: '🇹🇷' },
  RU: { name: 'Rusia', flag: '🇷🇺' }, IN: { name: 'India', flag: '🇮🇳' }, CU: { name: 'Cuba', flag: '🇨🇺' },
};

export function SupplierDetail() {
  const { id } = useParams<{ id: string }>();
  const [supplier, setSupplier] = useState<Supplier | null>(null);
  const [contactsVisible, setContactsVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    getSupplier(id)
      .then(res => { setSupplier(res.supplier); setContactsVisible(res.contacts_visible); })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  const copy = async (text: string, label: string) => {
    try { await navigator.clipboard.writeText(text); }
    catch {
      const el = document.createElement('textarea');
      el.value = text; document.body.appendChild(el); el.select();
      document.execCommand('copy'); document.body.removeChild(el);
    }
    setCopied(label);
    setTimeout(() => setCopied(null), 2500);
  };

  if (loading) return <div className="suppliers-page"><div className="suppliers-loading">Cargando…</div></div>;
  if (error) return <div className="suppliers-page"><div className="suppliers-error">{error}</div></div>;
  if (!supplier) return <div className="suppliers-page"><div className="suppliers-empty">Proveedor no encontrado</div></div>;

  const c = COUNTRIES[supplier.country_code] ?? { name: supplier.country_code, flag: '🌍' };

  return (
    <div className="suppliers-page">
      <Link to="/suppliers" className="back-link">← Volver al directorio</Link>
      <header className="detail-header">
        <h1>{supplier.company_name}</h1>
        {supplier.verified_at && <span className="badge-verified">✓ Verificado</span>}
        <div className="detail-country">{c.flag} {c.name}</div>
      </header>

      {!supplier.verified_at && (
        <div className="detail-banner">⏳ Este proveedor está pendiente de verificación. Los contactos se hacen visibles cuando un administrador lo verifique.</div>
      )}

      <section className="detail-grid">
        {supplier.categories && (
          <div className="detail-field">
            <span className="detail-label">Categorías</span>
            <div className="detail-chips">{supplier.categories.split(',').map(x => <span key={x} className="chip">{x.trim()}</span>)}</div>
          </div>
        )}
        {supplier.min_order_value !== null && supplier.min_order_value > 0 && (
          <div className="detail-field"><span className="detail-label">Pedido mínimo</span><span className="detail-value">{supplier.currency} {supplier.min_order_value}</span></div>
        )}
        {supplier.shipping_methods && (
          <div className="detail-field"><span className="detail-label">Métodos de envío</span><span className="detail-value">{supplier.shipping_methods}</span></div>
        )}
      </section>

      {supplier.description && (
        <section className="detail-section"><h2>Descripción</h2><p>{supplier.description}</p></section>
      )}

      {contactsVisible ? (
        <section className="detail-section">
          <h2>Contacto directo</h2>
          <div className="contact-buttons">
            {supplier.contact_whatsapp && <button className="btn btn-contact" onClick={() => copy(supplier.contact_whatsapp!, 'WhatsApp')}>📱 WhatsApp: {supplier.contact_whatsapp}</button>}
            {supplier.contact_email && <button className="btn btn-contact" onClick={() => copy(supplier.contact_email!, 'Email')}>✉️ Email: {supplier.contact_email}</button>}
            {supplier.contact_wechat && <button className="btn btn-contact" onClick={() => copy(supplier.contact_wechat!, 'WeChat')}>💬 WeChat: {supplier.contact_wechat}</button>}
            {supplier.website && <a className="btn btn-contact" href={supplier.website} target="_blank" rel="noopener noreferrer">🌐 Sitio web</a>}
          </div>
          <p className="contact-hint">Copia el contacto y pégalo en la app correspondiente. Si el proveedor no responde por WhatsApp, prueba también por email.</p>
        </section>
      ) : (
        <section className="detail-section detail-contact-locked">
          <h2>🔒 Contacto oculto</h2>
          <p>Los datos de contacto de este proveedor no están disponibles todavía.</p>
        </section>
      )}

      {copied && <div className="toast-success">✅ {copied} copiado al portapapeles</div>}
    </div>
  );
}
