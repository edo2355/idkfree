import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './SettingsPage.css';

export function VerifyEmailPage() {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Si venimos del registro, tenemos el email en el state. Si no, lo pedimos.
  const initialEmail = location.state?.email || '';
  
  const [email, setEmail] = useState(initialEmail);
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  // Temporizador de reenvío
  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault();
    if (!email.includes('@') && !/^\+?[0-9]+$/.test(email)) {
      return setError('Ingresa un email o teléfono válido.');
    }
    if (code.length !== 6) {
      return setError('El código debe tener 6 dígitos.');
    }

    setError('');
    setLoading(true);

    try {
      const res = await fetch('https://idkfreegetid.dpdns.org/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone_number: email, otp_code: code })
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

  async function handleResend() {
    if (cooldown > 0) return;
    setError('');
    setResendSuccess(false);
    setResendLoading(true);

    try {
      const res = await fetch('https://idkfreegetid.dpdns.org/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone_number: email })
      });

      if (res.ok) {
        setResendSuccess(true);
        setCooldown(60);
        setTimeout(() => setResendSuccess(false), 5000); // El mensaje de éxito desaparece en 5s
      } else {
        const data = await res.json();
        setError(data.error || 'No se pudo reenviar el código.');
      }
    } catch (err) {
      setError('Error de conexión al reenviar.');
    } finally {
      setResendLoading(false);
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)' }}>
      <form onSubmit={handleVerify} className="settings-group" style={{ width: '100%', maxWidth: '400px', padding: '40px' }}>
        <h1 style={{ fontFamily: 'Space Mono', color: '#00E5FF', fontSize: '20px', marginBottom: '10px', textAlign: 'center' }}>
          [ VERIFICACIÓN DE CUENTA ]
        </h1>
        <p style={{ color: '#888', fontSize: '12px', marginBottom: '30px', fontFamily: 'Space Mono', textAlign: 'center' }}>
          {initialEmail 
            ? <>Enviamos un código a:<br /><strong style={{ color: '#fff' }}>{initialEmail}</strong></>
            : 'Ingresa tu email o teléfono para verificar tu cuenta.'}
        </p>

        {!initialEmail && (
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '10px', color: '#666', marginBottom: '8px', fontFamily: 'Space Mono' }}>EMAIL O TELÉFONO</label>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com o +5355555555"
              style={{ width: '100%', padding: '15px', background: '#0a0a0a', border: '1px solid #333', color: '#fff', fontFamily: 'Space Mono', fontSize: '14px' }}
            />
          </div>
        )}

        <label style={{ display: 'block', fontSize: '10px', color: '#666', marginBottom: '8px', fontFamily: 'Space Mono' }}>CÓDIGO OTP (6 DÍGITOS)</label>
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
          placeholder="000000"
          style={{ width: '100%', padding: '15px', background: '#0a0a0a', border: '1px solid #333', color: '#00E5FF', fontFamily: 'Space Mono', fontSize: '24px', textAlign: 'center', letterSpacing: '8px', marginBottom: '20px' }}
        />

        {error && <p style={{ color: '#ff0044', fontSize: '12px', fontFamily: 'Space Mono', marginBottom: '15px', textAlign: 'center' }}>[ ERROR: {error} ]</p>}
        {resendSuccess && <p style={{ color: '#00E5FF', fontSize: '12px', fontFamily: 'Space Mono', marginBottom: '15px', textAlign: 'center' }}>[ ✓ CÓDIGO REENVIADO ]</p>}

        <button type="submit" className="btn-tactical" disabled={loading} style={{ width: '100%', padding: '15px', borderColor: '#00E5FF', color: '#00E5FF', marginBottom: '10px' }}>
          {loading ? 'VERIFICANDO...' : 'VERIFICAR CUENTA'}
        </button>

        <button 
          type="button" 
          onClick={handleResend} 
          disabled={resendLoading || cooldown > 0 || !email}
          style={{ width: '100%', padding: '10px', background: 'transparent', border: '1px solid #333', color: cooldown > 0 ? '#555' : '#aaa', fontFamily: 'Space Mono', fontSize: '11px', cursor: cooldown > 0 ? 'not-allowed' : 'pointer' }}
        >
          {resendLoading ? 'ENVIANDO...' : cooldown > 0 ? `REENVIAR EN ${cooldown}s` : 'REENVIAR CÓDIGO'}
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
