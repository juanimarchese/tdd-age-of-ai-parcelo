import Fastify from "fastify";
import { SystemClock } from "./clock";
import { randomIds } from "./ids";
import {
  OrderService,
  OutOfStockError,
  PaymentDeclinedError,
  type OrderRequest,
  type OrderServiceDeps,
} from "./orders";

// Only `orders` is required, so Chapter 7's HTTP tests can pass
// just a repository. Unwired collaborators fail loudly if used.
// ponytail: swap the stand-ins for real adapters as they land.
export type AppDeps = Pick<OrderServiceDeps, "orders"> &
  Partial<OrderServiceDeps>;

const notWired = (name: string) => async (): Promise<never> => {
  throw new Error(`${name} is not wired`);
};

export function buildApp(deps: AppDeps) {
  const app = Fastify();
  const service = new OrderService({
    pricing: { quote: notWired("pricing") },
    inventory: { tryReserve: notWired("inventory") },
    gateway: {
      charge: notWired("gateway"),
      refund: notWired("gateway"),
    },
    clock: new SystemClock(),
    ids: randomIds,
    ...deps,
  });

  app.post("/orders", async (req, reply) => {
    try {
      const order = await service.placeOrder(
        req.body as OrderRequest,
      );
      return reply.code(201).send(order);
    } catch (err) {
      if (err instanceof OutOfStockError) {
        return reply.code(409).send({ reason: "out_of_stock" });
      }
      if (err instanceof PaymentDeclinedError) {
        return reply.code(402).send({ reason: "payment_declined" });
      }
      throw err;
    }
  });

  app.get<{ Params: { id: string } }>(
    "/orders/:id",
    async (req, reply) => {
      const order = await deps.orders.findById(req.params.id);
      if (!order) {
        return reply.code(404).send({ reason: "order_not_found" });
      }
      return order;
    },
  );

  return app;
}
