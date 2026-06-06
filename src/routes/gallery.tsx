import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { PageShell, PageHero } from "@/components/PageShell";
import { ScrollReveal } from "@/components/ScrollReveal";
import { supabase } from "@/integrations/supabase/client";
import { useLang } from "@/i18n/LangProvider";
import { Download, X, Share2, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import maaImg2 from "@/assets/maa-vindhyavasini-2.webp";
import maaImg3 from "@/assets/maa-vindhyavasini-3.webp";
import gallery1 from "@/assets/gallery-1.webp";

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { title: "Sacred Darshan Gallery — Namami Vindhyavasini" },
      {
        name: "description",
        content:
          "divine darshan and shringar of Maa Vindhyavasini across sacred occasions at Vindhyachal Dham.",
      },
      { property: "og:title", content: "Sacred Darshan Gallery — Maa Vindhyavasini" },
      { property: "og:description", content: "Glimpses of Maa Vindhyavasini's divine shringar." },
    ],
  }),
  component: GalleryPage,
});

type GalleryRow = { id: string; image_url: string; caption: string | null; created_at: string };

const defaults: { src: string; cap_en: string; cap_hi: string }[] = [
  { src: gallery1, cap_en: "Swarna Shringar", cap_hi: "स्वर्ण श्रृंगार" },
  { src: maaImg2, cap_en: "Mangala Aarti", cap_hi: "प्रातः आरती" },
  { src: maaImg3, cap_en: "Vishesh Shringar", cap_hi: "विशेष श्रृंगार" },
];

