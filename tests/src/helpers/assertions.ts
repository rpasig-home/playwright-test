import { expect } from "@playwright/test";
import { validate } from "./schemas.js";

export function expectSchema(schema: object, body: unknown) {
  const res = validate(schema, body);
  if (!res.ok) {
    throw new Error(`Schema validation failed:\n${res.errors.join("\n")}`);
  }
  expect(res.ok).toBe(true);
}