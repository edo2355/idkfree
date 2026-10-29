// backend/src/services/amlService.ts
import { query, uuid } from '../db/pool.js';
import { screenPerson, type SanctionsMatch } from './sanctionsService.js';

export type ScreeningContext = 'register' | 'diaspora_recharge' | 'manual';

export interface ScreenAndRecordInput {
  userId: string;
  context: ScreeningContext;
  name: string;
  birthDate?: string;
  nationality?: string;
}

export interface ScreenAndRecordResult {
  screeningId: string;
  verdict: 'clear' | 'review' | 'blocked' | 'error';
  score: number;
  matches: SanctionsMatch[];
  error?: string;
}

export async function screenAndRecord(
  input: ScreenAndRecordInput
): Promise<ScreenAndRecordResult> {
  const screeningId = uuid();
  let result;

  try {
    result = await screenPerson({
      name: input.name,
      birthDate: input.birthDate,
      nationality: input.nationality,
    });
  } catch (err: any) {
    await query(
      `INSERT INTO sanctions_screenings
       (id, user_id, context, query_name, query_birth, query_country,
        score, verdict, matches_json, provider, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, datetime('now'))`,
      [
        screeningId, input.userId, input.context, input.name,
        input.birthDate ?? null, input.nationality ?? null,
        0, 'error', JSON.stringify({ error: err.message }), 'ofac_sdn',
      ]
    );
    return { screeningId, verdict: 'error', score: 0, matches: [], error: err.message };
  }

  const datasetsHit = [...new Set(result.matches.flatMap((m) => m.datasets))];

  await query(
    `INSERT INTO sanctions_screenings
     (id, user_id, context, query_name, query_birth, query_country,
      score, verdict, datasets, matches_json, provider, provider_ref, created_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, datetime('now'))`,
    [
      screeningId, input.userId, input.context, input.name,
      input.birthDate ?? null, input.nationality ?? null,
      result.score, result.verdict,
      JSON.stringify(datasetsHit),
      JSON.stringify(result.matches),
      'ofac_sdn', result.bestMatch,
    ]
  );

  return { screeningId, ...result };
}

export async function isUserBlocked(userId: string): Promise<boolean> {
  const r = await query<{ id: string }>(
    `SELECT id FROM sanctions_screenings
     WHERE user_id = $1 AND verdict = 'blocked' AND reviewed_at IS NULL
     ORDER BY created_at DESC LIMIT 1`,
    [userId]
  );
  return r.rows.length > 0;
}

export async function resolveScreening(input: {
  screeningId: string;
  adminUserId: string;
  decision: 'clear' | 'blocked';
  notes?: string;
}): Promise<void> {
  await query(
    `UPDATE sanctions_screenings
     SET verdict = $1, reviewed_by = $2, reviewed_at = datetime('now'), review_notes = $3
     WHERE id = $4`,
    [input.decision, input.adminUserId, input.notes ?? null, input.screeningId]
  );
}
