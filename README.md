# 🕉️ Namami Vindhyavasini Sansthan

A modern, highly responsive, and spiritually immersive progressive web application (PWA) dedicated to **Maa Vindhyavasini** at Vindhyachal Dham. This platform allows devotees to access daily spiritual teachings, check panchang, plan parikrama tours, schedule temple bookings, and stay connected with the sacred activities of the trust.

---

## 🚀 Key Features

### 1. Daily Spiritual Sandesh & Quotes

- **Daily Wisdom:** Access inspiring spiritual quotes and daily teachings from Pujya Guru Ji.
- **Native Text-to-Speech (TTS):** Integrated audio player utilizing the native **Browser Web Speech API** to read messages aloud. Features automatic Devanagari Unicode detection to prioritize high-quality Hindi synthesis voices (e.g., Google हिन्दी, Microsoft Heera) and smart fallbacks.
- **Canvas Share Image Generator:** Generate custom, beautifully styled saffron and gold border quote cards dynamically inside the browser canvas. Easily download or share the quote images directly on WhatsApp or social media.

### 2. Daily Panchang (Sacred Calendar)

- Provides daily Hindu calendar details including Tithi, Nakshatra, Yoga, Karana, Sunrise/Sunset timings, and auspicious times (Abhijit Muhurta, Rahu Kalam).
- Dual-language translations (Hindi and English).

### 3. Virtual Parikrama & Temple Guide

- Comprehensive directions and guides to complete the sacred Parikrama of Vindhyachal Dham.
- Interactive details for key shrines, transit options, and maps.

### 4. Events & Festivals Manager

- Interactive listings of upcoming satsangs, aartis, and temple festivals.
- Status badges indicating whether events are **Live (Active Today)**, **Upcoming**, or **Past**.

### 5. Appointments & Contact Forms

- Devotees can book dates for special Pujas, sevas, and query submissions.
- A responsive devotee review system with rating submissions.

### 6. PWA & Offline Support

- **Offline Mode:** Enabled by a Service Worker (`sw.js`) that caches the app shell and critical assets, allowing access to sandesh, panchang, and directions without an internet connection.
- **App Install Prompts:** Custom UI card prompting users to install the website directly on iOS or Android home screens.
- **Web Push Notifications:** Enable users to subscribe to push alerts for daily darshans or urgent trust announcements.

### 7. Secure Admin Control Center

- A comprehensive, passcode-secured admin dashboard (`/admin`) to manage:
  - Adding/Editing/Deleting daily Sandesh.
  - Scheduling temple events.
  - Approving/denying appointments and booking requests.
  - Reviewing contact queries.
  - Updating gallery files and embedding YouTube/Shorts videos.
  - Sending push notifications and broad messages to all subscriber inboxes.

---

## 🛠️ Tech Stack

- **Frontend Library:** React 19 (Strict Mode)
- **Routing:** TanStack Router (Fully typesafe client-side routing)
- **State & Cache Management:** TanStack React Query v5
- **Database & Backend:** Supabase (PostgreSQL database, Realtime subscriptions, Edge Functions, Row-Level Security, and Storage buckets)
- **Authentication:** Supabase Auth (supports Email/Password and Google SSO OAuth 2.0 PKCE flow)
- **Styling:** Tailwind CSS v4 (using the `@tailwindcss/vite` compiler plugin)
- **Icons & Notifications:** Lucide React & Sonner toast notices

---

## 📁 Project Architecture & Code Breakdown

```
Namami Vindhyavasini/
├── public/                 # Static assets, web app manifest, and service worker
│   ├── favicon.png
│   ├── icon-192.png        # Android & PWA app icon
│   ├── icon-512.png        # Splash screen icon
│   ├── manifest.webmanifest# Progressive Web App configuration
│   └── sw.js               # Service Worker (handles caching and push notifications)
├── src/
│   ├── assets/             # Images and local binary graphics
│   ├── components/         # Reusable React components
│   │   ├── ui/             # Shadcn-based UI primitives (Accordion, Calendar, Dialog, etc.)
│   │   ├── ErrorBoundary.tsx# Fallback screen for rendering crashes
│   │   ├── PageShell.tsx   # Layout header/footer container wrapper
│   │   └── ScrollReveal.tsx# Animations triggered on page scroll
│   ├── hooks/              # Custom React hooks (e.g. use-mobile)
│   ├── i18n/               # Multi-language translation setup
│   │   ├── LangProvider.tsx# Context provider for Hindi/English translation toggle
│   │   └── translations.ts # Full translation dictionary (Hindi & English strings)
│   ├── integrations/       # Backend service connection clients
│   │   └── supabase/       # Supabase client instances, middleware, and auto-generated types
│   ├── lib/                # Utility modules
│   │   ├── AudioContext.tsx# Audio stream context for background playing
│   │   ├── errorHandler.ts # Standardized error catcher and logging
│   │   ├── push.ts         # Service worker push notification helpers
│   │   └── speech.ts       # Web Speech API engine (TTS controller)
│   ├── routes/             # TanStack routing path page views
│   │   ├── auth/callback.tsx# Handles post-SSO auth redirect callbacks from providers
│   │   ├── about.tsx       # Historical background of Maa Vindhyavasini
│   │   ├── admin.tsx       # Secured CRUD dashboard panel
│   │   ├── index.tsx       # Home page shell and hero layout
│   │   ├── panchang.tsx    # Devanagari/English calendar display
│   │   └── ...             # Other route components
│   ├── main.tsx            # App entry point, mounts root element & registers SW
│   ├── router.tsx          # Initializer for TanStack Router with error recovery
│   └── styles.css          # Core CSS stylesheet importing Tailwind variables
├── scripts/                # Developer helper tools
│   ├── generate-icons.ts   # Icon generation tool (Vite/Node)
│   ├── setup_icons.py      # Icon generator script (Python/Pillow)
│   └── verify-setup.mjs    # Automated setup validator script
└── vite.config.ts          # Vite compilation settings
```

