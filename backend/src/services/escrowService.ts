import { query } from '../db/pool.js';
import { randomUUID } from 'crypto';

export async function createEscrowDeal(brandId: string, creatorId: string, amount: number) {
  const id = randomUUID();
  await query(
    `INSERT INTO escrow_deals (id, brand_id, creator_id, amount, status) VALUES ($1, $2, $3, $4, 'funded')`,
    [id, brandId, creatorId, amount]
  );
  return { id, status: 'funded', message: 'Fondos retenidos en garantía exitosamente.' };
}

export async function releaseEscrowFunds(dealId: string) {
  await query(`UPDATE escrow_deals SET status = 'released' WHERE id = $1`, [dealId]);
  return { success: true, message: 'Fondos liberados al creador.' };
}
