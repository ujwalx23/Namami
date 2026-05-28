import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PageShell, PageHero } from "@/components/PageShell";
import { supabase } from "@/integrations/supabase/client";
import { useLang } from "@/i18n/LangProvider";
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
        .from<GalleryRow>("gallery")
        .select("id,image_url,caption,created_at")
        .order("created_at", { ascending: false });

      if (data) setExtra(data);
    })();
  }, []);

  const items = [
    ...extra.map((r) => ({ src: r.image_url, cap: r.caption ?? "" })),
    ...defaults.map((d) => ({ src: d.src, cap: hi ? d.cap_hi : d.cap_en })),
  ];

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
              className="group relative aspect-[3/4] rounded-2xl overflow-hidden border-2 border-gold/40 shadow-sacred hover:shadow-gold transition-all hover:-translate-y-1 cursor-pointer"
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
            </figure>
          ))}
        </div>
      </section>

      {lightbox && (
        <div
          className="fixed inset-0 z-[60] bg-black/90 flex items-center justify-center p-4 cursor-zoom-out"
          onClick={() => setLightbox(null)}
        >
          <img
            src={lightbox}
            alt="Darshan"
            className="max-h-full max-w-full rounded-xl shadow-2xl"
          />
        </div>
      )}
    </PageShell>
  );
}
