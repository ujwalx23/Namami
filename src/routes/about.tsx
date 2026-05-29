import { createFileRoute } from "@tanstack/react-router";
import { PageShell, PageHero } from "@/components/PageShell";
import { useLang } from "@/i18n/LangProvider";
import type { TKey } from "@/i18n/translations";
import { Mountain, Compass, Plane, Train, Bus, Sparkles, Calendar } from "lucide-react";
import maaImg3 from "@/assets/maa-vindhyavasini-3.jpg";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Maa Vindhyavasini Dhaam — History, Trikona Parikrama & Sansthan" },
      {
        name: "description",
        content:
          "Discover Maa Vindhyavasini Shakti Pitha at Vindhyachal: history, Trikona Parikrama (Vindhyavasini, Kali Khoh, Ashtabhuja), Vindhya Corridor, festivals and how to reach.",
      },
      { property: "og:title", content: "About Maa Vindhyavasini Dhaam" },
      {
        property: "og:description",
        content:
          "History, sacred origin and pilgrimage details of Maa Vindhyavasini Shakti Pitha at Vindhyachal.",
      },
    ],
  }),
  component: AboutPage,
});

function Section({
  title,
  children,
  className = "",
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  const { lang } = useLang();
  const dev = lang === "hi" ? "font-devanagari" : "";
  return (
    <section className={className}>
      <h2 className={`font-display text-3xl md:text-4xl text-maroon mb-5 ${dev}`}>{title}</h2>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

function AboutPage() {
  const { t, lang } = useLang();
  const hi = lang === "hi";
  const dev = hi ? "font-devanagari" : "";

  const trikona: {
    tk: TKey;
    xk: TKey;
    icon: React.ComponentType<{ size?: number; className?: string }>;
  }[] = [
    { tk: "about.tri.1.title", xk: "about.tri.1.text", icon: Sparkles },
    { tk: "about.tri.2.title", xk: "about.tri.2.text", icon: Mountain },
    { tk: "about.tri.3.title", xk: "about.tri.3.text", icon: Compass },
  ];

  const facts = hi
    ? [
        { k: "देवता", v: "देवी विन्ध्यवासिनी (दुर्गा)" },
        { k: "स्थान", v: "विन्ध्याचल, मिर्जापुर, उ.प्र." },
        { k: "नदी", v: "गंगा" },
        { k: "स्थापत्य", v: "नागर शैली" },
        { k: "स्थिति", v: "शक्तिपीठ • सक्रिय" },
        { k: "मुख्य उत्सव", v: "नवरात्रि, कजरी" },
      ]
    : [
        { k: "Deity", v: "Devi Vindhyavasini (Durga)" },
        { k: "Location", v: "Vindhyachal, Mirzapur, UP" },
        { k: "River", v: "Ganga" },
        { k: "Architecture", v: "Nagara Style" },
        { k: "Status", v: "Shakti Pitha • Active" },
        { k: "Main Festivals", v: "Navaratri, Kajari" },
      ];

  return (
    <PageShell>
      <PageHero
        sanskrit={t("about.sanskrit")}
        title={t("about.title")}
        subtitle={t("about.subtitle")}
      />

      {/* INTRO + FACT CARD */}
      <section className="container mx-auto px-6 py-16 grid lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-5 text-foreground/85 leading-relaxed">
          <p className={`text-lg ${dev}`}>{t("about.intro")}</p>
        </div>
        <aside className="rounded-2xl bg-gradient-divine border border-gold/40 p-6">
          <div className={`text-xs uppercase tracking-[0.25em] text-saffron mb-3 ${dev}`}>
            {hi ? "मंदिर परिचय" : "Temple Facts"}
          </div>
          <dl className="space-y-3">
            {facts.map((f) => (
              <div
                key={f.k}
                className="flex justify-between gap-3 border-b border-gold/20 pb-2 last:border-0"
              >
                <dt className={`text-sm text-muted-foreground ${dev}`}>{f.k}</dt>
                <dd className={`text-sm font-medium text-maroon text-right ${dev}`}>{f.v}</dd>
              </div>
            ))}
          </dl>
        </aside>
      </section>

      {/* HISTORY */}
      <section className="bg-gradient-divine border-y border-border/60">
        <div className="container mx-auto px-6 py-16 grid lg:grid-cols-2 gap-10 items-center">
          <div className="aspect-[4/5] max-w-md mx-auto rounded-[2rem] overflow-hidden shadow-sacred border-4 border-gold/60">
            <img
              src={maaImg3}
              alt="Maa Vindhyavasini Shringar"
              className="w-full h-full object-cover"
            />
          </div>
          <Section title={t("about.history.title")}>
            <p className={`text-foreground/85 leading-relaxed text-lg ${dev}`}>
              {t("about.history.text")}
            </p>
          </Section>
        </div>
      </section>

      {/* TRIKONA PARIKRAMA */}
      <section className="container mx-auto px-6 py-16">
        <Section title={t("about.trikona.title")}>
          <p className={`text-foreground/85 leading-relaxed text-lg max-w-3xl ${dev}`}>
            {t("about.trikona.text")}
          </p>
        </Section>
        <div className="grid md:grid-cols-3 gap-6 mt-8">
          {trikona.map((item) => (
            <div
              key={item.tk}
              className="p-7 rounded-2xl bg-card border border-border hover:border-gold/60 hover:shadow-gold transition"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-sacred flex items-center justify-center text-cream mb-4">
                <item.icon size={20} />
              </div>
              <h3 className={`font-display text-xl text-maroon mb-2 ${dev}`}>{t(item.tk)}</h3>
              <p className={`text-sm text-muted-foreground ${dev}`}>{t(item.xk)}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SANCTUM & MAHIMA */}
      <section className="container mx-auto px-6 py-16">
        <Section title={t("about.sanctum.title")}>
          <p className={`text-foreground/85 leading-relaxed text-lg max-w-4xl ${dev}`}>
            {t("about.sanctum.text")}
          </p>
        </Section>
      </section>

      {/* SPIRITUAL IMPORTANCE */}
      <section className="bg-gradient-divine border-y border-border/60">
        <div className="container mx-auto px-6 py-16">
          <Section title={t("about.importance.title")}>
            <p className={`text-foreground/85 leading-relaxed text-lg max-w-4xl ${dev}`}>
              {t("about.importance.text")}
            </p>
          </Section>
        </div>
      </section>

      {/* FESTIVALS */}
      <section className="container mx-auto px-6 py-16">
        <Section title={t("about.fest.title")}>
          <p className={`text-foreground/85 leading-relaxed text-lg max-w-3xl ${dev}`}>
            {t("about.fest.text")}
          </p>
        </Section>
        <div className="grid md:grid-cols-2 gap-4 mt-6">
          {[
            {
              icon: Calendar,
              n: hi ? "नवरात्रि" : "Navaratri",
              x: hi
                ? "नौ रात्रि — दीप, पुष्प एवं भक्ति में डूबा सम्पूर्ण धाम"
                : "Nine nights — entire dham aglow with lamps, flowers and bhakti",
            },
            {
              icon: Sparkles,
              n: hi ? "कजरी महोत्सव" : "Kajari Mahotsav",
              x: hi
                ? "विन्ध्यवासिनी जयन्ती पर लोक-कवियों एवं गायकों का सम्मेलन"
                : "Folk-poets and singers gather on Vindhyavasini Jayanti",
            },
          ].map((f) => (
            <div
              key={f.n}
              className="p-5 rounded-2xl bg-gradient-divine border border-gold/40 flex items-center gap-4"
            >
              <div className="w-11 h-11 rounded-xl bg-gradient-sacred flex items-center justify-center text-cream shrink-0">
                <f.icon size={18} />
              </div>
              <div>
                <div className={`font-display text-lg text-maroon ${dev}`}>{f.n}</div>
                <div className={`text-xs text-muted-foreground ${dev}`}>{f.x}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* HOW TO REACH */}
      <section className="container mx-auto px-6 py-10">
        <Section title={t("about.access.title")}>
          <div className="grid md:grid-cols-3 gap-5 mt-2">
            {[
              { icon: Plane, txt: t("about.access.air") },
              { icon: Train, txt: t("about.access.rail") },
              { icon: Bus, txt: t("about.access.road") },
            ].map((r, i) => (
              <div
                key={i}
                className="p-6 rounded-2xl bg-card border border-border flex items-start gap-3 hover:-translate-y-1 hover:shadow-gold transition-all duration-300"
              >
                <div className="w-11 h-11 rounded-xl bg-gradient-sacred flex items-center justify-center text-cream shrink-0">
                  <r.icon size={18} />
                </div>
                <p className={`text-foreground/80 leading-relaxed text-sm ${dev}`}>{r.txt}</p>
              </div>
            ))}
          </div>
        </Section>
      </section>

      {/* OUR SANSTHAN */}
      <section className="container mx-auto px-6 py-16 grid lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2">
          <Section title={t("about.sansthan.title")}>
            <p className={`text-foreground/85 leading-relaxed text-lg ${dev}`}>
              {t("about.sansthan.text")}
            </p>
          </Section>
        </div>
        <aside className="space-y-4">
          {(
            [
              { tk: "about.values.vision.t", vk: "about.values.vision.v" },
              { tk: "about.values.mission.t", vk: "about.values.mission.v" },
              { tk: "about.values.values.t", vk: "about.values.values.v" },
            ] as { tk: TKey; vk: TKey }[]
          ).map((v) => (
            <div key={v.tk} className="p-5 rounded-2xl bg-card border border-border">
              <div className={`text-xs uppercase tracking-[0.25em] text-saffron mb-1 ${dev}`}>
                {t(v.tk)}
              </div>
              <div className={`font-display text-xl text-maroon mb-1 ${dev}`}>{t(v.tk)}</div>
              <p className={`text-muted-foreground text-sm ${dev}`}>{t(v.vk)}</p>
            </div>
          ))}
        </aside>
      </section>
    </PageShell>
  );
}
