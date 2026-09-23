// src/testing/fakes/InMemoryOrderRepository.ts
import { OrderRepository } from "../../orders/OrderRepository";
import { Order } from "../../orders/Order";

export class InMemoryOrderRepository
  implements OrderRepository
{
  private orders = new Map<string, Order>();

  async save(order: Order): Promise<void> {
    this.orders.set(order.id, structuredClone(order));
  }

  async findById(id: string): Promise<Order | null> {
    const order = this.orders.get(id);
    return order ? structuredClone(order) : null;
  }

  async findAll(): Promise<Order[]> {
    return [...this.orders.values()].map((o) =>
      structuredClone(o),
    );
  }
}