function dataURLtoFile(dataurl: string, filename: string): File {
  const arr = dataurl.split(",");
  const mime = arr[0].match(/:(.*?);/)![1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
}

function GalleryPage() {
  const { lang } = useLang();
  const hi = lang === "hi";
  const dev = hi ? "font-devanagari" : "";
  const [extra, setExtra] = useState<GalleryRow[]>([]);
  const [lightbox, setLightbox] = useState<string | null>(null);

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

  const dbItems = extra.map((r) => ({ src: r.image_url, cap: r.caption ?? "" }));
  const defaultItems = defaults.map((d) => ({ src: d.src, cap: hi ? d.cap_hi : d.cap_en }));
  const items = [...dbItems, ...defaultItems];

  const handleDownload = async (url: string, title: string) => {
    try {
      const filename = `${title.toLowerCase().replace(/\s+/g, "_")}.png`;
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
    } catch (err) {
      console.warn("Direct blob download failed, falling back to window.open", err);
      const link = document.createElement("a");
      link.href = url;
      link.target = "_blank";
      link.download = `${title.toLowerCase().replace(/\s+/g, "_")}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const shareGalleryImage = async (imgUrl: string, caption: string) => {
    // Check if it is an external URL to instantly share the link directly and preserve user gesture
    const isExternal = imgUrl.startsWith("http") && !imgUrl.includes(window.location.origin);
    if (isExternal) {
      if (navigator.share) {
        try {
          await navigator.share({
            title: "Maa Vindhyavasini Divya Darshan",
            text: `${caption} — Glimpse of Maa Vindhyavasini's divine shringar`,
            url: imgUrl,
          });
          toast.success(lang === "hi" ? "सफलतापूर्वक साझा किया गया!" : "Shared successfully!");
          return;
        } catch (shareErr) {
          if (shareErr instanceof Error && shareErr.name === "AbortError") {
            return;
          }
          console.error("[Gallery Share] External URL share failed:", shareErr);
        }
      }

      // Fallback: Clipboard copy
      try {
        await navigator.clipboard.writeText(imgUrl);
        toast.success(
          lang === "hi" 
            ? "छवि लिंक क्लिपबोर्ड पर कॉपी किया गया!" 
            : "Image link copied to clipboard!"
        );
      } catch (clipErr) {
        console.error("[Gallery Share] Clipboard write failed for external URL:", clipErr);
        toast.error(lang === "hi" ? "साझा करने में विफल" : "Failed to share image");
      }
      return;
    }

    toast.loading(lang === "hi" ? "साझा करने के लिए छवि तैयार की जा रही है..." : "Preparing image for sharing...", { id: "share-gallery" });
    try {
      const canvas = document.createElement("canvas");
      canvas.width = 1080;
      canvas.height = 1920;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Could not get canvas context");

      // 1. Draw background gradient
      const bgGrad = ctx.createRadialGradient(540, 960, 100, 540, 960, 1100);
      bgGrad.addColorStop(0, "#FFFDF6");
      bgGrad.addColorStop(1, "#FFF4DD");
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, 1080, 1920);

      // 2. Draw border frame
      ctx.strokeStyle = "#D9381E";
      ctx.lineWidth = 12;
      ctx.strokeRect(30, 30, 1020, 1860);

      ctx.strokeStyle = "#D6A232";
      ctx.lineWidth = 4;
      ctx.strokeRect(50, 50, 980, 1820);

      // Corner Accents
      const drawCorners = () => {
        ctx.fillStyle = "#D9381E";
        const corners = [
          { x: 50, y: 50, dx: 1, dy: 1 },
          { x: 1030, y: 50, dx: -1, dy: 1 },
          { x: 50, y: 1870, dx: 1, dy: -1 },
          { x: 1030, y: 1870, dx: -1, dy: -1 },
        ];
        corners.forEach((c) => {
          ctx.beginPath();
          ctx.arc(c.x, c.y, 40, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(217, 56, 30, 0.1)";
          ctx.fill();

          ctx.strokeStyle = "#D9381E";
          ctx.lineWidth = 4;
          ctx.beginPath();
          ctx.moveTo(c.x, c.y);
          ctx.lineTo(c.x + c.dx * 80, c.y);
          ctx.moveTo(c.x, c.y);
          ctx.lineTo(c.x, c.y + c.dy * 80);
          ctx.stroke();
        });
      };
      drawCorners();

      // 3. Draw Header Box
      ctx.save();
      ctx.shadowColor = "rgba(217, 56, 30, 0.3)";
      ctx.shadowBlur = 20;
      ctx.shadowOffsetY = 8;
      const headGrad = ctx.createLinearGradient(140, 0, 940, 0);
      headGrad.addColorStop(0, "#D9381E");
      headGrad.addColorStop(1, "#FF5E36");
      ctx.fillStyle = headGrad;
      
      const drawRoundRect = (x: number, y: number, w: number, h: number, r: number) => {
        if (typeof ctx.roundRect === "function") {
          ctx.roundRect(x, y, w, h, r);
        } else {
          ctx.moveTo(x + r, y);
          ctx.arcTo(x + w, y, x + w, y + h, r);
          ctx.arcTo(x + w, y + h, x, y + h, r);
          ctx.arcTo(x, y + h, x, y, r);
          ctx.arcTo(x, y, x + w, y, r);
        }
      };
      
      ctx.beginPath();
      drawRoundRect(140, 160, 800, 120, 60);
      ctx.fill();
      ctx.restore();

      // Header golden outline
      ctx.strokeStyle = "#D6A232";
      ctx.lineWidth = 3;
      ctx.beginPath();
      drawRoundRect(145, 165, 790, 110, 55);
      ctx.stroke();

      // Header Text
      ctx.fillStyle = "#FFFDF6";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.font = "bold 44px Georgia, serif";
      ctx.fillText(lang === "hi" ? "॥ दिव्य दर्शन ॥" : "॥ Divya Darshan ॥", 540, 220);

      // 4. Load and draw the Gallery Image
      const img = new Image();
      img.crossOrigin = "anonymous";
      
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = () => reject(new Error("Failed to load image"));
        img.src = imgUrl;
      });

      // Position & Size calculation for 3:4 image layout
      const imgWidth = 840;
      const imgHeight = 1120; // 3:4 ratio
      const imgX = (1080 - imgWidth) / 2;
      const imgY = 360;

      // Draw shadow for image
      ctx.save();
      ctx.shadowColor = "rgba(0, 0, 0, 0.3)";
      ctx.shadowBlur = 25;
      ctx.shadowOffsetY = 12;
      
      // Draw image background card (white border)
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(imgX - 16, imgY - 16, imgWidth + 32, imgHeight + 32);
      ctx.restore();

      // Draw the image itself
      ctx.drawImage(img, imgX, imgY, imgWidth, imgHeight);

      // Gold frame around the image
      ctx.strokeStyle = "#D6A232";
      ctx.lineWidth = 4;
      ctx.strokeRect(imgX - 18, imgY - 18, imgWidth + 36, imgHeight + 36);

      // 5. Draw Caption below the image
      ctx.fillStyle = "#5E1914";
      ctx.font = "bold 48px Georgia, serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(caption, 540, 1560);

      // 6. Draw Bottom Footer Block
      ctx.save();
      ctx.shadowColor = "rgba(217, 56, 30, 0.25)";
      ctx.shadowBlur = 15;
      ctx.shadowOffsetY = 6;
      ctx.fillStyle = "#D9381E";
      ctx.beginPath();
      drawRoundRect(240, 1680, 600, 80, 40);
      ctx.fill();
      ctx.restore();

      // Footer golden outline
      ctx.strokeStyle = "#D6A232";
      ctx.lineWidth = 3;
      ctx.beginPath();
      drawRoundRect(245, 1685, 590, 70, 35);
      ctx.stroke();

      ctx.fillStyle = "#FFFDF6";
      ctx.font = "bold 28px Georgia, serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("namamivindhyavasini.in", 540, 1720);

      const dataUrl = canvas.toDataURL("image/png");
      const file = dataURLtoFile(dataUrl, `darshan_${caption.toLowerCase().replace(/\s+/g, "_")}.png`);

      const triggerDownload = () => {
        const link = document.createElement("a");
        link.download = `darshan_${caption.toLowerCase().replace(/\s+/g, "_")}.png`;
        link.href = dataUrl;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success(lang === "hi" ? "छवि डाउनलोड प्रारंभ!" : "Image download started!", { id: "share-gallery" });
      };

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        try {
          await navigator.share({
            files: [file],
            title: "Maa Vindhyavasini Divya Darshan",
            text: caption,
          });
          toast.success(lang === "hi" ? "सफलतापूर्वक साझा किया गया!" : "Shared successfully!", { id: "share-gallery" });
        } catch (shareErr) {
          if (shareErr instanceof Error && shareErr.name === "AbortError") {
            toast.dismiss("share-gallery");
            return;
          }
          triggerDownload();
        }
      } else {
        triggerDownload();
      }
    } catch (err) {
      console.error("[Gallery Share] Canvas generation failed, trying direct link share fallback:", err);
      
      // First-tier Fallback: Use Web Share API to share direct URL and text
      if (navigator.share) {
        try {
          await navigator.share({
            title: "Maa Vindhyavasini Divya Darshan",
            text: `${caption} — Glimpse of Maa Vindhyavasini's divine shringar`,
            url: imgUrl,
          });
          toast.success(lang === "hi" ? "सफलतापूर्वक साझा किया गया!" : "Shared successfully!", { id: "share-gallery" });
          return;
        } catch (shareErr) {
          if (shareErr instanceof Error && shareErr.name === "AbortError") {
            toast.dismiss("share-gallery");
            return;
          }
          console.error("[Gallery Share] Web Share API direct link fallback failed:", shareErr);
        }
      }

      // Second-tier Fallback: Copy link to clipboard
      try {
        await navigator.clipboard.writeText(imgUrl);
        toast.success(
          lang === "hi" 
            ? "छवि लिंक क्लिपबोर्ड पर कॉपी किया गया!" 
            : "Image link copied to clipboard!", 
          { id: "share-gallery" }
        );
      } catch (clipErr) {
        console.error("[Gallery Share] Clipboard write failed:", clipErr);
        toast.error(
          lang === "hi" ? "साझा करने में विफल" : "Failed to share image", 
          { id: "share-gallery" }
        );
      }
    }
  };

  return (
    <PageShell>
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
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-maroon/85 via-maroon/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <figcaption
                  className={`absolute bottom-0 left-0 right-0 p-4 text-cream font-display text-lg translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all ${dev}`}
                >
                  {p.cap}
                </figcaption>

                {/* Download Button Overlay */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDownload(p.src, p.cap || `darshan_${i + 1}`);
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
                    shareGalleryImage(p.src, p.cap || `Darshan ${i + 1}`);
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

      {lightbox && createPortal(
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
              alt="Darshan"
              className="max-h-[calc(100dvh-180px)] md:max-h-[calc(100vh-220px)] max-w-full rounded-xl shadow-2xl object-contain border border-gold/25 hover:scale-[1.01] transition-transform duration-300"
            />

            <div className="mt-4 flex flex-wrap justify-center gap-3 shrink-0">
              {/* Download Button in Lightbox */}
              <button
                onClick={() => {
                  const item = items.find((it) => it.src === lightbox);
                  handleDownload(lightbox, item?.cap || "darshan_vigraha");
                }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-sacred text-cream font-medium shadow-gold hover:scale-[1.03] active:scale-95 transition-all duration-300 text-sm cursor-pointer"
              >
                <Download size={14} />
                {hi ? "डाउनलोड" : "Download"}
              </button>

              {/* Share Button in Lightbox */}
              <button
                onClick={() => {
                  const item = items.find((it) => it.src === lightbox);
                  shareGalleryImage(lightbox, item?.cap || "Darshan");
                }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border-2 border-gold text-gold font-medium hover:bg-gold/10 hover:scale-[1.03] active:scale-95 transition-all duration-300 text-sm cursor-pointer animate-pulse"
              >
                <Share2 size={14} />
                {hi ? "शेयर" : "Share"}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </PageShell>
  );
}
