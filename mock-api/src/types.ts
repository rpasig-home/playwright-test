export type OrderSide = "buy" | "sell";
export type OrderType = "market" | "limit";
export type OrderStatus = "new" | "filled" | "canceled" | "rejected";

export interface Account {
  account_id: string;
  currency: "USD";
  cash: number;
  equity: number;
}

export interface OrderRequest {
  symbol: string;      // e.g., "AAPL"
  side: OrderSide;     // buy/sell
  type: OrderType;     // market/limit
  qty: number;         // integer
  limit_price?: number;
}

export interface Order {
  id: string;
  symbol: string;
  side: OrderSide;
  type: OrderType;
  qty: number;
  limit_price?: number;
  status: OrderStatus;
  created_at: string;
}

export interface Position {
  symbol: string;
  qty: number;
  avg_entry_price: number;
  market_price: number;
  unrealized_pl: number;
}