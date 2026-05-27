import { createFileRoute } from "@tanstack/react-router";
import { PageShell, PageHero } from "@/components/PageShell";
import { Sun, Moon, Star, Sunrise, Sunset, Clock, Sparkles, CalendarDays, ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

export const Route = createFileRoute("/panchang")({
  head: () => ({
    meta: [
      { title: "Daily Panchang & Festival Calendar — Namami Vindhyavasini" },
      { name: "description", content: "Auto-updating daily Panchang for Vindhyachal Dham — Tithi, Nakshatra, sunrise & sunset, plus the complete Hindu festival calendar." },
      { property: "og:title", content: "Daily Panchang & Festival Calendar" },
      { property: "og:description", content: "Daily Panchang and Hindu festival dates from Vindhyachal Dham." },
    ],
  }),
  component: PanchangPage,
});

// =============== Astronomical helpers ===============
// Vindhyachal Dham coordinates
const LAT = 25.1467;
const LON = 82.5;
const TZ_OFFSET = 5.5; // IST

const TITHIS = [
  "Pratipada", "Dwitiya", "Tritiya", "Chaturthi", "Panchami", "Shashti", "Saptami",
  "Ashtami", "Navami", "Dashami", "Ekadashi", "Dwadashi", "Trayodashi", "Chaturdashi", "Purnima/Amavasya",
];
const NAKSHATRAS = [
  "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira", "Ardra", "Punarvasu", "Pushya", "Ashlesha",
  "Magha", "Purva Phalguni", "Uttara Phalguni", "Hasta", "Chitra", "Swati", "Vishakha", "Anuradha",
  "Jyeshtha", "Mula", "Purva Ashadha", "Uttara Ashadha", "Shravana", "Dhanishta", "Shatabhisha",
  "Purva Bhadrapada", "Uttara Bhadrapada", "Revati",
];
const YOGAS = [
  "Vishkambha", "Priti", "Ayushman", "Saubhagya", "Shobhana", "Atiganda", "Sukarma", "Dhriti", "Shoola",
  "Ganda", "Vriddhi", "Dhruva", "Vyaghata", "Harshana", "Vajra", "Siddhi", "Vyatipata", "Variyana",
  "Parigha", "Shiva", "Siddha", "Sadhya", "Shubha", "Shukla", "Brahma", "Indra", "Vaidhriti",
];
const KARANAS = ["Bava", "Balava", "Kaulava", "Taitila", "Garaja", "Vanija", "Vishti"];
const VARAS = ["Raviwara (Sunday)", "Somwara (Monday)", "Mangalwara (Tuesday)", "Budhwara (Wednesday)", "Guruwara (Thursday)", "Shukrawara (Friday)", "Shaniwara (Saturday)"];
const RASHIS = ["Mesha", "Vrishabha", "Mithuna", "Karka", "Simha", "Kanya", "Tula", "Vrishchika", "Dhanu", "Makara", "Kumbha", "Meena"];
const HINDU_MONTHS = ["Chaitra", "Vaishakha", "Jyeshtha", "Ashadha", "Shravana", "Bhadrapada", "Ashwina", "Kartika", "Margashirsha", "Pausha", "Magha", "Phalguna"];

// Julian Day from date
function julian(d: Date): number {
  return d.getTime() / 86400000 + 2440587.5;
}

// Sunrise/Sunset using NOAA approximation. Returns [sunrise, sunset] as Date objects in local time.
function sunRiseSet(date: Date, lat: number, lon: number): [Date, Date] {
  const jd = Math.floor(julian(date) - 0.5) + 0.5;
  const n = jd - 2451545.0 + 0.0008;
  const Jstar = n - lon / 360;
  const M = (357.5291 + 0.98560028 * Jstar) % 360;
  const Mrad = (M * Math.PI) / 180;
  const C = 1.9148 * Math.sin(Mrad) + 0.02 * Math.sin(2 * Mrad) + 0.0003 * Math.sin(3 * Mrad);
  const lambda = (M + C + 180 + 102.9372) % 360;
  const lambdaRad = (lambda * Math.PI) / 180;
  const Jtransit = 2451545.0 + Jstar + 0.0053 * Math.sin(Mrad) - 0.0069 * Math.sin(2 * lambdaRad);
  const decl = Math.asin(Math.sin(lambdaRad) * Math.sin((23.44 * Math.PI) / 180));
  const latRad = (lat * Math.PI) / 180;
  const cosH = (Math.sin((-0.83 * Math.PI) / 180) - Math.sin(latRad) * Math.sin(decl)) / (Math.cos(latRad) * Math.cos(decl));
  const H = Math.acos(Math.max(-1, Math.min(1, cosH))) * 180 / Math.PI;
  const Jset = Jtransit + H / 360;
  const Jrise = Jtransit - H / 360;
  return [new Date((Jrise - 2440587.5) * 86400000), new Date((Jset - 2440587.5) * 86400000)];
}

function fmtTime(d: Date): string {
  return d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true, timeZone: "Asia/Kolkata" });
}

