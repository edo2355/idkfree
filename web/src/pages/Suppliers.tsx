import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { listSuppliers, type Supplier } from '../api/suppliers';
import './Suppliers.css';

const COUNTRIES = [
  { code: 'CN', name: 'China', flag: '🇨🇳' }, { code: 'ES', name: 'España', flag: '🇪🇸' },
  { code: 'MX', name: 'México', flag: '🇲🇽' }, { code: 'PA', name: 'Panamá', flag: '🇵🇦' },
  { code: 'US', name: 'USA', flag: '🇺🇸' }, { code: 'DO', name: 'Rep. Dominicana', flag: '🇩🇴' },
  { code: 'BR', name: 'Brasil', flag: '🇧🇷' }, { code: 'AR', name: 'Argentina', flag: '🇦🇷' },
  { code: 'CO', name: 'Colombia', flag: '🇨🇴' }, { code: 'IT', name: 'Italia', flag: '🇮🇹' },
  { code: 'FR', name: 'Francia', flag: '🇫🇷' }, { code: 'DE', name: 'Alemania', flag: '🇩🇪' },
  { code: 'GB', name: 'Reino Unido', flag: '🇬🇧' }, { code: 'TR', name: 'Turquía', flag: '🇹🇷' },
  { code: 'RU', name: 'Rusia', flag: '🇷🇺' }, { code: 'IN', name: 'India', flag: '🇮🇳' },
];
const CATEGORIES = ['electronics','textiles','ferreteria','alimentos','juguetes','cosmeticos','muebles','autopartes','tecnologia','papeleria','construccion','salud','deportes','joyeria'];

const flagOf = (c: string) => COUNTRIES.find(x => x.code === c)?.flag ?? '🌍';
const nameOf = (c: string) => COUNTRIES.find(x => x.code === c)?.name ?? c;

export function Suppliers() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const country = searchParams.get('country') ?? '';
  const category = searchParams.get('category') ?? '';
  const verified = searchParams.get('verified') === '1';
  const q = searchParams.get('q') ?? '';
  const [qInput, setQInput] = useState(q);

  useEffect(() => {
    let cancelled = false;
    setLoading(true); setError(null);
    listSuppliers({ country: country || undefined, category: category || undefined, verified, q: q || undefined })
      .then(res => { if (!cancelled) setSuppliers(res.suppliers); })
      .catch(err => { if (!cancelled) setError(err.message || 'Error al cargar'); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [country, category, verified, q]);

  const updateFilter = (key: string, value: string) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value); else next.delete(key);
    setSearchParams(next, { replace: true });
  };

  return (
    <div className="suppliers-page">
      <header className="suppliers-header">
        <div>
          <h1>Proveedores Internacionales</h1>
          <p className="suppliers-subtitle">Encuentra proveedores en China, España, México y más. Contacta directo por WhatsApp, email o WeChat.</p>
        </div>
        <Link to="/suppliers/me" className="btn btn-primary">Registrar mi empresa</Link>
      </header>

      <section className="suppliers-filters">
        <form onSubmit={e => { e.preventDefault(); updateFilter('q', qInput.trim()); }} className="suppliers-search">
          <input type="text" placeholder="Buscar por nombre..." value={qInput} onChange={e => setQInput(e.target.value)} />
          <button type="submit" className="btn">Buscar</button>
        </form>
        <div className="suppliers-selects">
          <select value={country} onChange={e => updateFilter('country', e.target.value)}>
            <option value="">Todos los países</option>
            {COUNTRIES.map(c => <option key={c.code} value={c.code}>{c.flag} {c.name}</option>)}
          </select>
          <select value={category} onChange={e => updateFilter('category', e.target.value)}>
            <option value="">Todas las categorías</option>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <label className="suppliers-check">
            <input type="checkbox" checked={verified} onChange={e => updateFilter('verified', e.target.checked ? '1' : '')} />
            Solo verificados
          </label>
        </div>
      </section>

      {error && <div className="suppliers-error">{error}</div>}
      {loading ? <div className="suppliers-loading">Cargando proveedores…</div>
        : suppliers.length === 0 ? (
          <div className="suppliers-empty">
            <p>No hay proveedores con esos filtros.</p>
            <Link to="/suppliers/me" className="btn">Sé el primero en registrarte</Link>
          </div>
        ) : (
          <div className="suppliers-grid">
            {suppliers.map(s => (
              <Link key={s.id} to={`/suppliers/${s.id}`} className="supplier-card">
                <div className="supplier-card-header">
                  <h3>{s.company_name}</h3>
                  {s.verified ? <span className="badge-verified">✓ Verificado</span> : null}
                </div>
                <div className="supplier-card-country">{flagOf(s.country_code)} {nameOf(s.country_code)}</div>
                {s.categories && <div className="supplier-card-cats">{s.categories.split(',').slice(0, 3).map(c => <span key={c} className="chip">{c.trim()}</span>)}</div>}
                {s.min_order_value !== null && s.min_order_value > 0 && <div className="supplier-card-moq">MOQ: {s.currency} {s.min_order_value}</div>}
              </Link>
            ))}
          </div>
        )}
    </div>
  );
}
