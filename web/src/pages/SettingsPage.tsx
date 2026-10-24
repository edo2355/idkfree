import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import './SettingsPage.css';

export function SettingsPage() {
  const navigate = useNavigate();
  const clearAuth = useAuthStore(s => s.clearAuth);


  const handleDeleteAccount = async () => {
    if (!confirm('¿Estás seguro? Esta acción eliminará tu cuenta y todos tus datos permanentemente.')) return;
    try {
      const token = useAuthStore.getState().token;
      await fetch('https://idkfreegetid.dpdns.org/api/auth/account', {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      useAuthStore.getState().clearAuth();
      navigate('/');
      alert('Cuenta eliminada.');
    } catch (e) {
      alert('Error al eliminar la cuenta.');
    }
  };

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
          <button onClick={() => navigate('/kyc')}>Verificación de Identidad (KYC)</button>
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
          <button className="danger-btn" onClick={handleDeleteAccount}>ELIMINAR CUENTA</button>
        </div>
      </div>
    </div>
  );
}
