import { createFileRoute } from "@tanstack/react-router";
import { PageShell, PageHero } from "@/components/PageShell";
import { useState, useEffect, useRef, useCallback } from "react";
import { useLang } from "@/i18n/LangProvider";
import { speakText, stopSpeech } from "@/lib/speech";
import {
  MapPin,
  Volume2,
  VolumeX,
  Play,
  ArrowRight,
  ArrowLeft,
  Award,
  Sparkles,
  RefreshCw,
  Waves,
  Compass,
  Bell,
  Heart,
  Download,
  Info
} from "lucide-react";

import vindhyavasiniImg from "@/assets/maa-vindhyavasini.png";
import kaliKohImg from "@/assets/kali-koh.jpg";
import ashtabhujaImg from "@/assets/asht-bhuja.jpg";
import gangaGhatImg from "@/assets/gallery-1.png";

export const Route = createFileRoute("/parikrama")({
  head: () => ({
    meta: [
      { title: "Trikona Parikrama — Sacred Pilgrim Guide" },
      { name: "description", content: "Experience the sacred triangular pilgrimage of Vindhyachal Dham. Perform virtual rituals and receive your completion blessing certificate." },
      { property: "og:title", content: "Trikona Parikrama — Vindhyachal Dham" },
      { property: "og:description", content: "Start your virtual spiritual journey of Vindhyachal Trikona Parikrama." },
    ],
  }),
  component: ParikramaPage,
});

// Synthesized Audio Effects using Web Audio API
const playBellSound = () => {
  try {
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc1 = audioCtx.createOscillator();
    const osc2 = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    osc1.type = "sine";
    osc1.frequency.setValueAtTime(987.77, audioCtx.currentTime); // B5 note - bright bell clang
    osc1.frequency.exponentialRampToValueAtTime(246.94, audioCtx.currentTime + 1.8); // B3 decay

    osc2.type = "sine";
    osc2.frequency.setValueAtTime(493.88, audioCtx.currentTime); // B4 note - resonance
    osc2.frequency.exponentialRampToValueAtTime(123.47, audioCtx.currentTime + 2.5);

    gainNode.gain.setValueAtTime(0.4, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 2.5);

    osc1.connect(gainNode);
    osc2.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    osc1.start();
    osc2.start();
    osc1.stop(audioCtx.currentTime + 2.6);
    osc2.stop(audioCtx.currentTime + 2.6);
  } catch (e) {
    console.warn("AudioContext bell failed:", e);
  }
};

const playSplashSound = () => {
  try {
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    osc.type = "triangle";
    osc.frequency.setValueAtTime(120, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(450, audioCtx.currentTime + 0.3);
    osc.frequency.exponentialRampToValueAtTime(80, audioCtx.currentTime + 0.7);

    gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.5, audioCtx.currentTime + 0.15);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.7);

    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + 0.8);
  } catch (e) {
    console.warn("AudioContext splash failed:", e);
  }
};

const playChimeSound = () => {
  try {
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const now = audioCtx.currentTime;
    const frequencies = [587.33, 659.25, 783.99, 880.00, 1174.66]; // D5, E5, G5, A5, D6 arpeggio

    frequencies.forEach((f, idx) => {
      const osc = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(f, now + idx * 0.08);

      gainNode.gain.setValueAtTime(0, now);
      gainNode.gain.linearRampToValueAtTime(0.15, now + idx * 0.08 + 0.04);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 1.2);

      osc.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      osc.start(now + idx * 0.08);
      osc.stop(now + idx * 0.08 + 1.3);
    });
  } catch (e) {
    console.warn("AudioContext chime failed:", e);
  }
};

interface Particle {
  x: number;
  y: number;
  r: number;
  color: string;
  speedX: number;
  speedY: number;
  rot: number;
  rotSpeed: number;
  opacity: number;
}

