# 🚀 Connect Vercel to Supabase - Automated Setup

I've configured everything to automatically connect your Vercel deployment to Supabase! Here's how to run it.

## ✨ What This Does

The script will automatically:
1. ✅ Configure DATABASE_URL on Vercel (connection pooling, port 6543)
2. ✅ Configure DIRECT_URL on Vercel (direct connection, port 5432)  
3. ✅ Set Supabase public URL and anon key
4. ✅ Trigger a fresh deployment without build cache
5. ✅ Fix the onboarding data saving issue

## 🔑 Prerequisites

### 1. Get Your Vercel Token

1. Go to: https://vercel.com/account/tokens
2. Click **"Create Token"**
3. Name it: `FlowStateMax Setup`
4. Copy the token

### 2. Get Your Database Password

**Option A: Copy from Dashboard**
1. Go to: https://supabase.com/dashboard/project/iqdomkoxncawrzwrrydr/settings/database
2. Scroll to **"Connection String"** section
3. Click **"Connection Pooling"** tab
4. Copy the password from the connection string (after `postgres.iqdomkoxncawrzwrrydr:` and before `@`)

**Option B: Reset Password**
1. Go to: https://supabase.com/dashboard/project/iqdomkoxncawrzwrrydr/settings/database
2. Scroll to **"Database Password"**
3. Click **"Reset Database Password"**
4. **Copy the password IMMEDIATELY** (you can't see it again!)

## 🏃 Run the Script

```bash
# Set your Vercel token
export VERCEL_TOKEN='your-vercel-token-here'

# Run the connection script
./connect-vercel-supabase.sh
```

The script will prompt you for your database password and then:
- Configure all environment variables on Vercel
- Trigger a fresh deployment
- Display the deployment URL to monitor

## ⏱️ Wait for Deployment

Monitor your deployment at:
https://vercel.com/authoy-das-projects/flowstatemax

This usually takes **2-3 minutes**.

## ✅ Verify It Works

After deployment completes:

### 1. Test Onboarding
1. Go to: https://flowstatemax.vercel.app/onboarding
2. Complete the full onboarding flow:
   - Select your goals
   - Add ritual items (e.g., "Make coffee ☕", "Clear desk 🗂️")
   - Add a flow location
   - Select apps to block
3. Click "Complete Onboarding"

### 2. Check Database
Verify data was saved:
1. Go to: https://supabase.com/dashboard/project/iqdomkoxncawrzwrrydr/editor
2. Run these queries:

```sql
-- Should show > 0 if onboarding worked
SELECT COUNT(*) FROM "RitualItem";
SELECT COUNT(*) FROM "FlowLocation";
SELECT COUNT(*) FROM "BlockedApp";
```

**Before fix:** All counts = 0
**After fix:** All counts > 0 ✅

## 🔧 What Was Changed

### 1. Prisma Schema (`apps/web/prisma/schema.prisma`)
```prisma
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")      // Pooled connection (port 6543)
  directUrl = env("DIRECT_URL")        // Direct connection (port 5432)
}
```

### 2. Environment Variables on Vercel
- **DATABASE_URL**: `postgresql://postgres.iqdomkoxncawrzwrrydr:****@aws-0-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1`
- **DIRECT_URL**: `postgresql://postgres.iqdomkoxncawrzwrrydr:****@aws-0-us-east-1.pooler.supabase.com:5432/postgres`
- **NEXT_PUBLIC_SUPABASE_URL**: `https://iqdomkoxncawrzwrrydr.supabase.co`
- **NEXT_PUBLIC_SUPABASE_ANON_KEY**: `eyJhbGci...` (configured automatically)

## 🐛 Troubleshooting

### "VERCEL_TOKEN is not set"
```bash
export VERCEL_TOKEN='vtk_your_token_here'
```

### "Password authentication failed"
Your database password is incorrect. Try:
1. Resetting the password in Supabase dashboard
2. Running the script again with the new password

### Script completes but data still not saving
1. Check Vercel deployment logs: https://vercel.com/authoy-das-projects/flowstatemax
2. Look for errors in Functions tab
3. Try manual redeployment:
   - Go to Deployments
   - Click "..." → "Redeploy"
   - **UNCHECK** "Use existing build cache"
   - Click "Redeploy"

### Database still shows 0 rows
Make sure you:
1. Waited for deployment to complete
2. Completed the FULL onboarding flow (all steps)
3. Didn't skip any steps
4. Checked the correct tables in Supabase

## 📊 Current Database Status

**Before Fix:**
- Users: 11 ✅
- RitualItems: 0 ❌
- FlowLocations: 0 ❌
- BlockedApps: 0 ❌

**After Fix (Expected):**
- Users: 11+ ✅
- RitualItems: >0 ✅
- FlowLocations: >0 ✅
- BlockedApps: >0 ✅

## 🎉 Success Indicators

You'll know it's working when:
1. ✅ Deployment completes without errors
2. ✅ Onboarding flow completes successfully
3. ✅ Database tables show new rows
4. ✅ Users can start flow sessions
5. ✅ Ritual items appear on dashboard

## 📖 Manual Setup (Alternative)

If you prefer to configure manually, see: `ONBOARDING_SAVE_FIX.md`

It includes step-by-step instructions for:
- Getting connection strings from Supabase
- Setting environment variables in Vercel UI
- Redeploying with fresh cache

## 🔐 Security Note

The script:
- ✅ Encrypts all environment variables on Vercel
- ✅ Never stores your password in files
- ✅ Only uses your password to construct connection strings
- ✅ Requires your explicit Vercel token for authorization

Your password is transmitted securely to Vercel's API and encrypted at rest.

## 💡 Pro Tips

1. **Save Your Password**: Store it in a password manager
2. **Test Locally First**: Use the same connection strings in `.env.local`
3. **Monitor Deployments**: Bookmark the Vercel deployments page
4. **Check Database Regularly**: Verify data is being saved

## 🆘 Need Help?

If you encounter any issues:
1. Check the script output for specific error messages
2. Review Vercel deployment logs
3. Check Supabase dashboard for connection attempts
4. Refer to `ONBOARDING_SAVE_FIX.md` for manual setup

---

**Ready to connect?** Run the script now:

```bash
export VERCEL_TOKEN='your-token'
./connect-vercel-supabase.sh
```

