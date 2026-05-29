import { createFileRoute } from "@tanstack/react-router";
import { PageShell, PageHero } from "@/components/PageShell";
import { ScrollReveal } from "@/components/ScrollReveal";
import { useLang } from "@/i18n/LangProvider";
import { Play, Smartphone } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";

export const Route = createFileRoute("/videos")({
  head: () => ({
    meta: [
      { title: "Videos — Namami Vindhyavasini" },
      {
        name: "description",
        content: "Watch latest darshan, kirtan and pravachan videos from Vindhyachal Dham.",
      },
      { property: "og:title", content: "Videos — Namami Vindhyavasini" },
      { property: "og:description", content: "Latest darshan, kirtan and pravachan videos." },
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
      console.warn("Failed to load videos from database, will fallback to static list", e);
    }
    return { fetchedVideos: null };
  },
  component: VideosPage,
});

export type Video = { type: "video" | "short"; id: string; title: string; embed: string };

export const videos: Video[] = [];

function VideosPage() {
  const { fetchedVideos } = Route.useLoaderData();
  const { t, lang } = useLang();
  const dev = lang === "hi" ? "font-devanagari" : "";
  const [activeTab, setActiveTab] = useState<"video" | "short">("video");

  const activeVideos: Video[] = (fetchedVideos as Video[]) || [];
  const list = activeVideos.filter((v) => v.type === activeTab);

  return (
    <PageShell>
      <PageHero
        sanskrit={t("videos.sanskrit")}
        title={t("videos.title")}
        subtitle={t("videos.subtitle")}
      />

      <section className="container mx-auto px-6 py-10">
        {/* Toggle Tabs */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex rounded-full bg-card border-2 border-gold/40 p-1 shadow-gold">
            <button
              onClick={() => setActiveTab("video")}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-medium transition cursor-pointer ${
                activeTab === "video"
                  ? "bg-gradient-sacred text-cream shadow-sacred"
                  : "text-maroon hover:bg-cream/50"
              } ${dev}`}
            >
              <Play size={14} /> {t("videos.tab.videos")}
            </button>
            <button
              onClick={() => setActiveTab("short")}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-medium transition cursor-pointer ${
                activeTab === "short"
                  ? "bg-gradient-sacred text-cream shadow-sacred"
                  : "text-maroon hover:bg-cream/50"
              } ${dev}`}
            >
              <Smartphone size={14} /> {t("videos.tab.shorts")}
            </button>
          </div>
        </div>

        {activeTab === "video" ? (
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {list.map((v, idx) => (
              <ScrollReveal key={v.id} direction="up" delay={(idx % 2) * 120} duration={800}>
                <div className="hover:-translate-y-1.5 transition-all duration-300">
                  <div className="aspect-video rounded-2xl overflow-hidden shadow-sacred border-2 border-gold/40 hover:border-gold/60 transition-colors">
                    <iframe
                      className="w-full h-full"
                      src={v.embed}
                      title={v.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                  <p className={`mt-3 text-muted-foreground text-sm ${dev}`}>{v.title}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {list.map((s, idx) => (
              <ScrollReveal key={s.id} direction="up" delay={(idx % 3) * 100} duration={750}>
                <div className="hover:-translate-y-1.5 transition-all duration-300">
                  <div className="aspect-[9/16] rounded-2xl overflow-hidden shadow-gold border-2 border-gold/40 bg-background hover:border-gold/60 transition-colors">
                    <iframe
                      className="w-full h-full"
                      src={s.embed}
                      title={s.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                  <p className={`mt-3 text-muted-foreground text-sm text-center ${dev}`}>
                    {s.title}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        )}
      </section>
    </PageShell>
  );
}