function ParikramaPage() {
  const { t, lang } = useLang();
  const dev = lang === "hi" ? "font-devanagari" : "";

  // Tour State: null = map view, 0 = Ganga Snan, 1 = Vindhyavasini, 2 = Kali Khoh, 3 = Ashtabhuja, 4 = Certificate
  const [activeStep, setActiveStep] = useState<number | null>(null);
  const [selectedMapNode, setSelectedMapNode] = useState<number | null>(null);

  // Ritual completion states
  const [ritualGangaDone, setRitualGangaDone] = useState(false);
  const [ritualBellRung, setRitualBellRung] = useState(false);
  const [ritualFlowersOffered, setRitualFlowersOffered] = useState(false);
  const [ritualKaliFlowerOffered, setRitualKaliFlowerOffered] = useState(false);
  const [ritualThreadTied, setRitualThreadTied] = useState(false);

  // Audio guide state
  const [speakingStep, setSpeakingStep] = useState<number | null>(null);

  // Bell shaking state
  const [isBellShaking, setIsBellShaking] = useState(false);

  // Particle shower state
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [particles, setParticles] = useState<Particle[]>([]);

  // Certificate completion details
  const [devoteeName, setDevoteeName] = useState("");
  const [certGenerated, setCertGenerated] = useState(false);
  const certCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Stop narration on unmount or step change
  useEffect(() => {
    return () => {
      stopSpeech();
    };
  }, [activeStep]);

  // Audio Guide Toggle
  const toggleNarration = useCallback((stepIdx: number, text: string) => {
    if (speakingStep === stepIdx) {
      stopSpeech();
      setSpeakingStep(null);
    } else {
      stopSpeech();
      setSpeakingStep(stepIdx);
      speakText(text, {
        onEnd: () => setSpeakingStep(null),
        onError: () => setSpeakingStep(null),
      });
    }
  }, [speakingStep]);

  // Spawning falling flowers (Particles)
  const spawnFlowerShower = useCallback(() => {
    const newParticles: Particle[] = [];
    const colors = ["#FF5E36", "#D9381E", "#D6A232", "#FFC55A", "#FF6B8B"];
    for (let i = 0; i < 40; i++) {
      newParticles.push({
        x: Math.random() * (canvasRef.current?.width || 800),
        y: -10 - Math.random() * 50,
        r: 6 + Math.random() * 8,
        color: colors[Math.floor(Math.random() * colors.length)],
        speedX: -1.5 + Math.random() * 3,
        speedY: 2 + Math.random() * 3,
        rot: Math.random() * 360,
        rotSpeed: -2 + Math.random() * 4,
        opacity: 0.8 + Math.random() * 0.2,
      });
    }
    setParticles((prev) => [...prev, ...newParticles]);
  }, []);

  // Animate Particles
  useEffect(() => {
    let animationId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const update = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      setParticles((prev) => {
        const next: Particle[] = [];
        prev.forEach((p) => {
          const updated = {
            ...p,
            x: p.x + p.speedX,
            y: p.y + p.speedY,
            rot: p.rot + p.rotSpeed,
            opacity: p.opacity - 0.005,
          };
          if (updated.y < canvas.height && updated.opacity > 0) {
            // Draw particle as a floral petal shape
            ctx.save();
            ctx.translate(updated.x, updated.y);
            ctx.rotate((updated.rot * Math.PI) / 180);
            ctx.fillStyle = updated.color;
            ctx.globalAlpha = updated.opacity;
            ctx.beginPath();
            // Traditional petal shape (teardrop/oval)
            ctx.ellipse(0, 0, updated.r, updated.r * 0.6, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
            next.push(updated);
          }
        });
        return next;
      });
      animationId = requestAnimationFrame(update);
    };

    animationId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(animationId);
  }, [particles]);

  // Adjust canvas size
  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        canvasRef.current.width = canvasRef.current.parentElement?.clientWidth || 800;
        canvasRef.current.height = canvasRef.current.parentElement?.clientHeight || 500;
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [activeStep]);

  // Step Data Configurations
  const stages = [
    {
      id: 0,
      titleKey: "parikrama.stage0.title" as const,
      subKey: "parikrama.stage0.subtitle" as const,
      textKey: "parikrama.stage0.text" as const,
      image: gangaGhatImg,
      audioText: lang === "hi" 
        ? "प्रथम चरण: गंगा स्नान। हम अपनी त्रिकोण परिक्रमा की शुरुआत पतित पावनि गंगा नदी में पवित्र स्नान के साथ करते हैं। अनुभव करें कि यह दिव्य जल आपके तन और मन को पवित्र कर रहा है। बोलें, ॐ नमो गंगायै विश्वरूपिण्यै नारायण्यै नमो नमः।"
        : "Stage 1: Ganga Snan. We begin our Trikona Parikrama by taking a holy dip in the sacred River Ganges. Feel the pure waters purify your body and soul. Chant, Om Namo Gangayei Vishwarupinyei Narayanyei Namo Namah."
    },
    {
      id: 1,
      titleKey: "parikrama.stage1.title" as const,
      subKey: "parikrama.stage1.subtitle" as const,
      textKey: "parikrama.stage1.text" as const,
      image: vindhyavasiniImg,
      audioText: lang === "hi"
        ? "द्वितीय चरण: माँ विन्ध्यवासिनी मंदिर। अब, मुख्य मंदिर माँ विन्ध्यवासिनी के चरणों में पधारें, जो गंगा तट पर महालक्ष्मी के रूप में विराजमान हैं। मंदिर का घंटा बजायें और माँ को लाल पुष्प अर्पित करें। वे यशोदा की वही योगमाया पुत्री हैं, जिन्होंने कंस के विनाश की घोषणा की थी।"
        : "Stage 2: Maa Vindhyavasini Mandir. Now, arrive at the main temple of Maa Vindhyavasini, who sits on the banks of Ganga as Maha Lakshmi. Ring the bell and offer red flowers to the Mother. She is the Yogmaya child of Yashoda, who declared the doom of demon Kansa."
    },
    {
      id: 2,
      titleKey: "parikrama.stage2.title" as const,
      subKey: "parikrama.stage2.subtitle" as const,
      textKey: "parikrama.stage2.text" as const,
      image: kaliKohImg,
      audioText: lang === "hi"
        ? "तृतीय चरण: काली खोह मंदिर। विन्ध्य की तलहटी में स्थित महाकाली की गुफा काली खोह की ओर बढ़ें। यहाँ चामुण्डा देवी विराजमान हैं, जिन्होंने चण्ड और मुण्ड का संहार किया था। मौन होकर प्रणाम करें और अपनी भक्ति अर्पित करें।"
        : "Stage 3: Kali Khoh Cave Temple. Proceed to Kali Khoh, the cave temple of Maha Kali, nestled in the Vindhya foothills. It is here that Chamunda Devi resides, having destroyed the demons Chanda and Munda. Bow down in silence and offer your devotion."
    },
    {
      id: 3,
      titleKey: "parikrama.stage3.title" as const,
      subKey: "parikrama.stage3.subtitle" as const,
      textKey: "parikrama.stage3.text" as const,
      image: ashtabhujaImg,
      audioText: lang === "hi"
        ? "चतुर्थ चरण: माँ अष्टभुजा मंदिर। पहाड़ी पर स्थित अष्टभुजा देवी मंदिर की ओर प्रस्थान करें, जो महासरस्वती को समर्पित है। वे अष्टभुज धारिणी देवी हैं जो इस पवित्र क्षेत्र की रक्षा करती हैं। यहाँ वृक्ष पर लाल रक्षा सूत्र बाँधें, और अपना आध्यात्मिक संकल्प लें।"
        : "Stage 4: Maa Ashtabhuja Temple. Climb up to Ashtabhuja temple on the hill, dedicated to Maha Saraswati. She is the eighth-armed goddess who guards the holy region. Tie a sacred red thread on the tree, and make your spiritual vow."
    }
  ];

  // Draw Completion Certificate
  const generateCertificate = useCallback(() => {
    if (!devoteeName.trim()) return;
    setCertGenerated(true);

    // Wait for canvas element to mount
    setTimeout(() => {
      const canvas = certCanvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Reset
      ctx.clearRect(0, 0, 1200, 850);

      // 1. Parchment Background
      const grad = ctx.createLinearGradient(0, 0, 1200, 850);
      grad.addColorStop(0, "#FFFDF6");
      grad.addColorStop(0.5, "#FFF9E6");
      grad.addColorStop(1, "#FFF2D1");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 1200, 850);

      // Faded background mandala
      ctx.save();
      ctx.translate(600, 425);
      ctx.strokeStyle = "rgba(214, 162, 50, 0.05)";
      ctx.lineWidth = 3;
      for (let i = 0; i < 36; i++) {
        ctx.rotate((10 * Math.PI) / 180);
        ctx.strokeRect(-160, -160, 320, 320);
        ctx.beginPath();
        ctx.arc(0, 0, 220, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.restore();

      // 2. Double Borders (Saffron and Gold)
      ctx.strokeStyle = "#D9381E"; // Red border
      ctx.lineWidth = 14;
      ctx.strokeRect(30, 30, 1140, 790);

      ctx.strokeStyle = "#D6A232"; // Gold border
      ctx.lineWidth = 4;
      ctx.strokeRect(50, 50, 1100, 750);

      // Corner Accents
      const drawCornerAccent = (x: number, y: number, r: number) => {
        ctx.fillStyle = "#D9381E";
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "#D6A232";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(x, y, r + 6, 0, Math.PI * 2);
        ctx.stroke();
      };
      drawCornerAccent(50, 50, 12);
      drawCornerAccent(1150, 50, 12);
      drawCornerAccent(50, 800, 12);
      drawCornerAccent(1150, 800, 12);

      // 3. Sanskrit Header
      ctx.fillStyle = "#D9381E";
      ctx.textAlign = "center";
      ctx.font = "bold 32px Georgia, serif";
      ctx.fillText("॥ श्री विन्ध्यवासिन्यै नमः ॥", 600, 115);

      // 4. Sansthan title
      ctx.fillStyle = "#5E1914";
      ctx.font = "bold 44px sans-serif";
      ctx.fillText("नमामि विन्ध्यवासिनी संस्थान", 600, 185);

      ctx.fillStyle = "#D6A232";
      ctx.font = "italic 20px Georgia, serif";
      ctx.fillText("Vindhyachal Dham, Mirzapur, Uttar Pradesh", 600, 225);

      // Divider line
      ctx.strokeStyle = "rgba(214, 162, 50, 0.4)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(350, 260);
      ctx.lineTo(850, 260);
      ctx.stroke();

      // Certificate Title
      ctx.fillStyle = "#D9381E";
      ctx.font = "bold 36px Georgia, serif";
      ctx.fillText("त्रिकोण परिक्रमा प्रमाणपत्र", 600, 320);

      ctx.fillStyle = "#5E1914";
      ctx.font = "24px Georgia, serif";
      ctx.fillText("This is to certify that / यह प्रमाणित किया जाता है कि", 600, 385);

      // Devotee Name (Large & Elegant)
      ctx.fillStyle = "#D9381E";
      ctx.font = "italic bold 48px Georgia, serif";
      ctx.fillText(devoteeName, 600, 460);

      // Divider under name
      ctx.strokeStyle = "#D9381E";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(400, 485);
      ctx.lineTo(800, 485);
      ctx.stroke();

      // Body Text
      ctx.fillStyle = "#5E1914";
      ctx.font = "22px sans-serif";
      const descLine1 = "has successfully completed the sacred Trikona Parikrama of Vindhyachal Dham.";
      const descLine2 = "ने विन्ध्याचल धाम की पावन त्रिकोण परिक्रमा (गंगा स्नान, महालक्ष्मी, महाकाली, महासरस्वती) पूर्ण कर ली है।";
      ctx.fillText(descLine1, 600, 535);
      ctx.fillText(descLine2, 600, 575);

      // Blessing
      ctx.fillStyle = "#D6A232";
      ctx.font = "bold italic 22px Georgia, serif";
      ctx.fillText("“महालक्ष्मी, महाकाली एवं महासरस्वती का दिव्य आशीर्वाद सदैव आपके साथ बना रहे।”", 600, 640);

      // Footer Date & Signature
      const today = new Date().toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric"
      });
      ctx.fillStyle = "#7F6D50";
      ctx.font = "18px sans-serif";
      ctx.textAlign = "left";
      ctx.fillText(`Date: ${today}`, 100, 730);

      ctx.textAlign = "right";
      ctx.fillText("आशीर्वाद स्वरूप: पूज्य गुरु जी", 1100, 730);

      // Seal Accent (Gold)
      ctx.save();
      ctx.translate(600, 740);
      ctx.fillStyle = "rgba(214, 162, 50, 0.9)";
      ctx.beginPath();
      for (let i = 0; i < 20; i++) {
        ctx.rotate(Math.PI / 10);
        ctx.lineTo(0, 32);
        ctx.lineTo(0, 38);
      }
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = "#D9381E";
      ctx.font = "bold 14px sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("पारित", 0, 0);
      ctx.restore();

    }, 100);
  }, [devoteeName]);

  // Download Certificate Image
  const downloadCertificate = () => {
    const canvas = certCanvasRef.current;
    if (!canvas) return;
    try {
      const dataUrl = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.download = `Trikona_Parikrama_Certificate_${devoteeName.replace(/\s+/g, "_")}.png`;
      link.href = dataUrl;
      link.click();
    } catch (e) {
      console.error("Failed to download certificate image:", e);
    }
  };

  return (
    <PageShell>
      <PageHero
        title={t("parikrama.title")}
        subtitle={t("parikrama.subtitle")}
        sanskrit={t("parikrama.sanskrit")}
      />

      <div className="container mx-auto px-6 py-10 relative">
        {/* Flower shower overlay canvas */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 pointer-events-none z-40"
        />

        {activeStep === null ? (
          /* MAP VIEW */
          <div className="grid lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2 rounded-3xl bg-card border border-gold/30 shadow-sacred p-6">
              <h3 className={`font-display text-2xl text-maroon mb-2 flex items-center gap-2 ${dev}`}>
                <Compass className="text-saffron" size={24} />
                {t("parikrama.map.title")}
              </h3>
              <p className="text-sm text-muted-foreground mb-6">{t("parikrama.map.info")}</p>

              {/* Interactive SVG Pilgrim Map */}
              <div className="relative aspect-[16/10] bg-cream/20 rounded-2xl border border-gold/15 overflow-hidden shadow-inner">
                {/* Visual grid lines for style */}
                <div className="absolute inset-0 grid grid-cols-12 grid-rows-10 gap-0 opacity-5 pointer-events-none">
                  {Array.from({ length: 120 }).map((_, idx) => (
                    <div key={idx} className="border border-maroon" />
                  ))}
                </div>

                <svg viewBox="0 0 800 500" className="w-full h-full select-none">
                  {/* Ganges River flowing across the top */}
                  <path
                    d="M -50,50 Q 200,80 400,60 T 850,70 L 850,-10 L -50,-10 Z"
                    fill="rgba(59, 130, 246, 0.15)"
                    stroke="rgba(59, 130, 246, 0.4)"
                    strokeWidth="3"
                  />
                  {/* Wavy lines inside River Ganga */}
                  <path
                    d="M -50,30 Q 150,50 350,30 T 850,45"
                    fill="none"
                    stroke="rgba(59, 130, 246, 0.25)"
                    strokeWidth="2"
                  />
                  <text x="350" y="32" className="fill-blue-500/60 font-serif italic text-xs tracking-widest font-semibold">
                    RIVER GANGES / पवित्र गंगा
                  </text>

                  {/* Triangular Pilgrim Connection Path */}
                  <g>
                    {/* Path 1: Ganga Ghat to Vindhyavasini */}
                    <line
                      x1="400" y1="120" x2="220" y2="200"
                      stroke="#D6A232" strokeWidth="3" strokeDasharray="6 4"
                      className="animate-pulse"
                    />
                    {/* Path 2: Vindhyavasini to Kali Khoh */}
                    <line
                      x1="220" y1="200" x2="400" y2="400"
                      stroke="#D6A232" strokeWidth="3" strokeDasharray="6 4"
                    />
                    {/* Path 3: Kali Khoh to Ashtabhuja */}
                    <line
                      x1="400" y1="400" x2="580" y2="200"
                      stroke="#D6A232" strokeWidth="3" strokeDasharray="6 4"
                    />
                    {/* Path 4: Ashtabhuja back to Ganga Ghat */}
                    <line
                      x1="580" y1="200" x2="400" y2="120"
                      stroke="#D6A232" strokeWidth="3" strokeDasharray="6 4"
                    />

                    {/* Arrowheads/Indicators on Paths */}
                    <polygon points="310,160 300,150 298,162" fill="#D6A232" />
                    <polygon points="310,300 316,290 305,293" fill="#D6A232" />
                    <polygon points="490,300 495,293 484,290" fill="#D6A232" />
                    <polygon points="490,160 502,162 500,150" fill="#D6A232" />
                  </g>

                  {/* Map Node Pins */}

                  {/* Node 0: Ganga Snan / Ram Gaya Ghat */}
                  <g
                    className="cursor-pointer group"
                    onClick={() => {
                      setSelectedMapNode(0);
                      playSplashSound();
                    }}
                  >
                    <circle cx="400" cy="120" r="16" fill="#D9381E" className="opacity-25 animate-ping" />
                    <circle cx="400" cy="120" r="12" fill={selectedMapNode === 0 ? "#FF5E36" : "#D9381E"} className="stroke-gold stroke-2 transition-all duration-300" />
                    <text x="400" y="124" textAnchor="middle" fill="#FFFDF6" className="font-bold text-xs">1</text>
                    <text x="400" y="95" textAnchor="middle" className={`fill-maroon font-semibold text-xs transition-colors duration-300 ${selectedMapNode === 0 ? "fill-saffron" : ""}`}>
                      {lang === "hi" ? "गंगा घाट" : "Ganga Snan"}
                    </text>
                  </g>

                  {/* Node 1: Vindhyavasini Mandir */}
                  <g
                    className="cursor-pointer group"
                    onClick={() => {
                      setSelectedMapNode(1);
                      playBellSound();
                    }}
                  >
                    <circle cx="220" cy="200" r="16" fill="#D9381E" className="opacity-25 animate-ping" />
                    <circle cx="220" cy="200" r="12" fill={selectedMapNode === 1 ? "#FF5E36" : "#D9381E"} className="stroke-gold stroke-2 transition-all" />
                    <text x="220" y="204" textAnchor="middle" fill="#FFFDF6" className="font-bold text-xs">2</text>
                    <text x="220" y="175" textAnchor="middle" className={`fill-maroon font-semibold text-xs ${selectedMapNode === 1 ? "fill-saffron" : ""}`}>
                      {lang === "hi" ? "विन्ध्यवासिनी" : "Maa Vindhyavasini"}
                    </text>
                  </g>

                  {/* Node 2: Kali Khoh Cave */}
                  <g
                    className="cursor-pointer group"
                    onClick={() => {
                      setSelectedMapNode(2);
                      playBellSound();
                    }}
                  >
                    <circle cx="400" cy="400" r="16" fill="#D9381E" className="opacity-25 animate-ping" />
                    <circle cx="400" cy="400" r="12" fill={selectedMapNode === 2 ? "#FF5E36" : "#D9381E"} className="stroke-gold stroke-2 transition-all" />
                    <text x="400" y="404" textAnchor="middle" fill="#FFFDF6" className="font-bold text-xs">3</text>
                    <text x="400" y="430" textAnchor="middle" className={`fill-maroon font-semibold text-xs ${selectedMapNode === 2 ? "fill-saffron" : ""}`}>
                      {lang === "hi" ? "काली खोह" : "Kali Khoh"}
                    </text>
                  </g>

                  {/* Node 3: Ashtabhuja Mandir */}
                  <g
                    className="cursor-pointer group"
                    onClick={() => {
                      setSelectedMapNode(3);
                      playBellSound();
                    }}
                  >
                    <circle cx="580" cy="200" r="16" fill="#D9381E" className="opacity-25 animate-ping" />
                    <circle cx="580" cy="200" r="12" fill={selectedMapNode === 3 ? "#FF5E36" : "#D9381E"} className="stroke-gold stroke-2 transition-all" />
                    <text x="580" y="204" textAnchor="middle" fill="#FFFDF6" className="font-bold text-xs">4</text>
                    <text x="580" y="175" textAnchor="middle" className={`fill-maroon font-semibold text-xs ${selectedMapNode === 3 ? "fill-saffron" : ""}`}>
                      {lang === "hi" ? "अष्टभुजा" : "Ashtabhuja Devi"}
                    </text>
                  </g>
                </svg>

                {/* Legend overlay */}
                <div className="absolute bottom-4 left-4 right-4 bg-background/95 backdrop-blur border border-gold/25 rounded-xl p-3 flex gap-4 text-xs shadow-md">
                  <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-blue-400 opacity-70" /> {lang === "hi" ? "पवित्र गंगा" : "River Ganges"}</div>
                  <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-gold border border-maroon" /> {lang === "hi" ? "त्रिकोण मार्ग" : "Trikona Route (12 km)"}</div>
                  <div className="flex items-center gap-1.5"><Info size={14} className="text-saffron shrink-0" /> {lang === "hi" ? "परिक्रमा क्रम: १ → २ → ३ → ४" : "Pilgrim order: 1 → 2 → 3 → 4"}</div>
                </div>
              </div>
            </div>

            {/* SIDE INFO CARD (MAP DETAIL) */}
            <div className="rounded-3xl bg-card border border-gold/30 shadow-sacred p-6 flex flex-col justify-between h-full min-h-[450px]">
              {selectedMapNode !== null ? (
                <div>
                  <div className="relative h-44 rounded-2xl overflow-hidden border border-gold/20 mb-4">
                    <img
                      src={stages[selectedMapNode].image}
                      alt={t(stages[selectedMapNode].titleKey)}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-overlay" />
                    <div className="absolute bottom-3 left-3 bg-gradient-sacred text-cream text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded border border-gold/40">
                      {lang === "hi" ? `स्थान ${selectedMapNode + 1}` : `Location ${selectedMapNode + 1}`}
                    </div>
                  </div>

                  <div className="mb-4">
                    <span className="text-xs uppercase tracking-widest text-saffron font-bold">
                      {t(stages[selectedMapNode].subKey)}
                    </span>
                    <h4 className={`font-display text-xl text-maroon mt-0.5 ${dev}`}>
                      {t(stages[selectedMapNode].titleKey)}
                    </h4>
                    <p className={`text-sm text-foreground/80 leading-relaxed mt-2 ${dev}`}>
                      {t(stages[selectedMapNode].textKey)}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-6 border-2 border-dashed border-gold/25 rounded-2xl bg-cream/10">
                  <Compass className="text-gold/40 w-16 h-16 animate-spin-slow mb-4" />
                  <h4 className={`font-display text-lg text-maroon ${dev}`}>
                    {lang === "hi" ? "त्रिकोण मार्ग का अन्वेषण करें" : "Explore the Trikona Route"}
                  </h4>
                  <p className="text-xs text-muted-foreground mt-1 max-w-[200px]">
                    {lang === "hi" ? "मानचित्र पर किसी भी तीर्थ स्थल को चुनें" : "Tap on any pilgrim spot on the map to begin exploration"}
                  </p>
                </div>
              )}

              <div className="mt-6 border-t border-gold/10 pt-4 flex flex-col gap-3">
                {selectedMapNode !== null && (
                  <button
                    onClick={() => toggleNarration(selectedMapNode, stages[selectedMapNode].audioText)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-saffron/40 text-saffron font-medium text-sm hover:bg-saffron/10 transition"
                  >
                    {speakingStep === selectedMapNode ? (
                      <>
                        <VolumeX size={16} />
                        {t("parikrama.stop")}
                      </>
                    ) : (
                      <>
                        <Volume2 size={16} />
                        {t("parikrama.listen")}
                      </>
                    )}
                  </button>
                )}

                <button
                  onClick={() => {
                    stopSpeech();
                    setSpeakingStep(null);
                    setActiveStep(0);
                  }}
                  className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-sacred text-cream font-medium shadow-gold hover:opacity-95 transition"
                >
                  {t("parikrama.start")} <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </div>
        ) : activeStep >= 0 && activeStep <= 3 ? (
          /* STEP GUIDED TOUR */
          <div className="max-w-4xl mx-auto rounded-3xl bg-card border-2 border-gold/40 shadow-sacred overflow-hidden relative">
            <div className="absolute top-4 right-4 z-20 flex gap-2">
              {/* Persist/Exit button */}
              <button
                onClick={() => {
                  stopSpeech();
                  setSpeakingStep(null);
                  setActiveStep(null);
                }}
                className="px-3 py-1.5 rounded-full bg-cream text-maroon text-xs border border-gold/40 font-medium hover:bg-gold hover:text-maroon transition shadow"
              >
                {lang === "hi" ? "नक्शा देखें" : "View Map"}
              </button>
            </div>

            <div className="grid md:grid-cols-12">
              {/* Tour Step Image */}
              <div className="md:col-span-5 relative h-60 md:h-auto min-h-[300px]">
                <img
                  src={stages[activeStep].image}
                  alt={t(stages[activeStep].titleKey)}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-overlay" />

                {/* Float Status Info */}
                <div className="absolute bottom-6 left-6 text-cream">
                  <div className="text-xs uppercase tracking-widest text-gold font-bold">
                    {t(stages[activeStep].subKey)}
                  </div>
                  <h3 className={`font-display text-2xl mt-1 ${dev}`}>
                    {t(stages[activeStep].titleKey)}
                  </h3>
                </div>
              </div>

              {/* Tour Step Logic Panel */}
              <div className="md:col-span-7 p-6 md:p-8 flex flex-col justify-between min-h-[450px]">
                <div>
                  {/* Horizontal progress bar */}
                  <div className="flex gap-1.5 mb-6">
                    {stages.map((st) => (
                      <div
                        key={st.id}
                        className={`h-2 rounded-full transition-all flex-1 ${
                          st.id === activeStep
                            ? "bg-saffron shadow-gold"
                            : st.id < activeStep
                            ? "bg-maroon"
                            : "bg-cream border border-gold/20"
                        }`}
                      />
                    ))}
                    {/* Final step slot for certificate */}
                    <div
                      className={`h-2 rounded-full transition-all flex-1 ${
                        activeStep === 4 ? "bg-saffron shadow-gold" : "bg-cream border border-gold/20"
                      }`}
                    />
                  </div>

                  {/* Narration and guide play */}
                  <div className="flex justify-between items-start gap-4 mb-4">
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-saffron/15 text-saffron">
                      {lang === "hi" ? `चरण ${activeStep + 1} / ४` : `Stage ${activeStep + 1} of 4`}
                    </span>

                    <button
                      onClick={() => toggleNarration(activeStep, stages[activeStep].audioText)}
                      className="inline-flex items-center gap-1.5 text-xs text-saffron hover:text-maroon font-semibold transition"
                    >
                      {speakingStep === activeStep ? (
                        <>
                          <VolumeX size={14} /> {t("parikrama.stop")}
                        </>
                      ) : (
                        <>
                          <Volume2 size={14} /> {t("parikrama.listen")}
                        </>
                      )}
                    </button>
                  </div>

                  <p className={`text-base text-foreground/80 leading-relaxed ${dev}`}>
                    {t(stages[activeStep].textKey)}
                  </p>
                </div>

                {/* RITUAL ACTIONS SECTION */}
                <div className="my-8 p-5 rounded-2xl bg-cream/25 border border-gold/20 shadow-inner">
                  <h4 className={`text-xs uppercase tracking-widest text-maroon font-bold mb-3 flex items-center gap-1.5 ${dev}`}>
                    <Sparkles size={14} className="text-saffron" />
                    {lang === "hi" ? "आध्यात्मिक अनुष्ठान" : "Sacred Ritual Activity"}
                  </h4>

                  {/* Stage 0 Ritual: Ganga Snan */}
                  {activeStep === 0 && (
                    <div className="flex flex-col gap-3">
                      <p className="text-xs text-muted-foreground">
                        {lang === "hi"
                          ? "पवित्र गंगा में डुबकी लगाकर अपने अंतःकरण को शुद्ध करें।"
                          : "Take a virtual splash in the Ganges to cleanse and begin the pilgrimage."}
                      </p>
                      <div className="flex items-center gap-4">
                        <button
                          onClick={() => {
                            playSplashSound();
                            setRitualGangaDone(true);
                            spawnFlowerShower();
                          }}
                          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition ${
                            ritualGangaDone
                              ? "bg-green-600 text-cream"
                              : "bg-gradient-sacred text-cream shadow-gold hover:scale-[1.02]"
                          }`}
                        >
                          <Waves size={16} />
                          {t("parikrama.stage0.btn")}
                        </button>
                        {ritualGangaDone && (
                          <span className="text-xs text-green-700 font-medium animate-fade-in">
                            ✓ {t("parikrama.stage0.action_done")}
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Stage 1 Ritual: Vindhyavasini Mandir */}
                  {activeStep === 1 && (
                    <div className="flex flex-col gap-4">
                      <p className="text-xs text-muted-foreground">
                        {lang === "hi"
                          ? "घंटे की ध्वनि करें और महालक्ष्मी स्वरूपा देवी विन्ध्यवासिनी को पुष्प अर्पित करें।"
                          : "Sound the bell to awaken divine energy, and offer fresh flowers to the deity."}
                      </p>
                      <div className="flex flex-wrap items-center gap-3">
                        <button
                          onClick={() => {
                            setIsBellShaking(true);
                            playBellSound();
                            setRitualBellRung(true);
                            setTimeout(() => setIsBellShaking(false), 800);
                          }}
                          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition ${
                            ritualBellRung ? "bg-amber-600 text-cream" : "bg-cream border-2 border-gold text-maroon hover:bg-gold/15"
                          }`}
                        >
                          <Bell size={16} className={isBellShaking ? "animate-bounce" : ""} />
                          {t("parikrama.stage1.btn_bell")}
                        </button>

                        <button
                          onClick={() => {
                            playChimeSound();
                            setRitualFlowersOffered(true);
                            spawnFlowerShower();
                          }}
                          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-sacred text-cream text-sm font-semibold shadow-gold hover:scale-[1.02] transition"
                        >
                          <Heart size={16} className="fill-current text-cream animate-pulse" />
                          {t("parikrama.stage1.btn_flower")}
                        </button>
                      </div>

                      {(ritualBellRung || ritualFlowersOffered) && (
                        <div className="text-xs text-saffron font-bold italic animate-pulse">
                          {lang === "hi" ? "॥ जय माँ विन्ध्यवासिनी - भक्ति अर्पण स्वीकार हुआ ॥" : "॥ Jai Maa Vindhyavasini - Devotion Offered ॥"}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Stage 2 Ritual: Kali Khoh */}
                  {activeStep === 2 && (
                    <div className="flex flex-col gap-3">
                      <p className="text-xs text-muted-foreground">
                        {lang === "hi"
                          ? "गुफा में विराजमान महाकाली को गुड़हल का पुष्प अर्पित कर प्रणाम करें।"
                          : "Offer the red Hibiscus (Gudhal) flower, beloved by Maha Kali, at the cave altar."}
                      </p>
                      <div className="flex items-center gap-4">
                        <button
                          onClick={() => {
                            playChimeSound();
                            setRitualKaliFlowerOffered(true);
                            spawnFlowerShower();
                          }}
                          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition ${
                            ritualKaliFlowerOffered
                              ? "bg-red-700 text-cream border-gold"
                              : "bg-gradient-sacred text-cream shadow-gold hover:scale-[1.02]"
                          }`}
                        >
                          <Heart size={16} />
                          {t("parikrama.stage2.btn")}
                        </button>

                        {ritualKaliFlowerOffered && (
                          <span className="text-xs text-red-700 font-bold italic animate-pulse">
                            {lang === "hi" ? "ॐ क्रीं काल्यै नमः" : "Om Kreem Kalyai Namah"}
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Stage 3 Ritual: Ashtabhuja */}
                  {activeStep === 3 && (
                    <div className="flex flex-col gap-3">
                      <p className="text-xs text-muted-foreground">
                        {lang === "hi"
                          ? "अपनी कामना के साथ कल्पवृक्ष पर मन्नत का पवित्र लाल धागा बांधें।"
                          : "Make a silent spiritual vow and tie a red/yellow thread onto the sacred branches."}
                      </p>
                      <div className="flex items-center gap-4">
                        <button
                          onClick={() => {
                            playChimeSound();
                            setRitualThreadTied(true);
                            spawnFlowerShower();
                          }}
                          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition ${
                            ritualThreadTied
                              ? "bg-amber-600 text-cream"
                              : "bg-gradient-sacred text-cream shadow-gold hover:scale-[1.02]"
                          }`}
                        >
                          <Compass size={16} />
                          {t("parikrama.stage3.btn")}
                        </button>

                        {ritualThreadTied && (
                          <span className="text-xs text-amber-700 font-bold italic animate-pulse">
                            {lang === "hi" ? "संकल्प पूर्ण हुआ! माँ कल्याण करेंगी।" : "Sankalpa Sealed! Maa protects always."}
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Tour navigation buttons */}
                <div className="flex justify-between items-center border-t border-gold/15 pt-5">
                  <button
                    onClick={() => {
                      if (activeStep > 0) setActiveStep(activeStep - 1);
                      else setActiveStep(null); // Back to map
                    }}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium border border-maroon/30 text-maroon hover:bg-maroon/5 transition"
                  >
                    <ArrowLeft size={16} /> {t("parikrama.prev")}
                  </button>

                  <button
                    onClick={() => {
                      // Prompt validation if ritual not clicked? No, let them skip if they want, but encourage it.
                      if (activeStep < 3) {
                        setActiveStep(activeStep + 1);
                      } else {
                        // Go to certificate step
                        setActiveStep(4);
                      }
                    }}
                    className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-gradient-sacred text-cream text-sm font-medium shadow-gold hover:opacity-95 transition"
                  >
                    {activeStep === 3 ? (
                      <>
                        {t("parikrama.complete")} <Award size={16} />
                      </>
                    ) : (
                      <>
                        {t("parikrama.next")} <ArrowRight size={16} />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* CERTIFICATE OF COMPLETION STAGE */
          <div className="max-w-3xl mx-auto rounded-3xl bg-card border border-gold/40 shadow-sacred p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-gradient-sacred flex items-center justify-center text-cream mx-auto mb-4 shadow-gold animate-bounce">
              <Award size={32} />
            </div>

            <span className="text-xs uppercase tracking-widest text-saffron font-bold">
              {t("parikrama.cert.title")}
            </span>
            <h3 className={`font-display text-3xl text-maroon mt-1 mb-2 ${dev}`}>
              {t("parikrama.cert.subtitle")}
            </h3>
            <p className="text-sm text-muted-foreground mb-8 max-w-lg mx-auto">
              {t("parikrama.cert.desc")}
            </p>

            {/* Input Details */}
            {!certGenerated ? (
              <div className="max-w-md mx-auto p-6 rounded-2xl bg-cream/15 border border-gold/25 shadow-inner mb-6">
                <input
                  type="text"
                  placeholder={t("parikrama.cert.input_ph")}
                  value={devoteeName}
                  onChange={(e) => setDevoteeName(e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl border border-gold/30 bg-background text-maroon text-center font-display text-lg focus:outline-none focus:border-saffron focus:ring-1 focus:ring-saffron mb-4 ${dev}`}
                />
                <button
                  onClick={generateCertificate}
                  disabled={!devoteeName.trim()}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-sacred text-cream font-medium shadow-gold disabled:opacity-50 transition"
                >
                  <Sparkles size={18} />
                  {t("parikrama.cert.generate")}
                </button>
              </div>
            ) : (
              <div className="mb-6 flex flex-col items-center">
                {/* Real hidden Canvas for exporting */}
                <canvas
                  ref={certCanvasRef}
                  width="1200"
                  height="850"
                  className="hidden"
                />

                {/* Styled Preview Container */}
                <div className="w-full max-w-xl aspect-[1200/850] rounded-xl border-2 border-gold/40 shadow-lg overflow-hidden bg-background relative mb-6">
                  {/* Render simulated HTML preview matching canvas style */}
                  <div className="absolute inset-0 p-6 flex flex-col justify-between border-[8px] border-maroon bg-gradient-to-br from-[#FFFDF6] via-[#FFF9E6] to-[#FFF2D1] text-maroon">
                    <div className="border-[2px] border-gold/70 h-full w-full p-4 flex flex-col justify-between relative">
                      <div>
                        <div className="font-serif font-bold text-center text-xs tracking-wide">
                          ॥ श्री विन्ध्यवासिन्यै नमः ॥
                        </div>
                        <div className="text-center font-semibold text-lg text-maroon tracking-tight mt-2">
                          नमामि विन्ध्यवासिनी संस्थान
                        </div>
                        <div className="text-center text-[8px] text-gold-700 tracking-wider">
                          Vindhyachal Dham, Mirzapur, UP
                        </div>
                      </div>

                      <div className="text-center my-1">
                        <div className="text-xs uppercase tracking-widest text-gold-600 font-bold">
                          Certificate of Completion / परिक्रमा प्रमाणपत्र
                        </div>
                        <div className="font-serif italic font-bold text-lg text-maroon mt-2">
                          {devoteeName}
                        </div>
                        <p className="text-[10px] text-foreground/80 max-w-sm mx-auto mt-2 leading-relaxed">
                          has successfully completed the sacred Trikona Parikrama of Maha Trishakti.
                        </p>
                      </div>

                      <div className="flex justify-between items-end text-[8px] text-muted-foreground px-4">
                        <div>
                          Date: {new Date().toLocaleDateString("en-IN")}
                        </div>
                        <div className="w-8 h-8 rounded-full bg-gold/50 flex items-center justify-center text-[7px] text-maroon font-bold border border-maroon">
                          SEAL
                        </div>
                        <div>
                          By: Pujya Guru Ji
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-4 justify-center">
                  <button
                    onClick={downloadCertificate}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-sacred text-cream font-medium shadow-gold hover:opacity-95 transition"
                  >
                    <Download size={16} />
                    {t("parikrama.cert.download")}
                  </button>

                  <button
                    onClick={() => {
                      setCertGenerated(false);
                      setDevoteeName("");
                    }}
                    className="flex items-center gap-1.5 px-5 py-3 rounded-xl border border-maroon text-maroon font-medium hover:bg-maroon/5 transition"
                  >
                    <RefreshCw size={16} />
                    {t("parikrama.reset")}
                  </button>
                </div>
              </div>
            )}

            <button
              onClick={() => {
                stopSpeech();
                setSpeakingStep(null);
                setRitualGangaDone(false);
                setRitualBellRung(false);
                setRitualFlowersOffered(false);
                setRitualKaliFlowerOffered(false);
                setRitualThreadTied(false);
                setDevoteeName("");
                setCertGenerated(false);
                setActiveStep(null);
              }}
              className="mt-6 inline-flex items-center gap-1 text-xs text-maroon hover:text-saffron font-semibold transition"
            >
              {lang === "hi" ? "← मुख्य परिक्रमा पृष्ठ पर लौटें" : "← Back to Main Parikrama"}
            </button>
          </div>
        )}
      </div>
    </PageShell>
  );
}
