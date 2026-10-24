import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SettingsPage.css';

export function RecoveryPage() {
  const navigate = useNavigate();
  const [cardId, setCardId] = useState('');
  const [secret, setSecret] = useState('');
  const [pin, setPin] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [action, setAction] = useState<'panic' | 'restore' | 'fenix'>('restore');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleRecover(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (!cardId || !secret || !pin) {
      return setError('Completa todos los campos del carnet');
    }
    if (action === 'restore' && newPassword.length < 12) {
      return setError('La nueva contraseña debe tener al menos 12 caracteres');
    }
    if (action === 'fenix') {
      if (!newEmail || !newEmail.includes('@')) return setError('Ingresa un nuevo email válido');
      if (newPassword.length < 12) return setError('La nueva contraseña debe tener al menos 12 caracteres');
    }

    setLoading(true);
    try {
      const endpoint = action === 'fenix' 
        ? 'https://idkfreegetid.dpdns.org/api/auth/recover/fenix/migrate' 
        : `https://idkfreegetid.dpdns.org/api/auth/recover/${action}`;
        
      const body: any = { cardId, secret, pin };
      if (action === 'restore') body.newPassword = newPassword;
      if (action === 'fenix') { body.newEmail = newEmail; body.newPassword = newPassword; }

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      const data = await res.json();

      if (res.ok) {
        alert(`Protocolo ${action.toUpperCase()} ejecutado con éxito.`);
        navigate('/login');
      } else {
        setError(data.error || 'Carnet, QR o PIN incorrectos');
      }
    } catch (err) {
      setError('Error de conexión con el servidor');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="settings-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      <form onSubmit={handleRecover} className="settings-group" style={{ width: '100%', maxWidth: '500px', padding: '40px' }}>
        <h1 style={{ fontFamily: 'Space Mono', color: '#fff', fontSize: '20px', marginBottom: '10px', textAlign: 'center' }}>
          [ RECUPERACIÓN DE CARNET ]
        </h1>
        <p style={{ color: '#888', fontSize: '12px', fontFamily: 'Space Mono', textAlign: 'center', marginBottom: '30px' }}>
          Ingresa los datos de tu carnet de respaldo impreso.
        </p>

        <label style={{ display: 'block', fontSize: '10px', color: '#666', marginBottom: '8px', fontFamily: 'Space Mono' }}>ID DEL CARNET</label>
        <input
          type="text"
          value={cardId}
          onChange={(e) => setCardId(e.target.value)}
          placeholder="UUID del carnet"
          style={{ width: '100%', padding: '15px', background: '#0a0a0a', border: '1px solid #333', color: '#fff', fontFamily: 'Space Mono', marginBottom: '20px' }}
        />

        <label style={{ display: 'block', fontSize: '10px', color: '#666', marginBottom: '8px', fontFamily: 'Space Mono' }}>SECRETO / CÓDIGO DE RESPALDO</label>
        <input
          type="text"
          value={secret}
          onChange={(e) => setSecret(e.target.value)}
          placeholder="XXXX-XXXX-XXXX"
          style={{ width: '100%', padding: '15px', background: '#0a0a0a', border: '1px solid #333', color: '#fff', fontFamily: 'Space Mono', marginBottom: '20px' }}
        />

        <label style={{ display: 'block', fontSize: '10px', color: '#666', marginBottom: '8px', fontFamily: 'Space Mono' }}>PIN (4 dígitos)</label>
        <input
          type="text"
          value={pin}
          onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
          placeholder="0000"
          style={{ width: '100%', padding: '15px', background: '#0a0a0a', border: '1px solid #333', color: '#fff', fontFamily: 'Space Mono', marginBottom: '20px', textAlign: 'center', letterSpacing: '5px' }}
        />

        <label style={{ display: 'block', fontSize: '10px', color: '#666', marginBottom: '8px', fontFamily: 'Space Mono' }}>PROTOCOLO A EJECUTAR</label>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
          <button type="button" onClick={() => setAction('panic')} style={{ flex: 1, padding: '10px', border: action === 'panic' ? '1px solid #ff0044' : '1px solid #333', color: action === 'panic' ? '#ff0044' : '#666', background: 'transparent', cursor: 'pointer', fontFamily: 'Space Mono', fontSize: '10px' }}>PÁNICO</button>
          <button type="button" onClick={() => setAction('restore')} style={{ flex: 1, padding: '10px', border: action === 'restore' ? '1px solid #00E5FF' : '1px solid #333', color: action === 'restore' ? '#00E5FF' : '#666', background: 'transparent', cursor: 'pointer', fontFamily: 'Space Mono', fontSize: '10px' }}>RESTAURAR</button>
          <button type="button" onClick={() => setAction('fenix')} style={{ flex: 1, padding: '10px', border: action === 'fenix' ? '1px solid #ff0044' : '1px solid #333', color: action === 'fenix' ? '#ff0044' : '#666', background: 'transparent', cursor: 'pointer', fontFamily: 'Space Mono', fontSize: '10px' }}>FÉNIX</button>
        </div>

        {action === 'restore' && (
          <>
            <label style={{ display: 'block', fontSize: '10px', color: '#666', marginBottom: '8px', fontFamily: 'Space Mono' }}>NUEVA CONTRASEÑA</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Mínimo 12 caracteres"
              style={{ width: '100%', padding: '15px', background: '#0a0a0a', border: '1px solid #333', color: '#fff', fontFamily: 'Space Mono', marginBottom: '20px' }}
            />
          </>
        )}

        {action === 'fenix' && (
          <>
            <label style={{ display: 'block', fontSize: '10px', color: '#ff0044', marginBottom: '8px', fontFamily: 'Space Mono' }}>NUEVO EMAIL (CUENTA SEGURA)</label>
            <input
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              placeholder="nuevo@email.com"
              style={{ width: '100%', padding: '15px', background: '#0a0a0a', border: '1px solid #ff0044', color: '#fff', fontFamily: 'Space Mono', marginBottom: '20px' }}
            />
            <label style={{ display: 'block', fontSize: '10px', color: '#ff0044', marginBottom: '8px', fontFamily: 'Space Mono' }}>NUEVA CONTRASEÑA</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Mínimo 12 caracteres"
              style={{ width: '100%', padding: '15px', background: '#0a0a0a', border: '1px solid #ff0044', color: '#fff', fontFamily: 'Space Mono', marginBottom: '20px' }}
            />
          </>
        )}

        {error && <p style={{ color: '#ff0044', fontSize: '12px', fontFamily: 'Space Mono', marginBottom: '15px' }}>[ ERROR: {error} ]</p>}

        <button type="submit" className="btn-tactical" disabled={loading} style={{ width: '100%', padding: '15px', borderColor: '#00E5FF', color: '#00E5FF' }}>
          {loading ? 'PROCESANDO...' : 'EJECUTAR PROTOCOLO'}
        </button>
        
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <button type="button" onClick={() => navigate('/login')} style={{ background: 'none', border: 'none', color: '#666', fontFamily: 'Space Mono', fontSize: '12px', cursor: 'pointer' }}>
            Volver al Login
          </button>
        </div>
      </form>
    </div>
  );
}
