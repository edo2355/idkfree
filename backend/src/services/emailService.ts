import { Resend } from 'resend';

// Inicializamos Resend con la clave del entorno
const resend = new Resend(process.env.RESEND_API_KEY || 're_123456789');

export async function sendVerificationEmail(to: string, code: string) {
  try {
    const data = await resend.emails.send({
      from: 'IDKFREE <noreply@idkfreegetid.dpdns.org>',
      to: [to],
      subject: '[ IDKFREE ] Código de Verificación',
      html: `
        <div style="font-family: monospace; background: #0a0a0a; color: #fff; padding: 20px; border: 1px solid #333;">
          <h2 style="color: #00E5FF;">[ IDKFREE SYSTEM ]</h2>
          <p>Tu código de verificación es:</p>
          <h1 style="font-size: 32px; letter-spacing: 5px; color: #fff; background: #111; padding: 10px; display: inline-block; border: 1px dashed #00E5FF;">${code}</h1>
          <p>Este código expira en 10 minutos.</p>
          <p style="color: #666; font-size: 12px; margin-top: 30px;">Si no solicitaste este código, ignora este mensaje.</p>
        </div>
      `
    });
    console.log('Correo enviado:', data);
    return true;
  } catch (error) {
    console.error('Error enviando correo:', error);
    return false;
  }
}

export async function sendVerificationSMS(to: string, code: string) {
  // Aquí integraremos zdSMS o Plivo más adelante.
  // Por ahora, simulamos el envío.
  console.log(`[ SMS SIMULADO ] Código ${code} para ${to}`);
  return true;
}
