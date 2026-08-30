import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ShieldCheck, Hammer, Phone, Mail, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { useCart, formatKES } from "@/contexts/CartContext";
import { toast } from "sonner";
import { CATEGORIES } from "@/lib/categories";
import SEO, { LocalBusinessSchema } from "@/components/SEO";
import NewsletterSignup from "@/components/NewsletterSignup";

import hood from "@/assets/hood-1.png";
import worktop from "@/assets/worktop-undershelf.png";
import dishwasher from "@/assets/dishwasher-2.png";
import coldroom from "@/assets/coldroom-1.png";
import rack from "@/assets/rack-system.png";
import meat from "@/assets/meat-trolley.png";
import sink from "@/assets/sink-triple.png";
import sectionHero from "@/assets/section-hero.jpg";

const heroSlides = [hood, worktop, dishwasher, coldroom, sink, rack];

// Fallback image per category name (best-effort match)
const CATEGORY_FALLBACK_IMAGES: Record<string, string> = {
  fabrication: worktop,
  prep: worktop,
  sinks: sink,
  drainage: sink,
  ventilation: hood,
  hoods: hood,
  "cold room": coldroom,
  cold: coldroom,
  shelving: rack,
  storage: rack,
  warewashing: dishwasher,
  dishwasher: dishwasher,
  butchery: meat,
  trolley: meat,
};

function categoryFallback(cat: string): string {
  const lower = cat.toLowerCase();
  for (const [key, img] of Object.entries(CATEGORY_FALLBACK_IMAGES)) {
    if (lower.includes(key)) return img;
  }
  return worktop;
}

type Service = { title: string; desc: string; image: string };

const defaultServices: Service[] = [
  {
    title: "Custom Fabrication",
    desc: "Precision stainless fabrication tailored to residential, commercial and industrial needs.",
    image: worktop,
  },
  {
    title: "Commercial Kitchens",
    desc: "Durable, hygienic stainless kitchen solutions for hotels, restaurants and food businesses.",
    image: hood,
  },
  {
    title: "Railings & Balustrades",
    desc: "Modern stainless railings designed for safety, durability and architectural appeal.",
    image: rack,
  },
  {
    title: "Industrial Fabrication",
    desc: "Heavy-duty stainless structures and components built for industrial performance.",
    image: coldroom,
  },
  {
    title: "Custom Installations",
    desc: "Professional on-site installation ensuring precise fitting and long-term performance.",
    image: meat,
  },
];

const products = [
  {
    tag: "FABRICATION",
    title: "Work Tables // Prep Units",
    desc: "Custom engineered heavy-prep surface stations equipped with targeted undershelves and anti-spill profiles.",
    img: worktop,
  },
  {
    tag: "HYDRATION",
    title: "Sinks // Sanitization",
    desc: "Multi-compartment heavy production washing cells manufactured to withstand extreme daily sanitation cycles.",
    img: sink,
  },
  {
    tag: "VENTILATION",
    title: "Exhaust Systems",
    desc: "High-velocity architectural canopy hoods engineered to meet strict HVAC extraction and air balancing mandates.",
    img: hood,
  },
  {
    tag: "CONTAINMENT",
    title: "Shelves & Storage Matrix",
    desc: "Wall-mounted storage panels, high-clearance freestanding equipment towers, and ventilated racks.",
    img: rack,
  },
  {
    tag: "CRYOGENIC",
    title: "Cold Room Frameworks",
    desc: "High-rigidity shelving units optimized for low-temperature airflow circulation and maximum sub-zero hygiene.",
    img: coldroom,
  },
  {
    tag: "WAREWASHING",
    title: "Warewashing Systems",
    desc: "Integrated dirty-intake landing stations and high-output clean outfeed table assemblies.",
    img: dishwasher,
  },
  {
    tag: "BUTCHERY",
    title: "Logistics Trolleys & Rails",
    desc: "Heavy structural rolling transport solutions and structural ceiling conveyor infrastructure items.",
    img: meat,
  },
];

interface Product {
  id: string;
  name: string;
  category: string | null;
  description: string | null;
  price: number;
  image_url: string | null;
  images: string[] | null;
}

function primaryImage(p: Product): string | null {
  if (p.images && p.images.length > 0) return p.images[0];
  return p.image_url ?? null;
}

