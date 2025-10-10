# 🚨 Quick OAuth Recovery Guide

## IMMEDIATE ACTION: Disable Broken OAuth in Production

If Google OAuth is currently blocking users in production, follow these steps:

### Step 1: Update Vercel Environment Variables (2 minutes)

1. Go to your [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your FlowState project
3. Click **Settings** → **Environment Variables**
4. Add or update these variables:

```
NEXT_PUBLIC_ENABLE_OAUTH=false
NEXT_PUBLIC_ALLOW_GUEST_ONBOARDING=true
NEXT_PUBLIC_DEV_MODE=false
```

5. Click **Save**
6. **No redeploy needed!** - These changes take effect immediately for new visitors

### Step 2: Verify Recovery (1 minute)

1. Open your production site in an incognito window
2. Visit the login page
3. ✅ **You should see**: "Continue as Guest" form (NO Google button)
4. Test: Enter a name and proceed through onboarding
5. ✅ **Success**: Users can now complete onboarding without OAuth

---

## What This Implementation Does

✅ **Feature Flag System** - Toggle OAuth on/off without code changes
✅ **Guest Onboarding** - Users can complete onboarding without authentication  
✅ **Dev Mode** - Test user fallback for local development
✅ **Post-Onboarding OAuth** - Optionally prompt users to connect accounts later
✅ **Secure Middleware** - Guest access properly gated
✅ **Zero Downtime Recovery** - Disable broken OAuth instantly

---

## Environment Variables Quick Reference

### Emergency Recovery (OAuth Disabled)
```bash
NEXT_PUBLIC_ENABLE_OAUTH=false
NEXT_PUBLIC_ALLOW_GUEST_ONBOARDING=true
NEXT_PUBLIC_DEV_MODE=false
```

### Normal Production (OAuth Working)
```bash
NEXT_PUBLIC_ENABLE_OAUTH=true
NEXT_PUBLIC_ALLOW_GUEST_ONBOARDING=true  # Optional guest mode
NEXT_PUBLIC_DEV_MODE=false
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-client-secret
```

### Local Development
```bash
NEXT_PUBLIC_ENABLE_OAUTH=false
NEXT_PUBLIC_ALLOW_GUEST_ONBOARDING=true
NEXT_PUBLIC_DEV_MODE=true
```

---

## Testing Your Changes

### Test 1: Verify OAuth is Disabled
```bash
# Visit your site
open https://your-app.vercel.app/login

# Expected: NO "Sign in with Google" button
# Expected: See "Continue as Guest" form
```

### Test 2: Complete Guest Onboarding
```bash
# 1. Enter name in guest form
# 2. Proceed through onboarding steps
# 3. Should reach /today without any OAuth prompts
```

### Test 3: API Check (Optional)
```bash
curl https://your-app.vercel.app/api/auth/providers | jq
# Should only show "credentials" provider, no "google"
```

---

## Files Created/Modified

### New Files ✨
- `apps/web/src/lib/guest-auth.ts` - Feature flag utilities
- `apps/web/src/components/ConnectAccountPrompt.tsx` - OAuth connection UI  
- `apps/web/ENV_CONFIG.md` - Detailed env var documentation
- `OAUTH_FEATURE_FLAG_GUIDE.md` - Comprehensive testing guide
- `QUICK_OAUTH_RECOVERY.md` - This file

### Modified Files 🔧
- `apps/web/src/lib/auth.ts` - Dynamic OAuth provider setup
- `apps/web/src/middleware.ts` - Guest access middleware
- `apps/web/src/app/login/page.tsx` - Conditional OAuth UI
- `apps/web/src/app/onboarding/page.tsx` - Guest skip option
- `apps/web/src/app/onboarding/complete/page.tsx` - OAuth prompt integration

---

## Next Steps

### Immediate (If OAuth is Broken)
1. ✅ Set env vars in Vercel (see Step 1 above)
2. ✅ Test in incognito window
3. ✅ Verify users can onboard as guests

### Short Term (Fix OAuth)
1. Debug Google OAuth configuration
2. Verify redirect URIs in Google Cloud Console
3. Check `NEXTAUTH_URL` matches your domain
4. Test OAuth locally with proper credentials
5. Re-enable OAuth when fixed: `NEXT_PUBLIC_ENABLE_OAUTH=true`

### Long Term (Optional)
1. Review guest user data persistence strategy
2. Implement guest-to-real account migration
3. Add telemetry to track guest conversion rates
4. Consider keeping guest mode as a feature

---

## Troubleshooting

### "Still seeing Google button after env var change"

**Solution:**
- Clear browser cache and hard refresh (Cmd+Shift+R)
- Check env vars are saved in Vercel
- Variables must start with `NEXT_PUBLIC_` for client-side access
- Wait 1-2 minutes for Vercel edge cache to update

### "Redirected to login when accessing /onboarding"

**Solution:**
- Verify `NEXT_PUBLIC_ALLOW_GUEST_ONBOARDING=true` is set
- Check Vercel logs for middleware messages
- Ensure env var doesn't have extra spaces

### "OAuth prompt still showing to guest users"

**Solution:**
- Set `NEXT_PUBLIC_ENABLE_OAUTH=false` to disable prompts
- Clear localStorage: `localStorage.removeItem('oauth_prompt_dismissed')`

---

## Support & Documentation

📖 **Full Guide:** See `OAUTH_FEATURE_FLAG_GUIDE.md` for:
- Complete testing procedures
- All usage scenarios
- Security considerations
- API testing examples
- Browser testing checklist

🔧 **Env Config:** See `apps/web/ENV_CONFIG.md` for:
- Detailed environment variable documentation
- Configuration examples
- Development setup

---

## Rollback Plan

If this implementation causes issues:

1. **Revert the commit:**
   ```bash
   git revert 61ca697
   git push origin main
   ```

2. **Or use previous working state:**
   ```bash
   git checkout 19e8780
   ```

3. **Emergency: Use old code with guest bypass**
   - Just keep `NEXT_PUBLIC_ALLOW_GUEST_ONBOARDING=true`
   - Guest mode works independently

---

## Summary

✅ **All changes committed and pushed**  
✅ **No linting errors**  
✅ **Zero-downtime recovery available**  
✅ **Comprehensive documentation provided**  
✅ **Production-ready implementation**  

**Your OAuth is now controllable via environment variables!**

Set `NEXT_PUBLIC_ENABLE_OAUTH=false` in Vercel right now to immediately recover from broken OAuth.

---

Last Updated: October 2025  
Commit: 61ca697

