import { createFileRoute } from "@tanstack/react-router";
import { PageShell, PageHero } from "@/components/PageShell";
import { ScrollReveal } from "@/components/ScrollReveal";
import { Calendar, MapPin } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { useLang } from "@/i18n/LangProvider";

type EventRow = Tables<"events">;

export const Route = createFileRoute("/events")({
  head: () => ({
    meta: [
      { title: "Events — Namami Vindhyavasini Sansthan" },
      {
        name: "description",
        content:
          "Upcoming and past temple events, festivals, satsang and seva programmes at Vindhyachal Dham.",
      },
      { property: "og:title", content: "Temple Events & Festivals" },
      {
        property: "og:description",
        content: "Navratri, satsang, bhandaras and more — join our temple events.",
      },
    ],
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

function EventCard({ e, accent }: { e: EventRow; accent: "gold" | "muted" }) {
  return (
    <article className="rounded-2xl overflow-hidden bg-card border border-border hover:-translate-y-1.5 hover:shadow-gold transition-all duration-300">
      <div className={`h-1.5 ${accent === "gold" ? "bg-gradient-sacred" : "bg-muted"}`} />
      <div className="p-7">
        <h3 className="font-display text-2xl text-maroon mb-3">{e.title}</h3>
        <div className="flex flex-col gap-1.5 text-sm text-muted-foreground mb-4">
          <span className="flex items-center gap-2">
            <Calendar size={14} className="text-gold" /> {formatDate(e.event_date)}
          </span>
          <span className="flex items-center gap-2">
            <MapPin size={14} className="text-gold" /> {e.location}
          </span>
        </div>
        <p className="text-foreground/80">{e.description}</p>
      </div>
    </article>
  );
}

function EventsPage() {
  const { events } = Route.useLoaderData();
  const { t, lang } = useLang();
  const dev = lang === "hi" ? "font-devanagari" : "";
  const todayIso = new Date().toISOString().slice(0, 10);
  const upcoming = events.filter((e: EventRow) => e.event_date >= todayIso);
  const past = events.filter((e: EventRow) => e.event_date < todayIso);

  return (
    <PageShell>
      <PageHero
        sanskrit={t("events.sanskrit")}
        title={t("events.title")}
        subtitle={t("events.subtitle")}
      />
      <section className="container mx-auto px-6 py-16">
        <h2 className={`font-display text-3xl text-maroon mb-8 ${dev}`}>{t("events.upcoming")}</h2>
        {upcoming.length === 0 ? (
          <p className={`text-muted-foreground mb-12 ${dev}`}>{t("events.empty.up")}</p>
        ) : (
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            {upcoming.map((e: EventRow, idx) => (
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
          <div className="grid md:grid-cols-2 gap-6">
            {past.map((e: EventRow, idx) => (
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
