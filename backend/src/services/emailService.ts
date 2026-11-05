import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp-relay.brevo.com',
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendVerificationEmail(toEmail: string, code: string) {
  if (!process.env.SMTP_USER) return;
  try {
    await transporter.sendMail({
      from: `"IDKfree" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
      to: toEmail,
      subject: 'Tu código de verificación - IDKfree',
      html: `<h2>Tu código es: <strong>${code}</strong></h2>`
    });
  } catch (error) {
    console.error('Error enviando verificación email:', error);
  }
}

export async function sendVerificationSMS(phone: string, code: string) {
  console.log(`[SMS MOCK] Código ${code} enviado a ${phone}`);
}

export async function sendWaitlistEmail(toEmail: string, alias: string, position: number, code: string) {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.warn("⚠️ Credenciales SMTP no configuradas. Saltando envío.");
    return;
  }

  const passUrl = `https://www.idkfreegetid.dpdns.org/waitlist/card/${code}`;

  try {
    const info = await transporter.sendMail({
      from: `"IDKfree" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
      to: toEmail,
      subject: `🚀 ¡Estás en la lista de IDKfree, @${alias}!`,
      html: `
        <div style="background-color: #050505; color: #ffffff; font-family: sans-serif; padding: 40px 20px; text-align: center;">
          <h1 style="color: #00e5ff; margin-bottom: 10px;">IDKfree.OS</h1>
          <p style="font-size: 16px; color: #a0a0a0;">La red social de la Soberanía Digital</p>
          <div style="background: rgba(255,255,255,0.05); border: 1px solid rgba(0,229,255,0.3); border-radius: 16px; padding: 30px; max-width: 500px; margin: 30px auto; text-align: left;">
            <h2 style="color: #ffffff; margin-top: 0;">¡Hola @${alias}!</h2>
            <p style="font-size: 15px; line-height: 1.6; color: #d0d0d0;">
              Te has unido exitosamente al acceso anticipado. Estás en la posición <strong>#${position}</strong>.
            </p>
            <div style="background: #000; border-radius: 8px; padding: 15px; text-align: center; margin: 20px 0; border: 1px dashed #00e5ff;">
              <span style="font-size: 12px; color: #a0a0a0; letter-spacing: 1px;">TU CÓDIGO DE REFERIDO</span><br/>
              <strong style="font-size: 24px; color: #00e5ff; font-family: monospace;">${code}</strong>
            </div>
            <a href="${passUrl}" style="display: block; background: #00e5ff; color: #050505; text-decoration: none; font-weight: bold; padding: 14px; border-radius: 8px; text-align: center; margin-top: 25px;">
              Ver mi Pase de Acceso
            </a>
          </div>
        </div>
      `
    });
    console.log(`✅ Correo enviado a ${toEmail}: ${info.messageId}`);
  } catch (error) {
    console.error("❌ Error enviando correo:", error);
  }
}

export async function sendParentalConsentEmail(parentEmail: string, minorAlias: string, token: string) {
  if (!process.env.SMTP_USER) {
    console.warn("⚠️ SMTP no configurado. No se envió correo al tutor.");
    return;
  }

  const consentUrl = `https://www.idkfreegetid.dpdns.org/verify-parent?token=${token}`;

  try {
    await transporter.sendMail({
      from: `"IDKfree Seguridad" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
      to: parentEmail,
      subject: `👨‍👩‍👧 Acción requerida: Autorizar cuenta de @${minorAlias}`,
      html: `
        <div style="background-color: #050505; color: #fff; padding: 40px 20px; font-family: sans-serif; text-align: center;">
          <h1 style="color: #00e5ff;">IDKfree.OS</h1>
          <div style="background: rgba(255,255,255,0.05); border: 1px solid rgba(0,229,255,0.3); border-radius: 16px; padding: 30px; max-width: 500px; margin: 30px auto; text-align: left;">
            <h2>Hola, tutor legal</h2>
            <p style="color: #d0d0d0; line-height: 1.6;">
              El usuario <strong>@${minorAlias}</strong> ha solicitado unirse a IDKfree y ha indicado que es menor de edad.
            </p>
            <p style="color: #d0d0d0; line-height: 1.6;">
              Por seguridad, su cuenta está en <strong>Modo Protegido</strong>. No podrá interactuar con adultos ni ver su contenido.
            </p>
            <a href="${consentUrl}" style="display: block; background: #00e5ff; color: #050505; text-decoration: none; font-weight: bold; padding: 14px; border-radius: 8px; text-align: center; margin-top: 25px;">
              Autorizar cuenta de mi hijo/a
            </a>
          </div>
        </div>
      `
    });
    console.log(`✅ Correo de tutela enviado a ${parentEmail}`);
  } catch (error) {
    console.error("❌ Error enviando correo a tutor:", error);
  }
}
