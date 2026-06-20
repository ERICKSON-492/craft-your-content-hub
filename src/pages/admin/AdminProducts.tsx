import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Trash2, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface Product {
  id: string;
  name: string;
  category: string | null;
  description: string | null;
  image_url: string | null;
}

export default function AdminProducts() {
  const [items, setItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  // 1. Load products from the database
  async function load() {
    const { data } = await supabase.from("products").select("*").order("created_at", { ascending: false });
    setItems(data ?? []);
    setLoading(false);
  }
  
  useEffect(() => { 
    load(); 
  }, []);

  // 2. Add product (Handles file upload + DB insert)
  async function add(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setUploading(true);
    
    const fd = new FormData(e.currentTarget);
    const file = fd.get("image_file") as File;
    let publicUrl = "";

    // Check if an image file was selected
    if (file && file.size > 0) {
      // Generate a unique filename using timestamp and random string
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `uploads/${fileName}`;

      // Upload file to your Supabase storage bucket named 'product-images'
      const { error: uploadError } = await supabase.storage
        .from("product-images")
        .upload(filePath, file);

      if (uploadError) {
        setUploading(false);
        return toast.error(`File upload failed: ${uploadError.message}`);
      }

      // Get the public URL of the uploaded image file
      const { data: urlData } = supabase.storage
        .from("product-images")
        .getPublicUrl(filePath);
        
      publicUrl = urlData.publicUrl;
    }

    // Insert the product record into the database table
    const { error: dbError } = await supabase.from("products").insert({
      name: fd.get("name"),
      category: fd.get("category"),
      description: fd.get("description"),
      image_url: publicUrl || null, // Saves the generated Supabase URL string
    });

    setUploading(false);

    if (dbError) return toast.error(dbError.message);
    
    (e.target as HTMLFormElement).reset();
    toast.success("Product added successfully!");
    load();
  }

  // 3. Remove a product from the database
  async function remove(id: string) {
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) return toast.error(error.message);
    setItems((i) => i.filter((p) => p.id !== id));
    toast.success("Product deleted");
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold">Products</h1>
      
      {/* Product Submission Form */}
      <form onSubmit={add} className="mt-6 grid gap-4 rounded-xl border border-border bg-muted/30 p-5 md:grid-cols-2">
        <div>
          <Label>Name</Label>
          <Input name="name" required />
        </div>
        <div>
          <Label>Category</Label>
          <Input name="category" placeholder="Kitchen, Refrigeration…" />
        </div>
        
        {/* Swapped URL Input for a File Input */}
        <div className="md:col-span-2">
          <Label>Product Image</Label>
          <Input name="image_file" type="file" accept="image/*" required />
        </div>
        
        <div className="md:col-span-2">
          <Label>Description</Label>
          <Textarea name="description" rows={3} />
        </div>
        
        <div className="md:col-span-2">
          <Button type="submit" disabled={uploading} className="w-full md:w-auto">
            {uploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading item...
              </>
            ) : (
              "Add product"
            )}
          </Button>
        </div>
      </form>

      {/* Product List View */}
      <div className="mt-8 space-y-3">
        {loading && <p className="text-muted-foreground">Loading…</p>}
        {!loading && items.length === 0 && <p className="text-muted-foreground">No products yet.</p>}
        
        {items.map((p) => (
          <div key={p.id} className="flex items-center gap-4 rounded-lg border border-border p-3">
            <div className="h-14 w-14 shrink-0 rounded-md bg-muted overflow-hidden border border-border">
              {p.image_url && (
                <img 
                  src={p.image_url} 
                  alt={p.name || "Product"} 
                  className="h-full w-full object-cover" 
                />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-medium truncate">{p.name}</div>
              <div className="text-xs text-muted-foreground">{p.category || "No Category"}</div>
            </div>
            <Button variant="ghost" size="icon" onClick={() => remove(p.id)} className="text-destructive hover:text-destructive hover:bg-destructive/10">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