---

## ⚙️ How the Code Works: Deep Dive

### 🎙️ Native Text-to-Speech Engine (`src/lib/speech.ts`)

Instead of utilizing paid or external cloud-based translation services (such as ElevenLabs), this app implements a local, cost-free TTS module utilizing the **Web Speech API**:

1.  **Devanagari Recognition:** The app analyzes the input text for Devanagari Unicode characters (range `U+0900` to `U+097F`). If $\ge 30\%$ of the characters are Devanagari, it flags the text as Hindi.
2.  **Smart Voice Matching:** If Hindi is detected, the engine queries the browser's available speech synthesis voices and selects voice profiles matching `hi-IN` (prioritizing native voices like `Google हिन्दी` or `Microsoft Heera`).
3.  **Hinglish / English fallbacks:** If text is written in Hinglish or English, the engine falls back to `en-IN` (English India) or `en-US` to ensure natural pronunciations.

### 🎨 Dynamic Image Generator (`src/routes/sandesh.tsx`)

The "Share Image" feature renders a custom high-definition canvas overlay containing:

- A radial saffron-to-cream gradient backdrop.
- Gold borders and classic corner design accents.
- Watermarked backgrounds (`namamivindhyavasini.in`).
- Auto-wrapped Hindi or English quotes scaled and centered with the author name.
  It converts the canvas to a PNG blob and triggers the **Web Share API** (if supported on mobile browsers) to let users share directly to WhatsApp/Telegram, falling back to a direct file download.

### 🔐 SSO & Authentication Flow

OAuth and SSO integrations rely on Supabase PKCE workflows:

- **Auth Client (`src/integrations/supabase/auth.ts`):** Contains helpers for Google OAuth credentials login and traditional email/password credentials.
- **Redirect Callback (`src/routes/auth/callback.tsx`):** Receives the OAuth authentication token, establishes the session in `localStorage`, and safely redirects the user to the home page or admin portal.

---

## 💻 Local Setup & Development

### 1. Prerequisites

Ensure you have **Node.js** (v18+) and **npm** installed.

### 2. Clone and Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env.local` file at the root of the project and populate it with your Supabase coordinates (refer to `.env.example`):

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-anon-publishable-key
VITE_SUPABASE_AUTH_REDIRECT_URL=http://localhost:8080/auth/callback
```

### 4. Generate App Icons (Favicons & PWAs)

Place your main high-resolution deity/source image in the `public/` directory (e.g. `public/deity-icon.png`) and run one of the automatic generator tools to create all required device sizes:

**Option A (Python - Recommended):**

```bash
pip install Pillow
python scripts/setup_icons.py public/deity-icon.png
```

**Option B (Node.js/TypeScript):**

```bash
npm install -D sharp
npx tsx scripts/generate-icons.ts
```

### 5. Verify the Setup

Run the automated verification script to confirm that all required assets, routes, configurations, and environment keys are present and correctly mapped:

```bash
node scripts/verify-setup.mjs
```

### 6. Run Development Server

```bash
npm run dev
```

Open [http://localhost:8080](http://localhost:8080) in your browser.

---

## 📦 Building and Deploying

### Build production assets:

```bash
npm run build
```

This builds static SPA files into the `dist/` directory. You can deploy this directory to any static web host (Vercel, Netlify, Cloudflare Pages, Supabase Hosting, etc.).

### Security Checklist

- **Row-Level Security (RLS):** Ensure that proper RLS policies are enabled on all Supabase tables (`sandesh`, `events`, `reviews`, `appointments`, `contacts`, `gallery`, `visitor_heartbeats`).
- **Admin Access:** Create admin user credentials in your Supabase Auth dashboard to secure logins for the `/admin` workspace.
- **Ignored Secrets:** Keep `.env` files out of version control (already configured in `.gitignore`).
