import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import { afterAll, beforeAll, expect, it } from "vitest";
import { HttpPaymentGateway } from "./HttpPaymentGateway";

// Chapter 7: a stub server, not a mocked fetch.
const server = setupServer(
  http.post("https://api.gateway.test/charges", () =>
    HttpResponse.json({ status: "declined" }, { status: 402 })
  )
);

beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
afterAll(() => server.close());

const gateway = new HttpPaymentGateway("https://api.gateway.test");

it("maps a 402 response to a declined charge", async () => {
  await expect(gateway.charge(2500, "tok_test"))
    .resolves.toMatchObject({ status: "declined" });
});

it("throws when the gateway itself fails", async () => {
  server.use(
    http.post("https://api.gateway.test/charges", () =>
      HttpResponse.json({}, { status: 503 })
    ),
  );
  await expect(gateway.charge(2500, "tok_test"))
    .rejects.toThrow("503");
});
