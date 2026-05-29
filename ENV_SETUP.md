# Environment Variables Setup Guide

## Overview

Your website requires environment variables for Supabase authentication and configuration. This guide walks you through setting them up for both local development and production.

## Development Setup (.env.local)

### Step 1: Create `.env.local` file

Create a new file in your project root called `.env.local`:

```
project-root/
├── .env.local ← Create this file here
├── .env.example ← Reference (optional)
├── src/
├── public/
└── ...
```

### Step 2: Add Variables

Copy and paste this template into `.env.local`:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Authentication Callback
VITE_SUPABASE_AUTH_REDIRECT_URL=http://localhost:8080/auth/callback
```

### Step 3: Get Your Values

#### Get Supabase URL and Key:

1. Go to [Supabase Dashboard](https://supabase.com)
2. Click on your project
3. Go to **Settings** → **API**
4. Copy:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **Publishable Key** (anon key) → `VITE_SUPABASE_PUBLISHABLE_KEY`

```
Settings page shows:
- Project URL: https://xxxxxxxxxxxx.supabase.co
- anon (public): eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
- service_role: (don't use this on frontend)
```

#### Example of filled `.env.local`:

```env
VITE_SUPABASE_URL=https://kfazptmwxyzabc123.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtmYXpwdG13eHl6YWJjMTIzIiwicm9sZSI6ImFub24iLCJpYXQiOjE2MjAwMDAwMDAsImV4cCI6MTk5OTk5OTk5OX0.abcdefgh1234567890...
VITE_SUPABASE_AUTH_REDIRECT_URL=http://localhost:8080/auth/callback
```

### Step 4: Verify Setup

Test that variables are loaded:

```bash
# Start dev server
npm run dev

# In browser console (F12 → Console), type:
console.log(import.meta.env.VITE_SUPABASE_URL)
# Should show your URL, not "undefined"
```

---

## Production Setup (Vercel, Netlify, etc.)

### For Vercel:

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Add these variables:

| Name                              | Value                                  | Environments                     |
| --------------------------------- | -------------------------------------- | -------------------------------- |
| `VITE_SUPABASE_URL`               | `https://your-project.supabase.co`     | Production, Preview, Development |
| `VITE_SUPABASE_PUBLISHABLE_KEY`   | `eyJhbGc...`                           | Production, Preview, Development |
| `VITE_SUPABASE_AUTH_REDIRECT_URL` | `https://yourdomain.com/auth/callback` | Production, Preview              |
| `VITE_SUPABASE_AUTH_REDIRECT_URL` | `http://localhost:8080/auth/callback`  | Development                      |

**Important:** Use your actual domain for production!

Example for `VITE_SUPABASE_AUTH_REDIRECT_URL`:

- Development: `http://localhost:8080/auth/callback`
- Preview/Staging: `https://preview.yourdomain.com/auth/callback`
- Production: `https://yourdomain.com/auth/callback`

### For Netlify:

1. Go to [Netlify Dashboard](https://app.netlify.com/)
2. Select your site
3. Go to **Site Settings** → **Build & Deploy** → **Environment**
4. Add the same variables

### For Other Platforms:

Consult their documentation for setting environment variables. The variables must be available at build time for Vite to substitute them.

---

## Environment Variable Reference

### Required Variables

| Variable                          | Purpose                   | Example                               |
| --------------------------------- | ------------------------- | ------------------------------------- |
| `VITE_SUPABASE_URL`               | Your Supabase project URL | `https://abc123.supabase.co`          |
| `VITE_SUPABASE_PUBLISHABLE_KEY`   | Public API key (anon key) | `eyJhbGc...`                          |
| `VITE_SUPABASE_AUTH_REDIRECT_URL` | OAuth callback URL        | `http://localhost:8080/auth/callback` |

### Optional Variables

None currently required, but you can add:

```env
# For logging and debugging
DEBUG=true

# For analytics
VITE_ANALYTICS_ID=your-id
```

---

## Important Security Notes

### ✅ Safe to Expose (prefix with `VITE_`)

- Supabase URL
- Supabase Publishable Key (anon key)
- These are only for public/anonymous access

### ❌ Never Expose (no `VITE_` prefix)

- Supabase Service Role Key
- Database passwords
- Admin API keys
- Private tokens

**Why?** Variables with `VITE_` are embedded in the frontend code. Only include public data!

---

## Troubleshooting

### Error: "Missing Supabase environment variables"

**Problem:** Your variables aren't set up.

**Solution:**

1. Create `.env.local` in project root
2. Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY`
3. Restart dev server (`npm run dev`)

### Error: "undefined" when accessing variables

**Problem:** Variables not being read.

**Solution:**

1. Restart dev server
2. Check spelling of variable names (must start with `VITE_`)
3. Check file is named `.env.local` (not `.env`)
4. Verify values are copied exactly (no extra spaces)

### Blank Page After Deploying

**Problem:** Production variables not set.

**Solution:**

1. Go to your hosting platform (Vercel, Netlify, etc.)
2. Add environment variables there too
3. Redeploy after adding variables
4. Wait a few minutes for deployment to complete

### SSO Not Working in Production

**Problem:** Auth redirect URL mismatch.

**Solution:**

1. Check `VITE_SUPABASE_AUTH_REDIRECT_URL` matches your domain exactly
2. For example, if site is `https://mysite.com`, use `https://mysite.com/auth/callback`
3. Don't include trailing slashes: ❌ `/auth/callback/` → ✅ `/auth/callback`
4. Update in Supabase Provider settings too

---

## Quick Reference

### How to Get Values

```
Supabase Dashboard:
  → Your Project
  → Settings (gear icon)
  → API
  → Copy "Project URL" and "anon" key
```

### Where to Put Them

```
Development:  .env.local (in project root)
Production:   Your platform's environment settings
              (Vercel, Netlify, etc.)
```

### What They Do

```
VITE_SUPABASE_URL
  ↓
Used to connect to your Supabase project

VITE_SUPABASE_PUBLISHABLE_KEY
  ↓
Public key for frontend access

VITE_SUPABASE_AUTH_REDIRECT_URL
  ↓
Where users are sent after Google OAuth
```

---

## Example Complete Setup

### `.env.local` (Development):

```env
VITE_SUPABASE_URL=https://kfazptmwxyzabc.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtmYXpwdG13eHl6YWJjIiwicm9sZSI6ImFub24iLCJpYXQiOjE2MzAwMDAwMDAsImV4cCI6MTk5OTk5OTk5OX0.secretkeyhash...
VITE_SUPABASE_AUTH_REDIRECT_URL=http://localhost:8080/auth/callback
```

### Vercel (Production):

```
VITE_SUPABASE_URL = https://kfazptmwxyzabc.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_SUPABASE_AUTH_REDIRECT_URL = https://namami-vindhyavasini.com/auth/callback
```

---

## Validation Checklist

Before deploying:

- [ ] `.env.local` created with all 3 variables
- [ ] `VITE_SUPABASE_URL` is not empty
- [ ] `VITE_SUPABASE_PUBLISHABLE_KEY` is not empty
- [ ] `VITE_SUPABASE_AUTH_REDIRECT_URL` is correct for environment
- [ ] Dev server starts without errors: `npm run dev`
- [ ] Build succeeds: `npm run build`
- [ ] Production variables set in hosting platform
- [ ] Production auth redirect URL matches your domain

---

## Testing Variables Are Set

### Development:

```bash
# Start dev server
npm run dev

# Open browser console (F12)
# Paste these commands:
console.log('URL:', import.meta.env.VITE_SUPABASE_URL)
console.log('Key:', import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY)
console.log('Redirect:', import.meta.env.VITE_SUPABASE_AUTH_REDIRECT_URL)

# Should show your values, not 'undefined'
```

### Production:

```bash
# Visit your production site
# Open browser console (F12)
# Paste the same commands as above
# Should show values from your environment settings
```

---

## Next Steps

1. ✅ Create `.env.local` file
2. ✅ Add variables from Supabase
3. ✅ Test locally: `npm run dev`
4. ✅ Verify in console they're not `undefined`
5. ✅ Set same variables on production platform
6. ✅ Deploy and verify again

---

## Support

If you have issues:

1. Check [Supabase Docs](https://supabase.com/docs)
2. Check your hosting platform docs
3. Review the error message in browser console (F12)
4. Verify values are copied exactly (no spaces)

**Good luck! 🚀**
