# OAuth Feature Flag Implementation Guide

## Overview

This implementation provides a flexible authentication system that allows you to:
- **Disable Google OAuth instantly** via environment variables (no code redeploy needed on Vercel)
- **Enable guest onboarding** where users can complete onboarding without authentication
- **Show OAuth connection prompt** after onboarding completion
- **Switch between modes** seamlessly for development and production

---

## Quick Recovery: Disable OAuth Now

If Google OAuth is broken in production, follow these steps:

### Option 1: Via Vercel Dashboard (Fastest - No Redeploy Needed)

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add or update these variables:
   ```
   NEXT_PUBLIC_ENABLE_OAUTH=false
   NEXT_PUBLIC_ALLOW_GUEST_ONBOARDING=true
   NEXT_PUBLIC_DEV_MODE=false
   ```
4. Click **Save**
5. Your app will automatically use the new values (Next.js public env vars are read at runtime)

### Option 2: Via .env.local (Development)

Add to `apps/web/.env.local`:
```bash
NEXT_PUBLIC_ENABLE_OAUTH=false
NEXT_PUBLIC_ALLOW_GUEST_ONBOARDING=true
NEXT_PUBLIC_DEV_MODE=true
```

Restart your dev server.

---

## Environment Variables Reference

### Critical Feature Flags

| Variable | Values | Description |
|----------|--------|-------------|
| `NEXT_PUBLIC_ENABLE_OAUTH` | `true`/`false` | Master switch for Google OAuth. Set to `false` to disable OAuth completely. |
| `NEXT_PUBLIC_ALLOW_GUEST_ONBOARDING` | `true`/`false` | Allow users to complete onboarding without authentication. |
| `NEXT_PUBLIC_DEV_MODE` | `true`/`false` | Development mode with test user fallback. |

### Google OAuth Credentials (Only needed when OAuth is enabled)

| Variable | Description |
|----------|-------------|
| `GOOGLE_CLIENT_ID` | Your Google OAuth Client ID |
| `GOOGLE_CLIENT_SECRET` | Your Google OAuth Client Secret |

### Required for NextAuth

| Variable | Description |
|----------|-------------|
| `NEXTAUTH_SECRET` | Secret key for NextAuth (generate with `openssl rand -base64 32`) |
| `NEXTAUTH_URL` | Your app URL (e.g., `https://yourapp.vercel.app` or `http://localhost:3000`) |

---

## Usage Scenarios

### Scenario 1: Production with OAuth Disabled (Emergency Recovery)

**Use case:** OAuth is broken, users can't sign in

```bash
NEXT_PUBLIC_ENABLE_OAUTH=false
NEXT_PUBLIC_ALLOW_GUEST_ONBOARDING=true
NEXT_PUBLIC_DEV_MODE=false
NEXTAUTH_SECRET=your-production-secret
NEXTAUTH_URL=https://yourapp.vercel.app
```

**User Experience:**
- Users can start onboarding immediately without signing in
- No Google sign-in button shown
- Users are created as guests
- Data stored in their session (local)

---

### Scenario 2: Development Mode (Local Testing)

**Use case:** Local development with quick test user

```bash
NEXT_PUBLIC_ENABLE_OAUTH=false
NEXT_PUBLIC_ALLOW_GUEST_ONBOARDING=true
NEXT_PUBLIC_DEV_MODE=true
NEXTAUTH_SECRET=dev-secret-key
NEXTAUTH_URL=http://localhost:3000
```

**User Experience:**
- Quick name entry without real authentication
- Test user ID used for consistency
- OAuth button hidden
- Status message: "Development mode - No authentication required"

---

### Scenario 3: OAuth After Onboarding

**Use case:** Let users onboard as guests, then prompt them to connect Google

```bash
NEXT_PUBLIC_ENABLE_OAUTH=true
NEXT_PUBLIC_ALLOW_GUEST_ONBOARDING=true
NEXT_PUBLIC_DEV_MODE=false
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-client-secret
NEXTAUTH_SECRET=your-production-secret
NEXTAUTH_URL=https://yourapp.vercel.app
```

**User Experience:**
- Users can start as guests
- Complete onboarding without OAuth
- After onboarding, see "Connect Google Account" prompt
- Can dismiss prompt or connect later
- Google sign-in option available in login page

---

### Scenario 4: Full Production with Required OAuth

**Use case:** OAuth is working, require authentication before onboarding

```bash
NEXT_PUBLIC_ENABLE_OAUTH=true
NEXT_PUBLIC_ALLOW_GUEST_ONBOARDING=false
NEXT_PUBLIC_DEV_MODE=false
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-client-secret
NEXTAUTH_SECRET=your-production-secret
NEXTAUTH_URL=https://yourapp.vercel.app
```

**User Experience:**
- Users must sign in with Google before accessing onboarding
- No guest mode available
- Traditional OAuth flow

---

## Testing Procedures