export default function Home() {
  const [slide, setSlide] = useState(0);
  const [services, setServices] = useState<Service[]>(defaultServices);
  const [shopItems, setShopItems] = useState<Product[]>([]);
  const [shopLoading, setShopLoading] = useState(true);
  const { add } = useCart();

  // Hero slideshow
  useEffect(() => {
    const id = setInterval(() => setSlide((s) => (s + 1) % heroSlides.length), 4500);
    return () => clearInterval(id);
  }, []);

  // Fetch services from Supabase
  useEffect(() => {
    supabase
      .from("services")
      .select("title,description,image_url")
      .order("sort_order", { ascending: true })
      .then(({ data }) => {
        if (data && data.length) {
          setServices(
            data.map((r: any) => ({
              title: r.title,
              desc: r.description ?? "",
              image: r.image_url ?? "",
            })),
          );
        }
      });
  }, []);

  // Fetch all products once — derive both featured + categories from same payload
  useEffect(() => {
    supabase
      .from("products")
      .select("id,name,category,description,price,image_url,images,created_at")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setShopItems((data as Product[]) ?? []);
        setShopLoading(false);
      });
  }, []);

  // Featured = 4 most recent
  const featuredProducts = useMemo(() => shopItems.slice(0, 4), [shopItems]);

  // Categories with counts and a representative image (first product image in that category)
  const shopCategories = useMemo(() => {
    const map = new Map<string, { count: number; img: string | null }>();
    shopItems.forEach((p) => {
      const cat = p.category?.trim() || "Uncategorized";
      if (!map.has(cat)) {
        map.set(cat, { count: 0, img: primaryImage(p) });
      }
      map.get(cat)!.count += 1;
    });
    return Array.from(map.entries())
      .map(([label, { count, img }]) => ({ label, count, img }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }, [shopItems]);

  function addToCart(p: Product) {
    const img = primaryImage(p);
    add({ productId: p.id, name: p.name, price: Number(p.price) || 0, image: img }, 1);
    toast.success(`${p.name} added to cart`);
  }

  return (
    <>
      <SEO
        title="Commercial Stainless Steel Fabrication in Nairobi"
        description="Elite Stainless Steel Concepts designs, fabricates, and installs durable stainless steel kitchens, refrigeration, laundry, and architectural solutions across Kenya."
        path="/"
      />
      <LocalBusinessSchema />
      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section className="relative min-h-[720px] overflow-hidden bg-[#102a43] text-white lg:min-h-[calc(100vh-4.5rem)]">
        <div className="absolute inset-0">
          {heroSlides.map((src, i) => (
            <img
              key={src}
              src={src}
              alt=""
              className="absolute inset-0 h-full w-full object-cover scale-105 transition-opacity duration-[1200ms] ease-in-out"
              loading={i === 0 ? "eager" : "lazy"}
              fetchPriority={i === 0 ? "high" : "low"}
              decoding="async"
              style={{ opacity: slide === i ? 1 : 0 }}
            />
          ))}
          <div className="absolute inset-0 bg-[#102a43]/75" />
          <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-[#102a43] via-[#102a43]/40 to-transparent" />
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex gap-2">
            {heroSlides.map((_, i) => (
              <button
                key={i}
                onClick={() => setSlide(i)}
                className={`h-1.5 rounded-full transition-all duration-500 ${
                  slide === i ? "w-8 bg-primary" : "w-1.5 bg-white/40 hover:bg-white/60"
                }`}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>
        </div>
        <div className="relative z-10 mx-auto flex min-h-[720px] max-w-7xl items-center px-6 py-24 lg:min-h-[calc(100vh-4.5rem)] lg:py-28">
          <div className="animate-fade-up max-w-3xl pb-8">
            <span className="eyebrow inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-white/85 backdrop-blur-sm">
              <span className="h-2 w-2 rounded-full bg-primary" />
              Nairobi · Kenya · Since 2014
            </span>
            <h1 className="animate-fade-up stagger-1 text-balance mt-7 max-w-3xl text-5xl font-semibold leading-[0.98] tracking-[-0.05em] md:text-7xl lg:text-[5.5rem]">
              Commercial stainless steel, engineered to last.
            </h1>
            <p className="animate-fade-up stagger-1 mt-7 max-w-2xl text-lg leading-relaxed text-white/72 md:text-xl">
              We design, fabricate and install commercial stainless steel for kitchens,
              refrigeration, laundry and architectural projects across Kenya — built in-house in 304
              / 316 grade steel.
            </p>
            <div className="animate-fade-up stagger-2 mt-9 flex flex-wrap gap-3">
              <Button asChild size="lg" className="animate-light-sweep">
                <Link to="/contact">
                  Speak to our experts <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white/30 bg-white/5 text-white hover:bg-white/12"
              >
                <Link to="/projects">Explore projects</Link>
              </Button>
            </div>
            <div className="animate-fade-up stagger-3 mt-14 grid max-w-2xl grid-cols-3 gap-6 border-t border-white/15 pt-8 md:gap-12">
              {[
                { k: "10+", v: "Years in trade" },
                { k: "500+", v: "Custom builds" },
                { k: "304/316", v: "Grade steel" },
              ].map((s) => (
                <div key={s.v}>
                  <div className="text-3xl font-semibold tracking-tight md:text-4xl">{s.k}</div>
                  <div className="text-xs uppercase tracking-wider text-white/60">{s.v}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── SHOP CATEGORIES (marquee) ─────────────────────────────────────── */}
      <section className="surface-grid py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex items-end justify-between">
            <div>
              <p className="eyebrow text-primary">Shop by category</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
                Browse the full range.
              </h2>
            </div>
            <Link
              to="/shop"
              className="hidden md:inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
            >
              View all <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <div className="marquee-pause group mt-8 overflow-hidden">
          <div className="animate-marquee flex w-max gap-4 pl-4">
            {[...CATEGORIES, ...CATEGORIES].map((cat, i) => {
              const countEntry = shopCategories.find(
                (c) => c.label.toLowerCase() === cat.name.toLowerCase(),
              );
              return (
                <Link
                  key={`${cat.name}-${i}`}
                  to={`/shop?cat=${encodeURIComponent(cat.name)}`}
                  className="animate-fade-up group/card relative w-52 shrink-0 overflow-hidden rounded-2xl border border-border/70 bg-card shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-primary/50 hover:shadow-xl sm:w-60"
                >
                  <div className="aspect-square overflow-hidden bg-muted">
                    <img
                      src={cat.image}
                      alt={cat.name}
                      loading="lazy"
                      className="h-full w-full object-cover brightness-90 transition-transform duration-500 group-hover/card:scale-105 group-hover/card:brightness-100"
                    />
                  </div>
                  <div className="p-3">
                    <p className="text-xs font-semibold leading-tight">{cat.name}</p>
                    {countEntry && (
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {countEntry.count} item{countEntry.count === 1 ? "" : "s"}
                      </p>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        <div className="mx-auto mt-6 max-w-7xl px-6 md:hidden">
          <Link
            to="/shop"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
          >
            View all categories <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* ── FEATURED PRODUCTS ─────────────────────────────────────────────── */}
      {!shopLoading && featuredProducts.length > 0 && (
        <section className="border-y border-border/60 bg-muted/45 py-24">
          <div className="mx-auto max-w-7xl px-6">
            <div className="flex items-end justify-between">
              <div>
                <p className="eyebrow text-primary">Featured products</p>
                <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
                  Ready-to-order builds.
                </h2>
                <p className="mt-2 text-sm text-muted-foreground max-w-lg">
                  Standard configurations available for fast turnaround. Need custom dimensions?
                  Every product is fully adjustable — just ask.
                </p>
              </div>
              <Link
                to="/shop"
                className="hidden md:inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
              >
                Shop all <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {featuredProducts.map((p) => {
                const img = primaryImage(p);
                return (
                  <div
                    key={p.id}
                    className="group flex flex-col overflow-hidden rounded-2xl border border-border/70 bg-card shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-primary/50 hover:shadow-xl"
                  >
                    <Link to="/shop" className="block">
                      <div className="aspect-[4/3] overflow-hidden bg-muted">
                        {img ? (
                          <img
                            src={img}
                            alt={p.name}
                            loading="lazy"
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className="h-full w-full bg-muted" />
                        )}
                      </div>
                      <div className="p-5 pb-3">
                        {p.category && (
                          <span className="text-[10px] font-semibold tracking-widest text-primary uppercase">
                            {p.category}
                          </span>
                        )}
                        <h3 className="mt-1.5 text-sm font-semibold leading-snug line-clamp-2">
                          {p.name}
                        </h3>
                        <div className="mt-2 text-base font-bold">
                          {formatKES(Number(p.price) || 0)}
                        </div>
                      </div>
                    </Link>
                    <div className="mt-auto px-5 pb-5">
                      <Button className="w-full" onClick={() => addToCart(p)}>
                        <ShoppingCart className="mr-2 h-4 w-4" /> Add to cart
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-8 text-center md:hidden">
              <Link
                to="/shop"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
              >
                Shop all products <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ── EXPERTISE ─────────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="max-w-2xl">
          <p className="text-sm uppercase tracking-widest text-primary">Our expertise</p>
          <h2 className="mt-2 text-4xl font-bold tracking-tight md:text-5xl">
            From concept to installation, finished in steel.
          </h2>
          <p className="mt-4 text-muted-foreground">
            Five core practices, one workshop. Every piece is fabricated in-house by craftsmen who
            understand the demands of commercial service. We work in 304 and 316 grade stainless
            steel and finish every join, edge and weld for the environment it will live in — wet,
            hot, cold or seen.
          </p>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => (
            <div
              key={s.title}
              className="group overflow-hidden rounded-2xl border border-border bg-card transition-all hover:border-primary hover:shadow-lg"
            >
              <div className="aspect-[4/3] overflow-hidden bg-muted">
                {s.image ? (
                  <img
                    src={s.image}
                    alt={s.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : null}
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── INSIDE THE WORKSHOP ───────────────────────────────────────────── */}
      <section
        className="relative bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(rgba(15,23,42,0.85), rgba(15,23,42,0.9)), url(${sectionHero})`,
        }}
      >
        <div className="mx-auto grid max-w-7xl gap-12 px-6 py-24 md:grid-cols-2 text-white">
          <div>
            <p className="text-sm uppercase tracking-widest text-primary">Inside the workshop</p>
            <h2 className="mt-2 text-4xl font-bold tracking-tight md:text-5xl">
              Welded, ground and polished by hand.
            </h2>
            <p className="mt-4 text-white/70">
              Every fabrication leaves the workshop fully assembled, tested and finished. No site
              rework. No surprises.
            </p>
          </div>
          <ul className="space-y-4">
            {[
              "Food-safe 304 / 316 grade stainless",
              "TIG-welded joints, ground and passivated",
              "Custom dimensions — no standard sizes",
              "On-site delivery and installation across Kenya",
            ].map((b) => (
              <li
                key={b}
                className="flex items-start gap-3 rounded-xl border border-white/15 bg-white/5 backdrop-blur p-4"
              >
                <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                <span>{b}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── PRODUCTS CATALOGUE ────────────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="max-w-2xl">
          <p className="text-sm uppercase tracking-widest text-primary">Products</p>
          <h2 className="mt-2 text-4xl font-bold tracking-tight md:text-5xl">
            A workshop catalogue, custom every time.
          </h2>
          <p className="mt-4 text-muted-foreground">
            Below are recurring builds. Send dimensions and we'll quote — or design something new
            with you.
          </p>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((p) => (
            <article
              key={p.title}
              className="group overflow-hidden rounded-2xl border border-border bg-card transition-all hover:border-primary hover:shadow-lg"
            >
              <div className="aspect-[4/3] overflow-hidden bg-muted">
                <img
                  src={p.img}
                  alt={p.title}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-5">
                <div className="text-xs font-semibold tracking-widest text-primary">{p.tag}</div>
                <h3 className="mt-2 text-lg font-semibold leading-tight">{p.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground line-clamp-3">{p.desc}</p>
                <Link
                  to="/products"
                  className="mt-4 inline-flex items-center text-sm font-medium text-primary"
                >
                  View Details <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <NewsletterSignup />
      {/* ── CTA ───────────────────────────────────────────────────────────── */}
      <section className="bg-muted/40">
        <div className="mx-auto max-w-3xl px-6 py-24 text-center">
          <Hammer className="mx-auto h-10 w-10 text-primary" />
          <p className="mt-4 text-sm uppercase tracking-widest text-primary">Start a project</p>
          <h2 className="mt-2 text-4xl font-bold tracking-tight md:text-5xl">
            Tell us what you're building.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Share dimensions, drawings or a rough idea. We'll come back with a quote and a build
            plan within 48 hours.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <a
              href="tel:+254794872338"
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-5 py-3 text-sm font-medium"
            >
              <Phone className="h-4 w-4 text-primary" /> Call +254 794 872 338
            </a>
            <a
              href="mailto:sales@elitestainlesssteelconcepts.co.ke"
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-5 py-3 text-sm font-medium"
            >
              <Mail className="h-4 w-4 text-primary" /> Email
              sales@elitestainlesssteelconcepts.co.ke
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
