import { createFileRoute } from "@tanstack/react-router";
import { PageShell, PageHero } from "@/components/PageShell";
import { useState, useMemo, useEffect, useRef } from "react";
import {
  Sun,
  Sunset,
  Sunrise,
  Clock,
  Sparkles,
  CalendarDays,
  Search,
  ChevronLeft,
  ChevronRight,
  Filter,
  Download,
  Calendar,
  BookOpen,
  Info,
  User,
  Heart,
  ExternalLink,
  Flame,
  ArrowRight,
  X,
  Sparkle
} from "lucide-react";
import { useLang } from "@/i18n/LangProvider";
import { ScrollReveal } from "@/components/ScrollReveal";

import data2023 from "../data/festivals/2023.json";
import data2024 from "../data/festivals/2024.json";
import data2025 from "../data/festivals/2025.json";
import data2026 from "../data/festivals/2026.json";
import data2027 from "../data/festivals/2027.json";
import data2028 from "../data/festivals/2028.json";
import { JsonLd } from "@/components/JsonLd";

export const Route = createFileRoute("/calendar")({
  head: () => ({
    meta: [
      { title: "Calendar & Festival Guide (2023-2028) | Namami Vindhyavasini Sansthan" },
      {
        name: "description",
        content:
          "Explore festivals, vrats, Ekadashi, Purnima, Amavasya, Navratri, and sacred observances from 2023–2028 on the Namami Vindhyavasini Sansthan Calendar.",
      },
      {
        name: "keywords",
        content:
          "Calendar, Festival Guide, Ekadashi dates, Purnima vrats, Amavasya dates, Navratri calendar, Hindu festivals, calendar, त्योहार, व्रत, कैलेंडर",
      },
      { property: "og:title", content: "Calendar & Festival Guide (2023-2028) | Namami Vindhyavasini Sansthan" },
      {
        property: "og:description",
        content:
          "Explore festivals, vrats, Ekadashi, Purnima, Amavasya, Navratri, and sacred observances from 2023–2028.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://www.namamivindhyavasini.in/calendar" },
      { property: "og:image", content: "https://www.namamivindhyavasini.in/maa-vindhyavasini.png" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Calendar & Festival Guide (2023-2028)" },
      {
        name: "twitter:description",
        content:
          "Explore festivals, vrats, Ekadashi, Purnima, Amavasya, and sacred observances.",
      },
      { name: "twitter:image", content: "https://www.namamivindhyavasini.in/maa-vindhyavasini.png" },
    ],
    links: [
      { rel: "canonical", href: "https://www.namamivindhyavasini.in/calendar" }
    ]
  }),
  component: HinduCalendarPage,
});

const FESTIVALS_BY_YEAR: Record<number, any[]> = {
  2023: data2023,
  2024: data2024,
  2025: data2025,
  2026: data2026,
  2027: data2027,
  2028: data2028,
};

const SPECIAL_FESTIVAL_DETAILS: Record<string, {
  deity: string;
  significance: string;
  story: string;
  rituals: string;
  fasting: string;
  celebration: string;
  templeRelevance: string;
  related: string;
  banner: string;
}> = {
  "Chaitra Navratri": {
    deity: "Maa Durga",
    significance: "Marks the beginning of the Hindu New Year (Vikram Samvat) and celebrates the nine forms of Goddess Durga (Navadurga) during the spring season.",
    story: "It is believed that Lord Rama worshipped Goddess Durga during this period to seek her blessings before his battle with Ravana.",
    rituals: "Ghatasthapana (installation of sacred pot), fastings for nine days, chanting Durga Saptashati, and performing Kanya Pujan on Ashtami/Navami.",
    fasting: "Observe strict fast. Avoid grains, wheat, rice, onions, garlic, and non-vegetarian food. Consume fruits, milk, buckwheat (Kuttu) flour, and water.",
    celebration: "Homes and temples are decorated. Special prayers, kirtans, and pujas are organized daily.",
    templeRelevance: "Vindhyachal Dham becomes a major pilgrimage hub, with lakhs of devotees performing the Trikona Parikrama and visiting Maa Vindhyavasini.",
    related: "Ram Navami",
    banner: "https://images.unsplash.com/photo-1561361513-2d000a50f0db?auto=format&fit=crop&q=80&w=1200"
  },
  "Sharad Navratri": {
    deity: "Maa Durga",
    significance: "The most important Navratri of the year, celebrating the victory of Goddess Durga over the demon king Mahishasura.",
    story: "Goddess Durga fought Mahishasura for nine nights and slew him on the tenth day, which is celebrated as Vijayadashami (Dussehra).",
    rituals: "Daily shringar of the Devi, Akhand Jyoti lighting, Ramlila plays, and grand immersion of idols on Dussehra.",
    fasting: "Sattvic diet, fasting from grains, wheat, and onions. Singhaare ka atta, Sabudana khichdi, and samak rice are consumed.",
    celebration: "Garba and Dandiya dances, elaborate pandals, and community feasts.",
    templeRelevance: "This is the flagship festival of Vindhyachal Temple. The entire temple town is illuminated, and special state-sponsored arrangements are made for darshan.",
    related: "Durga Ashtami, Dussehra",
    banner: "https://images.unsplash.com/photo-1608958416715-c266946bf861?auto=format&fit=crop&q=80&w=1200"
  },
  "Maha Shivratri": {
    deity: "Lord Shiva",
    significance: "Celebrates the grand marriage of Lord Shiva and Goddess Parvati, and the night Shiva performed the Tandava dance.",
    story: "Shiva saved the world by consuming the poison Halahala that emerged during Samudra Manthan, holding it in his throat making him Neelkanth.",
    rituals: "Night-long vigil (Jagran), Maha Rudrabhishek with milk, honey, water, and belpatra offering.",
    fasting: "Fasting on fruits and water. Many devotees observe a completely waterless (Nirjala) fast.",
    celebration: "Grand processions of Shiva (Shobhayatras), temple visits, and continuous chanting of 'Om Namah Shivaya'.",
    templeRelevance: "Devotees perform special Abhishek at the Kashi Vishwanath and Vindhyachal shrines.",
    related: "Pradosh Vrat",
    banner: "https://images.unsplash.com/photo-1590050752117-238cb0612b1b?auto=format&fit=crop&q=80&w=1200"
  },
  "Ram Navami": {
    deity: "Lord Rama",
    significance: "Birth anniversary of Lord Sri Rama, the seventh avatar of Lord Vishnu, symbolizing the ideal human (Maryada Purushottam).",
    story: "Lord Rama was born in Ayodhya to King Dasharatha and Queen Kausalya to destroy the demon king Ravana and establish Ramrajya.",
    rituals: "Reading Ramayana, performing Ram Janmotsav at noon, special abhishek and offering panchamrit.",
    fasting: "Observe fast till noon or throughout the day, eating only fruits and milk.",
    celebration: "Chanting Rama Nama, organizing chariot processions (Rathayatras), and distributing panchamrit prasad.",
    templeRelevance: "Vindhyachal temple is beautifully decorated and a special mid-day aarti is performed.",
    related: "Chaitra Navratri",
    banner: "https://images.unsplash.com/photo-1620121692029-d088224ddc74?auto=format&fit=crop&q=80&w=1200"
  },
  "Krishna Janmashtami": {
    deity: "Lord Krishna",
    significance: "Birth anniversary of Lord Sri Krishna, the eighth avatar of Lord Vishnu, born to eliminate Kansa.",
    story: "Lord Krishna was born in the prison cell of Mathura to Devaki and Vasudeva. He was secretly transported to Gokul to be raised by Yashoda.",
    rituals: "Fasting until midnight (the exact time of birth), decorating infant Krishna (Ladoo Gopal) in swing (Jhulan), and midnight aarti.",
    fasting: "Phalahar fast until midnight. No grains. Singhaare ki puri, potato curry, and panjiri are consumed after breaking the fast.",
    celebration: "Dahi Handi competitions, devotional dramas (Raslila), and singing bhajans.",
    templeRelevance: "Grand midnight celebrations are held at the temple, featuring a unique shringar of Maa Vindhyavasini as Yogmaya.",
    related: "Radhashtami",
    banner: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&q=80&w=1200"
  },
  "Diwali": {
    deity: "Maha Lakshmi & Lord Rama",
    significance: "Festival of lights celebrating the return of Lord Rama to Ayodhya after 14 years of exile, and the worship of Goddess Lakshmi for prosperity.",
    story: "Ayodhya citizens lit rows of clay lamps (diyas) to welcome Rama, Lakshmana, and Sita back home in the dark night of Kartika Amavasya.",
    rituals: "Ganesh-Lakshmi Puja, lighting oil diyas around the house, making colorful rangoli, and distributing sweets.",
    fasting: "Devotees observe a fast during the day and break it after performing the Lakshmi Puja in the evening.",
    celebration: "Decorating homes with lights, family gatherings, and sharing gifts.",
    templeRelevance: "The main Vindhyavasini temple and surrounding ghats on the Ganges are lit with thousands of clay lamps.",
    related: "Dhanteras, Bhai Dooj",
    banner: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&q=80&w=1200"
  },
  "Holi": {
    deity: "Lord Krishna & Vishnu",
    significance: "Festival of colors celebrating the arrival of spring, victory of good over evil, and the divine love of Radha-Krishna.",
    story: "Lord Vishnu saved his devotee Prahlada from the fire while the demoness Holika was burned, demonstrating that faith overcomes evil.",
    rituals: "Lighting the Holika Dahan bonfire on the eve, throwing dry colors (Gulal), and preparation of special sweets.",
    fasting: "No strict fasting is required, though some perform prayers in the morning before playing with colors.",
    celebration: "Applying colors on friends and family, singing folk songs (Holi Geets), and sharing Gujiya.",
    templeRelevance: "A grand color-offering (Phoolon ki Holi) is made to Maa Vindhyavasini.",
    related: "Holika Dahan",
    banner: "https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?auto=format&fit=crop&q=80&w=1200"
  },
  "Guru Purnima": {
    deity: "Sage Vyasa & Gurus",
    significance: "Honoring academic and spiritual teachers (Gurus) who guide us from darkness (Gu) to light (Ru).",
    story: "Marks the birth anniversary of Sage Veda Vyasa, who classified the Vedas, wrote the Mahabharata, and compiled the Puranas.",
    rituals: "Performing Guru Puja, seeking blessings from parents and elders, and studying spiritual texts.",
    fasting: "Observe a light fast, consuming fruits and milk, or a single vegetarian meal.",
    celebration: "Offering flowers and gifts to teachers, organizing satsangs, and chanting Guru mantras.",
    templeRelevance: "Pilgrims visit Vindhyachal Dham to express gratitude to the lineage of gurus and Pujya Guru Ji.",
    related: "Vyas Puja",
    banner: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=1200"
  },
  "Hanuman Jayanti": {
    deity: "Lord Hanuman",
    significance: "Birth anniversary of Lord Hanuman, the epitome of selfless service, strength, and unwavering devotion to Lord Rama.",
    story: "Hanuman was born to Anjana and Kesari with the blessings of Pawan Dev (Wind God) as an incarnation of Lord Shiva.",
    rituals: "Reciting Hanuman Chalisa, Sundarkand path, and offering orange sindoor and ladoos to Hanuman idols.",
    fasting: "Many observe a strict fast on this day, consuming only water or fruits.",
    celebration: "Group chanting of Hanuman Chalisa at temples, distributing prasad, and organizing free community feasts (Bhandara).",
    templeRelevance: "Special prayers are offered at the Ashtabhuja and Hanuman temples in the parikrama circuit.",
    related: "Bada Mangal",
    banner: "https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?auto=format&fit=crop&q=80&w=1200"
  },
  "Durga Ashtami": {
    deity: "Maa Durga",
    significance: "The eighth day of Sharad Navratri, representing the manifestation of Maha Gauri, the eighth form of Navadurga.",
    story: "On this day, Goddess Durga manifested in her full power to slay the demons Chanda and Munda, emerging as Chamunda.",
    rituals: "Performing Sandhi Puja (at the transition of Ashtami and Navami), Kanya Pujan (worshipping nine young girls as forms of the Goddess).",
    fasting: "Strict fast for devotees. Feasts are prepared for Kanya Pujan and offered as prasad.",
    celebration: "Grand aartis, offering red chunri and coconut, and performing Havan (fire ritual).",
    templeRelevance: "This is the most popular day for devotees visiting Vindhyachal, with serpentine queues extending for kilometers.",
    related: "Navami Puja",
    banner: "https://images.unsplash.com/photo-1614082242765-7c98cdc0d2db?auto=format&fit=crop&q=80&w=1200"
  },
  "Ganesh Chaturthi": {
    deity: "Lord Ganesha",
    significance: "Birth celebration of Lord Ganesha, the lord of wisdom, prosperity, and the remover of obstacles (Vighnaharta).",
    story: "Goddess Parvati created Ganesha out of clay to guard her door. Lord Shiva later bestowed him with an elephant head and declared him the leader of the Ganas.",
    rituals: "Prana Pratishtha (bringing the deity to life), offering Modaks (sweet dumplings), durva grass, and red flowers.",
    fasting: "Fast is observed during the day and broken in the evening after moonrise or after performing Ganesha Puja.",
    celebration: "Installing Ganesha idols in homes and public pandals, followed by a grand immersion (Visarjan) procession after 1 to 11 days.",
    templeRelevance: "Prayers are offered at Ganesha shrines in Vindhyachal before commencing the parikrama.",
    related: "Anant Chaturdashi",
    banner: "https://images.unsplash.com/photo-1567591906919-efe0c85ccb16?auto=format&fit=crop&q=80&w=1200"
  },
  "Raksha Bandhan": {
    deity: "Lord Krishna & Ganesha",
    significance: "Celebrating the sacred bond of protection and love between brothers and sisters.",
    story: "Draupadi tied a strip of her saree on Krishna's bleeding finger, and Krishna promised to protect her in times of distress.",
    rituals: "Sisters tie a decorative thread (Rakhi) on their brothers' wrists, perform aarti, and pray for their long life.",
    fasting: "Sisters fast until they tie the Rakhi on their brothers' wrists.",
    celebration: "Exchanging gifts, family dinners, and sharing traditional sweets like Ghevar.",
    templeRelevance: "Devotees tie Rakhis to Maa Vindhyavasini and pray for family protection.",
    related: "Shravani Upakarma",
    banner: "https://images.unsplash.com/photo-1595062584113-e0bfc26f332d?auto=format&fit=crop&q=80&w=1200"
  }
};

const CATEGORIES = [
  { id: "all", label: "All Festivals", hi: "सभी त्योहार" },
  { id: "major", label: "Major Festivals", hi: "प्रमुख त्योहार" },
  { id: "ekadashi", label: "Ekadashi", hi: "एकादशी" },
  { id: "purnima", label: "Purnima", hi: "पूर्णिमा" },
  { id: "amavasya", label: "Amavasya", hi: "अमावस्या" },
  { id: "navratri", label: "Navratri", hi: "नवरात्रि" },
  { id: "vrats", label: "Vrats", hi: "व्रत व उपवास" }
];

const YEARS = [2023, 2024, 2025, 2026, 2027, 2028];

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];
const MONTHS_HI = [
  "जनवरी", "फ़रवरी", "मार्च", "अप्रैल", "मई", "जून",
  "जुलाई", "अगस्त", "सितंबर", "अक्टूबर", "नवंबर", "दिसंबर"
];

