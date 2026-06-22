import { Link } from "react-router-dom";
import { useCart, formatKES } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";

export default function Cart() {
  const { items, setQty, remove, subtotal, count } = useCart();

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-24 text-center">
        <ShoppingBag className="mx-auto h-12 w-12 text-muted-foreground" />
        <h1 className="mt-4 text-3xl font-bold">Your cart is empty</h1>
        <p className="mt-2 text-muted-foreground">Browse the shop to add items.</p>
        <Button asChild className="mt-6">
          <Link to="/shop">Continue shopping</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <h1 className="text-3xl font-bold tracking-tight">Your cart ({count})</h1>
      <div className="mt-8 grid gap-8 md:grid-cols-[1fr_320px]">
        <div className="space-y-3">
          {items.map((it) => (
            <div
              key={it.productId}
              className="flex items-center gap-4 rounded-lg border border-border bg-card p-4"
            >
              <div className="h-20 w-20 shrink-0 overflow-hidden rounded-md bg-muted">
                {it.image && <img src={it.image} alt={it.name} className="h-full w-full object-cover" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium truncate">{it.name}</div>
                <div className="text-sm text-muted-foreground">{formatKES(it.price)}</div>
              </div>
              <div className="inline-flex items-center rounded-md border border-border">
                <button
                  className="h-8 w-8 inline-flex items-center justify-center"
                  onClick={() => setQty(it.productId, it.qty - 1)}
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-8 text-center text-sm">{it.qty}</span>
                <button
                  className="h-8 w-8 inline-flex items-center justify-center"
                  onClick={() => setQty(it.productId, it.qty + 1)}
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <div className="w-24 text-right font-semibold">{formatKES(it.price * it.qty)}</div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => remove(it.productId)}
                className="text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>

        <aside className="rounded-xl border border-border bg-card p-6 h-fit">
          <h2 className="font-semibold">Order summary</h2>
          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Subtotal</dt>
              <dd>{formatKES(subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Shipping</dt>
              <dd>Calculated at checkout</dd>
            </div>
          </dl>
          <div className="my-4 border-t border-border" />
          <div className="flex justify-between text-base font-semibold">
            <span>Total</span>
            <span>{formatKES(subtotal)}</span>
          </div>
          <Button asChild className="mt-6 w-full">
            <Link to="/checkout">Checkout</Link>
          </Button>
          <Button asChild variant="outline" className="mt-2 w-full">
            <Link to="/shop">Continue shopping</Link>
          </Button>
        </aside>
      </div>
    </div>
  );
}
