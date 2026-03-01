import express from "express";
import { createOrder, db, resetState } from "./data.js";
import type { OrderRequest } from "./types.js";

export const router = express.Router();

function requireApiKey(req: express.Request, res: express.Response, next: express.NextFunction) {
  const expected = process.env.API_KEY ?? "";
  const provided = req.header("x-api-key") ?? "";
  if (!expected || provided !== expected) {
    return res.status(401).json({ error: "unauthorized" });
  }
  next();
}

router.get("/healthz", (_req, res) => res.status(200).json({ ok: true }));

router.post("/__admin/reset", requireApiKey, (_req, res) => {
  resetState();
  res.status(200).json({ ok: true });
});

router.get("/v1/account", requireApiKey, (_req, res) => res.json(db.account));

router.get("/v1/orders", requireApiKey, (_req, res) => res.json(db.orders));

router.post("/v1/orders", requireApiKey, (req, res) => {
  const body = req.body as Partial<OrderRequest>;

  // Minimal validation to support negative tests
  if (!body.symbol || typeof body.symbol !== "string") return res.status(400).json({ error: "symbol required" });
  if (body.side !== "buy" && body.side !== "sell") return res.status(400).json({ error: "side invalid" });
  if (body.type !== "market" && body.type !== "limit") return res.status(400).json({ error: "type invalid" });
  if (!Number.isInteger(body.qty) || (body.qty ?? 0) <= 0) return res.status(400).json({ error: "qty invalid" });
  if (body.type === "limit" && typeof body.limit_price !== "number") return res.status(400).json({ error: "limit_price required" });

  const order = createOrder(body as OrderRequest);
  if (order.status === "rejected") return res.status(422).json({ error: "insufficient_funds" });

  res.status(201).json(order);
});

router.get("/v1/positions", requireApiKey, (_req, res) => {
  res.json(Object.values(db.positions));
});