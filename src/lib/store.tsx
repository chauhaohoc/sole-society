import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { sampleOrders, sampleProducts, shippingFor } from "./sample-data";
import type { CartItem, Order, OrderStatus, Product } from "./types";

/**
 * Demo data layer. Everything is kept in the browser (localStorage) until
 * Supabase is connected — swap these functions for Supabase queries then.
 */
const KEY = "lx-store-v1";
interface State { products: Product[]; orders: Order[]; cart: CartItem[]; admin: boolean }
const initial: State = { products: sampleProducts, orders: sampleOrders, cart: [], admin: false };

// Demo-only credentials. Replace with Supabase Auth + an admin role check.
export const DEMO_ADMIN = { email: "admin@luxestride.vn", password: "admin123" };

interface Ctx extends State {
  ready: boolean;
  addToCart: (i: CartItem) => void;
  updateQty: (idx: number, qty: number) => void;
  removeFromCart: (idx: number) => void;
  placeOrder: (c: Order["customer"]) => Order;
  saveProduct: (p: Product) => void;
  deleteProduct: (id: string) => void;
  setOrderStatus: (id: string, s: OrderStatus) => void;
  login: (email: string, pw: string) => boolean;
  logout: () => void;
}
const StoreCtx = createContext<Ctx | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<State>(initial);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    try { const raw = localStorage.getItem(KEY); if (raw) setState({ ...initial, ...JSON.parse(raw) }); } catch {}
    setReady(true);
  }, []);
  useEffect(() => { if (ready) localStorage.setItem(KEY, JSON.stringify(state)); }, [state, ready]);

  const set = (fn: (s: State) => Partial<State>) => setState((s) => ({ ...s, ...fn(s) }));

  const value: Ctx = {
    ...state, ready,
    addToCart: (i) => set((s) => {
      const idx = s.cart.findIndex((c) => c.productId === i.productId && c.size === i.size && c.color === i.color);
      if (idx < 0) return { cart: [...s.cart, i] };
      const cart = s.cart.map((c, k) => (k === idx ? { ...c, qty: c.qty + i.qty } : c)); return { cart };
    }),
    updateQty: (idx, qty) => set((s) => ({ cart: s.cart.map((c, i) => (i === idx ? { ...c, qty: Math.max(1, qty) } : c)) })),
    removeFromCart: (idx) => set((s) => ({ cart: s.cart.filter((_, i) => i !== idx) })),
    placeOrder: (customer) => {
      const items = state.cart.map((c) => {
        const p = state.products.find((x) => x.id === c.productId)!;
        return { ...c, name: p.name, price: p.price, image: p.images[0] ?? "" };
      });
      const subtotal = items.reduce((a, i) => a + i.price * i.qty, 0);
      const shipping = shippingFor(subtotal);
      const order: Order = { id: "LX-" + Math.floor(10000 + Math.random() * 89999), createdAt: new Date().toISOString(),
        customer, items, subtotal, shipping, total: subtotal + shipping, payment: "COD", status: "pending" };
      set((s) => ({
        orders: [order, ...s.orders], cart: [],
        products: s.products.map((p) => {
          const mine = items.filter((i) => i.productId === p.id);
          if (!mine.length) return p;
          const stock = { ...p.stock };
          mine.forEach((i) => (stock[i.size] = Math.max(0, (stock[i.size] ?? 0) - i.qty)));
          return { ...p, stock };
        }),
      }));
      return order;
    },
    saveProduct: (p) => set((s) => ({ products: s.products.some((x) => x.id === p.id) ? s.products.map((x) => (x.id === p.id ? p : x)) : [p, ...s.products] })),
    deleteProduct: (id) => set((s) => ({ products: s.products.filter((p) => p.id !== id) })),
    setOrderStatus: (id, status) => set((s) => ({ orders: s.orders.map((o) => (o.id === id ? { ...o, status } : o)) })),
    login: (email, pw) => {
      const ok = email.trim().toLowerCase() === DEMO_ADMIN.email && pw === DEMO_ADMIN.password;
      if (ok) set(() => ({ admin: true }));
      return ok;
    },
    logout: () => set(() => ({ admin: false })),
  };
  return <StoreCtx.Provider value={value}>{children}</StoreCtx.Provider>;
}

export function useStore() {
  const c = useContext(StoreCtx);
  if (!c) throw new Error("useStore must be inside StoreProvider");
  return c;
}
export const totalStock = (p: Product) => Object.values(p.stock).reduce((a, b) => a + b, 0);
