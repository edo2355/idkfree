import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SettingsPage.css';

export function KycPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [docType, setDocType] = useState('id_card');
  const [docNumber, setDocNumber] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!docNumber) return alert('Ingresa tu número de documento');
    setLoading(true);
    // Aquí se integraría el servicio de verificación real (Jumio, Onfido, etc.)
    setTimeout(() => {
      setLoading(false);
      setStep(3);
    }, 1500);
  };

  return (
    <div className="settings-container">
      <header className="settings-hud">
        <h1>[ KYC - VERIFICACIÓN DE IDENTIDAD ]</h1>
        <button onClick={() => navigate(-1)} className="btn-icon">[ X ]</button>
      </header>

      <div className="settings-group">
        <h2>[ ESTADO: {step === 1 ? 'PENDIENTE' : step === 2 ? 'EN PROCESO' : 'VERIFICADO' } ]</h2>
        
        {step === 1 && (
          <>
            <p style={{ color: '#aaa', fontSize: '13px', marginBottom: '20px', lineHeight: 1.6 }}>
              Para desbloquear la insignia verificada y aumentar tu límite de ventas, necesitamos validar tu identidad.
            </p>
            
            <label style={{ display: 'block', fontSize: '11px', color: '#666', marginBottom: '8px', fontFamily: 'monospace' }}>TIPO DE DOCUMENTO</label>
            <select 
              value={docType} 
              onChange={(e) => setDocType(e.target.value)}
              style={{ width: '100%', padding: '15px', background: '#0a0a0a', border: '1px solid #333', color: '#fff', fontFamily: 'monospace', marginBottom: '20px' }}
            >
              <option value="id_card">Carnet de Identidad</option>
              <option value="passport">Pasaporte</option>
              <option value="driver_license">Licencia de Conducir</option>
            </select>

            <label style={{ display: 'block', fontSize: '11px', color: '#666', marginBottom: '8px', fontFamily: 'monospace' }}>NÚMERO DE DOCUMENTO</label>
            <input 
              type="text" 
              value={docNumber}
              onChange={(e) => setDocNumber(e.target.value)}
              placeholder="Ej. 85010112345"
              style={{ width: '100%', padding: '15px', background: '#0a0a0a', border: '1px solid #333', color: '#fff', fontFamily: 'monospace', marginBottom: '25px' }}
            />

            <button 
              className="btn-tactical" 
              onClick={handleSubmit}
              style={{ width: '100%', padding: '15px', borderColor: '#00E5FF', color: '#00E5FF' }}
            >
              {loading ? 'ENVIANDO...' : 'INICIAR VERIFICACIÓN'}
            </button>
          </>
        )}

        {step === 3 && (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <h2 style={{ color: '#00E5FF', fontSize: '20px', marginBottom: '15px' }}>[ ✓ VERIFICADO ]</h2>
            <p style={{ color: '#aaa', fontSize: '13px', marginBottom: '25px' }}>
              Tu identidad ha sido verificada correctamente.<br />Ya tienes acceso a todas las funciones premium.
            </p>
            <button className="btn-tactical" onClick={() => navigate(-1)} style={{ padding: '15px 30px' }}>
              VOLVER A AJUSTES
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
