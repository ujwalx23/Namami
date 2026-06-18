import { createFileRoute, Link, useRouter, redirect } from "@tanstack/react-router";
import { PageShell, PageHero } from "@/components/PageShell";
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { useLang } from "@/i18n/LangProvider";
import { JsonLd } from "@/components/JsonLd";
import { toast } from "sonner";
import {
  Calendar,
  User,
  Clock,
  ArrowLeft,
  Share2,
  Facebook,
  Twitter,
  Copy,
  ChevronRight,
  BookOpen,
  Play,
  Square,
  Loader2,
} from "lucide-react";
import { speakText, stopSpeech, isHindiText } from "@/lib/speech";

type BlogPost = Tables<"blog_posts">;

export const Route = createFileRoute("/blog/$slug")({
  head: ({ loaderData }) => {
    const post = loaderData?.post;
    const title = post
      ? `${post.seo_title || post.title} | Namami Vindhyavasini`
      : "Enlightenment | Namami Vindhyavasini";
    const desc = post?.seo_description || "Read this article on Namami Vindhyavasini.";
    const url = post
      ? `https://www.namamivindhyavasini.in/blog/${post.slug}`
      : "https://www.namamivindhyavasini.in/blog";
    const img = post?.featured_image || "https://www.namamivindhyavasini.in/maa-vindhyavasini.png";

    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        { property: "og:type", content: "article" },
        { property: "og:url", content: url },
        { property: "og:image", content: img },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: desc },
        { name: "twitter:image", content: img },
      ],
      links: [{ rel: "canonical", href: url }],
    };
  },
  loader: async ({ params }) => {
    const { slug } = params;

    // Fetch the post
    const { data: post, error } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("slug", slug)
      .eq("status", "published")
      .lte("publish_date", new Date().toISOString())
      .maybeSingle();

    if (error) throw error;
    if (!post) {
      const targetHindiSlug = "जब-जीवन-स्वयं-उपदेश-बन-जाए";
      const encodedHindiSlug = encodeURIComponent(targetHindiSlug);
      if (
        slug === targetHindiSlug ||
        slug === encodedHindiSlug ||
        decodeURIComponent(slug) === targetHindiSlug
      ) {
        throw redirect({
          to: "/blog/life-itself-a-teaching",
          statusCode: 301,
        });
      }
      throw new Error("Article not found");
    }

    // Fetch related posts (same category, sorted by date, limit 3, excluding this post)
    const { data: related } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("status", "published")
      .lte("publish_date", new Date().toISOString())
      .eq("category", post.category)
      .neq("id", post.id)
      .order("publish_date", { ascending: false })
      .limit(3);

    return { post: post as BlogPost, related: (related ?? []) as BlogPost[] };
  },
  errorComponent: ({ error }) => {
    const { lang } = useLang();
    return (
      <PageShell>
        <PageHero title="Article Not Found" subtitle="We couldn't find the requested article." />
        <div className="container mx-auto px-6 py-16 text-center space-y-6">
          <p className="text-muted-foreground">
            {error.message || "The article might have been draft or deleted."}
          </p>
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-sacred text-cream font-medium"
          >
            <ArrowLeft size={16} />{" "}
            {lang === "hi" ? "आध्यात्मिक ज्ञान पर वापस जाएं" : "Back to Enlightenment"}
          </Link>
        </div>
      </PageShell>
    );
  },
  component: BlogDetailPage,
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

