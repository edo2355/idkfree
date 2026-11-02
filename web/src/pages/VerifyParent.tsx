import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';

export default function VerifyParent() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      return;
    }

    fetch(`https://idkfreegetid.dpdns.org/api/auth/verify-parent?token=${token}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) setStatus('success');
        else setStatus('error');
      })
      .catch(() => setStatus('error'));
  }, [token]);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#050505', color: 'white', padding: '20px' }}>
      <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid #00e5ff', borderRadius: '16px', padding: '40px', maxWidth: '500px', textAlign: 'center' }}>
        <h1 style={{ color: '#00e5ff', marginBottom: '20px' }}>IDKfree.OS</h1>
        
        {status === 'loading' && <p>Verificando autorización...</p>}
        
        {status === 'success' && (
          <>
            <h2 style={{ color: '#4ade80' }}>✅ ¡Cuenta Autorizada!</h2>
            <p style={{ color: '#d0d0d0', marginTop: '15px' }}>Tu hijo/a ya puede usar IDKfree en el entorno seguro para menores.</p>
            <Link to="/login" style={{ display: 'inline-block', marginTop: '20px', background: '#00e5ff', color: '#000', padding: '10px 20px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold' }}>Ir al inicio</Link>
          </>
        )}
        
        {status === 'error' && (
          <>
            <h2 style={{ color: '#ff4444' }}>❌ Enlace inválido</h2>
            <p style={{ color: '#d0d0d0', marginTop: '15px' }}>El token ha expirado o es incorrecto. Por favor, contactá a soporte.</p>
          </>
        )}
      </div>
    </div>
  );
}
