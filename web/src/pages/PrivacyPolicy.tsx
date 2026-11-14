import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-white dark:bg-brand-dark text-gray-900 dark:text-gray-300 p-6 md:p-12 transition-colors">
      <div className="max-w-3xl mx-auto space-y-6">
        <Link to="/" className="inline-flex items-center gap-2 text-brand-blue hover:underline text-sm font-mono mb-4">
          <ArrowLeft size={16} /> VOLVER AL INICIO
        </Link>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">Política de Privacidad</h1>
        <p className="text-sm text-gray-500 font-mono">Última actualización: 14 de Noviembre de 2026</p>
        
        <div className="space-y-4 text-sm leading-relaxed">
          <p>En IDKfree, tu privacidad es fundamental. Esta política explica cómo recopilamos, usamos y protegemos tu información.</p>
          
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-6">1. Información que recopilamos</h2>
          <p>Recopilamos información que nos proporcionas directamente, como tu correo electrónico, alias, y datos de verificación de identidad (KYC) cuando decides completar ese proceso para aumentar tu Trust Score.</p>
          
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-6">2. Cómo usamos tu información</h2>
          <p>Utilizamos tus datos para crear tu cuenta, verificar tu identidad, procesar pagos a través de QvaPay y enviarte notificaciones relacionadas con el servicio (como correos de bienvenida a través de Mailjet).</p>
          
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-6">3. Terceros y Proveedores</h2>
          <p>Compartimos datos estrictamente necesarios con nuestros proveedores de infraestructura: Turso (base de datos), Render (hosting), Cloudflare (seguridad) y QvaPay (procesamiento de pagos).</p>

          <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-6">4. Tus derechos</h2>
          <p>Puedes solicitar la eliminación de tu cuenta y tus datos en cualquier momento escribiendo a soporte@idkfreegetid.dpdns.org.</p>
        </div>
      </div>
    </div>
  );
}
