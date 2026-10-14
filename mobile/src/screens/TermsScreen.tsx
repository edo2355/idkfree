import { LegalScreen } from '../components/LegalScreen';

export function TermsScreen() {
  return (
    <LegalScreen
      title="Términos y Condiciones"
      subtitle="Al usar IDKFREE aceptas estos términos. Leelos con atención — definen tu relación con la plataforma."
      version="2.0.0"
      updatedAt="2026.10.14"
      sections={[
        {
          title: 'Aceptación',
          body: 'Al crear una cuenta en IDKFREE confirmas que has leído, entendido y aceptado estos Términos y Condiciones, así como la Política de Privacidad. Si no estás de acuerdo, no uses la plataforma.',
        },
        {
          title: 'Quiénes somos',
          body: 'IDKFREE es una plataforma de identidad digital soberana desarrollada por Edo Amate (en adelante "nosotros"). No somos una red social tradicional: somos una herramienta para que gestiones tu identidad, tu voz y tu círculo sin intermediarios.',
        },
        {
          title: 'Qué puedes hacer',
          body: 'Puedes: (a) crear y gestionar tu identidad digital, (b) publicar contenido bajo tu responsabilidad, (c) interactuar con otros usuarios, (d) exportar tu carnet y datos, (e) eliminar tu cuenta en cualquier momento.',
        },
        {
          title: 'Qué NO puedes hacer',
          body: 'Está prohibido: (a) suplantar la identidad de otras personas, (b) publicar contenido ilegal, violento, sexual con menores, o que incite al odio, (c) usar la plataforma para spam, fraude o estafa, (d) intentar vulnerar la seguridad del sistema, (e) acosar o amenazar a otros usuarios. La violación de estas reglas puede resultar en suspensión o eliminación de tu cuenta sin previo aviso.',
        },
        {
          title: 'Tu contenido',
          body: 'Todo lo que publiques sigue siendo tuyo. Al subirlo a IDKFREE nos otorgas una licencia limitada para almacenarlo y mostrarlo a los usuarios que tú elijas (seguidores, público, o solo tú). No vendemos tu contenido ni lo usamos para entrenar sistemas de terceros.',
        },
        {
          title: 'Tu responsabilidad',
          body: 'Eres el único responsable de: (a) la veracidad de tu información, (b) el contenido que publiques, (c) mantener la confidencialidad de tus 3 PINs secretos del carnet, (d) el uso que hagas de la plataforma. Nosotros no somos responsables por el mal uso que terceros puedan hacer de la información que compartas voluntariamente.',
        },
        {
          title: 'Nuestro límite de responsabilidad',
          body: 'IDKFREE se ofrece "tal cual". No garantizamos disponibilidad ininterrumpida, ausencia de errores, ni que el servicio cumpla todas tus expectativas. En la medida permitida por la ley, no somos responsables por daños indirectos, pérdida de datos, o lucro cesante derivados del uso de la plataforma.',
        },
        {
          title: 'Cambios en los términos',
          body: 'Podemos actualizar estos términos cuando sea necesario. Te notificaremos dentro de la app. El uso continuado después de la actualización implica aceptación de los nuevos términos.',
        },
        {
          title: 'Ley aplicable',
          body: 'Estos términos se rigen por las leyes de la República de Cuba, sin perjuicio de las protecciones que te correspondan como consumidor en tu país de residencia. Cualquier controversia se resolverá en los tribunales competentes de La Habana, Cuba.',
        },
        {
          title: 'Contacto',
          body: 'Para consultas legales escríbenos a: legal@idkfree.app',
        },
      ]}
    />
  );
}
