import { Link } from "react-router-dom";
import { ArrowRight, ShieldCheck, Wrench, Hammer } from "lucide-react";
import { Button } from "@/components/ui/button";

const services = [
  { title: "Custom Fabrication", desc: "Precision stainless fabrication tailored to residential, commercial and industrial needs." },
  { title: "Commercial Kitchens", desc: "Durable, hygienic stainless kitchen solutions for hotels, restaurants and food businesses." },
  { title: "Railings & Balustrades", desc: "Modern stainless railings designed for safety, durability and architectural appeal." },
  { title: "Industrial Fabrication", desc: "Heavy-duty stainless structures and components built for industrial performance." },
  { title: "Custom Installations", desc: "Professional on-site installation ensuring precise fitting and long-term performance." },
];

export default function Home() {
  return (
    <>
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
        <div className="mx-auto max-w-7xl px-6 py-24 md:py-32">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-1.5 text-xs">
            <span className="h-2 w-2 rounded-full bg-primary" />
            Nairobi · Kenya · Since 2014
          </span>
          <h1 className="mt-6 max-w-3xl text-5xl font-bold tracking-tight md:text-7xl">
            Commercial stainless steel, engineered to last.
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-white/70">
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
      </section>

      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="max-w-2xl">
          <p className="text-sm uppercase tracking-widest text-primary">Our expertise</p>
          <h2 className="mt-2 text-4xl font-bold tracking-tight md:text-5xl">
            From concept to installation, finished in steel.
          </h2>
          <p className="mt-4 text-muted-foreground">
            Five core practices, one workshop. Every piece is fabricated in-house by craftsmen
            who understand the demands of commercial service.
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

      <section className="bg-muted/40">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 py-24 md:grid-cols-2">
          <div>
            <p className="text-sm uppercase tracking-widest text-primary">Inside the workshop</p>
            <h2 className="mt-2 text-4xl font-bold tracking-tight md:text-5xl">
              Welded, ground and polished by hand.
            </h2>
            <p className="mt-4 text-muted-foreground">
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
              <li key={b} className="flex items-start gap-3 rounded-xl border border-border bg-background p-4">
                <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                <span>{b}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-24 text-center">
        <Hammer className="mx-auto h-10 w-10 text-primary" />
        <h2 className="mt-4 text-4xl font-bold tracking-tight md:text-5xl">
          Tell us what you're building.
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
          Share dimensions, drawings or a rough idea. We'll come back with a quote and a build
          plan within 48 hours.
        </p>
        <div className="mt-8">
          <Button asChild size="lg">
            <Link to="/contact">Start a project</Link>
          </Button>
        </div>
      </section>
    </>
  );
}
