import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { z } from "zod";
import { supabase } from "@/lib/supabase";
import { useCart, formatKES } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const schema = z.object({
  full_name: z.string().trim().min(2, "Name is required").max(100),
  email: z.string().trim().email("Invalid email").max(255),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  address1: z.string().trim().min(3, "Address is required").max(200),
  address2: z.string().trim().max(200).optional().or(z.literal("")),
  city: z.string().trim().min(2, "City is required").max(80),
  country: z.string().trim().min(2, "Country is required").max(80),
  postal_code: z.string().trim().max(20).optional().or(z.literal("")),
  notes: z.string().trim().max(1000).optional().or(z.literal("")),
});

export default function Checkout() {
  const { items, subtotal, clear } = useCart();
  const { user } = useAuth();
  const nav = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [payMethod, setPayMethod] = useState<"mpesa" | "manual">("mpesa");
  const [mpesaPhone, setMpesaPhone] = useState("");
  const [stkSent, setStkSent] = useState<string | null>(null);

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-24 text-center">
        <h1 className="text-3xl font-bold">Your cart is empty</h1>
        <Button asChild className="mt-6">
          <Link to="/shop">Go to shop</Link>
        </Button>
      </div>
    );
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const parsed = schema.safeParse(Object.fromEntries(fd.entries()));
    if (!parsed.success) {
      return toast.error(parsed.error.issues[0]?.message ?? "Please check the form");
    }
    if (payMethod === "mpesa") {
      const d = mpesaPhone.replace(/\D/g, "");
      const ok =
        (d.startsWith("254") && d.length === 12) ||
        (d.startsWith("0") && d.length === 10) ||
        ((d.startsWith("7") || d.startsWith("1")) && d.length === 9);
      if (!ok) return toast.error("Enter a valid M-Pesa phone (e.g. 0712 345 678)");
    }
    setSubmitting(true);

    const { data: order, error } = await supabase
      .from("orders")
      .insert({
        user_id: user?.id ?? null,
        ...parsed.data,
        subtotal,
        total: subtotal,
        status: "pending",
        payment_method: payMethod,
        mpesa_phone: payMethod === "mpesa" ? mpesaPhone : null,
      })
      .select("id")
      .single();

    if (error || !order) {
      setSubmitting(false);
      return toast.error(error?.message ?? "Could not place order");
    }

    const { error: itemsError } = await supabase.from("order_items").insert(
      items.map((it) => ({
        order_id: order.id,
        product_id: it.productId,
        name: it.name,
        unit_price: it.price,
        quantity: it.qty,
        image_url: it.image,
      })),
    );

    if (itemsError) {
      setSubmitting(false);
      // Stock-trigger errors are surfaced here
      if (/Insufficient stock/i.test(itemsError.message)) {
        // Best-effort: delete the orphan order so it doesn't clutter admin
        await supabase.from("orders").delete().eq("id", order.id);
      }
      return toast.error(itemsError.message);
    }

    // Fire-and-forget confirmation email
    supabase.functions
      .invoke("send-order-email", { body: { orderId: order.id, kind: "confirmation" } })
      .catch(() => {});

    if (payMethod === "mpesa") {
      const { data: stk, error: stkErr } = await supabase.functions.invoke("mpesa-stk-push", {
        body: { orderId: order.id, phone: mpesaPhone },
      });
      if (stkErr || (stk as { error?: string })?.error) {
        setSubmitting(false);
        return toast.error(
          (stk as { error?: string })?.error ?? stkErr?.message ?? "M-Pesa request failed",
        );
      }
      setStkSent(order.id);
      setSubmitting(false);
      toast.success("STK push sent. Check your phone to approve.");
      // Redirect after a moment; confirmation page will reflect status
      setTimeout(() => {
        clear();
        nav(`/order-confirmation/${order.id}`);
      }, 1500);
      return;
    }

    clear();
    nav(`/order-confirmation/${order.id}`);
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <h1 className="text-3xl font-bold tracking-tight">Checkout</h1>

      <form onSubmit={onSubmit} className="mt-8 grid gap-8 md:grid-cols-[1fr_360px]">
        <div className="space-y-6 rounded-xl border border-border bg-card p-6">
          <h2 className="font-semibold">Shipping details</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="md:col-span-2">
              <Label>Full name</Label>
              <Input name="full_name" required defaultValue={user?.user_metadata?.full_name ?? ""} />
            </div>
            <div>
              <Label>Email</Label>
              <Input name="email" type="email" required defaultValue={user?.email ?? ""} />
            </div>
            <div>
              <Label>Phone</Label>
              <Input name="phone" />
            </div>
            <div className="md:col-span-2">
              <Label>Address line 1</Label>
              <Input name="address1" required />
            </div>
            <div className="md:col-span-2">
              <Label>Address line 2 (optional)</Label>
              <Input name="address2" />
            </div>
            <div>
              <Label>City</Label>
              <Input name="city" required />
            </div>
            <div>
              <Label>Postal code</Label>
              <Input name="postal_code" />
            </div>
            <div className="md:col-span-2">
              <Label>Country</Label>
              <Input name="country" required defaultValue="Kenya" />
            </div>
            <div className="md:col-span-2">
              <Label>Order notes (optional)</Label>
              <Textarea name="notes" rows={3} />
            </div>
          </div>
        </div>

        <aside className="rounded-xl border border-border bg-card p-6 h-fit">
          <h2 className="font-semibold">Your order</h2>
          <ul className="mt-4 space-y-3 text-sm">
            {items.map((it) => (
              <li key={it.productId} className="flex justify-between gap-3">
                <span className="truncate">
                  {it.name} <span className="text-muted-foreground">× {it.qty}</span>
                </span>
                <span className="shrink-0">{formatKES(it.price * it.qty)}</span>
              </li>
            ))}
          </ul>
          <div className="my-4 border-t border-border" />
          <div className="flex justify-between text-base font-semibold">
            <span>Total</span>
            <span>{formatKES(subtotal)}</span>
          </div>
          <Button type="submit" className="mt-6 w-full" disabled={submitting}>
            {submitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Placing order…
              </>
            ) : (
              "Place order"
            )}
          </Button>
          <p className="mt-3 text-xs text-muted-foreground">
            We'll contact you to confirm payment and delivery.
          </p>
        </aside>
      </form>
    </div>
  );
}
