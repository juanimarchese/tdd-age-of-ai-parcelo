import type { Clock } from "../clock";
import type { IdGenerator } from "../ids";
import type { PaymentGateway } from "../payments";
import { OutOfStockError, PaymentDeclinedError } from "./errors";
import type { Order, OrderRequest } from "./Order";
import type { OrderRepository } from "./OrderRepository";
import type { Inventory, PricingPolicy } from "./ports";

// Chapter 6 builds the deps object; Chapter 7 adds gateway and clock.
export interface OrderServiceDeps {
  orders: OrderRepository;
  pricing: PricingPolicy;
  inventory: Inventory;
  gateway: PaymentGateway;
  clock: Clock;
  ids: IdGenerator;
}

export class OrderService {
  constructor(private readonly deps: OrderServiceDeps) {}

  async placeOrder(request: OrderRequest): Promise<Order> {
    const { totalCents } = await this.deps.pricing.quote(request);
    if (!(await this.deps.inventory.tryReserve(request.items))) {
      throw new OutOfStockError(request.items);
    }
    const charge = await this.deps.gateway.charge(
      totalCents,
      request.paymentToken,
    );
    if (charge.status === "declined") {
      throw new PaymentDeclinedError(charge.providerRef);
    }
    const order: Order = {
      id: this.deps.ids.next(),
      customerId: request.customerId,
      items: request.items,
      status: "placed",
      totalCents,
      createdAt: this.deps.clock.now(),
    };
    await this.deps.orders.save(order);
    return order;
  }
}
