import { Link } from "@tanstack/react-router";
import { ShoppingBag, Menu, X } from "lucide-react";
import { useState } from "react";
import { useStore } from "@/lib/store";

const nav = [
  { to: "/shop", label: "Shop" },
  { to: "/track", label: "Track order" },
] as const;

export function Header() {
  const { cart } = useStore();
  const [open, setOpen] = useState(false);
  const count = cart.reduce((a, c) => a + c.qty, 0);
  return (
    <header className="sticky top-0 z-40 border-b bg-background/90 backdrop-blur">
      <div className="bg-ink py-2 text-center text-ink-foreground eyebrow">Free delivery over 2.000.000 ₫ · Cash on delivery nationwide</div>
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5">
        <button className="md:hidden" onClick={() => setOpen(!open)} aria-label="Menu">{open ? <X size={20} /> : <Menu size={20} />}</button>
        <Link to="/" className="font-display text-2xl tracking-[0.2em]">LUXE<span className="text-gold">STRIDE</span></Link>
        <nav className="hidden gap-10 md:flex">
          {nav.map((n) => <Link key={n.to} to={n.to} className="eyebrow text-muted-foreground transition hover:text-foreground" activeProps={{ className: "!text-foreground" }}>{n.label}</Link>)}
        </nav>
        <Link to="/cart" className="relative" aria-label="Cart">
          <ShoppingBag size={20} />
          {count > 0 && <span className="absolute -right-2 -top-2 grid h-5 w-5 place-items-center rounded-full bg-gold text-[10px] font-bold text-gold-foreground">{count}</span>}
        </Link>
      </div>
      {open && (
        <nav className="flex flex-col gap-4 border-t px-5 py-5 md:hidden">
          {nav.map((n) => <Link key={n.to} to={n.to} onClick={() => setOpen(false)} className="eyebrow">{n.label}</Link>)}
        </nav>
      )}
    </header>
  );
}

export function Footer() {
  return (
    <footer className="mt-24 bg-ink text-ink-foreground">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="font-display text-2xl tracking-[0.2em]">LUXE<span className="text-gold">STRIDE</span></div>
          <p className="mt-4 max-w-sm text-sm opacity-60">An independent atelier of premium sneakers. Curated, authenticated, delivered to your door.</p>
        </div>
        <div className="space-y-2 text-sm opacity-70">
          <div className="eyebrow text-gold">Shop</div>
          <Link to="/shop" className="block">All sneakers</Link>
          <Link to="/track" className="block">Track order</Link>
        </div>
        <div className="space-y-2 text-sm opacity-70">
          <div className="eyebrow text-gold">Studio</div>
          <Link to="/admin" className="block">Admin</Link>
        </div>
      </div>
      <div className="border-t border-ink-foreground/10 py-6 text-center text-xs opacity-40">© 2026 LuxeStride. All rights reserved.</div>
    </footer>
  );
}
