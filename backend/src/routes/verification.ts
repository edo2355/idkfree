import { FastifyInstance } from 'fastify';
import crypto from 'crypto';
import { query } from '../db/pool.js';
import { sendVerificationEmail, sendVerificationSMS } from '../services/emailService.js';

export async function verificationRoutes(app: FastifyInstance) {
  
  // RUTA 1: ENVIAR CÓDIGO OTP (Detecta email o teléfono)
  app.post('/auth/send-otp', async (req, reply) => {
    const { phone_number: identifier } = req.body as any; // El frontend envía el email o teléfono aquí
    if (!identifier) return reply.code(400).send({ error: 'Email o teléfono requerido' });

    try {
      const isEmail = identifier.includes('@');
      
      // Buscar al usuario dependiendo de si es email o teléfono
      const userRes = isEmail 
        ? await query('SELECT user_id FROM user_credentials WHERE email = $1 ORDER BY created_at DESC LIMIT 1', [identifier])
        : await query('SELECT id FROM users WHERE phone_number = $1', [identifier]);

      if (userRes.rows.length === 0) {
        return reply.code(404).send({ error: isEmail ? 'Correo no registrado en IDKFREE' : 'Teléfono no registrado en IDKFREE' });
      }
      
      // Si es email, la columna es user_id; si es teléfono, es id
      const userId = isEmail ? userRes.rows[0].user_id : userRes.rows[0].id;
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = new Date(Date.now() + 10 * 60000).toISOString();

      // Guardar OTP (usando la columna phone_number para ambos casos para no romper la tabla existente)
      await query(
        'INSERT INTO phone_otps (id, user_id, phone_number, otp_code, expires_at) VALUES ($1, $2, $3, $4, $5)', 
        [crypto.randomUUID(), userId, identifier, otp, expiresAt]
      );

      // Enviar código real
      if (isEmail) {
        await sendVerificationEmail(identifier, otp);
      } else {
        await sendVerificationSMS(identifier, otp);
      }

      return reply.send({ message: 'Código enviado', ok: true });
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      app.log.error({ err }, 'Error en send-otp: ' + msg);
      return reply.code(500).send({ error: 'Error interno al enviar código' });
    }
  });

  // RUTA 2: VERIFICAR OTP
  app.post('/auth/verify-otp', async (req, reply) => {
    const { phone_number: identifier, otp_code } = req.body as any;
    if (!identifier || !otp_code) return reply.code(400).send({ error: 'Datos incompletos' });

    try {
      // Buscar el OTP sin importar si es email o teléfono
      const res = await query(
        'SELECT * FROM phone_otps WHERE phone_number = $1 AND otp_code = $2 AND expires_at > CURRENT_TIMESTAMP ORDER BY created_at DESC LIMIT 1', 
        [identifier, otp_code]
      );

      if (res.rows.length === 0) return reply.code(401).send({ error: 'Código inválido o expirado' });

      const userId = res.rows[0].user_id;
      
      // Marcar como verificado
      await query('UPDATE users SET is_phone_verified = TRUE WHERE id = ?', [userId]);

      return reply.send({ message: 'Verificado correctamente', ok: true });
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      app.log.error({ err }, 'Error en verify-otp: ' + msg);
      return reply.code(500).send({ error: 'Error interno al verificar' });
    }
  });
}
