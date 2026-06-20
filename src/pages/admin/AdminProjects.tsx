import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface Project {
  id: string;
  title: string;
  location: string | null;
  description: string | null;
  image_url: string | null;
}

export default function AdminProjects() {
  const [items, setItems] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    const { data } = await supabase.from("projects").select("*").order("created_at", { ascending: false });
    setItems(data ?? []);
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  async function add(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const { error } = await supabase.from("projects").insert({
      title: fd.get("title"),
      location: fd.get("location"),
      description: fd.get("description"),
      image_url: fd.get("image_url"),
    });
    if (error) return toast.error(error.message);
    (e.target as HTMLFormElement).reset();
    toast.success("Project added");
    load();
  }

  async function remove(id: string) {
    const { error } = await supabase.from("projects").delete().eq("id", id);
    if (error) return toast.error(error.message);
    setItems((i) => i.filter((p) => p.id !== id));
  }

  return (
    <div>
      <h1 className="text-2xl font-bold">Projects</h1>
      <form onSubmit={add} className="mt-6 grid gap-4 rounded-xl border border-border bg-muted/30 p-5 md:grid-cols-2">
        <div><Label>Title</Label><Input name="title" required /></div>
        <div><Label>Location</Label><Input name="location" placeholder="Nairobi, Kenya" /></div>
        <div className="md:col-span-2"><Label>Image URL</Label><Input name="image_url" placeholder="https://…" /></div>
        <div className="md:col-span-2"><Label>Description</Label><Textarea name="description" rows={3} /></div>
        <div className="md:col-span-2"><Button type="submit">Add project</Button></div>
      </form>

      <div className="mt-8 space-y-3">
        {loading && <p className="text-muted-foreground">Loading…</p>}
        {!loading && items.length === 0 && <p className="text-muted-foreground">No projects yet.</p>}
        {items.map((p) => (
          <div key={p.id} className="flex items-center gap-4 rounded-lg border border-border p-3">
            <div className="h-14 w-20 shrink-0 rounded-md bg-muted overflow-hidden">
              {p.image_url && <img src={p.image_url} alt="" className="h-full w-full object-cover" />}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-medium truncate">{p.title}</div>
              <div className="text-xs text-muted-foreground">{p.location}</div>
            </div>
            <Button variant="ghost" size="icon" onClick={() => remove(p.id)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
