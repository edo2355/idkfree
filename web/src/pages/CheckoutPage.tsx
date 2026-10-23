import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './CheckoutPage.css';

export function CheckoutPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { amount = 10, concept = 'Pago' } = location.state || {};
  const [loading, setLoading] = useState(false);

  const handlePay = (method: string) => {
    setLoading(true);
    setTimeout(() => {
      alert(`Redirigiendo a ${method.toUpperCase()} por $${amount}...`);
      setLoading(false);
    }, 1500);
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
        <button className="method-card" onClick={() => handlePay('qvapay')}>
          <h3>QVAPAY</h3>
          <p>Cripto / Saldo Móvil · Cuba</p>
        </button>
        <button className="method-card" onClick={() => handlePay('transfermovil')}>
          <h3>TRANSFERMÓVIL</h3>
          <p>Pago Móvil / QR · Cuba</p>
        </button>
        <button className="method-card disabled">
          <h3>STRIPE (COMING SOON)</h3>
          <p>Tarjetas Internacionales</p>
        </button>
      </div>

      {loading && <p className="loading-text">PROCESANDO PAGO...</p>}
    </div>
  );
}