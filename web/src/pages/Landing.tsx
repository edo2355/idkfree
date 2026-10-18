import { Link } from 'react-router-dom';
import { ScreenBackground } from '../components/ScreenBackground';
import './Landing.css';

export function Landing() {
  return (
    <div className="landing-container">
      {/* Fondo con gradientes de color */}
      <div className="landing-bg-glow"></div>
      <ScreenBackground variant="neural" opacity={0.2} />

      <header className="landing-header">
        <div className="landing-logo">
          IDKFREE<span style={{ color: 'var(--accent)' }}>.</span>OS
        </div>
        <Link to="/login" className="landing-login-btn">Entrar</Link>
      </header>

      <main className="landing-hero">
        {/* Textos principales */}
        <h1 className="landing-title">
          La red social de la <br />
          <span className="text-gradient">Soberanía Digital</span>
        </h1>
        <p className="landing-subtitle">
          No lo sé, gratis o libre. Un lugar para pensar en voz alta, conectar con otros y ser dueño de tus datos.
        </p>

        {/* Botones */}
        <div className="landing-actions">
          <a href="#" className="landing-btn primary">
            📱 Descargar para Android
          </a>
          <button disabled className="landing-btn secondary disabled">
            🍏 iOS Próximamente
          </button>
        </div>

        {/* Mockup visual (Aquí luego puedes poner una foto real) */}
        <div className="landing-mockup-container">
          <div className="mockup-glow"></div>
          <div className="mockup-screen">
            <img src="/icon.png" alt="App Icon" className="mockup-icon" />
            <div className="mockup-text">IDKFREE</div>
            <div className="mockup-subtext">SYSTEM READY</div>
          </div>
        </div>

        {/* Tarjetas de características */}
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
            <p>Comparte posts, historias, notas y dibujos sin algoritmos.</p>
          </div>
        </div>
      </main>

      <footer className="landing-footer">
        <span>© 2026 IDKFREE · from / edo amate</span>
      </footer>
    </div>
  );
}
