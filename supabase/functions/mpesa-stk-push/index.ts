// M-Pesa STK Push (Safaricom Daraja). Lipa Na M-Pesa Online.
// Deploy: supabase functions deploy mpesa-stk-push --no-verify-jwt
// Secrets (Supabase Edge Function Secrets):
//   MPESA_ENV               "sandbox" | "production"
//   MPESA_CONSUMER_KEY
//   MPESA_CONSUMER_SECRET
//   MPESA_SHORTCODE         paybill / till number
//   MPESA_PASSKEY           Lipa na M-Pesa Online passkey
//   MPESA_CALLBACK_URL      https://<project>.functions.supabase.co/mpesa-callback

const corsHeaders: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

import { createClient } from "npm:@supabase/supabase-js@2";

function baseUrl() {
  return Deno.env.get("MPESA_ENV") === "production"
    ? "https://api.safaricom.co.ke"
    : "https://sandbox.safaricom.co.ke";
}

function normalizePhone(raw: string): string | null {
  const d = String(raw || "").replace(/\D/g, "");
  if (d.startsWith("254") && d.length === 12) return d;
  if (d.startsWith("0") && d.length === 10) return "254" + d.slice(1);
  if (d.startsWith("7") && d.length === 9) return "254" + d;
  if (d.startsWith("1") && d.length === 9) return "254" + d;
  return null;
}

function timestamp(): string {
  const d = new Date();
  const p = (n: number) => String(n).padStart(2, "0");
  return (
    d.getFullYear().toString() +
    p(d.getMonth() + 1) +
    p(d.getDate()) +
    p(d.getHours()) +
    p(d.getMinutes()) +
    p(d.getSeconds())
  );
}

async function getAccessToken(): Promise<string> {
  const key = Deno.env.get("MPESA_CONSUMER_KEY")!;
  const secret = Deno.env.get("MPESA_CONSUMER_SECRET")!;
  const basic = btoa(`${key}:${secret}`);
  const r = await fetch(`${baseUrl()}/oauth/v1/generate?grant_type=client_credentials`, {
    headers: { Authorization: `Basic ${basic}` },
  });
  const j = await r.json();
  if (!r.ok) throw new Error(`OAuth failed: ${JSON.stringify(j)}`);
  return j.access_token as string;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const body = await req.json();
    const orderId = String(body.orderId ?? "");
    const phone = normalizePhone(body.phone ?? "");
    if (!orderId || !phone) {
      return json({ error: "orderId and a valid Kenyan phone are required" }, 400);
    }

    const shortcode = Deno.env.get("MPESA_SHORTCODE");
    const passkey = Deno.env.get("MPESA_PASSKEY");
    const callbackUrl = Deno.env.get("MPESA_CALLBACK_URL");
    if (!shortcode || !passkey || !callbackUrl) {
      return json({ error: "M-Pesa secrets not configured" }, 500);
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );
    const { data: order, error: oErr } = await supabase
      .from("orders")
      .select("id, total, status")
      .eq("id", orderId)
      .single();
    if (oErr || !order) return json({ error: "Order not found" }, 404);
    if (order.status === "paid") return json({ error: "Order already paid" }, 400);

    const amount = Math.max(1, Math.round(Number(order.total)));
    const ts = timestamp();
    const password = btoa(`${shortcode}${passkey}${ts}`);
    const token = await getAccessToken();

    const stkRes = await fetch(`${baseUrl()}/mpesa/stkpush/v1/processrequest`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        BusinessShortCode: shortcode,
        Password: password,
        Timestamp: ts,
        TransactionType: "CustomerPayBillOnline",
        Amount: amount,
        PartyA: phone,
        PartyB: shortcode,
        PhoneNumber: phone,
        CallBackURL: callbackUrl,
        AccountReference: order.id.slice(0, 12),
        TransactionDesc: `Order ${order.id.slice(0, 8)}`,
      }),
    });
    const stk = await stkRes.json();
    if (!stkRes.ok || stk.ResponseCode !== "0") {
      return json({ error: "STK push failed", details: stk }, 502);
    }

    await supabase
      .from("orders")
      .update({
        payment_method: "mpesa",
        mpesa_phone: phone,
        mpesa_checkout_request_id: stk.CheckoutRequestID,
      })
      .eq("id", orderId);

    return json({
      ok: true,
      checkoutRequestId: stk.CheckoutRequestID,
      message: "STK push sent. Approve on your phone.",
    });
  } catch (e) {
    return json({ error: (e as Error).message }, 500);
  }
});

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
