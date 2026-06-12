import { createFileRoute } from "@tanstack/react-router";
import { PageShell, PageHero } from "@/components/PageShell";
import { ScrollReveal } from "@/components/ScrollReveal";
import { Quote, RefreshCw, Loader2, Play, Square, Share2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { useCallback, useEffect, useState } from "react";
import { useLang } from "@/i18n/LangProvider";
import { speakText, stopSpeech, isHindiText } from "@/lib/speech";
import { toast } from "sonner";
import { JsonLd } from "@/components/JsonLd";

type Sandesh = Tables<"sandesh">;

export const Route = createFileRoute("/sandesh")({
  head: () => ({
    meta: [
      { title: "Daily Spiritual Sandesh & Quotes | Namami Vindhyavasini Sansthan" },
      {
        name: "description",
        content:
          "Receive daily spiritual sandesh, divine quotes, and wisdom from Pujya Guru Ji. Get blessings and spiritual guidance for devotees of Maa Vindhyavasini.",
      },
      {
        name: "keywords",
        content:
          "Daily spiritual sandesh, Vindhyavasini quotes, Pujya Guru Ji wisdom, Hindu spiritual messages, दैनिक संदेश, आध्यात्मिक विचार, विंध्यवासिनी",
      },
      { property: "og:title", content: "Daily Spiritual Sandesh & Quotes | Namami Vindhyavasini Sansthan" },
      {
        property: "og:description",
        content:
          "Receive daily spiritual sandesh, divine quotes, and wisdom from Pujya Guru Ji. Get blessings and spiritual guidance.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://www.namamivindhyavasini.in/sandesh" },
      { property: "og:image", content: "https://www.namamivindhyavasini.in/maa-vindhyavasini.png" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Daily Spiritual Sandesh & Quotes" },
      {
        name: "twitter:description",
        content:
          "Receive daily spiritual sandesh, divine quotes, and wisdom from Pujya Guru Ji.",
      },
      { name: "twitter:image", content: "https://www.namamivindhyavasini.in/maa-vindhyavasini.png" },
    ],
    links: [
      { rel: "canonical", href: "https://www.namamivindhyavasini.in/sandesh" }
    ],
  }),
  loader: async () => {
    const { data, error } = await supabase
      .from("sandesh")
      .select("*")
      .order("publish_date", { ascending: false })
      .limit(50);
    if (error) throw error;
    return { sandesh: (data ?? []) as Sandesh[] };
  },
  errorComponent: ({ error }) => (
    <PageShell>
      <PageHero title="Sandesh" subtitle="Could not load sandesh." />
      <div className="container mx-auto px-6 py-10 text-center text-muted-foreground">
        {error.message}
      </div>
    </PageShell>
  ),
  notFoundComponent: () => (
    <PageShell>
      <PageHero title="Not found" />
    </PageShell>
  ),
  component: SandeshPage,
});

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

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function SandeshPage() {
  const { sandesh } = Route.useLoaderData();
  const { t, lang } = useLang();
  const dev = lang === "hi" ? "font-devanagari" : "";
  const [seed, setSeed] = useState(0);
  const [speakingId, setSpeakingId] = useState<string | number | null>(null);
  const [loadingId, setLoadingId] = useState<string | number | null>(null);
  const [error, setError] = useState<string | null>(null);
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
    setError(null);
    setLoadingId(id);

    try {
      await speakText(text, {
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
          setError(err.message || t("sandesh.audio_error"));
          setSpeakingId(null);
          setLoadingId(null);
        },
      });
    } catch (err) {
      console.error("SpeechSynthesis caught exception:", err);
      setError(err instanceof Error ? err.message : t("sandesh.audio_error"));
      setSpeakingId(null);
      setLoadingId(null);
    }
  }

  const shareSandesh = async (message: string, author: string) => {
    console.log("[Sandesh] shareSandesh triggered.");
    const canvas = document.createElement("canvas");
    canvas.width = 1080;
    canvas.height = 1920;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Helper for rounded rectangles (compatibility fallback)
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

    // 1. Draw traditional gradient background
    const bgGrad = ctx.createRadialGradient(540, 960, 100, 540, 960, 1100);
    bgGrad.addColorStop(0, "#FFFDF6");
    bgGrad.addColorStop(1, "#FFF4DD");
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 1080, 1920);

    // 2. Draw golden/saffron double border
    ctx.strokeStyle = "#D9381E";
    ctx.lineWidth = 12;
    ctx.strokeRect(30, 30, 1020, 1860);

    ctx.strokeStyle = "#D6A232";
    ctx.lineWidth = 4;
    ctx.strokeRect(50, 50, 980, 1820);

    // Draw traditional corner accents (corner lines)
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

    // 3.5 Draw background watermark "namamivindhyavasini.in" repeated diagonally
    ctx.save();
    ctx.rotate(-25 * Math.PI / 180);
    ctx.fillStyle = "rgba(217, 56, 30, 0.085)"; // Darker saffron/red watermark
    ctx.font = "bold 32px sans-serif";
    ctx.textAlign = "left";
    const stepX = 450;
    const stepY = 200;
    for (let y = -1000; y < 2500; y += stepY) {
      const xOffset = (y / stepY) % 2 === 0 ? 0 : stepX / 2;
      for (let x = -1000; x < 2500; x += stepX) {
        ctx.fillText("namamivindhyavasini.in", x + xOffset, y);
      }
    }
    ctx.restore();

    // 4. Draw Header Box
    ctx.save();
    ctx.shadowColor = "rgba(217, 56, 30, 0.3)";
    ctx.shadowBlur = 20;
    ctx.shadowOffsetY = 8;
    const headGrad = ctx.createLinearGradient(140, 0, 940, 0);
    headGrad.addColorStop(0, "#D9381E");
    headGrad.addColorStop(1, "#FF5E36");
    ctx.fillStyle = headGrad;
    // Draw top header pill
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
    ctx.fillText("॥ दैनिक संदेश ॥", 540, 220);

    // 5. Draw the Quote Marks
    ctx.fillStyle = "rgba(214, 162, 50, 0.25)";
    ctx.font = "bold 240px Georgia, serif";
    ctx.fillText("“", 540, 600);

    // 6. Draw Wrapped Quote Text
    ctx.fillStyle = "#5E1914";
    ctx.font = "52px Georgia, serif";
    ctx.textBaseline = "top";

    const maxTextWidth = 840;
    const lineHeight = 75;

    // Simple text wrapping helper
    const words = message.split(" ");
    let line = "";
    const lines: string[] = [];

    // Group words into lines based on canvas width measurements
    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + " ";
      const metrics = ctx.measureText(testLine);
      const testWidth = metrics.width;
      if (testWidth > maxTextWidth && n > 0) {
        lines.push(line.trim());
        line = words[n] + " ";
      } else {
        line = testLine;
      }
    }
    lines.push(line.trim());

    // Draw each line centered
    const totalTextHeight = lines.length * lineHeight;
    const startY = 960 - totalTextHeight / 2 + 60; // Offset slightly down to balance layout

    lines.forEach((l, idx) => {
      ctx.fillText(l, 540, startY + idx * lineHeight);
    });

    // 7. Draw Author
    ctx.fillStyle = "#D9381E";
    ctx.font = "italic 38px Georgia, serif";
    ctx.fillText(`— ${author}`, 540, startY + totalTextHeight + 90);

    // 8. Draw Bottom Footer Block
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
    const file = dataURLtoFile(dataUrl, `sandesh_${new Date().toISOString().split("T")[0]}.png`);

    // Helper to copy card directly to clipboard
    const copyCardToClipboard = async () => {
      try {
        const response = await fetch(dataUrl);
        const blob = await response.blob();
        await navigator.clipboard.write([
          new ClipboardItem({
            [blob.type]: blob
          })
        ]);
        toast.success(
          lang === "hi" 
            ? "छवि कॉपी की गई! व्हाट्सएप (Ctrl+V) में सीधे पेस्ट करें।" 
            : "Image card copied! Paste (Ctrl+V) directly into WhatsApp."
        );
      } catch (clipErr) {
        console.warn("Could not copy image to clipboard", clipErr);
        toast.error(
          lang === "hi" ? "कॉपी करने में विफल" : "Failed to copy card to clipboard"
        );
      }
    };

    // 9. Trigger Web Share or Download
    try {
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        try {
          await navigator.share({
            files: [file],
            title: "Maa Vindhyavasini Daily Sandesh",
          });
          console.log("[Sandesh] Shared successfully via Web Share API.");
          toast.success("Image shared successfully!");
        } catch (shareErr) {
          // If the user cancelled the share, do not display error or force download
          if (shareErr instanceof Error && shareErr.name === "AbortError") {
            console.log("[Sandesh] Share cancelled by user.");
            return;
          }
          // For other errors (like "earlier share not completed"), fallback to clipboard copy
          console.warn("[Sandesh] navigator.share failed, falling back to clipboard copy:", shareErr);
          copyCardToClipboard();
        }
      } else {
        // Fallback: Clipboard Copy
        copyCardToClipboard();
      }
    } catch (err) {
      console.error("[Sandesh] Failed to share or download image:", err);
      toast.error(
        "Failed to share or download image: " + (err instanceof Error ? err.message : String(err)),
      );
    }
  };

  const [todayIdx, setTodayIdx] = useState(0);
  useEffect(() => {
    if (sandesh.length === 0) return;
    // Select random message on initial load
    const randomIdx = Math.floor(Math.random() * sandesh.length);
    setTodayIdx(randomIdx);
  }, [sandesh.length]);

  // Update index when seed changes (for "Show another" button)
  useEffect(() => {
    if (sandesh.length === 0 || seed === 0) return;
    const randomIdx = Math.floor(Math.random() * sandesh.length);
    setTodayIdx(randomIdx);
  }, [seed, sandesh.length]);

  useEffect(() => {
    stopPlayback();
  }, [todayIdx, stopPlayback]);

  const today = sandesh[todayIdx];
  const archive = sandesh.filter((_: Sandesh, i: number) => i !== todayIdx).slice(0, 12);

  const webpageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": "https://www.namamivindhyavasini.in/sandesh#webpage",
    "url": "https://www.namamivindhyavasini.in/sandesh",
    "name": "Daily Spiritual Sandesh & Quotes | Namami Vindhyavasini Sansthan",
    "description": "Receive daily spiritual sandesh, divine quotes, and wisdom from Pujya Guru Ji. Get blessings and spiritual guidance for devotees of Maa Vindhyavasini.",
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
        "name": "Sandesh",
        "item": "https://www.namamivindhyavasini.in/sandesh"
      }
    ]
  };

  return (
    <PageShell>
      <JsonLd data={webpageSchema} />
      <JsonLd data={breadcrumbSchema} />
      <PageHero
        sanskrit={t("sandesh.sanskrit")}
        title={t("sandesh.title")}
        subtitle={t("sandesh.subtitle")}
      />

      {error ? (
        <div className="max-w-3xl mx-auto mb-6 rounded-3xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-800">
          {error}
        </div>
      ) : null}

      <section className="container mx-auto px-6 py-16">
        {today && (
          <ScrollReveal direction="up" duration={900}>
            <div className="max-w-3xl mx-auto rounded-3xl bg-gradient-sacred p-1 shadow-sacred mb-14">
              <div className="rounded-[1.4rem] bg-card p-10 md:p-14 text-center relative">
                <Quote className="mx-auto text-gold mb-4" size={32} />
                <div className={`text-xs uppercase tracking-[0.3em] text-saffron mb-3 ${dev}`}>
                  {t("sandesh.today")}
                </div>
                <p
                  className={`font-display text-2xl md:text-3xl text-maroon leading-relaxed ${dev}`}
                >
                  "{today.message}"
                </p>
                <div className={`mt-6 text-sm text-muted-foreground ${dev}`}>— {today.author}</div>
                <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
                  {isHindiText(today.message) && (
                    <button
                      onClick={() => toggleSpeak(today.message, today.id)}
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border border-gold/50 text-maroon hover:bg-gold/10 disabled:opacity-50 disabled:cursor-not-allowed transition text-sm ${dev}`}
                      disabled={loadingId !== null && loadingId !== today.id}
                      aria-label="Listen to Sandesh"
                    >
                      {loadingId === today.id ? (
                        <Loader2 size={14} className="animate-spin" />
                      ) : speakingId === today.id ? (
                        <Square size={14} />
                      ) : (
                        <Play size={14} />
                      )}
                      {loadingId === today.id
                        ? t("sandesh.loading")
                        : speakingId === today.id
                          ? t("sandesh.stop")
                          : t("sandesh.listen")}
                    </button>
                  )}
                  <button
                    onClick={() => shareSandesh(today.message, today.author)}
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border border-saffron/50 text-saffron hover:bg-saffron/10 transition text-sm ${dev}`}
                    aria-label="Share Sandesh as Image"
                  >
                    <Share2 size={14} />
                    {lang === "hi" ? "शेयर करें" : "Share Image"}
                  </button>
                  <button
                    onClick={() => setSeed((s) => s + 1)}
                    className={`inline-flex items-center gap-2 text-xs text-maroon hover:text-saffron transition ${dev}`}
                  >
                    <RefreshCw size={12} /> {t("sandesh.another")}
                  </button>
                </div>
              </div>
            </div>
          </ScrollReveal>
        )}
        {!today && (
          <div className={`max-w-3xl mx-auto text-center text-muted-foreground py-10 ${dev}`}>
            {t("sandesh.empty")}
          </div>
        )}

        {archive.length > 0 && (
          <div className="max-w-3xl mx-auto">
            <ScrollReveal direction="up" duration={800}>
              <h2 className={`font-display text-3xl text-maroon mb-6 ${dev}`}>
                {t("sandesh.more")}
              </h2>
            </ScrollReveal>
            <div className="space-y-4">
              {archive.map((s: Sandesh, idx) => (
                <ScrollReveal key={s.id} direction="up" delay={(idx % 4) * 80} duration={750}>
                  <div className="p-6 rounded-2xl bg-card border border-border hover:border-gold/50 transition">
                    <div className="text-xs uppercase tracking-[0.25em] text-saffron mb-2">
                      {formatDate(s.publish_date)}
                    </div>
                    <p className={`text-foreground/85 leading-relaxed mb-4 ${dev}`}>
                      "{s.message}"
                    </p>
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div className={`text-xs text-muted-foreground ${dev}`}>— {s.author}</div>
                      <div className="flex gap-2">
                        {isHindiText(s.message) && (
                          <button
                            onClick={() => toggleSpeak(s.message, s.id)}
                            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-gold/50 text-maroon hover:bg-gold/10 disabled:opacity-50 disabled:cursor-not-allowed transition text-xs ${dev}`}
                            disabled={loadingId !== null && loadingId !== s.id}
                            aria-label="Listen to Sandesh"
                          >
                            {loadingId === s.id ? (
                              <Loader2 size={12} className="animate-spin" />
                            ) : speakingId === s.id ? (
                              <Square size={12} />
                            ) : (
                              <Play size={12} />
                            )}
                            {loadingId === s.id
                              ? t("sandesh.loading")
                              : speakingId === s.id
                                ? t("sandesh.stop")
                                : t("sandesh.listen")}
                          </button>
                        )}
                        <button
                          onClick={() => shareSandesh(s.message, s.author)}
                          className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-saffron/50 text-saffron hover:bg-saffron/10 transition text-xs ${dev}`}
                          aria-label="Share Sandesh as Image"
                        >
                          <Share2 size={12} />
                          {lang === "hi" ? "शेयर" : "Share"}
                        </button>
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        )}
      </section>
    </PageShell>
  );
}
