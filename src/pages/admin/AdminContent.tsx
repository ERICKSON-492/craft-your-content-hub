import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

const FIELDS = [
  { key: "hero_eyebrow", label: "Hero eyebrow" },
  { key: "hero_title", label: "Hero title", textarea: true },
  { key: "hero_subtitle", label: "Hero subtitle", textarea: true },
  { key: "stat_years", label: "Stat — years" },
  { key: "stat_builds", label: "Stat — custom builds" },
  { key: "stat_grade", label: "Stat — grade" },
  { key: "about_title", label: "About title" },
  { key: "about_body", label: "About body", textarea: true },
];

export default function AdminContent() {
  const [values, setValues] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    supabase.from("site_content").select("key,value").then(({ data }) => {
      const map: Record<string, string> = {};
      (data ?? []).forEach((r: any) => (map[r.key] = r.value ?? ""));
      setValues(map);
      setLoading(false);
    });
  }, []);

  async function save() {
    setSaving(true);
    const rows = FIELDS.map((f) => ({ key: f.key, value: values[f.key] ?? "" }));
    const { error } = await supabase.from("site_content").upsert(rows, { onConflict: "key" });
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Saved");
  }

  if (loading) return <p className="text-muted-foreground">Loading…</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold">Site content</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Edit hero, stats and about copy. Stored in <code>site_content</code> (key/value).
      </p>
      <div className="mt-6 space-y-5">
        {FIELDS.map((f) => (
          <div key={f.key}>
            <Label htmlFor={f.key}>{f.label}</Label>
            {f.textarea ? (
              <Textarea
                id={f.key}
                rows={3}
                value={values[f.key] ?? ""}
                onChange={(e) => setValues((v) => ({ ...v, [f.key]: e.target.value }))}
              />
            ) : (
              <Input
                id={f.key}
                value={values[f.key] ?? ""}
                onChange={(e) => setValues((v) => ({ ...v, [f.key]: e.target.value }))}
              />
            )}
          </div>
        ))}
        <Button onClick={save} disabled={saving}>{saving ? "Saving…" : "Save changes"}</Button>
      </div>
    </div>
  );
}
