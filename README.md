# Parcelo

[![test](https://github.com/juanimarchese/tdd-age-of-ai-parcelo/actions/workflows/test.yml/badge.svg)](https://github.com/juanimarchese/tdd-age-of-ai-parcelo/actions/workflows/test.yml)

Companion code for the book *Test-Driven Development in the Age of AI: A Practical Guide for Software Engineers to Write Code That Works When Machines Write It Too* by Juan Ignacio Marchese. Parcelo is the order and checkout service for a small coffee roaster, the running example in every chapter. This repository holds the code as it stands at the end of the book, with the tests from the chapters ported in their final, refactored form.

TypeScript, Node, Vitest, fast-check. Money is integer cents everywhere. Discount rates are integer basis points (1000 = 10%, capped at 2000).

## Run it

```bash
npm install
npx tsc --noEmit   # strict type check
npx vitest run     # or: npm test
```

The whole suite runs offline. Tests that need Postgres are skipped unless `DATABASE_URL` is set (CI sets it, with a Postgres service):

```bash
docker run --rm -p 5432:5432 -e POSTGRES_PASSWORD=pg postgres:16
DATABASE_URL=postgres://postgres:pg@localhost:5432/postgres npm test
```

Mutation testing (Chapter 12) runs with StrykerJS against `src/pricing`. Every mutant is killed (100% mutation score). An HTML report is written to `reports/mutation/`:

```bash
npm run test:mutation
```

`stryker.config.json` points `tsconfigFile` at a file that doesn't exist on purpose. TypeScript 7 has no JavaScript API for Stryker's tsconfig step, and Vitest compiles the TypeScript anyway.

### Python sidebars

`python/` has the modules and tests behind every runnable Python sidebar: pytest and Hypothesis for the domain logic, a FastAPI app with a `ShopDriver` for Chapter 6's acceptance tests, and a SQLAlchemy repository with Testcontainers fixtures for Chapters 5 and 7.

```bash
cd python
pip install -r requirements.txt
python -m pytest -rs
```

The Postgres tests start a real `postgres:16` container through Testcontainers, so they need Docker. They're skipped without it. Set `DATABASE_URL` to use an existing database instead. CI runs them on every push.

## Chapter to file map

| Ch | Topic | Files |
|---|---|---|
| 1-2 | `lineTotal`, `discountFor`, basis points, cap, floor rounding | `src/pricing/lineTotal.ts`, `src/pricing/discountFor.ts` and their `.test.ts` |
| 3 | `anOrder()` test data builder | `src/testing/builders/anOrder.ts`, `src/pricing/discountFor.test.ts` |
| 4 | `PaymentGateway` port, Stripe adapter, `InMemoryOrderRepository`, spy test | `src/payments/`, `src/testing/fakes/InMemoryOrderRepository.ts`, `src/orders/orderService.test.ts` |
| 5 | Cart totals test | `test/cartTotals.test.ts` |
| 6 | Acceptance test, `ShopDriver`, walking skeleton, `deps` object, ports, `CatalogPricing`, `InMemoryInventory` | `test/acceptance/`, `src/app.ts`, `src/orders/`, `src/pricing/CatalogPricing.ts` |
| 7 | Contract tests, Postgres adapter, `app.inject` 404 test, MSW, `Clock`, `fakeDeps()`, `FakePaymentGateway`, `anOrderRequest()`, idempotent `RefundService` | `src/testing/orderRepositoryContract.ts`, `src/orders/PostgresOrderRepository*.ts`, `test/http.test.ts`, `src/payments/HttpPaymentGateway*.ts`, `src/clock.ts`, `src/testing/`, `src/refunds/RefundService*.ts` |
| 8 | Discount refactor (behavior test) | `src/pricing/discountFor.test.ts` |
| 9 | `calcTax` characterization and snapshot, sprout/wrap | `src/tax/` |
| 10 | `shippingCost` | `src/shipping/` |
| 11 | Weakened assertions, pinned back to real values | `src/pricing/discountFor.test.ts`, `src/shipping/shipping.test.ts`, `python/tests/test_mocking.py` |
| 12 | fast-check properties, `allocateDiscount` (largest remainder) | `test/*.properties.test.ts`, `src/refunds/allocateDiscount.ts`, `src/testing/arbitraries.ts` |
| 13 | Tax property, flaky-test quarantine | `src/tax/legacyTaxCalculator.test.ts`, `vitest.config.ts` |
| 14 | 30-day plan tests | `src/shipping/shipping.test.ts`, `src/orders/orderService.test.ts`, `test/pricing.properties.test.ts` |

## Where the repo differs from a chapter's snapshot

Chapters show code as it looked at that point in the story. Here, everything is in its final form:

- `OrderService` takes the full `deps` object (Chapter 7 adds `gateway` and `clock`), so Chapter 6's unit test spreads `fakeDeps()` for the collaborators it didn't know about yet.
- `OrderRequest` carries a `paymentToken`. The final `ShopDriver` adds a test token, so the acceptance tests still read like the ticket.
- Declined charges come back as `{ status: "declined" }` from every gateway adapter. `placeOrder` turns them into a `PaymentDeclinedError` and saves nothing. Transport failures throw.
- Chapter 7 starts Postgres with Testcontainers. This repo reads `DATABASE_URL` instead, so the default run needs no Docker.
- `buildApp` requires only `orders`. Collaborators you don't pass fail loudly if a route uses them.
- `StripeGateway` implements `charge` only, as in Chapter 4. A Stripe refund needs the PaymentIntent id, which `Order` doesn't store.
- `naiveAllocateDiscount` exists only so a test can show the Chapter 12 property failing against it.

## License

MIT. See [LICENSE](LICENSE). Use the code however you like, at work or in your own projects.
