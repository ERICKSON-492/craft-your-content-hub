import { useEffect, useMemo, useRef, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useCart, formatKES } from "@/contexts/CartContext";
import { Search, ShoppingCart, Minus, Plus, X } from "lucide-react";
import { toast } from "sonner";
import { useSearchParams } from "react-router-dom";
import { CATEGORIES } from "@/lib/categories";
import { Input } from "@/components/ui/input";

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

export default function Shop() {
  const [items, setItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState<string>("All");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Product | null>(null);
  const [searchParams] = useSearchParams();
  const [activeImg, setActiveImg] = useState(0);
  const [qty, setQty] = useState(1);
  const { add } = useCart();

  useEffect(() => {
    const categoryFromUrl = searchParams.get("cat");
    if (categoryFromUrl) setActive(categoryFromUrl);
  }, [searchParams]);

  useEffect(() => {
    supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setItems((data as Product[]) ?? []);
        setLoading(false);
      });
  }, []);

  const gridRef = useRef<HTMLDivElement | null>(null);

  const filteredItems = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return items.filter((p) => {
      const matchesCategory =
        active === "All" || (p.category?.trim() || "Uncategorized") === active;
      const searchableText = [p.name, p.category, p.description]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return matchesCategory && (!normalizedQuery || searchableText.includes(normalizedQuery));
    });
  }, [active, items, query]);

  const grouped = useMemo(() => {
    const groups: Record<string, Product[]> = {};
    filteredItems.forEach((p) => {
      const key = p.category?.trim() || "Uncategorized";
      (groups[key] ||= []).push(p);
    });
    return groups;
  }, [filteredItems]);

  const visibleCategories = Object.keys(grouped).sort();

  function imagesOf(p: Product): string[] {
    const arr = (p.images && p.images.length ? p.images : [p.image_url]).filter(
      Boolean,
    ) as string[];
    return arr;
  }

  function openProduct(p: Product) {
    setSelected(p);
    setActiveImg(0);
    setQty(1);
  }

  function addToCart(p: Product, q = 1) {
    if (p.stock !== null && p.stock <= 0) {
      toast.error(`${p.name} is out of stock`);
      return;
    }
    if (p.stock !== null && q > p.stock) {
      toast.error(`Only ${p.stock} in stock`);
      return;
    }
    const imgs = imagesOf(p);
    add({ productId: p.id, name: p.name, price: Number(p.price) || 0, image: imgs[0] ?? null }, q);
    toast.success(`${p.name} added to cart`);
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-20">
      <p className="text-sm uppercase tracking-widest text-primary">Our shop</p>
      <h1 className="mt-2 text-5xl font-bold tracking-tight md:text-6xl">
        Stainless steel products built to last.
      </h1>
      <p className="mt-4 max-w-2xl text-muted-foreground">
        Custom-fabricated kitchen, refrigeration and industrial stainless steel equipment —
        engineered in our Nairobi workshop.
      </p>

      <div className="mt-8 flex flex-col gap-3 rounded-2xl border border-border/70 bg-card/70 p-3 shadow-sm sm:flex-row sm:items-center">
        <div className="relative min-w-0 flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search products, categories, or materials…"
            aria-label="Search products"
            className="h-11 border-0 bg-transparent pl-10 pr-10 shadow-none focus-visible:ring-0"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="Clear product search"
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-muted-foreground transition hover:bg-muted hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <div className="px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground sm:border-l sm:border-border sm:pl-4">
          {filteredItems.length} result{filteredItems.length === 1 ? "" : "s"}
        </div>
      </div>

      {/* Scrollable category pill strip */}
      {!loading && (
        <div className="mt-10 -mx-6 px-6 overflow-x-auto scrollbar-none">
          <div className="flex gap-2 w-max pb-1">
            <button
              onClick={() => setActive("All")}
              className={`inline-flex items-center gap-1.5 rounded-full border px-4 py-1.5 text-sm font-medium whitespace-nowrap transition
                ${
                  active === "All"
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card text-muted-foreground hover:border-primary/60 hover:text-foreground"
                }`}
            >
              All
            </button>
            {CATEGORIES.map((c) => {
              const count = grouped[c.name]?.length ?? 0;
              return (
                <button
                  key={c.name}
                  onClick={() => {
                    setActive(c.name);
                    requestAnimationFrame(() =>
                      gridRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }),
                    );
                  }}
                  className={`inline-flex items-center gap-1.5 rounded-full border px-4 py-1.5 text-sm font-medium whitespace-nowrap transition
                    ${
                      active === c.name
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-card text-muted-foreground hover:border-primary/60 hover:text-foreground"
                    }`}
                >
                  {c.name}
                  <span
                    className={`text-[11px] tabular-nums ${active === c.name ? "text-primary-foreground/70" : "text-muted-foreground"}`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {loading && <p className="mt-12 text-muted-foreground">Loading…</p>}
      {!loading && items.length === 0 && (
        <p className="mt-12 text-muted-foreground">
          No products yet. Add some from the admin panel.
        </p>
      )}

      <div ref={gridRef} className="mt-12 space-y-16">
        {!loading && items.length > 0 && filteredItems.length === 0 && (
          <div className="rounded-2xl border border-dashed border-border bg-muted/30 px-6 py-14 text-center">
            <Search className="mx-auto h-8 w-8 text-muted-foreground" />
            <h2 className="mt-4 text-xl font-semibold">No matching products</h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
              Try a different search term or clear the current filters to browse the full catalogue.
            </p>
            <Button
              variant="outline"
              className="mt-5"
              onClick={() => {
                setQuery("");
                setActive("All");
              }}
            >
              Clear filters
            </Button>
          </div>
        )}
        {visibleCategories.map((cat) => (
          <section key={cat}>
            <div className="mb-6 flex items-end justify-between border-b border-border pb-3">
              <h2 className="text-2xl font-semibold tracking-tight">{cat}</h2>
              <span className="text-xs uppercase tracking-wider text-muted-foreground">
                {grouped[cat].length} item{grouped[cat].length === 1 ? "" : "s"}
              </span>
            </div>
            <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {grouped[cat].map((p) => {
                const imgs = imagesOf(p);
                return (
                  <div
                    key={p.id}
                    className="group overflow-hidden rounded-xl border border-border bg-card transition hover:shadow-md"
                  >
                    <button onClick={() => openProduct(p)} className="block w-full text-left">
                      <div className="aspect-[4/3] max-h-24 bg-muted overflow-hidden">
                        {imgs[0] && (
                          <img
                            src={imgs[0]}
                            alt={p.name}
                            className="h-full w-full object-cover transition group-hover:scale-105"
                          />
                        )}
                      </div>
                      <div className="p-2">
                        {p.category && (
                          <div className="text-[9px] uppercase tracking-wider text-primary">
                            {p.category}
                          </div>
                        )}
                        <h3 className="mt-0.5 text-xs font-semibold leading-snug">{p.name}</h3>
                        <div className="mt-0.5 text-xs font-semibold">
                          {formatKES(Number(p.price) || 0)}
                        </div>
                        {p.stock !== null && (
                          <div
                            className={`mt-0.5 text-[10px] ${p.stock <= 0 ? "text-destructive" : p.stock < 5 ? "text-amber-600" : "text-muted-foreground"}`}
                          >
                            {p.stock <= 0 ? "Out of stock" : `${p.stock} in stock`}
                          </div>
                        )}
                        {p.description && (
                          <p className="mt-0.5 text-[11px] text-muted-foreground line-clamp-2">
                            {p.description}
                          </p>
                        )}
                      </div>
                    </button>
                    <div className="px-2 pb-2">
                      <Button
                        size="sm"
                        className="w-full text-[11px] h-7"
                        onClick={() => addToCart(p)}
                        disabled={p.stock !== null && p.stock <= 0}
                      >
                        <ShoppingCart className="mr-1.5 h-3 w-3" />
                        {p.stock !== null && p.stock <= 0 ? "Out of stock" : "Add to cart"}
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        ))}
      </div>

      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="max-w-3xl">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle>{selected.name}</DialogTitle>
              </DialogHeader>
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <div className="aspect-[4/3] max-h-56 overflow-hidden rounded-lg bg-muted">
                    {imagesOf(selected)[activeImg] && (
                      <img
                        src={imagesOf(selected)[activeImg]}
                        alt={selected.name}
                        className="h-full w-full object-cover"
                      />
                    )}
                  </div>
                  {imagesOf(selected).length > 1 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {imagesOf(selected).map((src, i) => (
                        <button
                          key={src + i}
                          onClick={() => setActiveImg(i)}
                          className={`h-16 w-16 overflow-hidden rounded-md border-2 ${
                            i === activeImg ? "border-primary" : "border-border"
                          }`}
                        >
                          <img src={src} alt="" className="h-full w-full object-cover" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <div>
                  {selected.category && (
                    <div className="text-xs uppercase tracking-wider text-primary">
                      {selected.category}
                    </div>
                  )}
                  <div className="mt-2 text-2xl font-bold">
                    {formatKES(Number(selected.price) || 0)}
                  </div>
                  {selected.stock !== null && (
                    <div
                      className={`mt-1 text-xs ${selected.stock <= 0 ? "text-destructive" : "text-muted-foreground"}`}
                    >
                      {selected.stock <= 0 ? "Out of stock" : `${selected.stock} in stock`}
                    </div>
                  )}
                  {selected.description && (
                    <p className="mt-4 text-sm text-muted-foreground whitespace-pre-line">
                      {selected.description}
                    </p>
                  )}
                  <div className="mt-6 flex items-center gap-3">
                    <div className="inline-flex items-center rounded-md border border-border">
                      <button
                        className="h-9 w-9 inline-flex items-center justify-center"
                        onClick={() => setQty((q) => Math.max(1, q - 1))}
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="w-10 text-center text-sm">{qty}</span>
                      <button
                        className="h-9 w-9 inline-flex items-center justify-center"
                        onClick={() =>
                          setQty((q) =>
                            selected.stock !== null ? Math.min(selected.stock, q + 1) : q + 1,
                          )
                        }
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                    <Button
                      className="flex-1"
                      disabled={selected.stock !== null && selected.stock <= 0}
                      onClick={() => {
                        addToCart(selected, qty);
                        setSelected(null);
                      }}
                    >
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      {selected.stock !== null && selected.stock <= 0
                        ? "Out of stock"
                        : "Add to cart"}
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
