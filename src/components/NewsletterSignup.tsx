import { useState } from "react";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

export default function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    if (String(form.get("website") ?? "").trim()) return;
    if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email.trim())) {
      toast.error("Enter a valid email address.");
      return;
    }

    setSubmitting(true);
    const { error } = await supabase.from("contact_messages").insert({
      name: "Newsletter subscriber",
      email: email.trim().toLowerCase(),
      project_type: "Newsletter",
      message: "Opted in to receive Elite Stainless updates and project insights.",
    });
    setSubmitting(false);

    if (error) {
      toast.error("We couldn't save your signup. Please try again.");
      return;
    }
    setSubmitted(true);
    setEmail("");
    toast.success("You're on the list.");
  }

  return (
    <section
      aria-labelledby="newsletter-heading"
      className="border-y border-white/10 bg-[#102a43] text-white"
    >
      <div className="mx-auto grid max-w-7xl gap-8 px-6 py-16 md:grid-cols-[1fr_1.1fr] md:items-center md:gap-16 md:py-20">
        <div>
          <p className="eyebrow text-[#d7b56d]">The workshop brief</p>
          <h2
            id="newsletter-heading"
            className="mt-3 max-w-xl text-3xl font-semibold tracking-tight md:text-4xl"
          >
            Practical ideas for better-built spaces.
          </h2>
          <p className="mt-4 max-w-lg text-sm leading-relaxed text-white/65 md:text-base">
            Get occasional project inspiration, fabrication insights, and new product updates from
            our Nairobi workshop. No noise, just useful ideas.
          </p>
        </div>
        {submitted ? (
          <div className="flex items-start gap-3 rounded-2xl border border-white/15 bg-white/5 p-6">
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#d7b56d]" />
            <div>
              <p className="font-semibold">Thanks for joining us.</p>
              <p className="mt-1 text-sm text-white/65">
                We'll send the next workshop brief when it's ready.
              </p>
            </div>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <div className="min-w-0 flex-1">
              <label
                htmlFor="newsletter-email"
                className="mb-2 block text-xs font-semibold uppercase tracking-wider text-white/75"
              >
                Email address
              </label>
              <Input
                id="newsletter-email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@company.com"
                className="h-12 border-white/15 bg-white/10 text-white placeholder:text-white/40"
              />
              <input
                name="website"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                className="absolute -left-[9999px] h-px w-px opacity-0"
              />
            </div>
            <Button
              type="submit"
              size="lg"
              disabled={submitting}
              className="h-12 shrink-0 bg-[#d7b56d] text-[#102a43] hover:bg-[#e5c98d]"
            >
              {submitting ? "Joining…" : "Join the list"}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </form>
        )}
      </div>
    </section>
  );
}
