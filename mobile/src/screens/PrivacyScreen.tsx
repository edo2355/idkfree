import { LegalScreen } from '../components/LegalScreen';

export function PrivacyScreen() {
  return (
    <LegalScreen
      title="Política de Privacidad"
      subtitle="Qué datos guardamos, por qué, dónde, cuánto tiempo, y cómo puedes controlarlos."
      version="2.0.0"
      updatedAt="2026.10.14"
      sections={[
        {
          title: 'Nuestro principio',
          body: 'Tu identidad es tuya. No vendemos tus datos. No los compartimos con anunciantes. No los usamos para publicidad. Solo guardamos lo estrictamente necesario para que la plataforma funcione.',
        },
        {
          title: 'Qué datos guardamos',
          body: 'Al registrarte guardamos: (1) tu email, (2) tu alias público, (3) tu contraseña cifrada con hash (nunca en texto plano), (4) tus 3 PINs del carnet, cifrados con hash, (5) tu nombre y biografía si decides rellenarlos, (6) tu foto de perfil si subes una.\n\nDurante tu uso guardamos: (7) los posts, mensajes, comentarios e historias que publiques, (8) tu dirección IP y timestamp de las acciones, para seguridad y detección de abuso, (9) tus interacciones (likes, follows, resonancias).',
        },
        {
          title: 'Qué NO guardamos',
          body: 'No guardamos: (a) tu contraseña en texto plano, (b) tus PINs en texto plano, (c) tu ubicación precisa, (d) contactos de tu teléfono, (e) información de otras apps, (f) datos biométricos, (g) contenido de tu portapapeles.',
        },
        {
          title: 'Dónde se guardan',
          body: 'Los datos se almacenan en servidores propios de IDKFREE. Los archivos multimedia (fotos, videos, avatares) se guardan en el mismo servidor. No usamos servicios de terceros para almacenar tu información personal.',
        },
        {
          title: 'Por cuánto tiempo',
          body: 'Guardamos tus datos mientras tu cuenta esté activa. Si eliminas tu cuenta: (a) tus datos personales se borran dentro de 30 días, (b) los posts públicos pueden permanecer como anónimos por referencia de otros usuarios, (c) los logs de seguridad se conservan hasta 90 días por obligaciones técnicas.',
        },
        {
          title: 'Con quién compartimos',
          body: 'NO compartimos tus datos personales con terceros, salvo: (a) cuando la ley lo exige mediante orden judicial, (b) para detectar y prevenir fraude, (c) servicios técnicos indispensables (proveedor de hosting, proveedor de compilación de la app) bajo acuerdos de confidencialidad.',
        },
        {
          title: 'Tus derechos',
          body: 'Tienes derecho a: (1) ACCEDER a tus datos — puedes exportar tu carnet y tu información desde la configuración, (2) RECTIFICAR datos incorrectos — edita tu perfil cuando quieras, (3) ELIMINAR tu cuenta — desde Ajustes → Cuenta Peligrosa, (4) PORTABILIDAD — los QRs y el carnet son tuyos, (5) OPOSICIÓN — puedes desactivar notificaciones o funcionalidades específicas.',
        },
        {
          title: 'Seguridad',
          body: 'Usamos cifrado de contraseñas con hash moderno, tokens JWT con expiración, HTTPS en producción, y aislamiento de datos entre usuarios. Aun así, ningún sistema es 100% invulnerable — te recomendamos usar contraseñas únicas y no compartir tus 3 PINs con nadie.',
        },
        {
          title: 'Menores de edad',
          body: 'IDKFREE no está diseñado para menores de 13 años. Si eres menor, no uses la plataforma sin consentimiento de tus padres o tutores. Si detectamos cuentas de menores sin consentimiento, las eliminaremos.',
        },
        {
          title: 'Cookies y rastreo',
          body: 'La app móvil no usa cookies. La versión web usa almacenamiento local únicamente para mantener tu sesión iniciada. No usamos rastreadores de terceros, píxeles de Facebook, Google Analytics, ni herramientas similares.',
        },
        {
          title: 'Cambios en la política',
          body: 'Si cambiamos esta política, te avisaremos dentro de la app con 15 días de antelación. El uso continuado implica aceptación.',
        },
        {
          title: 'Contacto',
          body: 'Para ejercer tus derechos o hacer consultas sobre privacidad: privacy@idkfree.app',
        },
      ]}
    />
  );
}
