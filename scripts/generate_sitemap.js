import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

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

// Generate sitemap.xml with Google Image Sitemap namespace and definitions
const today = new Date().toISOString().split("T")[0];

const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
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
</urlset>
`;

fs.writeFileSync(path.join(publicDir, "sitemap.xml"), sitemapContent, "utf-8");
console.log("[SEO] Successfully generated sitemap.xml in public/");
