# 🚀 Vercel Deployment Guide

## Changes Pushed to GitHub

All onboarding fixes have been committed and pushed to `main` branch:
- ✅ Guest authentication flow fixed
- ✅ Development bypass system added
- ✅ Database integration verified with Supabase
- ✅ Middleware redirect loop resolved

**Commit Hash**: `51f43ee`

## Required Environment Variables for Vercel

Add these environment variables in your Vercel project settings:

### 🔐 Authentication & Auth Configuration

```bash
# NextAuth Configuration (REQUIRED)
NEXTAUTH_SECRET=<generate-with-openssl-rand-base64-32>
NEXTAUTH_URL=https://your-app-name.vercel.app

# Feature Flags - Production Settings
NEXT_PUBLIC_ENABLE_OAUTH=false
NEXT_PUBLIC_ALLOW_GUEST_ONBOARDING=true
NEXT_PUBLIC_DEV_MODE=false  # Set to false for production!

# Guest User Configuration
DEV_GUEST_USER_ID=guest-user-prod-001
```

### 🗄️ Database Configuration

```bash
# Supabase Connection (REQUIRED)
DATABASE_URL=postgresql://[user]:[password]@[host]:[port]/[database]?pgbouncer=true&connection_limit=1
DIRECT_URL=postgresql://[user]:[password]@[host]:[port]/[database]

# Get these from your Supabase project settings
```

### 📧 Google OAuth (Optional - Currently Disabled)

```bash
# Only needed if you enable NEXT_PUBLIC_ENABLE_OAUTH=true
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

## How to Get Supabase Database URLs

1. Go to your Supabase project dashboard
2. Navigate to **Settings** → **Database**
3. Find **Connection Pooling** section for `DATABASE_URL`
4. Find **Connection String** → **URI** for `DIRECT_URL`
5. Copy both URLs and add them to Vercel

## Important Notes for Production

### ⚠️ Security Recommendations

1. **Generate a secure NEXTAUTH_SECRET**:
   ```bash
   openssl rand -base64 32
   ```

2. **Set DEV_MODE to false**:
   - `NEXT_PUBLIC_DEV_MODE=false` in production
   - This disables the dev bypass (`?devBypass=true`)

3. **Update NEXTAUTH_URL**:
   - Set to your actual Vercel deployment URL
   - Example: `https://flowstate-max.vercel.app`

### 🎯 Feature Flag Recommendations

**For Testing/Beta**:
```bash
NEXT_PUBLIC_ENABLE_OAUTH=false
NEXT_PUBLIC_ALLOW_GUEST_ONBOARDING=true
NEXT_PUBLIC_DEV_MODE=false
```

**For Production with OAuth**:
```bash
NEXT_PUBLIC_ENABLE_OAUTH=true
NEXT_PUBLIC_ALLOW_GUEST_ONBOARDING=true  # Allow guests, prompt to connect later
NEXT_PUBLIC_DEV_MODE=false
```

**For Production OAuth-Only**:
```bash
NEXT_PUBLIC_ENABLE_OAUTH=true
NEXT_PUBLIC_ALLOW_GUEST_ONBOARDING=false
NEXT_PUBLIC_DEV_MODE=false
```

## Deployment Checklist

- [ ] Add all environment variables to Vercel
- [ ] Verify `NEXTAUTH_URL` matches your deployment URL
- [ ] Set `NEXT_PUBLIC_DEV_MODE=false` for production
- [ ] Generate secure `NEXTAUTH_SECRET`
- [ ] Add Supabase `DATABASE_URL` and `DIRECT_URL`
- [ ] Deploy from GitHub (Vercel will auto-deploy on push)
- [ ] Test guest onboarding flow on production
- [ ] Verify database connection works
- [ ] Check that dev bypass is disabled (try `?devBypass=true` - should not work)

## Testing on Vercel

After deployment:

1. **Test Guest Onboarding**:
   - Go to `https://your-app.vercel.app/onboarding`
   - Click "Continue Without Signing In"
   - Complete onboarding
   - Should successfully reach `/today`

2. **Verify Dev Bypass is Disabled**:
   - Try `https://your-app.vercel.app/today?devBypass=true`
   - Should redirect to onboarding (not bypass)
   - This confirms security is working

3. **Check Database Connection**:
   - Complete a guest onboarding
   - Check Supabase database to see if user was created
   - Verify `onboardingComplete` flag is set correctly

## Troubleshooting

### Issue: "Unauthorized" errors
- Check `DATABASE_URL` is set correctly
- Verify Supabase connection pooling is enabled
- Check `NEXTAUTH_SECRET` is set

### Issue: Redirect loop to /onboarding
- Verify `NEXT_PUBLIC_ALLOW_GUEST_ONBOARDING=true`
- Check database can be written to (user creation succeeds)
- Verify session is being created (check browser cookies)

### Issue: Dev bypass still works in production
- Confirm `NEXT_PUBLIC_DEV_MODE=false` in Vercel
- Rebuild/redeploy after changing env vars
- Clear browser cache

## Next Steps After Deployment

1. Test the complete onboarding flow
2. Verify all pages are accessible after onboarding
3. Check database entries are being created
4. Enable Google OAuth if desired
5. Consider adding RLS (Row Level Security) policies in Supabase

## Database Verified ✅

The Supabase database schema has been verified and tested:
- ✅ User table with correct fields
- ✅ `onboardingComplete` boolean field
- ✅ Insert/Update/Delete operations working
- ✅ All foreign key relationships intact
- ✅ Guest user flow fully functional

You're ready to deploy! 🎉

