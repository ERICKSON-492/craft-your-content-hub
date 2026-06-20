import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

interface Project {
  id: string;
  title: string;
  location: string | null;
  description: string | null;
  image_url: string | null;
}

export default function Projects() {
  const [items, setItems] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("projects")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setItems(data ?? []);
        setLoading(false);
      });
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-6 py-20">
      <p className="text-sm uppercase tracking-widest text-primary">Our work</p>
      <h1 className="mt-2 text-5xl font-bold tracking-tight md:text-6xl">
        Projects delivered across Kenya.
      </h1>
      <p className="mt-4 max-w-2xl text-muted-foreground">
        From hotel kitchens to industrial cold rooms — a selection of stainless steel builds
        completed in our Nairobi workshop.
      </p>

      <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {loading && <p className="text-muted-foreground">Loading…</p>}
        {!loading && items.length === 0 && (
          <p className="text-muted-foreground col-span-full">Projects coming soon. Check back shortly.</p>
        )}
        {items.map((p) => (
          <article key={p.id} className="overflow-hidden rounded-2xl border border-border bg-card">
            <div className="aspect-video bg-muted">
              {p.image_url && (
                <img src={p.image_url} alt={p.title} className="h-full w-full object-cover" />
              )}
            </div>
            <div className="p-5">
              <h3 className="text-lg font-semibold">{p.title}</h3>
              {p.location && (
                <div className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">
                  {p.location}
                </div>
              )}
              {p.description && (
                <p className="mt-2 text-sm text-muted-foreground line-clamp-3">{p.description}</p>
              )}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
