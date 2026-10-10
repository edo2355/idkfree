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

export async function verifyPin(hash: Buffer, pin: string): Promise<boolean> {
  try {
    return await bcrypt.compare(pin, hash.toString('utf-8'));
  } catch {
    return false;
  }
}
