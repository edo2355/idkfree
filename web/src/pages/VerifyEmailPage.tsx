import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './SettingsPage.css'; // Reutilizamos estilos tácticos

export function VerifyEmailPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email;

  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!email) {
    return (
      <div className="settings-container" style={{ textAlign: 'center', paddingTop: '100px' }}>
        <h2 style={{ color: '#ff0044' }}>[ ERROR: NO HAY EMAIL PARA VERIFICAR ]</h2>
        <button className="btn-tactical" onClick={() => navigate('/register')} style={{ marginTop: '20px' }}>Volver al Registro</button>
      </div>
    );
  }

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault();
    if (code.length !== 6) return setError('El código debe tener 6 dígitos');
    setError('');
    setLoading(true);

    try {
      const res = await fetch('https://idkfreegetid.dpdns.org/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone_number: email, otp_code: code }) // El backend usa phone_number como identificador
      });

      if (res.ok) {
        alert('¡Cuenta verificada con éxito! Ahora puedes iniciar sesión.');
        navigate('/login');
      } else {
        const data = await res.json();
        setError(data.error || 'Código inválido o expirado');
      }
    } catch (err) {
      setError('Error de conexión con el servidor');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)' }}>
      <form onSubmit={handleVerify} className="settings-group" style={{ width: '100%', maxWidth: '400px', padding: '40px' }}>
        <h1 style={{ fontFamily: 'Space Mono', color: '#00E5FF', fontSize: '20px', marginBottom: '10px' }}>[ VERIFICACIÓN DE CORREO ]</h1>
        <p style={{ color: '#888', fontSize: '12px', marginBottom: '30px', fontFamily: 'Space Mono' }}>
          Hemos enviado un código de 6 dígitos a:<br /><strong style={{ color: '#fff' }}>{email}</strong>
        </p>

        <label style={{ display: 'block', fontSize: '10px', color: '#666', marginBottom: '10px', fontFamily: 'Space Mono' }}>CÓDIGO OTP</label>
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
          placeholder="000000"
          style={{ width: '100%', padding: '15px', background: '#0a0a0a', border: '1px solid #333', color: '#00E5FF', fontFamily: 'Space Mono', fontSize: '24px', textAlign: 'center', letterSpacing: '5px', marginBottom: '20px' }}
        />

        {error && <p style={{ color: '#ff0044', fontSize: '12px', fontFamily: 'Space Mono', marginBottom: '15px' }}>[ ERROR: {error} ]</p>}

        <button type="submit" className="btn-tactical" disabled={loading} style={{ width: '100%', padding: '15px', borderColor: '#00E5FF', color: '#00E5FF' }}>
          {loading ? 'VERIFICANDO...' : 'VERIFICAR CUENTA'}
        </button>
      </form>
    </div>
  );
}
