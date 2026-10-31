import { FastifyInstance } from 'fastify';
import { AccessToken, RoomServiceClient } from 'livekit-server-sdk';
import { requireAuth } from '../middleware/auth.js'; // Ajusta si tu ruta es distinta

export async function livekitRoutes(app: FastifyInstance) {
  app.get('/livekit/token', { preHandler: [requireAuth] }, async (req, reply) => {
    const { roomName, isHost } = req.query as { roomName: string, isHost: string };
    const isHostBool = isHost === 'true';

    const apiKey = process.env.LIVEKIT_API_KEY;
    const apiSecret = process.env.LIVEKIT_API_SECRET;
    const livekitUrl = process.env.LIVEKIT_URL;

    if (!apiKey || !apiSecret || !livekitUrl) {
      return reply.code(500).send({ error: 'LiveKit no está configurado en el servidor' });
    }

    // 1. Crear la sala con emptyTimeout para evitar salas colgadas (zombies)
    try {
      const roomService = new RoomServiceClient(livekitUrl, apiKey, apiSecret);
      await roomService.createRoom({
        name: roomName,
        emptyTimeout: 60, // La sala se destruye 60s después de que se vaya el último
        maxParticipants: 10
      });
    } catch (err) {
      // Si la sala ya existe, ignoramos el error (LiveKit asume que ya está creada)
      app.log.info(`La sala ${roomName} ya existe o está activa.`);
    }

    // 2. Generar el token
    const at = new AccessToken(apiKey, apiSecret, {
      identity: (req as any).user?.alias || 'Anonimo',
      name: (req as any).user?.alias || 'Anonimo',
      ttl: '2h',
    });

    at.addGrant({
      roomJoin: true,
      room: roomName,
      canPublish: isHostBool,
      canSubscribe: true,
    });

    return reply.send({ token: await at.toJwt(), url: livekitUrl });
  });
}
