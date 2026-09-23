export interface OrderItem {
  sku: string;
  quantity: number;
}

export interface OrderRequest {
  customerId: string;
  items: OrderItem[];
  paymentToken: string;
}

export interface Order {
  id: string;
  customerId: string;
  items: OrderItem[];
  status: "placed";
  totalCents: number;
  createdAt: Date;
}
