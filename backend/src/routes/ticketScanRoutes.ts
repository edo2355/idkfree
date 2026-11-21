import type { FastifyInstance } from 'fastify';
import { query } from '../db/pool.js';
import { requireAuth } from '../middleware/auth.js';

export async function ticketScanRoutes(app: FastifyInstance) {
  // Validar un ticket escaneado
  app.post('/tickets/scan', { preHandler: [requireAuth] }, async (req, reply) => {
    const { qrPayload } = req.body as { qrPayload: string };
    
    if (!qrPayload) return reply.code(400).send({ error: 'QR vacío' });
    
    try {
      const res = await query('SELECT * FROM event_tickets WHERE qr_payload = $1', [qrPayload]);
      
      if (res.rows.length === 0) {
        return reply.code(404).send({ status: 'invalid', error: 'Ticket no encontrado' });
      }
      
      const ticket = res.rows[0];
      
      if (ticket.scanned_at) {
        return reply.code(400).send({ status: 'used', error: 'Ticket ya escaneado', ticket });
      }
      
      // Marcar como escaneado
      await query('UPDATE event_tickets SET scanned_at = CURRENT_TIMESTAMP WHERE id = $1', [ticket.id]);
      
      return reply.send({ 
        status: 'valid', 
        message: 'Acceso Permitido', 
        ticket: {
          id: ticket.id,
          event_id: ticket.event_id,
          buyer_id: ticket.buyer_id,
          section: ticket.section_name,
          row: ticket.row_name,
          seat: ticket.seat_label,
          type: ticket.seat_type
        }
      });
    } catch (error) {
      app.log.error(error);
      return reply.code(500).send({ error: 'Error validando ticket' });
    }
  });
}
