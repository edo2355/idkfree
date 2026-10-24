export async function sendVerificationEmail(to: string, code: string) {
  const MAILTRAP_TOKEN = process.env.MAILTRAP_TOKEN || 'tu_token_aqui';
  
  try {
    const response = await fetch('https://send.api.mailtrap.io/api/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${MAILTRAP_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: { email: 'noreply@idkfreegetid.dpdns.org', name: 'IDKFREE' },
        to: [{ email: to }],
        subject: '[ IDKFREE ] Código de Verificación',
        html: `
          <div style="font-family: monospace; background: #0a0a0a; color: #fff; padding: 20px; border: 1px solid #333; max-width: 500px; margin: 0 auto;">
            <h2 style="color: #00E5FF; border-bottom: 1px solid #333; padding-bottom: 10px;">[ IDKFREE SYSTEM ]</h2>
            <p>Tu código de verificación es:</p>
            <h1 style="font-size: 32px; letter-spacing: 5px; color: #fff; background: #111; padding: 10px; display: inline-block; border: 1px dashed #00E5FF;">${code}</h1>
            <p>Este código expira en 10 minutos.</p>
            <p style="color: #666; font-size: 12px; margin-top: 30px;">Si no solicitaste este código, ignora este mensaje.</p>
          </div>
        `
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`Mailtrap Error: ${errorData}`);
    }

    console.log(`✅ Correo enviado a ${to} vía Mailtrap`);
    return true;
  } catch (error) {
    console.error('❌ Error enviando correo:', error);
    return false;
  }
}

export async function sendVerificationSMS(to: string, code: string) {
  // Aquí integraremos zdSMS o Plivo más adelante.
  console.log(`[ SMS SIMULADO ] Código ${code} para ${to}`);
  return true;
}
