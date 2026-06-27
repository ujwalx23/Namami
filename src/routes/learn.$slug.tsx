import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { PageShell, PageHero } from "@/components/PageShell";
import { useLang } from "@/i18n/LangProvider";
import { JsonLd } from "@/components/JsonLd";
import { learnContent, LearnTopic } from "@/data/learnContent";
import { ArrowLeft, BookOpen, ChevronRight, HelpCircle } from "lucide-react";
import { useState } from "react";
import { ScrollReveal } from "@/components/ScrollReveal";

export const Route = createFileRoute("/learn/$slug")({
  head: ({ loaderData }) => {
    const topic = loaderData?.topic as LearnTopic | undefined;
    if (!topic) return {};

    const title = topic.metaTitle_en;
    const desc = topic.metaDesc_en;
    const kw = topic.keywords_en;
    const imageUrl = topic.image || "https://www.namamivindhyavasini.in/images/maa-vindhyavasini-temple-vindhyachal.jpg";

    return {
      meta: [
        { title: `${title} | Namami Vindhyavasini` },
        { name: "description", content: desc },
        { name: "keywords", content: kw },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        { property: "og:type", content: "article" },
        { property: "og:url", content: `https://www.namamivindhyavasini.in/learn/${topic.slug}` },
        {
          property: "og:image",
          content: imageUrl,
        },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: desc },
        {
          name: "twitter:image",
          content: imageUrl,
        },
      ],
      links: [{ rel: "canonical", href: `https://www.namamivindhyavasini.in/learn/${topic.slug}` }],
    };
  },
  loader: async ({ params }) => {
    const { slug } = params;
    const normalizedSlug = decodeURIComponent(slug).replace(/[\s_]+/g, "-");
    const topic = learnContent[normalizedSlug] || learnContent[slug];
    if (!topic) {
      throw notFound();
    }
    return { topic: topic as LearnTopic };
  },
  errorComponent: () => {
    const { lang } = useLang();
    return (
      <PageShell>
        <PageHero title="Topic Not Found" subtitle="We couldn't find the requested topic." />
        <div className="container mx-auto px-6 py-16 text-center space-y-6">
          <p className="text-muted-foreground">The article might have been moved or deleted.</p>
          <Link
            to="/learn"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-sacred text-cream font-medium"
          >
            <ArrowLeft size={16} />{" "}
            {lang === "hi" ? "ज्ञान हब पर वापस जाएं" : "Back to Knowledge Hub"}
          </Link>
        </div>
      </PageShell>
    );
  },
  component: LearnDetailPage,
});