### Test 1: Verify OAuth Can Be Disabled

**Setup:**
```bash
NEXT_PUBLIC_ENABLE_OAUTH=false
NEXT_PUBLIC_ALLOW_GUEST_ONBOARDING=true
```

**Steps:**
1. Visit `/login`
2. **Expected:** No "Sign in with Google" button
3. **Expected:** See "Continue as Guest" form
4. Enter a name and submit
5. **Expected:** Redirected to `/onboarding/goals`
6. Complete onboarding
7. **Expected:** No OAuth prompt shown

**Success Criteria:** ✅ No Google OAuth UI appears anywhere

---

### Test 2: Verify Guest Onboarding Flow

**Setup:**
```bash
NEXT_PUBLIC_ENABLE_OAUTH=false
NEXT_PUBLIC_ALLOW_GUEST_ONBOARDING=true
NEXT_PUBLIC_DEV_MODE=false
```

**Steps:**
1. Visit `/onboarding` (without authentication)
2. **Expected:** Can access onboarding pages directly
3. **Expected:** See "Continue Without Signing In" button
4. Click skip button
5. **Expected:** Progress through onboarding steps
6. Complete all steps
7. **Expected:** Can access `/today` without authentication

**Success Criteria:** ✅ Full onboarding possible without any auth

---

### Test 3: Verify OAuth Prompt After Onboarding

**Setup:**
```bash
NEXT_PUBLIC_ENABLE_OAUTH=true
NEXT_PUBLIC_ALLOW_GUEST_ONBOARDING=true
```

**Steps:**
1. Start as guest (no OAuth)
2. Complete onboarding
3. On `/onboarding/complete` page
4. **Expected:** See "Connect Your Account" modal
5. Click "Maybe Later"
6. **Expected:** Modal dismissed
7. Navigate to `/today`
8. **Expected:** See connection banner (if not dismissed recently)

**Success Criteria:** ✅ OAuth prompt shown to guest users when OAuth is enabled

---

### Test 4: Verify Development Mode

**Setup:**
```bash
NEXT_PUBLIC_DEV_MODE=true
NEXT_PUBLIC_ALLOW_GUEST_ONBOARDING=true
```

**Steps:**
1. Check server console logs
2. **Expected:** See auth configuration logged:
   ```
   🔐 Auth Configuration:
      OAuth Enabled: false
      Guest Onboarding: true
      Dev Mode: true
      Available Providers: Development Login
   ```
3. Visit `/login`
4. **Expected:** See status message "Development mode - No authentication required"

**Success Criteria:** ✅ Dev mode clearly indicated, logging enabled

---

### Test 5: Verify Middleware Protection

**Setup:**
```bash
NEXT_PUBLIC_ENABLE_OAUTH=true
NEXT_PUBLIC_ALLOW_GUEST_ONBOARDING=false
```

**Steps:**
1. Clear cookies/session
2. Try to access `/today` directly
3. **Expected:** Redirected to `/login`
4. Try to access `/onboarding` directly
5. **Expected:** Redirected to `/login`
6. Sign in with OAuth
7. Access `/today`
8. **Expected:** Access granted

**Success Criteria:** ✅ Protected routes properly guarded

---

## API Testing with cURL

### Test Auth Status Endpoint

```bash
# Check if user is authenticated
curl -X GET http://localhost:3000/api/auth/session \
  -H "Cookie: next-auth.session-token=YOUR_SESSION_TOKEN"
```

**Expected Response (Guest User):**
```json
{
  "user": {
    "id": "guest-1234567890",
    "name": "Guest User",
    "email": "guest-1234567890@flowstate.local",
    "isGuest": true
  },
  "expires": "..."
}
```

### Test OAuth Providers

```bash
# Check available providers
curl -X GET http://localhost:3000/api/auth/providers
```

**Expected Response (OAuth Disabled):**
```json
{
  "credentials": {
    "id": "credentials",
    "name": "Guest Login",
    "type": "credentials"
  }
}
```

**Expected Response (OAuth Enabled):**
```json
{
  "credentials": {...},
  "google": {
    "id": "google",
    "name": "Google",
    "type": "oauth"
  }
}
```

---

## Browser Testing Checklist

### Login Page (`/login`)

- [ ] OAuth button only shows when `ENABLE_OAUTH=true`
- [ ] Guest form only shows when `ALLOW_GUEST_ONBOARDING=true`
- [ ] Correct status message shown at bottom
- [ ] Can submit guest form and proceed
- [ ] OAuth button works when enabled

### Onboarding Start (`/onboarding`)

- [ ] Can access without auth when guest mode enabled
- [ ] Redirected to login when guest mode disabled
- [ ] "Continue Without Signing In" button appears in guest mode
- [ ] Skip button works and proceeds to `/onboarding/goals`

### Onboarding Complete (`/onboarding/complete`)

