import type { RefundResult } from "../payments";

export interface IdempotencyKeyRepository {
  find(key: string): Promise<{ result: RefundResult } | null>;
  save(key: string, result: RefundResult): Promise<void>;
}
