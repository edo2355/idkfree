import React from 'react';
import { useNavigate } from 'react-router-dom';
import './SettingsPage.css';

export function WalletPage() {
  const navigate = useNavigate();

  return (
    <div className="settings-container">
      <header className="settings-hud">
        <h1>[ IDKPAY WALLET ]</h1>
        <button onClick={() => navigate(-1)} className="btn-icon">[ X ]</button>
      </header>

      <div className="settings-group" style={{ textAlign: 'center' }}>
        <h2>SALDO DISPONIBLE</h2>
        <p style={{ fontSize: '48px', color: '#00E5FF', margin: '10px 0', fontFamily: 'monospace' }}>$0.00</p>
        <p style={{ color: '#666', fontSize: '12px', fontFamily: 'monospace' }}>USD</p>
      </div>

      <div style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
        <button 
          className="btn-tactical" 
          style={{ flex: 1, padding: '15px', borderColor: '#00E5FF', color: '#00E5FF' }}
          onClick={() => navigate('/checkout', { state: { amount: 10, concept: 'Recarga de Saldo' } })}
        >
          [ DEPOSITAR ]
        </button>
        <button className="btn-tactical" style={{ flex: 1, padding: '15px', color: '#666', borderColor: '#333' }}>
          [ ENVIAR ]
        </button>
      </div>

      <div className="settings-group">
        <h2>[ HISTORIAL DE TRANSACCIONES ]</h2>
        <p style={{ color: '#555', fontSize: '12px', fontFamily: 'monospace', marginTop: '15px' }}>No hay transacciones recientes.</p>
      </div>
    </div>
  );
}
