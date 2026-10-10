import type { FastifyRequest, FastifyReply } from 'fastify';

declare module 'fastify' {
  interface FastifyRequest {
    userId?: string;
    alias?: string;
  }
}

export async function requireAuth(req: FastifyRequest, reply: FastifyReply): Promise<void> {
  try {
    const payload = await req.jwtVerify<{ sub: string; alias: string }>();
    req.userId = payload.sub;
    req.alias = payload.alias;
  } catch {
    return reply.code(401).send({ error: 'No autenticado' });
  }
}
