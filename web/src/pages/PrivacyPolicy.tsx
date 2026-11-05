import { Link } from 'react-router-dom';

export default function PrivacyPolicy() {
  return (
    <div style={{ padding: '40px 20px', maxWidth: '800px', margin: '0 auto', color: '#d0d0d0', lineHeight: '1.6' }}>
      <h1 style={{ color: '#00e5ff', marginBottom: '20px' }}>Política de Privacidad</h1>
      <p><strong>Última actualización:</strong> Noviembre 2026</p>
      <p>En IDKfree, respetamos tu privacidad. Esta política explica cómo recopilamos, usamos y protegemos tu información.</p>
      
      <h2 style={{ color: '#fff', marginTop: '30px' }}>1. Información que recopilamos</h2>
      <p>Recopilamos la información que nos proporcionas al registrarte en nuestra Waitlist (alias, correo electrónico, fecha de nacimiento si eres menor de edad para verificación parental).</p>
      
      <h2 style={{ color: '#fff', marginTop: '30px' }}>2. Uso de la información</h2>
      <p>Usamos tus datos exclusivamente para: gestionar tu posición en la lista de espera, enviarte actualizaciones sobre el lanzamiento, y verificar la identidad de menores de edad.</p>
      
      <h2 style={{ color: '#fff', marginTop: '30px' }}>3. Compartir datos</h2>
      <p>No vendemos tus datos. Utilizamos proveedores de infraestructura (Render, Turso, Mailjet) que cumplen con estándares de seguridad para alojar nuestra plataforma.</p>
      
      <h2 style={{ color: '#fff', marginTop: '30px' }}>4. Tus derechos</h2>
      <p>Puedes solicitar la eliminación de tus datos en cualquier momento escribiéndonos a nuestro formulario de contacto.</p>
      
      <Link to="/" style={{ display: 'inline-block', marginTop: '30px', color: '#00e5ff' }}>← Volver al inicio</Link>
    </div>
  );
}
