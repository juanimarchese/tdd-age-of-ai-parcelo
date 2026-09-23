import type { OrderRepository } from "../orders";
import type { PaymentGateway } from "../payments";
import type { IdempotencyKeyRepository } from "./IdempotencyKeyRepository";

// Chapter 7: half of Priya's bug. One refund per idempotency key.
export class RefundService {
  constructor(
    private readonly orders: OrderRepository,
    private readonly gateway: PaymentGateway,
    private readonly idempotencyKeys: IdempotencyKeyRepository
  ) {}

  async refund(
    orderId: string,
    amountCents: number,
    key: string,
  ) {
    const existing = await this.idempotencyKeys.find(key);
    if (existing) return existing.result;

    const result = await this.gateway.refund(
      orderId,
      amountCents,
      key,
    );
    await this.idempotencyKeys.save(key, result);
    return result;
  }
}
