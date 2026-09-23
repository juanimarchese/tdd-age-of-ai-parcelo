export interface ChargeResult {
  status: "approved" | "declined";
  providerRef: string;
}

export interface RefundResult {
  status: "refunded";
  providerRef: string;
}

export interface PaymentGateway {
  charge(
    amountCents: number,
    token: string,
  ): Promise<ChargeResult>;
  refund(
    orderId: string,
    amountCents: number,
    idempotencyKey: string,
  ): Promise<RefundResult>;
}
