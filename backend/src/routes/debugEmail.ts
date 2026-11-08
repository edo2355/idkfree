import { FastifyInstance } from 'fastify';

export async function debugEmailRoutes(app: FastifyInstance) {
  app.get('/debug/email', async (req, reply) => {
    const { to } = req.query as { to?: string };
    const RESEND_KEY = process.env.RESEND_API_KEY;
    const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'NO CONFIGURADO';

    const diagnostico = {
      config: {
        RESEND_API_KEY_presente: !!RESEND_KEY,
        RESEND_API_KEY_prefijo: RESEND_KEY ? RESEND_KEY.substring(0, 6) + '...' : null,
        RESEND_FROM_EMAIL: FROM_EMAIL,
        FROM_tiene_dominio_propio: FROM_EMAIL.includes('@idkfree') ? true : false,
        FROM_es_onboarding: FROM_EMAIL.includes('onboarding@resend.dev') ? true : false,
        TO: to || 'no especificado',
      },
      resend_call: null as any,
    };

    if (!RESEND_KEY) {
      return reply.code(500).send({ ...diagnostico, error: 'RESEND_API_KEY vacío en Render' });
    }
    if (!to) {
      return reply.code(400).send({ ...diagnostico, error: 'Pasa ?to=email@dominio.com' });
    }

    try {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${RESEND_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: FROM_EMAIL,
          to: [to],
          subject: 'Test IDKfree Debug',
          html: '<h1>Test</h1><p>Si ves esto, Resend funciona.</p>',
        }),
      });

      const text = await response.text();
      let body: any;
      try { body = JSON.parse(text); } catch { body = { raw: text }; }

      diagnostico.resend_call = {
        http_status: response.status,
        http_ok: response.ok,
        body,
      };

      return reply.code(response.ok ? 200 : 500).send(diagnostico);
    } catch (err: any) {
      return reply.code(500).send({
        ...diagnostico,
        error_red: err.message,
        causa: err.cause?.message || null,
      });
    }
  });
}
