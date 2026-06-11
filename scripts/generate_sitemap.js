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
  "gallery-1.webp",
  "kali-koh.webp",
  "asht-bhuja.webp"
];

filesToCopy.forEach(file => {
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
    lines.forEach(line => {
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

async function generateSitemap() {
  loadEnv();

  const today = new Date().toISOString().split("T")[0];
  const supabaseUrl = process.env.VITE_SUPABASE_URL || "https://avmemxowlunhlyfntiqu.supabase.co";
  const supabaseKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF2bWVteG93bHVuaGx5Zm50aXF1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk2OTIyOTMsImV4cCI6MjA5NTI2ODI5M30.R5DwGPSWZH_PXmsEnUntYu7WyHK6VHXsEUkq8zISRkw";

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
      <image:title>Maa Vindhyavasini Darshan at Vindhyachal Dham</image:title>
      <image:caption>Maa Vindhyavasini Darshan at Vindhyachal Dham</image:caption>
    </image:image>
    <image:image>
      <image:loc>https://www.namamivindhyavasini.in/images/maa-vindhyavasini-2.webp</image:loc>
      <image:title>Maa Vindhyavasini Shringar at Vindhyachal Temple</image:title>
      <image:caption>Maa Vindhyavasini Shringar at Vindhyachal Temple</image:caption>
    </image:image>
    <image:image>
      <image:loc>https://www.namamivindhyavasini.in/images/maa-vindhyavasini-3.webp</image:loc>
      <image:title>Maa Vindhyavasini Devotional Image</image:title>
      <image:caption>Maa Vindhyavasini Devotional Image</image:caption>
    </image:image>
  </url>
  <url>
    <loc>https://www.namamivindhyavasini.in/about</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
    <image:image>
      <image:loc>https://www.namamivindhyavasini.in/images/maa-vindhyavasini-3.webp</image:loc>
      <image:title>Maa Vindhyavasini Devotional history image</image:title>
      <image:caption>Maa Vindhyavasini Devotional history image</image:caption>
    </image:image>
    <image:image>
      <image:loc>https://www.namamivindhyavasini.in/images/kali-koh.webp</image:loc>
      <image:title>Maa Kali Temple at Kali Khoh Vindhyachal</image:title>
      <image:caption>Maa Kali Temple at Kali Khoh Vindhyachal</image:caption>
    </image:image>
    <image:image>
      <image:loc>https://www.namamivindhyavasini.in/images/asht-bhuja.webp</image:loc>
      <image:title>Ashtabhuja Devi Temple hilltop shrine</image:title>
      <image:caption>Ashtabhuja Devi Temple hilltop shrine</image:caption>
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
      <image:loc>https://www.namamivindhyavasini.in/images/gallery-1.webp</image:loc>
      <image:title>Swarna Shringar of Maa Vindhyavasini</image:title>
      <image:caption>Swarna Shringar of Maa Vindhyavasini</image:caption>
    </image:image>
    <image:image>
      <image:loc>https://www.namamivindhyavasini.in/images/maa-vindhyavasini-2.webp</image:loc>
      <image:title>Mangala Aarti of Maa Vindhyavasini</image:title>
      <image:caption>Mangala Aarti of Maa Vindhyavasini</image:caption>
    </image:image>
    <image:image>
      <image:loc>https://www.namamivindhyavasini.in/images/maa-vindhyavasini-3.webp</image:loc>
      <image:title>Vishesh Shringar of Maa Vindhyavasini</image:title>
      <image:caption>Vishesh Shringar of Maa Vindhyavasini</image:caption>
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

  // Dynamically append blog posts to sitemap
  blogPosts.forEach(post => {
    const postDate = post.publish_date ? post.publish_date.split("T")[0] : today;
    sitemapContent += `  <url>
    <loc>https://www.namamivindhyavasini.in/blog/${post.slug}</loc>
    <lastmod>${postDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
`;
    if (post.featured_image) {
      sitemapContent += `    <image:image>
      <image:loc>${post.featured_image}</image:loc>
      <image:title>${post.title.replace(/[&<>'"]/g, "")}</image:title>
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