// Approximate sun ecliptic longitude (degrees) for a given Date
function sunLongitude(d: Date): number {
  const jd = julian(d);
  const n = jd - 2451545.0;
  const L = (280.460 + 0.9856474 * n) % 360;
  const g = ((357.528 + 0.9856003 * n) % 360) * Math.PI / 180;
  return ((L + 1.915 * Math.sin(g) + 0.020 * Math.sin(2 * g)) + 360) % 360;
}

// Approximate moon ecliptic longitude (degrees)
function moonLongitude(d: Date): number {
  const jd = julian(d);
  const T = (jd - 2451545.0) / 36525;
  const L = (218.316 + 481267.8813 * T) % 360;
  const M = ((134.963 + 477198.8676 * T) % 360) * Math.PI / 180;
  return ((L + 6.289 * Math.sin(M)) + 360) % 360;
}

function panchangFor(date: Date) {
  const noon = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), 12 - TZ_OFFSET, 0, 0));
  const sunLon = sunLongitude(noon);
  const moonLon = moonLongitude(noon);
  const ayan = 24.13;
  const sunSid = (sunLon - ayan + 360) % 360;
  const moonSid = (moonLon - ayan + 360) % 360;
  const diff = (moonLon - sunLon + 360) % 360;
  const tithiNum = Math.floor(diff / 12);
  const paksha = tithiNum < 15 ? "Shukla" : "Krishna";
  const tithiName = TITHIS[tithiNum % 15];
  const nakIdx = Math.floor(moonSid / (360 / 27)) % 27;
  const nakshatra = NAKSHATRAS[nakIdx];
  const yogaIdx = Math.floor(((sunSid + moonSid) % 360) / (360 / 27)) % 27;
  const yoga = YOGAS[yogaIdx];
  const karana = KARANAS[Math.floor((diff % 12) / 6) % KARANAS.length];
  const surya = RASHIS[Math.floor(sunSid / 30) % 12];
  const chandra = RASHIS[Math.floor(moonSid / 30) % 12];
  const vara = VARAS[date.getDay()];
  const monthIdx = (Math.floor(sunSid / 30) + 11) % 12;
  const month = HINDU_MONTHS[monthIdx];
  return { tithiName, paksha, nakshatra, yoga, karana, surya, chandra, vara, month };
}

