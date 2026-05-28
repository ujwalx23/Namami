import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PageShell, PageHero } from "@/components/PageShell";
import { supabase } from "@/integrations/supabase/client";
import { useLang } from "@/i18n/LangProvider";
import { Download, X } from "lucide-react";
import maaImg from "@/assets/maa-vindhyavasini.png";
import maaImg2 from "@/assets/maa-vindhyavasini-2.jpg";
import maaImg3 from "@/assets/maa-vindhyavasini-3.jpg";
import gallery1 from "@/assets/gallery-1.png";
import gallery2 from "@/assets/gallery-2.png";
import gallery3 from "@/assets/gallery-3.png";
import darshan1 from "@/assets/darshan-1.png";
import darshan2 from "@/assets/darshan-2.png";
import darshan3 from "@/assets/darshan-3.png";

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
  { src: maaImg, cap_en: "Mool Vigraha", cap_hi: "मुख्य विग्रह" },
  { src: maaImg2, cap_en: "Mangala Aarti", cap_hi: "प्रातः आरती" },
  { src: maaImg3, cap_en: "Vishesh Shringar", cap_hi: "विशेष श्रृंगार" },
  { src: gallery1, cap_en: "Swarna Shringar", cap_hi: "स्वर्ण श्रृंगार" },
  { src: gallery2, cap_en: "Pushpa Shringar", cap_hi: "पुष्प श्रृंगार" },
  { src: gallery3, cap_en: "Navaratri Darshan", cap_hi: "नवरात्रि दर्शन" },
  { src: darshan1, cap_en: "Sayankaal Aarti Darshan", cap_hi: "सायंकाल आरती दर्शन" },
  { src: darshan2, cap_en: "Divya Pushpa Shringar", cap_hi: "दिव्य पुष्प श्रृंगार" },
  { src: darshan3, cap_en: "Mogra Shringar", cap_hi: "मोगरा श्रृंगार" },
];

function GalleryPage() {
  const { lang } = useLang();
  const hi = lang === "hi";
  const dev = hi ? "font-devanagari" : "";
  const [extra, setExtra] = useState<GalleryRow[]>([]);
  const [lightbox, setLightbox] = useState<string | null>(null);

  useEffect(() => {
    void (async () => {
      const { data } = await supabase
        .from("gallery")
        .select("id,image_url,caption,created_at")
        .order("created_at", { ascending: false });

      if (data) setExtra(data as GalleryRow[]);
    })();
  }, []);

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

      <section className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {items.map((p, i) => (
            <figure
              key={i}
              onClick={() => setLightbox(p.src)}
              className="group relative aspect-[3/4] rounded-2xl overflow-hidden border-2 border-gold/40 shadow-sacred hover:shadow-gold transition-all hover:-translate-y-1 cursor-pointer bg-cream/10 flex items-center justify-center"
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
            </figure>
          ))}
        </div>
      </section>

      {lightbox && (
        <div
          className="fixed inset-0 z-[60] bg-black/95 flex flex-col items-center justify-center p-2 sm:p-4"
          onClick={() => setLightbox(null)}
        >
          {/* Close button */}
          <button
            onClick={() => setLightbox(null)}
            className="absolute top-4 right-4 z-50 p-2.5 rounded-full bg-cream/10 text-cream hover:bg-cream/20 transition-colors"
            aria-label="Close lightbox"
          >
            <X size={24} />
          </button>

          <div
            className="relative max-w-full max-h-[calc(100vh-30px)] flex flex-col items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={lightbox}
              alt="Darshan"
              className="max-h-[calc(100vh-120px)] max-w-[95vw] rounded-xl shadow-2xl object-contain border border-gold/25"
            />
            
            {/* Download Button in Lightbox */}
            <button
              onClick={() => {
                const item = items.find((it) => it.src === lightbox);
                handleDownload(lightbox, item?.cap || "darshan_vigraha");
              }}
              className="mt-3 shrink-0 inline-flex items-center gap-2 px-6 py-2 rounded-full bg-gradient-sacred text-cream font-medium shadow-gold hover:scale-[1.03] transition-transform duration-300 text-sm"
            >
              <Download size={14} />
              {hi ? "डाउनलोड करें" : "Download Darshan"}
            </button>
          </div>
        </div>
      )}
    </PageShell>
  );
}
