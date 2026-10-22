import type { FastifyInstance } from 'fastify';
import { AccessToken } from 'livekit-server-sdk';
import { requireAuth } from '../middleware/auth.js';

export async function callRoutes(app: FastifyInstance) {
  app.get('/calls/token', { preHandler: [requireAuth] }, async (req, reply) => {
    const { targetUserId } = req.query as any;
    const userId = (req as any).userId;

    if (!targetUserId) {
      return reply.code(400).send({ error: 'Falta el ID del usuario a llamar' });
    }

    const apiKey = process.env.LIVEKIT_API_KEY;
    const apiSecret = process.env.LIVEKIT_API_SECRET;

    if (!apiKey || !apiSecret) {
      return reply.code(500).send({ error: 'LiveKit no está configurado' });
    }

    // Creamos un nombre de sala único para esta llamada (ordenado alfabéticamente para que ambos coincidan)
    const roomName = `call-${[userId, targetUserId].sort().join('-')}`;

    const at = new AccessToken(apiKey, apiSecret, {
      identity: userId,
      ttl: '2h',
    });

    at.addGrant({
      roomJoin: true,
      room: roomName,
      canPublish: true, // En llamadas, ambos pueden transmitir
      canSubscribe: true,
    });

    return reply.send({ token: await at.toJwt(), roomName });
  });
}
