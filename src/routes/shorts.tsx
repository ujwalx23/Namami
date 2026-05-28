import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell, PageHero } from "@/components/PageShell";
import { useLang } from "@/i18n/LangProvider";
import { Play, Smartphone } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Video, videos } from "./videos";

export const Route = createFileRoute("/shorts")({
  head: () => ({
    meta: [
      { title: "Shorts — Namami Vindhyavasini" },
      {
        name: "description",
        content: "Watch latest devotional shorts and quick divine moments from Vindhyachal Dham.",
      },
      { property: "og:title", content: "Shorts — Namami Vindhyavasini" },
      { property: "og:description", content: "Devotional shorts and quick divine moments." },
    ],
  }),
  loader: async () => {
    try {
      const { data, error } = await supabase
        .from("youtube_videos")
        .select("id,title,type,embed")
        .order("created_at", { ascending: false });
      if (!error && data && data.length > 0) {
        return { fetchedVideos: data as Video[] };
      }
    } catch (e) {
      console.warn("Failed to load shorts from database, will fallback to static list", e);
    }
    return { fetchedVideos: null };
  },
  component: ShortsPage,
});

function ShortsPage() {
  const { fetchedVideos } = Route.useLoaderData();
  const { t, lang } = useLang();
  const dev = lang === "hi" ? "font-devanagari" : "";

  const activeVideos: Video[] = (fetchedVideos as Video[]) || [];
  // Strictly filter to short type only
  const list = activeVideos.filter((v) => v.type === "short");

  return (
    <PageShell>
      <PageHero
        sanskrit={t("shorts.sanskrit")}
        title={t("shorts.title")}
        subtitle={t("shorts.subtitle")}
      />

      <section className="container mx-auto px-6 py-10">
        {/* Route Links as Tabs */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex rounded-full bg-card border-2 border-gold/40 p-1 shadow-gold">
            <Link
              to="/videos"
              className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-medium transition text-maroon hover:bg-cream/50 ${dev}`}
            >
              <Play size={14} /> {t("videos.tab.videos")}
            </Link>
            <Link
              to="/shorts"
              className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-medium transition bg-gradient-sacred text-cream shadow-sacred ${dev}`}
            >
              <Smartphone size={14} /> {t("videos.tab.shorts")}
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {list.map((s) => (
            <div key={s.id}>
              <div className="aspect-[9/16] rounded-2xl overflow-hidden shadow-gold border-2 border-gold/40 bg-background">
                <iframe
                  className="w-full h-full"
                  src={s.embed}
                  title={s.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              <p className={`mt-3 text-muted-foreground text-sm text-center ${dev}`}>{s.title}</p>
            </div>
          ))}
        </div>
      </section>
    </PageShell>
  );
}
