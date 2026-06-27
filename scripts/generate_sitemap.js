import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { createClient } from "@supabase/supabase-js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const publicDir = path.resolve(__dirname, "../public");
const imagesPublicDir = path.join(publicDir, "images");

// Ensure public directories exist
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}
if (!fs.existsSync(imagesPublicDir)) {
  fs.mkdirSync(imagesPublicDir, { recursive: true });
}

// Copy critical SEO image assets to public directory for stable URLs
const srcAssetsDir = path.resolve(__dirname, "../src/assets");
const filesToCopy = [
  "maa-vindhyavasini.webp",
  "maa-vindhyavasini-2.webp",
  "maa-vindhyavasini-3.webp",
  "maa-vindhyavasini-3.jpg",
  "maa-vindhyavasini-4.jpg",
  "maa-vindhyavasini-5.jpg",
  "gallery-1.webp",
  "kali-koh.webp",
  "asht-bhuja.webp",
  "maa-vindhyavasini-simhasan-shringar.jpg",
  "maa-vindhyavasini-garland-shringar.jpg",
  "maa-vindhyavasini-neel-shringar.jpg",
  "maa-vindhyavasini-devi-mirzapur.jpg",
  "maa-vindhyavasini-shakti-peeth.jpg",
  "vaishno-devi-shrine.png",
  "kedarnath-temple.png",
  "kashi-vishwanath.png",
  "mahakaleshwar-temple.png",
  "kamakhya-temple.png",
  "somnath-temple.png",
  "badrinath-temple.png",
  "jagannath-puri.png",
  "hanuman-chalisa.png",
  "shiv-tandav.png",
  "lord-vishnu.png",
  "gayatri-devi.png",
  "shiv-meditating.png",
  "shiv-kailash.png",
];

filesToCopy.forEach((file) => {
  const srcPath = path.join(srcAssetsDir, file);
  const destPath = path.join(imagesPublicDir, file);
  if (fs.existsSync(srcPath)) {
    fs.copyFileSync(srcPath, destPath);
    console.log(`[SEO] Successfully copied ${file} to public/images/`);
  } else {
    console.warn(`[SEO] Warning: Source asset ${srcPath} not found for pre-copying.`);
  }
});

// Generate robots.txt
const robotsContent = `User-agent: *
Allow: /
Disallow: /admin
Disallow: /auth

Sitemap: https://www.namamivindhyavasini.in/sitemap.xml
`;

fs.writeFileSync(path.join(publicDir, "robots.txt"), robotsContent, "utf-8");
console.log("[SEO] Successfully generated robots.txt in public/");

// Helper to parse .env file
function loadEnv() {
  const envPath = path.resolve(__dirname, "../.env");
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, "utf-8").split("\n");
    lines.forEach((line) => {
      const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
      if (match) {
        const key = match[1];
        let value = match[2] || "";
        if (value.startsWith('"') && value.endsWith('"')) {
          value = value.slice(1, -1);
        } else if (value.startsWith("'") && value.endsWith("'")) {
          value = value.slice(1, -1);
        }
        process.env[key] = value.trim();
      }
    });
  }
}

function escapeXml(unsafe) {
  if (!unsafe) return "";
  return unsafe.replace(/[&<>\'"]/g, (c) => {
    switch (c) {
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      case "&":
        return "&amp;";
      case "'":
        return "&apos;";
      case '"':
        return "&quot;";
      default:
        return c;
    }
  });
}

