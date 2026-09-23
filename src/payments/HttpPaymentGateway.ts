// Chapter 7: a gateway spoken to over plain HTTP, tested with MSW.
import type {
  ChargeResult,
  PaymentGateway,
  RefundResult,
} from "./PaymentGateway";

export class HttpPaymentGateway implements PaymentGateway {
  constructor(private readonly baseUrl: string) {}

  async charge(
    amountCents: number,
    token: string,
  ): Promise<ChargeResult> {
    const res = await this.post("/charges", { amountCents, token });
    const body = (await res.json()) as { id?: string };
    // A decline is an answer, not a crash (see Chapter 4).
    if (res.status === 402) {
      return { status: "declined", providerRef: body.id ?? "" };
    }
    if (!res.ok) throw new Error(`charge failed: ${res.status}`);
    return { status: "approved", providerRef: body.id ?? "" };
  }

  async refund(
    orderId: string,
    amountCents: number,
    idempotencyKey: string,
  ): Promise<RefundResult> {
    const res = await this.post(
      "/refunds",
      { orderId, amountCents },
      { "Idempotency-Key": idempotencyKey },
    );
    if (!res.ok) throw new Error(`refund failed: ${res.status}`);
    const body = (await res.json()) as { id: string };
    return { status: "refunded", providerRef: body.id };
  }

  private post(
    path: string,
    payload: unknown,
    headers: Record<string, string> = {},
  ) {
    return fetch(`${this.baseUrl}${path}`, {
      method: "POST",
      headers: { "content-type": "application/json", ...headers },
      body: JSON.stringify(payload),
    });
  }
}
