import { FastifyInstance } from 'fastify';
import crypto from 'crypto';
import { query } from '../db/pool.js';
import { sendVerificationEmail, sendVerificationSMS } from '../services/emailService.js'; // Asegúrate de que esta sea la ruta correcta a tu DB

export async function verificationRoutes(app: FastifyInstance) {
  // RUTA 1: ENVIAR CÓDIGO OTP
  app.post('/auth/send-otp', async (req, reply) => {
    const { phone_number } = req.body as any;
    if (!phone_number) return reply.code(400).send({ error: 'Teléfono requerido' });

    try {
      const isEmail = phone_number.includes('@');
      const userRes = isEmail 
        ? await query('SELECT id FROM users WHERE email = ?', [phone_number])
        : await query('SELECT id FROM users WHERE phone_number = ?', [phone_number]);

      if (userRes.rows.length === 0) return reply.code(404).send({ error: 'Teléfono no registrado en IDKFREE' });
      const userId = userRes.rows[0].id;

      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = new Date(Date.now() + 10 * 60000).toISOString();

      await query('INSERT INTO phone_otps (id, user_id, phone_number, otp_code, expires_at) VALUES (?, ?, ?, ?, ?)', [crypto.randomUUID(), userId, phone_number, otp, expiresAt]);

      
    // Enviar código real (usa email o sms según corresponda)
    // Asumimos que phone_number es un correo o teléfono. 
    // Si es un correo, usamos Resend. Si es teléfono, usamos SMS.
    if (phone_number.includes('@')) {
      await sendVerificationEmail(phone_number, otp);
    } else {
      await sendVerificationSMS(phone_number, otp);
    }
    
      return reply.send({ message: 'Código enviado', ok: true });
    } catch (err) {
      app.log.error(err);
      return reply.code(500).send({ error: 'Error interno' });
    }
  });

  // RUTA 2: VERIFICAR OTP
  app.post('/auth/verify-otp', async (req, reply) => {
    const { phone_number, otp_code } = req.body as any;
    if (!phone_number || !otp_code) return reply.code(400).send({ error: 'Datos incompletos' });

    try {
      const res = await query('SELECT * FROM phone_otps WHERE phone_number = ? AND otp_code = ? AND expires_at > CURRENT_TIMESTAMP ORDER BY created_at DESC LIMIT 1', [phone_number, otp_code]);

      if (res.rows.length === 0) return reply.code(401).send({ error: 'Código inválido o expirado' });

      const userId = res.rows[0].user_id;
      await query('UPDATE users SET is_phone_verified = TRUE WHERE id = ?', [userId]);
      
      return reply.send({ message: 'Verificado correctamente', ok: true });
    } catch (err) {
      app.log.error(err);
      return reply.code(500).send({ error: 'Error interno' });
    }
  });
}
