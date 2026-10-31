import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import './WaitlistCard.css';

const API_URL = import.meta.env.VITE_API_URL || 'https://idkfreegetid.dpdns.org/api';

interface CardData {
  alias: string;
  position: number;
  effective_position: number;
  referrals_count: number;
  referral_code: string;
  referred_by_code: string | null;
  is_early_access: boolean;
  spots_to_early_access: number;
  next_milestone: { at: number; remaining: number; bonus_positions: number } | null;
  created_at: string;
}

export default function WaitlistCard() {
  const { code } = useParams<{ code: string }>();
  const [data, setData] = useState<CardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!code) return;
    setLoading(true);
    fetch(`${API_URL}/waitlist/card/${code}`)
      .then(async (res) => {
        if (!res.ok) throw new Error('Pase no encontrado');
        setData(await res.json());
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [code]);

  function shareWhatsApp() {
    if (!data) return;
    const url = `${window.location.origin}/waitlist?ref=${data.referral_code}`;
    const text = `Estoy en la lista de IDKfree, la plataforma que conecta Cuba con el mundo. Usá mi código y subí 2 posiciones: ${data.referral_code}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text + '\n' + url)}`, '_blank');
  }

  async function copyCode() {
    if (!data) return;
    try {
      await navigator.clipboard.writeText(data.referral_code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  }

  if (loading) return <div className="waitlist-card-page"><div className="loading">Cargando pase…</div></div>;
  if (error || !data) return <div className="waitlist-card-page"><div className="form-error">{error || 'Pase no encontrado'}</div></div>;

  const progressPercent = data.next_milestone
    ? Math.min(100, ((data.next_milestone.at - data.next_milestone.remaining) / data.next_milestone.at) * 100)
    : 100;

  return (
    <div className="waitlist-card-page">
      <div className="pass-card">
        <div className="pass-header">
          <span className="pass-brand">IDKFREE</span>
          <span className="pass-type">ACCESO ANTICIPADO</span>
        </div>

        <div className="pass-avatar">
          {data.alias.charAt(0).toUpperCase()}
        </div>

        <div className="pass-alias">@{data.alias}</div>

        {data.is_early_access ? (
          <div className="pass-badge early">✓ ESTÁS DENTRO</div>
        ) : (
          <div className="pass-badge waiting">
            ⏳ Te faltan {data.spots_to_early_access} posiciones
          </div>
        )}

        <div className="pass-position">
          <span className="pos-label">Tu posición efectiva</span>
          <span className="pos-number">#{data.effective_position}</span>
          {data.referrals_count > 0 && (
            <span className="pos-real">Posición real: #{data.position} · Boost: -{data.referrals_count * 2}</span>
          )}
        </div>

        {data.next_milestone && (
          <div className="milestone-block">
            <div className="milestone-text">
              🎯 Traé <strong>{data.next_milestone.remaining}</strong> {data.next_milestone.remaining === 1 ? 'amigo más' : 'amigos más'} para llegar a <strong>{data.next_milestone.at} referidos</strong>
              <span className="milestone-bonus">+{data.next_milestone.bonus_positions} posiciones de boost</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${progressPercent}%` }} />
            </div>
            <div className="progress-label">
              {data.next_milestone.at - data.next_milestone.remaining} / {data.next_milestone.at} referidos
            </div>
          </div>
        )}

        {data.referrals_count > 0 && !data.next_milestone && (
          <div className="milestone-block">
            <div className="milestone-text">🏆 ¡Máximo nivel alcanzado! Ya trajiste {data.referrals_count} amigos.</div>
          </div>
        )}

        <div className="pass-code-block">
          <span className="code-label">TU CÓDIGO DE REFERIDO</span>
          <code className="code-value">{data.referral_code}</code>
          <button className="copy-btn" onClick={copyCode}>
            {copied ? '✓ Copiado' : 'Copiar código'}
          </button>
        </div>

        <div className="pass-footer">
          {data.referrals_count === 0
            ? 'Compartí tu código: cada amigo que se sume te sube 2 posiciones.'
            : `Ya trajiste ${data.referrals_count} ${data.referrals_count === 1 ? 'amigo' : 'amigos'}. ¡Seguí compartiendo!`}
        </div>
      </div>

      <button className="share-btn" onClick={shareWhatsApp}>
        Compartir por WhatsApp
      </button>
      <p className="pass-hint">
        Cada amigo que entre con tu código te sube 2 posiciones. Los primeros 25 acceden 15 días antes.
      </p>
    </div>
  );
}
