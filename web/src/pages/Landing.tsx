import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ScreenBackground } from '../components/ScreenBackground';
import './Landing.css';

const API_URL = import.meta.env.VITE_API_URL || 'https://idkfreegetid.dpdns.org/api';

export function Landing() {
  const [stats, setStats] = useState<{ total: number; early_access_spots_left: number } | null>(null);

  useEffect(() => {
    fetch(`${API_URL}/waitlist/stats`)
      .then(r => r.json())
      .then(setStats)
      .catch(() => {});
  }, []);

  return (
    <div className="landing-container">
      <div className="landing-bg-glow"></div>
      <ScreenBackground variant="neural" opacity={0.2} />

      <header className="landing-header">
        <div className="landing-logo">
          IDKFREE<span style={{ color: 'var(--accent)' }}>.</span>OS
        </div>
        <Link to="/login" className="landing-login-btn">Entrar</Link>
      </header>

      {/* Banner waitlist */}
      <div className="waitlist-banner">
        <div className="waitlist-banner-content">
          <span className="waitlist-banner-emoji">🚀</span>
          <div className="waitlist-banner-text">
            <strong>Acceso anticipado abierto</strong>
            <span>
              {stats
                ? `${stats.total} ${stats.total === 1 ? 'persona' : 'personas'} ya reservó · Solo ${stats.early_access_spots_left} spots de acceso anticipado`
                : 'Los primeros 25 acceden 15 días antes que el resto'}
            </span>
          </div>
        </div>
        <Link to="/waitlist" className="waitlist-banner-btn">
          Reservar mi lugar →
        </Link>
      </div>

      <main className="landing-hero">
        <h1 className="landing-title">
          La red social de la <br />
          <span className="text-gradient">Soberanía Digital</span>
        </h1>
        <p className="landing-subtitle">
          No lo sé, gratis o libre. Un lugar para pensar en voz alta, conectar con otros y ser dueño de tus datos.
        </p>

        <div className="landing-actions">
          <a href="#" className="landing-btn primary">
            📱 Descargar para Android
          </a>
          <button disabled className="landing-btn secondary disabled">
            🍏 iOS Próximamente
          </button>
        </div>

        <div className="landing-mockup-container">
          <div className="mockup-glow"></div>
          <div className="mockup-screen">
            <img src="/icon.png" alt="App Icon" className="mockup-icon" />
            <div className="mockup-text">IDKFREE</div>
            <div className="mockup-subtext">SYSTEM READY</div>
          </div>
        </div>

        <div className="landing-features">
          <div className="feature-card">
            <h3>🔒 Privacidad Real</h3>
            <p>Tu identidad protegida por PINs de pánico y recuperación.</p>
          </div>
          <div className="feature-card">
            <h3>⚡ Multi-Engine</h3>
            <p>Velocidad local con SQLite y respaldo en la nube con Turso.</p>
          </div>
          <div className="feature-card">
            <h3>🎨 Tu Espacio</h3>
            <p>Personaliza tu perfil y controla quién puede contactarte.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
