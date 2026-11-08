import bcrypt from 'bcryptjs';

const ROUNDS = 10;

export function validatePin(pin: string): void {
  if (!/^\d{4,8}$/.test(pin)) {
    throw new Error('El PIN debe tener entre 4 y 8 dígitos');
  }
}

export async function hashPin(pin: string): Promise<Buffer> {
  const hash = await bcrypt.hash(pin, ROUNDS);
  return Buffer.from(hash, 'utf-8');
}

/**
 * Verifica un PIN contra un hash almacenado.
 * Acepta Buffer, Uint8Array (como devuelve libSQL) o string.
 */
export async function verifyPin(hash: any, pin: string): Promise<boolean> {
  try {
    let hashStr: string;
    
    if (Buffer.isBuffer(hash)) {
      hashStr = hash.toString('utf-8');
    } else if (hash instanceof Uint8Array) {
      hashStr = Buffer.from(hash).toString('utf-8');
    } else if (typeof hash === 'string') {
      hashStr = hash;
    } else {
      console.warn('[verifyPin] Tipo de hash desconocido:', typeof hash);
      return false;
    }
    
    return await bcrypt.compare(pin, hashStr);
  } catch (e) {
    console.error('[verifyPin] Error:', e);
    return false;
  }
}
