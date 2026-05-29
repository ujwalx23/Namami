#!/usr/bin/env tsx
/**
 * Icon Generation Script
 * Converts the provided image to favicon and app icon formats
 *
 * IMPORTANT: This script requires the image file to be placed at:
 * public/deity-icon.png (or any image file in the public directory)
 *
 * To use this script:
 * 1. Convert your deity image to PNG format and save to public/deity-icon.png
 * 2. Install dependencies: npm install sharp
 * 3. Run: npx tsx scripts/generate-icons.ts
 *
 * This will generate:
 * - public/favicon.png (16x16, 32x32 multi-size)
 * - public/icon-192.png (192x192 for Android, PWA)
 * - public/icon-512.png (512x512 for PWA splash screens)
 * - public/apple-touch-icon.png (180x180 for iOS)
 */

import sharp from "sharp";
import { promises as fs } from "fs";
import { join } from "path";

const PUBLIC_DIR = join(process.cwd(), "public");
const SOURCE_IMAGE = join(PUBLIC_DIR, "deity-icon.png");

const sizes = [
  { name: "favicon.png", size: 32 },
  { name: "icon-192.png", size: 192 },
  { name: "icon-512.png", size: 512 },
  { name: "apple-touch-icon.png", size: 180 },
];

async function generateIcons() {
  try {
    // Check if source exists
    await fs.access(SOURCE_IMAGE);
    console.log(`✓ Found source image: ${SOURCE_IMAGE}`);

    for (const { name, size } of sizes) {
      const outputPath = join(PUBLIC_DIR, name);

      await sharp(SOURCE_IMAGE)
        .resize(size, size, {
          fit: "cover",
          position: "center",
          background: { r: 255, g: 255, b: 255, alpha: 0 },
        })
        .png()
        .toFile(outputPath);

      console.log(`✓ Generated: ${name} (${size}x${size})`);
    }

    console.log("\n✅ All icons generated successfully!");
    console.log(
      "The manifest.webmanifest and index.html are already configured to use these icons.",
    );
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      console.error(`❌ Source image not found at: ${SOURCE_IMAGE}`);
      console.error("\nTo set up icons:");
      console.error("1. Convert your deity image to PNG format");
      console.error("2. Save it as: public/deity-icon.png");
      console.error("3. Run this script again");
      console.error("\nAlternatively, manually place PNG files:");
      sizes.forEach(({ name, size }) => {
        console.error(`   - public/${name} (${size}x${size})`);
      });
    } else {
      console.error("Error generating icons:", error);
    }
    process.exit(1);
  }
}

generateIcons();
