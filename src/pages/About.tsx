export default function About() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-20">
      <p className="text-sm uppercase tracking-widest text-primary">About us</p>
      <h1 className="mt-2 text-5xl font-bold tracking-tight md:text-6xl">
        Built in Nairobi. Engineered for Kenya.
      </h1>
      <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
        A decade of fabricating commercial stainless steel for kitchens, refrigeration,
        laundries and architectural projects across East Africa.
      </p>
      <div className="mt-16 space-y-6 text-muted-foreground leading-relaxed">
        <h2 className="text-3xl font-bold text-foreground">Craftsmanship that lasts a generation.</h2>
        <p>
          Elite Stainless Steel Concepts was founded in 2014 with a simple commitment:
          build commercial stainless steel that survives the demands of professional service.
          From hotel kitchens to industrial cold rooms, every piece leaves our workshop
          fully assembled, finished and ready for installation.
        </p>
        <p>
          We work exclusively in 304 and 316 grade stainless steel, TIG-weld every joint
          and finish for the environment the product will live in — wet, hot, cold or seen.
        </p>
      </div>
      <div className="mt-16 grid gap-6 md:grid-cols-3">
        {[
          { t: "Quality first", d: "Food-safe 304 / 316 stainless. Ground, polished and passivated for the long run." },
          { t: "Built to spec", d: "No standard sizes — every fabrication is dimensioned to your space and workflow." },
          { t: "Service that lasts", d: "On-site delivery, installation and post-install support across Kenya." },
        ].map((v) => (
          <div key={v.t} className="rounded-2xl border border-border bg-card p-6">
            <h3 className="text-lg font-semibold">{v.t}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{v.d}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
