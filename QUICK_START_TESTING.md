# 🚀 Quick Start - Testing Your App

## Immediate Access (Dev Bypass Method)

**Just want to test pages right now?** Use these URLs:

```
http://localhost:3001/today?devBypass=true
http://localhost:3001/week?devBypass=true
http://localhost:3001/settings?devBypass=true
http://localhost:3001/capture?devBypass=true
http://localhost:3001/explore?devBypass=true
http://localhost:3001/flow?devBypass=true
```

The `?devBypass=true` parameter skips ALL authentication and onboarding checks.

## Test Guest Onboarding (Proper Flow)

1. Go to `http://localhost:3001/onboarding`
2. Click **"Continue Without Signing In"** (creates guest session)
3. Complete onboarding steps
4. On final page, you'll see a **"🛠️ Development Tools"** panel
5. Click **"Skip to Dashboard →"** to go straight to `/today`

## What Was Fixed

### Long-Term Fixes ✅
- **Environment variables** now properly configured in `.env.local`
- **Guest session creation** now works (creates actual NextAuth session)
- **API authentication** now succeeds for guest users
- **Middleware redirect loop** is fixed

### Dev Bypass Added ✅
- **Query parameter bypass**: `?devBypass=true` skips all auth checks
- **Dev tools panel**: Button on onboarding complete page
- **Only in dev mode**: Automatically disabled in production

## Pro Tips

1. **Clear your browser cookies** before testing to start fresh
2. **Check console logs** - you'll see helpful messages like:
   - `🚧 DEV BYPASS: Allowing access to /today`
   - `🎫 Guest onboarding access granted for: /onboarding`
3. **The dev server must be restarted** to load the new `.env.local` file

## Verify It's Working

Open browser console and check for:
```
🔐 Auth Configuration:
   OAuth Enabled: false
   Guest Onboarding: true
   Dev Mode: true
   Available Providers: Guest Login
```

If you see this, everything is configured correctly! 🎉

