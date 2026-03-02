import { test, expect } from "@playwright/test";
import { accountSchema } from "../helpers/schemas.js";
import { expectSchema } from "../helpers/assertions.js";
import { resetApi } from "../helpers/client.js";

test.describe("Account", () => {
  test.beforeEach(async ({ request }) => {
    await resetApi(request);
  });

  test("GET /v1/account returns account schema", async ({ request }) => {
    const res = await request.get("/v1/account");
    expect(res.status()).toBe(200);

    const body = await res.json();
    expectSchema(accountSchema, body);

    expect(body.cash).toBe(100000);
    expect(body.equity).toBe(100000);
  });

  test("Missing api key -> 401", async ({ baseURL }) => {
    const res = await fetch(`${baseURL}/v1/account`);
    expect(res.status).toBe(401);
  });
});
