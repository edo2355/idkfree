import type { FastifyInstance } from 'fastify';
import { AccessToken } from 'livekit-server-sdk';
import { requireAuth } from '../middleware/auth.js';

export async function livekitRoutes(app: FastifyInstance) {
  app.get('/livekit/token', { preHandler: [requireAuth] }, async (req, reply) => {
    const { roomName, isHost } = req.query as any;
    const userId = (req as any).userId;

    if (!roomName) {
      return reply.code(400).send({ error: 'Falta el nombre de la sala' });
    }

    const apiKey = process.env.LIVEKIT_API_KEY;
    const apiSecret = process.env.LIVEKIT_API_SECRET;

    if (!apiKey || !apiSecret) {
      return reply.code(500).send({ error: 'LiveKit no está configurado en el servidor' });
    }

    const at = new AccessToken(apiKey, apiSecret, {
      identity: userId,
      ttl: '2h',
    });

    at.addGrant({
      roomJoin: true,
      room: roomName,
      canPublish: isHost === 'true', // Solo el host puede transmitir video
      canSubscribe: true,
    });

    return reply.send({ token: at.toJwt() });
  });
}
