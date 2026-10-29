// backend/src/services/sanctionsService.ts
// Screening local contra OFAC SDN. Carga CSV a memoria. Sin DB, sin API.
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { env } from '../config/env.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SDN_PATH = join(__dirname, '..', '..', 'data', 'sanctions', 'sdn.csv');

interface SdnEntry { entNum: string; name: string; nameNorm: string; program: string; }

let _cache: SdnEntry[] | null = null;

function normalize(s: string): string {
  return s.toLowerCase().normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ').trim();
}

function parseCsvLine(line: string): string[] {
  const out: string[] = [];
  let cur = '';
  let inQ = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (inQ) {
      if (c === '"') {
        if (line[i + 1] === '"') { cur += '"'; i++; }
        else inQ = false;
      } else cur += c;
    } else {
      if (c === '"') inQ = true;
      else if (c === ',') { out.push(cur); cur = ''; }
      else cur += c;
    }
  }
  out.push(cur);
  return out;
}

function load(): SdnEntry[] {
  if (_cache) return _cache;
  const raw = readFileSync(SDN_PATH, 'utf8');
  const lines = raw.split(/\r?\n/);
  const out: SdnEntry[] = [];
  for (const line of lines) {
    if (!line.trim()) continue;
    const cols = parseCsvLine(line);
    if (cols.length < 4) continue;
    const [entNum, name, , program] = cols;
    if (!name || !entNum) continue;
    out.push({
      entNum: entNum.trim(),
      name: name.trim(),
      nameNorm: normalize(name),
      program: program.trim(),
    });
  }
  _cache = out;
  return out;
}

function similarity(a: string, b: string): number {
  const A = normalize(a), B = normalize(b);
  if (!A || !B) return 0;
  if (A === B) return 1;
  if (A.includes(B) || B.includes(A)) return 0.9;
  const ta = new Set(A.split(' ').filter(x => x.length > 1));
  const tb = new Set(B.split(' ').filter(x => x.length > 1));
  if (!ta.size || !tb.size) return 0;
  const inter = [...ta].filter(x => tb.has(x)).length;
  return inter / new Set([...ta, ...tb]).size;
}

export interface ScreenInput { name: string; birthDate?: string; nationality?: string; }
export interface SanctionsMatch { id: string; caption: string; score: number; topics: string[]; datasets: string[]; }
export interface ScreenResult {
  verdict: 'clear' | 'review' | 'blocked';
  score: number;
  matches: SanctionsMatch[];
  bestMatch: string | null;
}

export async function screenPerson(input: ScreenInput): Promise<ScreenResult> {
  const name = input.name.trim();
  if (!name) return { verdict: 'clear', score: 0, matches: [], bestMatch: null };

  const entries = load();
  const tokens = normalize(name).split(' ').filter(t => t.length > 2);
  if (!tokens.length) return { verdict: 'clear', score: 0, matches: [], bestMatch: null };

  const mainTokens = tokens.slice(0, 3);
  const candidates = entries.filter(e => mainTokens.some(t => e.nameNorm.includes(t)));

  const scored = candidates
    .map(e => ({
      id: e.entNum, caption: e.name,
      score: similarity(name, e.name),
      topics: e.program ? [`sanction:${e.program}`] : ['sanction'],
      datasets: ['us_ofac_sdn'],
    }))
    .filter(m => m.score >= 0.5)
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);

  const best = scored[0];
  const score = best?.score ?? 0;

  let verdict: ScreenResult['verdict'] = 'clear';
  if (score >= env.sanctionsBlockThreshold) verdict = 'blocked';
  else if (score >= env.sanctionsReviewThreshold) verdict = 'review';

  return { verdict, score, matches: scored, bestMatch: best?.id ?? null };
}
