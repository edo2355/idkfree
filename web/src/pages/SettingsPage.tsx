import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import './SettingsPage.css';

export function SettingsPage() {
  const navigate = useNavigate();
  const clearAuth = useAuthStore(s => s.clearAuth);

  return (
    <div className="settings-container">
      <header className="settings-hud">
        <h1>[ AJUSTES DEL SISTEMA ]</h1>
        <button onClick={() => navigate(-1)} className="btn-icon">[ X ]</button>
      </header>

      <div className="settings-content">
        <div className="settings-group">
          <h2>[ 01 ] CUENTA</h2>
          <button onClick={() => navigate('/edit-profile')}>Editar Perfil</button>
          <button onClick={() => navigate('/catalog/me')}>Mi Catálogo</button>
        </div>

        <div className="settings-group">
          <h2>[ 02 ] PAGOS Y BILLETERA</h2>
          <button onClick={() => navigate('/wallet')}>Mi Billetera (IDKPay)</button>
          <button onClick={() => alert('Próximamente configuración de pasarelas')}>Mis Cuentas de Cobro</button>
        </div>

        <div className="settings-group danger-zone">
          <h2>[ 99 ] ZONA DE PELIGRO</h2>
          <button className="danger-btn" onClick={() => { clearAuth(); navigate('/'); }}>CERRAR SESIÓN</button>
        </div>
      </div>
    </div>
  );
}
