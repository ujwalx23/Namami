# 🚨 Production Site Error - Fix Guide

## Problem
Your website at `https://vnamami.vercel.app` shows: "Something went wrong"

## Root Cause
The Error Boundary component is catching an error during initialization (likely Supabase connection or missing environment variables).

---

## ✅ Quick Fix Steps

### 1. Check Vercel Environment Variables

**Go to:** https://vercel.com → Your Project → Settings → Environment Variables

**Add these variables:**

```
Name: VITE_SUPABASE_URL
Value: (copy from Supabase Dashboard → Settings → API → Project URL)
Environments: Production, Preview, Development
```

```
Name: VITE_SUPABASE_PUBLISHABLE_KEY
Value: (copy from Supabase Dashboard → Settings → API → anon key)
Environments: Production, Preview, Development
```

```
Name: VITE_SUPABASE_AUTH_REDIRECT_URL
Value: https://vnamami.vercel.app/auth/callback
Environments: Production, Preview
```

```
Name: VITE_SUPABASE_AUTH_REDIRECT_URL
Value: http://localhost:8080/auth/callback
Environments: Development
```

### 2. Redeploy After Adding Variables

After adding environment variables to Vercel:
1. Go to **Deployments**
2. Click the 3-dot menu on the latest deployment
3. Select **Redeploy**
4. Wait for deployment to complete
5. Visit your site

**OR manually trigger:**
```bash
git push origin main
```

---

## 🔍 How to Debug the Error

### 1. Check Browser Console
Open the live site and press **F12** to open DevTools
- Go to **Console** tab
- Look for detailed error messages (they will be shown)
- Screenshot and share the error

### 2. Check Vercel Build Logs
1. Go to **Vercel Dashboard**
2. Select your project
3. Go to **Deployments**
4. Click the latest deployment
5. Go to **Logs** tab
6. Look for error messages during build

### 3. Test Local Build
```bash
# Simulate production build locally
npm run build
npm run preview

# Visit http://localhost:4173
# Check console (F12) for errors
```

---

## 🔧 Common Issues & Fixes

### Issue: "Missing Supabase environment variables"
**Cause:** Environment variables not set in Vercel  
**Fix:** Add them in Vercel Settings → Environment Variables

### Issue: "Cannot read property 'from' of undefined"
**Cause:** Supabase not initialized (wrong URL/key)  
**Fix:** Verify VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY are correct

### Issue: "Auth redirect URL mismatch"
**Cause:** VITE_SUPABASE_AUTH_REDIRECT_URL doesn't match Supabase settings  
**Fix:** Make sure it's exactly `https://vnamami.vercel.app/auth/callback`

### Issue: "localhost vs production URL"
**Cause:** Using wrong URL for wrong environment  
**Fix:** Use `http://localhost:8080` for dev, `https://vnamami.vercel.app` for prod

---

## ✨ Verify Supabase Credentials

1. Go to [Supabase Dashboard](https://supabase.com)
2. Select your project
3. Go to **Settings** → **API**
4. Check:
   - ✅ Project URL is visible
   - ✅ Anon key is visible
   - ✅ Copy them exactly (no spaces)

---

## 📋 Deployment Checklist

Before deployment, verify:

- [ ] VITE_SUPABASE_URL is set in Vercel
- [ ] VITE_SUPABASE_PUBLISHABLE_KEY is set in Vercel
- [ ] VITE_SUPABASE_AUTH_REDIRECT_URL is set to `https://vnamami.vercel.app/auth/callback`
- [ ] Redeployed after adding variables
- [ ] At least 2-3 minutes have passed for Vercel to process
- [ ] Cleared browser cache (Ctrl+Shift+Del)
- [ ] Tried in incognito mode
- [ ] Checked console (F12) for specific error message

---

## 🚀 Step-by-Step Production Fix

### Step 1: Get Supabase Credentials
```
Supabase Dashboard:
  1. Login to https://supabase.com
  2. Click your project
  3. Settings (gear icon) → API
  4. Copy "Project URL"
  5. Copy "anon" key
```

### Step 2: Add to Vercel
```
Vercel Dashboard:
  1. Go to your project
  2. Settings → Environment Variables
  3. Add 3 variables (see below)
```

**Variable 1:**
- Name: `VITE_SUPABASE_URL`
- Value: [Paste Project URL from step 1]
- Environments: ✓ Production ✓ Preview ✓ Development

**Variable 2:**
- Name: `VITE_SUPABASE_PUBLISHABLE_KEY`
- Value: [Paste anon key from step 1]
- Environments: ✓ Production ✓ Preview ✓ Development

**Variable 3:**
- Name: `VITE_SUPABASE_AUTH_REDIRECT_URL`
- Value: `https://vnamami.vercel.app/auth/callback`
- Environments: ✓ Production ✓ Preview

### Step 3: Redeploy
```
Vercel Dashboard:
  1. Go to Deployments
  2. Click latest deployment's menu (•••)
  3. Click "Redeploy"
  4. Wait 2-3 minutes
  5. Visit site and refresh (Ctrl+Shift+R)
```

### Step 4: Verify
- [ ] Site loads without "Something went wrong"
- [ ] Navigation works
- [ ] Press F12 → Console → No red errors
- [ ] All pages load

---

## 💡 Pro Tips

1. **Clear Cache:** After redeployment, hard refresh with `Ctrl+Shift+R`
2. **Wait Time:** Give Vercel 2-3 minutes to process environment variables
3. **Check Logs:** If still failing, check Vercel build logs for specific error
4. **Test Locally:** Always test with `npm run dev` first
5. **Copy Exactly:** No extra spaces when copying credentials

---

## 📞 Still Not Working?

1. **Take a screenshot** of browser console (F12 → Console)
2. **Check Vercel logs** (Deployments → Select deployment → Logs)
3. **Compare URLs** - ensure they match exactly:
   - Supabase: Settings → API → Project URL
   - Vercel: Environment Variable
4. **Try incognito mode** - clears cache issues
5. **Hard refresh** - Ctrl+Shift+R (not just Ctrl+R)

---

## ✅ Success Signs

When fixed, you should see:
- ✅ Site loads with no error
- ✅ Can navigate between pages
- ✅ No red errors in console (F12)
- ✅ Images load properly
- ✅ Forms work (if applicable)

---

**Your localhost works perfectly!** Just need to configure production variables.  
Once you add the environment variables and redeploy, the production site will work too. 🚀
