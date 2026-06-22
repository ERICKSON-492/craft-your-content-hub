import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ShieldCheck, Hammer, Phone, Mail, ShoppingCart, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";

import hood from "@/assets/hood-1.png";
import worktop from "@/assets/worktop-undershelf.png";
import dishwasher from "@/assets/dishwasher-2.png";
import coldroom from "@/assets/coldroom-1.png";
import grease from "@/assets/grease-trap.png";
import rack from "@/assets/rack-system.png";
import meat from "@/assets/meat-trolley.png";
import sink from "@/assets/sink-triple.png";
import sectionHero from "@/assets/section-hero.jpg";

const heroSlides = [hood, worktop, dishwasher, coldroom, sink, rack];

type Service = { title: string; desc: string; image: string };

const defaultServices: Service[] = [
  { title: "Custom Fabrication", desc: "Precision stainless fabrication tailored to residential, commercial and industrial needs.", image: worktop },
  { title: "Commercial Kitchens", desc: "Durable, hygienic stainless kitchen solutions for hotels, restaurants and food businesses.", image: hood },
  { title: "Railings & Balustrades", desc: "Modern stainless railings designed for safety, durability and architectural appeal.", image: rack },
  { title: "Industrial Fabrication", desc: "Heavy-duty stainless structures and components built for industrial performance.", image: coldroom },
  { title: "Custom Installations", desc: "Professional on-site installation ensuring precise fitting and long-term performance.", image: meat },
];

const products = [
  { tag: "FABRICATION", title: "Work Tables // Prep Units", desc: "Custom engineered heavy-prep surface stations equipped with targeted undershelves and anti-spill profiles.", img: worktop },
  { tag: "HYDRATION", title: "Sinks // Sanitization", desc: "Multi-compartment heavy production washing cells manufactured to withstand extreme daily sanitation cycles.", img: sink },
  { tag: "VENTILATION", title: "Exhaust Systems", desc: "High-velocity architectural canopy hoods engineered to meet strict HVAC extraction and air balancing mandates.", img: hood },
  { tag: "CONTAINMENT", title: "Shelves & Storage Matrix", desc: "Wall-mounted storage panels, high-clearance freestanding equipment towers, and ventilated racks.", img: rack },
  { tag: "CRYOGENIC", title: "Cold Room Frameworks", desc: "High-rigidity shelving units optimized for low-temperature airflow circulation and maximum sub-zero hygiene.", img: coldroom },
  { tag: "WAREWASHING", title: "Warewashing Systems", desc: "Integrated dirty-intake landing stations and high-output clean outfeed table assemblies.", img: dishwasher },
  { tag: "BUTCHERY", title: "Logistics Trolleys & Rails", desc: "Heavy structural rolling transport solutions and structural ceiling conveyor infrastructure items.", img: meat },
  { tag: "DRAINAGE", title: "Effluent Management Systems", desc: "Solid particle flow interceptors and continuous heavy-gauge drainage solutions.", img: grease },
];

// ─── Shop Data ────────────────────────────────────────────────────────────────

const shopCategories = [
  { label: "Prep & Fabrication", img: worktop, href: "/shop?cat=fabrication", count: 14 },
  { label: "Sinks & Drainage",   img: sink,    href: "/shop?cat=drainage",    count: 9  },
  { label: "Ventilation Hoods",  img: hood,    href: "/shop?cat=ventilation",  count: 6  },
  { label: "Cold Room Systems",  img: coldroom,href: "/shop?cat=cold-room",    count: 8  },
  { label: "Shelving & Racks",   img: rack,    href: "/shop?cat=storage",      count: 11 },
  { label: "Warewashing",        img: dishwasher, href: "/shop?cat=warewashing", count: 5 },
];

