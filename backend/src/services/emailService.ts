// ============================================================
// emailService.ts — Envío de correos vía API HTTP de Resend
// ============================================================
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'IDKfree <onboarding@resend.dev>';

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
}

async function sendEmail(options: SendEmailOptions): Promise<{ success: boolean; id?: string; error?: string }> {
  if (!process.env.RESEND_API_KEY) {
    console.warn('⚠️ RESEND_API_KEY no configurado. Saltando envío.');
    return { success: false, error: 'RESEND_API_KEY no configurado' };
  }

  try {
    const response = await resend.emails.send({
      from: FROM_EMAIL,
      to: [options.to],
      subject: options.subject,
      html: options.html,
    });

    if (response.error) {
      console.error(`❌ Resend error:`, response.error);
      return { success: false, error: response.error.message };
    }

    console.log(`✅ Correo enviado a ${options.to} (ID: ${response.data?.id})`);
    return { success: true, id: response.data?.id };
  } catch (error: any) {
    console.error('❌ Error en API Resend:', error.message);
    return { success: false, error: error.message };
  }
}

// ============================================================
// 1. Email de verificación (código OTP)
// ============================================================
export async function sendVerificationEmail(toEmail: string, code: string) {
  return sendEmail({
    to: toEmail,
    subject: 'Tu código de verificación - IDKfree',
    html: `
      <div style="background:#050505;color:#fff;font-family:sans-serif;padding:40px 20px;text-align:center;">
        <h1 style="color:#00e5ff;">IDKfree.OS</h1>
        <p style="font-size:16px;color:#a0a0a0;">Tu código de verificación es:</p>
        <div style="background:#000;border-radius:8px;padding:20px;margin:20px auto;max-width:300px;border:1px dashed #00e5ff;">
          <strong style="font-size:32px;color:#00e5ff;font-family:monospace;letter-spacing:4px;">${code}</strong>
        </div>
        <p style="font-size:12px;color:#666;">Si no solicitaste este código, ignora este correo.</p>
      </div>
    `,
  });
}

// ============================================================
// 2. SMS mock (no implementado aún)
// ============================================================
export async function sendVerificationSMS(phone: string, code: string) {
  console.log(`[SMS MOCK] Código ${code} enviado a ${phone}`);
}

// ============================================================
// 3. Email de bienvenida a la waitlist (con pase)
// ============================================================
export async function sendWaitlistEmail(toEmail: string, alias: string, position: number, code: string) {
  const passUrl = `https://www.idkfreegetid.dpdns.org/waitlist/card/${code}`;

  return sendEmail({
    to: toEmail,
    subject: `🚀 ¡Estás en la lista de IDKfree, @${alias}!`,
    html: `
      <div style="background-color:#050505;color:#ffffff;font-family:sans-serif;padding:40px 20px;text-align:center;">
        <h1 style="color:#00e5ff;margin-bottom:10px;">IDKfree.OS</h1>
        <p style="font-size:16px;color:#a0a0a0;">La red social de la Soberanía Digital</p>
        <div style="background:rgba(255,255,255,0.05);border:1px solid rgba(0,229,255,0.3);border-radius:16px;padding:30px;max-width:500px;margin:30px auto;text-align:left;">
          <h2 style="color:#ffffff;margin-top:0;">¡Hola @${alias}!</h2>
          <p style="font-size:15px;line-height:1.6;color:#d0d0d0;">
            Te has unido exitosamente al acceso anticipado. Estás en la posición <strong>#${position}</strong>.
          </p>
          <div style="background:#000;border-radius:8px;padding:15px;text-align:center;margin:20px 0;border:1px dashed #00e5ff;">
            <span style="font-size:12px;color:#a0a0a0;letter-spacing:1px;">TU CÓDIGO DE REFERIDO</span><br/>
            <strong style="font-size:24px;color:#00e5ff;font-family:monospace;">${code}</strong>
          </div>
          <p style="font-size:14px;color:#d0d0d0;">
            Compartí tu código con amigos. Por cada amigo que se una usando tu código, subirás <strong>2 posiciones</strong>.
          </p>
          <a href="${passUrl}" style="display:block;background:#00e5ff;color:#050505;text-decoration:none;font-weight:bold;padding:14px;border-radius:8px;text-align:center;margin-top:25px;">
            Ver mi Pase de Acceso
          </a>
        </div>
        <p style="font-size:12px;color:#666;margin-top:20px;">Si no te registraste en IDKfree, ignora este correo.</p>
      </div>
    `,
  });
}

// ============================================================
// 4. Email de consentimiento parental (menores de edad)
// ============================================================
export async function sendParentalConsentEmail(parentEmail: string, minorAlias: string, token: string) {
  const consentUrl = `https://www.idkfreegetid.dpdns.org/verify-parent?token=${token}`;

  return sendEmail({
    to: parentEmail,
    subject: `👨‍👩‍👧 Acción requerida: Autorizar cuenta de @${minorAlias}`,
    html: `
      <div style="background-color:#050505;color:#fff;padding:40px 20px;font-family:sans-serif;text-align:center;">
        <h1 style="color:#00e5ff;">IDKfree.OS</h1>
        <div style="background:rgba(255,255,255,0.05);border:1px solid rgba(0,229,255,0.3);border-radius:16px;padding:30px;max-width:500px;margin:30px auto;text-align:left;">
          <h2>Hola, tutor legal</h2>
          <p style="color:#d0d0d0;line-height:1.6;">
            El usuario <strong>@${minorAlias}</strong> ha solicitado unirse a IDKfree y ha indicado que es menor de edad.
          </p>
          <p style="color:#d0d0d0;line-height:1.6;">
            Por seguridad, su cuenta está en <strong>Modo Protegido</strong>. No podrá interactuar con adultos ni ver su contenido.
          </p>
          <p style="color:#d0d0d0;line-height:1.6;">
            Para autorizar su cuenta y que pueda chatear con otros menores, hacé clic en el botón:
          </p>
          <a href="${consentUrl}" style="display:block;background:#00e5ff;color:#050505;text-decoration:none;font-weight:bold;padding:14px;border-radius:8px;text-align:center;margin-top:25px;">
            Autorizar cuenta de mi hijo/a
          </a>
        </div>
      </div>
    `,
  });
}
