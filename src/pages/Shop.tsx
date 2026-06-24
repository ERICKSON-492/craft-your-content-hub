import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useCart, formatKES } from "@/contexts/CartContext";
import { ShoppingCart, Minus, Plus } from "lucide-react";
import { toast } from "sonner";

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
  const [selected, setSelected] = useState<Product | null>(null);
  const [activeImg, setActiveImg] = useState(0);
  const [qty, setQty] = useState(1);
  const { add } = useCart();

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

  function imagesOf(p: Product): string[] {
    const arr = (p.images && p.images.length ? p.images : [p.image_url]).filter(Boolean) as string[];
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
            <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {grouped[cat].map((p) => {
                const imgs = imagesOf(p);
                return (
                  <div
                    key={p.id}
                    className="group overflow-hidden rounded-xl border border-border bg-card transition hover:shadow-md"
                  >
                    <button onClick={() => openProduct(p)} className="block w-full text-left">
                      <div className="aspect-[4/3] max-h-32 bg-muted overflow-hidden">
                        {imgs[0] && (
                          <img
                            src={imgs[0]}
                            alt={p.name}
                            className="h-full w-full object-cover transition group-hover:scale-105"
                          />
                        )}
                      </div>
                      <div className="p-3">
                        {p.category && (
                          <div className="text-[10px] uppercase tracking-wider text-primary">{p.category}</div>
                        )}
                        <h3 className="mt-0.5 text-sm font-semibold leading-snug">{p.name}</h3>
                        <div className="mt-1 text-sm font-semibold">{formatKES(Number(p.price) || 0)}</div>
                        {p.stock !== null && (
                          <div className={`mt-0.5 text-[10px] ${p.stock <= 0 ? "text-destructive" : p.stock < 5 ? "text-amber-600" : "text-muted-foreground"}`}>
                            {p.stock <= 0 ? "Out of stock" : `${p.stock} in stock`}
                          </div>
                        )}
                        {p.description && (
                          <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{p.description}</p>
                        )}
                      </div>
                    </button>
                    <div className="px-3 pb-3">
                      <Button
                        size="sm"
                        className="w-full text-xs h-8"
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
                    <div className="text-xs uppercase tracking-wider text-primary">{selected.category}</div>
                  )}
                  <div className="mt-2 text-2xl font-bold">{formatKES(Number(selected.price) || 0)}</div>
                  {selected.stock !== null && (
                    <div className={`mt-1 text-xs ${selected.stock <= 0 ? "text-destructive" : "text-muted-foreground"}`}>
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
                      {selected.stock !== null && selected.stock <= 0 ? "Out of stock" : "Add to cart"}
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
