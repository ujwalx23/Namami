# SSO (Single Sign-On) Quick Start Guide

## What's New?

Your website now supports:
- ✅ Google OAuth login
- ✅ Email/password authentication  
- ✅ Session persistence
- ✅ Automatic token refresh
- ✅ Secure OAuth callback handling

## 1. Configure Google OAuth

### Step 1: Get Google Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (or select existing)
3. Enable the "Google+ API"
4. Go to Credentials → Create OAuth 2.0 Client ID
5. Choose "Web application"
6. Add authorized redirect URIs:
   - Local: `http://localhost:8080/auth/callback`
   - Production: `https://yourdomain.com/auth/callback`
7. Copy the **Client ID** and **Client Secret**

### Step 2: Configure in Supabase

1. Go to [Supabase Dashboard](https://supabase.com)
2. Select your project
3. Go to **Authentication** → **Providers**
4. Find **Google** and click to expand
5. Toggle **Enable Google provider** ON
6. Paste your Client ID and Client Secret
7. Click **Save**

### Step 3: Set Environment Variables

Create or update `.env.local`:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_publishable_key
VITE_SUPABASE_AUTH_REDIRECT_URL=http://localhost:8080/auth/callback
```

For production, update the redirect URL to your domain.

## 2. Add Login UI

Create a login component (example):

```tsx
import { signInWithGoogle } from "@/integrations/supabase/auth";
import { toast } from "sonner";

export function LoginButton() {
  const handleGoogleLogin = async () => {
    const result = await signInWithGoogle();
    if (!result.success) {
      toast.error(result.error || "Login failed");
    }
  };

  return (
    <button 
      onClick={handleGoogleLogin}
      className="px-4 py-2 bg-white border border-gray-300 rounded-lg"
    >
      Sign in with Google
    </button>
  );
}
```

## 3. Check Current User

```tsx
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export function UserProfile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };

    getUser();
  }, []);

  if (!user) return <div>Not logged in</div>;

  return (
    <div>
      <p>Welcome, {user.email}!</p>
      <img src={user.user_metadata?.picture} alt="Profile" />
    </div>
  );
}
```

## 4. Listen to Auth Changes

```tsx
import { useEffect, useState } from "react";
import { onAuthStateChange } from "@/integrations/supabase/auth";

export function AuthListener() {
  const [session, setSession] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChange((event, session) => {
      console.log("Auth event:", event);
      setSession(session);
    });

    return unsubscribe;
  }, []);

  return <div>{session ? "Logged in" : "Logged out"}</div>;
}
```

## 5. Protected Routes

Create a protected route component:

```tsx
import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";

export function ProtectedRoute({ children }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate({ to: "/login" });
      }
      setLoading(false);
    };

    checkAuth();
  }, [navigate]);

  if (loading) return <div>Loading...</div>;
  return children;
}
```

## 6. Testing SSO Locally

```bash
# Start dev server
npm run dev

# Open http://localhost:8080
# Click login button
# You'll be redirected to Google
# After signing in, you'll return to http://localhost:8080/auth/callback
# Then redirected to home page
```

## 7. Common Issues

### Issue: "Redirect URI mismatch"
**Fix:** Ensure the redirect URI in Google Console matches exactly:
```
Google Console: http://localhost:8080/auth/callback
Your .env: VITE_SUPABASE_AUTH_REDIRECT_URL=http://localhost:8080/auth/callback
```

### Issue: "Invalid client" error
**Fix:** Double-check Client ID and Secret in Supabase are correct

### Issue: Cookies not being set
**Fix:** Ensure your domain allows third-party cookies, or configure PKCE flow (already configured)

### Issue: Session not persisting after refresh
**Fix:** Check that localStorage is enabled in browser

## 8. File Reference

Available auth functions in `src/integrations/supabase/auth.ts`:

- `getCurrentUser()` - Get current authenticated user
- `signInWithEmail(email, password)` - Login with email
- `signUpWithEmail(email, password)` - Register with email
- `signInWithGoogle()` - Login with Google OAuth
- `signOut()` - Logout user
- `onAuthStateChange(callback)` - Listen to auth state changes

## 9. Next Steps

1. ✅ Configure Google OAuth credentials
2. ✅ Set environment variables in `.env.local`
3. ✅ Add login UI to your site
4. ✅ Test local login flow
5. ✅ Deploy to production with production Google credentials
6. ✅ Update redirect URL for production domain

## Resources

- [Supabase Auth Docs](https://supabase.com/docs/guides/auth)
- [Google OAuth Setup](https://developers.google.com/identity/protocols/oauth2)
- [React Router Protected Routes](https://tanstack.com/router/latest)

---

**Need help?** Check browser DevTools Console for detailed error messages.
