import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, ShieldCheck, Truck, Banknote } from "lucide-react";
import hero from "@/assets/hero.jpg";
import { useStore } from "@/lib/store";
import { ProductCard } from "@/components/product-card";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "LuxeStride — Luxury Sneakers, Delivered" },
      { name: "description", content: "Shop premium leather, suede and running sneakers. Pay cash on delivery." },
      { property: "og:title", content: "LuxeStride — Luxury Sneakers, Delivered" },
      { property: "og:description", content: "Shop premium leather, suede and running sneakers. Pay cash on delivery." },
    ],
  }),
  component: Home,
});

function Home() {
  const { products } = useStore();
  const featured = products.filter((p) => p.featured).slice(0, 4);
  return (
    <>
      <section className="relative overflow-hidden bg-ink text-ink-foreground">
        <img src={hero} alt="Ivory leather sneaker" width={1600} height={1008} className="absolute inset-0 h-full w-full object-cover opacity-80" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/60 to-transparent" />
        <div className="relative mx-auto flex min-h-[78vh] max-w-7xl flex-col justify-center px-5 py-24">
          <div className="fade-up eyebrow text-gold">Autumn / Winter 2026</div>
          <h1 className="fade-up mt-5 max-w-xl text-5xl leading-[1.05] md:text-7xl" style={{ animationDelay: ".1s" }}>Crafted for the<br /><em className="text-gold">quiet</em> statement.</h1>
          <p className="fade-up mt-6 max-w-md text-sm opacity-70" style={{ animationDelay: ".2s" }}>Hand-finished leather and suede sneakers from independent ateliers.</p>
          <div className="fade-up mt-10 flex flex-wrap gap-4" style={{ animationDelay: ".3s" }}>
            <Link to="/shop" className="btn btn-gold">Shop collection <ArrowRight size={14} /></Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-24">
        <div className="mb-12 flex items-end justify-between">
          <div><div className="eyebrow text-gold">Featured</div><h2 className="mt-3 text-4xl md:text-5xl">The Edit</h2></div>
          <Link to="/shop" className="eyebrow hidden items-center gap-2 hover:text-gold sm:flex">View all <ArrowRight size={14} /></Link>
        </div>
        <div className="grid grid-cols-2 gap-x-5 gap-y-12 lg:grid-cols-4">
          {featured.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>

      <section className="border-y bg-secondary">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 md:grid-cols-3">
          {[
            { i: ShieldCheck, t: "Authenticated", d: "Every pair inspected before it ships." },
            { i: Truck, t: "Nationwide delivery", d: "Free over 2.000.000 ₫, 2–4 working days." },
            { i: Banknote, t: "Cash on delivery", d: "Pay only when your pair arrives." },
          ].map(({ i: Icon, t, d }) => (
            <div key={t} className="flex gap-4"><Icon className="text-gold" size={26} strokeWidth={1.4} /><div><div className="font-display text-xl">{t}</div><p className="mt-1 text-sm text-muted-foreground">{d}</p></div></div>
          ))}
        </div>
      </section>
    </>
  );
}
