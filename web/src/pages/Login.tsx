import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api, ApiError } from '../api/client';
import { useAuthStore } from '../stores/authStore';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { ScreenBackground } from '../components/ScreenBackground';
import './Login.css';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const setAuth = useAuthStore((s) => s.setAuth);
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.auth.login(email, password);
      setAuth({ id: res.userId, alias: res.alias }, res.accessToken);
      navigate('/');
    } catch (err) {
      if (err instanceof ApiError) setError(err.message);
      else setError('Error de conexión');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-container">
      <ScreenBackground variant="topo" opacity={0.15} />

      {/* HUD Superior */}
      <div className="login-hud-top">
        <span style={{ color: '#22C55E' }}>● IDKFREE.OS</span>
        <span>SERVIDOR</span>
        <span>V2.0.0 · 2026</span>
      </div>

      {/* Textos de fondo (Watermarks) */}
      <div className="watermark wm-1">SOBERANIA<br/>DIGITAL</div>
      <div className="watermark wm-2">2023</div>
      <div className="watermark wm-3">RECUPERACIÓN<br/>3.DRS - IDENTIDAD</div>
      <div className="watermark wm-4">IDKFREE<br/>2023 - ∞</div>
      <div className="watermark wm-5">SYS.CMD<br/>&gt;_</div>

      <form onSubmit={handleSubmit} className="login-form">
        {/* Barra de estado LIVE */}
        <div className="login-status-bar">
          <div className="status-left">
            <span className="status-dot"></span>
            <span className="status-text">LIVE</span>
            <span className="status-divider">·</span>
            <span className="status-text">LOCAL</span>
            <span className="status-divider">·</span>
            <span className="status-text">sqlite</span>
          </div>
          <span className="status-time">427ms</span>
        </div>

        <div className="login-barcode"></div>

        <div className="login-title-row">
          <h1 className="login-title">IDKFREE</h1>
          <div className="terminal-icon">&gt;_</div>
        </div>
        
        <div className="login-auth-cmd">AUTH.CMD</div>
        <p className="login-subtitle">No lo sé, gratis o libre</p>

        <div className="login-input-header">
          <span>[ INPUT ]</span>
          <span>SYS.REQ.01</span>
        </div>

        <div style={{ marginBottom: 16 }}>
          <Input label="EMAIL" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="tu@email.com" required />
        </div>

        <div style={{ marginBottom: 24 }}>
          <Input label="CONTRASEÑA" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required />
        </div>

        {error && <div className="login-error">{error}</div>}

        <Button type="submit" size="lg" loading={loading}>Entrar</Button>

        <div className="login-footer-links">
          <Link to="/register" className="login-link-row">
            <span>&gt;</span> Crear cuenta <span className="code">REG</span>
          </Link>
          <Link to="/recovery" className="login-link-row">
            <span>&gt;</span> Recuperar cuenta <span className="code">REC</span>
          </Link>
        </div>

        <div style={{ textAlign: 'center' }}>
          <div className="login-created-by">[ CREADO POR ]</div>
          <img src="/logo-edo.svg" alt="edo amate" className="login-logo-bottom" />
        </div>
      </form>
    </div>
  );
}
