import { query, uuid } from '../db/pool.js';
import { sendWaitlistEmail } from './emailService.js';
const REFERRAL_BOOST_PER_FRIEND = 2; // +2 posiciones por referido
const EARLY_ACCESS_LIMIT = 25;
const MILESTONES = [1, 3, 5, 10, 20]; // Cada hito desbloquea "achievement"

function generateReferralCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const block = () => Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  return `IDK-${block()}-${block()}`;
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

// Valida que el código de referido exista y devuelve el alias del referidor
export async function checkReferralCode(code: string) {
  const normalized = code.trim().toUpperCase();
  if (!normalized) return { valid: false, reason: 'Código vacío' };
  const res = await query(
    'SELECT alias FROM waitlist WHERE referral_code = $1 LIMIT 1',
    [normalized]
  );
  if (res.rows.length === 0) {
    return { valid: false, reason: 'Código inválido' };
  }
  return { valid: true, referrer_alias: res.rows[0].alias as string };
}

export async function joinWaitlist(alias: string, email?: string, referredBy?: string) {
  const normalizedAlias = alias.toLowerCase().trim();

  // Verificar duplicado
  const existing = await query('SELECT position FROM waitlist WHERE alias = $1', [normalizedAlias]);
  if (existing.rows.length > 0) throw new Error('ALIAS_TAKEN');

  // Resolver referido
  let referredById: string | null = null;
  let referredByCode: string | null = null;

  if (referredBy) {
    const refCheck = await query(
      'SELECT id, referral_code FROM waitlist WHERE referral_code = $1 LIMIT 1',
      [referredBy.trim().toUpperCase()]
    );
    if (refCheck.rows.length === 0) throw new Error('INVALID_REFERRAL');
    referredById = refCheck.rows[0].id as string;
    referredByCode = refCheck.rows[0].referral_code as string;
  }

  // Calcular posición
  const countRes = await query('SELECT COUNT(*) as c FROM waitlist');
  const nextPosition = (countRes.rows[0].c as number) + 1;
  const isEarlyAccess = nextPosition <= EARLY_ACCESS_LIMIT ? 1 : 0;
  const referralCode = generateReferralCode();
  const id = uuid();

  await query(
    `INSERT INTO waitlist (id, alias, email, referral_code, position, is_early_access, referred_by_id, referred_by_code)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
    [id, normalizedAlias, email || null, referralCode, nextPosition, isEarlyAccess, referredById, referredByCode]
  );

  
  // Enviar correo de bienvenida con Resend
  if (email) {
    // Asíncrono para no bloquear la respuesta al usuario
    sendWaitlistEmail(email, alias, newPosition, referralCode).catch(err => {
      console.error("Fallo asíncrono al enviar correo:", err);
    });
  }

return {
    position: nextPosition,
    referral_code: referralCode,
    is_early_access: Boolean(isEarlyAccess),
    referred_by_code: referredByCode,
  };
}

export async function getWaitlistStats() {
  const res = await query('SELECT COUNT(*) as c FROM waitlist');
  const total = res.rows[0].c as number;
  return {
    total,
    early_access_spots_left: Math.max(0, EARLY_ACCESS_LIMIT - total),
  };
}

// Devuelve TODOS los datos del pase + gamificación calculada
export async function getWaitlistCard(code: string) {
  const normalized = code.trim().toUpperCase();
  const res = await query(
    'SELECT id, alias, email, position, referral_code, is_early_access, referred_by_code, created_at FROM waitlist WHERE referral_code = $1 LIMIT 1',
    [normalized]
  );
  if (res.rows.length === 0) throw new Error('NOT_FOUND');
  const row = res.rows[0];

  // Cuántos referidos trajo
  const refsRes = await query(
    'SELECT COUNT(*) as c FROM waitlist WHERE referred_by_code = $1',
    [normalized]
  );
  const referralsCount = refsRes.rows[0].c as number;

  // Posición efectiva con boost
  const realPosition = row.position as number;
  const boost = referralsCount * REFERRAL_BOOST_PER_FRIEND;
  const effectivePosition = Math.max(1, realPosition - boost);
  const isEarlyAccessEffective = effectivePosition <= EARLY_ACCESS_LIMIT;
  const spotsToEarlyAccess = Math.max(0, effectivePosition - EARLY_ACCESS_LIMIT);

  // Próximo milestone
  const nextMilestone = MILESTONES.find(m => m > referralsCount) ?? null;
  const milestoneRemaining = nextMilestone ? nextMilestone - referralsCount : null;

  return {
    alias: row.alias,
    position: realPosition,
    effective_position: effectivePosition,
    referrals_count: referralsCount,
    referral_code: row.referral_code,
    referred_by_code: row.referred_by_code,
    is_early_access: isEarlyAccessEffective,
    spots_to_early_access: spotsToEarlyAccess,
    next_milestone: nextMilestone ? {
      at: nextMilestone,
      remaining: milestoneRemaining,
      bonus_positions: nextMilestone * REFERRAL_BOOST_PER_FRIEND,
    } : null,
    created_at: row.created_at,
  };
}
