import type { FastifyInstance } from 'fastify';
import { register, verifyLogin } from '../services/authService.js';
import { registerSchema, loginSchema } from '../utils/validation.js';
import { query } from '../db/pool.js';

export async function authRoutes(app: FastifyInstance) {
  app.post('/auth/register', async (req, reply) => {
    const parsed = registerSchema.safeParse(req.body);
    if (!parsed.success) { app.log.error({ zodErrors: parsed.error.flatten() }, 'REGISTER VALIDATION FAILED'); return reply.code(400).send({ error: 'Datos inválidos', details: parsed.error.flatten() }); }
    try {
      const result = await register(parsed.data as any);
      const accessToken = app.jwt.sign({ sub: result.userId, alias: result.alias }, { expiresIn: '30d' });
      return reply.code(201).send({
        ...result,
        accessToken,
        warning: 'Guarda los 3 QRs y los 3 PINs del carnet AHORA. Los 3 PINs secretos no se muestran — solo tú los sabes.',
      });
    } catch (err: any) {
      if (err.message === 'EMAIL_OR_ALIAS_TAKEN') return reply.code(409).send({ error: 'Email o alias ya está en uso' });
      if (err.message.includes('PIN')) return reply.code(400).send({ error: err.message });
      app.log.error(err); return reply.code(500).send({ error: 'Error interno' });
    }
  });

  app.post('/auth/login', async (req, reply) => {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) return reply.code(400).send({ error: parsed.error.flatten() });
    try {
      const { userId, alias } = await verifyLogin(parsed.data.email, parsed.data.password);
      const accessToken = app.jwt.sign({ sub: userId, alias }, { expiresIn: '30d' });
      return reply.send({ userId, alias, accessToken });
    } catch (err: any) {
      if (err.message === 'MAX_EMAIL_ACCOUNTS_REACHED') { return reply.code(400).send({ error: 'Límite de 5 cuentas alcanzado' }); }
      if (err.message === 'INVALID_CREDENTIALS') return reply.code(401).send({ error: 'Credenciales inválidas' });
      app.log.error(err); return reply.code(500).send({ error: 'Error interno' });
    }
  });

  app.get('/auth/me', async (req, reply) => {
    try {
      const payload = await req.jwtVerify<{ sub: string; alias: string }>();
      const res = await query('SELECT id, alias, name, bio, avatar_url, created_at FROM users WHERE id = $1', [payload.sub]);
      if (res.rows.length === 0) return reply.code(404).send({ error: 'Usuario no encontrado' });
      return reply.send({ user: res.rows[0] });
    } catch { return reply.code(401).send({ error: 'No autenticado' }); }
  });

  // ENVIAR CÓDIGO DE VERIFICACIÓN DE CORREO
  app.post('/auth/send-email-otp', async (req, reply) => {
    const { email } = req.body as any;
    if (!email) return reply.code(400).send({ error: 'Email requerido' });

    try {
      const userRes = await query('SELECT id FROM users WHERE email = $1', [email]);
      if (userRes.rows.length === 0) return reply.code(404).send({ error: 'Usuario no encontrado' });

      const userId = userRes.rows[0].id;
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = new Date(Date.now() + 10 * 60000).toISOString();

      await query(
        'INSERT INTO email_otps (id, user_id, email, otp_code, expires_at) VALUES ($1, $2, $3, $4, $5)',
        [crypto.randomUUID(), userId, email, otp, expiresAt]
      );

      // Simulamos el envío del correo (En producción usarías Resend o Nodemailer)
      app.log.info(`[SIMULACIÓN EMAIL] Código para ${email}: ${otp}`);
      
      return reply.send({ message: 'Código enviado al correo (Revisa los logs del servidor)' });
    } catch (err) {
      return reply.code(500).send({ error: 'Error interno' });
    }
  });

  // VERIFICAR CÓDIGO DE CORREO
  app.post('/auth/verify-email-otp', async (req, reply) => {
    const { email, otp_code } = req.body as any;
    if (!email || !otp_code) return reply.code(400).send({ error: 'Datos incompletos' });

    try {
      const res = await query(
        'SELECT * FROM email_otps WHERE email = $1 AND otp_code = $2 AND expires_at > CURRENT_TIMESTAMP ORDER BY created_at DESC LIMIT 1',
        [email, otp_code]
      );

      if (res.rows.length === 0) return reply.code(401).send({ error: 'Código inválido o expirado' });

      const userId = res.rows[0].user_id;
      await query('UPDATE users SET email_verified = TRUE WHERE id = $1', [userId]);
      await query('DELETE FROM email_otps WHERE user_id = $1', [userId]);

      return reply.send({ message: 'Correo verificado exitosamente' });
    } catch (err) {
      return reply.code(500).send({ error: 'Error interno' });
    }
  });


  // GET /api/auth/check-alias — Verifica si un alias está disponible
  app.get('/auth/check-alias', async (req, reply) => {
    const { alias } = req.query as { alias: string };
    if (!alias) return reply.code(400).send({ error: 'Alias requerido' });

    try {
      const res = await query('SELECT id FROM users WHERE alias = ?', [alias.toLowerCase().trim()]);
      const isAvailable = res.rows.length === 0;

      let suggestions: string[] = [];
      if (!isAvailable) {
        // Generar 3 sugerencias aleatorias si está ocupado
        suggestions = [
          `${alias}${Math.floor(Math.random() * 99) + 1}`,
          `${alias}_${Math.floor(Math.random() * 999) + 1}`,
          `${alias}_cuba`
        ];
      }

      return reply.send({ available: isAvailable, suggestions });
    } catch (err) {
      app.log.error(err);
      return reply.code(500).send({ error: 'Error al verificar alias' });
    }
  });

}
