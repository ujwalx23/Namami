import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { PageShell, PageHero } from "@/components/PageShell";
import { ScrollReveal } from "@/components/ScrollReveal";
import { useLang } from "@/i18n/LangProvider";
import type { TKey } from "@/i18n/translations";
import {
  Mountain,
  Compass,
  Plane,
  Train,
  Bus,
  Sparkles,
  Calendar,
  Quote,
  Building,
  Music,
  ArrowRight,
  Heart,
} from "lucide-react";
import maaImg3 from "@/assets/maa-vindhyavasini-3.webp";
import { JsonLd } from "@/components/JsonLd";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Maa Vindhyavasini & Sansthan | History, Significance & Teachings" },
      {
        name: "description",
        content:
          "Learn the divine history and significance of Maa Vindhyavasini Shakti Pitha at Vindhyachal. Explore the activities, mission, and spiritual initiatives of Namami Vindhyavasini Sansthan.",
      },
      {
        name: "keywords",
        content:
          "Maa Vindhyavasini history, Vindhyachal Peeth, Trikona Parikrama, Vindhyavasini significance, Devi Mahatmya, विंध्यवासिनी इतिहास, विंध्याचल",
      },
      { property: "og:title", content: "About Maa Vindhyavasini & Sansthan | History, Significance & Teachings" },
      {
        property: "og:description",
        content:
          "Learn the divine history and significance of Maa Vindhyavasini Shakti Pitha at Vindhyachal. Explore the activities, mission, and spiritual initiatives.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://www.namamivindhyavasini.in/about" },
      { property: "og:image", content: "https://www.namamivindhyavasini.in/maa-vindhyavasini.png" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "About Maa Vindhyavasini & Sansthan" },
      {
        name: "twitter:description",
        content:
          "Learn the divine history and significance of Maa Vindhyavasini Shakti Pitha at Vindhyachal.",
      },
      { name: "twitter:image", content: "https://www.namamivindhyavasini.in/maa-vindhyavasini.png" },
    ],
    links: [
      { rel: "canonical", href: "https://www.namamivindhyavasini.in/about" }
    ]
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
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-3 sm:mb-5">
        <h2 className={`font-display text-2xl md:text-3xl lg:text-4xl text-maroon ${dev}`}>
          {title}
        </h2>
        <div className="h-[1.5px] flex-grow bg-gradient-to-r from-gold/50 via-gold/25 to-transparent rounded-full hidden sm:block" />
      </div>
      <div className="space-y-3 sm:space-y-4">{children}</div>
    </section>
  );
}