const featuredProducts = [
  {
    title: "Heavy-Duty Prep Table — 1800mm",
    tag: "FABRICATION",
    img: worktop,
    price: "KES 38,500",
    originalPrice: "KES 44,000",
    badge: "Best Seller",
    href: "/shop/prep-table-1800",
  },
  {
    title: "Triple Bowl Sink Unit",
    tag: "HYDRATION",
    img: sink,
    price: "KES 52,000",
    originalPrice: null,
    badge: "New",
    href: "/shop/triple-sink",
  },
  {
    title: "Wall-Mount Canopy Hood — 1200mm",
    tag: "VENTILATION",
    img: hood,
    price: "KES 67,000",
    originalPrice: "KES 75,000",
    badge: "On Sale",
    href: "/shop/canopy-hood-1200",
  },
  {
    title: "Cold Room Shelving Set — 5 Tier",
    tag: "CRYOGENIC",
    img: coldroom,
    price: "KES 29,800",
    originalPrice: null,
    badge: null,
    href: "/shop/cold-room-shelving",
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function Home() {
  const [slide, setSlide] = useState(0);
  const [services, setServices] = useState<Service[]>(defaultServices);

  useEffect(() => {
    const id = setInterval(() => setSlide((s) => (s + 1) % heroSlides.length), 4500);
    return () => clearInterval(id);
  }, []);

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

  return (
    <>
      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section className="relative h-[100vh] min-h-[700px] max-h-[1100px] overflow-hidden bg-slate-900 text-white">
        <div className="absolute inset-0">
          {heroSlides.map((src, i) => (
            <img
              key={src}
              src={src}
              alt=""
              className="absolute inset-0 h-full w-full object-cover scale-105 transition-opacity duration-[1200ms] ease-in-out"
              style={{ opacity: slide === i ? 1 : 0 }}
            />
          ))}
          <div className="absolute inset-0 bg-slate-900/70" />
          <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-slate-900 to-transparent" />
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
        <div className="relative z-10 mx-auto flex h-full max-w-7xl items-center px-6">
          <div className="max-w-2xl pt-24 pb-20">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 backdrop-blur-sm px-4 py-1.5 text-xs">
              <span className="h-2 w-2 rounded-full bg-primary" />
              Nairobi · Kenya · Since 2014
            </span>
            <h1 className="mt-6 text-5xl font-bold tracking-tight md:text-7xl">
              Commercial stainless steel, engineered to last.
            </h1>
            <p className="mt-6 max-w-xl text-lg text-white/75">
              We design, fabricate and install commercial stainless steel for kitchens,
              refrigeration, laundry and architectural projects across Kenya — built in-house
              in 304 / 316 grade steel.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link to="/contact">Speak to our experts <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white/30 bg-transparent text-white hover:bg-white/10">
                <Link to="/projects">Explore projects</Link>
              </Button>
            </div>
            <div className="mt-12 grid max-w-2xl grid-cols-3 gap-6 border-t border-white/15 pt-8">
              {[
                { k: "10+", v: "Years in trade" },
                { k: "500+", v: "Custom builds" },
                { k: "304/316", v: "Grade steel" },
              ].map((s) => (
                <div key={s.v}>
                  <div className="text-3xl font-bold">{s.k}</div>
                  <div className="text-xs uppercase tracking-wider text-white/60">{s.v}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── SHOP CATEGORIES ───────────────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-sm uppercase tracking-widest text-primary">Shop by category</p>
            <h2 className="mt-1 text-3xl font-bold tracking-tight md:text-4xl">
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

        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {shopCategories.map((cat) => (
            <Link
              key={cat.label}
              to={cat.href}
              className="group relative overflow-hidden rounded-xl border border-border bg-card transition-all hover:border-primary hover:shadow-md"
            >
              <div className="aspect-square overflow-hidden bg-muted">
                <img
                  src={cat.img}
                  alt={cat.label}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 brightness-90 group-hover:brightness-100"
                />
              </div>
              <div className="p-3">
                <p className="text-xs font-semibold leading-tight">{cat.label}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">{cat.count} items</p>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-6 md:hidden">
          <Link
            to="/shop"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
          >
            View all categories <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* ── FEATURED PRODUCTS ─────────────────────────────────────────────── */}
      <section className="bg-muted/30 py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-sm uppercase tracking-widest text-primary">Featured products</p>
              <h2 className="mt-1 text-3xl font-bold tracking-tight md:text-4xl">
                Ready-to-order builds.
              </h2>
              <p className="mt-2 text-sm text-muted-foreground max-w-lg">
                Standard configurations available for fast turnaround. Need custom dimensions? Every product is fully adjustable — just ask.
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
            {featuredProducts.map((p) => (
              <Link
                key={p.title}
                to={p.href}
                className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all hover:border-primary hover:shadow-lg"
              >
                {/* Badge */}
                {p.badge && (
                  <span className="absolute top-3 left-3 z-10 inline-flex items-center gap-1 rounded-full bg-primary px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary-foreground">
                    <Tag className="h-2.5 w-2.5" />
                    {p.badge}
                  </span>
                )}

                {/* Image */}
                <div className="aspect-[4/3] overflow-hidden bg-muted">
                  <img
                    src={p.img}
                    alt={p.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>

                {/* Info */}
                <div className="flex flex-1 flex-col p-5">
                  <span className="text-[10px] font-semibold tracking-widest text-primary">{p.tag}</span>
                  <h3 className="mt-1.5 text-sm font-semibold leading-snug">{p.title}</h3>

                  <div className="mt-auto pt-4 flex items-center justify-between">
                    <div className="flex items-baseline gap-2">
                      <span className="text-base font-bold">{p.price}</span>
                      {p.originalPrice && (
                        <span className="text-xs text-muted-foreground line-through">{p.originalPrice}</span>
                      )}
                    </div>
                    <span className="inline-flex items-center justify-center rounded-lg border border-border bg-background p-2 transition-colors group-hover:border-primary group-hover:bg-primary group-hover:text-primary-foreground">
                      <ShoppingCart className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
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

      {/* ── EXPERTISE ─────────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="max-w-2xl">
          <p className="text-sm uppercase tracking-widest text-primary">Our expertise</p>
          <h2 className="mt-2 text-4xl font-bold tracking-tight md:text-5xl">
            From concept to installation, finished in steel.
          </h2>
          <p className="mt-4 text-muted-foreground">
            Five core practices, one workshop. Every piece is fabricated in-house by craftsmen
            who understand the demands of commercial service. We work in 304 and 316 grade
            stainless steel and finish every join, edge and weld for the environment it will
            live in — wet, hot, cold or seen.
          </p>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => (
            <div key={s.title} className="group overflow-hidden rounded-2xl border border-border bg-card transition-all hover:border-primary hover:shadow-lg">
              <div className="aspect-[4/3] overflow-hidden bg-muted">
                {s.image ? (
                  <img src={s.image} alt={s.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
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
        style={{ backgroundImage: `linear-gradient(rgba(15,23,42,0.85), rgba(15,23,42,0.9)), url(${sectionHero})` }}
      >
        <div className="mx-auto grid max-w-7xl gap-12 px-6 py-24 md:grid-cols-2 text-white">
          <div>
            <p className="text-sm uppercase tracking-widest text-primary">Inside the workshop</p>
            <h2 className="mt-2 text-4xl font-bold tracking-tight md:text-5xl">
              Welded, ground and polished by hand.
            </h2>
            <p className="mt-4 text-white/70">
              Every fabrication leaves the workshop fully assembled, tested and finished.
              No site rework. No surprises.
            </p>
          </div>
          <ul className="space-y-4">
            {[
              "Food-safe 304 / 316 grade stainless",
              "TIG-welded joints, ground and passivated",
              "Custom dimensions — no standard sizes",
              "On-site delivery and installation across Kenya",
            ].map((b) => (
              <li key={b} className="flex items-start gap-3 rounded-xl border border-white/15 bg-white/5 backdrop-blur p-4">
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
            Below are recurring builds. Send dimensions and we'll quote — or design something
            new with you.
          </p>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((p) => (
            <article key={p.title} className="group overflow-hidden rounded-2xl border border-border bg-card transition-all hover:border-primary hover:shadow-lg">
              <div className="aspect-[4/3] overflow-hidden bg-muted">
                <img src={p.img} alt={p.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
              </div>
              <div className="p-5">
                <div className="text-xs font-semibold tracking-widest text-primary">{p.tag}</div>
                <h3 className="mt-2 text-lg font-semibold leading-tight">{p.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground line-clamp-3">{p.desc}</p>
                <Link to="/products" className="mt-4 inline-flex items-center text-sm font-medium text-primary">
                  View Details <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────────────── */}
      <section className="bg-muted/40">
        <div className="mx-auto max-w-3xl px-6 py-24 text-center">
          <Hammer className="mx-auto h-10 w-10 text-primary" />
          <p className="mt-4 text-sm uppercase tracking-widest text-primary">Start a project</p>
          <h2 className="mt-2 text-4xl font-bold tracking-tight md:text-5xl">
            Tell us what you're building.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Share dimensions, drawings or a rough idea. We'll come back with a quote and a
            build plan within 48 hours.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <a href="tel:+254794872338" className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-5 py-3 text-sm font-medium">
              <Phone className="h-4 w-4 text-primary" /> Call +254 794 872 338
            </a>
            <a href="mailto:sales@elitestainlesssteelconcepts.co.ke" className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-5 py-3 text-sm font-medium">
              <Mail className="h-4 w-4 text-primary" /> Email sales@elitestainlesssteelconcepts.co.ke
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
