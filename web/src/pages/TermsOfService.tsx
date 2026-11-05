import { Link } from 'react-router-dom';

export default function TermsOfService() {
  return (
    <div style={{ padding: '40px 20px', maxWidth: '800px', margin: '0 auto', color: '#d0d0d0', lineHeight: '1.6' }}>
      <h1 style={{ color: '#00e5ff', marginBottom: '20px' }}>Términos de Uso</h1>
      <p><strong>Última actualización:</strong> Noviembre 2026</p>
      
      <h2 style={{ color: '#fff', marginTop: '30px' }}>1. Aceptación de los términos</h2>
      <p>Al registrarte en IDKfree, aceptas estos términos. Si no estás de acuerdo, no utilices la plataforma.</p>
      
      <h2 style={{ color: '#fff', marginTop: '30px' }}>2. Uso de la plataforma</h2>
      <p>IDKfree es una red social enfocada en la soberanía digital. Te comprometes a no usar la plataforma para actividades ilegales, spam o acoso.</p>
      
      <h2 style={{ color: '#fff', marginTop: '30px' }}>3. Menores de edad</h2>
      <p>Los usuarios menores de 18 años deben contar con la autorización de un tutor legal para usar la plataforma. El incumplimiento resultará en la suspensión de la cuenta.</p>
      
      <h2 style={{ color: '#fff', marginTop: '30px' }}>4. Cuenta y seguridad</h2>
      <p>Eres responsable de mantener la confidencialidad de tu cuenta y contraseña.</p>
      
      <Link to="/" style={{ display: 'inline-block', marginTop: '30px', color: '#00e5ff' }}>← Volver al inicio</Link>
    </div>
  );
}
