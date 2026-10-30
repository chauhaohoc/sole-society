import { createFileRoute, Link } from "@tanstack/react-router";
import { useStore } from "@/lib/store";
import { OrderView } from "@/components/order-view";

export const Route = createFileRoute("/order/$id")({
  head: () => ({
    meta: [
      { title: "Order confirmed — LuxeStride" },
      { name: "description", content: "Your LuxeStride order has been received." },
      { property: "og:title", content: "Order confirmed — LuxeStride" },
      { property: "og:description", content: "Your LuxeStride order has been received." },
    ],
  }),
  component: OrderPage,
});

function OrderPage() {
  const { id } = Route.useParams();
  const { orders, ready } = useStore();
  const order = orders.find((o) => o.id === id);
  if (!order) return <div className="py-32 text-center">{ready ? "Order not found." : "Loading…"}</div>;
  return (
    <div className="mx-auto max-w-3xl px-5 py-16">
      <div className="text-center">
        <div className="eyebrow text-gold">Thank you</div>
        <h1 className="mt-3 text-5xl">Order received</h1>
        <p className="mt-4 text-muted-foreground">Your order number is <strong className="text-foreground">{order.id}</strong>. Keep it with your phone number to track delivery.</p>
      </div>
      <div className="mt-12"><OrderView order={order} /></div>
      <div className="mt-10 flex justify-center gap-4"><Link to="/shop" className="btn btn-outline">Keep shopping</Link><Link to="/track" className="btn btn-primary">Track order</Link></div>
    </div>
  );
}