function AboutPage() {
  const { t, lang } = useLang();
  const hi = lang === "hi";
  const dev = hi ? "font-devanagari" : "";
  const [isHistoryExpanded, setIsHistoryExpanded] = useState(false);

  const trikona: {
    tk: TKey;
    xk: TKey;
    badge: string;
    icon: React.ComponentType<{ size?: number; className?: string }>;
    color: string;
  }[] = [
    {
      tk: "about.tri.1.title",
      xk: "about.tri.1.text",
      badge: hi ? "महालक्ष्मी स्वरूप" : "Maha Lakshmi Swaroop",
      icon: Sparkles,
      color: "from-saffron/15 to-gold/5 border-gold/30 text-saffron",
    },
    {
      tk: "about.tri.2.title",
      xk: "about.tri.2.text",
      badge: hi ? "महाकाली स्वरूप" : "Maha Kali Swaroop",
      icon: Mountain,
      color: "from-red-950/20 to-maroon/5 border-red-800/25 text-red-500",
    },
    {
      tk: "about.tri.3.title",
      xk: "about.tri.3.text",
      badge: hi ? "महासरस्वती स्वरूप" : "Maha Saraswati Swaroop",
      icon: Compass,
      color: "from-amber-950/15 to-cream/5 border-cream/30 text-amber-500",
    },
  ];

  const scripturalQuote = hi
    ? {
        sanskrit: "॥ शरणागतदीनार्तपरित्राणपरायणे । सर्वस्यार्तिहरे देवि नारायणि नमोऽस्तु ते ॥",
        translation:
          "“शरण में आए हुए दीन-दुखियों की रक्षा में तत्पर, सबकी पीड़ा दूर करने वाली हे नारायणी देवी! आपको नमस्कार है।”",
        source: "— श्री दुर्गा सप्तशती (11.12)",
      }
    : {
        sanskrit: "॥ शरणागतदीनार्तपरित्राणपरायणे । सर्वस्यार्तिहरे देवि नारायणि नमोऽस्तु ते ॥",
        translation:
          "“O Goddess, who art intent on saving the dejected and distressed who take refuge in Thee, O remover of all suffering, salutations to Thee, Narayani!”",
        source: "— Sri Durga Saptashati (11.12)",
      };

  const webpageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": "https://www.namamivindhyavasini.in/about#webpage",
    "url": "https://www.namamivindhyavasini.in/about",
    "name": "About Maa Vindhyavasini & Sansthan | History, Significance & Teachings",
    "description": "Learn the divine history and significance of Maa Vindhyavasini Shakti Pitha at Vindhyachal. Explore the activities, mission, and spiritual initiatives of Namami Vindhyavasini Sansthan.",
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
        "name": "About",
        "item": "https://www.namamivindhyavasini.in/about"
      }
    ]
  };

  return (
    <PageShell>
      <JsonLd data={webpageSchema} />
      <JsonLd data={breadcrumbSchema} />
      <PageHero
        sanskrit={t("about.sanskrit")}
        title={t("about.title")}
        subtitle={t("about.subtitle")}
      />

      {/* SCRIPTURAL HISTORY */}
      <ScrollReveal direction="up" duration={800} delay={100}>
        <section className="bg-gradient-divine border-y border-border/60 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.05)_0%,transparent_100%)] pointer-events-none" />
          <div className="container mx-auto px-6 py-8 md:py-16 grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-10 items-center">
            <div className="lg:col-span-5 aspect-[4/5] max-w-sm w-full mx-auto rounded-[2.5rem] overflow-hidden shadow-sacred border-4 border-gold/60 relative group">
              <div className="absolute inset-0 bg-gradient-to-t from-maroon/40 to-transparent opacity-60 group-hover:opacity-30 transition-opacity duration-500" />
              <img
                src={maaImg3}
                alt="Divine Shringar of Maa Vindhyavasini Devi at Vindhyachal Temple"
                title="Maa Vindhyavasini Shringar"
                width={320}
                height={400}
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 pointer-events-none select-none"
              />
            </div>
            <div id="history" className="lg:col-span-7 space-y-4 sm:space-y-6 scroll-mt-24">
              <Section title={t("about.history.title")}>
                <div className="space-y-4">
                  <p className={`text-foreground/85 leading-relaxed text-lg ${dev}`}>
                    {t("about.history.text")}
                  </p>

                  {/* Toggle Button */}
                  <div className="flex justify-start">
                    <button
                      onClick={() => setIsHistoryExpanded(!isHistoryExpanded)}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-sacred/10 border border-gold/30 hover:border-gold text-saffron hover:text-maroon font-semibold transition-all duration-300 shadow-sm active:scale-95 text-sm"
                    >
                      <span>
                        {isHistoryExpanded
                          ? hi
                            ? "कम पढ़ें"
                            : "Read Less"
                          : hi
                            ? "विस्तृत इतिहास पढ़ें"
                            : "Read Full History"}
                      </span>
                      <ArrowRight
                        size={14}
                        className={`transform transition-transform duration-300 ${isHistoryExpanded ? "rotate-90" : ""}`}
                      />
                    </button>
                  </div>

                  {/* Detailed History Paragraphs */}
                  <div
                    className={`grid transition-all duration-500 ease-in-out overflow-hidden ${
                      isHistoryExpanded
                        ? "grid-rows-[1fr] opacity-100 mt-4"
                        : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <div className="overflow-hidden space-y-4">
                      <p
                        className={`text-foreground/80 leading-relaxed text-base md:text-lg border-l-2 border-gold/40 pl-4 ${dev}`}
                      >
                        {t("about.history.detailed.p1")}
                      </p>
                      <p
                        className={`text-foreground/80 leading-relaxed text-base md:text-lg border-l-2 border-gold/40 pl-4 ${dev}`}
                      >
                        {t("about.history.detailed.p2")}
                      </p>
                      <p
                        className={`text-foreground/80 leading-relaxed text-base md:text-lg border-l-2 border-gold/40 pl-4 ${dev}`}
                      >
                        {t("about.history.detailed.p3")}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Scriptural Quote Block */}
                <div className="p-4 sm:p-6 rounded-2xl bg-card/60 backdrop-blur border-l-4 border-gold/80 border border-border mt-4 sm:mt-6 space-y-3 relative shadow-sm">
                  <p className="font-devanagari text-base md:text-lg lg:text-xl text-maroon text-center font-semibold leading-relaxed break-words">
                    {scripturalQuote.sanskrit}
                  </p>
                  <p
                    className={`text-sm text-muted-foreground text-center italic leading-relaxed ${dev}`}
                  >
                    {scripturalQuote.translation}
                  </p>
                  <p className="text-right text-xs font-semibold text-saffron tracking-wider">
                    {scripturalQuote.source}
                  </p>
                </div>
              </Section>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* TRIKONA PARIKRAMA */}
      <section className="container mx-auto px-6 py-8 md:py-16">
        <ScrollReveal direction="up" duration={800}>
          <Section title={t("about.trikona.title")}>
            <p className={`text-foreground/85 leading-relaxed text-lg max-w-4xl ${dev}`}>
              {t("about.trikona.text")}
            </p>
          </Section>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8 mt-6 sm:mt-10">
          {trikona.map((item, idx) => (
            <ScrollReveal key={item.tk} direction="up" delay={idx * 100} duration={700}>
              <div
                className={`p-4 sm:p-5 md:p-6 lg:p-8 rounded-3xl bg-gradient-to-b ${item.color} border border-border/50 hover:border-gold/60 hover:shadow-gold hover:scale-[1.03] transition-all duration-300 h-full`}
              >
                <div className="flex justify-between items-start mb-4 sm:mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-sacred flex items-center justify-center text-cream shadow-md">
                    <item.icon size={24} />
                  </div>
                  <span
                    className={`text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded-full border border-gold/30 bg-gold/10 text-saffron ${dev}`}
                  >
                    {item.badge}
                  </span>
                </div>
                <h3 className={`font-display text-xl sm:text-2xl text-maroon mb-3 ${dev}`}>{t(item.tk)}</h3>
                <p className={`text-muted-foreground leading-relaxed text-xs sm:text-sm md:text-base ${dev}`}>{t(item.xk)}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* SANCTUM & MAHIMA */}
      <ScrollReveal direction="up" duration={800}>
        <section className="bg-gradient-divine border-y border-border/60">
          <div className="container mx-auto px-6 py-8 md:py-16">
            <Section title={t("about.sanctum.title")}>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 items-center mt-2 sm:mt-4">
                <div className="lg:col-span-2 space-y-4">
                  <p className={`text-foreground/85 leading-relaxed text-lg ${dev}`}>
                    {t("about.sanctum.text")}
                  </p>
                </div>
                <div className="p-5 sm:p-6 rounded-2xl bg-card border border-border text-center space-y-4 shadow-sacred relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-[4px] bg-gradient-sacred" />
                  <div
                    className={`text-xs uppercase tracking-[0.25em] text-saffron font-bold ${dev}`}
                  >
                    {hi ? "नित्य आरती समय" : "Daily Aarti Schedule"}
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between border-b border-border pb-2">
                      <span className={`text-sm text-muted-foreground ${dev}`}>
                        {hi ? "मंगला आरती (प्रातः)" : "Mangala Aarti (Morning)"}
                      </span>
                      <span className="text-sm font-semibold text-maroon">04:00 AM</span>
                    </div>
                    <div className="flex justify-between border-b border-border pb-2">
                      <span className={`text-sm text-muted-foreground ${dev}`}>
                        {hi ? "मध्याह्न आरती (दोपहर)" : "Madhyahna Aarti (Noon)"}
                      </span>
                      <span className="text-sm font-semibold text-maroon">12:00 PM</span>
                    </div>
                    <div className="flex justify-between border-b border-border pb-2">
                      <span className={`text-sm text-muted-foreground ${dev}`}>
                        {hi ? "सन्ध्या आरती (सायं)" : "Sandhya Aarti (Evening)"}
                      </span>
                      <span className="text-sm font-semibold text-maroon">07:00 PM</span>
                    </div>
                    <div className="flex justify-between last:border-0 pb-1">
                      <span className={`text-sm text-muted-foreground ${dev}`}>
                        {hi ? "शयन आरती (रात्रि)" : "Shayan Aarti (Night)"}
                      </span>
                      <span className="text-sm font-semibold text-maroon">09:30 PM</span>
                    </div>
                  </div>
                  <div className="text-[10px] text-muted-foreground italic">
                    {hi
                      ? "* समय त्योहारों के अनुसार बदल सकता है"
                      : "* Timings may vary on festive days"}
                  </div>
                </div>
              </div>
            </Section>
          </div>
        </section>
      </ScrollReveal>

      {/* SPIRITUAL IMPORTANCE */}
      <ScrollReveal direction="up" duration={800}>
        <section className="container mx-auto px-6 py-8 md:py-16">
          <Section title={t("about.importance.title")}>
            <p className={`text-foreground/85 leading-relaxed text-lg max-w-5xl ${dev}`}>
              {t("about.importance.text")}
            </p>
          </Section>
        </section>
      </ScrollReveal>

      {/* HOW TO REACH */}
      <ScrollReveal direction="up" duration={800}>
        <section className="bg-gradient-divine border-y border-border/60">
          <div className="container mx-auto px-6 py-8 md:py-16">
            <Section title={t("about.access.title")}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mt-2 sm:mt-4">
                {[
                  {
                    icon: Plane,
                    txt: t("about.access.air"),
                    title: hi ? "हवाई मार्ग" : "Air Access",
                  },
                  {
                    icon: Train,
                    txt: t("about.access.rail"),
                    title: hi ? "रेल मार्ग" : "Rail Access",
                  },
                  {
                    icon: Bus,
                    txt: t("about.access.road"),
                    title: hi ? "सड़क मार्ग" : "Road Access",
                  },
                ].map((r, i) => (
                  <div
                    key={i}
                    className="p-4 sm:p-5 md:p-6 rounded-2xl bg-card border border-border flex flex-col gap-3 sm:gap-4 hover:-translate-y-1 hover:shadow-gold/30 hover:border-gold/40 transition-all duration-300 h-full"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-gradient-sacred flex items-center justify-center text-cream shadow-sm">
                        <r.icon size={20} />
                      </div>
                      <h4 className={`font-display text-base sm:text-lg text-maroon ${dev}`}>{r.title}</h4>
                    </div>
                    <p className={`text-muted-foreground leading-relaxed text-xs sm:text-sm ${dev}`}>
                      {r.txt}
                    </p>
                  </div>
                ))}
              </div>
            </Section>
          </div>
        </section>
      </ScrollReveal>

      {/* SACRED KUNDS & GHATS */}
      <ScrollReveal direction="up" duration={800}>
        <section className="container mx-auto px-6 py-8 md:py-16">
          <Section title={t("about.kunds.title")}>
            <p className={`text-foreground/85 leading-relaxed text-lg max-w-5xl ${dev}`}>
              {t("about.kunds.text")}
            </p>
          </Section>
        </section>
      </ScrollReveal>

      {/* LEGEND & KAJARI SECTIONS */}
      <section className="container mx-auto px-6 py-6 md:py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
          <ScrollReveal direction="up" duration={800}>
            <div className="p-4 xs:p-5 sm:p-6 md:p-8 rounded-3xl bg-gradient-to-br from-saffron/10 to-gold/5 border border-gold/30 hover:border-gold/50 shadow-sacred hover:shadow-gold/20 transition-all duration-300 h-full flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-gradient-sacred flex items-center justify-center text-cream">
                    <Sparkles size={20} />
                  </div>
                  <h3 className={`font-display text-lg sm:text-xl md:text-2xl text-maroon ${dev}`}>
                    {t("about.legend.title")}
                  </h3>
                </div>
                <p className={`text-foreground/80 leading-relaxed text-xs sm:text-sm md:text-base ${dev}`}>
                  {t("about.legend.text")}
                </p>
              </div>
              <div className="mt-8 pt-4 border-t border-gold/10 flex items-center justify-between text-xs text-saffron font-semibold">
                <span>{hi ? "महिषासुर मर्दिनी" : "Slayer of Mahishasura"}</span>
                <span>Devi Vijaya Utsav</span>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="up" duration={800} delay={100}>
            <div className="p-4 xs:p-5 sm:p-6 md:p-8 rounded-3xl bg-gradient-to-br from-indigo-950/20 to-purple-950/10 border border-indigo-900/30 hover:border-indigo-800/50 shadow-sacred hover:shadow-indigo-950/20 transition-all duration-300 h-full flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-gradient-sacred flex items-center justify-center text-cream">
                    <Music size={20} />
                  </div>
                  <h3 className={`font-display text-lg sm:text-xl md:text-2xl text-maroon ${dev}`}>
                    {t("about.kajari.title")}
                  </h3>
                </div>
                <p className={`text-foreground/80 leading-relaxed text-xs sm:text-sm md:text-base ${dev}`}>
                  {t("about.kajari.text")}
                </p>
              </div>
              <div className="mt-8 pt-4 border-t border-gold/10 flex items-center justify-between text-xs text-saffron font-semibold">
                <span>{hi ? "श्रावण मास संगीत उत्सव" : "Shravana Month Music Festival"}</span>
                <span>Kajali Swaroop Stuti</span>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* FESTIVALS */}
      <section className="container mx-auto px-6 py-8 md:py-16">
        <ScrollReveal direction="up" duration={800}>
          <Section title={t("about.fest.title")}>
            <p className={`text-foreground/85 leading-relaxed text-lg max-w-4xl ${dev}`}>
              {t("about.fest.text")}
            </p>
          </Section>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mt-6 sm:mt-10">
          {[
            {
              icon: Calendar,
              n: hi ? "शारदीय व चैत्र नवरात्रि" : "Chaitra & Sharad Navaratri",
              x: hi
                ? "नौ पावन रात्रियाँ — महाआरती, चंडी पाठ, अखंड ज्योति एवं लाखों भक्तों की आस्था से जगमगाता पवित्र धाम।"
                : "Nine holy nights — mahapuja, chandi path, akhand jyoti and the entire town aglow with millions of devotees.",
            },
            {
              icon: Sparkles,
              n: hi ? "वार्षिक कजरी महोत्सव" : "Annual Kajari Mahotsav",
              x: hi
                ? "विन्ध्यवासिनी जयन्ती के पावन अवसर पर वर्षा ऋतु में देश भर के लोक गायकों और विदुषियों का महासंगम।"
                : "The sacred gathering of classical and folk music maestros celebrating the monsoon leelas of Maa Kajali.",
            },
          ].map((f, idx) => (
            <ScrollReveal key={f.n} direction="up" delay={idx * 100} duration={700}>
              <div className="p-4 sm:p-5 md:p-6 rounded-2xl bg-gradient-divine border border-gold/30 hover:border-gold flex items-center gap-3 sm:gap-5 hover:shadow-gold transition-all duration-300 h-full">
                <div className="w-14 h-14 rounded-2xl bg-gradient-sacred flex items-center justify-center text-cream shrink-0 shadow-md">
                  <f.icon size={24} />
                </div>
                <div>
                  <h4 className={`font-display text-lg sm:text-xl text-maroon mb-1 ${dev}`}>{f.n}</h4>
                  <p className={`text-xs sm:text-sm text-muted-foreground leading-relaxed ${dev}`}>{f.x}</p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* OUR SANSTHAN & TRUST VALUES */}
      <section className="container mx-auto px-6 py-8 md:py-16 grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-10 items-start">
        <div className="lg:col-span-7">
          <ScrollReveal direction="up" duration={800}>
            <Section title={t("about.sansthan.title")}>
              <p className={`text-foreground/85 leading-relaxed text-lg ${dev}`}>
                {t("about.sansthan.text")}
              </p>
            </Section>
          </ScrollReveal>
        </div>

        <div className="lg:col-span-5 space-y-3 sm:space-y-4">
          {(
            [
              { tk: "about.values.vision.t", vk: "about.values.vision.v", icon: Heart },
              { tk: "about.values.mission.t", vk: "about.values.mission.v", icon: Sparkles },
              { tk: "about.values.values.t", vk: "about.values.values.v", icon: Mountain },
            ] as {
              tk: TKey;
              vk: TKey;
              icon: React.ComponentType<{ size?: number; className?: string }>;
            }[]
          ).map((v, idx) => (
            <ScrollReveal key={v.tk} direction="up" delay={idx * 100} duration={700}>
              <div className="p-3.5 sm:p-5 md:p-6 rounded-2xl bg-card border border-border hover:border-gold/30 transition-all duration-300 flex items-start gap-3 sm:gap-4 h-full shadow-sm">
                <div className="w-12 h-12 rounded-xl bg-gradient-sacred/10 border border-gold/20 flex items-center justify-center text-saffron shrink-0">
                  <v.icon size={20} />
                </div>
                <div>
                  <div
                    className={`text-xs uppercase tracking-[0.25em] text-saffron font-bold mb-1 ${dev}`}
                  >
                    {t(v.tk)}
                  </div>
                  <p className={`text-foreground leading-snug font-medium text-sm sm:text-base md:text-lg mb-1 ${dev}`}>
                    {t(v.tk)}
                  </p>
                  <p className={`text-muted-foreground text-xs sm:text-sm leading-relaxed ${dev}`}>
                    {t(v.vk)}
                  </p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>
    </PageShell>
  );
}
