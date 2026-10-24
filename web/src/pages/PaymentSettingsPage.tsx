import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import './SettingsPage.css';

export function PaymentSettingsPage() {
  const navigate = useNavigate();
  const token = useAuthStore(s => s.token);
  const [gateway, setGateway] = useState('qvapay');
  const [account, setAccount] = useState('');

  const handleSave = async () => {
    if (!account) return alert('Ingresa los datos de tu cuenta');
    try {
      await fetch('https://idkfreegetid.dpdns.org/api/payments/accounts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ provider: gateway, account_data: account })
      });
      alert('Cuenta de cobro guardada correctamente.');
      setAccount('');
    } catch (e) {
      alert('Error al guardar la cuenta.');
    }
  };

  return (
    <div className="settings-container">
      <header className="settings-hud">
        <h1>[ CUENTAS DE COBRO ]</h1>
        <button onClick={() => navigate(-1)} className="btn-icon">[ X ]</button>
      </header>

      <div className="settings-group">
        <h2>[ SELECCIONA LA PASARELA ]</h2>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
          <button 
            onClick={() => setGateway('qvapay')} 
            style={{ flex: 1, padding: '15px', border: gateway === 'qvapay' ? '1px solid #00E5FF' : '1px solid #333', color: gateway === 'qvapay' ? '#00E5FF' : '#666', background: 'transparent', cursor: 'pointer' }}
          >
            [ QVAPAY ]
          </button>
          <button 
            onClick={() => setGateway('transfermovil')} 
            style={{ flex: 1, padding: '15px', border: gateway === 'transfermovil' ? '1px solid #00E5FF' : '1px solid #333', color: gateway === 'transfermovil' ? '#00E5FF' : '#666', background: 'transparent', cursor: 'pointer' }}
          >
            [ TRANSFERMÓVIL ]
          </button>
        </div>

        <label style={{ display: 'block', fontSize: '10px', color: '#666', marginBottom: '10px', fontFamily: 'monospace' }}>
          {gateway === 'qvapay' ? 'USUARIO DE QVAPAY (@usuario)' : 'TARJETA O TELÉFONO (16 dígitos)'}
        </label>
        <input 
          type="text" 
          value={account}
          onChange={(e) => setAccount(e.target.value)}
          placeholder={gateway === 'qvapay' ? '@tu_usuario' : '9226 XXXX XXXX XXXX'}
          style={{ width: '100%', padding: '15px', background: '#0a0a0a', border: '1px solid #333', color: '#fff', fontFamily: 'monospace', marginBottom: '20px' }}
        />
        
        <button className="btn-tactical" onClick={handleSave} style={{ width: '100%', padding: '15px', borderColor: '#00E5FF', color: '#00E5FF' }}>
          GUARDAR CUENTA
        </button>
      </div>
    </div>
  );
}
