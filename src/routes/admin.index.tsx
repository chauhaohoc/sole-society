import { createFileRoute } from "@tanstack/react-router";
import { useStore, totalStock } from "@/lib/store";
import { formatPrice } from "@/lib/sample-data";
import { StatusBadge } from "@/components/status-badge";

export const Route = createFileRoute("/admin/")({ component: Dashboard });

function Dashboard() {
  const { orders, products } = useStore();
  const valid = orders.filter((o) => o.status !== "cancelled");
  const revenue = valid.filter((o) => o.status === "delivered").reduce((a, o) => a + o.total, 0);
  const pipeline = valid.reduce((a, o) => a + o.total, 0);
  const units = valid.reduce((a, o) => a + o.items.reduce((b, i) => b + i.qty, 0), 0);
  const low = products.filter((p) => totalStock(p) < 15);

  const days = [...Array(7)].map((_, i) => { const d = new Date(); d.setDate(d.getDate() - 6 + i); return d.toISOString().slice(0, 10); });
  const perDay = days.map((d) => valid.filter((o) => o.createdAt.slice(0, 10) === d).reduce((a, o) => a + o.total, 0));
  const max = Math.max(...perDay, 1);

  const best = Object.entries(valid.flatMap((o) => o.items).reduce<Record<string, number>>((a, i) => ((a[i.name] = (a[i.name] ?? 0) + i.qty), a), {})).sort((a, b) => b[1] - a[1]).slice(0, 5);

  return (
    <div className="space-y-8">
      <h1 className="text-4xl">Dashboard</h1>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[["Delivered revenue", formatPrice(revenue)], ["All active orders value", formatPrice(pipeline)], ["Orders", valid.length], ["Units sold", units]].map(([l, v]) => (
          <div key={l as string} className="bg-card p-5"><div className="eyebrow text-[10px] text-muted-foreground">{l}</div><div className="mt-2 font-display text-2xl md:text-3xl">{v}</div></div>
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <div className="bg-card p-6">
          <div className="eyebrow mb-6">Sales — last 7 days</div>
          <div className="flex h-48 items-end gap-3">
            {perDay.map((v, i) => (
              <div key={i} className="flex flex-1 flex-col items-center gap-2">
                <div className="w-full bg-gold transition-all" style={{ height: `${(v / max) * 100}%`, minHeight: 2 }} title={formatPrice(v)} />
                <span className="text-[10px] text-muted-foreground">{days[i].slice(5)}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-card p-6">
          <div className="eyebrow mb-4">Best sellers</div>
          <ul className="space-y-3 text-sm">{best.map(([n, q]) => <li key={n} className="flex justify-between"><span>{n}</span><span className="font-semibold">{q}</span></li>)}</ul>
          <div className="eyebrow mb-3 mt-8">Low stock</div>
          <ul className="space-y-2 text-sm">{low.length ? low.map((p) => <li key={p.id} className="flex justify-between"><span>{p.name}</span><span className="text-destructive">{totalStock(p)}</span></li>) : <li className="text-muted-foreground">All good</li>}</ul>
        </div>
      </div>
      <div className="bg-card p-6">
        <div className="eyebrow mb-4">Recent orders</div>
        <ul className="divide-y text-sm">{orders.slice(0, 5).map((o) => (
          <li key={o.id} className="flex flex-wrap items-center justify-between gap-2 py-3"><span className="font-semibold">{o.id}</span><span>{o.customer.name}</span><span>{formatPrice(o.total)}</span><StatusBadge status={o.status} /></li>
        ))}</ul>
      </div>
    </div>
  );
}
