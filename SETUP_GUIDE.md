# Setup Guide: Favicon, App Icons, and SSO Configuration

## 1. Favicon and App Icon Setup

Your website is now configured to use custom icons at these paths in the `public/` folder:
- `favicon.png` - Website favicon (32x32)
- `icon-192.png` - Android app icon and PWA (192x192)
- `icon-512.png` - PWA splash screen (512x512)
- `apple-touch-icon.png` - iOS app icon (180x180)

### Option A: Using the Icon Generation Script (Recommended)

If you have the deity image, follow these steps:

1. **Save your image to the public folder:**
   ```bash
   # Copy your deity image to public/deity-icon.png
   cp /path/to/your/image.png public/deity-icon.png
   ```

2. **Install sharp (image processing library):**
   ```bash
   npm install -D sharp
   ```

3. **Run the icon generation script:**
   ```bash
   npx tsx scripts/generate-icons.ts
   ```

The script will automatically create all required icon sizes with proper formatting.

### Option B: Manual Icon Creation

If you prefer to create icons manually:

1. Convert your deity image to PNG format
2. Resize to each required dimension using an image editor:
   - 32x32 → `public/favicon.png`
   - 192x192 → `public/icon-192.png`
   - 512x512 → `public/icon-512.png`
   - 180x180 → `public/apple-touch-icon.png`

3. Save each file to the `public/` folder

### Verifying Icons Work

After setting up icons:

1. **Web browser:**
   - Clear browser cache (Ctrl+Shift+Del or Cmd+Shift+Del)
   - Refresh the page
   - The icon should appear in the browser tab

2. **iOS (Apple devices):**
   - Open the website in Safari
   - Tap the Share button
   - Select "Add to Home Screen"
   - The icon will use `apple-touch-icon.png`

3. **Android:**
   - Open Chrome and visit your website
   - Tap the menu (three dots)
   - Select "Install app" or "Add to Home screen"
   - The icon will use `icon-192.png` or `icon-512.png`

4. **PWA Manifest Check:**
   - Open DevTools (F12)
   - Go to Application → Manifest
   - Verify icons are listed and accessible

---

## 2. SSO (Single Sign-On) Configuration

Your website now supports Google OAuth and email/password authentication.

### Enable Google OAuth in Supabase

1. **Go to Supabase Dashboard:**
   - Navigate to your project
   - Go to Authentication → Providers

2. **Enable Google Provider:**
   - Click "Google"
   - Toggle "Enable" to ON

3. **Get Google OAuth Credentials:**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing
   - Go to APIs & Services → Credentials
   - Create OAuth 2.0 Client ID (Web application)
   - Authorized redirect URIs: `https://yourdomain.supabase.co/auth/v1/callback`
   - Copy Client ID and Client Secret

4. **Configure in Supabase:**
   - Paste Client ID and Client Secret in the Google provider settings
   - Save

5. **Set Redirect URL:**
   - In your `.env` file or Vercel environment variables, add:
   ```
   VITE_SUPABASE_AUTH_REDIRECT_URL=https://yourdomain.com/auth/callback
   ```

### Authentication Features

Your app now has:

- **OAuth/SSO:** Users can sign in with Google
- **Email/Password:** Traditional email login
- **Session Persistence:** Login sessions persist across browser sessions
- **Automatic Token Refresh:** Session tokens are automatically refreshed

### Authentication Flow

1. User initiates login (Google or email)
2. Redirected to `/auth/callback` after provider authentication
3. Session is established and stored in browser
4. User is redirected to home page
5. All subsequent API calls include auth token automatically

### Testing SSO

1. **Local Development:**
   ```bash
   npm run dev
   # Visit http://localhost:8080
   ```

2. **Test Google Login:**
   - Look for Google login button (you need to add this to a login page)
   - Click to initiate OAuth flow
   - Complete Google sign-in
   - Should redirect to `/auth/callback`
   - Should then redirect to home page

### Adding Login UI

To add a login component to your site, create a login page:

