import { createFileRoute } from "@tanstack/react-router";
import { PageShell, PageHero } from "@/components/PageShell";
import { ScrollReveal } from "@/components/ScrollReveal";
import { Calendar, MapPin } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { useLang } from "@/i18n/LangProvider";
import { JsonLd } from "@/components/JsonLd";

type EventRow = Tables<"events">;

export const Route = createFileRoute("/events")({
  head: () => ({
    meta: [
      { title: "Spiritual Events, Navratri Pujas & Satsangs | Namami Vindhyavasini" },
      {
        name: "description",
        content:
          "Stay updated on upcoming spiritual events, Navratri celebrations, regular satsangs, bhandaras, and special pujas organized at Maa Vindhyavasini Dham.",
      },
      {
        name: "keywords",
        content:
          "Vindhyachal temple events, Navratri celebration schedule, satsang dates, temple bhandara, spiritual events",
      },
      {
        property: "og:title",
        content: "Spiritual Events, Navratri Pujas & Satsangs | Namami Vindhyavasini",
      },
      {
        property: "og:description",
        content:
          "Stay updated on upcoming spiritual events, Navratri celebrations, regular satsangs, bhandaras, and special pujas organized at Maa Vindhyavasini Dham.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://www.namamivindhyavasini.in/events" },
      { property: "og:image", content: "https://www.namamivindhyavasini.in/maa-vindhyavasini.png" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Spiritual Events, Navratri Pujas & Satsangs" },
      {
        name: "twitter:description",
        content:
          "Stay updated on upcoming spiritual events, Navratri celebrations, regular satsangs, and special pujas.",
      },
      {
        name: "twitter:image",
        content: "https://www.namamivindhyavasini.in/maa-vindhyavasini.png",
      },
    ],
    links: [{ rel: "canonical", href: "https://www.namamivindhyavasini.in/events" }],
  }),
  loader: async () => {
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .order("event_date", { ascending: true });
    if (error) throw error;
    return { events: (data ?? []) as EventRow[] };
  },
  errorComponent: ({ error }) => (
    <PageShell>
      <PageHero title="Events" subtitle="Could not load events." />
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
  component: EventsPage,
});

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatDateRange(startDate: string, endDate: string | null) {
  if (!endDate || startDate === endDate) {
    return formatDate(startDate);
  }
  return `${formatDate(startDate)} - ${formatDate(endDate)}`;
}

function EventCard({ e, accent }: { e: EventRow; accent: "gold" | "muted" | "live" }) {
  return (
    <article className="rounded-2xl overflow-hidden bg-card border border-border hover:-translate-y-1.5 hover:shadow-gold transition-all duration-300 relative h-full flex flex-col">
      <div
        className={`h-1.5 ${
          accent === "live"
            ? "bg-gradient-to-r from-red-500 to-orange-500"
            : accent === "gold"
              ? "bg-gradient-sacred"
              : "bg-muted"
        }`}
      />
      <div className="p-7 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start gap-4 mb-3">
            <h3 className="font-display text-2xl text-maroon">{e.title}</h3>
            {accent === "live" && (
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-600 border border-red-200 dark:bg-red-950/30 dark:text-red-400 dark:border-red-900/50 shrink-0">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                </span>
                LIVE
              </span>
            )}
          </div>
          <div className="flex flex-col gap-1.5 text-sm text-muted-foreground mb-4">
            <span className="flex items-center gap-2">
              <Calendar size={14} className="text-gold" />{" "}
              {formatDateRange(e.event_date, e.end_date)}
            </span>
            <span className="flex items-center gap-2">
              <MapPin size={14} className="text-gold" /> {e.location}
            </span>
          </div>
          <p className="text-foreground/80">{e.description}</p>
        </div>
      </div>
    </article>
  );
}

function EventsPage() {
  const { events } = Route.useLoaderData();
  const { t, lang } = useLang();
  const dev = lang === "hi" ? "font-devanagari" : "";

  // Calculate todayIso using local timezone date formatting
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  const todayIso = `${year}-${month}-${day}`;

  const todayEvents = events.filter((e: EventRow) => {
    const end = e.end_date || e.event_date;
    return e.event_date <= todayIso && end >= todayIso;
  });
  const upcoming = events.filter((e: EventRow) => e.event_date > todayIso);
  const past = events.filter((e: EventRow) => {
    const end = e.end_date || e.event_date;
    return end < todayIso;
  });

  const webpageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": "https://www.namamivindhyavasini.in/events#webpage",
    url: "https://www.namamivindhyavasini.in/events",
    name: "Spiritual Events, Navratri Pujas & Satsangs | Namami Vindhyavasini",
    description:
      "Stay updated on upcoming spiritual events, Navratri celebrations, regular satsangs, bhandaras, and special pujas organized at Maa Vindhyavasini Dham.",
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
        name: "Events",
        item: "https://www.namamivindhyavasini.in/events",
      },
    ],
  };

  return (
    <PageShell>
      <JsonLd data={webpageSchema} />
      <JsonLd data={breadcrumbSchema} />
      <PageHero
        sanskrit={t("events.sanskrit")}
        title={t("events.title")}
        subtitle={t("events.subtitle")}
      />
      <section className="container mx-auto px-6 py-16">
        {todayEvents.length > 0 && (
          <div className="mb-16">
            <h2
              className={`font-display text-3xl text-red-600 mb-8 flex items-center gap-3 ${dev}`}
            >
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
              </span>
              {t("events.today")}
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {todayEvents.map((e: EventRow, idx: number) => (
                <ScrollReveal key={e.id} direction="up" delay={idx * 120} duration={800}>
                  <EventCard e={e} accent="live" />
                </ScrollReveal>
              ))}
            </div>
          </div>
        )}

        <h2 className={`font-display text-3xl text-maroon mb-8 ${dev}`}>{t("events.upcoming")}</h2>
        {upcoming.length === 0 ? (
          <p className={`text-muted-foreground mb-12 ${dev}`}>{t("events.empty.up")}</p>
        ) : (
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            {upcoming.map((e: EventRow, idx: number) => (
              <ScrollReveal key={e.id} direction="up" delay={idx * 120} duration={800}>
                <EventCard e={e} accent="gold" />
              </ScrollReveal>
            ))}
          </div>
        )}

        <h2 className={`font-display text-3xl text-maroon mb-8 ${dev}`}>{t("events.past")}</h2>
        {past.length === 0 ? (
          <p className={`text-muted-foreground ${dev}`}>{t("events.empty.past")}</p>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {past.map((e: EventRow, idx: number) => (
              <ScrollReveal key={e.id} direction="up" delay={idx * 120} duration={800}>
                <EventCard e={e} accent="muted" />
              </ScrollReveal>
            ))}
          </div>
        )}
      </section>
    </PageShell>
  );
}
