import { useEffect, useState } from 'react';

const TYPE_ICONS: Record<string, string> = {
  necesidad: '🏭', producto: '📦', servicio: '🤝', obra: '🔨',
};
const TYPE_LABELS: Record<string, string> = {
  necesidad: 'NECESIDAD', producto: 'PRODUCTO', servicio: 'SERVICIO', obra: 'OBRA',
};
const ACTION_LABELS: Record<string, string> = {
  comprar: 'Solicitar cotización', contratar: 'Contactar proveedor',
  ofrecer: 'Enviar propuesta', ver_mas: 'Ver detalles',
};
const DATA_LABELS: Record<string, string> = {
  budget_cup: 'Presupuesto', price_cup: 'Precio', stock: 'Stock',
  deadline: 'Plazo', country_pref: 'Países', moq: 'MOQ', currency: 'Moneda',
};

export function OpportunityCard({ post }: { post: any }) {
  const [data, setData] = useState<any>(null);
  useEffect(() => {
    if (!post.request_data) return;
    try { setData(JSON.parse(post.request_data)); } catch { setData(null); }
  }, [post.request_data]);

  const icon = TYPE_ICONS[post.type] || '📋';
  const label = TYPE_LABELS[post.type] || String(post.type).toUpperCase();
  const actionLabel = ACTION_LABELS[post.action_type] || 'Ver más';

  return (
    <article className="opportunity-card">
      <div className="opportunity-header">
        <span className="opportunity-icon">{icon}</span>
        <div className="opportunity-meta">
          <span className="opportunity-type">{label}</span>
          <span className="opportunity-author">@{post.author_alias}</span>
        </div>
      </div>
      <h3 className="opportunity-title">{post.body}</h3>
      {data && Object.keys(data).length > 0 && (
        <div className="opportunity-data">
          {Object.entries(data).map(([k, v]) => (
            <div key={k} className="data-row">
              <span className="data-label">{DATA_LABELS[k] || k}</span>
              <span className="data-value">{Array.isArray(v) ? v.join(', ') : String(v)}</span>
            </div>
          ))}
        </div>
      )}
      <div className="opportunity-actions">
        <button className="opp-btn-primary" onClick={() => alert('Próximamente: ' + actionLabel)}>
          {actionLabel}
        </button>
        <button className="opp-btn-secondary" onClick={() => alert('Próximamente: Contactar por DM')}>
          Contactar
        </button>
      </div>
    </article>
  );
}
