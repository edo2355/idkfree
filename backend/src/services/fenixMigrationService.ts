import { query, uuid } from '../db/pool.js';
import { hashPassword } from '../crypto/password.js';

export async function migrateAccount(oldUserId: string, newEmail: string, newPassword: string) {
  // 1. Verificar que el nuevo email no exista
  const existing = await query('SELECT id FROM users WHERE email = ?', [newEmail.toLowerCase().trim()]);
  if (existing.rows.length > 0) throw new Error('EMAIL_TAKEN');

  const newUserId = uuid();
  const hashedPassword = await hashPassword(newPassword);

  // 2. Crear el nuevo usuario
  await query(
    `INSERT INTO users (id, email, password_hash, alias, name, is_phone_verified)
     SELECT ?, ?, ?, alias || '_new', name, is_phone_verified FROM users WHERE id = ?`,
    [newUserId, newEmail.toLowerCase().trim(), hashedPassword, oldUserId]
  );

  // 3. Migrar los datos (Posts, Vibes, Catálogo, Seguidores)
  await query('UPDATE posts SET user_id = ? WHERE user_id = ?', [newUserId, oldUserId]);
  await query('UPDATE vibes SET user_id = ? WHERE user_id = ?', [newUserId, oldUserId]);
  await query('UPDATE catalog_items SET user_id = ? WHERE user_id = ?', [newUserId, oldUserId]);
  
  // Migrar seguidores (evitando duplicados)
  await query('UPDATE IGNORE follows SET follower_id = ? WHERE follower_id = ?', [newUserId, oldUserId]);
  await query('UPDATE IGNORE follows SET following_id = ? WHERE following_id = ?', [newUserId, oldUserId]);

  // 4. Borrar / Marcar la cuenta vieja
  await query('UPDATE users SET deleted_at = CURRENT_TIMESTAMP, email = ? WHERE id = ?', [`hacked_${Date.now()}_${newEmail}`, oldUserId]);

  // 5. Registrar la migración
  await query(
    `INSERT INTO fenix_migrations (id, old_user_id, new_user_id, old_email, new_email, migrated_at) 
     SELECT ?, ?, ?, email, ?, ? FROM users WHERE id = ?`,
    [uuid(), oldUserId, newUserId, newEmail, new Date().toISOString(), oldUserId]
  );

  return { newUserId, newEmail, message: 'Cuenta migrada exitosamente al nuevo usuario.' };
}
