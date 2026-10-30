import { Link } from "@tanstack/react-router";
import type { Product } from "@/lib/types";
import { formatPrice } from "@/lib/sample-data";
import { totalStock } from "@/lib/store";

export function ProductCard({ product }: { product: Product }) {
  const soldOut = totalStock(product) === 0;
  return (
    <Link to="/product/$slug" params={{ slug: product.slug }} className="group block">
      <div className="relative aspect-square overflow-hidden bg-secondary">
        <img src={product.images[0]} alt={product.name} loading="lazy" width={1024} height={1024}
          className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
        {product.images[1] && (
          <img src={product.images[1]} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover opacity-0 transition duration-700 group-hover:opacity-100" />
        )}
        {soldOut && <span className="absolute left-3 top-3 bg-ink px-2 py-1 text-[10px] uppercase tracking-widest text-ink-foreground">Sold out</span>}
      </div>
      <div className="mt-4 flex items-start justify-between gap-3">
        <div>
          <div className="eyebrow text-muted-foreground">{product.brand}</div>
          <div className="mt-1 font-display text-xl">{product.name}</div>
          <div className="mt-2 flex gap-1.5">
            {product.colors.map((c) => <span key={c.name} title={c.name} className="h-3 w-3 rounded-full border" style={{ background: c.hex }} />)}
          </div>
        </div>
        <div className="text-sm font-semibold">{formatPrice(product.price)}</div>
      </div>
    </Link>
  );
}
