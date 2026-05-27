import { createFileRoute, useRouter } from "@tanstack/react-router";
import { PageShell, PageHero } from "@/components/PageShell";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { Tables } from "@/integrations/supabase/types";
import { useLang } from "@/i18n/LangProvider";

type Review = Tables<"reviews">;

export const Route = createFileRoute("/reviews")({
  head: () => ({
    meta: [
      { title: "Reviews & Comments — Namami Vindhyavasini" },
      { name: "description", content: "Read what devotees say about their experience and share your own feedback with the trust." },
      { property: "og:title", content: "Devotee Reviews & Feedback" },
      { property: "og:description", content: "Share your experience with Namami Vindhyavasini Sansthan." },
    ],
  }),
  loader: async () => {
    const { data, error } = await supabase
      .from("reviews")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);
    if (error) throw error;
    return { reviews: (data ?? []) as Review[] };
  },
  errorComponent: ({ error }) => (
    <PageShell><PageHero title="Reviews" subtitle="Could not load reviews." />
      <div className="container mx-auto px-6 py-10 text-center text-muted-foreground">{error.message}</div>
    </PageShell>
  ),
  notFoundComponent: () => <PageShell><PageHero title="Not found" /></PageShell>,
  component: ReviewsPage,
});

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "Just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 30) return `${d}d ago`;
  return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

function ReviewsPage() {
  const { reviews } = Route.useLoaderData();
  const { t, lang } = useLang();
  const dev = lang === "hi" ? "font-devanagari" : "";
  const router = useRouter();
  const [name, setName] = useState("");
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !comment.trim()) return;
    setSubmitting(true);
    const { error } = await supabase.from("reviews").insert({
      name: name.trim(),
      comment: comment.trim(),
    });
    setSubmitting(false);
    if (error) {
      toast.error(t("reviews.error"));
      return;
    }
    toast.success(t("reviews.thanks"));
    setName("");
    setComment("");
    router.invalidate();
  };

  return (
    <PageShell>
      <PageHero
        sanskrit={t("reviews.sanskrit")}
        title={t("reviews.title")}
        subtitle={t("reviews.subtitle")}
      />
      <section className="container mx-auto px-6 py-16 grid lg:grid-cols-5 gap-10">
        <form onSubmit={submit} className="lg:col-span-2 p-7 rounded-2xl bg-card border border-border shadow-gold/30 h-fit">
          <h2 className={`font-display text-2xl text-maroon mb-5 ${dev}`}>{t("reviews.leave")}</h2>
          <label className="block mb-4">
            <span className={`text-sm font-medium text-foreground/80 ${dev}`}>{t("reviews.name")}</span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={80}
              required
              className="mt-1 w-full px-4 py-2.5 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-gold"
              placeholder={t("reviews.name.ph")}
            />
          </label>
          <label className="block mb-5">
            <span className={`text-sm font-medium text-foreground/80 ${dev}`}>{t("reviews.comment")}</span>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={5}
              minLength={3}
              maxLength={1000}
              required
              className="mt-1 w-full px-4 py-2.5 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-gold resize-none"
              placeholder={t("reviews.comment.ph")}
            />
          </label>
          <button
            type="submit"
            disabled={submitting}
            className={`w-full px-6 py-3 rounded-full bg-gradient-sacred text-cream font-medium shadow-gold hover:opacity-95 transition disabled:opacity-60 ${dev}`}
          >
            {submitting ? t("reviews.submitting") : t("reviews.submit")}
          </button>
        </form>

        <div className="lg:col-span-3 space-y-4">
          <h2 className={`font-display text-2xl text-maroon mb-2 ${dev}`}>{t("reviews.what")}</h2>
          {reviews.length === 0 && (
            <p className={`text-muted-foreground ${dev}`}>{t("reviews.first")}</p>
          )}
          {reviews.map((r: Review) => (
            <article key={r.id} className="p-6 rounded-2xl bg-card border border-border hover:border-gold/50 transition">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-full bg-gradient-sacred flex items-center justify-center text-cream font-display">
                  {r.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="font-medium text-maroon">{r.name}</div>
                  <div className="text-xs text-muted-foreground">{timeAgo(r.created_at)}</div>
                </div>
              </div>
              <p className="text-foreground/85 leading-relaxed">"{r.comment}"</p>
            </article>
          ))}
        </div>
      </section>
    </PageShell>
  );
}
