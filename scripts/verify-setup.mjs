#!/usr/bin/env node
/**
 * Website Verification Script
 * 
 * Checks that all improvements are properly installed and configured.
 * Run this after making changes to verify everything is set up correctly.
 * 
 * Usage: node scripts/verify-setup.mjs
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, "..");

const checks = {
  files: [],
  config: [],
  auth: [],
  icons: [],
  errors: [],
};

function checkFile(filePath, description) {
  const fullPath = path.join(rootDir, filePath);
  const exists = fs.existsSync(fullPath);
  const check = { file: filePath, description, exists };

  if (exists) {
    checks.files.push(`✅ ${description}`);
  } else {
    checks.errors.push(`❌ Missing: ${description} (${filePath})`);
  }

  return exists;
}

function checkEnv(key, description) {
  const value = process.env[key];
  if (value) {
    checks.config.push(`✅ ${description} is configured`);
    return true;
  } else {
    checks.config.push(`⚠️  ${description} not set (optional for dev)`);
    return false;
  }
}

function main() {
  console.log("\n🔍 Verifying Website Setup...\n");

  console.log("📁 Checking Files...");
  checkFile("src/integrations/supabase/auth.ts", "Auth functions");
  checkFile("src/routes/auth/callback.tsx", "OAuth callback");
  checkFile("src/components/ErrorBoundary.tsx", "Error boundary");
  checkFile("src/lib/errorHandler.ts", "Error handler utilities");
  checkFile("scripts/generate-icons.ts", "Icon generation script");
  checkFile("scripts/setup_icons.py", "Python icon converter");
  checkFile("SETUP_GUIDE.md", "Setup documentation");
  checkFile("SSO_QUICK_START.md", "SSO quick start guide");
  checkFile("STABILITY_CHECKLIST.md", "Testing checklist");
  checkFile("IMPROVEMENTS_SUMMARY.md", "Improvements summary");

  console.log("\n⚙️  Checking Configuration...");
  checkEnv("VITE_SUPABASE_URL", "Supabase URL");
  checkEnv("VITE_SUPABASE_PUBLISHABLE_KEY", "Supabase Key");
  checkEnv("VITE_SUPABASE_AUTH_REDIRECT_URL", "Auth Redirect URL");

  console.log("\n🎨 Checking Icons...");
  const icons = [
    "public/favicon.png",
    "public/icon-192.png",
    "public/icon-512.png",
    "public/apple-touch-icon.png",
  ];

  icons.forEach((icon) => {
    const exists = fs.existsSync(path.join(rootDir, icon));
    if (exists) {
      checks.icons.push(`✅ ${icon}`);
    } else {
      checks.icons.push(`⚠️  Missing: ${icon} (run icon generation script)`);
    }
  });

  // Print results
  console.log("\n" + "=".repeat(50));
  console.log("📋 VERIFICATION RESULTS\n");

  console.log("✅ Files Installed:");
  checks.files.forEach((msg) => console.log("   " + msg));

  console.log("\n⚙️  Configuration:");
  checks.config.forEach((msg) => console.log("   " + msg));

  console.log("\n🎨 Icons:");
  checks.icons.forEach((msg) => console.log("   " + msg));

  if (checks.errors.length > 0) {
    console.log("\n❌ Errors:");
    checks.errors.forEach((msg) => console.log("   " + msg));
  }

  console.log("\n" + "=".repeat(50));

  // Summary
  const allIconsPresent = icons.every((icon) =>
    fs.existsSync(path.join(rootDir, icon)),
  );
  const filesPresent = checks.errors.length === 0;

  console.log("\n📊 Summary:");

  if (filesPresent) {
    console.log("✅ All required files are present");
  } else {
    console.log("❌ Some files are missing");
  }

  if (allIconsPresent) {
    console.log("✅ All icons are present");
  } else {
    console.log("⚠️  Icons not yet generated (run icon conversion script)");
  }

  const supabaseConfigured =
    process.env.VITE_SUPABASE_URL && process.env.VITE_SUPABASE_PUBLISHABLE_KEY;
  if (supabaseConfigured) {
    console.log("✅ Supabase is configured");
  } else {
    console.log("⚠️  Supabase not configured (set .env variables)");
  }

  console.log("\n📚 Next Steps:");

  if (!allIconsPresent) {
    console.log("1. Generate icons:");
    console.log("   - python scripts/setup_icons.py public/deity-icon.png");
    console.log("   OR");
    console.log("   - npx tsx scripts/generate-icons.ts");
  }

  if (!supabaseConfigured) {
    console.log("2. Set environment variables in .env.local:");
    console.log("   - VITE_SUPABASE_URL");
    console.log("   - VITE_SUPABASE_PUBLISHABLE_KEY");
    console.log("   - VITE_SUPABASE_AUTH_REDIRECT_URL");
  }

  console.log("3. Configure Google OAuth in Supabase");
  console.log("4. Test locally: npm run dev");
  console.log("5. Build: npm run build");
  console.log("6. Deploy: git push");

  console.log("\n📖 Documentation:");
  console.log("- SETUP_GUIDE.md - Complete setup instructions");
  console.log("- SSO_QUICK_START.md - SSO configuration");
  console.log("- STABILITY_CHECKLIST.md - Pre-deployment testing");
  console.log("- IMPROVEMENTS_SUMMARY.md - Overview of all changes");

  console.log("\n" + "=".repeat(50) + "\n");

  // Exit with appropriate code
  if (checks.errors.length > 0 || !allIconsPresent) {
    console.log(
      "⚠️  Some setup steps remain. See above for details.\n",
    );
    process.exit(1);
  } else {
    console.log("🎉 Setup verified! Ready to test and deploy.\n");
    process.exit(0);
  }
}

main();
