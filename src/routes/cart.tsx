import { createFileRoute, Link } from "@tanstack/react-router";
import { Minus, Plus, X } from "lucide-react";
import { useStore } from "@/lib/store";
import { formatPrice, shippingFor } from "@/lib/sample-data";
import { Summary } from "@/components/summary";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Your bag — LuxeStride" },
      { name: "description", content: "Review the sneakers in your bag before checkout." },
      { property: "og:title", content: "Your bag — LuxeStride" },
      { property: "og:description", content: "Review the sneakers in your bag before checkout." },
    ],
  }),
  component: Cart,
});

function Cart() {
  const { cart, products, updateQty, removeFromCart } = useStore();
  const lines = cart.map((c, idx) => ({ c, idx, p: products.find((p) => p.id === c.productId) })).filter((l) => l.p);
  const subtotal = lines.reduce((a, l) => a + l.p!.price * l.c.qty, 0);
  const ship = shippingFor(subtotal);

  if (!lines.length) return (
    <div className="mx-auto max-w-xl px-5 py-32 text-center">
      <h1 className="text-4xl">Your bag is empty</h1>
      <Link to="/shop" className="btn btn-primary mt-8">Continue shopping</Link>
    </div>
  );

  return (
    <div className="mx-auto max-w-7xl px-5 py-14">
      <h1 className="text-5xl">Your Bag</h1>
      <div className="mt-10 grid gap-12 lg:grid-cols-[1fr_360px]">
        <ul className="divide-y border-y">
          {lines.map(({ c, idx, p }) => (
            <li key={idx} className="flex gap-5 py-6">
              <img src={p!.images[0]} alt={p!.name} className="h-28 w-28 bg-secondary object-cover" />
              <div className="flex flex-1 flex-col">
                <div className="flex justify-between gap-4">
                  <div><div className="font-display text-xl">{p!.name}</div><div className="text-xs text-muted-foreground">{c.color} · EU {c.size}</div></div>
                  <button onClick={() => removeFromCart(idx)} aria-label="Remove"><X size={16} /></button>
                </div>
                <div className="mt-auto flex items-center justify-between">
                  <div className="flex items-center border">
                    <button className="p-2" onClick={() => updateQty(idx, c.qty - 1)}><Minus size={12} /></button>
                    <span className="w-8 text-center text-sm">{c.qty}</span>
                    <button className="p-2" onClick={() => updateQty(idx, Math.min(p!.stock[c.size] ?? 1, c.qty + 1))}><Plus size={12} /></button>
                  </div>
                  <div className="font-semibold">{formatPrice(p!.price * c.qty)}</div>
                </div>
              </div>
            </li>
          ))}
        </ul>
        <Summary subtotal={subtotal} ship={ship}><Link to="/checkout" className="btn btn-primary mt-6 w-full">Checkout</Link></Summary>
      </div>
    </div>
  );
}

