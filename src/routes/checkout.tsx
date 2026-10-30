import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { Banknote } from "lucide-react";
import { useStore } from "@/lib/store";
import { shippingFor } from "@/lib/sample-data";
import { Summary } from "./cart";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Checkout — LuxeStride" },
      { name: "description", content: "Enter delivery details and pay cash on delivery." },
      { property: "og:title", content: "Checkout — LuxeStride" },
      { property: "og:description", content: "Enter delivery details and pay cash on delivery." },
    ],
  }),
  component: Checkout,
});

const schema = z.object({
  name: z.string().trim().min(2, "Please enter your full name").max(100),
  phone: z.string().trim().regex(/^(0|\+84)\d{9,10}$/, "Enter a valid phone number"),
  address: z.string().trim().min(8, "Please enter a full delivery address").max(300),
  note: z.string().trim().max(300).optional(),
});

function Checkout() {
  const { cart, products, placeOrder } = useStore();
  const nav = useNavigate();
  const [form, setForm] = useState({ name: "", phone: "", address: "", note: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const subtotal = cart.reduce((a, c) => a + (products.find((p) => p.id === c.productId)?.price ?? 0) * c.qty, 0);

  if (!cart.length) return <div className="py-32 text-center">Your bag is empty. <Link to="/shop" className="underline">Shop now</Link></div>;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const r = schema.safeParse(form);
    if (!r.success) return setErrors(Object.fromEntries(r.error.issues.map((i) => [i.path[0], i.message])));
    const order = placeOrder(r.data);
    nav({ to: "/order/$id", params: { id: order.id } });
  };
  const f = (k: keyof typeof form, label: string, area = false) => (
    <label className="block">
      <span className="eyebrow mb-2 block">{label}</span>
      {area ? <textarea rows={3} className="field" value={form[k]} onChange={(e) => setForm({ ...form, [k]: e.target.value })} />
        : <input className="field" value={form[k]} onChange={(e) => setForm({ ...form, [k]: e.target.value })} />}
      {errors[k] && <span className="mt-1 block text-xs text-destructive">{errors[k]}</span>}
    </label>
  );

  return (
    <div className="mx-auto max-w-7xl px-5 py-14">
      <h1 className="text-5xl">Checkout</h1>
      <form onSubmit={submit} className="mt-10 grid gap-12 lg:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          {f("name", "Full name")}
          {f("phone", "Phone number")}
          {f("address", "Delivery address", true)}
          {f("note", "Note (optional)", true)}
          <div className="flex items-center gap-4 border border-gold bg-accent p-5">
            <Banknote className="text-gold" />
            <div><div className="font-semibold">Cash on delivery (COD)</div><div className="text-xs text-muted-foreground">Pay the courier when your order arrives.</div></div>
          </div>
        </div>
        <Summary subtotal={subtotal} ship={shippingFor(subtotal)}><button className="btn btn-primary mt-6 w-full">Place order</button></Summary>
      </form>
    </div>
  );
}
