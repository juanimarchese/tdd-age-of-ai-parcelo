import type { OrderItem, OrderRequest } from "./Order";

export interface PricingPolicy {
  quote(request: OrderRequest): Promise<{ totalCents: number }>;
}

export interface Inventory {
  tryReserve(items: OrderItem[]): Promise<boolean>;
}