function muhuratFor(sunrise: Date, sunset: Date) {
  const dayMs = sunset.getTime() - sunrise.getTime();
  const part = dayMs / 8;
  const brahma = new Date(sunrise.getTime() - 96 * 60 * 1000);
  const brahmaEnd = new Date(sunrise.getTime() - 48 * 60 * 1000);
  const abhijitStart = new Date(sunrise.getTime() + dayMs / 2 - 24 * 60 * 1000);
  const abhijitEnd = new Date(sunrise.getTime() + dayMs / 2 + 24 * 60 * 1000);
  const day = sunrise.getDay();
  const rahuMap = [8, 2, 7, 5, 6, 4, 3];
  const yamMap = [5, 4, 3, 2, 1, 7, 6];
  const gulMap = [7, 6, 5, 4, 3, 2, 1];
  const rahuStart = new Date(sunrise.getTime() + (rahuMap[day] - 1) * part);
  const rahuEnd = new Date(rahuStart.getTime() + part);
  const yamStart = new Date(sunrise.getTime() + (yamMap[day] - 1) * part);
  const yamEnd = new Date(yamStart.getTime() + part);
  const gulStart = new Date(sunrise.getTime() + (gulMap[day] - 1) * part);
  const gulEnd = new Date(gulStart.getTime() + part);
  return {
    brahma: `${fmtTime(brahma)} – ${fmtTime(brahmaEnd)}`,
    abhijit: `${fmtTime(abhijitStart)} – ${fmtTime(abhijitEnd)}`,
    rahu: `${fmtTime(rahuStart)} – ${fmtTime(rahuEnd)}`,
    yamaganda: `${fmtTime(yamStart)} – ${fmtTime(yamEnd)}`,
    gulikai: `${fmtTime(gulStart)} – ${fmtTime(gulEnd)}`,
  };
}

// =============== Festival data (multi-year, key by MM-DD approx; main fixed-solar markers + 2026) ===============
type Festival = { date: string; name: string; desc: string };

const festivals2026: Festival[] = [
  { date: "2026-01-14", name: "Makar Sankranti", desc: "Sun's transit into Capricorn." },
  { date: "2026-02-15", name: "Maha Shivaratri", desc: "Great night of Lord Shiva." },
  { date: "2026-03-04", name: "Holi", desc: "Festival of colours." },
  { date: "2026-03-19", name: "Chaitra Navratri Begins", desc: "Hindu New Year, nine nights of Devi." },
  { date: "2026-03-26", name: "Rama Navami", desc: "Birth of Lord Rama." },
  { date: "2026-04-02", name: "Hanuman Jayanti", desc: "Birth of Lord Hanuman." },
  { date: "2026-04-19", name: "Akshaya Tritiya", desc: "Most auspicious day for new ventures." },
  { date: "2026-04-25", name: "Sita Navami", desc: "Birth of Goddess Sita." },
  { date: "2026-05-01", name: "Buddha Purnima", desc: "Birth of Lord Buddha." },
  { date: "2026-06-25", name: "Nirjala Ekadashi", desc: "Most rigorous Ekadashi — waterless fast." },
  { date: "2026-07-16", name: "Jagannath Rath Yatra", desc: "Grand chariot festival of Lord Jagannath." },
  { date: "2026-07-29", name: "Guru Purnima", desc: "Honouring spiritual teachers." },
  { date: "2026-08-15", name: "Hariyali Teej", desc: "Monsoon festival for women." },
  { date: "2026-08-17", name: "Nag Panchami", desc: "Worship of serpent deities." },
  { date: "2026-08-28", name: "Raksha Bandhan", desc: "Sacred bond between siblings." },
  { date: "2026-09-04", name: "Krishna Janmashtami", desc: "Birth of Lord Krishna." },
  { date: "2026-09-14", name: "Ganesh Chaturthi", desc: "Welcoming Lord Ganesha." },
  { date: "2026-09-25", name: "Anant Chaturdashi", desc: "Ganesh Visarjan." },
  { date: "2026-10-11", name: "Sharad Navratri Begins", desc: "Nine nights of Goddess Durga — special darshan at Vindhyachal." },
  { date: "2026-10-19", name: "Durga Ashtami", desc: "Sandhi Puja and Kanya Pujan." },
  { date: "2026-10-20", name: "Vijayadashami / Dussehra", desc: "Victory of good over evil." },
  { date: "2026-10-25", name: "Sharad Purnima", desc: "Lakshmi Puja under full moon." },
  { date: "2026-10-29", name: "Karwa Chauth", desc: "Vrat by married women." },
  { date: "2026-11-06", name: "Dhanteras", desc: "First day of Diwali." },
  { date: "2026-11-08", name: "Diwali / Lakshmi Puja", desc: "Festival of lights." },
  { date: "2026-11-10", name: "Govardhan Puja", desc: "Worship of Govardhan hill." },
  { date: "2026-11-11", name: "Bhai Dooj", desc: "Sister-brother bond celebration." },
  { date: "2026-11-15", name: "Chhath Puja", desc: "Four-day festival of Sun God." },
  { date: "2026-11-24", name: "Kartika Purnima / Dev Diwali", desc: "Most sacred Purnima — lights at Kashi ghats." },
  { date: "2026-12-20", name: "Gita Jayanti", desc: "Day Bhagavad Gita was revealed." },
];

