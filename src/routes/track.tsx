import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useStore } from "@/lib/store";
import { OrderView } from "@/components/order-view";
import type { Order } from "@/lib/types";

export const Route = createFileRoute("/track")({
  head: () => ({
    meta: [
      { title: "Track your order — LuxeStride" },
      { name: "description", content: "Check the delivery status of your LuxeStride order." },
      { property: "og:title", content: "Track your order — LuxeStride" },
      { property: "og:description", content: "Check the delivery status of your LuxeStride order." },
    ],
  }),
  component: Track,
});

function Track() {
  const { orders } = useStore();
  const [id, setId] = useState("");
  const [phone, setPhone] = useState("");
  const [res, setRes] = useState<Order | null | undefined>(undefined);
  const find = (e: React.FormEvent) => {
    e.preventDefault();
    setRes(orders.find((o) => o.id.toLowerCase() === id.trim().toLowerCase() && o.customer.phone === phone.trim()) ?? null);
  };
  return (
    <div className="mx-auto max-w-3xl px-5 py-16">
      <div className="eyebrow text-gold">Order tracking</div>
      <h1 className="mt-3 text-5xl">Where's my pair?</h1>
      <form onSubmit={find} className="mt-10 grid gap-4 sm:grid-cols-[1fr_1fr_auto]">
        <input className="field" placeholder="Order number (e.g. LX-10422)" value={id} onChange={(e) => setId(e.target.value)} />
        <input className="field" placeholder="Phone number" value={phone} onChange={(e) => setPhone(e.target.value)} />
        <button className="btn btn-primary">Track</button>
      </form>
      <p className="mt-3 text-xs text-muted-foreground">Try the sample order LX-10422 with phone 0912345678.</p>
      <div className="mt-12">
        {res === null && <p className="text-muted-foreground">No order found with those details.</p>}
        {res && <OrderView order={res} />}
      </div>
    </div>
  );
}
