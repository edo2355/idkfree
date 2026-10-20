import Fastify from 'fastify';
import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
import dotenv from 'dotenv';
import crypto from 'crypto';
import { db } from './db.js';

dotenv.config();
const app = Fastify({ logger: true, trustProxy: true });

app.register(cors, { origin: true });
app.register(jwt, { secret: process.env.JWT_SECRET || 'auth_secret_3002' });

// RUTA 1: ENVIAR CÓDIGO OTP
app.post('/api/auth/send-otp', async (req, reply) => {
  const { phone_number } = req.body as any;
  if (!phone_number) return reply.code(400).send({ error: 'Teléfono requerido' });

  try {
    const userRes = await db.execute({
      sql: 'SELECT id FROM users WHERE phone_number = ?',
      args: [phone_number]
    });

    if (userRes.rows.length === 0) return reply.code(404).send({ error: 'Teléfono no registrado en IDKFREE' });
    const userId = userRes.rows[0].id;

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60000).toISOString();

    await db.execute({
      sql: 'INSERT INTO phone_otps (id, user_id, phone_number, otp_code, expires_at) VALUES (?, ?, ?, ?, ?)',
      args: [crypto.randomUUID(), userId, phone_number, otp, expiresAt]
    });

    // AQUÍ IRÍA EL ENVÍO REAL DEL SMS. Por ahora lo simulamos en consola.
    console.log(`\n🚨 [SMS SIMULADO] Código OTP para ${phone_number}: ${otp}\n`);

    return reply.send({ message: 'Código enviado', ok: true });
  } catch (err) {
    app.log.error(err);
    return reply.code(500).send({ error: 'Error interno' });
  }
});

// RUTA 2: VERIFICAR OTP
app.post('/api/auth/verify-otp', async (req, reply) => {
  const { phone_number, otp_code } = req.body as any;
  if (!phone_number || !otp_code) return reply.code(400).send({ error: 'Datos incompletos' });

  try {
    const res = await db.execute({
      sql: 'SELECT * FROM phone_otps WHERE phone_number = ? AND otp_code = ? AND expires_at > CURRENT_TIMESTAMP ORDER BY created_at DESC LIMIT 1',
      args: [phone_number, otp_code]
    });

    if (res.rows.length === 0) return reply.code(401).send({ error: 'Código inválido o expirado' });

    const userId = res.rows[0].user_id;
    await db.execute({ sql: 'UPDATE users SET is_phone_verified = TRUE WHERE id = ?', args: [userId] });
    await db.execute({ sql: 'DELETE FROM phone_otps WHERE user_id = ?', args: [userId] });

    const accessToken = app.jwt.sign({ sub: userId }, { expiresIn: '30d' });
    return reply.send({ accessToken, message: 'Teléfono verificado' });
  } catch (err) {
    return reply.code(500).send({ error: 'Error interno' });
  }
});

const start = async () => {
  try {
    await app.listen({ port: Number(process.env.PORT) || 3002, host: '0.0.0.0' });
    console.log('🔐 Auth Backend (OTP) corriendo en el puerto 3002');
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};
start();
