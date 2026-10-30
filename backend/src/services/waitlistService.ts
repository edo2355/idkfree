import { query, uuid } from '../db/pool.js';

// Genera un código tipo NEXO-A3F9-K2L8
function generateReferralCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const block = () => Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  return `NEXO-${block()}-${block()}`;
}

export async function checkAliasAvailability(alias: string) {
  const normalized = alias.toLowerCase().trim();
  if (!/^[a-z0-9_]{3,30}$/.test(normalized)) {
    return { available: false, reason: 'Formato inválido. Usa minúsculas, números y _' };
  }
  
  const res = await query('SELECT id FROM waitlist WHERE alias = $1', [normalized]);
  if (res.rows.length > 0) {
    return { 
      available: false, 
      reason: 'Alias ya ocupado',
      suggestions: [`${normalized}${Math.floor(Math.random() * 99)}`, `${normalized}_cuba`]
    };
  }
  return { available: true };
}

export async function joinWaitlist(alias: string, email?: string) {
  const normalizedAlias = alias.toLowerCase().trim();
  
  // Verificar si ya existe
  const existing = await query('SELECT position FROM waitlist WHERE alias = $1', [normalizedAlias]);
  if (existing.rows.length > 0) {
    throw new Error('ALIAS_TAKEN');
  }

  // Calcular posición
  const countRes = await query('SELECT COUNT(*) as c FROM waitlist');
  const nextPosition = (countRes.rows[0].c as number) + 1;
  const isEarlyAccess = nextPosition <= 20 ? 1 : 0;
  const referralCode = generateReferralCode();
  const id = uuid();

  await query(
    `INSERT INTO waitlist (id, alias, email, referral_code, position, is_early_access) 
     VALUES ($1, $2, $3, $4, $5, $6)`,
    [id, normalizedAlias, email || null, referralCode, nextPosition, isEarlyAccess]
  );

  return {
    position: nextPosition,
    referral_code: referralCode,
    is_early_access: Boolean(isEarlyAccess),
  };
}

export async function getWaitlistStats() {
  const res = await query('SELECT COUNT(*) as c FROM waitlist');
  const total = res.rows[0].c as number;
  return {
    total,
    early_access_spots_left: Math.max(0, 20 - total),
  };
}