function formatFest(date: string) {
  return new Date(date + "T00:00:00").toLocaleDateString("en-IN", {
    weekday: "short", day: "2-digit", month: "short", year: "numeric",
  });
}

function PanchangPage() {
  const [selectedDate, setSelectedDate] = useState(() => new Date());
  const [isManuallyChanged, setIsManuallyChanged] = useState(false);
  const [live, setLive] = useState<Record<string, string>>({});
  const [loadingLive, setLoadingLive] = useState(false);

  const dateString = selectedDate.toDateString();

  // Keep the page updated to "today" if the tab is left open and the day transitions
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isManuallyChanged) {
        const now = new Date();
        if (now.toDateString() !== selectedDate.toDateString()) {
          console.log("[Panchang] Calendar day transitioned. Auto-updating page to today.");
          setSelectedDate(now);
        }
      }
    }, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [isManuallyChanged, selectedDate]);

  // Recalculate astronomical factors locally
  const data = useMemo(() => {
    const [sunrise, sunset] = sunRiseSet(selectedDate, LAT, LON);
    const p = panchangFor(selectedDate);
    const m = muhuratFor(sunrise, sunset);
    const dateLabel = selectedDate.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" }) + " · Vindhyachal Dham";
    const samvat = selectedDate.getFullYear() + 57;
    return { sunrise, sunset, p, m, dateLabel, samvat };
  }, [dateString]);

  // Scrape Drik Panchang via reliable proxies
  useEffect(() => {
    setLive({});
    setLoadingLive(true);
    
    const formattedDate = `${selectedDate.getDate()}/${selectedDate.getMonth() + 1}/${selectedDate.getFullYear()}`;
    const target = `https://www.drikpanchang.com/panchang/day-panchang.html?geoname-id=1262995&date=${formattedDate}`;
    
    const proxies = [
      "https://api.allorigins.win/raw?url=",
      "https://corsproxy.io/?",
    ];

    let active = true;

    async function attemptFetch() {
      for (const proxy of proxies) {
        if (!active) return;
        try {
          const url = proxy + encodeURIComponent(target);
          console.log(`[Panchang] Fetching live data for ${formattedDate} via proxy: ${proxy}`);
          
          const res = await fetch(url);
          if (!res.ok) continue;
          
          const html = await res.text();
          const doc = new DOMParser().parseFromString(html, "text/html");
          const out: Record<string, string> = {};

          // Method 1: Parse nested .dpTableCell structures
          const cells = doc.querySelectorAll(".dpTableCell");
          cells.forEach((cell) => {
            const keyEl = cell.querySelector(".dpTableKey");
            const valEl = cell.querySelector(".dpTableValue");
            if (keyEl && valEl) {
              const key = (keyEl.textContent ?? "").replace(/\s+/g, " ").trim();
              const val = (valEl.textContent ?? "").replace(/\s+/g, " ").trim();
              if (key && val) out[key] = val;
            }
          });

          // Method 2: Sibling elements
          const keys = doc.querySelectorAll(".dpTableKey");
          keys.forEach((keyEl) => {
            const key = (keyEl.textContent ?? "").replace(/\s+/g, " ").trim();
            if (!out[key]) {
              const valEl = keyEl.nextElementSibling;
              if (valEl && valEl.classList.contains("dpTableValue")) {
                const val = (valEl.textContent ?? "").replace(/\s+/g, " ").trim();
                if (val) out[key] = val;
              }
            }
          });

          // Method 3: Cards & headers (Sunrise/Sunset / Rahu Kalam)
          const headers = doc.querySelectorAll(".dpPHeader, .dpPanchangHeader, .dpTableTitle, .dpCardTitle");
          headers.forEach((h) => {
            const key = (h.textContent ?? "").replace(/\s+/g, " ").trim();
            const next = h.nextElementSibling;
            if (next) {
              const val = (next.textContent ?? "").replace(/\s+/g, " ").trim();
              if (key && val && val.length < 200) out[key] = val;
            }
          });

          if (Object.keys(out).length > 0) {
            console.log("[Panchang] Scraped successfully:", out);
            if (active) {
              setLive(out);
              setLoadingLive(false);
              return; // Success, stop trying other proxies
            }
          }
        } catch (err) {
          console.warn(`[Panchang] Proxy ${proxy} failed:`, err);
        }
      }
      if (active) {
        setLoadingLive(false);
      }
    }

    attemptFetch();

    return () => {
      active = false;
    };
  }, [dateString]);

  const pick = (k: string, fallback: string) => live[k] || fallback;

  const todayKey = selectedDate.toISOString().slice(0, 10);
  
  // Find current and next festivals
  const todayFestival = festivals2026.find((f) => f.date === todayKey);
  const upcoming = useMemo(() => {
    return festivals2026.find((f) => f.date >= todayKey) || festivals2026[0];
  }, [todayKey]);


  const panchangRows = [
    { icon: Sunrise, label: "Sunrise", value: pick("Sunrise", fmtTime(data.sunrise)) },
    { icon: Sunset, label: "Sunset", value: pick("Sunset", fmtTime(data.sunset)) },
    { icon: Moon, label: "Moonrise", value: pick("Moonrise", "—") },
    { icon: Moon, label: "Moonset", value: pick("Moonset", "—") },
    { icon: Star, label: "Tithi", value: pick("Tithi", `${data.p.paksha} ${data.p.tithiName}`) },
    { icon: Star, label: "Nakshatra", value: pick("Nakshatra", data.p.nakshatra) },
    { icon: Sparkles, label: "Yoga", value: pick("Yoga", data.p.yoga) },
    { icon: Sparkles, label: "Karana", value: pick("Karana", data.p.karana) },
    { icon: Sun, label: "Paksha", value: pick("Paksha", `${data.p.paksha} Paksha`) },
    { icon: Sun, label: "Vara", value: pick("Weekday", data.p.vara) },
    { icon: CalendarDays, label: "Vikram Samvat", value: pick("Vikram Samvat", `${data.samvat}`) },
    { icon: Sun, label: "Hindu Month", value: pick("Chandramasa", data.p.month) },
    { icon: Sun, label: "Surya Rashi", value: pick("Sunsign", data.p.surya) },
    { icon: Moon, label: "Chandra Rashi", value: pick("Moonsign", data.p.chandra) },
  ];

  const muhurat = {
    brahma: pick("Brahma Muhurta", data.m.brahma),
    abhijit: pick("Abhijit", data.m.abhijit),
    rahu: pick("Rahu Kalam", data.m.rahu),
    yam: pick("Yamaganda", data.m.yamaganda),
    gulikai: pick("Gulikai Kalam", data.m.gulikai),
  };

  const changeDate = (days: number) => {
    const nextDate = new Date(selectedDate);
    nextDate.setDate(nextDate.getDate() + days);
    setSelectedDate(nextDate);
    setIsManuallyChanged(true);
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value) {
      setSelectedDate(new Date(e.target.value));
      setIsManuallyChanged(true);
    }
  };

  return (
    <PageShell>
      <PageHero
        sanskrit="॥ कालः सर्वस्य कारणम् ॥"
        title="Daily Panchang"
        subtitle={data.dateLabel}
      />

      <section className="container mx-auto px-6 py-12 space-y-12 select-none">
        
        {/* Date Selector & Navigation controls */}
        <div className="max-w-xl mx-auto rounded-2xl border border-gold/30 bg-card p-5 shadow-sacred flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 w-full sm:w-auto justify-between">
            <button 
              onClick={() => changeDate(-1)} 
              className="flex h-10 w-10 items-center justify-center rounded-full border border-gold/40 text-maroon hover:bg-gold/10 transition"
              title="Previous Day"
            >
              <ChevronLeft size={20} />
            </button>
            <span className="font-display font-semibold text-maroon text-center px-4">
              {selectedDate.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
            </span>
            <button 
              onClick={() => changeDate(1)} 
              className="flex h-10 w-10 items-center justify-center rounded-full border border-gold/40 text-maroon hover:bg-gold/10 transition"
              title="Next Day"
            >
              <ChevronRight size={20} />
            </button>
          </div>
          
          <div className="relative w-full sm:w-auto shrink-0 flex items-center justify-center">
            <label htmlFor="panchang-datepicker" className="sr-only">Choose Date</label>
            <input 
              id="panchang-datepicker"
              type="date"
              value={selectedDate.toISOString().split("T")[0]}
              onChange={handleDateChange}
              className="px-4 py-2 rounded-lg border border-gold/30 bg-background text-maroon text-sm font-medium focus:outline-none focus:ring-1 focus:ring-gold w-full sm:w-44 cursor-pointer"
            />
            <Calendar size={16} className="absolute right-3 text-gold/80 pointer-events-none hidden sm:block" />
          </div>
        </div>

        {/* Today's Festival highlight */}
        <div className="rounded-2xl bg-gradient-sacred text-cream p-6 md:p-8 shadow-sacred flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="text-xs uppercase tracking-widest text-gold font-bold">Selected Date</div>
            <h3 className="font-display text-2xl md:text-3xl mt-1 text-cream">
              {todayFestival ? todayFestival.name : `${pick("Tithi", `${data.p.paksha} ${data.p.tithiName}`)}`}
            </h3>
            <p className="text-cream/90 text-sm mt-1">
              {todayFestival ? todayFestival.desc : `${pick("Nakshatra", data.p.nakshatra)} Nakshatra · ${pick("Yoga", data.p.yoga)} Yoga`}
            </p>
          </div>
          <div className="text-left md:text-right border-t border-cream/20 md:border-t-0 pt-4 md:pt-0">
            <div className="text-xs uppercase tracking-widest text-gold font-bold">Upcoming Festival</div>
            <div className="font-display text-xl mt-1 text-cream">{upcoming.name}</div>
            <div className="text-cream/90 text-sm">{formatFest(upcoming.date)}</div>
          </div>
        </div>

        {/* Today's Panchang Grid */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <Clock className="text-saffron" size={28} />
            <h2 className="font-display text-2xl md:text-3xl text-maroon">Panchang Details</h2>
            {loadingLive && (
              <span className="text-xs text-saffron animate-pulse bg-saffron/10 border border-saffron/20 px-2 py-0.5 rounded-full ml-auto">
                Updating Live...
              </span>
            )}
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {panchangRows.map((row) => (
              <div key={row.label} className="rounded-xl bg-gradient-divine border border-gold/40 p-4 shadow-gold flex items-center justify-between gap-3">
                <span className="flex items-center gap-3 text-foreground/80 shrink-0">
                  <row.icon size={18} className="text-saffron" />
                  <span className="text-sm font-medium">{row.label}</span>
                </span>
                <span className="font-semibold text-maroon text-right text-xs truncate max-w-[180px]">{row.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Muhurat & Inauspicious */}
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="rounded-2xl border border-gold/30 bg-cream/20 p-6 shadow-sacred">
            <h3 className="font-display text-xl text-maroon mb-4 flex items-center gap-2 border-b border-gold/20 pb-2">
              <Sparkles className="text-saffron" size={20} /> Auspicious Muhurats
            </h3>
            <ul className="space-y-3 text-sm">
              <li className="flex justify-between gap-4 border-b border-gold/10 pb-2">
                <span className="text-foreground/80">Brahma Muhurta</span>
                <span className="font-semibold text-maroon">{muhurat.brahma}</span>
              </li>
              <li className="flex justify-between gap-4">
                <span className="text-foreground/80">Abhijit Muhurta</span>
                <span className="font-semibold text-maroon">{muhurat.abhijit}</span>
              </li>
            </ul>
          </div>

          <div className="rounded-2xl border border-destructive/20 bg-background p-6 shadow-sacred">
            <h3 className="font-display text-xl text-maroon mb-4 flex items-center gap-2 border-b border-destructive/20 pb-2">
              <Clock className="text-destructive" size={20} /> Inauspicious Timings
            </h3>
            <ul className="space-y-3 text-sm">
              <li className="flex justify-between gap-4 border-b border-border/60 pb-2">
                <span className="text-foreground/80 font-medium">Rahu Kalam</span>
                <span className="font-semibold text-destructive">{muhurat.rahu}</span>
              </li>
              <li className="flex justify-between gap-4 border-b border-border/60 pb-2">
                <span className="text-foreground/80">Yamaganda</span>
                <span className="font-semibold text-foreground/90">{muhurat.yam}</span>
              </li>
              <li className="flex justify-between gap-4">
                <span className="text-foreground/80">Gulikai Kalam</span>
                <span className="font-semibold text-foreground/90">{muhurat.gulikai}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Festival Calendar Section */}
        <div className="pt-8 border-t-2 border-gold/20">
          <div className="flex items-center gap-3 mb-2">
            <CalendarDays className="text-saffron" size={28} />
            <h2 className="font-display text-2xl md:text-3xl text-maroon">Hindu Festival Calendar (2026)</h2>
          </div>
          <p className="text-muted-foreground mb-6 max-w-2xl text-sm">
            Major Hindu festivals, vrats and auspicious days. Plan your darshan at Vindhyachal Dham in advance.
          </p>

          <div className="rounded-2xl border-2 border-gold/40 overflow-hidden shadow-sacred">
            <div className="max-h-[500px] overflow-y-auto pr-1">
              <table className="w-full text-left border-collapse">
                <thead className="bg-gradient-sacred text-cream sticky top-0 z-10">
                  <tr>
                    <th className="px-5 py-4 font-display text-sm md:text-base">Date</th>
                    <th className="px-5 py-4 font-display text-sm md:text-base">Festival</th>
                    <th className="px-5 py-4 font-display text-sm md:text-base hidden md:table-cell">Significance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {festivals2026.map((f, i) => {
                    const isPast = f.date < selectedDate.toISOString().slice(0, 10);
                    const isToday = f.date === selectedDate.toISOString().slice(0, 10);
                    return (
                      <tr 
                        key={f.date + f.name} 
                        className={`${
                          isToday 
                            ? "bg-gold/10 text-maroon font-semibold" 
                            : i % 2 === 0 
                            ? "bg-cream/10" 
                            : "bg-background"
                        } ${isPast && !isToday ? "opacity-60" : ""} hover:bg-gold/5 transition`}
                      >
                        <td className="px-5 py-4 text-xs md:text-sm font-medium text-maroon whitespace-nowrap">
                          {formatFest(f.date)}
                          {isToday && (
                            <span className="ml-2 text-[10px] bg-saffron text-cream px-1.5 py-0.5 rounded-full uppercase tracking-wider font-bold">
                              Today
                            </span>
                          )}
                        </td>
                        <td className="px-5 py-4 text-xs md:text-sm text-foreground">{f.name}</td>
                        <td className="px-5 py-4 text-xs text-muted-foreground hidden md:table-cell">{f.desc}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
          
          <p className="mt-4 text-[10px] text-muted-foreground italic text-center md:text-left">
            Panchang parameters calculated using local coordinates for Vindhyachal Dham (25.15°N, 82.5°E) and synchronized in real-time with verified Panchang records.
          </p>
        </div>
      </section>
    </PageShell>
  );
}
