import { createFileRoute } from "@tanstack/react-router";
import { PageShell, PageHero } from "@/components/PageShell";
import { useState } from "react";
import { useLang } from "@/i18n/LangProvider";
import { Play, Smartphone } from "lucide-react";

export const Route = createFileRoute("/videos")({
  head: () => ({
    meta: [
      { title: "Videos — Namami Vindhyavasini" },
      { name: "description", content: "Watch latest darshan, kirtan and pravachan videos from Vindhyachal Dham." },
      { property: "og:title", content: "Videos — Namami Vindhyavasini" },
      { property: "og:description", content: "Latest darshan, kirtan and pravachan videos." },
    ],
  }),
  component: VideosPage,
});

type Video = { type: "video" | "short"; id: string; title: string; embed: string };

const videos: Video[] = [
  { type: "video", id: "kJQexuL3mAE", title: "Darshan & Aarti", embed: "https://www.youtube.com/embed/kJQexuL3mAE" },
  { type: "video", id: "-MQctW-wAY0", title: "Vindhyachal Dham Pravachan", embed: "https://www.youtube.com/embed/-MQctW-wAY0" },
  { type: "short", id: "PAzuuM_cp1w", title: "Divine Short", embed: "https://www.youtube.com/embed/PAzuuM_cp1w" },
  { type: "short", id: "fZ2oAqQH7ZI", title: "Maa Vindhyawasini Short", embed: "https://www.youtube.com/embed/fZ2oAqQH7ZI" },
];

function VideosPage() {
  const { t, lang } = useLang();
  const dev = lang === "hi" ? "font-devanagari" : "";
  const [tab, setTab] = useState<"video" | "short">("video");
  const list = videos.filter((v) => v.type === tab);

  return (
    <PageShell>
      <PageHero
        sanskrit={t("videos.sanskrit")}
        title={t("videos.title")}
        subtitle={t("videos.subtitle")}
      />

      <section className="container mx-auto px-6 py-10">
        {/* Tabs */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex rounded-full bg-card border-2 border-gold/40 p-1 shadow-gold">
            <button
              onClick={() => setTab("video")}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-medium transition ${
                tab === "video" ? "bg-gradient-sacred text-cream shadow-sacred" : "text-maroon hover:bg-cream/50"
              } ${dev}`}
            >
              <Play size={14} /> {t("videos.tab.videos")}
            </button>
            <button
              onClick={() => setTab("short")}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-medium transition ${
                tab === "short" ? "bg-gradient-sacred text-cream shadow-sacred" : "text-maroon hover:bg-cream/50"
              } ${dev}`}
            >
              <Smartphone size={14} /> {t("videos.tab.shorts")}
            </button>
          </div>
        </div>

        {tab === "video" ? (
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {list.map((v) => (
              <div key={v.id}>
                <div className="aspect-video rounded-2xl overflow-hidden shadow-sacred border-2 border-gold/40">
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
            ))}
          </div>
        ) : (
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
        )}
      </section>
    </PageShell>
  );
}
