import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { PageShell, PageHero } from "@/components/PageShell";
import { ScrollReveal } from "@/components/ScrollReveal";
import { supabase } from "@/integrations/supabase/client";
import { useLang } from "@/i18n/LangProvider";
import { Download, X, Share2, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import gallery1 from "@/assets/gallery-1.webp";
import maaImg from "@/assets/maa-vindhyavasini.webp";
import maaImg2 from "@/assets/maa-vindhyavasini-2.webp";
import maaImg5 from "@/assets/maa-vindhyavasini-5.jpg";
import maaImgSimhasan from "@/assets/maa-vindhyavasini-simhasan-shringar.jpg";
import maaImgGarland from "@/assets/maa-vindhyavasini-garland-shringar.jpg";
import maaImgNeel from "@/assets/maa-vindhyavasini-neel-shringar.jpg";
import maaImgDevi from "@/assets/maa-vindhyavasini-devi-mirzapur.jpg";
import maaImgShakti from "@/assets/maa-vindhyavasini-shakti-peeth.jpg";
import { JsonLd } from "@/components/JsonLd";
import { ShareModal } from "@/components/ShareModal";
import { addGalleryWatermark } from "@/lib/watermarkImage";
import { isMobileDevice, shareImageNative } from "@/lib/shareHelpers";

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { title: "Maa Vindhyavasini Darshan Gallery | Divine Shringar & Photos" },
      {
        name: "description",
        content:
          "Browse premium high-resolution images of Maa Vindhyavasini, sacred shringar darshan, temple architecture, and spiritual events in Vindhyachal Dham.",
      },
      {
        name: "keywords",
        content:
          "Maa Vindhyavasini photo gallery, shringar photos, Vindhyachal temple images, divine darshan pictures, माँ विंध्यवासिनी फोटो",
      },
      {
        property: "og:title",
        content: "Maa Vindhyavasini Darshan Gallery | Divine Shringar & Photos",
      },
      {
        property: "og:description",
        content:
          "Browse premium high-resolution images of Maa Vindhyavasini, sacred shringar darshan, temple architecture, and spiritual events in Vindhyachal Dham.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://www.namamivindhyavasini.in/gallery" },
      { property: "og:image", content: "https://www.namamivindhyavasini.in/maa-vindhyavasini.png" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Maa Vindhyavasini Darshan Gallery" },
      {
        name: "twitter:description",
        content:
          "Browse premium high-resolution images of Maa Vindhyavasini, sacred shringar darshan, and spiritual events in Vindhyachal Dham.",
      },
      {
        name: "twitter:image",
        content: "https://www.namamivindhyavasini.in/maa-vindhyavasini.png",
      },
    ],
    links: [{ rel: "canonical", href: "https://www.namamivindhyavasini.in/gallery" }],
  }),
  component: GalleryPage,
});

type GalleryRow = { id: string; image_url: string; caption: string | null; created_at: string };

export const defaults: { src: string; cap_en: string; cap_hi: string }[] = [
  {
    src: maaImgSimhasan,
    cap_en: "Maa Vindhyavasini Simhasan Shringar",
    cap_hi: "माँ विन्ध्यवासिनी सिंहासन श्रृंगार",
  },
  {
    src: maaImgGarland,
    cap_en: "Maa Vindhyavasini Garland Alankar",
    cap_hi: "माँ विन्ध्यवासिनी माला श्रृंगार",
  },
  { src: maaImg5, cap_en: "Pushpa Shringar Darshan", cap_hi: "पुष्प श्रृंगार दर्शन" },
  { src: maaImgNeel, cap_en: "Neel Pushpa Shringar", cap_hi: "नील पुष्प श्रृंगार" },
  { src: maaImgDevi, cap_en: "Maha Aarti Darshan", cap_hi: "महाआरती दर्शन" },
  { src: maaImgShakti, cap_en: "Shakti Peeth Darshan", cap_hi: "शक्तिपीठ दर्शन" },
  { src: gallery1, cap_en: "Swarna Shringar", cap_hi: "स्वर्ण श्रृंगार" },
  { src: maaImg, cap_en: "Divine Grace", cap_hi: "दिव्य स्वरूप (कृपा)" },
  { src: maaImg2, cap_en: "Temple Darshan", cap_hi: "दिव्य दर्शन" },
];

