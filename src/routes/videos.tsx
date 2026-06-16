import { createFileRoute } from "@tanstack/react-router";
import { PageShell, PageHero } from "@/components/PageShell";
import { ScrollReveal } from "@/components/ScrollReveal";
import { useLang } from "@/i18n/LangProvider";
import { Play, Smartphone } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { JsonLd } from "@/components/JsonLd";

export const Route = createFileRoute("/videos")({
  head: () => ({
    meta: [
      { title: "Devotional Videos, Aarti & Shorts | Maa Vindhyavasini" },
      {
        name: "description",
        content:
          "Watch daily aartis, bhajan, spiritual discourses, temple videos, and YouTube shorts celebrating the divine presence of Goddess Vindhyavasini.",
      },
      {
        name: "keywords",
        content:
          "Vindhyavasini videos, live aarti, devi bhajans, Vindhyachal shorts, kirtan pravachan videos, माँ विंध्यवासिनी वीडियो, आरती",
      },
      { property: "og:title", content: "Devotional Videos, Aarti & Shorts | Maa Vindhyavasini" },
      {
        property: "og:description",
        content:
          "Watch daily aartis, bhajan, spiritual discourses, temple videos, and YouTube shorts celebrating the divine presence of Goddess Vindhyavasini.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://www.namamivindhyavasini.in/videos" },
      { property: "og:image", content: "https://www.namamivindhyavasini.in/maa-vindhyavasini.png" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Devotional Videos, Aarti & Shorts" },
      {
        name: "twitter:description",
        content:
          "Watch daily aartis, bhajan, spiritual discourses, temple videos, and YouTube shorts celebrating the divine presence of Goddess Vindhyavasini.",
      },
      { name: "twitter:image", content: "https://www.namamivindhyavasini.in/maa-vindhyavasini.png" },
    ],
    links: [
      { rel: "canonical", href: "https://www.namamivindhyavasini.in/videos" }
    ]
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

function getYoutubeVideoId(embedUrl: string): string | null {
  const match = embedUrl.match(/(?:embed\/|v\/|watch\?v=|youtu\.be\/|shorts\/)([^#\&\?]*)/);
  if (match && match[1] && match[1].length === 11) {
    return match[1];
  }
  return null;
}

function VideoPlayer({
  v,
  dev,
  isPlaying,
  onPlay,
}: {
  v: Video;
  dev: string;
  isPlaying: boolean;
  onPlay: () => void;
}) {
  const videoId = getYoutubeVideoId(v.embed);

  if (videoId) {
    const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
    const embedUrlWithAutoplay = v.embed.includes("?")
      ? `${v.embed}&autoplay=1`
      : `${v.embed}?autoplay=1`;

    if (isPlaying) {
      return (
        <iframe
          className="w-full h-full border-0"
          src={embedUrlWithAutoplay}
          title={v.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      );
    }

    return (
      <button
        onClick={onPlay}
        className="relative w-full h-full group cursor-pointer focus:outline-none block overflow-hidden bg-black"
        aria-label={`Play ${v.title}`}
      >
        <img
          src={thumbnailUrl}
          alt={v.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-black/45 group-hover:bg-gradient-to-t group-hover:from-maroon/60 group-hover:to-black/40 transition-all duration-300 flex items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-cream text-maroon flex items-center justify-center shadow-gold group-hover:scale-110 transition-transform duration-300 border-2 border-gold/70">
            <Play className="fill-maroon ml-1 text-maroon" size={26} />
          </div>
        </div>
      </button>
    );
  }

  return (
    <iframe
      className="w-full h-full border-0"
      src={v.embed}
      title={v.title}
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
    />
  );
}

function VideosPage() {
  const { fetchedVideos } = Route.useLoaderData();
  const { t, lang } = useLang();
  const dev = lang === "hi" ? "font-devanagari" : "";
  const [activeTab, setActiveTab] = useState<"video" | "short">("video");
  const [playingId, setPlayingId] = useState<string | null>(null);

  const activeVideos: Video[] = (fetchedVideos as Video[]) || [];
  const list = activeVideos.filter((v) => v.type === activeTab);

  const handleTabChange = (tab: "video" | "short") => {
    setActiveTab(tab);
    setPlayingId(null);
  };

  const webpageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": "https://www.namamivindhyavasini.in/videos#webpage",
    "url": "https://www.namamivindhyavasini.in/videos",
    "name": "Devotional Videos, Aarti & Shorts | Maa Vindhyavasini",
    "description": "Watch daily aartis, bhajan, spiritual discourses, temple videos, and YouTube shorts celebrating the divine presence of Goddess Vindhyavasini.",
    "isPartOf": {
      "@type": "WebSite",
      "@id": "https://www.namamivindhyavasini.in/#website",
      "url": "https://www.namamivindhyavasini.in"
    }
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://www.namamivindhyavasini.in"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Videos",
        "item": "https://www.namamivindhyavasini.in/videos"
      }
    ]
  };

  return (
    <PageShell>
      <JsonLd data={webpageSchema} />
      <JsonLd data={breadcrumbSchema} />
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
              onClick={() => handleTabChange("video")}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-medium transition cursor-pointer ${
                activeTab === "video"
                  ? "bg-gradient-sacred text-cream shadow-sacred"
                  : "text-maroon hover:bg-cream/50"
              } ${dev}`}
            >
              <Play size={14} /> {t("videos.tab.videos")}
            </button>
            <button
              onClick={() => handleTabChange("short")}
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
                    <VideoPlayer
                      v={v}
                      dev={dev}
                      isPlaying={playingId === v.id}
                      onPlay={() => setPlayingId(v.id)}
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
                    <VideoPlayer
                      v={s}
                      dev={dev}
                      isPlaying={playingId === s.id}
                      onPlay={() => setPlayingId(s.id)}
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
