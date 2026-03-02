import { test, expect } from "@playwright/test";

test("GET /healthz is OK", async ({ request, baseURL }) => {
  const res = await request.get(`${baseURL}/healthz`);
  expect(res.status()).toBe(200);
  await expect(res.json()).resolves.toEqual({ ok: true });
});
