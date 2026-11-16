import { query } from '../db/pool.js';
import { randomUUID } from 'crypto';

export async function getProducts(filters: any = {}) {
  let sql = `
    SELECT p.*, u.alias as seller_alias 
    FROM shop_products p
    LEFT JOIN users u ON p.seller_id = u.id
    WHERE p.stock > 0
  `;
  const params = [];
  
  if (filters.category && filters.category !== 'all') {
    sql += ` AND p.category = $${params.length + 1}`;
    params.push(filters.category);
  }
  if (filters.type && filters.type !== 'all') {
    sql += ` AND p.product_type = $${params.length + 1}`;
    params.push(filters.type);
  }
  
  sql += ' ORDER BY p.is_featured DESC, p.created_at DESC';
  const res = await query(sql, params);
  return res.rows;
}

export async function createProduct(sellerId: string, data: any) {
  const id = randomUUID();
  await query(
    `INSERT INTO shop_products (id, seller_id, title, description, price, stock, image_url, category, product_type, discount_price) 
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
    [id, sellerId, data.title, data.description, data.price, data.stock, data.image_url, data.category, data.product_type, data.discount_price || null]
  );
  return { id, title: data.title };
}

export async function updateProduct(id: string, sellerId: string, data: any) {
  await query(
    `UPDATE shop_products SET title = $1, description = $2, price = $3, stock = $4, category = $5, product_type = $6, discount_price = $7 
     WHERE id = $8 AND seller_id = $9`,
    [data.title, data.description, data.price, data.stock, data.category, data.product_type, data.discount_price, id, sellerId]
  );
  return { success: true };
}

export async function deleteProduct(id: string, sellerId: string) {
  await query(`DELETE FROM shop_products WHERE id = $1 AND seller_id = $2`, [id, sellerId]);
  return { success: true };
}
