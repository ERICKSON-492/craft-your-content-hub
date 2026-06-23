// M-Pesa STK callback. Safaricom calls this URL after the user approves/rejects.
// Deploy: supabase functions deploy mpesa-callback --no-verify-jwt
// Set MPESA_CALLBACK_URL to the public URL of THIS function.

const corsHeaders: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

import { createClient } from "npm:@supabase/supabase-js@2";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const body = await req.json().catch(() => ({}));
    const stk = body?.Body?.stkCallback;
    if (!stk) {
      return new Response(JSON.stringify({ ResultCode: 0, ResultDesc: "ignored" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const checkoutId = stk.CheckoutRequestID as string;
    const resultCode = Number(stk.ResultCode);

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const { data: order } = await supabase
      .from("orders")
      .select("id, status")
      .eq("mpesa_checkout_request_id", checkoutId)
      .maybeSingle();

    if (!order) {
      return new Response(JSON.stringify({ ResultCode: 0, ResultDesc: "no order" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (resultCode === 0) {
      const meta: Array<{ Name: string; Value: string | number }> =
        stk.CallbackMetadata?.Item ?? [];
      const get = (n: string) => meta.find((i) => i.Name === n)?.Value;
      const receipt = String(get("MpesaReceiptNumber") ?? "");

      await supabase
        .from("orders")
        .update({ status: "paid", mpesa_receipt: receipt, paid_at: new Date().toISOString() })
        .eq("id", order.id);

      // Fire confirmation email (status update)
      try {
        await fetch(
          `${Deno.env.get("SUPABASE_URL")}/functions/v1/send-order-email`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")}`,
            },
            body: JSON.stringify({ orderId: order.id, kind: "status_update" }),
          },
        );
      } catch (_) {
        // ignore email failures
      }
    } else {
      await supabase
        .from("orders")
        .update({ notes: `M-Pesa failed: ${stk.ResultDesc ?? "cancelled"}` })
        .eq("id", order.id);
    }

    return new Response(JSON.stringify({ ResultCode: 0, ResultDesc: "ok" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(
      JSON.stringify({ ResultCode: 0, ResultDesc: (e as Error).message }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
