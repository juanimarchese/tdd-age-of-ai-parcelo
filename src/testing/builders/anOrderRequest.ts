import type { OrderItem, OrderRequest } from "../../orders";

// Chapter 7: the request-shaped sibling of anOrder().
class OrderRequestBuilder {
  private request: OrderRequest = {
    customerId: "c-1",
    items: [{ sku: "ETHIOPIA-250", quantity: 1 }],
    paymentToken: "tok_test",
  };
  withItems(items: OrderItem[]) {
    this.request.items = items;
    return this;
  }
  build(): OrderRequest {
    return { ...this.request };
  }
}

export const anOrderRequest = () => new OrderRequestBuilder();