function LearnDetailPage() {
  const { topic } = Route.useLoaderData();
  const { lang } = useLang();
  const hi = lang === "hi";
  const dev = hi ? "font-devanagari" : "";
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(null);

  const title = hi ? topic.title_hi : topic.title_en;
  const content = hi ? topic.content_hi : topic.content_en;

  // Breadcrumb schema
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
      {
        "@type": "ListItem",
        position: 3,
        name: title,
        item: `https://www.namamivindhyavasini.in/learn/${topic.slug}`,
      },
    ],
  };

  // FAQ schema if FAQs exist
  const faqSchema =
    topic.faqs.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: topic.faqs.map((f) => ({
            "@type": "Question",
            name: hi ? f.q_hi : f.q_en,
            acceptedAnswer: {
              "@type": "Answer",
              text: hi ? f.a_hi : f.a_en,
            },
          })),
        }
      : null;

  // Article schema for search engines
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    image: [
      topic.image
        ? `https://www.namamivindhyavasini.in${topic.image}`
        : "https://www.namamivindhyavasini.in/images/maa-vindhyavasini-temple-vindhyachal.jpg",
    ],
    author: {
      "@type": "Organization",
      name: "Namami Vindhyavasini",
      url: "https://www.namamivindhyavasini.in",
    },
    publisher: {
      "@type": "Organization",
      name: "Namami Vindhyavasini",
      logo: {
        "@type": "ImageObject",
        url: "https://www.namamivindhyavasini.in/images/maa-reveal.png",
      },
    },
    description: hi ? topic.metaDesc_hi : topic.metaDesc_en,
  };

  return (
    <PageShell>
      <JsonLd data={breadcrumbSchema} />
      {faqSchema && <JsonLd data={faqSchema} />}
      <JsonLd data={articleSchema} />

      <PageHero
        compact
        sanskrit="॥ विन्ध्येश्वरी विजयतेतराम् ॥"
        title={title}
        subtitle={`${topic.category} Guide`}
      />

      <article className="container mx-auto px-4 sm:px-6 py-10 max-w-4xl">
        {/* Navigation Breadcrumb visual */}
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-8 flex-wrap">
          <Link to="/" className="hover:text-maroon">
            Home
          </Link>
          <ChevronRight size={12} />
          <Link to="/learn" className="hover:text-maroon">
            Knowledge Hub
          </Link>
          <ChevronRight size={12} />
          <span className="text-foreground font-medium truncate max-w-[200px]">{title}</span>
        </div>

        {/* Featured Image */}
        {topic.image && (
          <div className="relative w-full rounded-3xl overflow-hidden border border-gold/30 mb-8 bg-black/5 flex items-center justify-center max-h-[360px] md:max-h-[440px] shadow-sm">
            <img
              src={topic.image}
              alt={`${title} Guide - Namami Vindhyavasini`}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Article Body */}
        <div
          className={`prose max-w-none text-foreground/90 leading-relaxed text-base md:text-lg space-y-6 pb-8 border-b border-border/40 ${dev}
            [&_h2]:font-display [&_h2]:text-2xl [&_h2]:md:text-3xl [&_h2]:text-maroon [&_h2]:mt-8 [&_h2]:mb-4 [&_h2]:border-b [&_h2]:border-gold/20 [&_h2]:pb-1
            [&_h3]:font-display [&_h3]:text-xl [&_h3]:md:text-2xl [&_h3]:text-maroon [&_h3]:mt-6 [&_h3]:mb-3
            [&_p]:mb-4 [&_p]:leading-relaxed
            [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-4 [&_ul]:space-y-1.5
            [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-4
            [&_table]:w-full [&_table]:my-6 [&_table]:border-collapse [&_table]:text-sm
            [&_th]:bg-cream/50 [&_th]:border [&_th]:border-border [&_th]:p-2.5 [&_th]:text-left [&_th]:font-semibold [&_th]:text-maroon
            [&_td]:border [&_td]:border-border [&_td]:p-2.5`}
          dangerouslySetInnerHTML={{ __html: content }}
        />

        {/* Collapsible FAQ Section */}
        {topic.faqs.length > 0 && (
          <div className="mt-8 pt-6">
            <h3 className={`font-display text-2xl text-maroon mb-6 flex items-center gap-2 ${dev}`}>
              <HelpCircle size={22} className="text-saffron" />
              {hi ? "अक्सर पूछे जाने वाले सवाल (FAQ)" : "Frequently Asked Questions"}
            </h3>
            <div className="space-y-3">
              {topic.faqs.map((faq, idx) => {
                const isOpened = openFaqIdx === idx;
                const question = hi ? faq.q_hi : faq.q_en;
                const answer = hi ? faq.a_hi : faq.a_en;

                return (
                  <ScrollReveal key={idx} direction="up" duration={500}>
                    <div className="border border-gold/25 rounded-2xl overflow-hidden bg-card/60">
                      <button
                        onClick={() => setOpenFaqIdx(isOpened ? null : idx)}
                        className="w-full flex items-center justify-between p-4 text-left font-semibold text-maroon hover:text-saffron transition-colors cursor-pointer text-sm sm:text-base"
                      >
                        <span className={dev}>{question}</span>
                        <ChevronRight
                          size={18}
                          className={`transform transition-transform duration-300 shrink-0 text-gold ${isOpened ? "rotate-90" : ""}`}
                        />
                      </button>
                      <div
                        className={`transition-all duration-300 ease-in-out overflow-hidden ${
                          isOpened ? "max-h-[300px] border-t border-border/40 p-4" : "max-h-0"
                        }`}
                      >
                        <p
                          className={`text-muted-foreground text-xs sm:text-sm leading-relaxed ${dev}`}
                        >
                          {answer}
                        </p>
                      </div>
                    </div>
                  </ScrollReveal>
                );
              })}
            </div>
          </div>
        )}

        {/* Contextual Internal Linking (5 Related Topics) */}
        {topic.related.length > 0 && (
          <div className="mt-12 pt-8 border-t border-border/50">
            <h3
              className={`font-display text-xl sm:text-2xl text-maroon mb-6 flex items-center gap-2 ${dev}`}
            >
              <BookOpen size={20} className="text-saffron" />
              {hi ? "सम्बंधित मार्गदर्शिकाएँ" : "Related Guides & Info"}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {topic.related.map((relSlug) => {
                const relTopic = learnContent[relSlug];
                if (!relTopic) return null;

                const relTitle = hi ? relTopic.title_hi : relTopic.title_en;
                const relDesc = hi ? relTopic.metaDesc_hi : relTopic.metaDesc_en;
                const relImg = relTopic.image || "https://www.namamivindhyavasini.in/images/maa-vindhyavasini-temple-vindhyachal.jpg";

                return (
                  <Link
                    key={relSlug}
                    to="/learn/$slug"
                    params={{ slug: relSlug }}
                    className="group relative rounded-2xl bg-card border border-border/50 hover:border-gold/60 hover:shadow-[0_10px_30px_rgba(212,175,55,0.08)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between h-full overflow-hidden shadow-sm hover:no-underline"
                  >
                    <div className="h-28 overflow-hidden relative">
                      <img
                        src={relImg}
                        alt={`${relTitle} - Related Guide`}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                      <span className={`absolute bottom-2 left-3 text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-black/45 border border-gold/30 text-cream ${dev}`}>
                        {relTopic.category}
                      </span>
                    </div>
                    <div className="p-4 flex-grow flex flex-col justify-between">
                      <div>
                        <h4 className={`font-display text-sm sm:text-base text-maroon group-hover:text-saffron transition-colors mb-1 ${dev} line-clamp-1`}>
                          {relTitle}
                        </h4>
                        <p className={`text-muted-foreground text-xs leading-relaxed line-clamp-2 ${dev}`}>
                          {relDesc}
                        </p>
                      </div>
                      <span className="text-[10px] text-saffron font-bold mt-3 block text-right group-hover:underline">
                        {hi ? "मार्गदर्शिका पढ़ें" : "Read Guide"} &rarr;
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* Back Link */}
        <div className="mt-10 flex justify-center">
          <Link
            to="/learn"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-gold/40 hover:border-gold text-maroon text-sm font-semibold transition"
          >
            <ArrowLeft size={14} /> {hi ? "ज्ञान हब पर वापस जाएँ" : "Back to Knowledge Hub"}
          </Link>
        </div>
      </article>
    </PageShell>
  );
}