function BlogDetailPage() {
  const { post, related } = Route.useLoaderData();
  const { t, lang } = useLang();
  const isHi = lang === "hi";
  const dev = lang === "hi" ? "font-devanagari" : "";
  const [shareUrl, setShareUrl] = useState("");
  const [speakingId, setSpeakingId] = useState<string | number | null>(null);
  const [loadingId, setLoadingId] = useState<string | number | null>(null);

  const stopPlayback = useCallback(() => {
    stopSpeech();
    setSpeakingId(null);
    setLoadingId(null);
  }, []);

  useEffect(() => {
    return () => {
      stopPlayback();
    };
  }, [stopPlayback]);

  async function toggleSpeak(text: string, id: string | number) {
    console.log("toggleSpeak: requested", { id, textSnippet: text.slice(0, 40) });

    if (speakingId === id || loadingId === id) {
      console.log("toggleSpeak: stopping playback for", id);
      stopPlayback();
      return;
    }

    stopPlayback();
    setLoadingId(id);

    try {
      const cleanText = text.replace(/<[^>]*>/g, "").trim();
      await speakText(cleanText, {
        onStart: () => {
          setSpeakingId(id);
          setLoadingId(null);
        },
        onEnd: () => {
          setSpeakingId(null);
          setLoadingId(null);
        },
        onError: (err) => {
          console.error("SpeechSynthesis error:", err);
          toast.error(err.message || t("sandesh.audio_error"));
          setSpeakingId(null);
          setLoadingId(null);
        },
      });
    } catch (err) {
      console.error("SpeechSynthesis caught exception:", err);
      toast.error(err instanceof Error ? err.message : t("sandesh.audio_error"));
      setSpeakingId(null);
      setLoadingId(null);
    }
  }

  useEffect(() => {
    setShareUrl(window.location.href);
  }, []);

  const readingTime = calculateReadingTime(post.content);
  const formattedDate = formatDate(post.publish_date, lang);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl);
    toast.success(lang === "hi" ? "लिंक कॉपी हो गया!" : "Link copied to clipboard!");
  };

  // Structured schemas
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${shareUrl}#article`,
    headline: post.title,
    image: [post.featured_image || "https://www.namamivindhyavasini.in/maa-vindhyavasini.png"],
    datePublished: post.publish_date,
    dateModified: post.updated_at || post.publish_date,
    author: {
      "@type": "Person",
      name: post.author,
    },
    publisher: {
      "@type": "Organization",
      "@id": "https://www.namamivindhyavasini.in/#organization",
      name: "Namami Vindhyavasini Sansthan",
      logo: {
        "@type": "ImageObject",
        url: "https://www.namamivindhyavasini.in/favicon.png",
      },
    },
    description: post.seo_description || "Spiritual article about Maa Vindhyavasini and Sansthan.",
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
      {
        "@type": "ListItem",
        position: 3,
        name: post.title,
        item: shareUrl,
      },
    ],
  };

  const shareText = encodeURIComponent(`${post.title} - Read on Namami Vindhyavasini:`);

  return (
    <PageShell>
      <JsonLd data={articleSchema} />
      <JsonLd data={breadcrumbSchema} />

      <PageHero
        sanskrit="॥ श्रीमद् विन्ध्यवासिनी विजयतेतराम् ॥"
        title={post.title}
        subtitle={`${categoryTranslations[post.category]?.[lang] || post.category} · ${formattedDate}`}
      />

      <article className="container mx-auto px-3 sm:px-6 py-8 md:py-12 max-w-4xl">
        {/* Featured Image */}
        {post.featured_image && (
          <div className="relative w-full rounded-2xl overflow-hidden shadow-sacred border border-gold/30 mb-10 bg-black/5 flex items-center justify-center">
            <img
              src={post.featured_image}
              alt={post.title}
              className="w-full h-auto max-h-[500px] object-contain pointer-events-none select-none"
              loading="eager"
            />
          </div>
        )}

        {/* Metadata info panel */}
        <div className="flex flex-wrap items-center justify-between gap-6 p-4 rounded-xl bg-card border border-border/50 mb-10 text-sm text-muted-foreground">
          <div className="flex flex-wrap items-center gap-6">
            <span className="flex items-center gap-1.5">
              <Calendar size={14} className="text-gold" /> {formattedDate}
            </span>
            <span className="flex items-center gap-1.5">
              <User size={14} className="text-gold" /> {t("blog.author")}: {post.author}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock size={14} className="text-gold" /> {readingTime} {t("blog.read_time")}
            </span>
            {isHi && isHindiText(post.content) && (
              <button
                onClick={() => toggleSpeak(post.content, post.id)}
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-gold/50 text-maroon hover:bg-gold/10 disabled:opacity-50 disabled:cursor-not-allowed transition text-xs font-semibold ${dev}`}
                disabled={loadingId !== null && loadingId !== post.id}
                aria-label="Listen to Article"
              >
                {loadingId === post.id ? (
                  <Loader2 size={12} className="animate-spin" />
                ) : speakingId === post.id ? (
                  <Square size={12} />
                ) : (
                  <Play size={12} />
                )}
                {loadingId === post.id
                  ? t("sandesh.loading")
                  : speakingId === post.id
                    ? t("sandesh.stop")
                    : t("sandesh.listen")}
              </button>
            )}
          </div>

          {/* Sharing list */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-maroon uppercase tracking-wider flex items-center gap-1">
              <Share2 size={12} /> Share:
            </span>
            <a
              href={`https://wa.me/?text=${shareText}%20${encodeURIComponent(shareUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:bg-green-500 hover:text-white hover:border-transparent transition-colors"
              title="Share on WhatsApp"
            >
              <svg
                className="w-4 h-4 fill-current"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.455 5.703 1.456h.008c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
            </a>
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:bg-blue-600 hover:text-white hover:border-transparent transition-colors"
              title="Share on Facebook"
            >
              <Facebook size={14} />
            </a>
            <a
              href={`https://twitter.com/intent/tweet?text=${shareText}&url=${encodeURIComponent(shareUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:bg-black hover:text-white hover:border-transparent transition-colors"
              title="Share on Twitter"
            >
              <Twitter size={14} />
            </a>
            <button
              onClick={copyToClipboard}
              className="w-8 h-8 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:bg-gold hover:text-cream hover:border-transparent transition-colors cursor-pointer"
              title="Copy Link"
            >
              <Copy size={14} />
            </button>
          </div>
        </div>

        {/* Content body */}
        <div
          className={`prose max-w-none text-foreground/90 leading-relaxed text-base md:text-lg space-y-6 pb-4 border-b border-border/40 ${dev} 
              [&_h2]:font-display [&_h2]:text-2xl [&_h2]:md:text-3xl [&_h2]:text-maroon [&_h2]:mt-8 [&_h2]:mb-4
              [&_h3]:font-display [&_h3]:text-xl [&_h3]:md:text-2xl [&_h3]:text-maroon [&_h3]:mt-6 [&_h3]:mb-3
              [&_p]:mb-4 [&_p]:leading-relaxed
              [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-4
              [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-4
              [&_blockquote]:border-l-4 [&_blockquote]:border-gold [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:my-6 [&_blockquote]:bg-cream/10 [&_blockquote]:py-3 [&_blockquote]:pr-3 [&_blockquote]:rounded-r-xl
              [&_table]:w-full [&_table]:my-6 [&_table]:border-collapse [&_table]:text-sm
              [&_th]:bg-cream/50 [&_th]:border [&_th]:border-border [&_th]:p-2 [&_th]:text-left [&_th]:font-semibold [&_th]:text-maroon
              [&_td]:border [&_td]:border-border [&_td]:p-2
              [&_iframe]:w-full [&_iframe]:aspect-video [&_iframe]:rounded-xl [&_iframe]:border [&_iframe]:border-gold/30 [&_iframe]:my-6`}
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Related Posts Section */}
        {related.length > 0 && (
          <div className="mt-6 pt-4 border-t border-border">
            <h3 className={`font-display text-2xl md:text-3xl text-maroon mb-6 ${dev}`}>
              {t("blog.related")}
            </h3>
            <div className="grid md:grid-cols-3 gap-6">
              {related.map((relPost) => (
                <Link
                  key={relPost.id}
                  to="/blog/$slug"
                  params={{ slug: relPost.slug }}
                  className="group flex flex-col justify-between h-full bg-card rounded-xl border border-gold/20 hover:border-gold hover:shadow-gold transition-all duration-300 overflow-hidden"
                >
                  <div>
                    <div className="relative aspect-[16/10] overflow-hidden">
                      <img
                        src={relPost.featured_image || "/images/maa-vindhyavasini-2.webp"}
                        alt={relPost.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 pointer-events-none select-none"
                      />
                    </div>
                    <div className="p-4 space-y-2">
                      <span className="text-[9px] font-bold text-saffron bg-saffron/10 px-2 py-0.5 rounded uppercase">
                        {categoryTranslations[relPost.category]?.[lang] || relPost.category}
                      </span>
                      <h4
                        className={`font-display text-sm text-maroon group-hover:text-saffron transition-colors line-clamp-2 ${dev}`}
                      >
                        {relPost.title}
                      </h4>
                    </div>
                  </div>
                  <div className="p-4 pt-0 text-[10px] text-muted-foreground flex items-center justify-between border-t border-border/40 mt-2">
                    <span>{formatDate(relPost.publish_date, lang)}</span>
                    <span className="text-maroon font-semibold">{t("blog.read_more")} →</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </article>
    </PageShell>
  );
}
