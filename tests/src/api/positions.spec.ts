import { test, expect } from "@playwright/test";
test.describe.configure({ mode: 'serial' });
import { positionSchema } from "../helpers/schemas.js";
import { expectSchema } from "../helpers/assertions.js";
import { resetApi } from "../helpers/client.js";

test.describe("Positions", () => {
  test.beforeEach(async ({ request }) => {
    await resetApi(request);
  });

  test("Buying creates a position", async ({ request }) => {
    await request.post("/v1/orders", {
      data: { symbol: "NVDA", side: "buy", type: "market", qty: 3 }
    });

    const res = await request.get("/v1/positions");
    expect(res.status()).toBe(200);

    const positions = await res.json();
    expect(Array.isArray(positions)).toBe(true);
    expect(positions.length).toBe(1);

    expectSchema(positionSchema, positions[0]);
    expect(positions[0].symbol).toBe("NVDA");
    expect(positions[0].qty).toBe(3);
  });
});