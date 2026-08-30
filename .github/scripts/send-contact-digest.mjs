const required = [
  "SUPABASE_URL",
  "SUPABASE_SERVICE_ROLE_KEY",
  "RESEND_API_KEY",
  "CONTACT_DIGEST_FROM_EMAIL",
  "CONTACT_DIGEST_TO_EMAIL",
];

for (const key of required) {
  if (!process.env[key]) throw new Error(`${key} is required`);
}

const supabaseUrl = process.env.SUPABASE_URL.replace(/\/$/, "");
const headers = {
  apikey: process.env.SUPABASE_SERVICE_ROLE_KEY,
  Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
  "Content-Type": "application/json",
};
const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
const response = await fetch(
  `${supabaseUrl}/rest/v1/contact_messages?select=id,name,email,phone,project_type,message,created_at&created_at=gte.${encodeURIComponent(since)}&order=created_at.asc`,
  { headers },
);

if (!response.ok) throw new Error(`Supabase query failed: ${response.status} ${await response.text()}`);
const messages = await response.json();
if (!messages.length) {
  console.log("No new contact messages in the last seven days.");
  process.exit(0);
}

const escapeHtml = (value) =>
  String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

const rows = messages
  .map(
    (message) => `
      <tr>
        <td style="padding:14px 0;border-bottom:1px solid #e5e7eb;vertical-align:top;">
          <strong>${escapeHtml(message.name)}</strong>
          <div style="margin-top:4px;color:#64748b;font-size:13px;">
            ${escapeHtml(message.email)}${message.phone ? ` · ${escapeHtml(message.phone)}` : ""}
          </div>
          ${message.project_type ? `<div style="margin-top:4px;color:#0f766e;font-size:12px;text-transform:uppercase;letter-spacing:.06em;">${escapeHtml(message.project_type)}</div>` : ""}
          <p style="margin:10px 0 0;line-height:1.55;white-space:pre-wrap;">${escapeHtml(message.message)}</p>
          <div style="margin-top:8px;color:#94a3b8;font-size:12px;">${new Date(message.created_at).toLocaleString("en-KE", { timeZone: "Africa/Nairobi" })}</div>
        </td>
      </tr>`,
  )
  .join("");

const html = `<!doctype html><html><body style="margin:0;background:#f8fafc;font-family:Arial,sans-serif;color:#0f172a;">
  <main style="max-width:620px;margin:0 auto;padding:32px 22px;">
    <div style="background:#0f172a;color:#fff;border-radius:16px;padding:24px;">
      <div style="font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:#93c5fd;">Elite Stainless</div>
      <h1 style="margin:10px 0 0;font-size:26px;">Weekly contact digest</h1>
      <p style="margin:10px 0 0;color:#cbd5e1;">${messages.length} new ${messages.length === 1 ? "inquiry" : "inquiries"} received in the last seven days.</p>
    </div>
    <table width="100%" cellspacing="0" cellpadding="0" style="margin-top:22px;border-collapse:collapse;">${rows}</table>
    <p style="margin:26px 0 0;color:#64748b;font-size:13px;">Reply directly to customers using the email addresses above, or manage messages in the admin panel.</p>
  </main>
</body></html>`;

const emailResponse = await fetch("https://api.resend.com/emails", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    from: process.env.CONTACT_DIGEST_FROM_EMAIL,
    to: [process.env.CONTACT_DIGEST_TO_EMAIL],
    subject: `Elite Stainless — ${messages.length} new contact ${messages.length === 1 ? "inquiry" : "inquiries"}`,
    html,
  }),
});

if (!emailResponse.ok) throw new Error(`Resend request failed: ${emailResponse.status} ${await emailResponse.text()}`);
console.log(`Sent digest for ${messages.length} contact messages.`);
