// Servicio de Correos usando la API HTTP de Mailjet (Puerto 443)
// Render bloquea SMTP, por lo que usamos fetch nativo.

const MAILJET_API_KEY = process.env.MAILJET_API_KEY || '';
const MAILJET_SECRET_KEY = process.env.MAILJET_SECRET_KEY || '';
const FROM_EMAIL = 'IDKfree <no-reply@idkfreegetid.dpdns.org>';

const getAuthHeader = () => {
  const credentials = Buffer.from(`${MAILJET_API_KEY}:${MAILJET_SECRET_KEY}`).toString('base64');
  return { 'Authorization': `Basic ${credentials}`, 'Content-Type': 'application/json' };
};

async function sendMailjetEmail(payload: any) {
  try {
    const response = await fetch('https://api.mailjet.com/v3.1/send', {
      method: 'POST',
      headers: getAuthHeader(),
      body: JSON.stringify(payload)
    });
    if (!response.ok) {
      const errorData = await response.text();
      console.error('❌ Error de Mailjet:', response.status, errorData);
      throw new Error(`Mailjet error: ${response.status}`);
    }
    console.log('✅ Correo enviado por Mailjet exitosamente');
  } catch (error) {
    console.error('❌ Fallo al enviar correo:', error);
    throw error;
  }
}

// 1. Verificación de correo (Código de 6 dígitos)
export async function sendVerificationEmail(toEmail: string, code: string) {
  const payload = {
    Messages: [{
      From: { Email: FROM_EMAIL.split('<')[1].replace('>', ''), Name: 'IDKfree' },
      To: [{ Email: toEmail }],
      Subject: 'Tu código de verificación - IDKfree',
      HTMLPart: `
        <div style="background: #0f172a; color: #fff; padding: 20px; font-family: sans-serif; text-align: center;">
          <h2>Verifica tu cuenta</h2>
          <p>Tu código de verificación es:</p>
          <h1 style="font-size: 32px; letter-spacing: 5px; color: #fff; background: #111; padding: 10px; display: inline-block; border: 1px dashed #00E5FF;">${code}</h1>
          <p>Este código expira en 10 minutos.</p>
        </div>
      `
    }]
  };
  await sendMailjetEmail(payload);
}

// 2. Verificación SMS (Nota: Mailjet no envía SMS, se deja un log para no romper)
export async function sendVerificationSMS(phone: string, code: string) {
  console.log(`[SMS SIMULADO] Enviando código ${code} al teléfono ${phone}`);
  // Aquí podrías integrar Twilio o QvaPay SMS en el futuro.
}

// 3. Correo de Bienvenida a la Waitlist (El que incluye el Pase)
export async function sendWaitlistEmail(toEmail: string, alias: string, position: number, code: string) {
  const payload = {
    Messages: [{
      From: { Email: FROM_EMAIL.split('<')[1].replace('>', ''), Name: 'IDKfree' },
      To: [{ Email: toEmail, Name: alias }],
      Subject: '¡Bienvenido al Acceso Anticipado de IDKfree!',
      HTMLPart: `
        <div style="background: #0f172a; color: #fff; padding: 30px; font-family: sans-serif; text-align: center; border-radius: 10px;">
          <h2 style="color: #00E5FF;">IDKfree.OS</h2>
          <p>La red social de la libertad Digital</p>
          <hr style="border-color: #333;" />
          <p>¡Hola <b>@${alias}</b>!</p>
          <p>Te has unido exitosamente al acceso anticipado. Estás en la posición <b>#${position}</b>.</p>
          <p style="margin-top: 20px; color: #888;">TU CÓDIGO DE REFERIDO</p>
          <h1 style="color: #00E5FF; letter-spacing: 2px;">${code}</h1>
          <p>Compartí tu código con amigos. Por cada amigo que se una usando tu código, subirás 2 posiciones.</p>
          <a href="https://www.idkfreegetid.dpdns.org/waitlist/card/${code}" style="display: inline-block; margin-top: 20px; padding: 12px 24px; background: #00E5FF; color: #000; text-decoration: none; font-weight: bold; border-radius: 5px;">Ver mi Pase de Acceso</a>
        </div>
      `
    }]
  };
  await sendMailjetEmail(payload);
}

// 4. Consentimiento Parental (Para menores de edad)
export async function sendParentalConsentEmail(parentEmail: string, minorAlias: string, token: string) {
  const payload = {
    Messages: [{
      From: { Email: FROM_EMAIL.split('<')[1].replace('>', ''), Name: 'IDKfree' },
      To: [{ Email: parentEmail }],
      Subject: 'Autorización requerida para menor - IDKfree',
      HTMLPart: `
        <div style="background: #0f172a; color: #fff; padding: 20px; font-family: sans-serif;">
          <h2>Autorización Parental</h2>
          <p>Hemos recibido una solicitud de registro para el menor <b>@${minorAlias}</b>.</p>
          <p>Para autorizar su cuenta, haz clic en el siguiente enlace:</p>
          <a href="https://www.idkfreegetid.dpdns.org/consent/${token}" style="color: #00E5FF;">Autorizar cuenta</a>
        </div>
      `
    }]
  };
  await sendMailjetEmail(payload);
}
