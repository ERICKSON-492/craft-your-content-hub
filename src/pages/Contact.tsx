import { useState } from "react";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

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
      <section className="bg-slate-900 text-white">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <p className="text-sm uppercase tracking-widest text-primary">Contact Us</p>
          <h1 className="mt-2 text-5xl font-bold tracking-tight md:text-6xl">Get In Touch</h1>
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
              <a href="tel:+254794872338" className="block hover:text-foreground">+254 (0) 794 872 338</a>
              <a href="tel:+254706093060" className="block hover:text-foreground">+254 (0) 706 093 060</a>
            </Info>
            <Info icon={<Mail className="h-5 w-5" />} title="Email">
              <a href="mailto:sales@elitestainlesssteelconcepts.co.ke" className="block hover:text-foreground">sales@elitestainlesssteelconcepts.co.ke</a>
              <a href="mailto:info@elitestainlesssteelconcepts.co.ke" className="block hover:text-foreground">info@elitestainlesssteelconcepts.co.ke</a>
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
        </div>

        <form onSubmit={onSubmit} className="rounded-2xl border border-border bg-card p-6 md:p-8">
          <h2 className="text-2xl font-bold">Send us a message</h2>
          <div className="mt-6 space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" required placeholder="Your full name" />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" required placeholder="you@company.com" />
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" name="phone" placeholder="+254 …" />
            </div>
            <div>
              <Label htmlFor="project_type">Project Type</Label>
              <select
                id="project_type"
                name="project_type"
                className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                defaultValue=""
              >
                <option value="" disabled>Select a project type</option>
                {projectTypes.map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <Label htmlFor="message">Message</Label>
              <Textarea id="message" name="message" rows={5} required placeholder="Tell us about your project…" />
            </div>
            <Button type="submit" size="lg" className="w-full" disabled={submitting}>
              {submitting ? "Sending…" : "Send Message"}
            </Button>
          </div>
        </form>
      </section>
    </>
  );
}

function Info({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
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
