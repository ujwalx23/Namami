const MONTH_NAMES = [
  "january",
  "february",
  "march",
  "april",
  "may",
  "june",
  "july",
  "august",
  "september",
  "october",
  "november",
  "december",
];
const PROKERALA_LOC = "1262995";

function cleanText(text) {
  return text
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&ndash;/gi, "–")
    .replace(/&mdash;/gi, "—")
    .replace(/&amp;/gi, "&")
    .replace(/\s+/g, " ")
    .trim();
}

function parseBlockItems(html, blockClass) {
  const regex = new RegExp(
    `<div[^>]+class=["'][^"']*${blockClass}[^"']*["'][^>]*>([\s\S]*?)<\/div>`,
    "i",
  );
  const match = html.match(regex);
  if (!match) return [];
  const blockContent = match[1];
  const items = [];
  const liRegex = /<li[^>]*>([\s\S]*?)<\/li>/gi;
  let liMatch;
  while ((liMatch = liRegex.exec(blockContent)) !== null) {
    items.push(cleanText(liMatch[1]));
  }
  return items;
}

function parseLabelValuePairs(html) {
  const rows = [];
  const rowRegex = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
  let rowMatch;
  while ((rowMatch = rowRegex.exec(html)) !== null) {
    const row = rowMatch[1];
    const cols = Array.from(row.matchAll(/<t[dh][^>]*>([\s\S]*?)<\/t[dh]>/gi)).map((m) => cleanText(m[1]));
    if (cols.length >= 2) {
      rows.push({ label: cols[0], value: cols[1] });
    }
  }
  return rows;
}

function parsePanchangHtml(html) {
  const out = {};
  const addKey = (key, value) => {
    if (value) out[key] = value;
  };

  const tithis = parseBlockItems(html, "panchang-data-tithi");
  if (tithis.length) addKey("Tithi", tithis.join(" | "));

  const nakshatras = parseBlockItems(html, "panchang-data-nakshatra");
  if (nakshatras.length) addKey("Nakshatra", nakshatras.join(" | "));

  const yogas = parseBlockItems(html, "panchang-data-yoga");
  if (yogas.length) addKey("Yoga", yogas.join(" | "));

  const karanas = parseBlockItems(html, "panchang-data-karana");
  if (karanas.length) addKey("Karana", karanas.join(" | "));

  const varas = parseBlockItems(html, "panchang-data-vaasara");
  if (varas.length) addKey("Weekday", varas[0]);

  const dayItems = parseBlockItems(html, "panchang-data-day");
  for (const item of dayItems) {
    if (item.toLowerCase().includes("vikram samvat")) {
      addKey("Vikram Samvat", item.replace(/Vikram Samvat\s*-*/i, "").trim());
    }
    if (item.toLowerCase().includes("purnimanta")) {
      addKey("Chandramasa", item.replace(/Purnimanta\s*-*/i, "").trim());
    }
  }

  const lunarItems = parseBlockItems(html, "panchang-data-lunar-month");
  for (const item of lunarItems) {
    if (/Purnimanta/i.test(item)) {
      addKey("Chandramasa", item.replace(/Purnimanta\s*-*/i, "").trim());
    }
  }

  const timings = parseBlockItems(html, "panchang-data-sun_moon_timing");
  for (const t of timings) {
    if (/Sunrise/i.test(t)) addKey("Sunrise", t.replace(/Sunrise\s*-*/i, "").trim());
    if (/Sunset/i.test(t)) addKey("Sunset", t.replace(/Sunset\s*-*/i, "").trim());
    if (/Moonrise/i.test(t)) addKey("Moonrise", t.replace(/Moonrise\s*-*/i, "").trim());
    if (/Moonset/i.test(t)) addKey("Moonset", t.replace(/Moonset\s*-*/i, "").trim());
  }

  const suryaRasi = parseBlockItems(html, "panchang-data-soorya-rasi");
  if (suryaRasi.length) addKey("Sunsign", suryaRasi[0].replace(/Sun\s*(in)?\s*/i, "").trim());

  const chandraRasi = parseBlockItems(html, "panchang-data-chandra-rasi");
  if (chandraRasi.length) addKey("Moonsign", chandraRasi[0].replace(/Moon\s*(travels through|in)?\s*/i, "").trim());

  const auspicious = parseBlockItems(html, "panchang-data-auspicious-period");
  for (const item of auspicious) {
    if (/Abhijit/i.test(item)) addKey("Abhijit", item.replace(/Abhijit\s*Muhurat?\s*-*/i, "").trim());
    if (/Brahma/i.test(item)) addKey("Brahma Muhurta", item.replace(/Brahma\s*Muhurat?\s*-*/i, "").trim());
  }

  const inauspicious = parseBlockItems(html, "panchang-data-inauspicious-period");
  for (const item of inauspicious) {
    if (/Rahu/i.test(item)) addKey("Rahu Kalam", item.replace(/Rahu\s*-*/i, "").trim());
    if (/Yamaganda/i.test(item)) addKey("Yamaganda", item.replace(/Yamaganda\s*-*/i, "").trim());
    if (/Gulika/i.test(item)) addKey("Gulikai Kalam", item.replace(/Gulika\s*-*/i, "").trim());
  }

  if (/sukla paksha/i.test(html)) addKey("Paksha", "Sukla Paksha");
  if (/krishna paksha/i.test(html)) addKey("Paksha", "Krishna Paksha");

  if (!out["Chandramasa"] && lunarItems.length) {
    addKey("Chandramasa", lunarItems.join(" | "));
  }

  return out;
}

function buildProkeralaUrl(date) {
  const year = date.getFullYear();
  const month = MONTH_NAMES[date.getMonth()];
  const day = String(date.getDate()).padStart(2, "0");
  return `https://www.prokerala.com/astrology/panchang/${year}-${month}-${day}.html?loc=${PROKERALA_LOC}`;
}

export default async function handler(req, res) {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const dateParam = url.searchParams.get("date");
  if (req.method !== "GET") {
    res.statusCode = 405;
    res.setHeader("Allow", "GET");
    res.end(JSON.stringify({ error: "Method Not Allowed" }));
    return;
  }

  const date = dateParam ? new Date(dateParam) : new Date();
  if (Number.isNaN(date.getTime())) {
    res.statusCode = 400;
    res.end(JSON.stringify({ error: "Invalid date" }));
    return;
  }

  const target = buildProkeralaUrl(date);

  try {
    const pageRes = await fetch(target, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      },
    });
    if (!pageRes.ok) {
      res.statusCode = 502;
      res.end(JSON.stringify({ error: `Prokerala fetch failed (${pageRes.status})` }));
      return;
    }

    const html = await pageRes.text();
    const data = parsePanchangHtml(html);
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ source: "prokerala", url: target, data }));
  } catch (error) {
    res.statusCode = 502;
    res.end(JSON.stringify({ error: error?.message || "Unable to fetch Panchang data" }));
  }
}