function GalleryPage() {
  const { lang } = useLang();
  const hi = lang === "hi";
  const dev = hi ? "font-devanagari" : "";
  const [extra, setExtra] = useState<GalleryRow[]>([]);
  const [lightbox, setLightbox] = useState<string | null>(null);

  // Sharing states
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [shareDataUrl, setShareDataUrl] = useState<string | null>(null);
  const [shareBlob, setShareBlob] = useState<Blob | null>(null);
  const [sharePageUrl, setSharePageUrl] = useState("");
  const [shareText, setShareText] = useState("");
  const [shareImageUrl, setShareImageUrl] = useState("");

  const openLightbox = (src: string) => {
    setLightbox(src);
    window.history.pushState({ lightbox: true }, "");
  };

  const closeLightbox = () => {
    setLightbox(null);
    if (window.history.state?.lightbox) {
      window.history.back();
    }
  };

  useEffect(() => {
    const handlePopState = (e: PopStateEvent) => {
      if (lightbox) {
        setLightbox(null);
      }
    };
    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [lightbox]);

  useEffect(() => {
    void (async () => {
      const { data } = await supabase
        .from("gallery")
        .select("id,image_url,caption,created_at")
        .order("created_at", { ascending: false });

      if (data) setExtra(data as GalleryRow[]);
    })();
  }, []);

  // Lock body scroll when lightbox is open
  useEffect(() => {
    if (lightbox) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [lightbox]);

  const dbItems = extra.map((r) => ({
    src: r.image_url,
    cap: hi ? "माँ विंध्यवासिनी दर्शन" : "Maa Vindhyavasini Darshan",
  }));
  const defaultItems = defaults.map((d) => ({ src: d.src, cap: hi ? d.cap_hi : d.cap_en }));
  // System-bundled images first, then admin-uploaded URL images from database
  const items = [...defaultItems, ...dbItems];

  const activeLightboxItem = items.find((x) => x.src === lightbox);
  const activeLightboxCap = activeLightboxItem
    ? activeLightboxItem.cap
    : hi
      ? "माँ विंध्यवासिनी दर्शन"
      : "Maa Vindhyavasini Darshan";

  const handleDownload = async (url: string, title: string) => {
    const filename = `${title.toLowerCase().replace(/\s+/g, "_")}.jpg`;
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
      toast.success(hi ? "डाउनलोड शुरू!" : "Download started!");
    } catch {
      // CORS blocked (e.g. Pinterest URLs) — open in new tab for manual save
      window.open(url, "_blank");
      toast(
        hi
          ? "💡 फोटो नई टैब में खुली — राइट-क्लिक → 'Save Image As' चुनें"
          : "💡 Photo opened — right-click and 'Save Image As'",
        { duration: 5000 },
      );
    }
  };

  const shareGalleryImage = async (imgUrl: string) => {
    const item = items.find((x) => x.src === imgUrl);
    const caption = item ? item.cap : hi ? "माँ विंध्यवासिनी दर्शन" : "Maa Vindhyavasini Darshan";
    const pageUrl = window.location.origin + "/gallery";

    // Fetch the raw image blob directly from the URL.
    // This avoids the canvas CORS taint issue that blocks external (Supabase) URLs.
    toast.loading(lang === "hi" ? "छवि तैयार की जा रही है..." : "Preparing image...", {
      id: "share-gallery",
    });

    let imageBlob: Blob | null = null;
    try {
      const response = await fetch(imgUrl);
      if (response.ok) {
        imageBlob = await response.blob();
      }
    } catch (fetchErr) {
      console.warn("[Gallery Share] Could not fetch image blob from URL:", fetchErr);
    }

    let shareBlob: Blob | null = imageBlob;
    let sharePreviewUrl = imgUrl;

    if (imageBlob) {
      try {
        const watermarked = await addGalleryWatermark(imageBlob, hi);
        shareBlob = watermarked.blob;
        sharePreviewUrl = watermarked.dataUrl;
      } catch (wmErr) {
        console.warn("[Gallery Share] Watermark failed, using original image:", wmErr);
      }
    }

    toast.dismiss("share-gallery");

    // On mobile, open the native share sheet immediately (WhatsApp, Instagram, etc.)
    if (isMobileDevice() && shareBlob) {
      const result = await shareImageNative({
        blob: shareBlob,
        filename: "maa_vindhyavasini_darshan.png",
        title: "Maa Vindhyavasini Divya Darshan",
        text: `${caption}\nwww.namamivindhyavasini.in`,
      });
      if (result === "shared") {
        toast.success(lang === "hi" ? "सफलतापूर्वक साझा किया गया!" : "Shared successfully!");
        return;
      }
      if (result === "cancelled") return;
    }

    // Desktop / mobile fallback — open Share Modal with watermarked preview
    setShareDataUrl(sharePreviewUrl);
    setShareBlob(shareBlob);
    setShareImageUrl(sharePreviewUrl);
    setSharePageUrl(pageUrl);
    setShareText(caption);
    setShareModalOpen(true);
  };

  const webpageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": "https://www.namamivindhyavasini.in/gallery#webpage",
    url: "https://www.namamivindhyavasini.in/gallery",
    name: "Maa Vindhyavasini Darshan Gallery | Divine Shringar & Photos",
    description:
      "Browse premium high-resolution images of Maa Vindhyavasini, sacred shringar darshan, temple architecture, and spiritual events in Vindhyachal Dham.",
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
        name: "Gallery",
        item: "https://www.namamivindhyavasini.in/gallery",
      },
    ],
  };

  const cleanAbsUrl = (src: string) => {
    if (src.startsWith("http")) return src;
    const cleanSrc = src.startsWith("/") ? src : `/${src}`;
    return `https://www.namamivindhyavasini.in${cleanSrc}`;
  };

  const imagesSchema = {
    "@context": "https://schema.org",
    "@graph": items.map((p, idx) => ({
      "@type": "ImageObject",
      "@id": `https://www.namamivindhyavasini.in/gallery#image-${idx}`,
      url: cleanAbsUrl(p.src),
      name: p.cap,
      caption: p.cap,
      description: hi
        ? `विन्ध्याचल धाम से माँ विन्ध्यवासिनी देवी का पावन और दिव्य दर्शन चित्र - ${p.cap}`
        : `Divine darshan and shringar photograph of Maa Vindhyavasini Devi from Vindhyachal Dham - ${p.cap}`,
      contentUrl: cleanAbsUrl(p.src),
    })),
  };

  return (
    <PageShell>
      <JsonLd data={webpageSchema} />
      <JsonLd data={breadcrumbSchema} />
      <JsonLd data={imagesSchema} />
      <PageHero
        sanskrit="॥ दर्शनं देवि कारुणिके ॥"
        title={hi ? "दिव्य दर्शन गैलरी" : "Sacred Darshan Gallery"}
        subtitle={
          hi
            ? "विभिन्न अवसरों पर माँ विन्ध्यवासिनी का मनमोहक श्रृंगार"
            : "Glimpses of Maa Vindhyavasini's divine shringar across sacred occasions"
        }
      />

      <section className="w-full max-w-7xl mx-auto px-1.5 sm:px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5 sm:gap-6">
          {items.map((p, i) => (
            <ScrollReveal key={i} direction="up" delay={(i % 3) * 100} duration={800}>
              <figure
                onClick={() => openLightbox(p.src)}
                className="group relative aspect-[3/4] rounded-2xl overflow-hidden border-2 border-gold/40 shadow-sacred hover:shadow-gold transition-all hover:-translate-y-1 cursor-pointer bg-cream/10 flex items-center justify-center h-full"
              >
                <img
                  src={p.src}
                  alt={p.cap}
                  title={p.cap}
                  width={350}
                  height={460}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 pointer-events-none select-none"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-maroon/85 via-maroon/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                {/* Download Button Overlay */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDownload(p.src, "Maa Vindhyavasini Darshan");
                  }}
                  className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-cream/90 text-maroon hover:bg-gold hover:text-cream flex items-center justify-center shadow-lg transition-all duration-300 md:opacity-0 md:group-hover:opacity-100"
                  title="Download image"
                  aria-label="Download image"
                >
                  <Download size={16} />
                </button>

                {/* Share Button Overlay */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    shareGalleryImage(p.src);
                  }}
                  className="absolute top-3 right-14 z-10 w-9 h-9 rounded-full bg-cream/90 text-maroon hover:bg-gold hover:text-cream flex items-center justify-center shadow-lg transition-all duration-300 md:opacity-0 md:group-hover:opacity-100"
                  title="Share image"
                  aria-label="Share image"
                >
                  <Share2 size={16} />
                </button>
              </figure>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {lightbox &&
        createPortal(
          <div
            className="fixed inset-0 z-[100] bg-black/95 flex flex-col items-center justify-center p-4 overflow-hidden select-none transition-all duration-300 animate-fade-in"
            onClick={closeLightbox}
          >
            {/* Top navigation/close bar for mobile & desktop */}
            <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-[110] pointer-events-none">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  closeLightbox();
                }}
                className="pointer-events-auto flex items-center gap-2 px-4 py-2.5 rounded-full bg-black/60 text-white hover:bg-black/80 hover:scale-105 border border-white/20 shadow-lg transition-all duration-300 cursor-pointer text-sm font-semibold select-none"
                aria-label="Go back"
              >
                <ArrowLeft size={18} />
                <span>{hi ? "वापस" : "Back"}</span>
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  closeLightbox();
                }}
                className="pointer-events-auto p-2.5 rounded-full bg-black/60 text-white hover:bg-black/80 hover:scale-105 border border-white/20 shadow-lg transition-all duration-300 cursor-pointer select-none"
                aria-label="Close lightbox"
              >
                <X size={20} />
              </button>
            </div>

            <div
              className="relative w-full max-w-lg md:max-w-2xl px-4 flex flex-col items-center justify-center transition-all duration-500 ease-spring animate-fade-in"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={lightbox}
                alt={`${activeLightboxCap} Full Size`}
                title={`${activeLightboxCap} View`}
                width={800}
                height={1000}
                className="max-h-[calc(100dvh-180px)] md:max-h-[calc(100vh-220px)] max-w-full rounded-xl shadow-2xl object-contain border border-gold/25 hover:scale-[1.01] transition-transform duration-300 pointer-events-none select-none"
              />

              <div className="mt-4 flex flex-wrap justify-center gap-3 shrink-0">
                {/* Download Button in Lightbox */}
                <button
                  onClick={() => {
                    handleDownload(lightbox, "Maa Vindhyavasini Darshan");
                  }}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-sacred text-cream font-medium shadow-gold hover:scale-[1.03] active:scale-95 transition-all duration-300 text-sm cursor-pointer"
                >
                  <Download size={14} />
                  {hi ? "डाउनलोड" : "Download"}
                </button>

                {/* Share Button in Lightbox */}
                <button
                  onClick={() => {
                    shareGalleryImage(lightbox);
                  }}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border-2 border-gold text-gold font-medium hover:bg-gold/10 hover:scale-[1.03] active:scale-95 transition-all duration-300 text-sm cursor-pointer animate-pulse"
                >
                  <Share2 size={14} />
                  {hi ? "शेयर" : "Share"}
                </button>
              </div>
            </div>
          </div>,
          document.body,
        )}
      <ShareModal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        dataUrl={shareDataUrl}
        imageBlob={shareBlob}
        imageUrl={shareImageUrl}
        pageUrl={sharePageUrl}
        text={shareText}
        title={hi ? "दिव्य दर्शन साझा करें" : "Share Divya Darshan"}
        downloadFilename="maa_vindhyavasini_darshan.png"
      />
    </PageShell>
  );
}
