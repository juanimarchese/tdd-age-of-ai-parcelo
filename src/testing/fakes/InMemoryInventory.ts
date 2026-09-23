import type { Inventory, OrderItem } from "../../orders";

// Chapter 6: counts bags by SKU. Grams and batches are the real
// warehouse adapter's problem, not the caller's.
export class InMemoryInventory implements Inventory {
  private bags = new Map<string, number>();

  stock(sku: string, bags: number) {
    this.bags.set(sku, bags);
  }

  async tryReserve(items: OrderItem[]): Promise<boolean> {
    const short = items.some(
      (i) => (this.bags.get(i.sku) ?? 0) < i.quantity,
    );
    if (short) return false;
    for (const i of items) {
      this.bags.set(i.sku, this.bags.get(i.sku)! - i.quantity);
    }
    return true;
  }
}
