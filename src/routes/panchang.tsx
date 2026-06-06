import { createFileRoute } from "@tanstack/react-router";
import { PageShell, PageHero } from "@/components/PageShell";
import {
  Sun,
  Moon,
  Star,
  Sunrise,
  Sunset,
  Clock,
  Sparkles,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Search,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

export const Route = createFileRoute("/panchang")({
  head: () => ({
    meta: [
      { title: "Daily Panchang & Festival Calendar — Namami Vindhyavasini" },
      {
        name: "description",
        content:
          "Auto-updating daily Panchang for Vindhyachal Dham — Tithi, Nakshatra, sunrise & sunset, plus the complete Hindu festival calendar.",
      },
      { property: "og:title", content: "Daily Panchang & Festival Calendar" },
      {
        property: "og:description",
        content: "Daily Panchang and Hindu festival dates from Vindhyachal Dham.",
      },
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
  "Pratipada",
  "Dwitiya",
  "Tritiya",
  "Chaturthi",
  "Panchami",
  "Shashti",
  "Saptami",
  "Ashtami",
  "Navami",
  "Dashami",
  "Ekadashi",
  "Dwadashi",
  "Trayodashi",
  "Chaturdashi",
  "Purnima",
];
const NAKSHATRAS = [
  "Ashwini",
  "Bharani",
  "Krittika",
  "Rohini",
  "Mrigashira",
  "Ardra",
  "Punarvasu",
  "Pushya",
  "Ashlesha",
  "Magha",
  "Purva Phalguni",
  "Uttara Phalguni",
  "Hasta",
  "Chitra",
  "Swati",
  "Vishakha",
  "Anuradha",
  "Jyeshtha",
  "Mula",
  "Purva Ashadha",
  "Uttara Ashadha",
  "Shravana",
  "Dhanishta",
  "Shatabhisha",
  "Purva Bhadrapada",
  "Uttara Bhadrapada",
  "Revati",
];
const YOGAS = [
  "Vishkambha",
  "Priti",
  "Ayushman",
  "Saubhagya",
  "Shobhana",
  "Atiganda",
  "Sukarma",
  "Dhriti",
  "Shoola",
  "Ganda",
  "Vriddhi",
  "Dhruva",
  "Vyaghata",
  "Harshana",
  "Vajra",
  "Siddhi",
  "Vyatipata",
  "Variyana",
  "Parigha",
  "Shiva",
  "Siddha",
  "Sadhya",
  "Shubha",
  "Shukla",
  "Brahma",
  "Indra",
  "Vaidhriti",
];
const KARANAS = ["Bava", "Balava", "Kaulava", "Taitila", "Garaja", "Vanija", "Vishti"];
const VARAS = [
  "Raviwara (Sunday)",
  "Somwara (Monday)",
  "Mangalwara (Tuesday)",
  "Budhwara (Wednesday)",
  "Guruwara (Thursday)",
  "Shukrawara (Friday)",
  "Shaniwara (Saturday)",
];
const RASHIS = [
  "Mesha",
  "Vrishabha",
  "Mithuna",
  "Karka",
  "Simha",
  "Kanya",
  "Tula",
  "Vrishchika",
  "Dhanu",
  "Makara",
  "Kumbha",
  "Meena",
];
const HINDU_MONTHS = [
  "Chaitra",
  "Vaishakha",
  "Jyeshtha",
  "Ashadha",
  "Shravana",
  "Bhadrapada",
  "Ashwina",
  "Kartika",
  "Margashirsha",
  "Pausha",
  "Magha",
  "Phalguna",
];

// Julian Day from date
function julian(d: Date): number {
  return d.getTime() / 86400000 + 2440587.5;
}

function getAyanamsha(jdVal: number) {
  const yearsSince1900 = (jdVal - 2415020.0) / 365.2422;
  return 22.466 + yearsSince1900 * (50.29 / 3600);
}

// Sunrise/Sunset using NOAA approximation. Returns [sunrise, sunset] as Date objects in local time.
function sunRiseSet(date: Date, lat: number, lon: number): [Date, Date] {
  const jdVal = Math.floor(julian(date) - 0.5) + 0.5;
  const n = Math.round(jdVal - 2451545.0 + 0.0008);
  const Jstar = n - lon / 360;
  const M = (357.5291 + 0.98560028 * Jstar) % 360;
  const Mrad = (M * Math.PI) / 180;
  const C =
    1.9148 * Math.sin(Mrad) + 0.02 * Math.sin(2 * Mrad) + 0.0003 * Math.sin((3 * Math.PI) / 180); // simplified perturbation
  const lambda = (M + C + 180 + 102.9372) % 360;
  const lambdaRad = (lambda * Math.PI) / 180;
  const Jtransit = 2451545.0 + Jstar + 0.0053 * Math.sin(Mrad) - 0.0069 * Math.sin(2 * lambdaRad);
  const decl = Math.asin(Math.sin(lambdaRad) * Math.sin((23.44 * Math.PI) / 180));
  const latRad = (lat * Math.PI) / 180;
  const cosH =
    (Math.sin((-0.83 * Math.PI) / 180) - Math.sin(latRad) * Math.sin(decl)) /
    (Math.cos(latRad) * Math.cos(decl));
  const H = (Math.acos(Math.max(-1, Math.min(1, cosH))) * 180) / Math.PI;
  const Jset = Jtransit + H / 360;
  const Jrise = Jtransit - H / 360;
  return [new Date((Jrise - 2440587.5) * 86400000), new Date((Jset - 2440587.5) * 86400000)];
}

function fmtTime(d: Date): string {
  return d.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZone: "Asia/Kolkata",
  });
}

// Approximate sun ecliptic longitude (degrees) for a given Date
function sunLongitude(d: Date): number {
  const jdVal = julian(d);
  const n = jdVal - 2451545.0;
  const L = (280.46 + 0.9856474 * n) % 360;
  const g = (((357.528 + 0.9856003 * n) % 360) * Math.PI) / 180;
  return (L + 1.915 * Math.sin(g) + 0.02 * Math.sin(2 * g) + 360) % 360;
}

// Approximate moon ecliptic longitude (degrees)
function moonLongitude(d: Date): number {
  const jdVal = julian(d);
  const T = (jdVal - 2451545.0) / 36525;
  const L_prime = (218.3164 + 481267.8812 * T) % 360;
  const D = (297.8502 + 445267.1114 * T) % 360;
  const M = (134.9634 + 477198.8675 * T) % 360;
  const M_prime = (357.5291 + 35999.0503 * T) % 360;
  const F = (93.2721 + 483202.0175 * T) % 360;

  const D_rad = (D * Math.PI) / 180;
  const M_rad = (M * Math.PI) / 180;
  const Mp_rad = (M_prime * Math.PI) / 180;
  const F_rad = (F * Math.PI) / 180;

  let dL = 0;
  dL += 6.288774 * Math.sin(M_rad);
  dL += 1.274027 * Math.sin(2 * D_rad - M_rad);
  dL += 0.658309 * Math.sin(2 * D_rad);
  dL += 0.213618 * Math.sin(2 * M_rad);
  dL += -0.185116 * Math.sin(Mp_rad);
  dL += -0.114332 * Math.sin(2 * F_rad);
  dL += 0.058793 * Math.sin(2 * D_rad - 2 * M_rad);
  dL += 0.057066 * Math.sin(2 * D_rad - M_rad - Mp_rad);
  dL += 0.053322 * Math.sin(2 * D_rad + M_rad);
  dL += 0.045758 * Math.sin(2 * D_rad - Mp_rad);
  dL += -0.041023 * Math.sin(M_rad - Mp_rad);
  dL += -0.03472 * Math.sin(D_rad);
  dL += -0.030465 * Math.sin(M_rad + Mp_rad);
  dL += 0.015327 * Math.sin(2 * D_rad - 2 * F_rad);
  dL += -0.012528 * Math.sin(2 * D_rad + Mp_rad);
  dL += -0.009756 * Math.sin(2 * D_rad - M_rad + Mp_rad);
  dL += 0.008034 * Math.sin(2 * D_rad - 2 * M_rad - Mp_rad);
  dL += -0.007684 * Math.sin(2 * D_rad - 2 * M_rad + Mp_rad);
  dL += 0.006322 * Math.sin(2 * M_rad - 2 * D_rad);
  dL += -0.005877 * Math.sin(M_rad - 2 * D_rad);

  return (L_prime + dL + 360) % 360;
}

function panchangFor(date: Date, sunrise?: Date) {
  // Use sunrise time for planetary calculations (Udayatithi), fallback to local noon if unavailable
  const calculationTime = sunrise || new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), 12 - TZ_OFFSET, 0, 0),
  );
  const sunLon = sunLongitude(calculationTime);
  const moonLon = moonLongitude(calculationTime);
  const ayan = getAyanamsha(julian(calculationTime));
  const sunSid = (sunLon - ayan + 360) % 360;
  const moonSid = (moonLon - ayan + 360) % 360;
  const diff = (moonLon - sunLon + 360) % 360;
  const tithiNum = Math.floor(diff / 12);
  const paksha = tithiNum < 15 ? "Shukla" : "Krishna";
  
  let tithiName = TITHIS[tithiNum % 15];
  if (paksha === "Krishna" && (tithiNum % 15 === 14)) {
    tithiName = "Amavasya";
  } else if (paksha === "Shukla" && (tithiNum % 15 === 14)) {
    tithiName = "Purnima";
  }

  const nakIdx = Math.floor(moonSid / (360 / 27)) % 27;
  const nakshatra = NAKSHATRAS[nakIdx];
  const yogaIdx = Math.floor(((sunSid + moonSid) % 360) / (360 / 27)) % 27;
  const yoga = YOGAS[yogaIdx];
  
  // High-accuracy Karana calculation
  const halfTithi = Math.floor(diff / 6); // 0 to 59
  let karana = "";
  if (halfTithi === 0) {
    karana = "Kimstughna";
  } else if (halfTithi >= 57) {
    if (halfTithi === 57) karana = "Shakuni";
    else if (halfTithi === 58) karana = "Chatushpada";
    else karana = "Naga";
  } else {
    const mobileKaranas = ["Bava", "Balava", "Kaulava", "Taitila", "Garaja", "Vanija", "Vishti"];
    karana = mobileKaranas[(halfTithi - 1) % 7];
  }

  const surya = RASHIS[Math.floor(sunSid / 30) % 12];
  const chandra = RASHIS[Math.floor(moonSid / 30) % 12];
  const vara = VARAS[date.getDay()];
  const monthIdx = (Math.floor(sunSid / 30) + 11) % 12;
  const month = HINDU_MONTHS[monthIdx];

  // High-accuracy Vikram Samvat calculation
  let samvat = date.getFullYear() + 57;
  const year = date.getFullYear();
  if (year === 2026) {
    const newYearDate = new Date("2026-03-19");
    samvat = date >= newYearDate ? 2083 : 2082;
  } else if (year === 2027) {
    const newYearDate = new Date("2027-04-07");
    samvat = date >= newYearDate ? 2084 : 2083;
  } else {
    samvat = year + (date.getMonth() > 2 ? 57 : 56);
  }

  return { tithiName, paksha, nakshatra, yoga, karana, surya, chandra, vara, month, samvat };
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

// =============== Festival data (multi-year, key by MM-DD approx; main fixed-solar markers + 2026 & 2027) ===============
type Festival = { date: string; name: string; desc: string };

const ALL_FESTIVALS: Record<number, Festival[]> = {
  2026: [
    { date: "2026-01-14", name: "Makar Sankranti", desc: "Sun's transit into Capricorn, marking the end of winter solstice and harvest season." },
    { date: "2026-01-23", name: "Vasant Panchami", desc: "Auspicious day dedicated to Goddess Saraswati, the deity of knowledge, music, and art." },
    { date: "2026-02-15", name: "Maha Shivaratri", desc: "The Great Night of Lord Shiva, celebrated with night-long prayers, fasting, and rudrabhishek." },
    { date: "2026-03-03", name: "Holika Dahan", desc: "Celebrating the burning of demoness Holika, symbolizing the triumph of good over evil." },
    { date: "2026-03-04", name: "Holi", desc: "The vibrant festival of colors celebrating love, spring, and the playfulness of Lord Krishna." },
    { date: "2026-03-19", name: "Chaitra Navratri Begins", desc: "Hindu New Year (Vikram Samvat 2083) and the beginning of nine sacred nights of Goddess Durga." },
    { date: "2026-03-26", name: "Rama Navami", desc: "Birth anniversary of Lord Rama, the seventh incarnation of Lord Vishnu." },
    { date: "2026-04-02", name: "Hanuman Jayanti", desc: "Birth anniversary of Lord Hanuman, the epitome of devotion and strength." },
    { date: "2026-04-19", name: "Akshaya Tritiya", desc: "Highly auspicious day for new beginnings, purchases, and investments." },
    { date: "2026-04-25", name: "Sita Navami", desc: "Birth anniversary of Goddess Sita, celebrated with prayers and fasts." },
    { date: "2026-05-01", name: "Buddha Purnima", desc: "Birth, enlightenment, and death anniversary of Gautama Buddha." },
    { date: "2026-06-25", name: "Nirjala Ekadashi", desc: "The most sacred and rigorous Ekadashi fast, observed without food or water." },
    { date: "2026-06-26", name: "Ganga Dussehra", desc: "The holy day when Goddess Ganga descended from heaven to Earth, celebrated with Ganga snan." },
    { date: "2026-07-16", name: "Jagannath Rath Yatra", desc: "Grand chariot procession of Lord Jagannath, Balabhadra, and Subhadra in Puri." },
    { date: "2026-07-29", name: "Guru Purnima", desc: "Day dedicated to spiritual and academic gurus, commemorating Sage Vyasa." },
    { date: "2026-08-15", name: "Hariyali Teej", desc: "Monsoon festival celebrating the union of Lord Shiva and Goddess Parvati." },
    { date: "2026-08-17", name: "Nag Panchami", desc: "Traditional worship of snakes and serpents offered with milk and prayers." },
    { date: "2026-08-28", name: "Raksha Bandhan", desc: "Celebrating the sacred bond of love and protection between brothers and sisters." },
    { date: "2026-09-04", name: "Krishna Janmashtami", desc: "Birth anniversary of Lord Krishna, celebrated with midnight prayers and dahi handi." },
    { date: "2026-09-14", name: "Ganesh Chaturthi", desc: "Ten-day festival welcoming the elephant-headed deity Lord Ganesha to homes." },
    { date: "2026-09-25", name: "Anant Chaturdashi", desc: "The final day of Ganeshotsav, marked by immersion of Lord Ganesha idols." },
    { date: "2026-10-11", name: "Sharad Navratri Begins", desc: "Grand autumn festival of nine nights dedicated to Goddess Durga, major festivities at Vindhyachal." },
    { date: "2026-10-19", name: "Durga Ashtami", desc: "Maha Ashtami of Durga Puja, featuring Sandhi Puja and Kanya Pujan." },
    { date: "2026-10-20", name: "Vijayadashami / Dussehra", desc: "Celebration of Lord Rama's victory over Ravana and Goddess Durga's victory over Mahishasura." },
    { date: "2026-10-25", name: "Sharad Purnima", desc: "Harvest festival marked by moonlight kheer, worship of Goddess Lakshmi." },
    { date: "2026-10-29", name: "Karwa Chauth", desc: "Fasting ritual by married Hindu women for the safety and long life of their husbands." },
    { date: "2026-11-06", name: "Dhanteras", desc: "Worship of Lord Dhanvantari and purchasing gold, silver, or new utensils." },
    { date: "2026-11-08", name: "Diwali / Lakshmi Puja", desc: "The festival of lights, celebrating the return of Lord Rama to Ayodhya." },
    { date: "2026-11-10", name: "Govardhan Puja", desc: "Commemorating Lord Krishna lifting the Govardhan hill to protect citizens of Vrindavan." },
    { date: "2026-11-11", name: "Bhai Dooj", desc: "Celebration of sibling bond where sisters pray for their brothers' well-being." },
    { date: "2026-11-15", name: "Chhath Puja", desc: "Rigorous ancient festival worshipping the Sun God (Surya) and Chhathi Maiya." },
    { date: "2026-11-24", name: "Kartika Purnima / Dev Diwali", desc: "Festival of gods, marked by lakhs of diyas lit at Ganga ghats." },
    { date: "2026-12-20", name: "Gita Jayanti", desc: "Anniversary of the day Lord Krishna delivered the sermon of Bhagavad Gita to Arjuna." },
  ],
  2027: [
    { date: "2027-01-15", name: "Makar Sankranti", desc: "Sun's transit into Capricorn, marking the end of winter solstice and harvest season." },
    { date: "2027-02-11", name: "Vasant Panchami", desc: "Auspicious day dedicated to Goddess Saraswati, the deity of knowledge, music, and art." },
    { date: "2027-03-06", name: "Maha Shivaratri", desc: "The Great Night of Lord Shiva, celebrated with night-long prayers, fasting, and rudrabhishek." },
    { date: "2027-03-21", name: "Holika Dahan", desc: "Celebrating the burning of demoness Holika, symbolizing the triumph of good over evil." },
    { date: "2027-03-22", name: "Holi", desc: "The vibrant festival of colors celebrating love, spring, and the playfulness of Lord Krishna." },
    { date: "2027-04-07", name: "Chaitra Navratri Begins", desc: "Hindu New Year (Vikram Samvat 2084) and the beginning of nine sacred nights of Goddess Durga." },
    { date: "2027-04-15", name: "Rama Navami", desc: "Birth anniversary of Lord Rama, the seventh incarnation of Lord Vishnu." },
    { date: "2027-04-20", name: "Hanuman Jayanti", desc: "Birth anniversary of Lord Hanuman, the epitome of devotion and strength." },
    { date: "2027-05-09", name: "Akshaya Tritiya", desc: "Highly auspicious day for new beginnings, purchases, and investments." },
    { date: "2027-05-14", name: "Sita Navami", desc: "Birth anniversary of Goddess Sita, celebrated with prayers and fasts." },
    { date: "2027-05-20", name: "Buddha Purnima", desc: "Birth, enlightenment, and death anniversary of Gautama Buddha." },
    { date: "2027-06-13", name: "Ganga Dussehra", desc: "The holy day when Goddess Ganga descended from heaven to Earth, celebrated with Ganga snan." },
    { date: "2027-06-14", name: "Nirjala Ekadashi", desc: "The most sacred and rigorous Ekadashi fast, observed without food or water." },
    { date: "2027-07-05", name: "Jagannath Rath Yatra", desc: "Grand chariot procession of Lord Jagannath, Balabhadra, and Subhadra in Puri." },
    { date: "2027-07-18", name: "Guru Purnima", desc: "Day dedicated to spiritual and academic gurus, commemorating Sage Vyasa." },
    { date: "2027-08-06", name: "Nag Panchami", desc: "Traditional worship of snakes and serpents offered with milk and prayers." },
    { date: "2027-08-13", name: "Hariyali Teej", desc: "Monsoon festival celebrating the union of Lord Shiva and Goddess Parvati." },
    { date: "2027-08-17", name: "Raksha Bandhan", desc: "Celebrating the sacred bond of love and protection between brothers and sisters." },
    { date: "2027-08-25", name: "Krishna Janmashtami", desc: "Birth anniversary of Lord Krishna, celebrated with midnight prayers and dahi handi." },
    { date: "2027-09-04", name: "Ganesh Chaturthi", desc: "Ten-day festival welcoming the elephant-headed deity Lord Ganesha to homes." },
    { date: "2027-09-14", name: "Anant Chaturdashi", desc: "The final day of Ganeshotsav, marked by immersion of Lord Ganesha idols." },
    { date: "2027-09-30", name: "Sharad Navratri Begins", desc: "Grand autumn festival of nine nights dedicated to Goddess Durga, major festivities at Vindhyachal." },
    { date: "2027-10-08", name: "Durga Ashtami", desc: "Maha Ashtami of Durga Puja, featuring Sandhi Puja and Kanya Pujan." },
    { date: "2027-10-09", name: "Vijayadashami / Dussehra", desc: "Celebration of Lord Rama's victory over Ravana and Goddess Durga's victory over Mahishasura." },
    { date: "2027-10-14", name: "Sharad Purnima", desc: "Harvest festival marked by moonlight kheer, worship of Goddess Lakshmi." },
    { date: "2027-10-18", name: "Karwa Chauth", desc: "Fasting ritual by married Hindu women for the safety and long life of their husbands." },
    { date: "2027-10-27", name: "Dhanteras", desc: "Worship of Lord Dhanvantari and purchasing gold, silver, or new utensils." },
    { date: "2027-10-29", name: "Diwali / Lakshmi Puja", desc: "The festival of lights, celebrating the return of Lord Rama to Ayodhya." },
    { date: "2027-10-30", name: "Govardhan Puja", desc: "Commemorating Lord Krishna lifting the Govardhan hill to protect citizens of Vrindavan." },
    { date: "2027-10-31", name: "Bhai Dooj", desc: "Celebration of sibling bond where sisters pray for their brothers' well-being." },
    { date: "2027-11-04", name: "Chhath Puja", desc: "Rigorous ancient festival worshipping the Sun God (Surya) and Chhathi Maiya." },
    { date: "2027-11-14", name: "Kartika Purnima / Dev Diwali", desc: "Festival of gods, marked by lakhs of diyas lit at Ganga ghats." },
    { date: "2027-12-09", name: "Gita Jayanti", desc: "Anniversary of the day Lord Krishna delivered the sermon of Bhagavad Gita to Arjuna." },
  ],
};

function formatFest(date: string) {
  return new Date(date + "T00:00:00").toLocaleDateString("en-IN", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function localDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function PanchangPage() {
  const [selectedDate, setSelectedDate] = useState(() => new Date());
  const [isManuallyChanged, setIsManuallyChanged] = useState(false);
  const [live, setLive] = useState<Record<string, string>>({});
  const [loadingLive, setLoadingLive] = useState(false);

  // Redesigned Festival Calendar state
  const [calendarYear, setCalendarYear] = useState<2026 | 2027>(() => {
    const currentYear = new Date().getFullYear();
    return (currentYear === 2026 || currentYear === 2027) ? (currentYear as 2026 | 2027) : 2026;
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState<"all" | "navratri" | "ekadashi" | "major">("all");

  const dateKey = localDateKey(selectedDate);
  const dateString = selectedDate.toLocaleDateString("en-IN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

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
    const p = panchangFor(selectedDate, sunrise);
    const m = muhuratFor(sunrise, sunset);
    const dateLabel =
      selectedDate.toLocaleDateString("en-IN", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      }) + " · Vindhyachal Dham";
    const samvat = p.samvat;
    return { sunrise, sunset, p, m, dateLabel, samvat };
  }, [dateString]);

  // Fetch live Panchang values. Calls Vercel API first, then falls back to proxy scraping.
  useEffect(() => {
    setLive({});
    setLoadingLive(true);

    const dateIso = dateKey;
    const sunriseApi = `https://api.sunrise-sunset.org/json?lat=${LAT}&lng=${LON}&date=${dateIso}&formatted=0`;

    const MONTH_NAMES = [
      "january", "february", "march", "april", "may", "june",
      "july", "august", "september", "october", "november", "december"
    ];
    const target = `https://www.prokerala.com/astrology/panchang/${selectedDate.getFullYear()}-${MONTH_NAMES[selectedDate.getMonth()]}-${selectedDate.getDate()}.html`;
    const proxies = ["https://api.allorigins.win/raw?url="];

    let active = true;

    const parseTimezoneDate = (dateString: string) => {
      const date = new Date(dateString);
      return fmtTime(new Date(date.toLocaleString("en-US", { timeZone: "Asia/Kolkata" })));
    };

    async function attemptFetch() {
      const out: Record<string, string> = {};

      // 1. Try Vercel Serverless Function (Primary, Server-side API bypasses CORS & blocks)
      try {
        console.log(`[Panchang] Fetching live data for ${dateIso} from /api/panchang`);
        const res = await fetch(`/api/panchang?date=${dateIso}`);
        if (res.ok) {
          const body = await res.json();
          if (body && body.data && Object.keys(body.data).length > 0) {
            console.log("[Panchang] Serverless API data loaded successfully:", body.data);
            if (active) {
              setLive(body.data);
              setLoadingLive(false);
              return;
            }
          }
        }
      } catch (err) {
        console.warn("[Panchang] Serverless API fetch failed, falling back to proxy:", err);
      }

      // 2. Secondary Fallback: Client-side Proxy Scraping
      try {
        const res = await fetch(
          `https://api.allorigins.win/raw?url=${encodeURIComponent(sunriseApi)}`
        );
        if (res.ok) {
          const body = await res.json();
          if (body.status === "OK" && body.results) {
            out["Sunrise"] = parseTimezoneDate(body.results.sunrise);
            out["Sunset"] = parseTimezoneDate(body.results.sunset);
          }
        }
      } catch (err) {
        console.warn("[Panchang] Secondary Sunrise API fetch failed:", err);
      }

      for (const proxy of proxies) {
        if (!active) return;
        try {
          const url = proxy + encodeURIComponent(target);
          const res = await fetch(url);
          if (!res.ok) continue;

          const html = await res.text();

          const cleanText = (text: string) => {
            if (!text) return "";
            return text
              .replace(/<[^>]+>/g, " ")
              .replace(/&nbsp;/gi, " ")
              .replace(/&ndash;/gi, "–")
              .replace(/&mdash;/gi, "—")
              .replace(/&amp;/gi, "&")
              .replace(/\s+/g, " ")
              .trim();
          };

          const parseBlockItems = (blockClass: string) => {
            const regex = new RegExp(
              `<div class="panchang-box-data-block[^"]*${blockClass}[^"]*">([\\s\\S]*?)<\\/div>`,
              "i"
            );
            const match = html.match(regex);
            if (!match) return [];

            const blockContent = match[1];
            const items: string[] = [];
            const liRegex = /<li[^>]*>([\s\S]*?)<\/li>/gi;
            let liMatch;
            while ((liMatch = liRegex.exec(blockContent)) !== null) {
              items.push(cleanText(liMatch[1]));
            }
            return items;
          };

          // 1. Tithi
          const tithis = parseBlockItems("panchang-data-tithi");
          if (tithis.length > 0) out["Tithi"] = tithis.join(" | ");

          // 2. Nakshatra
          const nakshatras = parseBlockItems("panchang-data-nakshatra");
          if (nakshatras.length > 0) out["Nakshatra"] = nakshatras.join(" | ");

          // 3. Yoga
          const yogas = parseBlockItems("panchang-data-yoga");
          if (yogas.length > 0) out["Yoga"] = yogas.join(" | ");

          // 4. Karana
          const karanas = parseBlockItems("panchang-data-karana");
          if (karanas.length > 0) out["Karana"] = karanas.join(" | ");

          // 5. Weekday
          const varas = parseBlockItems("panchang-data-vaasara");
          if (varas.length > 0) out["Weekday"] = varas[0];

          // 6. Vikram Samvat
          const dayItems = parseBlockItems("panchang-data-day");
          for (const item of dayItems) {
            if (item.includes("Vikram Samvat")) {
              out["Vikram Samvat"] = item.replace("Vikram Samvat -", "").trim();
            }
          }

          // 7. Chandramasa
          const lunarItems = parseBlockItems("panchang-data-lunar-month");
          for (const item of lunarItems) {
            if (item.includes("Purnimanta")) {
              out["Chandramasa"] = item.replace("Purnimanta -", "").trim();
            }
          }

          // 8. Sun & Moon timings
          const timings = parseBlockItems("panchang-data-sun_moon_timing");
          for (const t of timings) {
            if (t.includes("Sunrise")) out["Sunrise"] = t.replace("Sunrise -", "").trim();
            if (t.includes("Sunset")) out["Sunset"] = t.replace("Sunset -", "").trim();
            if (t.includes("Moonrise")) out["Moonrise"] = t.replace("Moonrise -", "").trim();
            if (t.includes("Moonset")) out["Moonset"] = t.replace("Moonset -", "").trim();
          }

          // 9. Rashi
          const suryaRasi = parseBlockItems("panchang-data-soorya-rasi");
          if (suryaRasi.length > 0) {
            out["Sunsign"] = suryaRasi[0].replace("Sun in ", "").trim();
          }
          const chandraRasi = parseBlockItems("panchang-data-chandra-rasi");
          if (chandraRasi.length > 0) {
            out["Moonsign"] = chandraRasi[0]
              .replace("Moon travels through ", "")
              .replace("Moon in ", "")
              .trim();
          }

          // 10. Auspicious periods
          const auspicious = parseBlockItems("panchang-data-auspicious-period");
          for (const item of auspicious) {
            if (item.includes("Abhijit Muhurat"))
              out["Abhijit"] = item.replace("Abhijit Muhurat -", "").trim();
            if (item.includes("Brahma Muhurat"))
              out["Brahma Muhurta"] = item.replace("Brahma Muhurat -", "").trim();
          }

          // 11. Inauspicious periods
          const inauspicious = parseBlockItems("panchang-data-inauspicious-period");
          for (const item of inauspicious) {
            if (item.includes("Rahu")) out["Rahu Kalam"] = item.replace("Rahu -", "").trim();
            if (item.includes("Yamaganda"))
              out["Yamaganda"] = item.replace("Yamaganda -", "").trim();
            if (item.includes("Gulika")) out["Gulikai Kalam"] = item.replace("Gulika -", "").trim();
          }

          // 12. Paksha
          if (html.toLowerCase().includes("sukla paksha")) {
            out["Paksha"] = "Sukla Paksha";
          } else if (html.toLowerCase().includes("krishna paksha")) {
            out["Paksha"] = "Krishna Paksha";
          }

          if (Object.keys(out).length > 0) {
            console.log("[Panchang] Live Prokerala data loaded via proxy:", out);
            if (active) {
              setLive(out);
              setLoadingLive(false);
              return;
            }
          }
        } catch (err) {
          console.warn(`[Panchang] Proxy ${proxy} failed:`, err);
        }
      }

      if (active) {
        if (Object.keys(out).length > 0) {
          setLive(out);
        }
        setLoadingLive(false);
      }
    }

    attemptFetch();
    return () => {
      active = false;
    };
  }, [dateString]);

  const pick = (k: string, fallback: string) => live[k] || fallback;

  const todayKey = dateKey;

  // Find current and next festivals based on active date
  const activeYear = selectedDate.getFullYear();
  const yearFestivals = ALL_FESTIVALS[activeYear] || ALL_FESTIVALS[2026];
  const todayFestival = yearFestivals.find((f) => f.date === todayKey);
  const upcoming = useMemo(() => {
    return yearFestivals.find((f) => f.date >= todayKey) || yearFestivals[0];
  }, [todayKey, yearFestivals]);

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

  const dateInputRef = useRef<HTMLInputElement | null>(null);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value) {
      const [year, month, day] = e.target.value.split("-").map(Number);
      setSelectedDate(new Date(year, month - 1, day));
      setIsManuallyChanged(true);
    }
  };

  const openDatePicker = () => {
    if (dateInputRef.current) {
      dateInputRef.current.showPicker?.();
      dateInputRef.current.focus();
    }
  };

  return (
    <PageShell>
      <PageHero
        sanskrit="॥ कालः सर्वस्य कारणम् ॥"
        title="Daily Panchang"
        subtitle={data.dateLabel}
      />

      <section className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8 sm:space-y-12 select-none">
        {/* Date Selector & Navigation controls */}
        <div className="max-w-xl mx-auto rounded-2xl border border-gold/30 bg-card p-4 sm:p-5 shadow-sacred flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 w-full sm:w-auto justify-between">
            <button
              onClick={() => changeDate(-1)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-gold/40 text-maroon hover:bg-gold/10 transition"
              title="Previous Day"
            >
              <ChevronLeft size={20} />
            </button>
            <span className="font-display font-semibold text-maroon text-center px-2 sm:px-4 text-sm sm:text-base">
              {selectedDate.toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
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
            <label htmlFor="panchang-datepicker" className="sr-only">
              Choose Date
            </label>
            <input
              id="panchang-datepicker"
              ref={dateInputRef}
              type="date"
              value={dateKey}
              onChange={handleDateChange}
              className="hide-native-date-icon px-4 py-2 rounded-lg border border-gold/30 bg-background text-maroon text-sm font-medium focus:outline-none focus:ring-1 focus:ring-gold w-full sm:w-44 cursor-pointer"
            />
            <button
              type="button"
              onClick={openDatePicker}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-2 text-gold/80 hover:bg-gold/10 transition"
              aria-label="Open date picker"
            >
              <Calendar size={16} />
            </button>
          </div>
        </div>

        {/* Today's Festival highlight - Entirely Orange Premium Saffron Gradient with Highly Visible Maroon Text */}
        <div
          key={dateKey + "_fest"}
          className="animate-fade-in rounded-2xl bg-gradient-saffron text-maroon p-5 sm:p-6 md:p-8 shadow-sacred flex flex-col md:flex-row md:items-center justify-between gap-4 border border-gold/40"
        >
          <div className="text-center md:text-left">
            <div className="text-xs uppercase tracking-widest text-maroon/70 font-bold">
              Selected Date
            </div>
            <h3 className="font-display text-xl sm:text-2xl md:text-3xl mt-1 text-maroon font-bold">
              {todayFestival
                ? todayFestival.name
                : `${pick("Tithi", `${data.p.paksha} ${data.p.tithiName}`)}`}
            </h3>
            <p className="text-maroon/90 text-sm mt-1 hidden sm:block">
              {todayFestival
                ? todayFestival.desc
                : `${pick("Nakshatra", data.p.nakshatra)} Nakshatra · ${pick("Yoga", data.p.yoga)} Yoga`}
            </p>
          </div>
          <div className="text-center md:text-right border-t border-maroon/20 md:border-t-0 pt-4 md:pt-0">
            <div className="text-xs uppercase tracking-widest text-maroon/70 font-bold">
              Upcoming Festival
            </div>
            <div className="font-display text-lg sm:text-xl mt-1 text-maroon font-bold">{upcoming.name}</div>
            <div className="text-maroon/90 text-sm">{formatFest(upcoming.date)}</div>
          </div>
        </div>

        {/* Today's Panchang Grid */}
        <div key={dateKey + "_details"} className="animate-fade-in">
          <div className="flex items-center gap-3 mb-4 sm:mb-6 justify-center sm:justify-start">
            <Clock className="text-saffron w-6 h-6 sm:w-7 sm:h-7" />
            <h2 className="font-display text-xl sm:text-2xl md:text-3xl text-maroon text-center sm:text-left">Panchang Details</h2>
            {loadingLive && (
              <span className="text-xs text-saffron animate-pulse bg-saffron/10 border border-saffron/20 px-2 py-0.5 rounded-full ml-auto">
                Updating Live...
              </span>
            )}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {panchangRows.map((row) => (
              <div
                key={row.label}
                className="rounded-xl bg-gradient-divine border border-gold/40 p-3 sm:p-4 shadow-gold flex flex-col sm:flex-row items-center sm:justify-between gap-2 sm:gap-3 hover:-translate-y-1 hover:shadow-sacred transition-all duration-300"
              >
                <span className="flex items-center gap-2 sm:gap-3 text-foreground/80 shrink-0">
                  <row.icon className="text-saffron w-4 h-4 sm:w-[18px] sm:h-[18px]" />
                  <span className="text-xs sm:text-sm font-medium">{row.label}</span>
                </span>
                <span className="font-semibold text-maroon text-center text-xs truncate max-w-full sm:max-w-[180px]">
                  {row.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Muhurat & Inauspicious */}
        <div key={dateKey + "_muhurats"} className="animate-fade-in grid sm:grid-cols-2 gap-4 sm:gap-6">
          <div className="rounded-2xl border border-gold/30 bg-cream/20 p-4 sm:p-6 shadow-sacred">
            <h3 className="font-display text-lg sm:text-xl text-maroon mb-3 sm:mb-4 flex items-center gap-2 border-b border-gold/20 pb-2">
              <Sparkles className="text-saffron w-[18px] h-[18px] sm:w-5 sm:h-5" /> Auspicious Muhurats
            </h3>
            <ul className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
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

          <div className="rounded-2xl border border-destructive/20 bg-background p-4 sm:p-6 shadow-sacred">
            <h3 className="font-display text-lg sm:text-xl text-maroon mb-3 sm:mb-4 flex items-center gap-2 border-b border-destructive/20 pb-2">
              <Clock className="text-destructive w-[18px] h-[18px] sm:w-5 sm:h-5" /> Inauspicious Timings
            </h3>
            <ul className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
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

        {/* Redesigned Festival Calendar Section */}
        <div className="pt-10 border-t-2 border-gold/20">
          <div className="flex flex-col items-center gap-2 mb-6 text-center">
            <div className="flex items-center gap-3 justify-center">
              <CalendarDays className="text-saffron w-7 h-7 sm:w-8 sm:h-8" size={28} />
              <h2 className="font-display text-2xl md:text-3xl text-maroon">
                Hindu Festival Calendar
              </h2>
            </div>
            <p className="text-muted-foreground max-w-2xl text-xs sm:text-sm">
              Explore major Hindu festivals, vrats, and auspicious days for 2026 and 2027. Plan your darshan at Vindhyachal Dham in advance.
            </p>
          </div>

          {/* Year Toggle Tabs */}
          <div className="flex justify-center gap-3 mb-6">
            <button
              onClick={() => {
                setCalendarYear(2026);
                setSearchQuery("");
                setFilterCategory("all");
              }}
              className={`px-6 py-2 rounded-full font-semibold border-2 text-sm transition-all duration-300 ${
                calendarYear === 2026
                  ? "bg-saffron text-cream border-saffron shadow-gold scale-105"
                  : "bg-background text-maroon border-gold/30 hover:border-gold/60 hover:bg-gold/5 cursor-pointer"
              }`}
            >
              Year 2026
            </button>
            <button
              onClick={() => {
                setCalendarYear(2027);
                setSearchQuery("");
                setFilterCategory("all");
              }}
              className={`px-6 py-2 rounded-full font-semibold border-2 text-sm transition-all duration-300 ${
                calendarYear === 2027
                  ? "bg-saffron text-cream border-saffron shadow-gold scale-105"
                  : "bg-background text-maroon border-gold/30 hover:border-gold/60 hover:bg-gold/5 cursor-pointer"
              }`}
            >
              Year 2027
            </button>
          </div>

          {/* Search and Category Filters */}
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-8 max-w-4xl mx-auto bg-card border border-gold/20 p-4 rounded-2xl shadow-sm">
            <div className="relative w-full md:max-w-xs shrink-0">
              <input
                type="text"
                placeholder="Search festival (e.g. Holi, Diwali)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-gold/30 bg-background text-maroon placeholder:text-maroon/40 focus:outline-none focus:ring-1 focus:ring-saffron text-sm transition-all"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-saffron w-4 h-4" />
            </div>

            <div className="flex flex-wrap gap-1.5 w-full md:w-auto justify-center md:justify-end">
              {(["all", "navratri", "ekadashi", "major"] as const).map((cat) => {
                const labels = {
                  all: "All",
                  navratri: "Navratri Specials",
                  ekadashi: "Vrats & Ekadashi",
                  major: "Major Festivals",
                };
                return (
                  <button
                    key={cat}
                    onClick={() => setFilterCategory(cat)}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold border transition-all duration-200 cursor-pointer ${
                      filterCategory === cat
                        ? "bg-saffron/10 border-saffron text-maroon font-bold"
                        : "bg-background border-gold/20 text-foreground/80 hover:bg-gold/5"
                    }`}
                  >
                    {labels[cat]}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Festival List / Cards */}
          <div className="rounded-2xl border border-gold/40 overflow-hidden shadow-sacred bg-background max-w-4xl mx-auto">
            <div className="max-h-[600px] overflow-y-auto scrollbar-none divide-y divide-gold/15">
              {(() => {
                const MONTHS = [
                  "January", "February", "March", "April", "May", "June",
                  "July", "August", "September", "October", "November", "December"
                ];

                const calendarFestivals = ALL_FESTIVALS[calendarYear] || ALL_FESTIVALS[2026];
                const filteredList = calendarFestivals.filter((f) => {
                  const matchesSearch =
                    f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    f.desc.toLowerCase().includes(searchQuery.toLowerCase());
                  if (!matchesSearch) return false;

                  if (filterCategory === "all") return true;
                  if (filterCategory === "navratri") {
                    return (
                      f.name.toLowerCase().includes("navratri") ||
                      f.name.toLowerCase().includes("ashtami") ||
                      f.name.toLowerCase().includes("dussehra") ||
                      f.name.toLowerCase().includes("vijayadashami")
                    );
                  }
                  if (filterCategory === "ekadashi") {
                    return (
                      f.name.toLowerCase().includes("ekadashi") ||
                      f.name.toLowerCase().includes("chauth") ||
                      f.name.toLowerCase().includes("teej") ||
                      f.name.toLowerCase().includes("vrat")
                    );
                  }
                  if (filterCategory === "major") {
                    const majors = [
                      "diwali", "holi", "shivaratri", "janmashtami", "ganesh",
                      "sankranti", "chhath", "dev diwali"
                    ];
                    return majors.some((m) => f.name.toLowerCase().includes(m));
                  }
                  return true;
                });

                if (filteredList.length === 0) {
                  return (
                    <div className="p-8 text-center text-muted-foreground text-sm">
                      No festivals found matching your filters.
                    </div>
                  );
                }

                return MONTHS.map((month, monthIdx) => {
                  const monthFestivals = filteredList.filter((f) => {
                    const festDate = new Date(f.date + "T00:00:00");
                    return festDate.getMonth() === monthIdx;
                  });

                  if (monthFestivals.length === 0) return null;

                  return (
                    <div key={month} className="border-b border-gold/15 last:border-b-0">
                      {/* Month Header Banner */}
                      <div className="bg-gradient-divine border-b border-gold/20 text-maroon px-5 py-3 sticky top-0 z-10 flex items-center justify-between">
                        <h3 className="font-display text-base md:text-lg font-bold uppercase tracking-wider">
                          {month}
                        </h3>
                        <span className="text-xs font-semibold bg-saffron/15 text-saffron px-2 py-0.5 rounded-full">
                          {monthFestivals.length} {monthFestivals.length === 1 ? "Festival" : "Festivals"}
                        </span>
                      </div>

                      {/* Month Festivals Grid */}
                      <div className="divide-y divide-gold/10 bg-card/10">
                        {monthFestivals.map((f) => {
                          const isPast = f.date < selectedDate.toISOString().slice(0, 10);
                          const isToday = f.date === selectedDate.toISOString().slice(0, 10);
                          const fDate = new Date(f.date + "T00:00:00");
                          
                          return (
                            <div
                              key={f.date + f.name}
                              className={`group px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all duration-300 hover:bg-gold/5 ${
                                isToday ? "bg-saffron/5 border-l-4 border-saffron" : ""
                              } ${isPast && !isToday ? "opacity-60" : ""}`}
                            >
                              <div className="flex items-center gap-4 w-full sm:w-auto">
                                {/* Date Badge */}
                                <div className="flex flex-col items-center justify-center shrink-0 w-14 h-14 rounded-xl border border-gold/30 bg-background text-maroon group-hover:border-saffron group-hover:bg-saffron/5 transition-all shadow-sm">
                                  <span className="text-lg font-bold font-display leading-none">
                                    {fDate.getDate()}
                                  </span>
                                  <span className="text-[9px] uppercase font-bold tracking-wider mt-1 text-saffron">
                                    {fDate.toLocaleDateString("en-US", { month: "short" })}
                                  </span>
                                </div>

                                <div className="flex flex-col gap-0.5">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <h4 className="text-sm sm:text-base font-semibold text-foreground group-hover:text-maroon transition-colors">
                                      {f.name}
                                    </h4>
                                    {isToday && (
                                      <span className="text-[8px] bg-saffron text-cream px-2 py-0.5 rounded-full uppercase tracking-wider font-bold animate-pulse">
                                        Today
                                      </span>
                                    )}
                                  </div>
                                  {/* Mobile Description */}
                                  <p className="text-xs text-muted-foreground block md:hidden line-clamp-2 mt-1">
                                    {f.desc}
                                  </p>
                                </div>
                              </div>

                              {/* Desktop Description / Mobile Description */}
                              <div className="flex-1 max-w-md px-0 sm:px-4">
                                <p className="text-xs text-muted-foreground leading-relaxed hidden md:block line-clamp-2">
                                  {f.desc}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                });
              })()}
            </div>
          </div>

          <p className="mt-4 text-[10px] text-muted-foreground italic text-center">
            Panchang parameters calculated using local coordinates for Vindhyachal Dham (25.15°N,
            82.5°E) and synchronized in real-time with verified Panchang records.
          </p>
        </div>
      </section>
    </PageShell>
  );
}
