import type { Account, Order, Position, OrderRequest } from "./types.js";

export const db = {
  account: <Account>{
    account_id: "acct_123",
    currency: "USD",
    cash: 100000,
    equity: 100000
  },
  orders: <Order[]>[],
  positions: <Record<string, Position>>{}
};

let orderSeq = 1;

export function resetState() {
  db.account.cash = 100000;
  db.account.equity = 100000;
  db.orders.length = 0;
  db.positions = {};
  orderSeq = 1;
}

export function createOrder(req: OrderRequest): Order {
  const now = new Date().toISOString();

  const order: Order = {
    id: `ord_${orderSeq++}`,
    symbol: req.symbol,
    side: req.side,
    type: req.type,
    qty: req.qty,
    limit_price: req.limit_price,
    status: "new",
    created_at: now
  };

  // Simple fill logic for demo:
  // - market orders fill immediately at market_price=100
  // - limit orders fill if buy and limit_price >= 100, sell if limit_price <= 100
  const marketPrice = 100;

  const fillable =
    req.type === "market" ||
    (req.type === "limit" &&
      typeof req.limit_price === "number" &&
      ((req.side === "buy" && req.limit_price >= marketPrice) ||
        (req.side === "sell" && req.limit_price <= marketPrice)));

  if (fillable) {
    order.status = "filled";
    applyFill(order, marketPrice);
  }

  db.orders.unshift(order);
  return order;
}

function applyFill(order: Order, fillPrice: number) {
  const cost = order.qty * fillPrice;

  if (order.side === "buy") {
    if (db.account.cash < cost) {
      order.status = "rejected";
      return;
    }
    db.account.cash -= cost;
  } else {
    // allow short for demo; no constraints
    db.account.cash += cost;
  }

  db.account.equity = db.account.cash; // simplistic for demo

  const existing = db.positions[order.symbol];
  const signedQty = order.side === "buy" ? order.qty : -order.qty;

  if (!existing) {
    db.positions[order.symbol] = {
      symbol: order.symbol,
      qty: signedQty,
      avg_entry_price: fillPrice,
      market_price: fillPrice,
      unrealized_pl: 0
    };
    return;
  }

  const newQty = existing.qty + signedQty;
  const weighted =
    newQty === 0
      ? 0
      : (existing.avg_entry_price * existing.qty + fillPrice * signedQty) / newQty;

  db.positions[order.symbol] = {
    ...existing,
    qty: newQty,
    avg_entry_price: newQty === 0 ? 0 : Math.abs(weighted),
    market_price: fillPrice,
    unrealized_pl: 0
  };
}