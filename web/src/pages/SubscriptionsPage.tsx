import React from 'react';
import { useNavigate } from 'react-router-dom';
import './SubscriptionsPage.css';

export function SubscriptionsPage() {
  const navigate = useNavigate();

  return (
    <div className="subs-container">
      <header className="subs-hud">
        <h1>[ IDKFREE+ PREMIUM ]</h1>
        <button onClick={() => navigate(-1)} className="btn-icon">[ X ]</button>
      </header>

      <div className="subs-hero" style={{ marginTop: '80px', textAlign: 'center' }}>
        <h2 style={{ fontSize: '32px', color: '#00E5FF', letterSpacing: '2px' }}>[ MÓDULO EN CONSTRUCCIÓN ]</h2>
        <p style={{ color: '#aaa', marginTop: '20px', fontSize: '16px', lineHeight: '1.6' }}>
          Estamos trabajando para traerte IDKFREE+ Premium.<br/><br/>
          Pronto podrás obtener insignias verificadas, catálogos ilimitados y estadísticas avanzadas.
        </p>
        
        <button 
          onClick={() => navigate('/settings')}
          className="btn-tactical" 
          style={{ marginTop: '40px', padding: '15px 30px', fontSize: '14px', borderColor: '#00E5FF', color: '#00E5FF' }}
        >
          [ VOLVER A AJUSTES ]
        </button>
      </div>
    </div>
  );
}
