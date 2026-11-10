import { query } from '../db/pool.js';
import crypto from 'crypto';

export const TRUST_WEIGHTS = {
  KYC_APPROVED: 30,
  TELEGRAM_LINKED: 10,
  SOCIAL_CONNECTED: 20,
  DEAL_COMPLETED: 5,
};

export async function addTrustPoints(userId: string, eventType: keyof typeof TRUST_WEIGHTS, metadata: string = '') {
  const points = TRUST_WEIGHTS[eventType];
  if (!points) return;

  try {
    // 1. Registrar el evento
    await query(
      `INSERT INTO trust_events (id, user_id, event_type, points, metadata) VALUES ($1, $2, $3, $4, $5)`,
      [crypto.randomUUID(), userId, eventType, points, metadata]
    );

    // 2. Sumar al puntaje total del usuario (máximo 100)
    await query(
      `UPDATE users SET trust_score = LEAST(100, COALESCE(trust_score, 10) + $1) WHERE id = $2`,
      [points, userId]
    );

    console.log(`✅ +${points} puntos de confianza para ${userId} (${eventType})`);
  } catch (error) {
    console.error('Error actualizando Trust Score:', error);
  }
}
