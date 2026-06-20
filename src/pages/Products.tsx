import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

interface Product {
  id: string;
  name: string;
  category: string | null;
  description: string | null;
  image_url: string | null;
}

export default function Products() {
  const [items, setItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setItems(data ?? []);
        setLoading(false);
      });
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-6 py-20">
      <p className="text-sm uppercase tracking-widest text-primary">Our catalogue</p>
      <h1 className="mt-2 text-5xl font-bold tracking-tight md:text-6xl">
        Stainless steel products built to last.
      </h1>
      <p className="mt-4 max-w-2xl text-muted-foreground">
        Custom-fabricated kitchen, refrigeration and industrial stainless steel equipment —
        engineered in our Nairobi workshop.
      </p>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {loading && <p className="text-muted-foreground">Loading…</p>}
        {!loading && items.length === 0 && (
          <p className="text-muted-foreground col-span-full">No products yet. Add some from the admin panel.</p>
        )}
        {items.map((p) => (
          <div key={p.id} className="overflow-hidden rounded-2xl border border-border bg-card">
            <div className="aspect-[4/3] bg-muted">
              {p.image_url && (
                <img src={p.image_url} alt={p.name} className="h-full w-full object-cover" />
              )}
            </div>
            <div className="p-5">
              {p.category && (
                <div className="text-xs uppercase tracking-wider text-primary">{p.category}</div>
              )}
              <h3 className="mt-1 text-lg font-semibold">{p.name}</h3>
              {p.description && (
                <p className="mt-2 text-sm text-muted-foreground line-clamp-3">{p.description}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
