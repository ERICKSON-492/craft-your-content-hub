import { Clock3, Quote, Ruler, ShieldCheck } from "lucide-react";

const trustPoints = [
  {
    icon: Ruler,
    label: "Made to measure",
    text: "Every brief starts with your dimensions, workflow, and site requirements—not a one-size-fits-all template.",
  },
  {
    icon: ShieldCheck,
    label: "Built for daily use",
    text: "Food-safe stainless steel, carefully finished joints, and practical details that hold up under pressure.",
  },
  {
    icon: Clock3,
    label: "Clear from start to finish",
    text: "A straightforward path from the first conversation to fabrication, delivery, and installation.",
  },
];

export default function CustomerTrust() {
  return (
    <section
      className="border-y border-border/60 bg-muted/35 py-24"
      aria-labelledby="customer-trust-heading"
    >
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.4fr] lg:items-end">
          <div>
            <p className="eyebrow text-primary">The Elite standard</p>
            <h2
              id="customer-trust-heading"
              className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl"
            >
              The details customers notice after installation.
            </h2>
            <p className="mt-4 max-w-lg text-muted-foreground">
              We focus on the things that make a fabricated space easier to run: accurate
              dimensions, durable finishes, and communication you can rely on.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {trustPoints.map(({ icon: Icon, label, text }) => (
              <article
                key={label}
                className="rounded-2xl border border-border/70 bg-card p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-lg"
              >
                <Icon className="h-5 w-5 text-primary" />
                <h3 className="mt-5 font-semibold">{label}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{text}</p>
              </article>
            ))}
          </div>
        </div>
        <div className="mt-10 flex items-start gap-3 rounded-2xl border border-primary/20 bg-primary/5 px-5 py-4 text-sm text-muted-foreground">
          <Quote className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
          <p>
            Need a reference for a similar build? Ask the team and we can share relevant project
            examples, materials, and finish options before you commit.
          </p>
        </div>
      </div>
    </section>
  );
}
