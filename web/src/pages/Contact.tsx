import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Contact() {
  const [sent, setSent] = useState(false);

  return (
    <div style={{ padding: '40px 20px', maxWidth: '600px', margin: '0 auto', color: '#d0d0d0' }}>
      <h1 style={{ color: '#00e5ff', marginBottom: '20px' }}>Contacto</h1>
      <p style={{ marginBottom: '30px' }}>¿Tienes alguna duda o necesitas soporte? Escríbenos y te responderemos pronto.</p>
      
      {sent ? (
        <div style={{ padding: '20px', background: 'rgba(74,222,128,0.1)', border: '1px solid #4ade80', borderRadius: '8px', color: '#4ade80' }}>
          ✅ Mensaje enviado. Te contactaremos pronto.
        </div>
      ) : (
        <form onSubmit={(e) => { e.preventDefault(); setSent(true); }} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <input type="text" placeholder="Tu nombre" required style={{ padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.05)', color: 'white' }} />
          <input type="email" placeholder="Tu correo" required style={{ padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.05)', color: 'white' }} />
          <textarea placeholder="Tu mensaje" required rows={4} style={{ padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.05)', color: 'white' }} />
          <button type="submit" style={{ padding: '14px', background: '#00e5ff', color: '#050505', fontWeight: 'bold', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Enviar Mensaje</button>
        </form>
      )}
      <Link to="/" style={{ display: 'inline-block', marginTop: '30px', color: '#00e5ff' }}>← Volver al inicio</Link>
    </div>
  );
}
