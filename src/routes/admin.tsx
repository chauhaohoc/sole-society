import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import { useState } from "react";
import { LayoutDashboard, Package, Receipt, LogOut, Store } from "lucide-react";
import { DEMO_ADMIN, useStore } from "@/lib/store";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin — LuxeStride" }, { name: "robots", content: "noindex" }] }),
  component: AdminLayout,
});

function AdminLayout() {
  const { admin, ready, logout } = useStore();
  if (!ready) return null;
  if (!admin) return <Login />;
  const links = [
    { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
    { to: "/admin/products", label: "Products", icon: Package },
    { to: "/admin/orders", label: "Orders", icon: Receipt },
  ] as const;
  return (
    <div className="min-h-screen bg-secondary md:flex">
      <aside className="bg-ink text-ink-foreground md:sticky md:top-0 md:h-screen md:w-60 md:shrink-0">
        <div className="p-6 font-display text-xl tracking-[0.2em]">LUXE<span className="text-gold">STRIDE</span><div className="eyebrow mt-1 text-[9px] opacity-50">Studio</div></div>
        <nav className="flex gap-1 overflow-x-auto px-3 pb-3 md:flex-col">
          {links.map(({ to, label, icon: Icon, ...r }) => (
            <Link key={to} to={to} activeOptions={{ exact: "exact" in r }} className="flex items-center gap-3 rounded px-3 py-2.5 text-sm opacity-70 transition hover:opacity-100" activeProps={{ className: "!opacity-100 bg-ink-foreground/10 text-gold" }}>
              <Icon size={16} /> {label}
            </Link>
          ))}
          <Link to="/" className="flex items-center gap-3 px-3 py-2.5 text-sm opacity-70 hover:opacity-100"><Store size={16} /> Storefront</Link>
          <button onClick={logout} className="flex items-center gap-3 px-3 py-2.5 text-sm opacity-70 hover:opacity-100"><LogOut size={16} /> Sign out</button>
        </nav>
      </aside>
      <main className="min-w-0 flex-1 p-5 md:p-10">
        <div className="mb-6 rounded border border-gold bg-accent px-4 py-2 text-xs">Demo mode — changes are saved only in this browser until the backend is connected.</div>
        <Outlet />
      </main>
    </div>
  );
}

function Login() {
  const { login } = useStore();
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");
  return (
    <div className="grid min-h-screen place-items-center bg-ink px-5">
      <form onSubmit={(e) => { e.preventDefault(); if (!login(email, pw)) setErr("Incorrect email or password"); }} className="w-full max-w-sm bg-background p-8">
        <div className="font-display text-2xl tracking-[0.2em]">LUXE<span className="text-gold">STRIDE</span></div>
        <h1 className="mt-6 text-3xl">Admin sign in</h1>
        <div className="mt-6 space-y-4">
          <input className="field" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input className="field" type="password" placeholder="Password" value={pw} onChange={(e) => setPw(e.target.value)} />
          {err && <p className="text-xs text-destructive">{err}</p>}
          <button className="btn btn-primary w-full">Sign in</button>
        </div>
        <p className="mt-6 text-xs text-muted-foreground">Demo login: {DEMO_ADMIN.email} / {DEMO_ADMIN.password}. Real secure login arrives once the backend is connected.</p>
        <Link to="/" className="mt-4 block text-xs underline">Back to store</Link>
      </form>
    </div>
  );
}
