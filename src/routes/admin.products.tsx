import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Pencil, Plus, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { useStore, totalStock } from "@/lib/store";
import { formatPrice, SIZES } from "@/lib/sample-data";
import type { Product } from "@/lib/types";

export const Route = createFileRoute("/admin/products")({ component: Products });

const blank = (): Product => ({ id: "p" + Date.now(), slug: "", name: "", brand: "", category: "Lifestyle", price: 0, description: "", images: [],
  colors: [{ name: "Onyx", hex: "#151515" }], stock: Object.fromEntries(SIZES.map((s) => [s, 0])), createdAt: new Date().toISOString().slice(0, 10) });

function Products() {
  const { products, deleteProduct } = useStore();
  const [edit, setEdit] = useState<Product | null>(null);
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between"><h1 className="text-4xl">Products</h1><button className="btn btn-primary" onClick={() => setEdit(blank())}><Plus size={14} /> New</button></div>
      <div className="overflow-x-auto bg-card">
        <table className="w-full min-w-[640px] text-sm">
          <thead className="eyebrow text-left text-[10px] text-muted-foreground"><tr><th className="p-4">Product</th><th>Category</th><th>Price</th><th>Stock</th><th /></tr></thead>
          <tbody className="divide-y">{products.map((p) => (
            <tr key={p.id}>
              <td className="flex items-center gap-3 p-4"><img src={p.images[0]} alt="" className="h-12 w-12 bg-secondary object-cover" /><div><div className="font-semibold">{p.name}</div><div className="text-xs text-muted-foreground">{p.brand}</div></div></td>
              <td>{p.category}</td><td>{formatPrice(p.price)}</td><td className={totalStock(p) < 15 ? "text-destructive" : ""}>{totalStock(p)}</td>
              <td className="pr-4 text-right">
                <button className="p-2 hover:text-gold" onClick={() => setEdit(p)} aria-label="Edit"><Pencil size={15} /></button>
                <button className="p-2 hover:text-destructive" aria-label="Delete" onClick={() => { if (confirm(`Delete ${p.name}?`)) { deleteProduct(p.id); toast.success("Product deleted"); } }}><Trash2 size={15} /></button>
              </td>
            </tr>))}</tbody>
        </table>
      </div>
      {edit && <Editor initial={edit} onClose={() => setEdit(null)} />}
    </div>
  );
}

function Editor({ initial, onClose }: { initial: Product; onClose: () => void }) {
  const { saveProduct } = useStore();
  const [p, setP] = useState<Product>(initial);
  const up = (patch: Partial<Product>) => setP({ ...p, ...patch });

  const onFiles = (files: FileList | null) => {
    if (!files) return;
    // Demo: images are stored as data URLs. With the backend connected these upload to file storage.
    Array.from(files).forEach((f) => {
      if (!f.type.startsWith("image/") || f.size > 2_000_000) return toast.error(`${f.name}: images up to 2MB only`);
      const r = new FileReader();
      r.onload = () => setP((cur) => ({ ...cur, images: [...cur.images, r.result as string] }));
      r.readAsDataURL(f);
    });
  };
  const save = () => {
    if (!p.name.trim() || !p.brand.trim() || p.price <= 0) return toast.error("Name, brand and price are required");
    if (!p.images.length) return toast.error("Add at least one image");
    saveProduct({ ...p, slug: p.slug || p.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") + "-" + p.id.slice(-4) });
    toast.success("Product saved"); onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-ink/50" onClick={onClose}>
      <div className="h-full w-full max-w-xl overflow-y-auto bg-background p-6 fade-up" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between"><h2 className="text-3xl">{initial.name ? "Edit product" : "New product"}</h2><button onClick={onClose}><X /></button></div>
        <div className="mt-6 space-y-4">
          <Row label="Name"><input className="field" value={p.name} onChange={(e) => up({ name: e.target.value })} /></Row>
          <div className="grid grid-cols-2 gap-4">
            <Row label="Brand"><input className="field" value={p.brand} onChange={(e) => up({ brand: e.target.value })} /></Row>
            <Row label="Price (₫)"><input className="field" type="number" min={0} value={p.price} onChange={(e) => up({ price: Number(e.target.value) })} /></Row>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Row label="Category"><select className="field" value={p.category} onChange={(e) => up({ category: e.target.value as Product["category"] })}>{["Lifestyle", "Running", "Court", "High-top"].map((c) => <option key={c}>{c}</option>)}</select></Row>
            <Row label="Featured"><label className="flex h-[42px] items-center gap-2 text-sm"><input type="checkbox" checked={!!p.featured} onChange={(e) => up({ featured: e.target.checked })} /> Show on homepage</label></Row>
          </div>
          <Row label="Description"><textarea rows={3} className="field" value={p.description} onChange={(e) => up({ description: e.target.value })} /></Row>

          <Row label="Images">
            <div className="flex flex-wrap gap-2">
              {p.images.map((src, i) => (
                <div key={i} className="relative h-20 w-20"><img src={src} alt="" className="h-full w-full bg-secondary object-cover" />
                  <button onClick={() => up({ images: p.images.filter((_, k) => k !== i) })} className="absolute -right-1 -top-1 rounded-full bg-ink p-0.5 text-ink-foreground"><X size={12} /></button></div>
              ))}
              <label className="grid h-20 w-20 cursor-pointer place-items-center border border-dashed text-muted-foreground hover:border-gold"><Plus /><input type="file" accept="image/*" multiple hidden onChange={(e) => onFiles(e.target.files)} /></label>
            </div>
          </Row>

          <Row label="Colours">
            <div className="space-y-2">
              {p.colors.map((c, i) => (
                <div key={i} className="flex gap-2">
                  <input type="color" value={c.hex} onChange={(e) => up({ colors: p.colors.map((x, k) => (k === i ? { ...x, hex: e.target.value } : x)) })} className="h-[42px] w-12 border" />
                  <input className="field" value={c.name} onChange={(e) => up({ colors: p.colors.map((x, k) => (k === i ? { ...x, name: e.target.value } : x)) })} />
                  <button onClick={() => up({ colors: p.colors.filter((_, k) => k !== i) })} className="px-2"><Trash2 size={14} /></button>
                </div>
              ))}
              <button className="text-xs underline" onClick={() => up({ colors: [...p.colors, { name: "New colour", hex: "#cdb88a" }] })}>+ Add colour</button>
            </div>
          </Row>

          <Row label="Stock per size (EU)">
            <div className="grid grid-cols-4 gap-2">{SIZES.map((s) => (
              <label key={s} className="text-xs"><span className="text-muted-foreground">{s}</span>
                <input className="field mt-1" type="number" min={0} value={p.stock[s] ?? 0} onChange={(e) => up({ stock: { ...p.stock, [s]: Math.max(0, Number(e.target.value)) } })} /></label>
            ))}</div>
          </Row>
          <div className="flex gap-3 pt-4"><button className="btn btn-outline flex-1" onClick={onClose}>Cancel</button><button className="btn btn-primary flex-1" onClick={save}>Save</button></div>
        </div>
      </div>
    </div>
  );
}
const Row = ({ label, children }: { label: string; children: React.ReactNode }) => <div><div className="eyebrow mb-2 text-[10px]">{label}</div>{children}</div>;
