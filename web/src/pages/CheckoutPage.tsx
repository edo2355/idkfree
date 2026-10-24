import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import QRCode from 'react-qr-code';
import { useAuthStore } from '../stores/authStore';
import './CheckoutPage.css';

export function CheckoutPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const token = useAuthStore(s => s.token);
  const { amount = 10, concept = 'Pago' } = location.state || {};
  
  const [loading, setLoading] = useState<string | null>(null);
  const [showQr, setShowQr] = useState(false);

  const transfermovilData = `00020101021243650016transfermovil.com0102USD5204000053038405802CU5913IDKFREE_STORE6006HAVANA6304ABCD`;

  const handleQvaPay = async () => {
    setLoading('qvapay');
    try {
      const res = await fetch('https://idkfreegetid.dpdns.org/api/payments/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ amount, currency: 'USD', provider: 'qvapay', metadata: { concept } })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.url) {
          window.open(data.url, '_blank');
          navigate(-1);
        }
      } else {
        alert('Error al crear el pago en QvaPay.');
      }
    } catch (e) {
      alert('Error de conexión con el backend.');
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="checkout-container">
      <header className="checkout-hud">
        <h1>[ CHECKOUT ]</h1>
        <button onClick={() => navigate(-1)} className="btn-icon">[ X ]</button>
      </header>

      <div className="summary">
        <p className="concept">{concept}</p>
        <h2 className="amount">${amount.toFixed(2)} USD</h2>
      </div>

      <div className="methods">
        {/* QvaPay */}
        <button className="method-card" onClick={handleQvaPay} disabled={loading !== null}>
          <div>
            <h3>QVAPAY</h3>
            <p>Cripto / Saldo Móvil · Cuba</p>
          </div>
          {loading === 'qvapay' ? <span style={{color: '#00E5FF'}}>Cargando...</span> : <span>→</span>}
        </button>

        {/* Transfermóvil con QR */}
        <button className="method-card" onClick={() => setShowQr(!showQr)}>
          <div>
            <h3>TRANSFERMÓVIL</h3>
            <p>Pago Móvil / QR · Cuba</p>
          </div>
          <span>{showQr ? '↑' : '↓'}</span>
        </button>

        {showQr && (
          <div style={{ background: '#fff', padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', borderRadius: '12px', marginBottom: '15px' }}>
            <QRCode value={transfermovilData} size={180} />
            <p style={{ color: '#000', fontFamily: 'monospace', fontWeight: 'bold', marginTop: '15px' }}>Escanea este QR con Transfermóvil</p>
            <p style={{ color: '#555', fontFamily: 'monospace', fontSize: '12px' }}>Cuenta: 9226 0000 1234 5678</p>
            <p style={{ color: '#555', fontFamily: 'monospace', fontSize: '12px' }}>Titular: IDKFREE STORE</p>
          </div>
        )}

        {/* Stripe / MercadoPago */}
        <button className="method-card disabled" onClick={() => alert('Próximamente disponible')}>
          <div>
            <h3>STRIPE / MERCADO PAGO</h3>
            <p>Tarjetas Internacionales</p>
          </div>
          <span style={{ fontSize: '10px', color: '#666' }}>PRÓXIMO</span>
        </button>
      </div>
    </div>
  );
}
