import { createFileRoute } from "@tanstack/react-router";
import { PageShell, PageHero } from "@/components/PageShell";
import { useState } from "react";
import { useLang } from "@/i18n/LangProvider";
import { Play, Smartphone } from "lucide-react";

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
  component: VideosPage,
});

type Video = { type: "video" | "short"; id: string; title: string; embed: string };

const videos: Video[] = [
  {
    type: "video",
    id: "i3W9AOFhJAI",
    title: "वानी की आंखें #wani #motivation #ramayan Astro Yogi Umesh",
    embed: "https://www.youtube.com/embed/i3W9AOFhJAI",
  },
  {
    type: "video",
    id: "K-so00Mxplc",
    title: "Promotion of Shakti ramayan composed by Astro Yogi Umesh #astrology #ramayan",
    embed: "https://www.youtube.com/embed/K-so00Mxplc",
  },
  {
    type: "video",
    id: "-8K78I4i--M",
    title:
      "🕉 Satsang of Chaturbhuj Sahay | Part 1 | Astro Yogi Umesh 👃 #satsang #motivation Astro Yogi Umesh",
    embed: "https://www.youtube.com/embed/-8K78I4i--M",
  },
  {
    type: "video",
    id: "Te2CZqtD-fA",
    title:
      "Can FAITH REALLY Change Your Life for the Better with Astro Yogi Umesh?#motivation #ashtrology",
    embed: "https://www.youtube.com/embed/Te2CZqtD-fA",
  },
  {
    type: "video",
    id: "Fk19RUU8OiE",
    title:
      "GOD IS BEYOND CASTE CREED & RELIGION#motivation #ashtrology #motivation Astro Yogi Umesh",
    embed: "https://www.youtube.com/embed/Fk19RUU8OiE",
  },
  {
    type: "video",
    id: "5HgNHj7TTRs",
    title: "POWER OF THOUGHT | Astro Yogi Umesh",
    embed: "https://www.youtube.com/embed/5HgNHj7TTRs",
  },
  {
    type: "video",
    id: "wClj_jb9XaU",
    title: "POWER OF THOUGHT? Astro Yogi Umesh",
    embed: "https://www.youtube.com/embed/wClj_jb9XaU",
  },
  {
    type: "video",
    id: "h9ZqqRqsIRs",
    title: "Message of Geeta | Astro Yogi Umesh",
    embed: "https://www.youtube.com/embed/h9ZqqRqsIRs",
  },
  {
    type: "video",
    id: "lA91SpOMNMc",
    title: "ADMINISTRATIVE REFORM | Astro Yogi Umesh",
    embed: "https://www.youtube.com/embed/lA91SpOMNMc",
  },
  {
    type: "video",
    id: "nq1Khkibs34",
    title: "DEVI & MAHISHASUR ARE BOTH INSIDE US | Astro Yogi Umesh",
    embed: "https://www.youtube.com/embed/nq1Khkibs34",
  },
  {
    type: "video",
    id: "LnMj0HJAfPE",
    title: "भक्ति की शक्ति | Astro Yogi Umesh",
    embed: "https://www.youtube.com/embed/LnMj0HJAfPE",
  },
  {
    type: "video",
    id: "rlxa_NGiSP0",
    title: "भक्ति की शक्ति | Astro Yogi Umesh",
    embed: "https://www.youtube.com/embed/rlxa_NGiSP0",
  },
  {
    type: "video",
    id: "kKiVhTftsJg",
    title: "भक्ति की शक्ति | Astro Yogi Umesh",
    embed: "https://www.youtube.com/embed/kKiVhTftsJg",
  },
  {
    type: "video",
    id: "YHNA2S6khWw",
    title: "शक्ति का रहस्य शक्ति गीता में | Astro Yogi Umesh",
    embed: "https://www.youtube.com/embed/YHNA2S6khWw",
  },
  {
    type: "short",
    id: "l5HajRbr-9g",
    title: "Stop believing, start experiencing #spirituality #mindset #motivation",
    embed: "https://www.youtube.com/embed/l5HajRbr-9g",
  },
  {
    type: "short",
    id: "JP_ETfz2o_0",
    title: "rebirth of disciple #rebirth #shorts #vivekananda",
    embed: "https://www.youtube.com/embed/JP_ETfz2o_0",
  },
  {
    type: "short",
    id: "xVbAu2K2jP8",
    title: "True sprituality #shorts #spirituality #bhati_film_studio",
    embed: "https://www.youtube.com/embed/xVbAu2K2jP8",
  },
  {
    type: "short",
    id: "vgU9TVuLv0Q",
    title: "Power of soule is everything #soule #shorts #vivekanada",
    embed: "https://www.youtube.com/embed/vgU9TVuLv0Q",
  },
  {
    type: "short",
    id: "TFEd95rX3XU",
    title: "importance of god name #shorts #astrology #bhakti",
    embed: "https://www.youtube.com/embed/TFEd95rX3XU",
  },
  {
    type: "short",
    id: "nkeWw3kmICw",
    title: "मुक्ति मार्ग #mukti #shortsfeed #astrology #spirituality",
    embed: "https://www.youtube.com/embed/nkeWw3kmICw",
  },
  {
    type: "short",
    id: "9xKZ2XlxNsM",
    title: "माया क्या है और यह आपके जीवन को कैसे नियंत्रित करता है #astrology #spirituality #maya",
    embed: "https://www.youtube.com/embed/9xKZ2XlxNsM",
  },
  {
    type: "short",
    id: "CXckWwGDQsM",
    title: "Your Actions Today Shape Your Tomorrow #karma #astrology #spirituality",
    embed: "https://www.youtube.com/embed/CXckWwGDQsM",
  },
  {
    type: "short",
    id: "qeE12KcDRG4",
    title: "This Is How Saints Connect To God #faith #spirituality",
    embed: "https://www.youtube.com/embed/qeE12KcDRG4",
  },
  {
    type: "short",
    id: "CJa96Q7lppc",
    title: "How science and sprituality is related #spirituality #sorts",
    embed: "https://www.youtube.com/embed/CJa96Q7lppc",
  },
  {
    type: "short",
    id: "lIUSsibDj1Y",
    title: "God के साथ connect करने का सही तरीका #faith #divine #astrology",
    embed: "https://www.youtube.com/embed/lIUSsibDj1Y",
  },
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
                tab === "video"
                  ? "bg-gradient-sacred text-cream shadow-sacred"
                  : "text-maroon hover:bg-cream/50"
              } ${dev}`}
            >
              <Play size={14} /> {t("videos.tab.videos")}
            </button>
            <button
              onClick={() => setTab("short")}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-medium transition ${
                tab === "short"
                  ? "bg-gradient-sacred text-cream shadow-sacred"
                  : "text-maroon hover:bg-cream/50"
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
