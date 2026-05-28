# Website Stability & Testing Checklist

## Pre-Deployment Testing

Use this checklist before deploying to production to ensure all pages work correctly and connections are stable.

### ✅ 1. Core Functionality

- [ ] Home page loads without errors
- [ ] Navigation menu works on all pages
- [ ] Mobile responsive layout works
- [ ] All buttons and links navigate correctly
- [ ] No console errors (F12 → Console)
- [ ] No network errors (F12 → Network)

### ✅ 2. Page Testing

Test each page individually and verify it loads:

**Main Pages:**
- [ ] `/` - Home page
- [ ] `/about` - About page
- [ ] `/events` - Events page
- [ ] `/gallery` - Gallery page
- [ ] `/panchang` - Panchang page
- [ ] `/parikrama` - Parikrama page
- [ ] `/videos` - Videos page
- [ ] `/reviews` - Reviews page
- [ ] `/sandesh` - Daily Sandesh page
- [ ] `/contact` - Contact form
- [ ] `/donation` - Donation page
- [ ] `/inbox` - Inbox page

**Admin:**
- [ ] `/admin` - Admin panel accessible with passcode

### ✅ 3. Error Handling

**Test error recovery:**
- [ ] Go offline (DevTools → Network → Offline)
- [ ] Try to load a page → should show graceful error
- [ ] Try API call → should not crash
- [ ] Go back online → should resume working
- [ ] Broken route `/nonexistent` → should show 404 page

### ✅ 4. Authentication (SSO)

**After setting up Google OAuth:**
- [ ] Google login button appears
- [ ] Clicking it redirects to Google
- [ ] Can sign in with Google account
- [ ] Redirects to `/auth/callback`
- [ ] Then redirects to home page
- [ ] User session persists after refresh
- [ ] Session expires appropriately

### ✅ 5. Data Submission

- [ ] Contact form submits successfully
- [ ] Review submission works
- [ ] Donation form works
- [ ] Admin can add/edit/delete content
- [ ] Forms show validation errors correctly
- [ ] Success messages appear after submission

### ✅ 6. Performance

- [ ] Pages load in < 3 seconds
- [ ] Images load properly
- [ ] No layout shifts while loading
- [ ] Smooth scrolling works
- [ ] Animations are smooth

### ✅ 7. Mobile Testing

Test on mobile devices:
- [ ] iPhone Safari
- [ ] Android Chrome
- [ ] Responsive menu works
- [ ] Touch interactions work
- [ ] Icons appear properly

### ✅ 8. Browser Testing

Test in multiple browsers:
- [ ] Google Chrome
- [ ] Mozilla Firefox
- [ ] Safari (macOS/iOS)
- [ ] Edge
- [ ] Mobile browsers

### ✅ 9. Icons & Branding

- [ ] Favicon appears in browser tab
- [ ] Can install as PWA (Chrome)
- [ ] App icon appears on home screen (Android)
- [ ] Apple touch icon appears (iOS)
- [ ] Manifest file is valid

### ✅ 10. Supabase Connection

- [ ] Can connect to Supabase database
- [ ] Page view tracking works
- [ ] Live visitor count works
- [ ] User presence updates
- [ ] No database timeout errors

### ✅ 11. Notifications & Alerts

- [ ] Toast notifications appear
- [ ] Error messages are readable
- [ ] Success messages show correctly
- [ ] Loading spinners appear during async operations

### ✅ 12. Special Features

- [ ] Audio player works (if applicable)
- [ ] Floating player persists across pages
- [ ] Language switching works (if i18n implemented)
- [ ] Theme switching works (if dark mode available)

---

## Running Automated Checks

### Build Check
```bash
npm run build
# Should complete without errors
```

### Type Check
```bash
# TypeScript should show no errors
```

### Lint Check
```bash
npm run lint
# Should pass without warnings
```

### Format Check
```bash
npm run format
# Code should be properly formatted
```

---

## Local Development Testing

### Start Development Server
```bash
npm run dev
# Server should start at http://localhost:8080
```

### Simulate Production Build
```bash
npm run build
npm run preview
# Should run built version locally
```

### Test Network Errors
1. Open DevTools (F12)
2. Go to Network tab
3. Click the throttling dropdown → set to "Offline"
4. Navigate between pages
5. App should handle gracefully
6. Go back online → should resume working

### Check Console for Errors
```bash
# Open DevTools Console (F12 → Console)
# Should show no red errors
# Some yellow warnings are OK
```

---

## Performance Testing

### Lighthouse Score
1. Open DevTools (F12)
2. Go to Lighthouse tab
3. Click "Analyze page load"
4. Target scores:
   - Performance: > 80
   - Accessibility: > 90
   - Best Practices: > 90
   - SEO: > 90

### Network Performance
In DevTools Network tab:
- Reduce to "Slow 3G" or "Fast 3G"
- Load pages
- Should still be functional
- May be slower but not broken

---

## Production Deployment Checklist

Before deploying to Vercel/production:

- [ ] All tests pass locally
- [ ] No console errors in DevTools
- [ ] No TypeScript errors
- [ ] Build completes successfully: `npm run build`
- [ ] Icons are in `public/` folder
- [ ] `.env` variables are set in deployment platform
- [ ] Google OAuth credentials are configured
- [ ] Supabase URL and keys are correct
- [ ] Database migrations are up to date
- [ ] RLS policies are properly configured
- [ ] CORS settings allow your domain

---

## Troubleshooting Guide

### Page shows blank screen
1. Open DevTools Console (F12)
2. Check for error messages
3. Check Network tab for failed requests
4. Try clearing cache (Ctrl+Shift+Del)
5. Try in incognito mode

### Forms don't submit
1. Check Network tab → see if request is sent
2. Check database RLS policies
3. Check browser console for errors
4. Verify Supabase connection

### Icons don't appear
1. Check `public/` folder has icon files
2. Clear browser cache completely
3. Check DevTools → Application → Manifest
4. Verify file names match exactly

### SSO doesn't work
1. Check Google OAuth credentials
2. Verify redirect URL matches exactly
3. Check browser console for auth errors
4. Ensure cookies are enabled

### Database connection fails
1. Check Supabase URL and key
2. Verify RLS policies allow access
3. Check network connection
4. Try incognito mode (clear cookies)

---

## Performance Optimization Tips

1. **Lazy Load Images:**
   ```tsx
   <img loading="lazy" src="..." />
   ```

2. **Code Splitting:**
   Already configured in vite.config.ts

3. **Database Optimization:**
   Use indexes on frequently queried columns

4. **Caching:**
   Set up appropriate cache headers

---

## Support & Resources

- [Vite Docs](https://vitejs.dev)
- [React Router Docs](https://tanstack.com/router)
- [Supabase Docs](https://supabase.com/docs)
- [Tailwind CSS Docs](https://tailwindcss.com)
- [Web Vitals](https://web.dev/vitals/)

---

**Pro Tip:** Use this checklist for every deployment to ensure quality and stability!
