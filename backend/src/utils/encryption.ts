import crypto from 'node:crypto';

// Usamos el CARD_SECRET de Render para derivar una llave de 32 bytes
const CARD_SECRET = process.env.CARD_SECRET || 'clave_fallback_de_desarrollo_muy_insegura';
// Derivamos la llave con scrypt para hacerla criptográficamente fuerte
const KEY = crypto.scryptSync(CARD_SECRET, 'idk_salt_2026', 32);

export function encrypt(text: string): string {
  if (!text) return text;
  
  // Generamos un IV aleatorio de 12 bytes (ideal para GCM)
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', KEY, iv);
  
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  // Obtenemos el Auth Tag para asegurar que el mensaje no fue alterado
  const authTag = cipher.getAuthTag().toString('hex');
  
  // Retornamos IV + AuthTag + Texto Encriptado en un solo string separado por ":"
  return `${iv.toString('hex')}:${authTag}:${encrypted}`;
}

export function decrypt(encryptedText: string): string {
  if (!encryptedText) return encryptedText;
  
  try {
    const [ivHex, authTagHex, encryptedHex] = encryptedText.split(':');
    if (!ivHex || !authTagHex || !encryptedHex) return encryptedText; // Si no está encriptado, lo devolvemos tal cual
    
    const iv = Buffer.from(ivHex, 'hex');
    const authTag = Buffer.from(authTagHex, 'hex');
    const decipher = crypto.createDecipheriv('aes-256-gcm', KEY, iv);
    
    decipher.setAuthTag(authTag);
    
    let decrypted = decipher.update(encryptedHex, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  } catch (error) {
    console.error('❌ Error al desencriptar:', error);
    return encryptedText;
  }
}
