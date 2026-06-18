import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell, PageHero } from "@/components/PageShell";
import { ScrollReveal } from "@/components/ScrollReveal";
import { useLang } from "@/i18n/LangProvider";
import { JsonLd } from "@/components/JsonLd";
import { learnContent } from "@/data/learnContent";
import {
  BookOpen,
  Calendar,
  Compass,
  FileText,
  MapPin,
  Music,
  Heart,
  Sparkles,
  Mountain,
} from "lucide-react";

export const Route = createFileRoute("/learn/")({
  head: () => ({
    meta: [
      { title: "Ultimate Maa Vindhyavasini Temple Guide | Vindhyachal Knowledge Hub" },
      {
        name: "description",
        content:
          "Explore the ultimate guide to Maa Vindhyavasini Temple in Vindhyachal Dham. Read articles on temple history, timings, aarti, stotrams, and local travel plans.",
      },
      {
        name: "keywords",
        content:
          "Vindhyavasini guide, Vindhyachal hub, temple history cluster, ropeway timings, hotels near temple, aarti lyrics",
      },
      {
        property: "og:title",
        content: "Ultimate Maa Vindhyavasini Temple Guide | Vindhyachal Knowledge Hub",
      },
      {
        property: "og:description",
        content:
          "Explore the ultimate guide to Maa Vindhyavasini Temple in Vindhyachal Dham. Read articles on temple history, timings, and travel.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://www.namamivindhyavasini.in/learn" },
      {
        property: "og:image",
        content:
          "https://www.namamivindhyavasini.in/images/maa-vindhyavasini-temple-vindhyachal.jpg",
      },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Ultimate Maa Vindhyavasini Temple Guide" },
      {
        name: "twitter:image",
        content:
          "https://www.namamivindhyavasini.in/images/maa-vindhyavasini-temple-vindhyachal.jpg",
      },
    ],
    links: [{ rel: "canonical", href: "https://www.namamivindhyavasini.in/learn" }],
  }),
  component: LearnIndexPage,
});

const categoryIcons: Record<string, any> = {
  History: BookOpen,
  Darshan: Sparkles,
  Travel: Compass,
  Festivals: Calendar,
  Aarti: Music,
  Chalisa: FileText,
  Mantras: Heart,
  Location: MapPin,
  Guide: Mountain,
};

function LearnIndexPage() {
  const { lang } = useLang();
  const hi = lang === "hi";
  const dev = hi ? "font-devanagari" : "";

  const topics = Object.values(learnContent);

  // Group topics by category
  const categories = Array.from(new Set(topics.map((t) => t.category)));

  const webpageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": "https://www.namamivindhyavasini.in/learn#webpage",
    url: "https://www.namamivindhyavasini.in/learn",
    name: "Ultimate Maa Vindhyavasini Temple Guide | Vindhyachal Knowledge Hub",
    description:
      "Explore the ultimate guide to Maa Vindhyavasini Temple in Vindhyachal Dham. Read articles on temple history, timings, aarti, stotrams, and local travel plans.",
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
        name: "Knowledge Hub",
        item: "https://www.namamivindhyavasini.in/learn",
      },
    ],
  };

  return (
    <PageShell>
      <JsonLd data={webpageSchema} />
      <JsonLd data={breadcrumbSchema} />

      <PageHero
        sanskrit="॥ ज्ञानं परं ध्येयम् ॥"
        title={hi ? "माँ विन्ध्यवासिनी ज्ञान हब" : "Vindhyavasini Knowledge Hub"}
        subtitle={
          hi
            ? "विन्ध्याचल धाम, मंदिर इतिहास, दर्शन नियम, मार्ग, और चालीसा का संपूर्ण प्रामाणिक संग्रह"
            : "The ultimate guide to Maa Vindhyavasini Temple history, timings, routes, mantras, and local travels"
        }
      />

      <section className="container mx-auto px-4 sm:px-6 py-12 max-w-6xl">
        <ScrollReveal direction="up" duration={800}>
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className={`font-display text-2xl sm:text-3xl text-maroon ${dev}`}>
              {hi ? "विषय अनुसार मार्गदर्शन" : "Explore Topics by Category"}
            </h2>
            <p className="text-muted-foreground text-sm mt-2">
              {hi
                ? "माँ विन्ध्यवासिनी के दिव्य इतिहास, आरती, मंत्र, और विन्ध्याचल धाम की तीर्थयात्रा से जुड़े हर सवाल का जवाब प्राप्त करें।"
                : "Find detailed scriptural context, lyrics of aartis, local location guides, and practical travel tips."}
            </p>
            <div className="mx-auto mt-4 w-20 h-[2px] bg-gradient-sacred rounded-full" />
          </div>
        </ScrollReveal>

        <div className="space-y-12">
          {categories.map((category) => {
            const catTopics = topics.filter((t) => t.category === category);
            const Icon = categoryIcons[category] || BookOpen;

            return (
              <div key={category} className="space-y-6">
                <ScrollReveal direction="up" duration={700}>
                  <div className="flex items-center gap-3 border-b border-gold/30 pb-2">
                    <div className="w-10 h-10 rounded-xl bg-gradient-sacred/10 text-saffron flex items-center justify-center shadow-inner">
                      <Icon size={20} />
                    </div>
                    <h3 className={`font-display text-xl sm:text-2xl text-maroon ${dev}`}>
                      {category}
                    </h3>
                  </div>
                </ScrollReveal>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {catTopics.map((topic, idx) => (
                    <ScrollReveal key={topic.slug} direction="up" delay={idx * 80} duration={700}>
                      <Link
                        to="/learn/$slug"
                        params={{ slug: topic.slug }}
                        className="group flex flex-col justify-between p-5 rounded-2xl bg-card border border-gold/25 hover:border-gold hover:shadow-gold transition-all duration-300 h-full cursor-pointer hover:no-underline"
                        id={`link-${topic.slug}`}
                      >
                        <div>
                          <h4
                            className={`font-display text-base sm:text-lg text-maroon group-hover:text-saffron transition-colors mb-2 ${dev}`}
                          >
                            {hi ? topic.title_hi : topic.title_en}
                          </h4>
                          <p
                            className={`text-muted-foreground text-xs sm:text-sm line-clamp-2 leading-relaxed ${dev}`}
                          >
                            {hi ? topic.metaDesc_hi : topic.metaDesc_en}
                          </p>
                        </div>
                        <div className="pt-4 border-t border-border/40 mt-4 flex justify-end items-center text-xs font-semibold text-maroon group-hover:text-saffron transition-colors">
                          <span>{hi ? "पढ़ें" : "Read Article"} &rarr;</span>
                        </div>
                      </Link>
                    </ScrollReveal>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </PageShell>
  );
}
