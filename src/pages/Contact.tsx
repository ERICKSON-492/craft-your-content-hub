import { useState } from "react";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import SEO from "@/components/SEO";

const projectTypes = [
  "Commercial Kitchen",
  "Refrigeration / Cold Room",
  "Laundry",
  "Ventilation / Hoods",
  "Storage / Shelving",
  "Architectural / Railings",
  "Other",
];

export default function Contact() {
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setSubmitting(true);
    const { error } = await supabase.from("contact_messages").insert({
      name: fd.get("name"),
      email: fd.get("email"),
      phone: fd.get("phone"),
      project_type: fd.get("project_type"),
      message: fd.get("message"),
    });
    setSubmitting(false);
    if (error) {
      toast.error("Failed to send. Please try again.");
      return;
    }
    toast.success("Message sent! We'll be in touch within 24 hours.");
    (e.target as HTMLFormElement).reset();
  }

  return (
    <>
      <SEO
        title="Contact Elite Stainless Steel Concepts"
        description="Talk to Elite Stainless Steel Concepts about custom commercial kitchens, refrigeration, laundry, and architectural stainless steel fabrication in Kenya."
        path="/contact"
      />
      <section className="bg-slate-900 text-white">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <p className="eyebrow text-primary">Contact Us</p>
          <h1 className="mt-3 text-balance text-5xl font-semibold tracking-tight md:text-6xl">
            Get In Touch
          </h1>
          <p className="mt-4 max-w-2xl text-white/70">
            Have a question or ready to start your next project? Get in touch and let's create
            something amazing together.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-12 px-6 py-20 md:grid-cols-2">
        <div>
          <h2 className="text-3xl font-bold">Get in touch</h2>
          <p className="mt-2 text-muted-foreground">
            Reach out using any of the methods below. We typically respond within 24 hours.
          </p>
          <div className="mt-8 space-y-6">
            <Info icon={<Phone className="h-5 w-5" />} title="Phone">
              <a href="tel:+254718927217" className="block hover:text-foreground">
                0718 927 217
              </a>
              <a href="tel:+254712213969" className="block hover:text-foreground">
                0712 213 969
              </a>
            </Info>
            <Info icon={<Mail className="h-5 w-5" />} title="Email">
              <a
                href="mailto:elitestainlesssteelconcepts@gmail.com"
                className="block hover:text-foreground"
              >
                elitestainlesssteelconcepts@gmail.com
              </a>
            </Info>
            <Info icon={<MapPin className="h-5 w-5" />} title="Location">
              <p>Landies Road</p>
              <p>Adjacent to Muthurua Primary</p>
              <p>Nairobi, Kenya</p>
            </Info>
            <Info icon={<Clock className="h-5 w-5" />} title="Business Hours">
              <p>Monday – Saturday</p>
              <p>8:00 AM – 5:30 PM (EAT)</p>
            </Info>
          </div>

          <div className="mt-10 overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
            <div className="border-b border-border px-5 py-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-base font-semibold">Find the workshop</h2>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Landies Road, adjacent to Muthurua Primary
                  </p>
                </div>
                <MapPin className="h-5 w-5 shrink-0 text-primary" />
              </div>
            </div>
            <iframe
              title="Map showing Elite Stainless Steel Concepts on Landies Road, Nairobi"
              src="https://www.google.com/maps?q=Landies+Road,+Adjacent+to+Muthurua+Primary,+Nairobi,+Kenya&output=embed"
              className="h-64 w-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>

        <form
          onSubmit={onSubmit}
          aria-labelledby="contact-form-heading"
          className="rounded-2xl border border-border bg-card p-6 shadow-sm md:p-8"
        >
          <h2 id="contact-form-heading" className="text-2xl font-semibold">
            Send a direct inquiry
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Share a few project details and our fabrication team will respond within 24 hours.
          </p>
          <div className="mt-6 space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                autoComplete="name"
                required
                placeholder="Your full name"
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="you@company.com"
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" name="phone" type="tel" autoComplete="tel" placeholder="0718 …" />
            </div>
            <div>
              <Label htmlFor="project_type">Project Type</Label>
              <select
                id="project_type"
                name="project_type"
                className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                defaultValue=""
              >
                <option value="" disabled>
                  Select a project type
                </option>
                {projectTypes.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                name="message"
                rows={5}
                required
                placeholder="Tell us about your project…"
              />
            </div>
            <Button type="submit" size="lg" className="w-full" disabled={submitting}>
              {submitting ? "Sending…" : "Send Inquiry"}
            </Button>
          </div>
        </form>
      </section>
    </>
  );
}

function Info({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex gap-4">
      <div className="mt-0.5 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
        {icon}
      </div>
      <div>
        <div className="text-xs font-semibold uppercase tracking-wider">{title}</div>
        <div className="mt-1 text-sm text-muted-foreground">{children}</div>
      </div>
    </div>
  );
}
