import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-white dark:bg-brand-dark text-gray-900 dark:text-gray-300 p-6 md:p-12 transition-colors">
      <div className="max-w-3xl mx-auto space-y-6">
        <Link to="/" className="inline-flex items-center gap-2 text-brand-blue hover:underline text-sm font-mono mb-4">
          <ArrowLeft size={16} /> VOLVER AL INICIO
        </Link>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">Términos de Uso</h1>
        <p className="text-sm text-gray-500 font-mono">Última actualización: 14 de Noviembre de 2026</p>
        
        <div className="space-y-4 text-sm leading-relaxed">
          <p>Al utilizar IDKfree, aceptas los siguientes términos y condiciones.</p>
          
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-6">1. Descripción del Servicio</h2>
          <p>IDKfree es una infraestructura de confianza y monetización para creadores. Facilitamos herramientas de verificación de identidad (KYC), gestión de eventos (Ticketera) y procesamiento de pagos internacionales.</p>
          
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-6">2. Responsabilidad del Usuario</h2>
          <p>Eres responsable de mantener la confidencialidad de tus credenciales. No debes usar la plataforma para actividades ilegales, lavado de dinero o evasión de sanciones internacionales. Nos reservamos el derecho de bloquear cuentas sospechosas.</p>
          
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-6">3. Pagos y Comisiones</h2>
          <p>Las transacciones son procesadas por QvaPay. IDKfree no se hace responsable por las fallas en las pasarelas de pago de terceros, pero ofrecerá soporte para resolver disputas.</p>

          <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-6">4. Cumplimiento y Sanciones</h2>
          <p>Utilizamos herramientas de screening (OpenSanctions) para garantizar que los usuarios no estén en listas de sanciones internacionales (OFAC). El incumplimiento resultará en la suspensión inmediata de la cuenta.</p>
        </div>
      </div>
    </div>
  );
}
