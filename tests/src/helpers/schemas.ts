import Ajv from "ajv";

const ajv = new Ajv({ allErrors: true, strict: false });

export const accountSchema = {
  type: "object",
  required: ["account_id", "currency", "cash", "equity"],
  properties: {
    account_id: { type: "string" },
    currency: { const: "USD" },
    cash: { type: "number" },
    equity: { type: "number" }
  }
} as const;

export const orderSchema = {
  type: "object",
  required: ["id", "symbol", "side", "type", "qty", "status", "created_at"],
  properties: {
    id: { type: "string" },
    symbol: { type: "string" },
    side: { enum: ["buy", "sell"] },
    type: { enum: ["market", "limit"] },
    qty: { type: "number" },
    limit_price: { type: ["number", "null"] },
    status: { enum: ["new", "filled", "canceled", "rejected"] },
    created_at: { type: "string" }
  }
} as const;

export const positionSchema = {
  type: "object",
  required: ["symbol", "qty", "avg_entry_price", "market_price", "unrealized_pl"],
  properties: {
    symbol: { type: "string" },
    qty: { type: "number" },
    avg_entry_price: { type: "number" },
    market_price: { type: "number" },
    unrealized_pl: { type: "number" }
  }
} as const;

export function validate(schema: object, data: unknown): { ok: true } | { ok: false; errors: string[] } {
  const fn = ajv.compile(schema);
  const ok = fn(data);
  if (ok) return { ok: true };

  const errors = (fn.errors ?? []).map(e => `${e.instancePath || "/"} ${e.message ?? ""}`.trim());
  return { ok: false, errors };
}