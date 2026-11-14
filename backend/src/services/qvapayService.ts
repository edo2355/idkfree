import { query } from '../db/pool.js';
import { randomUUID } from 'crypto';

const QVAPAY_APP_ID = process.env.QVAPAY_APP_ID || '';
const QVAPAY_APP_SECRET = process.env.QVAPAY_APP_SECRET || '';
const QVAPAY_API_URL = 'https://api.qvapay.com/v2';

export async function createInvoice(userId: string | undefined, amount: number, description: string) {
  // 🛡️ Blindaje: Si userId llega undefined, usamos uno por defecto para no romper
  const safeUserId = userId || 'anonymous-user';
  const remoteId = `IDK-${Date.now()}-${safeUserId.slice(0, 5)}`;

  try {
    const response = await fetch(`${QVAPAY_API_URL}/create_invoice`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'app-id': QVAPAY_APP_ID,
        'app-secret': QVAPAY_APP_SECRET
      },
      body: JSON.stringify({ amount, description, remote_id: remoteId })
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Error creando factura');

    await query(
      `INSERT INTO transactions (id, user_id, amount, status, provider, remote_id, payment_url)
       VALUES ($1, $2, $3, 'pending', 'qvapay', $4, $5)`,
      [randomUUID(), safeUserId, amount, remoteId, data.url]
    );

    return { success: true, url: data.url, remoteId };
  } catch (error) {
    console.error('❌ Error en QvaPay createInvoice:', error);
    throw error;
  }
}

export async function handleWebhook(payload: any) {
  const { status, remote_id } = payload;
  if (status === 'paid' || status === 'completed') {
    await query(`UPDATE transactions SET status = 'completed' WHERE remote_id = $1`, [remote_id]);
    console.log(`✅ Pago completado para: ${remote_id}`);
    return true;
  }
  return false;
}
