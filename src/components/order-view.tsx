import type { Order } from "@/lib/types";
import { formatPrice } from "@/lib/sample-data";
import { Check } from "lucide-react";

const STEPS = ["pending", "confirmed", "shipping", "delivered"] as const;

export function OrderView({ order }: { order: Order }) {
  const cur = STEPS.indexOf(order.status as (typeof STEPS)[number]);
  return (
    <div className="space-y-10">
      {order.status === "cancelled" ? <p className="bg-destructive/10 p-4 text-sm text-destructive">This order was cancelled.</p> : (
        <ol className="grid grid-cols-4">
          {STEPS.map((s, i) => (
            <li key={s} className="relative flex flex-col items-center text-center">
              {i > 0 && <span className={`absolute right-1/2 top-4 h-px w-full ${i <= cur ? "bg-gold" : "bg-border"}`} />}
              <span className={`relative grid h-8 w-8 place-items-center rounded-full border ${i <= cur ? "border-gold bg-gold text-gold-foreground" : "bg-background"}`}>{i <= cur ? <Check size={14} /> : i + 1}</span>
              <span className="eyebrow mt-3 text-[10px]">{s}</span>
            </li>
          ))}
        </ol>
      )}
      <div className="grid gap-8 md:grid-cols-2">
        <div><div className="eyebrow mb-3 text-gold">Delivery to</div>
          <p className="font-semibold">{order.customer.name}</p><p className="text-sm text-muted-foreground">{order.customer.phone}</p><p className="text-sm text-muted-foreground">{order.customer.address}</p>
        </div>
        <div><div className="eyebrow mb-3 text-gold">Payment</div><p className="text-sm">Cash on delivery — {formatPrice(order.total)}</p><p className="text-xs text-muted-foreground">Placed {new Date(order.createdAt).toLocaleString("vi-VN")}</p></div>
      </div>
      <ul className="divide-y border-y">
        {order.items.map((i, k) => (
          <li key={k} className="flex items-center gap-4 py-4">
            <img src={i.image} alt="" className="h-16 w-16 bg-secondary object-cover" />
            <div className="flex-1"><div className="font-display text-lg">{i.name}</div><div className="text-xs text-muted-foreground">{i.color} · EU {i.size} · ×{i.qty}</div></div>
            <div className="text-sm font-semibold">{formatPrice(i.price * i.qty)}</div>
          </li>
        ))}
      </ul>
      <div className="flex justify-between text-lg font-semibold"><span>Total</span><span>{formatPrice(order.total)}</span></div>
    </div>
  );
}
