import { FastifyInstance } from 'fastify';
import crypto from 'crypto';
import { query } from '../db/pool.js';
import { sendVerificationEmail, sendVerificationSMS } from '../services/emailService.js';

export async function verificationRoutes(app: FastifyInstance) {
  
  // RUTA 1: ENVIAR CÓDIGO OTP (Detecta email o teléfono)
  app.post('/auth/send-otp', async (req, reply) => {
    const { phone_number: identifier } = req.body as any;
    if (!identifier) return reply.code(400).send({ error: 'Email o teléfono requerido' });

    try {
      const isEmail = identifier.includes('@');
      const userRes = isEmail 
        ? await query('SELECT user_id FROM user_credentials WHERE email = $1 ORDER BY created_at DESC LIMIT 1', [identifier])
        : await query('SELECT id FROM users WHERE phone_number = $1', [identifier]);

      if (userRes.rows.length === 0) {
        return reply.code(404).send({ error: isEmail ? 'Correo no registrado en IDKFREE' : 'Teléfono no registrado en IDKFREE' });
      }
      
      const userId = isEmail ? userRes.rows[0].user_id : userRes.rows[0].id;
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = new Date(Date.now() + 10 * 60000).toISOString();

      await query(
        'INSERT INTO phone_otps (id, user_id, phone_number, otp_code, expires_at) VALUES ($1, $2, $3, $4, $5)', 
        [crypto.randomUUID(), userId, identifier, otp, expiresAt]
      );

      if (isEmail) {
        await sendVerificationEmail(identifier, otp);
      } else {
        await sendVerificationSMS(identifier, otp);
      }

      return reply.send({ message: 'Código enviado', ok: true });
    } catch (err) {
      app.log.error({ err }, 'Error en send-otp');
      return reply.code(500).send({ error: 'Error interno al enviar código' });
    }
  });

  // RUTA 2: VERIFICAR OTP Y GENERAR TOKEN DE ACCESO (Auto-Login)
  app.post('/auth/verify-otp', async (req, reply) => {
    const { phone_number: identifier, otp_code } = req.body as any;
    if (!identifier || !otp_code) return reply.code(400).send({ error: 'Datos incompletos' });

    try {
      const res = await query(
        'SELECT * FROM phone_otps WHERE phone_number = $1 AND otp_code = $2 AND expires_at > CURRENT_TIMESTAMP ORDER BY created_at DESC LIMIT 1', 
        [identifier, otp_code]
      );

      if (res.rows.length === 0) return reply.code(401).send({ error: 'Código inválido o expirado' });

      const userId = res.rows[0].user_id;
      
      // Marcar como verificado
      await query('UPDATE users SET email_verified = TRUE WHERE id = $1', [userId]);

      // Obtener alias para generar el token JWT
      const userRes = await query('SELECT alias FROM users WHERE id = $1', [userId]);
      const alias = userRes.rows[0]?.alias;

      // Generar token de acceso para auto-login
      const accessToken = app.jwt.sign({ sub: userId, alias }, { expiresIn: '30d' });

      // Devolver token, userId y alias al frontend
      return reply.send({ 
        message: 'Verificado correctamente', 
        ok: true, 
        accessToken, 
        userId, 
        alias 
      });
    } catch (err) {
      app.log.error({ err }, 'Error en verify-otp');
      return reply.code(500).send({ error: 'Error interno al verificar' });
    }
  });
}
