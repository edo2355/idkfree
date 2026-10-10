import { randomBytes, randomUUID, createHash } from 'crypto';

export interface GeneratedCard {
  cardId: string;
  secretPanic: string;
  secretRestore: string;
  secretFenix: string;
}

export function generateCard(): GeneratedCard {
  const cardId = randomUUID();
  return {
    cardId,
    secretPanic: base32Encode(randomBytes(20)),
    secretRestore: base32Encode(randomBytes(20)),
    secretFenix: base32Encode(randomBytes(20)),
  };
}

export function generatePin(): string {
  // 4-8 dígitos, aquí: 4 dígitos
  const n = 1000 + (randomBytes(2).readUInt16BE(0) % 9000);
  return String(n);
}

export function buildQRPayload(cardId: string, secret: string, kind: 'panic' | 'restore' | 'fenix'): string {
  return `aldea:v1:${cardId}:${kind}:${secret}`;
}

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';

function base32Encode(buf: Buffer): string {
  let bits = 0, value = 0, output = '';
  for (let i = 0; i < buf.length; i++) {
    value = (value << 8) | buf[i];
    bits += 8;
    while (bits >= 5) { output += ALPHABET[(value >>> (bits - 5)) & 31]; bits -= 5; }
  }
  if (bits > 0) output += ALPHABET[(value << (5 - bits)) & 31];
  return output;
}
