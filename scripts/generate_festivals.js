import fs from "fs";
import path from "path";
import SunCalc from "suncalc";

const LAT = 25.1575;
const LON = 82.5800;

function julian(d) {
  return d.getTime() / 86400000 + 2440587.5;
}

function getAyanamsha(jdVal) {
  const yearsSince1900 = (jdVal - 2415020.0) / 365.2422;
  return 22.466 + yearsSince1900 * (50.29 / 3600);
}

function sunLongitude(d) {
  const jdVal = julian(d);
  const n = jdVal - 2451545.0;
  const L = (280.46 + 0.9856474 * n) % 360;
  const g = (((357.528 + 0.9856003 * n) % 360) * Math.PI) / 180;
  return (L + 1.915 * Math.sin(g) + 0.02 * Math.sin(2 * g) + 360) % 360;
}

function moonLongitude(d) {
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

const HINDU_MONTHS = [
  "Chaitra", "Vaishakha", "Jyeshtha", "Ashadha", "Shravana", "Bhadrapada",
  "Ashwina", "Kartika", "Margashirsha", "Pausha", "Magha", "Phalguna"
];

function getPanchangDetails(date) {
  // Compute sunrise using suncalc
  const sunTimes = SunCalc.getTimes(date, LAT, LON);
  const sunrise = sunTimes.sunrise || new Date(date.getFullYear(), date.getMonth(), date.getDate(), 6, 0, 0);

  const sunLon = sunLongitude(sunrise);
  const moonLon = moonLongitude(sunrise);
  const ayan = getAyanamsha(julian(sunrise));

  const sunSid = (sunLon - ayan + 360) % 360;
  const diff = (moonLon - sunLon + 360) % 360;
  
  const tithiNum = Math.floor(diff / 12);
  const paksha = tithiNum < 15 ? "Shukla" : "Krishna";

  const monthIdx = (Math.floor(sunSid / 30) + 11) % 12;
  const month = HINDU_MONTHS[monthIdx];

  return { tithiNum, paksha, month, dateString: date.toISOString().split("T")[0] };
}

// Major static festivals for years 2023 to 2029
const STATIC_FESTIVALS = {
  2023: [
    { date: "2023-01-14", festival: "Makar Sankranti", category: "Major Festival", deity: "Surya Dev", description: "Transit of the Sun into Capricorn, marking the end of winter.", importance: "High" },
    { date: "2023-01-26", festival: "Vasant Panchami", category: "Major Festival", deity: "Saraswati Devi", description: "Festival dedicated to Goddess Saraswati, marking the arrival of spring.", importance: "High" },
    { date: "2023-02-18", festival: "Maha Shivratri", category: "Major Festival", deity: "Lord Shiva", description: "The great night of Shiva, celebrating the cosmic union.", importance: "High" },
    { date: "2023-03-08", festival: "Holi", category: "Major Festival", deity: "Lord Krishna", description: "The vibrant spring festival of colors.", importance: "High" },
    { date: "2023-03-22", festival: "Chaitra Navratri Begins", category: "Navratri", deity: "Devi Durga", description: "Start of the nine sacred nights of spring Navratri.", importance: "High" },
    { date: "2023-03-30", festival: "Ram Navami", category: "Major Festival", deity: "Lord Rama", description: "Birth anniversary of Lord Sri Rama.", importance: "High" },
    { date: "2023-04-06", festival: "Hanuman Jayanti", category: "Major Festival", deity: "Hanuman Ji", description: "Birth anniversary of Hanuman Ji.", importance: "High" },
    { date: "2023-07-03", festival: "Guru Purnima", category: "Major Festival", deity: "Sage Vyasa", description: "Honoring spiritual and academic gurus.", importance: "High" },
    { date: "2023-08-30", festival: "Raksha Bandhan", category: "Major Festival", deity: "Lord Krishna", description: "Celebrating the bond between brothers and sisters.", importance: "High" },
    { date: "2023-09-07", festival: "Krishna Janmashtami", category: "Major Festival", deity: "Lord Krishna", description: "Birth celebration of Lord Sri Krishna.", importance: "High" },
    { date: "2023-09-19", festival: "Ganesh Chaturthi", category: "Major Festival", deity: "Lord Ganesha", description: "Arrival of Lord Ganesha.", importance: "High" },
    { date: "2023-10-15", festival: "Sharad Navratri Begins", category: "Navratri", deity: "Devi Durga", description: "Beginning of the major autumn Navratri.", importance: "High" },
    { date: "2023-10-22", festival: "Durga Ashtami", category: "Navratri", deity: "Devi Durga", description: "Maha Ashtami worship of Maa Durga.", importance: "High" },
    { date: "2023-10-24", festival: "Dussehra", category: "Major Festival", deity: "Lord Rama", description: "Victory of Lord Rama over Ravana.", importance: "High" },
    { date: "2023-11-01", festival: "Karva Chauth", category: "Vrats", deity: "Lord Shiva & Parvati", description: "Fasting by married women for husband's long life.", importance: "Medium" },
    { date: "2023-11-12", festival: "Diwali", category: "Major Festival", deity: "Maha Lakshmi", description: "Festival of Lights celebrating Lord Rama's return to Ayodhya.", importance: "High" },
    { date: "2023-11-15", festival: "Bhai Dooj", category: "Major Festival", deity: "Yama & Yamuna", description: "Celebrating the sibling bond.", importance: "Medium" },
    { date: "2023-11-19", festival: "Chhath Puja", category: "Major Festival", deity: "Surya Dev / Chhathi Maiya", description: "Ancient Hindu festival dedicated to Surya Dev and Chhathi Maiya, marked by rigorous fasting and offering Arghya to the setting and rising Sun.", importance: "High", story: "Celebrated to thank Surya Dev for sustaining life on earth and to request blessings for health and happiness.", rituals: "Holy bathing, fasting, abstaining from drinking water (Nirjala), standing in water, and offering Prasad and Arghya.", fasting: "Strict 36-hour waterless fast (Nirjala Vrat)." }
  ],
  2024: [
    { date: "2024-01-14", festival: "Makar Sankranti", category: "Major Festival", deity: "Surya Dev", description: "Harvest festival celebrating Sun's entry into Capricorn.", importance: "High" },
    { date: "2024-02-14", festival: "Vasant Panchami", category: "Major Festival", deity: "Saraswati Devi", description: "Worship of Goddess Saraswati.", importance: "High" },
    { date: "2024-03-08", festival: "Maha Shivratri", category: "Major Festival", deity: "Lord Shiva", description: "Night-long prayers and worship of Lord Shiva.", importance: "High" },
    { date: "2024-03-25", festival: "Holi", category: "Major Festival", deity: "Lord Krishna", description: "Festival of colors.", importance: "High" },
    { date: "2024-04-09", festival: "Chaitra Navratri Begins", category: "Navratri", deity: "Devi Durga", description: "Hindu New Year and spring Navratri starts.", importance: "High" },
    { date: "2024-04-17", festival: "Ram Navami", category: "Major Festival", deity: "Lord Rama", description: "Birth of Lord Rama.", importance: "High" },
    { date: "2024-04-23", festival: "Hanuman Jayanti", category: "Major Festival", deity: "Hanuman Ji", description: "Birth of Hanuman Ji.", importance: "High" },
    { date: "2024-07-21", festival: "Guru Purnima", category: "Major Festival", deity: "Sage Vyasa", description: "Honoring spiritual guides.", importance: "High" },
    { date: "2024-08-19", festival: "Raksha Bandhan", category: "Major Festival", deity: "Lord Krishna", description: "Sisters tie rakhis on brothers.", importance: "High" },
    { date: "2024-08-26", festival: "Krishna Janmashtami", category: "Major Festival", deity: "Lord Krishna", description: "Birth of Lord Krishna.", importance: "High" },
    { date: "2024-09-07", festival: "Ganesh Chaturthi", category: "Major Festival", deity: "Lord Ganesha", description: "Festival of Lord Ganesha.", importance: "High" },
    { date: "2024-10-03", festival: "Sharad Navratri Begins", category: "Navratri", deity: "Devi Durga", description: "Autumn Navratri starts.", importance: "High" },
    { date: "2024-10-11", festival: "Durga Ashtami", category: "Navratri", deity: "Devi Durga", description: "Maha Ashtami puja.", importance: "High" },
    { date: "2024-10-12", festival: "Dussehra", category: "Major Festival", deity: "Lord Rama", description: "Effigy burning of Ravana.", importance: "High" },
    { date: "2024-10-20", festival: "Karva Chauth", category: "Vrats", deity: "Lord Shiva & Parvati", description: "Traditional fasting day.", importance: "Medium" },
    { date: "2024-10-31", festival: "Diwali", category: "Major Festival", deity: "Maha Lakshmi", description: "Grand celebration of lights.", importance: "High" },
    { date: "2024-11-03", festival: "Bhai Dooj", category: "Major Festival", deity: "Yama & Yamuna", description: "Sibling bonding festival.", importance: "Medium" },
    { date: "2024-11-07", festival: "Chhath Puja", category: "Major Festival", deity: "Surya Dev / Chhathi Maiya", description: "Ancient Hindu festival dedicated to Surya Dev and Chhathi Maiya, marked by rigorous fasting and offering Arghya to the setting and rising Sun.", importance: "High", story: "Celebrated to thank Surya Dev for sustaining life on earth and to request blessings for health and happiness.", rituals: "Holy bathing, fasting, abstaining from drinking water (Nirjala), standing in water, and offering Prasad and Arghya.", fasting: "Strict 36-hour waterless fast (Nirjala Vrat)." }
  ],
  2025: [
    { date: "2025-01-14", festival: "Makar Sankranti", category: "Major Festival", deity: "Surya Dev", description: "Solar transit celebration.", importance: "High" },
    { date: "2025-02-02", festival: "Vasant Panchami", category: "Major Festival", deity: "Saraswati Devi", description: "Spring worship of Saraswati Devi.", importance: "High" },
    { date: "2025-02-26", festival: "Maha Shivratri", category: "Major Festival", deity: "Lord Shiva", description: "Devotion to Lord Shiva.", importance: "High" },
    { date: "2025-03-14", festival: "Holi", category: "Major Festival", deity: "Lord Krishna", description: "Festival of colors.", importance: "High" },
    { date: "2025-03-30", festival: "Chaitra Navratri Begins", category: "Navratri", deity: "Devi Durga", description: "Spring Navratri starting date.", importance: "High" },
    { date: "2025-04-06", festival: "Ram Navami", category: "Major Festival", deity: "Lord Rama", description: "Celebrating Rama Janmotsav.", importance: "High" },
    { date: "2025-04-12", festival: "Hanuman Jayanti", category: "Major Festival", deity: "Hanuman Ji", description: "Hanuman Jayanti prayers.", importance: "High" },
    { date: "2025-07-10", festival: "Guru Purnima", category: "Major Festival", deity: "Sage Vyasa", description: "Honoring spiritual teachers.", importance: "High" },
    { date: "2025-08-09", festival: "Raksha Bandhan", category: "Major Festival", deity: "Lord Krishna", description: "Brother-sister protection thread.", importance: "High" },
    { date: "2025-08-16", festival: "Krishna Janmashtami", category: "Major Festival", deity: "Lord Krishna", description: "Lord Krishna birth date.", importance: "High" },
    { date: "2025-08-27", festival: "Ganesh Chaturthi", category: "Major Festival", deity: "Lord Ganesha", description: "Ganesha festival begins.", importance: "High" },
    { date: "2025-09-22", festival: "Sharad Navratri Begins", category: "Navratri", deity: "Devi Durga", description: "Ashwin Navratri starts.", importance: "High" },
    { date: "2025-09-30", festival: "Durga Ashtami", category: "Navratri", deity: "Devi Durga", description: "Durga Puja Maha Ashtami.", importance: "High" },
    { date: "2025-10-02", festival: "Dussehra", category: "Major Festival", deity: "Lord Rama", description: "Dussehra celebration.", importance: "High" },
    { date: "2025-10-10", festival: "Karva Chauth", category: "Vrats", deity: "Lord Shiva & Parvati", description: "Married women's fast.", importance: "Medium" },
    { date: "2025-10-20", festival: "Diwali", category: "Major Festival", deity: "Maha Lakshmi", description: "Diwali festival of lights.", importance: "High" },
    { date: "2025-10-23", festival: "Bhai Dooj", category: "Major Festival", deity: "Yama & Yamuna", description: "Bhai Dooj festival.", importance: "Medium" },
    { date: "2025-10-28", festival: "Chhath Puja", category: "Major Festival", deity: "Surya Dev / Chhathi Maiya", description: "Ancient Hindu festival dedicated to Surya Dev and Chhathi Maiya, marked by rigorous fasting and offering Arghya to the setting and rising Sun.", importance: "High", story: "Celebrated to thank Surya Dev for sustaining life on earth and to request blessings for health and happiness.", rituals: "Holy bathing, fasting, abstaining from drinking water (Nirjala), standing in water, and offering Prasad and Arghya.", fasting: "Strict 36-hour waterless fast (Nirjala Vrat)." }
  ],
  2026: [
    { date: "2026-01-14", festival: "Makar Sankranti", category: "Major Festival", deity: "Surya Dev", description: "Harvest festival dedicated to Surya Dev.", importance: "High" },
    { date: "2026-01-23", festival: "Vasant Panchami", category: "Major Festival", deity: "Saraswati Devi", description: "Auspicious day dedicated to Goddess Saraswati.", importance: "High" },
    { date: "2026-02-15", festival: "Maha Shivratri", category: "Major Festival", deity: "Lord Shiva", description: "The great night of Lord Shiva.", importance: "High" },
    { date: "2026-03-04", festival: "Holi", category: "Major Festival", deity: "Lord Krishna", description: "The vibrant spring festival of colors.", importance: "High" },
    { date: "2026-03-19", festival: "Chaitra Navratri Begins", category: "Navratri", deity: "Devi Durga", description: "Beginning of the nine nights of spring Navratri.", importance: "High" },
    { date: "2026-03-26", festival: "Ram Navami", category: "Major Festival", deity: "Lord Rama", description: "Birth anniversary of Lord Sri Rama.", importance: "High" },
    { date: "2026-04-02", festival: "Hanuman Jayanti", category: "Major Festival", deity: "Hanuman Ji", description: "Hanuman Jayanti prayers.", importance: "High" },
    { date: "2026-07-29", festival: "Guru Purnima", category: "Major Festival", deity: "Sage Vyasa", description: "Sage Vyasa birth anniversary.", importance: "High" },
    { date: "2026-08-28", festival: "Raksha Bandhan", category: "Major Festival", deity: "Lord Krishna", description: "Celebrating sibling bond.", importance: "High" },
    { date: "2026-09-04", festival: "Krishna Janmashtami", category: "Major Festival", deity: "Lord Krishna", description: "Krishna Janmotsav midnight.", importance: "High" },
    { date: "2026-09-14", festival: "Ganesh Chaturthi", category: "Major Festival", deity: "Lord Ganesha", description: "Elephant headed god arrival.", importance: "High" },
    { date: "2026-10-11", festival: "Sharad Navratri Begins", category: "Navratri", deity: "Devi Durga", description: "Autumn Navratri commences.", importance: "High" },
    { date: "2026-10-18", festival: "Durga Ashtami", category: "Navratri", deity: "Devi Durga", description: "Sharad Durga Ashtami.", importance: "High" },
    { date: "2026-10-20", festival: "Dussehra", category: "Major Festival", deity: "Lord Rama", description: "Vijayadashami festival.", importance: "High" },
    { date: "2026-10-29", festival: "Karva Chauth", category: "Vrats", deity: "Lord Shiva & Parvati", description: "Wife's devotion fast.", importance: "Medium" },
    { date: "2026-11-08", festival: "Diwali", category: "Major Festival", deity: "Maha Lakshmi", description: "Lamps lit in victory.", importance: "High" },
    { date: "2026-11-11", festival: "Bhai Dooj", category: "Major Festival", deity: "Yama & Yamuna", description: "Sibling bonding.", importance: "Medium" },
    { date: "2026-11-15", festival: "Chhath Puja", category: "Major Festival", deity: "Surya Dev / Chhathi Maiya", description: "Ancient Hindu festival dedicated to Surya Dev and Chhathi Maiya, marked by rigorous fasting and offering Arghya to the setting and rising Sun.", importance: "High", story: "Celebrated to thank Surya Dev for sustaining life on earth and to request blessings for health and happiness.", rituals: "Holy bathing, fasting, abstaining from drinking water (Nirjala), standing in water, and offering Prasad and Arghya.", fasting: "Strict 36-hour waterless fast (Nirjala Vrat)." }
  ],
  2027: [
    { date: "2027-01-15", festival: "Makar Sankranti", category: "Major Festival", deity: "Surya Dev", description: "Transit of Surya Dev into Makara Rashi.", importance: "High" },
    { date: "2027-02-11", festival: "Vasant Panchami", category: "Major Festival", deity: "Saraswati Devi", description: "Worship of Saraswati Devi, spring arrival.", importance: "High" },
    { date: "2027-03-06", festival: "Maha Shivratri", category: "Major Festival", deity: "Lord Shiva", description: "Shiva Puja and fast.", importance: "High" },
    { date: "2027-03-22", festival: "Holi", category: "Major Festival", deity: "Lord Krishna", description: "Festival of colors.", importance: "High" },
    { date: "2027-04-07", festival: "Chaitra Navratri Begins", category: "Navratri", deity: "Devi Durga", description: "Chaitra Navratri starts.", importance: "High" },
    { date: "2027-04-15", festival: "Ram Navami", category: "Major Festival", deity: "Lord Rama", description: "Birth of Sri Rama.", importance: "High" },
    { date: "2027-04-20", festival: "Hanuman Jayanti", category: "Major Festival", deity: "Hanuman Ji", description: "Hanuman Jayanti prayers.", importance: "High" },
    { date: "2027-07-18", festival: "Guru Purnima", category: "Major Festival", deity: "Sage Vyasa", description: "Guru worship day.", importance: "High" },
    { date: "2027-08-17", festival: "Raksha Bandhan", category: "Major Festival", deity: "Lord Krishna", description: "Brother protective thread.", importance: "High" },
    { date: "2027-08-25", festival: "Krishna Janmashtami", category: "Major Festival", deity: "Lord Krishna", description: "Lord Krishna Janmotsav.", importance: "High" },
    { date: "2027-09-04", festival: "Ganesh Chaturthi", category: "Major Festival", deity: "Lord Ganesha", description: "Ganeshotsav begins.", importance: "High" },
    { date: "2027-09-30", festival: "Sharad Navratri Begins", category: "Navratri", deity: "Devi Durga", description: "Sharadiya Navratri starting date.", importance: "High" },
    { date: "2027-10-08", festival: "Durga Ashtami", category: "Navratri", deity: "Devi Durga", description: "Ashtami Durga Puja.", importance: "High" },
    { date: "2027-10-09", festival: "Dussehra", category: "Major Festival", deity: "Lord Rama", description: "Dussehra victory celebration.", importance: "High" },
    { date: "2027-10-18", festival: "Karva Chauth", category: "Vrats", deity: "Lord Shiva & Parvati", description: "Married women fasting.", importance: "Medium" },
    { date: "2027-10-29", festival: "Diwali", category: "Major Festival", deity: "Maha Lakshmi", description: "Diwali lamps festival.", importance: "High" },
    { date: "2027-10-31", festival: "Bhai Dooj", category: "Major Festival", deity: "Yama & Yamuna", description: "Sibling worship.", importance: "Medium" },
    { date: "2027-11-04", festival: "Chhath Puja", category: "Major Festival", deity: "Surya Dev / Chhathi Maiya", description: "Ancient Hindu festival dedicated to Surya Dev and Chhathi Maiya, marked by rigorous fasting and offering Arghya to the setting and rising Sun.", importance: "High", story: "Celebrated to thank Surya Dev for sustaining life on earth and to request blessings for health and happiness.", rituals: "Holy bathing, fasting, abstaining from drinking water (Nirjala), standing in water, and offering Prasad and Arghya.", fasting: "Strict 36-hour waterless fast (Nirjala Vrat)." }
  ],
  2028: [
    { date: "2028-01-15", festival: "Makar Sankranti", category: "Major Festival", deity: "Surya Dev", description: "Transit into Capricorn.", importance: "High" },
    { date: "2028-01-31", festival: "Vasant Panchami", category: "Major Festival", deity: "Saraswati Devi", description: "Worship of the deity of learning.", importance: "High" },
    { date: "2028-02-23", festival: "Maha Shivratri", category: "Major Festival", deity: "Lord Shiva", description: "Shivaratri fast.", importance: "High" },
    { date: "2028-03-11", festival: "Holi", category: "Major Festival", deity: "Lord Krishna", description: "Holi colors play.", importance: "High" },
    { date: "2028-03-29", festival: "Chaitra Navratri Begins", category: "Navratri", deity: "Devi Durga", description: "Hindu Nav Varsh and Navratri.", importance: "High" },
    { date: "2028-04-03", festival: "Ram Navami", category: "Major Festival", deity: "Lord Rama", description: "Lord Rama's descent.", importance: "High" },
    { date: "2028-04-09", festival: "Hanuman Jayanti", category: "Major Festival", deity: "Hanuman Ji", description: "Worship of Hanuman Ji.", importance: "High" },
    { date: "2028-07-06", festival: "Guru Purnima", category: "Major Festival", deity: "Sage Vyasa", description: "Disciples honor gurus.", importance: "High" },
    { date: "2028-08-05", festival: "Raksha Bandhan", category: "Major Festival", deity: "Lord Krishna", description: "Sibling bonding.", importance: "High" },
    { date: "2028-08-13", festival: "Krishna Janmashtami", category: "Major Festival", deity: "Lord Krishna", description: "Birth of Krishna.", importance: "High" },
    { date: "2028-08-23", festival: "Ganesh Chaturthi", category: "Major Festival", deity: "Lord Ganesha", description: "Arrival of Lord Ganesha.", importance: "High" },
    { date: "2028-09-19", festival: "Sharad Navratri Begins", category: "Navratri", deity: "Devi Durga", description: "Autumn Navratri starts.", importance: "High" },
    { date: "2028-09-26", festival: "Durga Ashtami", category: "Navratri", deity: "Devi Durga", description: "Sharad Durga Ashtami.", importance: "High" },
    { date: "2028-09-27", festival: "Dussehra", category: "Major Festival", deity: "Lord Rama", description: "Vijayadashami.", importance: "High" },
    { date: "2028-10-07", festival: "Karva Chauth", category: "Vrats", deity: "Lord Shiva & Parvati", description: "Fasting ritual.", importance: "Medium" },
    { date: "2028-10-17", festival: "Diwali", category: "Major Festival", deity: "Maha Lakshmi", description: "Lights and Lakshmi Puja.", importance: "High" },
    { date: "2028-10-19", festival: "Bhai Dooj", category: "Major Festival", deity: "Yama & Yamuna", description: "Sibling bonding.", importance: "Medium" },
    { date: "2028-11-22", festival: "Chhath Puja", category: "Major Festival", deity: "Surya Dev / Chhathi Maiya", description: "Ancient Hindu festival dedicated to Surya Dev and Chhathi Maiya, marked by rigorous fasting and offering Arghya to the setting and rising Sun.", importance: "High", story: "Celebrated to thank Surya Dev for sustaining life on earth and to request blessings for health and happiness.", rituals: "Holy bathing, fasting, abstaining from drinking water (Nirjala), standing in water, and offering Prasad and Arghya.", fasting: "Strict 36-hour waterless fast (Nirjala Vrat)." }
  ],
  2029: [
    { date: "2029-01-14", festival: "Makar Sankranti", category: "Major Festival", deity: "Surya Dev", description: "Transit of the Sun into Capricorn, marking the end of winter.", importance: "High" },
    { date: "2029-01-19", festival: "Vasant Panchami", category: "Major Festival", deity: "Saraswati Devi", description: "Festival dedicated to Goddess Saraswati, marking the arrival of spring.", importance: "High" },
    { date: "2029-02-11", festival: "Maha Shivratri", category: "Major Festival", deity: "Lord Shiva", description: "The great night of Shiva, celebrating the cosmic union.", importance: "High" },
    { date: "2029-03-01", festival: "Holi", category: "Major Festival", deity: "Lord Krishna", description: "The vibrant spring festival of colors.", importance: "High" },
    { date: "2029-04-14", festival: "Chaitra Navratri Begins", category: "Navratri", deity: "Devi Durga", description: "Start of the nine sacred nights of spring Navratri.", importance: "High" },
    { date: "2029-04-23", festival: "Ram Navami", category: "Major Festival", deity: "Lord Rama", description: "Birth anniversary of Lord Sri Rama.", importance: "High" },
    { date: "2029-04-28", festival: "Hanuman Jayanti", category: "Major Festival", deity: "Hanuman Ji", description: "Birth anniversary of Hanuman Ji.", importance: "High" },
    { date: "2029-07-25", festival: "Guru Purnima", category: "Major Festival", deity: "Sage Vyasa", description: "Honoring spiritual and academic gurus.", importance: "High" },
    { date: "2029-08-23", festival: "Raksha Bandhan", category: "Major Festival", deity: "Lord Krishna", description: "Celebrating the bond between brothers and sisters.", importance: "High" },
    { date: "2029-09-01", festival: "Krishna Janmashtami", category: "Major Festival", deity: "Lord Krishna", description: "Birth celebration of Lord Sri Krishna.", importance: "High" },
    { date: "2029-09-11", festival: "Ganesh Chaturthi", category: "Major Festival", deity: "Lord Ganesha", description: "Arrival of Lord Ganesha.", importance: "High" },
    { date: "2029-10-08", festival: "Sharad Navratri Begins", category: "Navratri", deity: "Devi Durga", description: "Beginning of the major autumn Navratri.", importance: "High" },
    { date: "2029-10-16", festival: "Durga Ashtami", category: "Navratri", deity: "Devi Durga", description: "Maha Ashtami worship of Maa Durga.", importance: "High" },
    { date: "2029-10-17", festival: "Dussehra", category: "Major Festival", deity: "Lord Rama", description: "Victory of Lord Rama over Ravana.", importance: "High" },
    { date: "2029-10-26", festival: "Karva Chauth", category: "Vrats", deity: "Lord Shiva & Parvati", description: "Fasting by married women for husband's long life.", importance: "Medium" },
    { date: "2029-11-05", festival: "Diwali", category: "Major Festival", deity: "Maha Lakshmi", description: "Festival of Lights celebrating Lord Rama's return to Ayodhya.", importance: "High" },
    { date: "2029-11-07", festival: "Bhai Dooj", category: "Major Festival", deity: "Yama & Yamuna", description: "Celebrating the sibling bond.", importance: "Medium" },
    { date: "2029-11-11", festival: "Chhath Puja", category: "Major Festival", deity: "Surya Dev / Chhathi Maiya", description: "Ancient Hindu festival dedicated to Surya Dev and Chhathi Maiya, marked by rigorous fasting and offering Arghya to the setting and rising Sun.", importance: "High", story: "Celebrated to thank Surya Dev for sustaining life on earth and to request blessings for health and happiness.", rituals: "Holy bathing, fasting, abstaining from drinking water (Nirjala), standing in water, and offering Prasad and Arghya.", fasting: "Strict 36-hour waterless fast (Nirjala Vrat)." }
  ]
};

// Generate festival objects for a year
function generateYear(year) {
  const fests = [];
  const start = new Date(year, 0, 1);
  const end = new Date(year, 11, 31);
  let id = 1;

  // Track added dates to avoid duplicate entries
  const addedDates = new Map();

  // Add static researched festivals
  const staticList = STATIC_FESTIVALS[year] || [];
  for (const f of staticList) {
    fests.push({
      id: id++,
      date: f.date,
      festival: f.festival,
      category: f.category,
      deity: f.deity,
      description: f.description,
      importance: f.importance,
      story: f.story || "",
      rituals: f.rituals || "",
      fasting: f.fasting || "",
      image: f.image || ""
    });
    addedDates.set(f.date, f.festival);
  }

  // Loop through every day of the year and run astronomical calculations
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    const details = getPanchangDetails(new Date(d));
    const dStr = details.dateString;

    // 1. Check for Purnima
    if (details.tithiNum === 14) {
      if (!addedDates.has(dStr)) {
        fests.push({
          id: id++,
          date: dStr,
          festival: `${details.month} Purnima`,
          category: "Purnima",
          deity: "Lord Vishnu",
          description: `Sacred full moon day in the month of ${details.month}, ideal for Satyanarayan Puja and fasting.`,
          importance: "Medium",
          story: "",
          rituals: "Satyanarayan Vrat Katha, Ganga Snan, lighting diyas.",
          fasting: "Fasting from sunrise to moonrise.",
          image: ""
        });
        addedDates.set(dStr, "Purnima");
      }
    }

    // 2. Check for Amavasya
    if (details.tithiNum === 29) {
      if (!addedDates.has(dStr)) {
        fests.push({
          id: id++,
          date: dStr,
          festival: `${details.month} Amavasya`,
          category: "Amavasya",
          deity: "Shiva / Pitras",
          description: `New moon day in the month of ${details.month}, highly auspicious for ancestor prayers and charity.`,
          importance: "Medium",
          story: "",
          rituals: "Pitru Tarpan, offering food to the needy, prayers to Lord Shiva.",
          fasting: "Fasting or consuming only light sattvic meals.",
          image: ""
        });
        addedDates.set(dStr, "Amavasya");
      }
    }

    // 3. Check for Ekadashi (Tithi 10 or 25)
    if (details.tithiNum === 10 || details.tithiNum === 25) {
      if (!addedDates.has(dStr)) {
        const ekName = details.tithiNum === 10 ? "Shukla Ekadashi" : "Krishna Ekadashi";
        fests.push({
          id: id++,
          date: dStr,
          festival: `${details.month} ${ekName}`,
          category: "Ekadashi",
          deity: "Lord Vishnu",
          description: `Auspicious eleventh day of the lunar fortnight in the month of ${details.month}, dedicated to Lord Vishnu.`,
          importance: "Medium",
          story: "",
          rituals: "Worship of Lord Vishnu, reciting Vishnu Sahasranama, night vigil.",
          fasting: "Strict fast avoiding grains and beans. Consuming fruits/milk allowed.",
          image: ""
        });
        addedDates.set(dStr, "Ekadashi");
      }
    }
  }

  const nirjalaDates = {
    2023: "2023-05-31", 2024: "2024-06-18", 2025: "2025-06-07", 2026: "2026-06-25", 2027: "2027-06-14", 2028: "2028-06-02", 2029: "2029-06-22"
  };
  const devshayaniDates = {
    2023: "2023-06-29", 2024: "2024-07-17", 2025: "2025-07-06", 2026: "2026-07-25", 2027: "2027-07-14", 2028: "2028-07-03", 2029: "2029-07-21"
  };
  const kartikPurnimaDates = {
    2023: "2023-11-27", 2024: "2024-11-15", 2025: "2025-11-05", 2026: "2026-11-24", 2027: "2027-11-14", 2028: "2028-11-23", 2029: "2029-11-21"
  };
  const nirjalaDate = nirjalaDates[year] || "2029-06-22";
  const devshayaniDate = devshayaniDates[year] || "2029-07-21";
  const kartikPurnimaDate = kartikPurnimaDates[year] || "2029-11-21";

  // Nirjala Ekadashi
  const existingNirjala = fests.find(f => f.date === nirjalaDate && f.category === "Ekadashi");
  if (existingNirjala) {
    existingNirjala.festival = "Nirjala Ekadashi";
    existingNirjala.importance = "High";
    existingNirjala.description = "The most sacred and rigorous Ekadashi fast, observed without food or water, dedicated to Lord Vishnu.";
  } else {
    fests.push({
      id: id++,
      date: nirjalaDate,
      festival: "Nirjala Ekadashi",
      category: "Ekadashi",
      deity: "Lord Vishnu",
      description: "The most sacred and rigorous Ekadashi fast, observed without food or water, dedicated to Lord Vishnu.",
      importance: "High",
      story: "",
      rituals: "Worship of Lord Vishnu, water donation, strict fast.",
      fasting: "No food or water is consumed from sunrise to next day sunrise.",
      image: ""
    });
  }

  // Devshayani Ekadashi
  const existingDev = fests.find(f => f.date === devshayaniDate && f.category === "Ekadashi");
  if (existingDev) {
    existingDev.festival = "Devshayani Ekadashi";
    existingDev.importance = "High";
    existingDev.description = "Sacred Ekadashi marking the beginning of Chaturmas, when Lord Vishnu goes to sleep on Shesha Naag.";
  } else {
    fests.push({
      id: id++,
      date: devshayaniDate,
      festival: "Devshayani Ekadashi",
      category: "Ekadashi",
      deity: "Lord Vishnu",
      description: "Sacred Ekadashi marking the beginning of Chaturmas, when Lord Vishnu goes to sleep on Shesha Naag.",
      importance: "High",
      story: "",
      rituals: "Fast, Vishnu Puja, beginning of Chaturmas vows.",
      fasting: "Fasting from grains and beans.",
      image: ""
    });
  }

  // Kartik Purnima
  const existingKartik = fests.find(f => f.date === kartikPurnimaDate && f.category === "Purnima");
  if (existingKartik) {
    existingKartik.festival = "Kartik Purnima";
    existingKartik.importance = "High";
    existingKartik.description = "Grand festival of lights for gods, also known as Dev Deepawali, celebrated with oil lamps lit at Ganga ghats.";
  } else {
    fests.push({
      id: id++,
      date: kartikPurnimaDate,
      festival: "Kartik Purnima",
      category: "Purnima",
      deity: "Lord Shiva / Vishnu",
      description: "Grand festival of lights for gods, also known as Dev Deepawali, celebrated with oil lamps lit at Ganga ghats.",
      importance: "High",
      story: "",
      rituals: "Lighting lamps at river banks (Deepdaan), holy bath in Ganga, temple decoration.",
      fasting: "Fasting or sattvic diet.",
      image: ""
    });
  }

  // Sort festivals chronologically
  fests.sort((a, b) => a.date.localeCompare(b.date));
  
  // Re-index IDs sequentially after sort
  fests.forEach((f, idx) => {
    f.id = idx + 1;
  });

  return fests;
}

const dataDirPublic = path.resolve("./public/data/festivals");
const dataDirSrc = path.resolve("./src/data/festivals");

if (!fs.existsSync(dataDirPublic)) {
  fs.mkdirSync(dataDirPublic, { recursive: true });
}
if (!fs.existsSync(dataDirSrc)) {
  fs.mkdirSync(dataDirSrc, { recursive: true });
}

for (let year = 2023; year <= 2029; year++) {
  const fileContent = generateYear(year);
  const jsonStr = JSON.stringify(fileContent, null, 2);
  fs.writeFileSync(path.join(dataDirPublic, `${year}.json`), jsonStr);
  fs.writeFileSync(path.join(dataDirSrc, `${year}.json`), jsonStr);
  console.log(`Generated festivals calendar for year ${year} with ${fileContent.length} entries.`);
}

