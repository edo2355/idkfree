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
 * Acepta Buffer, Uint8Array, ArrayBuffer (libSQL) o string.
 */
export async function verifyPin(hash: any, pin: string): Promise<boolean> {
  try {
    if (!hash) return false;
    
    let hashStr: string;
    
    // Caso 1: Buffer de Node.js
    if (Buffer.isBuffer(hash)) {
      hashStr = hash.toString('utf-8');
    }
    // Caso 2: Uint8Array (node:buffer Uint8Array)
    else if (hash instanceof Uint8Array) {
      hashStr = Buffer.from(hash).toString('utf-8');
    }
    // Caso 3: ArrayBuffer (libSQL devuelve esto)
    else if (hash instanceof ArrayBuffer) {
      hashStr = Buffer.from(new Uint8Array(hash)).toString('utf-8');
    }
    // Caso 4: string (legacy)
    else if (typeof hash === 'string') {
      hashStr = hash;
    }
    // Caso 5: Array de bytes
    else if (Array.isArray(hash)) {
      hashStr = Buffer.from(hash).toString('utf-8');
    }
    // Caso 6: Objeto tipo {0: byte, 1: byte...}
    else if (typeof hash === 'object' && hash.length !== undefined) {
      hashStr = Buffer.from(hash).toString('utf-8');
    }
    // Caso 7: Objeto con Symbol.iterator
    else if (typeof hash === 'object' && typeof hash[Symbol.iterator] === 'function') {
      hashStr = Buffer.from(Array.from(hash)).toString('utf-8');
    }
    else {
      console.error('[verifyPin] Tipo no soportado:', Object.prototype.toString.call(hash), typeof hash);
      return false;
    }
    
    // Sanity check: el hash bcrypt siempre empieza con $2a$, $2b$ o $2y$
    if (!hashStr.startsWith('$2')) {
      console.error('[verifyPin] Hash no es bcrypt válido. Primeros 20 chars:', hashStr.substring(0, 20));
      return false;
    }
    
    return await bcrypt.compare(pin, hashStr);
  } catch (e) {
    console.error('[verifyPin] Excepción:', e);
    return false;
  }
}
