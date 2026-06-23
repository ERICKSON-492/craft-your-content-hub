import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { toast } from "sonner";
import { formatKES } from "@/contexts/CartContext";
import { Mail, Loader2 } from "lucide-react";

const STATUSES = ["pending", "paid", "shipped", "delivered", "cancelled"] as const;
type Status = (typeof STATUSES)[number];

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
  notes: string | null;
  subtotal: number;
  total: number;
  status: Status;
  tracking_number: string | null;
  tracking_url: string | null;
  last_email_sent_at: string | null;
  created_at: string;
}
interface Item {
  id: string;
  name: string;
  unit_price: number;
  quantity: number;
  image_url: string | null;
}

const statusColors: Record<Status, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  paid: "bg-blue-100 text-blue-800",
  shipped: "bg-purple-100 text-purple-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Order | null>(null);
  const [items, setItems] = useState<Item[]>([]);
  const [filter, setFilter] = useState<Status | "all">("all");
  const [trackingNumber, setTrackingNumber] = useState("");
  const [trackingUrl, setTrackingUrl] = useState("");
  const [savingTracking, setSavingTracking] = useState(false);
  const [sendingEmail, setSendingEmail] = useState(false);

  async function load() {
    const { data } = await supabase.from("orders").select("*").order("created_at", { ascending: false });
    setOrders((data as Order[]) ?? []);
    setLoading(false);
  }
  useEffect(() => {
    load();
  }, []);

  async function openOrder(o: Order) {
    setSelected(o);
    setTrackingNumber(o.tracking_number ?? "");
    setTrackingUrl(o.tracking_url ?? "");
    const { data } = await supabase.from("order_items").select("*").eq("order_id", o.id);
    setItems((data as Item[]) ?? []);
  }

  async function updateStatus(id: string, status: Status) {
    const { error } = await supabase.from("orders").update({ status }).eq("id", id);
    if (error) return toast.error(error.message);
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
    if (selected?.id === id) setSelected({ ...selected, status });
    toast.success(`Order marked ${status} — sending update email…`);
    const { error: fnErr } = await supabase.functions.invoke("send-order-email", {
      body: { orderId: id, kind: "status_update" },
    });
    if (fnErr) toast.error(`Status saved, but email failed: ${fnErr.message}`);
    else toast.success("Update email sent");
  }

  async function saveTracking() {
    if (!selected) return;
    setSavingTracking(true);
    const { error } = await supabase
      .from("orders")
      .update({
        tracking_number: trackingNumber || null,
        tracking_url: trackingUrl || null,
      })
      .eq("id", selected.id);
    setSavingTracking(false);
    if (error) return toast.error(error.message);
    setOrders((prev) =>
      prev.map((o) =>
        o.id === selected.id
          ? { ...o, tracking_number: trackingNumber || null, tracking_url: trackingUrl || null }
          : o,
      ),
    );
    setSelected({
      ...selected,
      tracking_number: trackingNumber || null,
      tracking_url: trackingUrl || null,
    });
    toast.success("Tracking saved");
  }

  async function resendEmail(kind: "confirmation" | "status_update") {
    if (!selected) return;
    setSendingEmail(true);
    const { error } = await supabase.functions.invoke("send-order-email", {
      body: { orderId: selected.id, kind },
    });
    setSendingEmail(false);
    if (error) return toast.error(error.message);
    toast.success("Email sent");
  }

  const visible = filter === "all" ? orders : orders.filter((o) => o.status === filter);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">Orders</h1>
        <div className="flex flex-wrap gap-2">
          {(["all", ...STATUSES] as const).map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`rounded-full border px-3 py-1 text-xs capitalize transition ${
                filter === s
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border hover:border-primary/50"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-left text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="px-4 py-3">Order</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td className="px-4 py-6 text-muted-foreground" colSpan={6}>
                  Loading…
                </td>
              </tr>
            )}
            {!loading && visible.length === 0 && (
              <tr>
                <td className="px-4 py-6 text-muted-foreground" colSpan={6}>
                  No orders.
                </td>
              </tr>
            )}
            {visible.map((o) => (
              <tr key={o.id} className="border-t border-border hover:bg-muted/30">
                <td className="px-4 py-3 font-mono text-xs">#{o.id.slice(0, 8)}</td>
                <td className="px-4 py-3">
                  <div className="font-medium">{o.full_name}</div>
                  <div className="text-xs text-muted-foreground">{o.email}</div>
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {new Date(o.created_at).toLocaleDateString()}
                </td>
                <td className="px-4 py-3 font-semibold">{formatKES(Number(o.total))}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2 py-1 text-xs capitalize ${statusColors[o.status]}`}>
                    {o.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <Button size="sm" variant="outline" onClick={() => openOrder(o)}>
                    View
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Sheet open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <SheetContent className="w-full overflow-y-auto sm:max-w-lg">
          {selected && (
            <>
              <SheetHeader>
                <SheetTitle>Order #{selected.id.slice(0, 8)}</SheetTitle>
              </SheetHeader>
              <div className="mt-6 space-y-6 text-sm">
                <div>
                  <div className="text-xs uppercase tracking-wider text-muted-foreground">Status</div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {STATUSES.map((s) => (
                      <button
                        key={s}
                        onClick={() => updateStatus(selected.id, s)}
                        className={`rounded-md border px-3 py-1 text-xs capitalize transition ${
                          selected.status === s
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="text-xs uppercase tracking-wider text-muted-foreground">Tracking</div>
                  <div className="mt-2 space-y-2">
                    <Input
                      placeholder="Tracking number"
                      value={trackingNumber}
                      onChange={(e) => setTrackingNumber(e.target.value)}
                    />
                    <Input
                      placeholder="Tracking URL (https://…)"
                      value={trackingUrl}
                      onChange={(e) => setTrackingUrl(e.target.value)}
                    />
                    <div className="flex flex-wrap gap-2">
                      <Button size="sm" onClick={saveTracking} disabled={savingTracking}>
                        {savingTracking ? (
                          <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                        ) : null}
                        Save tracking
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => resendEmail("status_update")}
                        disabled={sendingEmail}
                      >
                        <Mail className="mr-1 h-3 w-3" /> Email customer
                      </Button>
                    </div>
                    {selected.last_email_sent_at && (
                      <p className="text-xs text-muted-foreground">
                        Last email: {new Date(selected.last_email_sent_at).toLocaleString()}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <div className="text-xs uppercase tracking-wider text-muted-foreground">Customer</div>
                  <p className="mt-2">
                    {selected.full_name}
                    <br />
                    {selected.email}
                    {selected.phone && (
                      <>
                        <br />
                        {selected.phone}
                      </>
                    )}
                  </p>
                </div>

                <div>
                  <div className="text-xs uppercase tracking-wider text-muted-foreground">Shipping</div>
                  <p className="mt-2">
                    {selected.address1}
                    {selected.address2 && (
                      <>
                        <br />
                        {selected.address2}
                      </>
                    )}
                    <br />
                    {selected.city}
                    {selected.postal_code ? `, ${selected.postal_code}` : ""}
                    <br />
                    {selected.country}
                  </p>
                </div>

                {selected.notes && (
                  <div>
                    <div className="text-xs uppercase tracking-wider text-muted-foreground">Notes</div>
                    <p className="mt-2 whitespace-pre-line">{selected.notes}</p>
                  </div>
                )}

                <div>
                  <div className="text-xs uppercase tracking-wider text-muted-foreground">Items</div>
                  <ul className="mt-2 space-y-3">
                    {items.map((it) => (
                      <li key={it.id} className="flex items-center gap-3">
                        <div className="h-10 w-10 overflow-hidden rounded-md bg-muted shrink-0">
                          {it.image_url && (
                            <img src={it.image_url} alt="" className="h-full w-full object-cover" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="truncate">{it.name}</div>
                          <div className="text-xs text-muted-foreground">Qty {it.quantity}</div>
                        </div>
                        <div className="font-medium">{formatKES(it.unit_price * it.quantity)}</div>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-4 flex justify-between border-t border-border pt-3 font-semibold">
                    <span>Total</span>
                    <span>{formatKES(Number(selected.total))}</span>
                  </div>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
