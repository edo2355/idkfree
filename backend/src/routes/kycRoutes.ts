import { FastifyInstance } from 'fastify';
import { query } from '../db/pool.js';
import { requireAuth } from '../middleware/auth.js';
import { kycManager } from '../services/kyc/orchestrator.js';
import { addTrustPoints } from '../services/trustService.js';
import crypto from 'crypto';

export async function kycRoutes(app: FastifyInstance) {
  
  // 1. Obtener opciones de KYC disponibles según el país
  app.get('/kyc/providers', { preHandler: [requireAuth] }, async (req, reply) => {
    const country = (req.query as any).country || 'CU'; // Fallback a Cuba
    const available = kycManager.getAvailableProviders(country);
    return reply.send({ country, available_providers: available });
  });

  // 2. Iniciar una verificación KYC
  app.post('/kyc/start', { preHandler: [requireAuth] }, async (req, reply) => {
    const userId = (req as any).userId;
    const { provider, country, userData } = req.body as any;
    
    try {
      const result = await kycManager.startVerification(userId, country, userData, provider);
      
      // Guardar en la base de datos
      await query(
        `INSERT INTO kyc_verifications (id, user_id, provider_used, status) VALUES ($1, $2, $3, 'approved')`,
        [crypto.randomUUID(), userId, provider || 'auto']
      );
      // Sumar puntos automáticamente al aprobarse
      await addTrustPoints(userId, 'KYC_APPROVED');
      
      return reply.send(result);
    } catch (err: any) {
      return reply.code(500).send({ error: err.message });
    }
  });

  // Ruta para que la web consulte el Trust Score
  app.get('/user/trust', { preHandler: [requireAuth] }, async (req, reply) => {
    const userId = (req as any).userId;
    const res = await query('SELECT trust_score FROM users WHERE id = $1', [userId]);
    return reply.send({ trust_score: res.rows[0]?.trust_score || 10 });
  });

  // 3. Generar API Key para Desarrolladores (B2B)
  app.post('/developer/keys', { preHandler: [requireAuth] }, async (req, reply) => {
    const userId = (req as any).userId;
    const { app_name } = req.body as any;
    
    if (!app_name) return reply.code(400).send({ error: 'app_name es requerido' });

    const apiKey = `idk_pub_${crypto.randomBytes(16).toString('hex')}`;
    const apiSecret = `idk_sec_${crypto.randomBytes(32).toString('hex')}`;
    
    await query(
      `INSERT INTO developer_api_keys (id, user_id, app_name, api_key, api_secret) VALUES ($1, $2, $3, $4, $5)`,
      [crypto.randomUUID(), userId, app_name, apiKey, apiSecret]
    );

    return reply.send({ message: 'API Key generada. Guarda el secret, no se volverá a mostrar.', api_key: apiKey, api_secret: apiSecret });
  });

  // 4. Listar API Keys del usuario
  app.get('/developer/keys', { preHandler: [requireAuth] }, async (req, reply) => {
    const userId = (req as any).userId;
    const res = await query(`SELECT id, app_name, api_key, status, created_at FROM developer_api_keys WHERE user_id = $1`, [userId]);
    return reply.send({ keys: res.rows });
  });
}
