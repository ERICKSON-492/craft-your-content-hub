import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ShieldCheck, Wrench, Hammer, Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import hood from "@/assets/hood-1.png.asset.json";
import worktop from "@/assets/worktop-undershelf.png.asset.json";
import dishwasher from "@/assets/dishwasher-2.png.asset.json";
import coldroom from "@/assets/coldroom-1.png.asset.json";
import grease from "@/assets/grease-trap.png.asset.json";
import rack from "@/assets/rack-system.png.asset.json";
import meat from "@/assets/meat-trolley.png.asset.json";
import sink from "@/assets/sink-triple.png.asset.json";
import sectionHero from "@/assets/section-hero.jpg.asset.json";

const heroSlides = [hood.url, worktop.url, dishwasher.url, coldroom.url, sink.url, rack.url];

const services = [
  { title: "Custom Fabrication", desc: "Precision stainless fabrication tailored to residential, commercial and industrial needs." },
  { title: "Commercial Kitchens", desc: "Durable, hygienic stainless kitchen solutions for hotels, restaurants and food businesses." },
  { title: "Railings & Balustrades", desc: "Modern stainless railings designed for safety, durability and architectural appeal." },
  { title: "Industrial Fabrication", desc: "Heavy-duty stainless structures and components built for industrial performance." },
  { title: "Custom Installations", desc: "Professional on-site installation ensuring precise fitting and long-term performance." },
];

const products = [
  { tag: "FABRICATION", title: "Work Tables // Prep Units", desc: "Custom engineered heavy-prep surface stations equipped with targeted undershelves and anti-spill profiles.", img: worktop.url },
  { tag: "HYDRATION", title: "Sinks // Sanitization", desc: "Multi-compartment heavy production washing cells manufactured to withstand extreme daily sanitation cycles.", img: sink.url },
  { tag: "VENTILATION", title: "Exhaust Systems", desc: "High-velocity architectural canopy hoods engineered to meet strict HVAC extraction and air balancing mandates.", img: hood.url },
  { tag: "CONTAINMENT", title: "Shelves & Storage Matrix", desc: "Wall-mounted storage panels, high-clearance freestanding equipment towers, and ventilated racks.", img: rack.url },
  { tag: "CRYOGENIC", title: "Cold Room Frameworks", desc: "High-rigidity shelving units optimized for low-temperature airflow circulation and maximum sub-zero hygiene.", img: coldroom.url },
  { tag: "WAREWASHING", title: "Warewashing Systems", desc: "Integrated dirty-intake landing stations and high-output clean outfeed table assemblies.", img: dishwasher.url },
  { tag: "BUTCHERY", title: "Logistics Trolleys & Rails", desc: "Heavy structural rolling transport solutions and structural ceiling conveyor infrastructure items.", img: meat.url },
  { tag: "DRAINAGE", title: "Effluent Management Systems", desc: "Solid particle flow interceptors and continuous heavy-gauge drainage solutions.", img: grease.url },
];

export default function Home() {
  const [slide, setSlide] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setSlide((s) => (s + 1) % heroSlides.length), 4500);
    return () => clearInterval(id);
  }, []);

  return (
    <>
      {/* HERO */}
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

      {/* EXPERTISE */}
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
            <div key={s.title} className="group rounded-2xl border border-border bg-card p-6 transition-all hover:border-primary hover:shadow-lg">
              <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Wrench className="h-5 w-5" />
              </div>
              <h3 className="mt-5 text-xl font-semibold">{s.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* INSIDE THE WORKSHOP */}
      <section
        className="relative bg-cover bg-center"
        style={{ backgroundImage: `linear-gradient(rgba(15,23,42,0.85), rgba(15,23,42,0.9)), url(${sectionHero.url})` }}
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

      {/* PRODUCTS */}
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

      {/* CTA */}
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
