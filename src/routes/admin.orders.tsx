import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useStore } from "@/lib/store";
import { formatPrice } from "@/lib/sample-data";
import { STATUSES, StatusBadge } from "@/components/status-badge";
import type { OrderStatus } from "@/lib/types";

export const Route = createFileRoute("/admin/orders")({ component: Orders });

function Orders() {
  const { orders, setOrderStatus } = useStore();
  const [filter, setFilter] = useState<OrderStatus | "all">("all");
  const [open, setOpen] = useState<string | null>(null);
  const list = orders.filter((o) => filter === "all" || o.status === filter);
  return (
    <div className="space-y-6">
      <h1 className="text-4xl">Orders</h1>
      <div className="flex flex-wrap gap-2">
        {(["all", ...STATUSES] as const).map((s) => <button key={s} onClick={() => setFilter(s)} className={`eyebrow border px-3 py-2 text-[10px] ${filter === s ? "border-foreground bg-foreground text-background" : "bg-card"}`}>{s}</button>)}
      </div>
      <div className="space-y-3">
        {list.map((o) => (
          <div key={o.id} className="bg-card">
            <button onClick={() => setOpen(open === o.id ? null : o.id)} className="grid w-full grid-cols-2 items-center gap-2 p-4 text-left text-sm md:grid-cols-5">
              <span className="font-semibold">{o.id}</span><span>{o.customer.name}</span>
              <span className="hidden text-muted-foreground md:block">{new Date(o.createdAt).toLocaleDateString("vi-VN")}</span>
              <span>{formatPrice(o.total)}</span><StatusBadge status={o.status} />
            </button>
            {open === o.id && (
              <div className="grid gap-6 border-t p-4 text-sm md:grid-cols-3">
                <div><div className="eyebrow mb-2 text-[10px]">Customer</div><p>{o.customer.name}</p><p>{o.customer.phone}</p><p className="text-muted-foreground">{o.customer.address}</p>{o.customer.note && <p className="mt-2 italic">“{o.customer.note}”</p>}</div>
                <div><div className="eyebrow mb-2 text-[10px]">Items</div>{o.items.map((i, k) => <p key={k}>{i.name} · {i.color} · EU {i.size} × {i.qty}</p>)}<p className="mt-2 text-muted-foreground">COD · {formatPrice(o.total)}</p></div>
                <div><div className="eyebrow mb-2 text-[10px]">Update status</div>
                  <select className="field" value={o.status} onChange={(e) => setOrderStatus(o.id, e.target.value as OrderStatus)}>{STATUSES.map((s) => <option key={s}>{s}</option>)}</select>
                </div>
              </div>
            )}
          </div>
        ))}
        {!list.length && <p className="text-muted-foreground">No orders.</p>}
      </div>
    </div>
  );
}
