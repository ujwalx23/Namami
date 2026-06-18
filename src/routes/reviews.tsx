import { createFileRoute, useRouter } from "@tanstack/react-router";
import { PageShell, PageHero } from "@/components/PageShell";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { Tables } from "@/integrations/supabase/types";
import { useLang } from "@/i18n/LangProvider";
import { JsonLd } from "@/components/JsonLd";

type Review = Tables<"reviews">;

export const Route = createFileRoute("/reviews")({
  head: () => ({
    meta: [
      { title: "Devotee Reviews & Feedback | Namami Vindhyavasini Sansthan" },
      {
        name: "description",
        content:
          "Read reviews, testimonials, and experiences shared by devotees of Maa Vindhyavasini. Share your feedback, comments, and spiritual experiences with the Sansthan.",
      },
      {
        name: "keywords",
        content:
          "Maa Vindhyavasini reviews, Vindhyachal temple testimonials, Namami Vindhyavasini comments, devotee feedback, reviews, विंध्यवासिनी फीडबैक, विंध्याचल भक्त अनुभव",
      },
      {
        property: "og:title",
        content: "Devotee Reviews & Feedback | Namami Vindhyavasini Sansthan",
      },
      {
        property: "og:description",
        content:
          "Read reviews, testimonials, and experiences shared by devotees of Maa Vindhyavasini. Share your feedback, comments, and spiritual experiences.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://www.namamivindhyavasini.in/reviews" },
      { property: "og:image", content: "https://www.namamivindhyavasini.in/maa-vindhyavasini.png" },
      { name: "twitter:card", content: "summary_large_image" },
      {
        name: "twitter:title",
        content: "Devotee Reviews & Feedback | Namami Vindhyavasini Sansthan",
      },
      {
        name: "twitter:description",
        content:
          "Read reviews, testimonials, and experiences shared by devotees of Maa Vindhyavasini.",
      },
      {
        name: "twitter:image",
        content: "https://www.namamivindhyavasini.in/maa-vindhyavasini.png",
      },
    ],
    links: [{ rel: "canonical", href: "https://www.namamivindhyavasini.in/reviews" }],
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
    <PageShell>
      <PageHero title="Reviews" subtitle="Could not load reviews." />
      <div className="container mx-auto px-6 py-10 text-center text-muted-foreground">
        {error.message}
      </div>
    </PageShell>
  ),
  notFoundComponent: () => (
    <PageShell>
      <PageHero title="Not found" />
    </PageShell>
  ),
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
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function ReviewsPage() {
  const { reviews } = Route.useLoaderData();
  const { t, lang } = useLang();
  const hi = lang === "hi";
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

  const webpageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": "https://www.namamivindhyavasini.in/reviews#webpage",
    url: "https://www.namamivindhyavasini.in/reviews",
    name: "Devotee Reviews & Feedback | Namami Vindhyavasini Sansthan",
    description:
      "Read reviews, testimonials, and experiences shared by devotees of Maa Vindhyavasini. Share your feedback, comments, and spiritual experiences with the Sansthan.",
    isPartOf: {
      "@type": "WebSite",
      "@id": "https://www.namamivindhyavasini.in/#website",
      url: "https://www.namamivindhyavasini.in",
    },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://www.namamivindhyavasini.in",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Reviews",
        item: "https://www.namamivindhyavasini.in/reviews",
      },
    ],
  };

  const latestThree = reviews.slice(0, 3);
  const remainingReviews = reviews.slice(3);

  return (
    <PageShell>
      <JsonLd data={webpageSchema} />
      <JsonLd data={breadcrumbSchema} />
      <PageHero
        sanskrit={t("reviews.sanskrit")}
        title={t("reviews.title")}
        subtitle={t("reviews.subtitle")}
      />

      {/* LATEST 3 REVIEWS */}
      <section className="container mx-auto px-6 py-10">
        <h2 className={`font-display text-2xl md:text-3xl text-maroon mb-6 text-center ${dev}`}>
          {hi ? "नवीनतम पावन अनुभव" : "Latest Experiences"}
        </h2>
        {latestThree.length === 0 ? (
          <p className={`text-muted-foreground text-center ${dev}`}>{t("reviews.first")}</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {latestThree.map((r: Review) => (
              <article
                key={r.id}
                className="p-5 rounded-xl bg-card border border-gold/30 hover:border-gold hover:shadow-sacred transition-premium flex flex-col justify-between"
              >
                <p className="text-foreground/85 leading-relaxed text-sm italic mb-4">
                  "{r.comment}"
                </p>
                <div className="flex items-center gap-3 border-t border-gold/10 pt-3 mt-auto">
                  <div className="w-8 h-8 rounded-full bg-gradient-sacred flex items-center justify-center text-cream font-display text-xs shrink-0">
                    {r.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="font-semibold text-maroon text-xs">{r.name}</div>
                    <div className="text-[10px] text-muted-foreground">{timeAgo(r.created_at)}</div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* WRITE A REVIEW FORM (COMPACT CONTAINER TAKING LESS SPACE) */}
      <section className="container mx-auto px-6 py-6 max-w-md">
        <form
          onSubmit={submit}
          className="p-5 rounded-2xl bg-card border border-gold/30 shadow-sacred relative overflow-hidden"
        >
          <div className="absolute inset-0 mandala-bg opacity-10 pointer-events-none" />
          <h3 className={`font-display text-lg text-maroon mb-3 relative z-10 ${dev}`}>
            {t("reviews.leave")}
          </h3>
          <div className="space-y-3 relative z-10">
            <div>
              <label className={`block text-xs font-semibold text-foreground/80 mb-1 ${dev}`}>
                {t("reviews.name")}
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={80}
                required
                className="w-full px-3 py-1.5 text-sm rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-gold"
                placeholder={t("reviews.name.ph")}
              />
            </div>
            <div>
              <label className={`block text-xs font-semibold text-foreground/80 mb-1 ${dev}`}>
                {t("reviews.comment")}
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={3}
                minLength={3}
                maxLength={1000}
                required
                className="w-full px-3 py-1.5 text-sm rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-gold resize-none"
                placeholder={t("reviews.comment.ph")}
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className={`w-full px-4 py-2 text-sm rounded-full bg-gradient-sacred text-cream font-medium shadow-gold hover:opacity-95 transition disabled:opacity-60 ${dev}`}
            >
              {submitting ? t("reviews.submitting") : t("reviews.submit")}
            </button>
          </div>
        </form>
      </section>

      {/* REMAINING REVIEWS */}
      {remainingReviews.length > 0 && (
        <section className="container mx-auto px-6 py-10 border-t border-gold/15">
          <h3 className={`font-display text-xl md:text-2xl text-maroon mb-6 text-center ${dev}`}>
            {hi ? "श्रद्धालुओं के पावन अनुभव" : "More Devotee Experiences"}
          </h3>
          <div className="max-w-2xl mx-auto space-y-4">
            {remainingReviews.map((r: Review) => (
              <article
                key={r.id}
                className="p-5 rounded-2xl bg-card border border-border hover:border-gold/50 transition-premium shadow-sm"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-sacred flex items-center justify-center text-cream font-display text-sm shrink-0">
                    {r.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="font-semibold text-maroon text-sm">{r.name}</div>
                    <div className="text-[10px] text-muted-foreground">{timeAgo(r.created_at)}</div>
                  </div>
                </div>
                <p className="text-foreground/85 leading-relaxed text-sm">"{r.comment}"</p>
              </article>
            ))}
          </div>
        </section>
      )}
    </PageShell>
  );
}
