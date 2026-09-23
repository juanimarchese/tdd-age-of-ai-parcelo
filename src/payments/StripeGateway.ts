// Chapter 4: the one file that knows Stripe's shape.
import type Stripe from "stripe";
import type { ChargeResult, PaymentGateway } from "./PaymentGateway";

// Chapter 4's adapter covers charge only. A Stripe refund needs the
// PaymentIntent id, which Parcelo's Order doesn't store yet.
// ponytail: add refund once orders keep the charge's providerRef.
export class StripeGateway implements Pick<PaymentGateway, "charge"> {
  constructor(private readonly stripe: Stripe) {}

  async charge(
    amountCents: number,
    token: string,
  ): Promise<ChargeResult> {
    const intent = await this.stripe.paymentIntents.create({
      amount: amountCents,
      currency: "usd",
      payment_method: token,
      confirm: true,
    });
    return {
      status: intent.status === "succeeded"
        ? "approved"
        : "declined",
      providerRef: intent.id,
    };
  }
}
