import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { useStore } from "@/lib/store";
import { ProductCard } from "@/components/product-card";
import { SIZES } from "@/lib/sample-data";

export const Route = createFileRoute("/shop")({
  head: () => ({
    meta: [
      { title: "Shop all sneakers — LuxeStride" },
      { name: "description", content: "Browse luxury court, lifestyle, running and high-top sneakers." },
      { property: "og:title", content: "Shop all sneakers — LuxeStride" },
      { property: "og:description", content: "Browse luxury court, lifestyle, running and high-top sneakers." },
    ],
  }),
  component: Shop,
});

const CATS = ["All", "Lifestyle", "Running", "Court", "High-top"];

function Shop() {
  const { products } = useStore();
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("All");
  const [brand, setBrand] = useState("All");
  const [size, setSize] = useState("");
  const [sort, setSort] = useState("new");
  const brands = ["All", ...new Set(products.map((p) => p.brand))];

  const list = useMemo(() => {
    let r = products.filter((p) =>
      (cat === "All" || p.category === cat) && (brand === "All" || p.brand === brand) &&
      (!size || (p.stock[size] ?? 0) > 0) &&
      (p.name + p.brand + p.category).toLowerCase().includes(q.toLowerCase()));
    r = [...r].sort((a, b) => sort === "low" ? a.price - b.price : sort === "high" ? b.price - a.price : b.createdAt.localeCompare(a.createdAt));
    return r;
  }, [products, q, cat, brand, size, sort]);

  return (
    <div className="mx-auto max-w-7xl px-5 py-14">
      <div className="eyebrow text-gold">Collection</div>
      <h1 className="mt-3 text-5xl">All Sneakers</h1>
      <div className="mt-10 grid gap-10 lg:grid-cols-[240px_1fr]">
        <aside className="space-y-8">
          <div className="relative"><Search size={16} className="absolute left-3 top-3 text-muted-foreground" /><input className="field pl-9" placeholder="Search" value={q} onChange={(e) => setQ(e.target.value)} /></div>
          <Filter title="Category" items={CATS} value={cat} onChange={setCat} />
          <Filter title="Brand" items={brands} value={brand} onChange={setBrand} />
          <div>
            <div className="eyebrow mb-3">Size (EU)</div>
            <div className="grid grid-cols-4 gap-2">
              {SIZES.map((s) => <button key={s} onClick={() => setSize(size === s ? "" : s)} className={`border py-2 text-xs transition ${size === s ? "border-foreground bg-foreground text-background" : "hover:border-foreground"}`}>{s}</button>)}
            </div>
          </div>
        </aside>
        <div>
          <div className="mb-6 flex items-center justify-between text-sm">
            <span className="text-muted-foreground">{list.length} products</span>
            <select className="field w-auto" value={sort} onChange={(e) => setSort(e.target.value)}>
              <option value="new">Newest</option><option value="low">Price: low to high</option><option value="high">Price: high to low</option>
            </select>
          </div>
          {list.length ? (
            <div className="grid grid-cols-2 gap-x-5 gap-y-12 md:grid-cols-3">{list.map((p) => <ProductCard key={p.id} product={p} />)}</div>
          ) : <p className="py-20 text-center text-muted-foreground">No sneakers match your filters.</p>}
        </div>
      </div>
    </div>
  );
}

function Filter({ title, items, value, onChange }: { title: string; items: string[]; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <div className="eyebrow mb-3">{title}</div>
      <div className="flex flex-wrap gap-2 lg:flex-col">
        {items.map((i) => <button key={i} onClick={() => onChange(i)} className={`text-left text-sm transition ${value === i ? "font-semibold text-foreground" : "text-muted-foreground hover:text-foreground"}`}>{value === i && <span className="text-gold">— </span>}{i}</button>)}
      </div>
    </div>
  );
}
