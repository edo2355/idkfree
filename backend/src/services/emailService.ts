import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY || 're_dummy');

// ==========================================
// 1. Funciones de Verificación (Restauradas)
// ==========================================
export async function sendVerificationEmail(toEmail: string, code: string) {
  if (!process.env.RESEND_API_KEY) return;
  try {
    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'IDKfree <onboarding@resend.dev>',
      to: [toEmail],
      subject: 'Tu código de verificación - IDKfree',
      html: `<h2>Tu código es: <strong>${code}</strong></h2>`
    });
  } catch (error) {
    console.error('Error enviando verificación email:', error);
  }
}

export async function sendVerificationSMS(phone: string, code: string) {
  // Stub temporal (reemplazar por tu proveedor real de SMS si lo tenés)
  console.log(`[SMS MOCK] Código ${code} enviado a ${phone}`);
}

// ==========================================
// 2. Función de Waitlist (Nueva)
// ==========================================
export async function sendWaitlistEmail(toEmail: string, alias: string, position: number, code: string) {
  if (!process.env.RESEND_API_KEY) {
    console.warn("⚠️ RESEND_API_KEY no configurada. Saltando envío.");
    return;
  }

  const passUrl = `https://www.idkfreegetid.dpdns.org/waitlist/card/${code}`;
  const fromEmail = process.env.RESEND_FROM_EMAIL || "IDKfree <onboarding@resend.dev>";

  try {
    const response: any = await resend.emails.send({
      from: fromEmail,
      to: [toEmail],
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
    
    if (response.error) {
      console.error("❌ Resend error:", response.error);
    } else {
      console.log(`✅ Correo enviado a ${toEmail}: ID ${response.data?.id}`);
    }
  } catch (error) {
    console.error("❌ Error enviando correo:", error);
  }
}
