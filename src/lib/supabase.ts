import { createClient } from "@supabase/supabase-js";

const url = (import.meta.env.VITE_SUPABASE_URL as string) || "";
const anon = (import.meta.env.VITE_SUPABASE_ANON_KEY as string) || "";

export const isSupabaseConfigured = Boolean(url && anon);

if (!isSupabaseConfigured) {
  // eslint-disable-next-line no-console
  console.warn(
    "[supabase] Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY. Add them to a .env file. Using a stub client until then."
  );
}

// Use a harmless placeholder URL so createClient doesn't throw before env vars are set.
export const supabase = createClient(
  url || "https://placeholder.supabase.co",
  anon || "placeholder-anon-key"
);
