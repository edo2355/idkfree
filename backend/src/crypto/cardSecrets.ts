// backend/src/crypto/cardSecrets.ts
// Cifrado AES-256-GCM para secretos de cards en reposo.
// Formato del BLOB: [IV 12B][AuthTag 16B][Ciphertext NB]
// Clave derivada de CARD_SECRET con scrypt (deterministic).
import { createCipheriv, createDecipheriv, randomBytes, scryptSync } from 'node:crypto';
import { env } from '../config/env.js';

const ALGO = 'aes-256-gcm';
const IV_LEN = 12;
const TAG_LEN = 16;
const SALT = 'nexo-card-v1';

const KEY = scryptSync(env.cardSecret, SALT, 32);

export function encryptSecret(plain: string): Buffer {
  if (!plain) throw new Error('encryptSecret: input vacío');
  const iv = randomBytes(IV_LEN);
  const cipher = createCipheriv(ALGO, KEY, iv);
  const enc = Buffer.concat([cipher.update(plain, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  return Buffer.concat([iv, tag, enc]);
}

export function decryptSecret(blob: Buffer | Uint8Array | null | undefined): string {
  if (!blob) throw new Error('decryptSecret: input null');
  const buf = Buffer.isBuffer(blob) ? blob : Buffer.from(blob);
  if (buf.length < IV_LEN + TAG_LEN) throw new Error('decryptSecret: blob muy corto');
  const iv = buf.subarray(0, IV_LEN);
  const tag = buf.subarray(IV_LEN, IV_LEN + TAG_LEN);
  const enc = buf.subarray(IV_LEN + TAG_LEN);
  const decipher = createDecipheriv(ALGO, KEY, iv);
  decipher.setAuthTag(tag);
  const dec = Buffer.concat([decipher.update(enc), decipher.final()]);
  return dec.toString('utf8');
}