- [ ] OAuth modal appears for guest users (when OAuth enabled)
- [ ] Modal can be dismissed
- [ ] "Maybe Later" stores dismissal in localStorage
- [ ] Can proceed to app after dismissal

### Main App (`/today`, etc.)

- [ ] Guest users can access when OAuth disabled
- [ ] Connection banner shows for guest users (when OAuth enabled)
- [ ] Banner dismissal works
- [ ] App functions normally for guest users

---

## Troubleshooting

### Issue: OAuth button still showing after disabling

**Cause:** Client-side cache or build-time env var

**Solution:**
1. Clear browser cache/localStorage
2. Hard refresh (Cmd+Shift+R / Ctrl+Shift+F5)
3. Check Vercel env vars are set correctly
4. Verify no hardcoded OAuth in code

### Issue: Can't access onboarding as guest

**Cause:** Middleware still requiring auth

**Solution:**
1. Verify `NEXT_PUBLIC_ALLOW_GUEST_ONBOARDING=true`
2. Check middleware logs for "🎫 Guest onboarding access granted"
3. Ensure env vars are properly prefixed with `NEXT_PUBLIC_`

### Issue: OAuth prompt not showing for guests

**Cause:** Feature flag mismatch or dismissal stored

**Solution:**
1. Check `NEXT_PUBLIC_ENABLE_OAUTH=true`
2. Clear localStorage: `localStorage.removeItem('oauth_prompt_dismissed')`
3. Verify user is actually a guest (check session)

### Issue: "Configuration error" on Google OAuth

**Cause:** Missing or invalid Google credentials

**Solution:**
1. Verify `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are set
2. Check redirect URIs in Google Cloud Console
3. Ensure `NEXTAUTH_URL` matches your actual domain
4. For local dev, add `http://localhost:3000` to allowed origins

---

## Security Considerations

### Guest Mode Security

**What's Protected:**
- Guest users cannot access admin functions (add checks in your API routes)
- Guest sessions expire faster (24 hours vs 30 days)
- Guest data is session-only unless you implement persistence

**Best Practices:**
1. Always check `isGuest` flag in sensitive API routes
2. Don't expose sensitive features to guest users
3. Regularly prompt guests to connect accounts
4. Consider data export before session expiry

### Production Recommendations

**For Production:**
- Set `NEXT_PUBLIC_DEV_MODE=false`
- Use strong `NEXTAUTH_SECRET`
- Enable OAuth when possible for data persistence
- Monitor guest user conversions to real accounts

**For Development:**
- `DEV_MODE=true` is fine locally
- Never commit real OAuth credentials
- Use separate Google OAuth apps for dev/prod

---

## Deployment Checklist

### Before Deploying

- [ ] Environment variables configured in Vercel
- [ ] Google OAuth credentials valid (if using OAuth)
- [ ] `NEXTAUTH_SECRET` generated and set
- [ ] `NEXTAUTH_URL` matches production domain
- [ ] Feature flags set appropriately for environment

### After Deploying

- [ ] Test login page loads
- [ ] Test guest onboarding flow
- [ ] Test OAuth flow (if enabled)
- [ ] Verify middleware protection works
- [ ] Check server logs for auth configuration
- [ ] Test on different browsers

### Emergency Rollback

If issues occur:
1. Set `NEXT_PUBLIC_ENABLE_OAUTH=false` in Vercel
2. Set `NEXT_PUBLIC_ALLOW_GUEST_ONBOARDING=true`
3. No redeploy needed - changes take effect immediately
4. Users can continue using app as guests

---

## Files Changed

### New Files Created
- `apps/web/src/lib/guest-auth.ts` - Guest auth utilities and feature flags
- `apps/web/src/components/ConnectAccountPrompt.tsx` - OAuth connection UI
- `apps/web/ENV_CONFIG.md` - Environment configuration guide
- `OAUTH_FEATURE_FLAG_GUIDE.md` - This guide

### Modified Files
- `apps/web/src/lib/auth.ts` - Dynamic provider configuration
- `apps/web/src/middleware.ts` - Guest mode middleware support
- `apps/web/src/app/login/page.tsx` - Conditional OAuth UI
- `apps/web/src/app/onboarding/page.tsx` - Guest skip option
- `apps/web/src/app/onboarding/complete/page.tsx` - OAuth connection prompt

---

## Support

### Common Questions

**Q: Can I re-enable OAuth later without breaking existing guest users?**
A: Yes, guest users will see the connection prompt and can upgrade their accounts.

**Q: What happens to guest data when they connect OAuth?**
A: Currently, they start fresh. Implement a migration strategy if you need to preserve data.

**Q: Can I have both OAuth and guest mode enabled?**
A: Yes! Users can choose between signing in with Google or continuing as guest.

**Q: Is guest mode secure enough for production?**
A: For onboarding and trial purposes, yes. For long-term data storage, prompt users to connect OAuth.

---

**Last Updated:** October 2025
**Version:** 1.0.0