function getHinduMonth(date: Date, yearData: any[]): string {
  const purnimas = yearData
    .filter((f) => f.category === "Purnima")
    .map((f) => ({
      dateStr: f.date,
      monthName: f.festival.replace(" Purnima", "").replace(" Kartik", "Kartika")
    }));

  purnimas.sort((a, b) => a.dateStr.localeCompare(b.dateStr));

  const targetDateStr = date.toISOString().split("T")[0];
  const targetPurnima = purnimas.find((p) => p.dateStr >= targetDateStr);

  if (targetPurnima) {
    return targetPurnima.monthName;
  }

  if (purnimas.length > 0) {
    return purnimas[purnimas.length - 1].monthName;
  }

  return "Chaitra";
}

function fmtTime(d: Date): string {
  return d.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZone: "Asia/Kolkata",
  });
}

function downloadCalendarPdf(year: number, festivals: any[]) {
  const printWindow = window.open("", "_blank");
  if (printWindow) {
    const festRows = festivals.map((f) => {
      const fDate = new Date(f.date + "T00:00:00");
      const formattedDate = fDate.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
        weekday: "short"
      });
      return `
        <tr>
          <td style="padding: 10px; border: 1px solid #e2d2b4; font-weight: bold; width: 20%;">${formattedDate}</td>
          <td style="padding: 10px; border: 1px solid #e2d2b4; font-weight: bold; color: #7a1e1e; width: 30%;">${f.festival}</td>
          <td style="padding: 10px; border: 1px solid #e2d2b4; font-style: italic; width: 15%; color: #d97706;">${f.category}</td>
          <td style="padding: 10px; border: 1px solid #e2d2b4; font-size: 13px; width: 35%;">${f.description}</td>
        </tr>
      `;
    }).join("");

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Namami Vindhyavasini Hindu Calendar - ${year}</title>
          <style>
            body { font-family: 'Noto Sans Devanagari', 'Inter', sans-serif; background-color: #fff; color: #3f3f46; padding: 30px; }
            .header { text-align: center; border-bottom: 3px double #7a1e1e; padding-bottom: 15px; margin-bottom: 20px; }
            h1 { color: #7a1e1e; margin: 0; font-size: 28px; }
            h2 { color: #d97706; margin: 5px 0 0 0; font-size: 18px; font-weight: normal; letter-spacing: 2px; }
            .meta { text-align: center; font-size: 12px; color: #71717a; margin-bottom: 25px; }
            table { width: 100%; border-collapse: collapse; border: 1px solid #e2d2b4; }
            th { background-color: #7a1e1e; color: #fff; padding: 12px; border: 1px solid #7a1e1e; text-align: left; font-size: 14px; }
            tr:nth-child(even) { background-color: #fdfaf4; }
            .footer-note { text-align: center; font-size: 11px; margin-top: 30px; border-top: 1px solid #e2d2b4; padding-top: 15px; color: #a1a1aa; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Namami Vindhyavasini Sansthan</h1>
            <h2>HINDU FESTIVAL & VRAT CALENDAR — ${year}</h2>
          </div>
          <div class="meta">
            Calculated for coordinates of Vindhyachal Dham, Uttar Pradesh (25.1575° N, 82.5800° E)
          </div>
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Festival / Vrat</th>
                <th>Category</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              ${festRows}
            </tbody>
          </table>
          <div class="footer-note">
            © ${new Date().getFullYear()} Namami Vindhyavasini Sansthan ✦ Jai Maa Vindhyavasini ✦ Dynamic calendar export.
          </div>
          <script>
            window.onload = function() {
              window.print();
              setTimeout(function() { window.close(); }, 500);
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  }
}

export function HinduCalendarPage() {
  const { lang } = useLang();
  const isHi = lang === "hi";

  const [selectedYear, setSelectedYear] = useState<number>(() => {
    const currentYear = new Date().getFullYear();
    return YEARS.includes(currentYear) ? currentYear : 2026;
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedFestival, setSelectedFestival] = useState<any | null>(null);
  const [todayDate, setTodayDate] = useState(() => new Date());

  // Auto-updating today's date
  useEffect(() => {
    const interval = setInterval(() => {
      setTodayDate(new Date());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  // Load calendar datasets based on year selection
  const yearFestivals = useMemo(() => {
    return FESTIVALS_BY_YEAR[selectedYear] || data2026;
  }, [selectedYear]);

  // Filtered festivals for search & categories
  const filteredFestivals = useMemo(() => {
    return yearFestivals.filter((f) => {
      // Search match (matches festival name only)
      const query = searchQuery.trim().toLowerCase();
      const matchesSearch = f.festival.toLowerCase().includes(query);

      if (!matchesSearch) return false;

      // Month match
      if (selectedMonth) {
        const fDate = new Date(f.date + "T00:00:00");
        const monthName = MONTHS[fDate.getMonth()];
        if (monthName !== selectedMonth) return false;
      }

      // Category match
      if (activeCategory === "all") return true;
      if (activeCategory === "major") return f.category === "Major Festival" || f.importance === "High";
      if (activeCategory === "ekadashi") return f.category === "Ekadashi";
      if (activeCategory === "purnima") return f.category === "Purnima";
      if (activeCategory === "amavasya") return f.category === "Amavasya";
      if (activeCategory === "navratri") return f.category === "Navratri" || f.festival.includes("Navratri");
      if (activeCategory === "vrats") {
        const vratKeywords = ["vrat", "upavas", "fasting", "chaturthi", "pradosh", "sankashti", "karwa", "teej", "ahoi", "chhath", "somwar", "varalakshmi"];
        return f.category === "Vrats" || vratKeywords.some(kw => f.festival.toLowerCase().includes(kw));
      }

      return true;
    });
  }, [yearFestivals, searchQuery, activeCategory, selectedMonth]);

  // Identify next upcoming festival
  const upcomingFestival = useMemo(() => {
    const todayStr = todayDate.toISOString().split("T")[0];
    const currentYear = todayDate.getFullYear();
    const data = FESTIVALS_BY_YEAR[currentYear] || data2026;
    
    const found = data.find((f) => f.date >= todayStr);
    if (found) return found;

    // Fallback to first of next year
    const nextYearData = FESTIVALS_BY_YEAR[currentYear + 1];
    if (nextYearData && nextYearData.length > 0) return nextYearData[0];

    return data[0];
  }, [todayDate]);

  const handleMonthChange = (monthVal: string) => {
    setSelectedMonth(monthVal);
    if (monthVal) {
      setTimeout(() => {
        const element = document.getElementById(`month-${monthVal.toLowerCase()}`);
        if (element) {
          const yOffset = -100;
          const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
          window.scrollTo({ top: y, behavior: "smooth" });
        }
      }, 60);
    }
  };

  // Monthly grouping of timeline festivals
  const timelineGroups = useMemo(() => {
    const groups: Record<string, any[]> = {};
    const months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];

    filteredFestivals.forEach((f) => {
      const fDate = new Date(f.date + "T00:00:00");
      const monthName = months[fDate.getMonth()];
      if (!groups[monthName]) {
        groups[monthName] = [];
      }
      groups[monthName].push(f);
    });

    return groups;
  }, [filteredFestivals]);

  // Click festival handler
  const handleFestivalClick = (f: any) => {
    // Lookup extra static modal detail data if available
    const extra = SPECIAL_FESTIVAL_DETAILS[f.festival] || SPECIAL_FESTIVAL_DETAILS[f.festival.replace(/ Begins$/, "")];
    
    setSelectedFestival({
      ...f,
      extraDeity: extra ? extra.deity : f.deity || "Sanatan Devata",
      extraSignificance: extra ? extra.significance : f.description,
      extraStory: extra ? extra.story : (isHi ? "प्राचीन शास्त्रों और लोक कथाओं के अनुसार पूजनीय।" : "Venerated according to scriptural records and ancient traditions."),
      extraRituals: extra ? extra.rituals : f.rituals || (isHi ? "देवी-देवताओं का पूजन अर्चन एवं दीप प्रज्वलन।" : "Devotional worship, temple offerings, and lighting of lamps."),
      extraFasting: extra ? extra.fasting : f.fasting || (isHi ? "सत्त्विक भोजन का सेवन करें।" : "Observe light fast or consume sattvic food."),
      extraCelebration: extra ? extra.celebration : (isHi ? "घरों एवं मंदिरों में हर्षोल्लास से मनाया जाता है।" : "Celebrated with joy in homes and temples."),
      extraTempleRelevance: extra ? extra.templeRelevance : (isHi ? "माँ विन्ध्यवासिनी धाम में विशेष आरती एवं श्रृंगार दर्शन।" : "Special aarti, decorative shringar, and continuous darshan at Vindhyachal temple."),
      extraRelated: extra ? extra.related : "Ekadashi Vrat",
      bannerImage: extra ? extra.banner : "https://images.unsplash.com/photo-1602631985686-2bb0f3010ad5?auto=format&fit=crop&q=80&w=1200"
    });
  };

  const webpageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": "https://www.namamivindhyavasini.in/calendar#webpage",
    "url": "https://www.namamivindhyavasini.in/calendar",
    "name": "Hindu Calendar & Festival Guide (2023-2028) | Vindhyachal Timings",
    "description": "Explore Hindu festivals, vrats, Ekadashi, Purnima, Amavasya, Navratri, and sacred observances from 2023–2028 with local spiritual timings for Vindhyachal Dham.",
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
        "name": "Hindu Calendar",
        "item": "https://www.namamivindhyavasini.in/calendar"
      }
    ]
  };

  return (
    <PageShell>
      <JsonLd data={webpageSchema} />
      <JsonLd data={breadcrumbSchema} />
      <PageHero
        sanskrit="॥ तिथिर्विष्णुस्तथा वारो नक्षत्रं विष्णुरेव च ॥"
        title={isHi ? "कैलेंडर" : "Calendar"}
        subtitle={
          isHi
            ? "संवत २०२३-२०२८ के त्योहारों, व्रतों, एकादशी, पूर्णिमा, अमावस्या और पवित्र नवरात्रों की सूची।"
            : "Explore festivals, vrats, Ekadashi, Purnima, Amavasya, Navratri, and sacred observances from 2023–2028."
        }
      />

      <div className="container mx-auto px-4 sm:px-6 py-10 space-y-12">
        {/* Simplified Today Overview Card */}
        <section className="max-w-3xl mx-auto w-full">
          <div className="rounded-3xl bg-gradient-to-br from-maroon via-maroon to-saffron/95 p-8 text-cream shadow-sacred relative overflow-hidden border border-gold/30">
            <div className="absolute inset-0 mandala-bg opacity-15" />
            <div className="relative z-10 grid md:grid-cols-2 gap-6 items-center">
              <div className="space-y-2 text-center md:text-left">
                <div className="text-xs uppercase tracking-widest text-gold font-bold">
                  {isHi ? "आज की तिथि" : "Today's Date"}
                </div>
                <h3 className="text-2xl sm:text-3xl font-display font-bold text-cream">
                  {todayDate.toLocaleDateString(isHi ? "hi-IN" : "en-IN", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </h3>
              </div>

              {upcomingFestival && (
                <div className="border-t md:border-t-0 md:border-l border-cream/20 pt-4 md:pt-0 md:pl-6 space-y-2 text-center md:text-left">
                  <div className="text-xs uppercase tracking-wider text-gold font-bold">
                    {isHi ? "आगामी त्योहार" : "Upcoming Festival"}
                  </div>
                  <div className="font-display text-xl sm:text-2xl font-bold text-cream leading-tight">
                    {upcomingFestival.festival}
                  </div>
                  <div className="text-sm text-cream/90 font-medium">
                    {new Date(upcomingFestival.date + "T00:00:00").toLocaleDateString(
                      isHi ? "hi-IN" : "en-IN",
                      { day: "numeric", month: "long", year: "numeric", weekday: "short" }
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Unified Calendar Control Dashboard Card */}
        <section className="bg-card border border-gold/20 p-6 sm:p-8 rounded-3xl shadow-sm space-y-6 max-w-2xl mx-auto w-full">
          <div className="flex flex-col items-center space-y-4 w-full">
            {/* Search Input */}
            <div className="relative w-full max-w-md">
              <input
                type="text"
                placeholder={isHi ? "त्योहार खोजें..." : "Search Festival..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gold/30 bg-background text-maroon placeholder:text-maroon/40 focus:outline-none focus:ring-1 focus:ring-saffron text-sm transition-all shadow-sm h-[46px]"
              />
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-saffron w-4 h-4" />
            </div>

            {/* Year & Month Dropdowns in a single responsive row/grid */}
            <div className="grid grid-cols-1 xs:grid-cols-2 gap-3 w-full max-w-md">
              {/* Year Dropdown */}
              <div className="relative w-full">
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(Number(e.target.value))}
                  className="w-full pl-3 pr-8 py-2 rounded-xl border border-gold/30 bg-background text-maroon text-xs sm:text-sm font-semibold focus:outline-none focus:ring-1 focus:ring-saffron cursor-pointer h-[46px] appearance-none"
                >
                  {YEARS.map((y) => (
                    <option key={y} value={y}>
                      {isHi ? `${y} वर्ष` : `Year ${y}`}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-saffron">
                  <span className="text-[10px]">▼</span>
                </div>
              </div>

              {/* Month Dropdown */}
              <div className="relative w-full">
                <select
                  value={selectedMonth}
                  onChange={(e) => handleMonthChange(e.target.value)}
                  className="w-full pl-3 pr-8 py-2 rounded-xl border border-gold/30 bg-background text-maroon text-xs sm:text-sm font-semibold focus:outline-none focus:ring-1 focus:ring-saffron cursor-pointer h-[46px] appearance-none"
                >
                  <option value="">{isHi ? "सभी महीने" : "All Months"}</option>
                  {MONTHS.map((m, idx) => (
                    <option key={m} value={m}>
                      {isHi ? MONTHS_HI[idx] : m}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-saffron">
                  <span className="text-[10px]">▼</span>
                </div>
              </div>
            </div>

            {/* Print & Download Button */}
            <div className="w-full max-w-md">
              <button
                onClick={() => downloadCalendarPdf(selectedYear, yearFestivals)}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl border border-maroon/30 text-maroon hover:bg-maroon hover:text-cream text-xs font-semibold shadow-sm transition-premium cursor-pointer w-full justify-center h-[46px]"
              >
                <Download className="w-4 h-4" />
                {isHi ? `${selectedYear} कैलेंडर डाउनलोड` : `Download ${selectedYear} Calendar`}
              </button>
            </div>
          </div>

          {/* Categories Horizontal Tabs */}
          <div className="flex flex-wrap gap-2 justify-center items-center pt-4 border-t border-gold/10">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground mr-1 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> Filter:
            </span>
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-all duration-200 cursor-pointer ${
                  activeCategory === cat.id
                    ? "bg-saffron/10 border-saffron text-maroon font-bold"
                    : "bg-background border-gold/20 text-foreground/80 hover:bg-gold/5"
                }`}
              >
                {isHi ? cat.hi : cat.label}
              </button>
            ))}
          </div>
        </section>

        {/* Monthly Timeline Display */}
        <section className="max-w-4xl mx-auto space-y-8">
          {Object.keys(timelineGroups).length === 0 ? (
            <div className="rounded-3xl border border-gold/30 bg-card p-12 text-center text-muted-foreground">
              {isHi
                ? "चयनित खोज और श्रेणी के लिए कोई त्योहार नहीं मिला।"
                : "No festivals found matching the selected search query and category filters."}
            </div>
          ) : (
            Object.keys(timelineGroups).map((monthName) => (
              <ScrollReveal key={monthName} direction="up" duration={700}>
                <div id={`month-${monthName.toLowerCase()}`} className="space-y-4">
                  {/* Month Heading */}
                  <div className="sticky top-[72px] z-20 bg-background/95 backdrop-blur-md border-b border-gold/30 py-2.5 px-4 flex items-center justify-between shadow-sm rounded-xl">
                    <h3 className="font-display text-lg sm:text-xl font-bold uppercase tracking-widest text-maroon">
                      {monthName}
                    </h3>
                    <span className="text-xs font-bold bg-saffron/15 text-saffron px-3 py-1 rounded-full">
                      {timelineGroups[monthName].length} {isHi ? "त्योहार" : timelineGroups[monthName].length === 1 ? "Festival" : "Festivals"}
                    </span>
                  </div>

                  {/* Festivals List */}
                  <div className="grid gap-4">
                    {timelineGroups[monthName].map((f) => {
                      const isHigh = f.importance === "High" || f.category === "Major Festival";
                      const fDate = new Date(f.date + "T00:00:00");
                      
                      return (
                        <article
                          key={f.id + f.festival}
                          onClick={() => handleFestivalClick(f)}
                          className={`group p-5 rounded-2xl border bg-card cursor-pointer hover:border-gold hover:shadow-sacred transition-premium flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                            isHigh ? "border-gold/50 shadow-gold" : "border-gold/25"
                          }`}
                        >
                          <div className="flex items-center gap-4">
                            {/* Date Badge */}
                            <div className="w-14 h-14 rounded-xl border border-gold/30 bg-background flex flex-col items-center justify-center text-maroon group-hover:border-saffron group-hover:bg-saffron/5 transition-all shadow-sm shrink-0">
                              <span className="text-xl font-bold font-display leading-none">{fDate.getDate()}</span>
                              <span className="text-[9px] uppercase font-bold tracking-wider mt-1 text-saffron">
                                {fDate.toLocaleDateString("en-US", { month: "short" })}
                              </span>
                            </div>

                            <div className="space-y-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <h4 className="font-semibold text-base text-foreground group-hover:text-maroon transition-colors">
                                  {f.festival}
                                </h4>
                                <span className={`text-[9px] px-2 py-0.5 rounded-full uppercase tracking-wider font-bold ${
                                  isHigh ? "bg-saffron text-cream" : "bg-gold/10 text-maroon"
                                }`}>
                                  {f.category}
                                </span>
                              </div>
                              <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                                {f.description}
                              </p>
                            </div>
                          </div>

                          <button className="self-end sm:self-auto inline-flex items-center gap-1 text-xs font-semibold text-maroon hover:text-saffron transition-colors">
                            {isHi ? "विवरण देखें" : "View Details"}
                            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                          </button>
                        </article>
                      );
                    })}
                  </div>
                </div>
              </ScrollReveal>
            ))
          )}
        </section>


      </div>

      {/* Festival Details Popup Modal */}
      {selectedFestival && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-3xl bg-card border-2 border-gold/40 shadow-sacred flex flex-col scrollbar-none">
            {/* Header Banner - Stylized without image */}
            <div className="bg-gradient-to-r from-maroon to-saffron p-8 relative shrink-0 rounded-t-3xl border-b border-gold/20">
              <button
                onClick={() => setSelectedFestival(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-black/20 text-cream hover:bg-black/45 transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="space-y-2">
                <span className="inline-block text-xs font-semibold text-gold bg-cream/10 border border-gold/30 px-3 py-1 rounded-full uppercase tracking-wider">
                  {selectedFestival.extraDeity}
                </span>
                <h3 className="font-display text-2xl sm:text-3xl text-cream font-bold">
                  {selectedFestival.festival}
                </h3>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6 text-sm leading-relaxed">
              {/* Basic Meta Grid */}
              <div className="grid grid-cols-2 gap-4 bg-cream/20 border border-gold/25 p-4 rounded-2xl">
                <div>
                  <div className="text-xs uppercase font-bold text-muted-foreground tracking-wider mb-1">
                    {isHi ? "पावन तिथि" : "Observance Date"}
                  </div>
                  <div className="font-bold text-maroon">
                    {new Date(selectedFestival.date + "T00:00:00").toLocaleDateString(
                      isHi ? "hi-IN" : "en-IN",
                      { day: "numeric", month: "long", year: "numeric", weekday: "short" }
                    )}
                  </div>
                </div>
                <div>
                  <div className="text-xs uppercase font-bold text-muted-foreground tracking-wider mb-1">
                    {isHi ? "पूजा श्रेणी" : "Category"}
                  </div>
                  <div className="font-bold text-maroon uppercase">{selectedFestival.category}</div>
                </div>
              </div>

              {/* Detail Blocks */}
              <div className="space-y-4">
                <div className="space-y-1">
                  <h4 className="font-bold text-maroon flex items-center gap-1.5 border-b border-gold/15 pb-1">
                    <Info className="w-4 h-4 text-saffron shrink-0" />
                    {isHi ? "धार्मिक महत्व व विशेषता" : "Spiritual Significance"}
                  </h4>
                  <p className="text-foreground/80">{selectedFestival.extraSignificance}</p>
                </div>

                <div className="space-y-1">
                  <h4 className="font-bold text-maroon flex items-center gap-1.5 border-b border-gold/15 pb-1">
                    <BookOpen className="w-4 h-4 text-saffron shrink-0" />
                    {isHi ? "पौराणिक कथा / इतिहास" : "Mythological Story / History"}
                  </h4>
                  <p className="text-foreground/80">{selectedFestival.extraStory}</p>
                </div>

                <div className="space-y-1">
                  <h4 className="font-bold text-maroon flex items-center gap-1.5 border-b border-gold/15 pb-1">
                    <Flame className="w-4 h-4 text-saffron shrink-0" />
                    {isHi ? "पूजा विधि व अनुष्ठान" : "Rituals & Celebrations"}
                  </h4>
                  <p className="text-foreground/80">{selectedFestival.extraRituals}</p>
                </div>

                <div className="space-y-1">
                  <h4 className="font-bold text-maroon flex items-center gap-1.5 border-b border-gold/15 pb-1">
                    <Sparkles className="w-4 h-4 text-saffron shrink-0" />
                    {isHi ? "व्रत के नियम व विधि" : "Fasting Rules"}
                  </h4>
                  <p className="text-foreground/80">{selectedFestival.extraFasting}</p>
                </div>

                <div className="space-y-1">
                  <h4 className="font-bold text-maroon flex items-center gap-1.5 border-b border-gold/15 pb-1">
                    <Heart className="w-4 h-4 text-saffron shrink-0" />
                    {isHi ? "विन्ध्याचल धाम से संबंध" : "Temple Relevance"}
                  </h4>
                  <p className="text-foreground/80">{selectedFestival.extraTempleRelevance}</p>
                </div>
              </div>

              {/* Close button at bottom */}
              <div className="pt-4 border-t border-gold/15 flex justify-end">
                <button
                  onClick={() => setSelectedFestival(null)}
                  className="px-6 py-2.5 rounded-full bg-gradient-sacred text-cream font-semibold transition hover:opacity-95 cursor-pointer shadow-md"
                >
                  {isHi ? "बंद करें" : "Close"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </PageShell>
  );
}