async function generateSitemap() {
  loadEnv();

  const today = new Date().toISOString().split("T")[0];
  const supabaseUrl = process.env.VITE_SUPABASE_URL || "https://avmemxowlunhlyfntiqu.supabase.co";
  const supabaseKey =
    process.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
    process.env.VITE_SUPABASE_ANON_KEY ||
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF2bWVteG93bHVuaGx5Zm50aXF1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk2OTIyOTMsImV4cCI6MjA5NTI2ODI5M30.R5DwGPSWZH_PXmsEnUntYu7WyHK6VHXsEUkq8zISRkw";

  const supabase = createClient(supabaseUrl, supabaseKey);

  let blogPosts = [];
  try {
    const { data, error } = await supabase
      .from("blog_posts")
      .select("slug, title, publish_date, featured_image")
      .eq("status", "published")
      .lte("publish_date", new Date().toISOString())
      .order("publish_date", { ascending: false });

    if (error) {
      console.warn("[SEO] Warning: Failed to query blog posts for sitemap:", error.message);
    } else {
      blogPosts = data || [];
      console.log(`[SEO] Found ${blogPosts.length} published blog posts for sitemap.`);
    }
  } catch (err) {
    console.warn("[SEO] Warning: Failed to fetch blog posts for sitemap:", err);
  }

  let sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  <url>
    <loc>https://www.namamivindhyavasini.in/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
    <image:image>
      <image:loc>https://www.namamivindhyavasini.in/images/maa-vindhyavasini.webp</image:loc>
      <image:title>Maa Vindhyavasini Divine Grace Darshan at Vindhyachal Dham</image:title>
      <image:caption>Presiding deity Maa Vindhyavasini alankar shringar darshan at Vindhyachal Dham, Mirzapur</image:caption>
    </image:image>
    <image:image>
      <image:loc>https://www.namamivindhyavasini.in/images/maa-vindhyavasini-2.webp</image:loc>
      <image:title>Maa Vindhyavasini Shringar at Vindhyachal Temple</image:title>
      <image:caption>The golden alankar of Maa Vindhyavasini inside the sanctum sanctorum of Vindhyachal Temple</image:caption>
    </image:image>
    <image:image>
      <image:loc>https://www.namamivindhyavasini.in/images/maa-vindhyavasini-simhasan-shringar.jpg</image:loc>
      <image:title>Maa Vindhyavasini Simhasan Shringar at Vindhyachal Dham</image:title>
      <image:caption>Maa Vindhyavasini sitting on her golden lion throne (Simhasan) in Vindhyachal Dham, Mirzapur</image:caption>
    </image:image>
    <image:image>
      <image:loc>https://www.namamivindhyavasini.in/images/maa-vindhyavasini-3.jpg</image:loc>
      <image:title>Maa Vindhyavasini Beautiful Alankar Shringar at Vindhyachal Dham</image:title>
      <image:caption>Beautiful daily shringar of Goddess Vindhyavasini at Vindhyachal Dham</image:caption>
    </image:image>
    <image:image>
      <image:loc>https://www.namamivindhyavasini.in/images/maa-vindhyavasini-garland-shringar.jpg</image:loc>
      <image:title>Maa Vindhyavasini Garland Alankar at Vindhyachal Dham</image:title>
      <image:caption>Goddess Vindhyavasini decorated with grand flower garlands during daily aarti</image:caption>
    </image:image>
  </url>
  <url>
    <loc>https://www.namamivindhyavasini.in/about</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
    <image:image>
      <image:loc>https://www.namamivindhyavasini.in/images/maa-vindhyavasini-5.jpg</image:loc>
      <image:title>Maa Vindhyavasini Vishesh Pushpa Shringar History and Significance</image:title>
      <image:caption>Vishesh Pushpa Shringar of Maa Vindhyavasini Devi adorned with divine flowers in Vindhyachal Dham</image:caption>
    </image:image>
    <image:image>
      <image:loc>https://www.namamivindhyavasini.in/images/maa-vindhyavasini-simhasan-shringar.jpg</image:loc>
      <image:title>Maa Vindhyavasini Simhasan Shringar History and Significance</image:title>
      <image:caption>Detailed layout of the newly developed Vindhya Corridor and ancient temple architecture</image:caption>
    </image:image>
    <image:image>
      <image:loc>https://www.namamivindhyavasini.in/images/maa-vindhyavasini-garland-shringar.jpg</image:loc>
      <image:title>Maa Vindhyavasini Garland Alankar Spiritual Guide</image:title>
      <image:caption>Devotional details and history of Maa Vindhyavasini Devi Mirzapur UP</image:caption>
    </image:image>
    <image:image>
      <image:loc>https://www.namamivindhyavasini.in/images/kali-koh.webp</image:loc>
      <image:title>Maa Kali Temple at Kali Khoh Vindhyachal</image:title>
      <image:caption>Maa Kali Temple at Kali Khoh representing the second point of the Trikona Parikrama</image:caption>
    </image:image>
    <image:image>
      <image:loc>https://www.namamivindhyavasini.in/images/asht-bhuja.webp</image:loc>
      <image:title>Ashtabhuja Devi Temple hilltop shrine</image:title>
      <image:caption>Ashtabhuja Devi Temple on the hilltop representing the third point of the Trikona Parikrama</image:caption>
    </image:image>
  </url>
  <url>
    <loc>https://www.namamivindhyavasini.in/calendar</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://www.namamivindhyavasini.in/events</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://www.namamivindhyavasini.in/gallery</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
    <image:image>
      <image:loc>https://www.namamivindhyavasini.in/images/maa-vindhyavasini-simhasan-shringar.jpg</image:loc>
      <image:title>Maa Vindhyavasini Simhasan Shringar Darshan</image:title>
      <image:caption>Photograph of Maa Vindhyavasini sitting on her golden lion throne (Simhasan)</image:caption>
    </image:image>
    <image:image>
      <image:loc>https://www.namamivindhyavasini.in/images/maa-vindhyavasini-garland-shringar.jpg</image:loc>
      <image:title>Maa Vindhyavasini Garland Alankar Darshan</image:title>
      <image:caption>Presiding deity Maa Vindhyavasini Devi garland shringar alankar darshan</image:caption>
    </image:image>
    <image:image>
      <image:loc>https://www.namamivindhyavasini.in/images/maa-vindhyavasini-4.jpg</image:loc>
      <image:title>Maa Vindhyavasini Simha Vahana Darshan</image:title>
      <image:caption>Simha Vahana shringar alankar of Maa Vindhyavasini Devi</image:caption>
    </image:image>
    <image:image>
      <image:loc>https://www.namamivindhyavasini.in/images/maa-vindhyavasini-5.jpg</image:loc>
      <image:title>Maa Vindhyavasini Pushpa Shringar Darshan</image:title>
      <image:caption>Divine pushpa shringar alankar decoration of Maa Vindhyavasini</image:caption>
    </image:image>
    <image:image>
      <image:loc>https://www.namamivindhyavasini.in/images/maa-vindhyavasini-neel-shringar.jpg</image:loc>
      <image:title>Maa Vindhyavasini Neel Pushpa Shringar</image:title>
      <image:caption>Maa Vindhyavasini decorated with divine blue and red flower alankar</image:caption>
    </image:image>
    <image:image>
      <image:loc>https://www.namamivindhyavasini.in/images/maa-vindhyavasini-devi-mirzapur.jpg</image:loc>
      <image:title>Maa Vindhyavasini Maha Aarti Darshan</image:title>
      <image:caption>Daily prayers and sacred ritual maha aarti of Maa Vindhyavasini Devi</image:caption>
    </image:image>
    <image:image>
      <image:loc>https://www.namamivindhyavasini.in/images/maa-vindhyavasini-shakti-peeth.jpg</image:loc>
      <image:title>Maa Vindhyavasini Shakti Peeth Darshan</image:title>
      <image:caption>Goddess Vindhyavasini divine Shakti Peeth alankar inside Vindhyachal Temple</image:caption>
    </image:image>
    <image:image>
      <image:loc>https://www.namamivindhyavasini.in/images/gallery-1.webp</image:loc>
      <image:title>Swarna Shringar of Maa Vindhyavasini</image:title>
      <image:caption>Swarna alankar gold decoration of Maa Vindhyavasini</image:caption>
    </image:image>
    <image:image>
      <image:loc>https://www.namamivindhyavasini.in/images/maa-vindhyavasini.webp</image:loc>
      <image:title>Maa Vindhyavasini Divine Grace Darshan</image:title>
      <image:caption>The facial alankar and expression of grace of Maa Vindhyavasini Devi</image:caption>
    </image:image>
    <image:image>
      <image:loc>https://www.namamivindhyavasini.in/images/maa-vindhyavasini-2.webp</image:loc>
      <image:title>Maa Vindhyavasini Temple Darshan</image:title>
      <image:caption>Inside the garbhagriha showing daily alankar darshan of Maa Vindhyavasini</image:caption>
    </image:image>
  </url>
  <url>
    <loc>https://www.namamivindhyavasini.in/videos</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://www.namamivindhyavasini.in/donation</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://www.namamivindhyavasini.in/contact</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://www.namamivindhyavasini.in/reviews</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://www.namamivindhyavasini.in/sandesh</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://www.namamivindhyavasini.in/inbox</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://www.namamivindhyavasini.in/blog</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
`;

  // Add /learn main page
  sitemapContent += `  <url>
    <loc>https://www.namamivindhyavasini.in/learn</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>\n`;

  // Dynamically append learn topics to sitemap
  try {
    const learnContentPath = path.resolve(__dirname, "../src/data/learnContent.ts");
    if (fs.existsSync(learnContentPath)) {
      const learnContentText = fs.readFileSync(learnContentPath, "utf-8");
      const lines = learnContentText.split("\n");
      const topics = [];
      let currentTopic = null;
      for (let line of lines) {
        line = line.trim();
        if (line.match(/^"([^"]+)"\s*:\s*\{/)) {
          currentTopic = {};
        }
        if (currentTopic) {
          const slugMatch = line.match(/slug:\s*["']([^"']+)["']/);
          if (slugMatch) currentTopic.slug = slugMatch[1];

          const titleMatch = line.match(/title_en:\s*["']([^"']+)["']/);
          if (titleMatch) currentTopic.title = titleMatch[1];

          const imageMatch = line.match(/image:\s*["']([^"']+)["']/);
          if (imageMatch) currentTopic.image = imageMatch[1];

          if (line === "}," || line === "}" || line === "};") {
            if (currentTopic.slug) {
              topics.push(currentTopic);
            }
            currentTopic = null;
          }
        }
      }

      console.log(`[SEO] Found ${topics.length} learn topics in learnContent.ts.`);
      topics.forEach((topic) => {
        const encodedSlug = encodeURIComponent(topic.slug);
        sitemapContent += `  <url>
    <loc>https://www.namamivindhyavasini.in/learn/${encodedSlug}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>\n`;

        if (topic.image) {
          const imageTitle = topic.title || `${topic.slug.replace(/-/g, " ")} guide`;
          sitemapContent += `    <image:image>
      <image:loc>${escapeXml(topic.image)}</image:loc>
      <image:title>${escapeXml(imageTitle)}</image:title>
    </image:image>\n`;
        }

        sitemapContent += `  </url>\n`;
      });
    } else {
      console.warn("[SEO] Warning: learnContent.ts not found for sitemap generation.");
    }
  } catch (err) {
    console.warn("[SEO] Warning: Failed to extract learn slugs for sitemap:", err);
  }

  // Dynamically append blog posts to sitemap
  blogPosts.forEach((post) => {
    const postDate = post.publish_date ? post.publish_date.split("T")[0] : today;
    const encodedSlug = encodeURIComponent(post.slug);
    sitemapContent += `  <url>
    <loc>https://www.namamivindhyavasini.in/blog/${encodedSlug}</loc>
    <lastmod>${postDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
`;
    if (post.featured_image) {
      sitemapContent += `    <image:image>
      <image:loc>${escapeXml(post.featured_image)}</image:loc>
      <image:title>${escapeXml(post.title)}</image:title>
    </image:image>
`;
    }
    sitemapContent += `  </url>\n`;
  });

  sitemapContent += `</urlset>\n`;

  fs.writeFileSync(path.join(publicDir, "sitemap.xml"), sitemapContent, "utf-8");
  console.log("[SEO] Successfully generated sitemap.xml in public/");
}

generateSitemap();
