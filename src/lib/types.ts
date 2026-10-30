// Shapes mirror the planned Supabase tables (products, product_variants, orders, order_items).
export interface ColorOption { name: string; hex: string }
export interface Product {
  id: string;
  slug: string;
  name: string;
  brand: string;
  category: "Lifestyle" | "Running" | "Court" | "High-top";
  price: number;
  description: string;
  images: string[];
  colors: ColorOption[];
  /** stock per EU size */
  stock: Record<string, number>;
  featured?: boolean;
  createdAt: string;
}
export interface CartItem { productId: string; size: string; color: string; qty: number }
export type OrderStatus = "pending" | "confirmed" | "shipping" | "delivered" | "cancelled";
export interface Order {
  id: string;
  createdAt: string;
  customer: { name: string; phone: string; address: string; note?: string };
  items: (CartItem & { name: string; price: number; image: string })[];
  subtotal: number;
  shipping: number;
  total: number;
  payment: "COD";
  status: OrderStatus;
}
