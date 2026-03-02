import { test, expect } from "@playwright/test";
test.describe.configure({ mode: 'serial' });
import { orderSchema, accountSchema } from "../helpers/schemas.js";
import { expectSchema } from "../helpers/assertions.js";
import { resetApi } from "../helpers/client.js";

test.describe("Orders", () => {
  test.beforeEach(async ({ request }) => {
    await resetApi(request);
  });

  test("POST market buy fills and reduces cash", async ({ request }) => {
    const before = await (await request.get("/v1/account")).json();
    const ordersBefore = await (await request.get("/v1/orders")).json();
    console.log("Before buy: cash=", before.cash, "orders=", ordersBefore.length);
    if (ordersBefore.length > 0) {
      console.log("Orders before buy:", ordersBefore);
    }
    expectSchema(accountSchema, before);

    const res = await request.post("/v1/orders", {
      data: { symbol: "AAPL", side: "buy", type: "market", qty: 10 }
    });
    console.log("Order POST status:", res.status());
    const order = await res.json();
    console.log("Order response:", order);
    expect(res.status()).toBe(201);
    expectSchema(orderSchema, order);
    expect(order.status).toBe("filled");

    const after = await (await request.get("/v1/account")).json();
    const ordersAfter = await (await request.get("/v1/orders")).json();
    console.log("After buy: cash=", after.cash, "orders=", ordersAfter.length);
    expect(after.cash).toBe(before.cash - 10 * 100);
  });

  test("POST limit buy with too-low price stays new", async ({ request }) => {
    const res = await request.post("/v1/orders", {
      data: { symbol: "MSFT", side: "buy", type: "limit", qty: 5, limit_price: 90 }
    });
    expect(res.status()).toBe(201);

    const order = await res.json();
    expect(order.status).toBe("new");
  });

  test("Bad payload -> 400", async ({ request }) => {
    const res = await request.post("/v1/orders", {
      data: { symbol: "AAPL", side: "buy", type: "market", qty: 0 }
    });
    expect(res.status()).toBe(400);
  });

  test("GET /v1/orders returns most recent first", async ({ request }) => {
    await request.post("/v1/orders", { data: { symbol: "AAPL", side: "buy", type: "market", qty: 1 } });
    await request.post("/v1/orders", { data: { symbol: "TSLA", side: "buy", type: "market", qty: 1 } });

    const res = await request.get("/v1/orders");
    expect(res.status()).toBe(200);

    const orders = await res.json();
    expect(Array.isArray(orders)).toBe(true);
    expect(orders[0].symbol).toBe("TSLA");
    expect(orders[1].symbol).toBe("AAPL");
  });
});