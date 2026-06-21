import { useEffect, useMemo, useState } from "react";
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
  const [active, setActive] = useState<string>("All");

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

  const categories = useMemo(() => {
    const set = new Set<string>();
    items.forEach((p) => set.add(p.category?.trim() || "Uncategorized"));
    return ["All", ...Array.from(set).sort()];
  }, [items]);

  const grouped = useMemo(() => {
    const groups: Record<string, Product[]> = {};
    items.forEach((p) => {
      const key = p.category?.trim() || "Uncategorized";
      (groups[key] ||= []).push(p);
    });
    return groups;
  }, [items]);

  const visibleCategories = active === "All" ? Object.keys(grouped).sort() : [active];

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

      {!loading && items.length > 0 && (
        <div className="mt-10 flex flex-wrap gap-2">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setActive(c)}
              className={`rounded-full border px-4 py-1.5 text-sm transition ${
                active === c
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card hover:border-primary/50"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      )}

      {loading && <p className="mt-12 text-muted-foreground">Loading…</p>}
      {!loading && items.length === 0 && (
        <p className="mt-12 text-muted-foreground">No products yet. Add some from the admin panel.</p>
      )}

      <div className="mt-12 space-y-16">
        {visibleCategories.map((cat) => (
          <section key={cat}>
            <div className="mb-6 flex items-end justify-between border-b border-border pb-3">
              <h2 className="text-2xl font-semibold tracking-tight">{cat}</h2>
              <span className="text-xs uppercase tracking-wider text-muted-foreground">
                {grouped[cat].length} item{grouped[cat].length === 1 ? "" : "s"}
              </span>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {grouped[cat].map((p) => (
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
          </section>
        ))}
      </div>
    </div>
  );
}
