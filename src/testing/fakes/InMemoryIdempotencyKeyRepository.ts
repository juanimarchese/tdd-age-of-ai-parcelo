import type { RefundResult } from "../../payments";
import type { IdempotencyKeyRepository } from "../../refunds";

export class InMemoryIdempotencyKeyRepository
  implements IdempotencyKeyRepository
{
  private results = new Map<string, RefundResult>();

  async find(key: string) {
    const result = this.results.get(key);
    return result ? { result: structuredClone(result) } : null;
  }

  async save(key: string, result: RefundResult) {
    if (this.results.has(key)) {
      throw new Error(`duplicate idempotency key ${key}`);
    }
    this.results.set(key, structuredClone(result));
  }
}
