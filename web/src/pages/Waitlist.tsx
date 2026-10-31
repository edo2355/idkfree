import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import './Waitlist.css';

const API_URL = import.meta.env.VITE_API_URL || 'https://idkfreegetid.dpdns.org/api';

export default function Waitlist() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [alias, setAlias] = useState('');
  const [email, setEmail] = useState('');
  const [referredBy, setReferredBy] = useState('');
  const [checkingAlias, setCheckingAlias] = useState(false);
  const [checkingRef, setCheckingRef] = useState(false);
  const [aliasStatus, setAliasStatus] = useState<{ available: boolean; reason?: string; suggestions?: string[] } | null>(null);
  const [refStatus, setRefStatus] = useState<{ valid: boolean; referrer_alias?: string; reason?: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<{ total: number; early_access_spots_left: number } | null>(null);

  // Detectar ?ref= en la URL
  useEffect(() => {
    const refFromUrl = searchParams.get('ref');
    if (refFromUrl) {
      setReferredBy(refFromUrl.toUpperCase());
    }
  }, [searchParams]);

  useEffect(() => {
    fetch(`${API_URL}/waitlist/stats`).then(r => r.json()).then(setStats).catch(() => {});
  }, []);

  // Validación en vivo del alias
  useEffect(() => {
    if (alias.length < 3) { setAliasStatus(null); return; }
    const timer = setTimeout(async () => {
      setCheckingAlias(true);
      try {
        const res = await fetch(`${API_URL}/waitlist/check-alias?alias=${encodeURIComponent(alias)}`);
        setAliasStatus(await res.json());
      } catch { setAliasStatus(null); }
      finally { setCheckingAlias(false); }
    }, 500);
    return () => clearTimeout(timer);
  }, [alias]);

  // Validación en vivo del código de referido
  useEffect(() => {
    if (!referredBy.trim()) { setRefStatus(null); return; }
    const timer = setTimeout(async () => {
      setCheckingRef(true);
      try {
        const res = await fetch(`${API_URL}/waitlist/check-referral?code=${encodeURIComponent(referredBy)}`);
        setRefStatus(await res.json());
      } catch { setRefStatus(null); }
      finally { setCheckingRef(false); }
    }, 500);
    return () => clearTimeout(timer);
  }, [referredBy]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!aliasStatus?.available || submitting) return;
    if (referredBy.trim() && refStatus && !refStatus.valid) {
      setError('El código de referido no es válido. Corrígelo o déjalo vacío.');
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/waitlist/join`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          alias: alias.toLowerCase().trim(),
          email: email.trim() || undefined,
          referred_by: referredBy.trim() || undefined,
        }),
      });
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error || 'Error al registrar');
      }
      const data = await res.json();
      navigate(`/waitlist/card/${data.referral_code}`, { state: { data } });
    } catch (err: any) {
      setError(err.message);
    } finally { setSubmitting(false); }
  }

  return (
    <div className="waitlist-page">
      <div className="waitlist-hero">
        <h1>Acceso anticipado</h1>
        <p className="waitlist-subtitle">
          IDKfree abre pronto. Los primeros 25 acceden <strong>15 días antes</strong> que el resto.
          <br/><strong>Invita amigos y subí 2 posiciones por cada uno.</strong>
        </p>
        {stats && (
          <div className="waitlist-counter">
            <span className="counter-number">{stats.total}</span>
            <span className="counter-label">personas ya reservaron su lugar</span>
            {stats.early_access_spots_left > 0 && (
              <span className="counter-spots">· Solo {stats.early_access_spots_left} spots de acceso anticipado</span>
            )}
          </div>
        )}
      </div>

      <form className="waitlist-form" onSubmit={handleSubmit}>
        <label className="form-field">
          <span className="field-label">Tu alias</span>
          <input
            type="text"
            placeholder="arquitecto_cuba"
            value={alias}
            onChange={e => setAlias(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
            maxLength={30}
            autoFocus
            autoComplete="off"
            spellCheck={false}
          />
          {alias.length >= 3 && (
            <div className={`alias-status ${aliasStatus?.available ? 'ok' : aliasStatus ? 'err' : ''}`}>
              {checkingAlias && '⏳ Verificando...'}
              {!checkingAlias && aliasStatus?.available && '✅ Disponible'}
              {!checkingAlias && aliasStatus && !aliasStatus.available && (
                <>
                  ❌ {aliasStatus.reason}
                  {aliasStatus.suggestions && (
                    <div className="suggestions">
                      Prueba:{' '}
                      {aliasStatus.suggestions.map(s => (
                        <button key={s} type="button" onClick={() => setAlias(s)} className="suggestion-chip">
                          @{s}
                        </button>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </label>

        <label className="form-field">
          <span className="field-label">Email (opcional)</span>
          <input
            type="email"
            placeholder="tu@email.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            autoComplete="email"
          />
          <span className="field-hint">Te avisamos cuando llegue tu turno. No compartimos tu email.</span>
        </label>

        <label className="form-field">
          <span className="field-label">¿Alguien te invitó? (opcional)</span>
          <input
            type="text"
            placeholder="IDK-XXXX-YYYY"
            value={referredBy}
            onChange={e => setReferredBy(e.target.value.toUpperCase())}
            maxLength={20}
            autoComplete="off"
            spellCheck={false}
          />
          {referredBy.trim() && (
            <div className={`alias-status ${refStatus?.valid ? 'ok' : refStatus ? 'err' : ''}`}>
              {checkingRef && '⏳ Verificando código...'}
              {!checkingRef && refStatus?.valid && `✅ Código de @${refStatus.referrer_alias} — ¡Te sube 2 posiciones!`}
              {!checkingRef && refStatus && !refStatus.valid && `❌ ${refStatus.reason}`}
            </div>
          )}
          {!referredBy.trim() && (
            <span className="field-hint">
              Si alguien te compartió su pase, pegá su código acá. Te suma 2 posiciones.
            </span>
          )}
        </label>

        {error && <div className="form-error">{error}</div>}

        <button
          type="submit"
          className="submit-btn"
          disabled={!aliasStatus?.available || submitting || !!(referredBy.trim() && refStatus && !refStatus.valid)}
        >
          {submitting ? 'Reservando...' : 'Reservar mi lugar →'}
        </button>

        <p className="form-footer">
          Sin spam. Sin tarjeta. Sin compromiso.
        </p>
      </form>
    </div>
  );
}
