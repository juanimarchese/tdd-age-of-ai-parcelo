import type { OrderItem } from "./Order";

export class OutOfStockError extends Error {
  constructor(readonly items: OrderItem[]) {
    super("out_of_stock");
    this.name = "OutOfStockError";
  }
}

export class PaymentDeclinedError extends Error {
  constructor(readonly providerRef: string) {
    super("payment_declined");
    this.name = "PaymentDeclinedError";
  }
}
