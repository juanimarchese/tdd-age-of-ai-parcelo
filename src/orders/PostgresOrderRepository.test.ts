import { Pool, type PoolClient } from "pg";
import {
  afterAll,
  afterEach,
  beforeAll,
  beforeEach,
  describe,
} from "vitest";
import { orderRepositoryContractTests } from "../testing/orderRepositoryContract";
import {
  PostgresOrderRepository,
  schemaSql,
} from "./PostgresOrderRepository";

// Chapter 7. The book starts Postgres with Testcontainers; this
// repo reads DATABASE_URL instead so the suite runs offline.
// Start one with Docker to run it:
//   docker run --rm -p 5432:5432 -e POSTGRES_PASSWORD=pg postgres:16
//   DATABASE_URL=postgres://postgres:pg@localhost:5432/postgres npm test
describe.skipIf(!process.env.DATABASE_URL)("PostgresOrderRepository", () => {
  let pool: Pool;
  let client: PoolClient;

  beforeAll(async () => {
    pool = new Pool({ connectionString: process.env.DATABASE_URL });
    await pool.query(schemaSql);
  });

  afterAll(async () => {
    await pool.end();
  });

  beforeEach(async () => {
    client = await pool.connect();
    await client.query("BEGIN");
  });

  afterEach(async () => {
    await client.query("ROLLBACK");
    client.release();
  });

  orderRepositoryContractTests(
    async () => new PostgresOrderRepository(client),
  );
});
