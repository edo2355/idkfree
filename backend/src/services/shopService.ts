import { query } from '../db/pool.js';
import { randomUUID } from 'crypto';

export async function createProduct(sellerId: string, title: string, price: number, stock: number) {
  const id = randomUUID();
  await query(
    `INSERT INTO shop_products (id, seller_id, title, price, stock) VALUES ($1, $2, $3, $4, $5)`,
    [id, sellerId, title, price, stock]
  );
  return { id, title, price, stock };
}

export async function getProducts() {
  const res = await query(`SELECT * FROM shop_products WHERE stock > 0 ORDER BY created_at DESC`);
  return res.rows;
}
