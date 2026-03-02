import { expect, request, type APIRequestContext } from "@playwright/test";

export async function newClient(baseURL: string, apiKey: string): Promise<APIRequestContext> {
  const ctx = await request.newContext({
    baseURL,
    extraHTTPHeaders: {
      "x-api-key": apiKey,
      "content-type": "application/json"
    }
  });
  return ctx;
}

export async function resetApi(ctx: APIRequestContext) {
  const res = await ctx.post("/__admin/reset");
  console.log("resetApi status:", res.status());
  if (res.status() !== 200) {
    const body = await res.text();
    console.error("resetApi failed:", body);
  }
  expect(res.status(), "reset should succeed").toBe(200);
}