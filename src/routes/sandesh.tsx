import { createFileRoute } from "@tanstack/react-router";
import { PageShell, PageHero } from "@/components/PageShell";
import { Quote, RefreshCw, Loader2, Play, Square, Share2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { useCallback, useEffect, useState } from "react";
import { useLang } from "@/i18n/LangProvider";
import { speakText, stopSpeech } from "@/lib/speech";

type Sandesh = Tables<"sandesh">;

export const Route = createFileRoute("/sandesh")({
  head: () => ({
    meta: [
      { title: "Sandesh — Daily Spiritual Message" },
      { name: "description", content: "Daily spiritual sandesh and quotes — wisdom and blessings for devotees of Maa Vindhyavasini." },
      { property: "og:title", content: "Sandesh — Daily Message" },
      { property: "og:description", content: "Daily spiritual wisdom from Pujya Guru Ji." },
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
      <div className="container mx-auto px-6 py-10 text-center text-muted-foreground">{error.message}</div>
    </PageShell>
  ),
  notFoundComponent: () => (
    <PageShell><PageHero title="Not found" /></PageShell>
  ),
  component: SandeshPage,
});

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
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

    // 1. Draw traditional gradient background
    const bgGrad = ctx.createRadialGradient(540, 960, 100, 540, 960, 1100);
    bgGrad.addColorStop(0, "#FFFDF9");
    bgGrad.addColorStop(1, "#FFF6E5");
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 1080, 1920);

    // 2. Draw golden/saffron double border
    ctx.strokeStyle = "#D9381E"; // Red border
    ctx.lineWidth = 12;
    ctx.strokeRect(30, 30, 1020, 1860);

    ctx.strokeStyle = "#D6A232"; // Gold border
    ctx.lineWidth = 4;
    ctx.strokeRect(50, 50, 980, 1820);

    // 3. Draw faint diagonal watermarks
    ctx.save();
    ctx.fillStyle = "rgba(214, 162, 50, 0.045)"; // Soft, low-opacity gold
    ctx.font = "italic bold 32px sans-serif";
    ctx.textAlign = "center";
    ctx.translate(540, 960);
    ctx.rotate(-25 * Math.PI / 180);
    const watermarkText = "namamivindhyavasini.in";
    const stepX = 420;
    const stepY = 160;
    for (let x = -1500; x < 1500; x += stepX) {
      for (let y = -1500; y < 1500; y += stepY) {
        ctx.fillText(watermarkText, x, y);
      }
    }
    ctx.restore();

    // 4. Draw traditional quarter-mandala corner elements
    const drawMandalaCorners = () => {
      const corners = [
        { x: 50, y: 50, startAngle: 0, endAngle: Math.PI / 2, dx: 1, dy: 1 },
        { x: 1030, y: 50, startAngle: Math.PI / 2, endAngle: Math.PI, dx: -1, dy: 1 },
        { x: 50, y: 1870, startAngle: 1.5 * Math.PI, endAngle: 2 * Math.PI, dx: 1, dy: -1 },
        { x: 1030, y: 1870, startAngle: Math.PI, endAngle: 1.5 * Math.PI, dx: -1, dy: -1 },
      ];
      
      corners.forEach((c) => {
        ctx.save();
        ctx.translate(c.x, c.y);
        
        // Draw gold concentric quarter arcs
        ctx.strokeStyle = "rgba(214, 162, 50, 0.5)"; // Gold
        ctx.lineWidth = 3;
        
        for (let r = 30; r <= 150; r += 30) {
          ctx.beginPath();
          ctx.arc(0, 0, r, c.startAngle, c.endAngle);
          ctx.stroke();
        }
        
        // Draw red radial petal loops pointing inward
        ctx.strokeStyle = "rgba(217, 56, 30, 0.6)"; // Red
        ctx.lineWidth = 2.5;
        const steps = 6;
        const angleDiff = c.endAngle - c.startAngle;
        
        for (let i = 0; i <= steps; i++) {
          const angle = c.startAngle + (angleDiff * (i / steps));
          const cos = Math.cos(angle);
          const sin = Math.sin(angle);
          
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.quadraticCurveTo(cos * 50, sin * 50, cos * 70, sin * 70);
          ctx.quadraticCurveTo(cos * 90, sin * 90, cos * 100, sin * 100);
          ctx.stroke();
          
          // Small dot at the end
          ctx.fillStyle = "#D6A232";
          ctx.beginPath();
          ctx.arc(cos * 100, sin * 100, 5, 0, Math.PI * 2);
          ctx.fill();
        }
        
        // Draw diagonal corner line accent
        ctx.strokeStyle = "#D9381E";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(c.dx * 120, 0);
        ctx.lineTo(0, c.dy * 120);
        ctx.stroke();
        
        ctx.restore();
      });
    };
    drawMandalaCorners();

    // 5. Draw Header Box
    const headGrad = ctx.createLinearGradient(140, 0, 940, 0);
    headGrad.addColorStop(0, "#D9381E");
    headGrad.addColorStop(1, "#FF5E36");
    ctx.fillStyle = headGrad;
    ctx.beginPath();
    ctx.roundRect(140, 160, 800, 120, 60);
    ctx.fill();
    
    // Header golden outline
    ctx.strokeStyle = "#D6A232";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.roundRect(145, 165, 790, 110, 55);
    ctx.stroke();

    // Header Text
    ctx.fillStyle = "#FFFDF6";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = "bold 44px Georgia, serif";
    ctx.fillText("॥ दैनिक संदेश ॥", 540, 220);

    // 6. Draw the Quotation Mark Icon
    ctx.fillStyle = "rgba(214, 162, 50, 0.09)"; // Subtle gold
    ctx.font = "bold 400px Georgia, serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("“", 540, 820);

    // 7. Draw Wrapped Quote Text
    ctx.fillStyle = "#5E1914"; // Dark brown
    ctx.textAlign = "center";
    
    // Dynamically adjust font size based on text length to prevent overflow
    let fontSize = 52;
    if (message.length > 300) {
      fontSize = 38;
    } else if (message.length > 150) {
      fontSize = 44;
    }
    
    const lineHeight = fontSize * 1.5;
    ctx.font = `bold ${fontSize}px Georgia, serif`;
    
    const maxTextWidth = 840;
    const words = message.split(" ");
    let line = "";
    const lines: string[] = [];
    
    for (let n = 0; n < words.length; n++) {
      let testLine = line + words[n] + " ";
      let metrics = ctx.measureText(testLine);
      let testWidth = metrics.width;
      if (testWidth > maxTextWidth && n > 0) {
        lines.push(line.trim());
        line = words[n] + " ";
      } else {
        line = testLine;
      }
    }
    lines.push(line.trim());

    const totalTextHeight = lines.length * lineHeight;
    const startY = 900 - (totalTextHeight / 2);
    
    ctx.textBaseline = "top";
    lines.forEach((l, idx) => {
      ctx.fillText(l, 540, startY + idx * lineHeight);
    });

    // 8. Draw Bottom Footer Block (Red button capsule)
    ctx.fillStyle = "#D9381E";
    ctx.beginPath();
    ctx.roundRect(240, 1560, 600, 80, 40);
    ctx.fill();

    ctx.fillStyle = "#FFFDF6";
    ctx.font = "bold 28px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("namamivindhyavasini.in", 540, 1600);

    // 9. Draw Author Name (below the red button)
    ctx.fillStyle = "#D9381E";
    ctx.font = "italic 38px Georgia, serif";
    ctx.textBaseline = "top";
    ctx.fillText(`— ${author}`, 540, 1680);

    // 10. Trigger Web Share or Download
    try {
      const dataUrl = canvas.toDataURL("image/png");
      const blob = await (await fetch(dataUrl)).blob();
      const file = new File([blob], `sandesh_${new Date().toISOString().split("T")[0]}.png`, { type: "image/png" });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: "Maa Vindhyavasini Daily Sandesh"
        });
        console.log("[Sandesh] Shared successfully via Web Share API.");
      } else {
        // Fallback: Direct Download
        const link = document.createElement("a");
        link.download = `sandesh_${new Date().toISOString().split("T")[0]}.png`;
        link.href = dataUrl;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        console.log("[Sandesh] Download triggered as fallback.");
      }
    } catch (err) {
      console.error("[Sandesh] Failed to share or download image:", err);
    }
  };

  const [todayIdx, setTodayIdx] = useState(0);
  useEffect(() => {
    if (sandesh.length === 0) return;
    const day = Math.floor(Date.now() / 86400000);
    setTodayIdx((day + seed) % sandesh.length);
  }, [sandesh.length, seed]);

  useEffect(() => {
    stopPlayback();
  }, [todayIdx, stopPlayback]);

  const today = sandesh[todayIdx];
  const archive = sandesh.filter((_: Sandesh, i: number) => i !== todayIdx).slice(0, 12);

  return (
    <PageShell>
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
          <div className="max-w-3xl mx-auto rounded-3xl bg-gradient-sacred p-1 shadow-sacred mb-14">
            <div className="rounded-[1.4rem] bg-card p-10 md:p-14 text-center relative">
              <Quote className="mx-auto text-gold mb-4" size={32} />
              <div className={`text-xs uppercase tracking-[0.3em] text-saffron mb-3 ${dev}`}>{t("sandesh.today")}</div>
              <p className={`font-display text-2xl md:text-3xl text-maroon leading-relaxed ${dev}`}>
                "{today.message}"
              </p>
              <div className={`mt-6 text-sm text-muted-foreground ${dev}`}>— {today.author}</div>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
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
        )}
        {!today && (
          <div className={`max-w-3xl mx-auto text-center text-muted-foreground py-10 ${dev}`}>
            {t("sandesh.empty")}
          </div>
        )}

        {archive.length > 0 && (
          <div className="max-w-3xl mx-auto">
            <h2 className={`font-display text-3xl text-maroon mb-6 ${dev}`}>{t("sandesh.more")}</h2>
            <div className="space-y-4">
              {archive.map((s: Sandesh) => (
                <div key={s.id} className="p-6 rounded-2xl bg-card border border-border hover:border-gold/50 transition">
                  <div className="text-xs uppercase tracking-[0.25em] text-saffron mb-2">{formatDate(s.publish_date)}</div>
                  <p className={`text-foreground/85 leading-relaxed mb-4 ${dev}`}>"{s.message}"</p>
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className={`text-xs text-muted-foreground ${dev}`}>— {s.author}</div>
                    <div className="flex gap-2">
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
              ))}
            </div>
          </div>
        )}
      </section>
    </PageShell>
  );
}
