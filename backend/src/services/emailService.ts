const LETTERMINT_TOKEN = process.env.LETTERMINT_PROJECT_TOKEN;
const API_URL = 'https://api.lettermint.co/v1/send';
const FROM_EMAIL = 'IDKfree <no-reply@idkfreegetid.dpdns.org>';

async function sendEmail(payload: any) {
  if (!LETTERMINT_TOKEN) {
    console.error('❌ Falta LETTERMINT_PROJECT_TOKEN');
    return;
  }
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-lettermint-token': LETTERMINT_TOKEN,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('❌ Error de Lettermint:', response.status, errorData);
      throw new Error(`Lettermint error: ${response.status}`);
    }
    console.log('✅ Correo enviado por Lettermint exitosamente');
  } catch (error) {
    console.error('❌ Fallo al enviar correo:', error);
    throw error;
  }
}

export async function sendVerificationEmail(toEmail: string, code: string) {
  await sendEmail({
    from: FROM_EMAIL,
    to: [toEmail],
    subject: 'Tu código de verificación - IDKfree',
    html: `<div style="background: #0f172a; color: #fff; padding: 20px; font-family: sans-serif; text-align: center;"><h2>Verifica tu cuenta</h2><p>Tu código es:</p><h1 style="font-size: 32px; letter-spacing: 5px; color: #fff; background: #111; padding: 10px; display: inline-block; border: 1px dashed #00E5FF;">${code}</h1><p>Expira en 10 minutos.</p></div>`,
  });
}

export async function sendVerificationSMS(phone: string, code: string) {
  console.log(`[SMS SIMULADO] Código ${code} para ${phone}`);
}

export async function sendWaitlistEmail(toEmail: string, alias: string, position: number, code: string) {
  await sendEmail({
    from: FROM_EMAIL,
    to: [toEmail],
    subject: '¡Bienvenido al Acceso Anticipado de IDKfree!',
    html: `<div style="background: #0f172a; color: #fff; padding: 30px; font-family: sans-serif; text-align: center; border-radius: 10px;"><h2 style="color: #00E5FF;">IDKfree.OS</h2><p>¡Hola <b>@${alias}</b>!</p><p>Estás en la posición <b>#${position}</b>.</p><p>TU CÓDIGO DE REFERIDO</p><h1 style="color: #00E5FF;">${code}</h1><a href="https://www.idkfreegetid.dpdns.org/waitlist/card/${code}" style="display: inline-block; margin-top: 20px; padding: 12px 24px; background: #00E5FF; color: #000; text-decoration: none; font-weight: bold; border-radius: 5px;">Ver mi Pase</a></div>`,
  });
}

export async function sendParentalConsentEmail(parentEmail: string, minorAlias: string, token: string) {
  await sendEmail({
    from: FROM_EMAIL,
    to: [parentEmail],
    subject: 'Autorización requerida para menor - IDKfree',
    html: `<div style="background: #0f172a; color: #fff; padding: 20px; font-family: sans-serif;"><h2>Autorización Parental</h2><p>Solicitud para el menor <b>@${minorAlias}</b>.</p><a href="https://www.idkfreegetid.dpdns.org/consent/${token}" style="color: #00E5FF;">Autorizar cuenta</a></div>`,
  });
}