```tsx
import { signInWithGoogle, signInWithEmail } from "@/integrations/supabase/auth";
import { useState } from "react";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleGoogleLogin = async () => {
    const result = await signInWithGoogle();
    if (!result.success) {
      console.error("Google login failed:", result.error);
    }
  };

  const handleEmailLogin = async () => {
    const result = await signInWithEmail(email, password);
    if (!result.success) {
      console.error("Email login failed:", result.error);
    }
  };

  return (
    <div className="space-y-4">
      <button onClick={handleGoogleLogin} className="btn btn-google">
        Sign in with Google
      </button>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      <button onClick={handleEmailLogin} className="btn btn-primary">
        Sign in with Email
      </button>
    </div>
  );
}
```

---

## 3. Website Stability and Error Handling

### Improvements Made

1. **Error Boundary:**
   - Catches and displays errors gracefully
   - Users see friendly error messages instead of blank pages
   - Shows recovery options (Try Again, Go Home)

2. **Improved Tracking:**
   - Page view tracking has better error handling
   - Presence tracking won't crash if connection fails
   - All async operations wrapped in try-catch

3. **Auth Callback Handler:**
   - Proper OAuth callback handling
   - Displays status messages to users
   - Automatically redirects on success or after error

4. **Better Logging:**
   - Clear error messages in console
   - Non-blocking error handling
   - Graceful fallbacks when services unavailable

### Testing Stability

1. **Test Error Boundary:**
   - Temporarily throw an error in a component
   - Should see error UI instead of blank page
   - "Try Again" and "Go Home" buttons should work

2. **Test Supabase Connection:**
   - Go offline (DevTools → Network → Offline)
   - Navigate between pages
   - Should not crash
   - Should resume when back online

3. **Test Auth Flow:**
   - Try OAuth login
   - Try email/password login
   - Check `/auth/callback` route loads properly

---

## 4. Deployment Checklist

Before deploying to production:

- [ ] Icons are placed in `public/` folder
- [ ] `.env` file has `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY`
- [ ] Google OAuth credentials are configured in Supabase
- [ ] `VITE_SUPABASE_AUTH_REDIRECT_URL` is set to your domain
- [ ] Build succeeds: `npm run build`
- [ ] No errors in browser console
- [ ] Test login flow works
- [ ] Icons display on browser tab and mobile home screen
- [ ] All pages load without crashes

---

## 5. Troubleshooting

### Icons not appearing
- Clear browser cache completely
- Check that files exist in `public/` folder
- Verify file names match exactly (case-sensitive)
- Check browser DevTools → Application → Manifest

### SSO not working
- Verify Google OAuth credentials in Supabase
- Check redirect URL matches your domain
- Check browser console for auth errors
- Ensure cookies are enabled

### Pages crashing
- Open browser DevTools (F12)
- Check Console tab for errors
- Check Network tab for failed API calls
- Check that Supabase connection is working

### Session not persisting
- Check localStorage is enabled
- Verify auth token is being stored
- Check that `persistSession: true` is set (already configured)

---

## 6. File Changes Summary

New/Modified Files:
- `public/favicon.png` - Website favicon (needs to be added)
- `public/icon-192.png` - Android icon (needs to be added)
- `public/icon-512.png` - PWA icon (needs to be added)
- `public/apple-touch-icon.png` - iOS icon (needs to be added)
- `scripts/generate-icons.ts` - Icon generation script
- `src/integrations/supabase/auth.ts` - SSO authentication functions
- `src/components/ErrorBoundary.tsx` - Error handling component
- `src/routes/auth/callback.tsx` - OAuth callback handler
- `src/routes/__root.tsx` - Updated with error boundary and better error handling

Configuration Already Set (in manifest and HTML):
- `public/manifest.webmanifest` - PWA manifest
- `index.html` - Meta tags for icons and PWA

---

## Questions?

For more info:
- Supabase Auth: https://supabase.com/docs/guides/auth
- PWA Icons: https://web.dev/add-manifest/
- Error Boundaries: https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary
