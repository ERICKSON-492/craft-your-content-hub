import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface Msg {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  project_type: string | null;
  message: string;
  created_at: string;
}

export default function AdminMessages() {
  const [items, setItems] = useState<Msg[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    const { data } = await supabase
      .from("contact_messages")
      .select("*")
      .order("created_at", { ascending: false });
    setItems(data ?? []);
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  async function remove(id: string) {
    const { error } = await supabase.from("contact_messages").delete().eq("id", id);
    if (error) return toast.error(error.message);
    setItems((m) => m.filter((x) => x.id !== id));
  }

  return (
    <div>
      <h1 className="text-2xl font-bold">Contact messages</h1>
      <div className="mt-6 space-y-3">
        {loading && <p className="text-muted-foreground">Loading…</p>}
        {!loading && items.length === 0 && (
          <p className="text-muted-foreground">No messages yet.</p>
        )}
        {items.map((m) => (
          <article key={m.id} className="rounded-lg border border-border p-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="font-semibold">{m.name} <span className="text-muted-foreground font-normal">· {m.email}</span></div>
                <div className="text-xs text-muted-foreground">
                  {new Date(m.created_at).toLocaleString()} {m.phone && `· ${m.phone}`} {m.project_type && `· ${m.project_type}`}
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={() => remove(m.id)}><Trash2 className="h-4 w-4" /></Button>
            </div>
            <p className="mt-3 whitespace-pre-wrap text-sm">{m.message}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
