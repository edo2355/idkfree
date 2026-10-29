import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMySupplier, upsertMySupplier, type Supplier } from '../api/suppliers';
import './Suppliers.css';

export function SupplierRegister() {
  const navigate = useNavigate();
  const [existing, setExisting] = useState<Supplier | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    company_name: '', categories: '', min_order_value: '', currency: 'USD',
    shipping_methods: '', contact_whatsapp: '', contact_email: '',
    contact_wechat: '', website: '', description: '',
  });

  useEffect(() => {
    getMySupplier()
      .then(res => {
        setExisting(res.supplier);
        setForm({
          company_name: res.supplier.company_name,
          categories: res.supplier.categories ?? '',
          min_order_value: res.supplier.min_order_value?.toString() ?? '',
          currency: res.supplier.currency || 'USD',
          shipping_methods: res.supplier.shipping_methods ?? '',
          contact_whatsapp: res.supplier.contact_whatsapp ?? '',
          contact_email: res.supplier.contact_email ?? '',
          contact_wechat: res.supplier.contact_wechat ?? '',
          website: res.supplier.website ?? '',
          description: res.supplier.description ?? '',
        });
      })
      .catch(() => { /* sin perfil, form vacío */ })
      .finally(() => setLoading(false));
  }, []);

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.company_name.trim()) { setError('Nombre de empresa es obligatorio'); return; }
    setSaving(true); setError(null);
    try {
      await upsertMySupplier({
        company_name: form.company_name.trim(),
        categories: form.categories.trim() || undefined,
        min_order_value: form.min_order_value ? parseFloat(form.min_order_value) : undefined,
        currency: form.currency || 'USD',
        shipping_methods: form.shipping_methods.trim() || undefined,
        contact_whatsapp: form.contact_whatsapp.trim() || undefined,
        contact_email: form.contact_email.trim() || undefined,
        contact_wechat: form.contact_wechat.trim() || undefined,
        website: form.website.trim() || undefined,
        description: form.description.trim() || undefined,
      });
      navigate('/suppliers');
    } catch (err: any) { setError(err.message || 'Error al guardar'); }
    finally { setSaving(false); }
  };

  if (loading) return <div className="suppliers-page"><div className="suppliers-loading">Cargando…</div></div>;

  return (
    <div className="suppliers-page">
      <header className="suppliers-header">
        <div>
          <h1>{existing ? 'Mi empresa' : 'Registrar mi empresa'}</h1>
          <p className="suppliers-subtitle">
            Tu país se detecta desde tu teléfono.
            {existing?.verified_at && ' ✓ Tu empresa ya está verificada.'}
            {existing && !existing.verified_at && ' ⏳ Tu empresa está pendiente de verificación.'}
          </p>
        </div>
      </header>

      {error && <div className="suppliers-error">{error}</div>}

      <form onSubmit={onSubmit} className="supplier-form">
        <div className="form-row">
          <label>Nombre de la empresa *<input name="company_name" value={form.company_name} onChange={onChange} required /></label>
        </div>
        <div className="form-row">
          <label>Categorías (coma)<input name="categories" value={form.categories} onChange={onChange} placeholder="electronics, textiles" /></label>
        </div>
        <div className="form-row form-row-3">
          <label>Pedido mínimo<input name="min_order_value" type="number" value={form.min_order_value} onChange={onChange} placeholder="500" /></label>
          <label>Moneda<select name="currency" value={form.currency} onChange={onChange}><option>USD</option><option>EUR</option><option>CUP</option><option>MXN</option></select></label>
          <label>Envío<input name="shipping_methods" value={form.shipping_methods} onChange={onChange} placeholder="Marítimo, aéreo" /></label>
        </div>
        <div className="form-row form-row-2">
          <label>WhatsApp<input name="contact_whatsapp" value={form.contact_whatsapp} onChange={onChange} placeholder="+8613800138000" /></label>
          <label>Email<input name="contact_email" type="email" value={form.contact_email} onChange={onChange} placeholder="sales@empresa.com" /></label>
        </div>
        <div className="form-row form-row-2">
          <label>WeChat<input name="contact_wechat" value={form.contact_wechat} onChange={onChange} /></label>
          <label>Sitio web<input name="website" value={form.website} onChange={onChange} placeholder="https://..." /></label>
        </div>
        <div className="form-row">
          <label>Descripción<textarea name="description" rows={4} value={form.description} onChange={onChange} placeholder="Qué vende, condiciones especiales…" /></label>
        </div>
        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? 'Guardando…' : (existing ? 'Actualizar perfil' : 'Crear perfil')}
          </button>
        </div>
      </form>
    </div>
  );
}
