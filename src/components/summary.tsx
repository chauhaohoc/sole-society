import type { ReactNode } from "react";
import { formatPrice } from "@/lib/sample-data";

export function Summary({ subtotal, ship, children }: { subtotal: number; ship: number; children?: ReactNode }) {
  return (
    <aside className="h-fit bg-secondary p-6">
      <div className="eyebrow">Order summary</div>
      <dl className="mt-6 space-y-3 text-sm">
        <div className="flex justify-between"><dt>Subtotal</dt><dd>{formatPrice(subtotal)}</dd></div>
        <div className="flex justify-between"><dt>Delivery</dt><dd>{ship ? formatPrice(ship) : "Free"}</dd></div>
        <div className="flex justify-between border-t pt-3 text-base font-semibold"><dt>Total</dt><dd>{formatPrice(subtotal + ship)}</dd></div>
      </dl>
      {children}
    </aside>
  );
}
