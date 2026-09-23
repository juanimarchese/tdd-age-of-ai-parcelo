import type { Pool, PoolClient } from "pg";
import type { Order } from "./Order";
import type { OrderRepository } from "./OrderRepository";

export const schemaSql = `
  CREATE TABLE IF NOT EXISTS orders (
    id   text PRIMARY KEY,
    data jsonb NOT NULL
  );
`;

export class PostgresOrderRepository implements OrderRepository {
  constructor(private readonly db: Pool | PoolClient) {}

  async save(order: Order): Promise<void> {
    await this.db.query(
      `INSERT INTO orders (id, data) VALUES ($1, $2)
       ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data`,
      [order.id, JSON.stringify(order)],
    );
  }

  async findById(id: string): Promise<Order | null> {
    const { rows } = await this.db.query(
      "SELECT data FROM orders WHERE id = $1",
      [id],
    );
    if (rows.length === 0) return null;
    const data = rows[0].data;
    return { ...data, createdAt: new Date(data.createdAt) };
  }
}
