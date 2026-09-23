import type {
  ChargeResult,
  PaymentGateway,
  RefundResult,
} from "../../payments";

export class FakePaymentGateway implements PaymentGateway {
  refundCallCount = 0;
  constructor(private readonly declines = false) {}

  async charge(): Promise<ChargeResult> {
    return {
      status: this.declines ? "declined" : "approved",
      providerRef: "ch_fake",
    };
  }

  async refund(orderId: string): Promise<RefundResult> {
    this.refundCallCount++;
    return { status: "refunded", providerRef: `re_${orderId}` };
  }
}
