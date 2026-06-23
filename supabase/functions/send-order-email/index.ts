// Sends order confirmation / status update emails via Resend.
// Deploy: `supabase functions deploy send-order-email --no-verify-jwt`
// Secrets needed in your Supabase project (Edge Functions → Secrets):
//   RESEND_API_KEY     - from https://resend.com/api-keys
//   ORDER_FROM_EMAIL   - e.g. "Elite Stainless <orders@yourdomain.com>"
//   ORDER_ADMIN_EMAIL  - (optional) gets a BCC of every order
//   STORE_NAME         - (optional, default "Our Store")

import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

type Kind = "confirmation" | "status_update";

const fmtKES = (n: number) =>
  new Intl.NumberFormat("en-KE", { style: "currency", currency: "KES" }).format(n);

const statusBlurb: Record<string, string> = {
  pending: "We've received your order and will be in touch shortly to confirm payment.",
  paid: "We've received your payment. Your order is being prepared.",
  shipped: "Your order has shipped and is on its way.",
  delivered: "Your order has been delivered. Thank you for shopping with us!",
  cancelled: "Your order has been cancelled. Please reach out if this was unexpected.",
};

function renderEmail(opts: {
  storeName: string;
  order: any;
  items: any[];
  kind: Kind;
}) {
  const { storeName, order, items, kind } = opts;
  const title =
    kind === "confirmation"
      ? `Thanks for your order, ${order.full_name.split(" ")[0]}!`
      : `Order update: ${order.status}`;
  const blurb = statusBlurb[order.status] ?? "";

  const itemsHtml = items
    .map(
      (it) => `
      <tr>
        <td style="padding:10px 0;border-bottom:1px solid #eee;">
          ${it.image_url ? `<img src="${it.image_url}" width="48" height="48" style="border-radius:6px;object-fit:cover;vertical-align:middle;margin-right:10px;" />` : ""}
          <strong>${escapeHtml(it.name)}</strong>
          <div style="color:#666;font-size:12px;">Qty ${it.quantity}</div>
        </td>
        <td align="right" style="padding:10px 0;border-bottom:1px solid #eee;white-space:nowrap;">
          ${fmtKES(Number(it.unit_price) * it.quantity)}
        </td>
      </tr>`,
    )
    .join("");

  const trackingHtml =
    order.tracking_number || order.tracking_url
      ? `
      <div style="margin:24px 0;padding:16px;background:#f7f7f7;border-radius:8px;">
        <div style="font-size:12px;text-transform:uppercase;letter-spacing:.05em;color:#666;">Tracking</div>
        ${order.tracking_number ? `<div style="margin-top:6px;font-weight:600;">${escapeHtml(order.tracking_number)}</div>` : ""}
        ${order.tracking_url ? `<a href="${order.tracking_url}" style="display:inline-block;margin-top:10px;color:#111;text-decoration:underline;">Track your package →</a>` : ""}
      </div>`
      : "";

  return `<!doctype html>
<html><body style="margin:0;padding:0;background:#ffffff;font-family:Arial,sans-serif;color:#111;">
  <div style="max-width:560px;margin:0 auto;padding:32px 24px;">
    <h1 style="margin:0 0 8px;font-size:22px;">${escapeHtml(title)}</h1>
    <p style="margin:0 0 16px;color:#444;">${escapeHtml(blurb)}</p>
    <div style="font-size:13px;color:#666;">Order <strong style="color:#111;">#${order.id.slice(0, 8)}</strong></div>

    ${trackingHtml}

    <table width="100%" cellspacing="0" cellpadding="0" style="margin-top:24px;border-collapse:collapse;">
      ${itemsHtml}
      <tr>
        <td style="padding-top:14px;font-weight:600;">Total</td>
        <td align="right" style="padding-top:14px;font-weight:700;">${fmtKES(Number(order.total))}</td>
      </tr>
    </table>

    <div style="margin-top:28px;">
      <div style="font-size:12px;text-transform:uppercase;letter-spacing:.05em;color:#666;">Shipping to</div>
      <div style="margin-top:6px;line-height:1.5;">
        ${escapeHtml(order.full_name)}<br/>
        ${escapeHtml(order.address1)}${order.address2 ? `<br/>${escapeHtml(order.address2)}` : ""}<br/>
        ${escapeHtml(order.city)}${order.postal_code ? `, ${escapeHtml(order.postal_code)}` : ""}<br/>
        ${escapeHtml(order.country)}
      </div>
    </div>

    <p style="margin-top:32px;color:#666;font-size:13px;">
      Reply to this email if you have any questions.<br/>
      — ${escapeHtml(storeName)}
    </p>
  </div>
</body></html>`;
}

function escapeHtml(s: string) {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    const FROM = Deno.env.get("ORDER_FROM_EMAIL");
    const ADMIN = Deno.env.get("ORDER_ADMIN_EMAIL");
    const STORE = Deno.env.get("STORE_NAME") ?? "Our Store";
    if (!RESEND_API_KEY || !FROM) {
      return new Response(
        JSON.stringify({ error: "RESEND_API_KEY or ORDER_FROM_EMAIL not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const body = await req.json().catch(() => ({}));
    const orderId = String(body.orderId ?? "");
    const kind: Kind = body.kind === "status_update" ? "status_update" : "confirmation";
    if (!orderId) {
      return new Response(JSON.stringify({ error: "orderId required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const { data: order, error: oErr } = await supabase
      .from("orders")
      .select("*")
      .eq("id", orderId)
      .single();
    if (oErr || !order) {
      return new Response(JSON.stringify({ error: oErr?.message ?? "order not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const { data: items } = await supabase
      .from("order_items")
      .select("*")
      .eq("order_id", orderId);

    const subject =
      kind === "confirmation"
        ? `${STORE} — order confirmation #${order.id.slice(0, 8)}`
        : `${STORE} — order #${order.id.slice(0, 8)} is now ${order.status}`;

    const html = renderEmail({ storeName: STORE, order, items: items ?? [], kind });

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM,
        to: [order.email],
        bcc: ADMIN ? [ADMIN] : undefined,
        subject,
        html,
      }),
    });
    const out = await res.json().catch(() => ({}));
    if (!res.ok) {
      return new Response(JSON.stringify({ error: out, status: res.status }), {
        status: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    await supabase
      .from("orders")
      .update({ last_email_sent_at: new Date().toISOString() })
      .eq("id", orderId);

    return new Response(JSON.stringify({ ok: true, id: out.id }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: (e as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
