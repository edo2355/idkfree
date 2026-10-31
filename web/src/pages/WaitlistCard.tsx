import { useState, useEffect } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import './WaitlistCard.css';

const API_URL = import.meta.env.VITE_API_URL || 'https://idkfreegetid.dpdns.org/api';

export default function WaitlistCard() {
  const { code } = useParams<{ code: string }>();
  const location = useLocation();
  const [data, setData] = useState<any>(location.state?.data || null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(!data);

  useEffect(() => {
    if (data) return;
    // Si entraron por link directo, no tenemos los datos
    setLoading(false);
  }, [code, data]);

  function copyShareLink() {
    const url = `${window.location.origin}/waitlist/card/${code}`;
    const text = `Estoy en la lista de espera de IDKfree, la plataforma que conecta Cuba con el mundo. Únete con mi pase:`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`;
    window.open(whatsappUrl, '_blank');
  }

  async function copyCode() {
    try {
      await navigator.clipboard.writeText(code || '');
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  }

  if (loading) return <div className="waitlist-card-page"><div className="loading">Cargando…</div></div>;

  return (
    <div className="waitlist-card-page">
      <div className="pass-card">
        <div className="pass-header">
          <span className="pass-brand">IDKFREE</span>
          <span className="pass-type">ACCESO ANTICIPADO</span>
        </div>

        <div className="pass-avatar">
          {data?.alias ? data.alias.charAt(0).toUpperCase() : '@'}
        </div>

        <div className="pass-alias">
          @{data?.alias || 'usuario'}
        </div>

        {data?.is_early_access && (
          <div className="pass-badge early">✓ ESTÁS DENTRO</div>
        )}
        {data && !data.is_early_access && (
          <div className="pass-badge waiting">⏳ EN LISTA</div>
        )}

        <div className="pass-position">
          <span className="pos-label">Posición</span>
          <span className="pos-number">#{data?.position || '?'}</span>
        </div>

        <div className="pass-code-block">
          <span className="code-label">CÓDIGO DE REFERIDO</span>
          <code className="code-value">{code}</code>
          <button className="copy-btn" onClick={copyCode}>
            {copied ? '✓ Copiado' : 'Copiar'}
          </button>
        </div>

        <div className="pass-footer">
          {data?.is_early_access
            ? 'Accederás 15 días antes que el público general.'
            : 'Te avisaremos cuando llegue tu turno.'}
        </div>
      </div>

      <div className="pass-actions">
        <button className="share-btn" onClick={copyShareLink}>
          Compartir por WhatsApp
        </button>
        <Link to="/waitlist" className="secondary-btn">
          Compartir mi link con amigos
        </Link>
      </div>

      <p className="pass-hint">
        Cuantos más amigos se sumen con tu código, más rápido subes en la lista.
      </p>
    </div>
  );
}
