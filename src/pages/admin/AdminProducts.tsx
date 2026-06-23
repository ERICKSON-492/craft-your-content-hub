import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Trash2, Loader2, Pencil, X } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { formatKES } from "@/contexts/CartContext";

interface Product {
  id: string;
  name: string;
  category: string | null;
  description: string | null;
  price: number;
  image_url: string | null;
  images: string[] | null;
  stock: number | null;
}

async function uploadOne(file: File): Promise<string> {
  const ext = file.name.split(".").pop();
  const path = `products/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const { error } = await supabase.storage.from("site-images").upload(path, file);
  if (error) throw error;
  const { data } = supabase.storage.from("site-images").getPublicUrl(path);
  return data.publicUrl;
}

export default function AdminProducts() {
  const [items, setItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [editImages, setEditImages] = useState<string[]>([]);
  const [savingEdit, setSavingEdit] = useState(false);

  async function load() {
    const { data } = await supabase.from("products").select("*").order("created_at", { ascending: false });
    setItems((data as Product[]) ?? []);
    setLoading(false);
  }
  useEffect(() => {
    load();
  }, []);

  async function add(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setUploading(true);
    try {
      const fd = new FormData(e.currentTarget);
      const files = fd.getAll("image_files") as File[];
      const valid = files.filter((f) => f && f.size > 0);
      if (valid.length === 0) {
        setUploading(false);
        return toast.error("Please add at least one image");
      }
      const urls = await Promise.all(valid.map(uploadOne));

      const { error } = await supabase.from("products").insert({
        name: fd.get("name"),
        category: fd.get("category"),
        description: fd.get("description"),
        price: Number(fd.get("price") || 0),
        image_url: urls[0],
        images: urls,
      });
      if (error) throw error;

      (e.target as HTMLFormElement).reset();
      toast.success("Product added");
      load();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Upload failed";
      toast.error(msg);
    } finally {
      setUploading(false);
    }
  }

  function startEdit(p: Product) {
    setEditing(p);
    setEditImages(p.images && p.images.length ? p.images : p.image_url ? [p.image_url] : []);
  }

  async function saveEdit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!editing) return;
    setSavingEdit(true);
    try {
      const fd = new FormData(e.currentTarget);
      const files = (fd.getAll("new_images") as File[]).filter((f) => f && f.size > 0);
      const uploaded = files.length ? await Promise.all(files.map(uploadOne)) : [];
      const images = [...editImages, ...uploaded];
      if (images.length === 0) {
        setSavingEdit(false);
        return toast.error("At least one image is required");
      }
      const { error } = await supabase
        .from("products")
        .update({
          name: fd.get("name"),
          category: fd.get("category"),
          description: fd.get("description"),
          price: Number(fd.get("price") || 0),
          stock: fd.get("stock") === "" || fd.get("stock") === null ? null : Number(fd.get("stock")),
          image_url: images[0],
          images,
        })
        .eq("id", editing.id);
      if (error) throw error;
      toast.success("Product updated");
      setEditing(null);
      load();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Update failed");
    } finally {
      setSavingEdit(false);
    }
  }

  async function remove(id: string) {
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) return toast.error(error.message);
    setItems((i) => i.filter((p) => p.id !== id));
    toast.success("Product deleted");
  }

  if (editing) {
    return (
      <div>
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Edit product</h1>
          <Button variant="ghost" size="sm" onClick={() => setEditing(null)}>
            <X className="mr-1 h-4 w-4" /> Cancel
          </Button>
        </div>

        <form
          onSubmit={saveEdit}
          className="mt-6 grid gap-4 rounded-xl border border-border bg-muted/30 p-5 md:grid-cols-2"
        >
          <div>
            <Label>Name</Label>
            <Input name="name" required defaultValue={editing.name} />
          </div>
          <div>
            <Label>Category</Label>
            <Input name="category" defaultValue={editing.category ?? ""} />
          </div>
          <div>
            <Label>Price (KES)</Label>
            <Input name="price" type="number" min="0" step="1" required defaultValue={editing.price} />
          </div>
          <div>
            <Label>Stock (leave blank = unlimited)</Label>
            <Input name="stock" type="number" min="0" step="1" defaultValue={editing.stock ?? ""} />
          </div>
          <div>
            <Label>Add more images (optional)</Label>
            <Input name="new_images" type="file" accept="image/*" multiple />
          </div>
          <div className="md:col-span-2">
            <Label>Description</Label>
            <Textarea name="description" rows={3} defaultValue={editing.description ?? ""} />
          </div>

          <div className="md:col-span-2">
            <Label>Current images (click × to remove)</Label>
            <div className="mt-2 flex flex-wrap gap-3">
              {editImages.map((url, idx) => (
                <div key={url + idx} className="relative h-20 w-20 overflow-hidden rounded-md border border-border">
                  <img src={url} alt="" className="h-full w-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setEditImages((arr) => arr.filter((_, i) => i !== idx))}
                    className="absolute right-0 top-0 rounded-bl-md bg-black/70 px-1 text-xs text-white"
                    aria-label="Remove image"
                  >
                    ×
                  </button>
                  {idx === 0 && (
                    <div className="absolute bottom-0 left-0 right-0 bg-black/60 py-0.5 text-center text-[10px] text-white">
                      main
                    </div>
                  )}
                </div>
              ))}
              {editImages.length === 0 && (
                <p className="text-xs text-muted-foreground">No images. Add new ones above.</p>
              )}
            </div>
          </div>

          <div className="md:col-span-2 flex gap-2">
            <Button type="submit" disabled={savingEdit}>
              {savingEdit ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving…
                </>
              ) : (
                "Save changes"
              )}
            </Button>
            <Button type="button" variant="outline" onClick={() => setEditing(null)}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold">Shop products</h1>

      <form
        onSubmit={add}
        className="mt-6 grid gap-4 rounded-xl border border-border bg-muted/30 p-5 md:grid-cols-2"
      >
        <div>
          <Label>Name</Label>
          <Input name="name" required />
        </div>
        <div>
          <Label>Category</Label>
          <Input name="category" placeholder="Kitchen, Refrigeration…" />
        </div>
        <div>
          <Label>Price (KES)</Label>
          <Input name="price" type="number" min="0" step="1" required />
        </div>
        <div>
          <Label>Images (select multiple)</Label>
          <Input name="image_files" type="file" accept="image/*" multiple required />
        </div>
        <div className="md:col-span-2">
          <Label>Description</Label>
          <Textarea name="description" rows={3} />
        </div>
        <div className="md:col-span-2">
          <Button type="submit" disabled={uploading}>
            {uploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Uploading…
              </>
            ) : (
              "Add product"
            )}
          </Button>
        </div>
      </form>

      <div className="mt-8 space-y-3">
        {loading && <p className="text-muted-foreground">Loading…</p>}
        {!loading && items.length === 0 && <p className="text-muted-foreground">No products yet.</p>}
        {items.map((p) => {
          const imgs = p.images && p.images.length ? p.images : [p.image_url].filter(Boolean);
          return (
            <div key={p.id} className="flex items-center gap-4 rounded-lg border border-border p-3">
              <div className="h-14 w-14 shrink-0 overflow-hidden rounded-md border border-border bg-muted">
                {imgs[0] && <img src={imgs[0] as string} alt={p.name} className="h-full w-full object-cover" />}
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate font-medium">{p.name}</div>
                <div className="text-xs text-muted-foreground">
                  {p.category || "No category"} · {formatKES(Number(p.price) || 0)} · {imgs.length} image
                  {imgs.length === 1 ? "" : "s"}
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={() => startEdit(p)} aria-label="Edit">
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => remove(p.id)}
                className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                aria-label="Delete"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
