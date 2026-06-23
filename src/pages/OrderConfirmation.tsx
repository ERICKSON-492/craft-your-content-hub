import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { formatKES } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";

interface Order {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  address1: string;
  address2: string | null;
  city: string;
  country: string;
  postal_code: string | null;
  total: number;
  status: string;
  payment_method: string | null;
  mpesa_receipt: string | null;
  created_at: string;
}
interface Item {
  id: string;
  name: string;
  unit_price: number;
  quantity: number;
  image_url: string | null;
}

export default function OrderConfirmation() {
  const { id } = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    (async () => {
      const [{ data: o }, { data: its }] = await Promise.all([
        supabase.from("orders").select("*").eq("id", id).maybeSingle(),
        supabase.from("order_items").select("*").eq("order_id", id),
      ]);
      setOrder(o as Order | null);
      setItems((its as Item[]) ?? []);
      setLoading(false);
    })();
  }, [id]);

  if (loading) return <div className="mx-auto max-w-3xl px-6 py-24 text-muted-foreground">Loading…</div>;
  if (!order)
    return (
      <div className="mx-auto max-w-3xl px-6 py-24 text-center">
        <h1 className="text-3xl font-bold">Order not found</h1>
        <Button asChild className="mt-6">
          <Link to="/shop">Back to shop</Link>
        </Button>
      </div>
    );

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <div className="rounded-xl border border-border bg-card p-8 text-center">
        <CheckCircle2 className="mx-auto h-12 w-12 text-primary" />
        <h1 className="mt-4 text-3xl font-bold">Thank you, {order.full_name.split(" ")[0]}!</h1>
        <p className="mt-2 text-muted-foreground">
          Your order <span className="font-mono">#{order.id.slice(0, 8)}</span> has been received.
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          We've emailed a copy to {order.email}. Our team will contact you shortly to confirm payment and delivery.
        </p>
      </div>

      <div className="mt-8 rounded-xl border border-border bg-card p-6">
        <h2 className="font-semibold">Order details</h2>
        <ul className="mt-4 space-y-3 text-sm">
          {items.map((it) => (
            <li key={it.id} className="flex items-center gap-3">
              <div className="h-12 w-12 shrink-0 overflow-hidden rounded-md bg-muted">
                {it.image_url && <img src={it.image_url} alt={it.name} className="h-full w-full object-cover" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="truncate">{it.name}</div>
                <div className="text-xs text-muted-foreground">Qty {it.quantity}</div>
              </div>
              <div className="font-medium">{formatKES(it.unit_price * it.quantity)}</div>
            </li>
          ))}
        </ul>
        <div className="my-4 border-t border-border" />
        <div className="flex justify-between text-base font-semibold">
          <span>Total</span>
          <span>{formatKES(Number(order.total))}</span>
        </div>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-6">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Shipping to</h3>
          <p className="mt-2 text-sm leading-relaxed">
            {order.full_name}
            <br />
            {order.address1}
            {order.address2 ? (
              <>
                <br />
                {order.address2}
              </>
            ) : null}
            <br />
            {order.city}
            {order.postal_code ? `, ${order.postal_code}` : ""}
            <br />
            {order.country}
          </p>
        </div>
        <div className="rounded-xl border border-border bg-card p-6">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Status</h3>
          <p className="mt-2 text-sm capitalize">{order.status}</p>
          <Button asChild className="mt-4 w-full">
            <Link to="/shop">Continue shopping</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
