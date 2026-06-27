import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell, PageHero } from "@/components/PageShell";
import { useState, useMemo, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { useLang } from "@/i18n/LangProvider";
import { JsonLd } from "@/components/JsonLd";
import { Search, Calendar, User, Clock, ArrowRight, BookOpen } from "lucide-react";
import { ScrollReveal } from "@/components/ScrollReveal";

type BlogPost = Tables<"blog_posts">;

export const Route = createFileRoute("/blog/")({
  head: () => ({
    meta: [
      { title: "Spiritual Enlightenment & Articles | Namami Vindhyavasini Sansthan" },
      {
        name: "description",
        content:
          "Read spiritual enlightenment articles, temple history, messages from Pujya Guruji, Maa Vindhyavasini stories, and festivals at Vindhyachal Dham by Namami Vindhyavasini Sansthan.",
      },
      {
        name: "keywords",
        content:
          "Namami Vindhyavasini enlightenment, Vindhyavasini temple history, Guruji messages, Vindhyachal stories, spiritual knowledge, Maa Vindhyavasini story, temple festivals, विंध्यवासिनी ब्लॉग, विंध्याचल इतिहास",
      },
      {
        property: "og:title",
        content: "Spiritual Enlightenment & Articles | Namami Vindhyavasini Sansthan",
      },
      {
        property: "og:description",
        content:
          "Read spiritual enlightenment articles, temple history, Guruji messages, Maa Vindhyavasini stories, and festivals at Vindhyachal Dham.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://www.namamivindhyavasini.in/blog" },
      { property: "og:image", content: "https://www.namamivindhyavasini.in/maa-vindhyavasini.png" },
      { name: "twitter:card", content: "summary_large_image" },
      {
        name: "twitter:title",
        content: "Spiritual Enlightenment & Articles | Namami Vindhyavasini Sansthan",
      },
      {
        name: "twitter:description",
        content:
          "Read spiritual enlightenment articles, temple history, Guruji messages, Maa Vindhyavasini stories, and festivals at Vindhyachal Dham.",
      },
      {
        name: "twitter:image",
        content: "https://www.namamivindhyavasini.in/maa-vindhyavasini.png",
      },
    ],
    links: [{ rel: "canonical", href: "https://www.namamivindhyavasini.in/blog" }],
  }),
  loader: async () => {
    const { data, error } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("status", "published")
      .lte("publish_date", new Date().toISOString())
      .order("publish_date", { ascending: false });
    if (error) throw error;
    return { posts: (data ?? []) as BlogPost[] };
  },
  errorComponent: ({ error }) => (
    <PageShell>
      <PageHero title="Spiritual Enlightenment" subtitle="Could not load articles." />
      <div className="container mx-auto px-6 py-10 text-center text-muted-foreground">
        {error.message}
      </div>
    </PageShell>
  ),
  component: BlogPage,
});

const categoryTranslations: Record<string, { en: string; hi: string }> = {
  "Temple History": { en: "Temple History", hi: "मंदिर इतिहास" },
  "Guruji Messages": { en: "Guruji Messages", hi: "गुरुजी संदेश" },
  "Spiritual Knowledge": { en: "Spiritual Knowledge", hi: "आध्यात्मिक ज्ञान" },
  "Devotional Articles": { en: "Devotional Articles", hi: "भक्ति लेख" },
  "Maa Vindhyavasini Stories": { en: "Maa Vindhyavasini Stories", hi: "माँ विंध्यवासिनी कथाएँ" },
};

function calculateReadingTime(text: string): number {
  const wordsPerMinute = 200;
  const noOfWords = text.split(/\s+/).length;
  const minutes = noOfWords / wordsPerMinute;
  return Math.max(1, Math.ceil(minutes));
}

function formatDate(isoString: string, lang: string) {
  const date = new Date(isoString);
  return date.toLocaleDateString(lang === "hi" ? "hi-IN" : "en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function getExcerpt(content: string, length = 150): string {
  const stripped = content
    .replace(/[#*`_[\]()]/g, "")
    .replace(/<[^>]*>/g, "")
    .replace(/\s+/g, " ")
    .trim();
  if (stripped.length <= length) return stripped;
  return stripped.substring(0, length) + "...";
}

function BlogPage() {
  const { posts } = Route.useLoaderData();
  const { t, lang } = useLang();
  const dev = lang === "hi" ? "font-devanagari" : "";
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 8;

  // Reset page to 1 when search query or category changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory]);

  // Filter posts based on search query and category selection
  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const matchesSearch =
        !searchQuery.trim() ||
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (post.seo_description &&
          post.seo_description.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCategory = selectedCategory === "All" || post.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [posts, searchQuery, selectedCategory]);

  // Paginated posts
  const paginatedPosts = useMemo(() => {
    const startIdx = (currentPage - 1) * postsPerPage;
    return filteredPosts.slice(startIdx, startIdx + postsPerPage);
  }, [filteredPosts, currentPage, postsPerPage]);

  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

  const blogSchema = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "@id": "https://www.namamivindhyavasini.in/blog/#blog",
    name: "Spiritual Enlightenment - Namami Vindhyavasini Sansthan",
    url: "https://www.namamivindhyavasini.in/blog",
    description:
      "Explore spiritual articles, temple history, messages from Pujya Guruji, Maa Vindhyavasini stories, and festivals at Vindhyachal Dham.",
    publisher: {
      "@type": "Organization",
      "@id": "https://www.namamivindhyavasini.in/#organization",
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
        name: "Enlightenment",
        item: "https://www.namamivindhyavasini.in/blog",
      },
    ],
  };

  return (
    <PageShell>
      <JsonLd data={blogSchema} />
      <JsonLd data={breadcrumbSchema} />

      <PageHero
        compact
        sanskrit={t("blog.sanskrit")}
        title={t("blog.title")}
        subtitle={t("blog.subtitle")}
      />

      <section className="container mx-auto px-3 sm:px-6 py-8 md:py-12">
        {/* Search bar */}
        <div className="flex justify-center mb-8 max-w-xl mx-auto px-1">
          <div className="relative flex w-full items-center bg-card rounded-full border border-gold/30 shadow-sm focus-within:ring-2 focus-within:ring-gold overflow-hidden">
            <span className="pl-4 text-muted-foreground flex items-center shrink-0">
              <Search size={18} className="text-gold" />
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t("blog.search.ph")}
              className="flex-1 min-w-0 pl-3 pr-4 py-2.5 bg-transparent focus:outline-none text-sm text-foreground"
            />
            {/* Integrated Dropdown option on the right side */}
            <div className="flex items-center shrink-0 border-l border-gold/20 bg-cream/5 px-2">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-transparent text-xs text-transparent sm:text-maroon font-semibold pr-6 sm:pr-7 pl-2 py-1.5 focus:outline-none cursor-pointer appearance-none relative select-none w-9 sm:w-auto"
                style={{
                  backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='none' stroke='%23800000' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='m3 5 3 3 3-3'/></svg>")`,
                  backgroundPosition: "right 8px center",
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "10px 10px",
                }}
              >
                <option value="All" className="bg-card text-foreground text-xs font-medium">
                  {lang === "hi" ? "सभी श्रेणियां" : "All Categories"}
                </option>
                {Object.entries(categoryTranslations).map(([key, trans]) => (
                  <option
                    key={key}
                    value={key}
                    className="bg-card text-foreground text-xs font-medium"
                  >
                    {trans[lang]}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Compact Articles List */}
        <div className="space-y-6 max-w-5xl mx-auto">
          {paginatedPosts.map((post, index) => (
            <ScrollReveal key={post.id} direction="up" delay={(index % 3) * 60} duration={600}>
              <Link
                to="/blog/$slug"
                params={{ slug: post.slug }}
                className="group flex flex-col sm:flex-row bg-card rounded-2xl border border-gold/30 hover:border-gold hover:shadow-gold transition-all duration-300 overflow-hidden sm:h-[210px] h-auto shadow-sm cursor-pointer text-inherit hover:text-inherit"
              >
                {post.featured_image ? (
                  <>
                    {/* Featured Image on Left - Fully visible with object-contain */}
                    <div className="relative w-full sm:w-[200px] md:w-[260px] lg:w-[280px] h-48 sm:h-full shrink-0 overflow-hidden bg-black/5 flex items-center justify-center border-b sm:border-b-0 sm:border-r border-border/40">
                      <img
                        src={post.featured_image}
                        alt={post.title}
                        className="w-full h-full object-contain group-hover:scale-102 transition-transform duration-500 pointer-events-none select-none"
                        loading="lazy"
                      />
                      <div className="absolute top-3 left-3 sm:hidden">
                        <span className="px-2.5 py-1 rounded-full bg-maroon/90 text-cream text-[9px] uppercase font-bold tracking-widest border border-gold/20">
                          {categoryTranslations[post.category]?.[lang] || post.category}
                        </span>
                      </div>
                    </div>

                    {/* Content on Right */}
                    <div className="p-4 sm:p-5 flex flex-col justify-between flex-1 min-w-0">
                      <div className="space-y-2">
                        <div className="flex items-center gap-3 text-[10px] text-muted-foreground flex-wrap">
                          <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full bg-maroon/10 text-maroon font-bold uppercase tracking-wider text-[9px]">
                            {categoryTranslations[post.category]?.[lang] || post.category}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar size={10} className="text-gold" />{" "}
                            {formatDate(post.publish_date, lang)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock size={10} className="text-gold" />{" "}
                            {calculateReadingTime(post.content)} {t("blog.read_time")}
                          </span>
                          <span className="flex items-center gap-1">
                            <User size={10} className="text-gold" /> {post.author}
                          </span>
                        </div>

                        <h3
                          className={`font-display text-lg sm:text-xl text-maroon group-hover:text-saffron transition-colors duration-300 leading-snug line-clamp-1 sm:line-clamp-2 ${dev} group-hover:underline`}
                        >
                          {post.title}
                        </h3>

                        <p
                          className={`text-muted-foreground text-xs sm:text-sm leading-relaxed line-clamp-2 sm:line-clamp-3 ${dev}`}
                        >
                          {getExcerpt(post.content, 180)}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-border/40 flex items-center justify-end mt-2 shrink-0">
                        <span className="inline-flex items-center gap-1 text-xs text-maroon font-semibold group-hover:text-saffron transition-colors">
                          {t("blog.read_more")}
                          <ArrowRight
                            size={12}
                            className="transform group-hover:translate-x-1 transition-transform"
                          />
                        </span>
                      </div>
                    </div>
                  </>
                ) : (
                  /* Content spans full width when no image is uploaded */
                  <div className="p-4 sm:p-5 flex flex-col justify-between flex-1 min-w-0">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3 text-[10px] text-muted-foreground flex-wrap">
                        <span className="px-2.5 py-0.5 rounded-full bg-maroon/10 text-maroon font-bold uppercase tracking-wider text-[9px]">
                          {categoryTranslations[post.category]?.[lang] || post.category}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar size={10} className="text-gold" />{" "}
                          {formatDate(post.publish_date, lang)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock size={10} className="text-gold" />{" "}
                          {calculateReadingTime(post.content)} {t("blog.read_time")}
                        </span>
                        <span className="flex items-center gap-1">
                          <User size={10} className="text-gold" /> {post.author}
                        </span>
                      </div>

                      <h3
                        className={`font-display text-lg sm:text-xl text-maroon group-hover:text-saffron transition-colors duration-300 leading-snug line-clamp-1 sm:line-clamp-2 ${dev} group-hover:underline`}
                      >
                        {post.title}
                      </h3>

                      <p
                        className={`text-muted-foreground text-xs sm:text-sm leading-relaxed line-clamp-2 sm:line-clamp-3 ${dev}`}
                      >
                        {getExcerpt(post.content, 220)}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-border/40 flex items-center justify-end mt-2 shrink-0">
                      <span className="inline-flex items-center gap-1 text-xs text-maroon font-semibold group-hover:text-saffron transition-colors">
                        {t("blog.read_more")}
                        <ArrowRight
                          size={12}
                          className="transform group-hover:translate-x-1 transition-transform"
                        />
                      </span>
                    </div>
                  </div>
                )}
              </Link>
            </ScrollReveal>
          ))}
        </div>

        {/* Empty state */}
        {filteredPosts.length === 0 && (
          <ScrollReveal direction="up" duration={500}>
            <div className="text-center py-20 bg-card border border-dashed border-gold/30 rounded-2xl max-w-lg mx-auto">
              <BookOpen size={40} className="text-gold/50 mx-auto mb-4" />
              <h3 className={`font-display text-xl text-maroon ${dev}`}>
                {lang === "hi" ? "कोई लेख उपलब्ध नहीं है" : "No Articles Available"}
              </h3>
              <p className="text-sm text-muted-foreground mt-2 px-6">{t("blog.no_posts")}</p>
            </div>
          </ScrollReveal>
        )}

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <ScrollReveal direction="up" duration={600}>
            <div className="flex justify-center items-center gap-2 mt-12">
              <button
                disabled={currentPage === 1}
                onClick={() => {
                  setCurrentPage((prev) => Math.max(1, prev - 1));
                  window.scrollTo({ top: 400, behavior: "smooth" });
                }}
                className="px-4 py-2 rounded-full border border-gold/30 text-xs font-semibold text-maroon hover:border-gold hover:bg-cream/40 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                ← {t("blog.prev")}
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => {
                    setCurrentPage(page);
                    window.scrollTo({ top: 400, behavior: "smooth" });
                  }}
                  className={`w-9 h-9 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
                    currentPage === page
                      ? "bg-gradient-sacred text-cream border-transparent shadow-sm"
                      : "bg-card border-gold/30 text-muted-foreground hover:border-gold"
                  }`}
                >
                  {page}
                </button>
              ))}

              <button
                disabled={currentPage === totalPages}
                onClick={() => {
                  setCurrentPage((prev) => Math.min(totalPages, prev + 1));
                  window.scrollTo({ top: 400, behavior: "smooth" });
                }}
                className="px-4 py-2 rounded-full border border-gold/30 text-xs font-semibold text-maroon hover:border-gold hover:bg-cream/40 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                {t("blog.next")} →
              </button>
            </div>
          </ScrollReveal>
        )}
      </section>
    </PageShell>
  );
}
