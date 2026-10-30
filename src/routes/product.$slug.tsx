import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Minus, Plus } from "lucide-react";
import { toast } from "sonner";
import { useStore } from "@/lib/store";
import { formatPrice, SIZES } from "@/lib/sample-data";
import { ProductCard } from "@/components/product-card";

export const Route = createFileRoute("/product/$slug")({
  head: () => ({
    meta: [
      { title: "Sneaker details — LuxeStride" },
      { name: "description", content: "Choose your size and colour, pay cash on delivery." },
      { property: "og:title", content: "Sneaker details — LuxeStride" },
      { property: "og:description", content: "Choose your size and colour, pay cash on delivery." },
    ],
  }),
  component: ProductPage,
});

function ProductPage() {
  const { slug } = Route.useParams();
  const { products, addToCart, ready } = useStore();
  const nav = useNavigate();
  const p = products.find((x) => x.slug === slug);
  const [img, setImg] = useState(0);
  const [size, setSize] = useState("");
  const [color, setColor] = useState("");
  const [qty, setQty] = useState(1);

  if (!p) return <div className="py-32 text-center">{ready ? <>Product not found. <Link to="/shop" className="underline">Back to shop</Link></> : "Loading…"}</div>;
  const chosenColor = color || p.colors[0]?.name;
  const avail = size ? p.stock[size] ?? 0 : 0;

  const add = (go: boolean) => {
    if (!size) return toast.error("Please select a size");
    addToCart({ productId: p.id, size, color: chosenColor, qty: Math.min(qty, avail) });
    toast.success(`${p.name} added to bag`);
    if (go) nav({ to: "/cart" });
  };

  return (
    <div className="mx-auto max-w-7xl px-5 py-12">
      <div className="grid gap-12 lg:grid-cols-2">
        <div className="flex flex-col-reverse gap-4 md:flex-row">
          <div className="flex gap-3 md:flex-col">
            {p.images.map((src, i) => (
              <button key={i} onClick={() => setImg(i)} className={`h-20 w-20 overflow-hidden border-2 bg-secondary transition ${img === i ? "border-gold" : "border-transparent"}`}>
                <img src={src} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
          <div className="aspect-square flex-1 overflow-hidden bg-secondary">
            <img key={img} src={p.images[img]} alt={p.name} className="fade-up h-full w-full object-cover" />
          </div>
        </div>
        <div className="lg:pt-6">
          <div className="eyebrow text-gold">{p.brand} · {p.category}</div>
          <h1 className="mt-3 text-5xl">{p.name}</h1>
          <div className="mt-4 text-xl font-semibold">{formatPrice(p.price)}</div>
          <p className="mt-6 max-w-md leading-relaxed text-muted-foreground">{p.description}</p>

          <div className="mt-8"><div className="eyebrow mb-3">Colour — <span className="text-muted-foreground">{chosenColor}</span></div>
            <div className="flex gap-3">{p.colors.map((c) => (
              <button key={c.name} onClick={() => setColor(c.name)} title={c.name} className={`h-9 w-9 rounded-full border-2 p-0.5 ${chosenColor === c.name ? "border-gold" : "border-transparent"}`}>
                <span className="block h-full w-full rounded-full border" style={{ background: c.hex }} />
              </button>))}
            </div>
          </div>

          <div className="mt-8"><div className="eyebrow mb-3">Size (EU)</div>
            <div className="grid grid-cols-4 gap-2 sm:grid-cols-8">{SIZES.map((s) => {
              const out = (p.stock[s] ?? 0) === 0;
              return <button key={s} disabled={out} onClick={() => { setSize(s); setQty(1); }} className={`border py-3 text-sm transition disabled:cursor-not-allowed disabled:line-through disabled:opacity-30 ${size === s ? "border-foreground bg-foreground text-background" : "hover:border-foreground"}`}>{s}</button>;
            })}</div>
            {size && <p className="mt-2 text-xs text-muted-foreground">{avail <= 3 ? `Only ${avail} left` : "In stock"}</p>}
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <div className="flex items-center border">
              <button className="p-3" onClick={() => setQty(Math.max(1, qty - 1))} aria-label="Decrease"><Minus size={14} /></button>
              <span className="w-10 text-center">{qty}</span>
              <button className="p-3" onClick={() => setQty(Math.min(avail || 1, qty + 1))} aria-label="Increase"><Plus size={14} /></button>
            </div>
            <button className="btn btn-outline flex-1" onClick={() => add(false)}>Add to bag</button>
            <button className="btn btn-primary flex-1" onClick={() => add(true)}>Buy now</button>
          </div>
          <p className="mt-6 text-xs text-muted-foreground">Cash on delivery · Free delivery over 2.000.000 ₫ · 7-day exchange</p>
        </div>
      </div>
      <section className="mt-24"><h2 className="mb-8 text-3xl">You may also like</h2>
        <div className="grid grid-cols-2 gap-5 lg:grid-cols-4">{products.filter((x) => x.id !== p.id).slice(0, 4).map((x) => <ProductCard key={x.id} product={x} />)}</div>
      </section>
    </div>
  );
}
