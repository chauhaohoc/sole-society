import type { OrderStatus } from "@/lib/types";

export const STATUSES: OrderStatus[] = ["pending", "confirmed", "shipping", "delivered", "cancelled"];
const style: Record<OrderStatus, string> = {
  pending: "bg-secondary text-foreground",
  confirmed: "bg-accent text-accent-foreground",
  shipping: "bg-gold text-gold-foreground",
  delivered: "bg-success text-primary-foreground",
  cancelled: "bg-destructive text-primary-foreground",
};
export function StatusBadge({ status }: { status: OrderStatus }) {
  return <span className={`inline-block rounded-sm px-2 py-1 text-[10px] font-semibold uppercase tracking-widest ${style[status]}`}>{status}</span>;
}
