import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Trash2, ArrowUp, ArrowDown, Loader2, Upload } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface Service {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  sort_order: number;
}

const BUCKET = "site-images";

async function uploadImage(file: File, folder: string): Promise<string> {
  const ext = file.name.split(".").pop();
  const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const { error } = await supabase.storage.from(BUCKET).upload(path, file);
  if (error) throw error;
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

export default function AdminServices() {
  const [items, setItems] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [replacingId, setReplacingId] = useState<string | null>(null);

  async function load() {
    const { data } = await supabase
      .from("services")
      .select("*")
      .order("sort_order", { ascending: true });
    setItems(data ?? []);
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  async function add(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setUploading(true);
    const fd = new FormData(e.currentTarget);
    const file = fd.get("image_file") as File;
    let image_url: string | null = null;
    try {
      if (file && file.size > 0) image_url = await uploadImage(file, "services");
    } catch (err: any) {
      setUploading(false);
      return toast.error(`Upload failed: ${err.message}`);
    }
    const nextOrder = items.length ? Math.max(...items.map((i) => i.sort_order)) + 1 : 0;
    const { error } = await supabase.from("services").insert({
      title: fd.get("title"),
      description: fd.get("description"),
      image_url,
      sort_order: nextOrder,
    });
    setUploading(false);
    if (error) return toast.error(error.message);
    (e.target as HTMLFormElement).reset();
    toast.success("Service added");
    load();
  }

  async function remove(id: string) {
    const { error } = await supabase.from("services").delete().eq("id", id);
    if (error) return toast.error(error.message);
    setItems((i) => i.filter((s) => s.id !== id));
  }

  async function updateField(id: string, patch: Partial<Service>) {
    const { error } = await supabase.from("services").update(patch).eq("id", id);
    if (error) return toast.error(error.message);
    setItems((arr) => arr.map((s) => (s.id === id ? { ...s, ...patch } : s)));
  }

  async function replaceImage(id: string, file: File) {
    setReplacingId(id);
    try {
      const url = await uploadImage(file, "services");
      await updateField(id, { image_url: url });
      toast.success("Image updated");
    } catch (err: any) {
      toast.error(`Upload failed: ${err.message}`);
    } finally {
      setReplacingId(null);
    }
  }

  async function move(idx: number, dir: -1 | 1) {
    const j = idx + dir;
    if (j < 0 || j >= items.length) return;
    const a = items[idx];
    const b = items[j];
    await Promise.all([
      supabase.from("services").update({ sort_order: b.sort_order }).eq("id", a.id),
      supabase.from("services").update({ sort_order: a.sort_order }).eq("id", b.id),
    ]);
    load();
  }

  return (
    <div>
      <h1 className="text-2xl font-bold">Services</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Cards shown in the "From concept to installation" section on the home page.
      </p>

      <form
        onSubmit={add}
        className="mt-6 grid gap-4 rounded-xl border border-border bg-muted/30 p-5 md:grid-cols-2"
      >
        <div>
          <Label>Title</Label>
          <Input name="title" required />
        </div>
        <div>
          <Label>Image</Label>
          <Input name="image_file" type="file" accept="image/*" />
        </div>
        <div className="md:col-span-2">
          <Label>Description</Label>
          <Textarea name="description" rows={3} />
        </div>
        <div className="md:col-span-2">
          <Button type="submit" disabled={uploading}>
            {uploading ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" />Uploading…</>) : "Add service"}
          </Button>
        </div>
      </form>

      <div className="mt-8 space-y-4">
        {loading && <p className="text-muted-foreground">Loading…</p>}
        {!loading && items.length === 0 && (
          <p className="text-muted-foreground">No services yet.</p>
        )}
        {items.map((s, idx) => (
          <div key={s.id} className="rounded-lg border border-border p-4">
            <div className="flex gap-4">
              <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-md bg-muted">
                {s.image_url && (
                  <img src={s.image_url} alt="" className="h-full w-full object-cover" />
                )}
                <label className="absolute inset-0 flex cursor-pointer items-center justify-center bg-black/50 opacity-0 transition hover:opacity-100">
                  {replacingId === s.id ? (
                    <Loader2 className="h-5 w-5 animate-spin text-white" />
                  ) : (
                    <Upload className="h-5 w-5 text-white" />
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) replaceImage(s.id, f);
                    }}
                  />
                </label>
              </div>
              <div className="flex-1 grid gap-3 md:grid-cols-2">
                <div>
                  <Label>Title</Label>
                  <Input
                    value={s.title}
                    onChange={(e) =>
                      setItems((arr) =>
                        arr.map((x) => (x.id === s.id ? { ...x, title: e.target.value } : x)),
                      )
                    }
                    onBlur={(e) => updateField(s.id, { title: e.target.value })}
                  />
                </div>
                <div className="md:col-span-2">
                  <Label>Description</Label>
                  <Textarea
                    rows={2}
                    value={s.description ?? ""}
                    onChange={(e) =>
                      setItems((arr) =>
                        arr.map((x) =>
                          x.id === s.id ? { ...x, description: e.target.value } : x,
                        ),
                      )
                    }
                    onBlur={(e) => updateField(s.id, { description: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <Button variant="ghost" size="icon" onClick={() => move(idx, -1)}>
                  <ArrowUp className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => move(idx, 1)}>
                  <ArrowDown className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => remove(s.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
