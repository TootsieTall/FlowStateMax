# 🔍 Database Connection Status & Setup

## 📊 Current Status

### Local Environment
❓ **Status:** Not configured
- `.env.local` file is missing
- Cannot test database connection locally yet

### Vercel Production
⚠️ **Status:** Needs verification
- Environment variables need to be checked
- May or may not be properly configured

---

## 🎯 Your Next Steps

### Step 1: Set Up Local Environment (5 minutes)

Run this command to automatically set up your local environment:

```bash
cd /Users/authoydas/Desktop/FlowStateMax
./setup-env.sh
```

This will:
1. Create `apps/web/.env.local` with your Supabase credentials
2. Test the database connection
3. Tell you if everything is working

**Alternative (Manual):**
If the script doesn't work, follow: `ENV_SETUP_GUIDE.md`

---

### Step 2: Verify Vercel Environment Variables (3 minutes)

Open this guide and follow the checklist:
📖 **`VERIFY_VERCEL_ENV.md`**

You need to verify these 5 variables are set in Vercel:
1. ✅ `DATABASE_URL` (with pooler URL)
2. ✅ `NEXT_PUBLIC_SUPABASE_URL`
3. ✅ `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. ✅ `NEXTAUTH_URL`
5. ✅ `NEXTAUTH_SECRET`

**Quick Check:**
1. Go to: https://vercel.com/dashboard
2. Click: flowstatemax → Settings → Environment Variables
3. Verify all 5 variables exist and are correct

---

### Step 3: Test Everything (5 minutes)

#### Test Locally:
```bash
# Test database connection
node test-db-connection.js

# If successful, create tables
npm run db:push --workspace=@flowstate/web

# Start dev server
npm run dev

# Visit http://localhost:3000 and test onboarding
```

#### Test on Vercel:
1. After verifying env variables, redeploy
2. Visit: https://flowstatemax.vercel.app
3. Complete onboarding → Click "Start Your First Flow Session"
4. Should reach `/today` dashboard without errors

---

## 📚 Documentation Created

I've created several guides to help you:

| File | Purpose | When to Use |
|------|---------|-------------|
| `ENV_SETUP_GUIDE.md` | Complete environment setup guide | Setting up for first time |
| `VERIFY_VERCEL_ENV.md` | Vercel environment variable checklist | Before deploying to Vercel |
| `setup-env.sh` | Automated local setup script | Quick local setup |
| `test-db-connection.js` | Database connection tester | Verify database works |

---

## 🐛 Troubleshooting

### If Local Connection Fails:

```bash
node test-db-connection.js
```

Common issues:
1. **Supabase project paused** → Open Supabase dashboard to wake it up
2. **Wrong password** → Check `DATABASE_URL` in `.env.local`
3. **Tables don't exist** → Run `npm run db:push --workspace=@flowstate/web`

### If Vercel Deployment Has Database Errors:

Check deployment logs:
1. Vercel Dashboard → Deployments → Latest → Functions
2. Look for error messages like:
   - "Can't reach database" → Wrong `DATABASE_URL`
   - "Environment variable not found" → Variable not set
   - "Connection timeout" → Check if using pooler URL

**Fix:** See `VERIFY_VERCEL_ENV.md` for detailed troubleshooting

---

## ✅ Success Indicators

### Local Is Working When:
- ✅ `node test-db-connection.js` shows "Connected successfully!"
- ✅ Tables are listed in output
- ✅ `npm run dev` starts without errors
- ✅ Can complete onboarding and reach `/today`

### Vercel Is Working When:
- ✅ No database errors in deployment logs
- ✅ Can complete onboarding on https://flowstatemax.vercel.app
- ✅ `/today` page loads without redirect loop
- ✅ User appears in Supabase dashboard → Table Editor → User table

---

## 🔐 Your Supabase Credentials

**Project:** FlowStateMax
**Project Ref:** `iqdomkoxncawrzwrrydr`
**Region:** US East (North Virginia)

**URLs:**
- Dashboard: https://supabase.com/dashboard/project/iqdomkoxncawrzwrrydr
- Database: https://supabase.com/dashboard/project/iqdomkoxncawrzwrrydr/database/tables
- API URL: https://iqdomkoxncawrzwrrydr.supabase.co

**Connection Strings:**
- Local (Direct): `db.iqdomkoxncawrzwrrydr.supabase.co:5432`
- Vercel (Pooler): `aws-0-us-east-1.pooler.supabase.com:5432`

---

## 🚀 Quick Start Commands

```bash
# Navigate to project
cd /Users/authoydas/Desktop/FlowStateMax

# Set up local environment
./setup-env.sh

# Test connection
node test-db-connection.js

# Create database tables
npm run db:push --workspace=@flowstate/web

# Start dev server
npm run dev
```

Then visit: http://localhost:3000

---

## 📞 Need Help?

If you're still having issues after following the guides:

1. **Run diagnostics:**
   ```bash
   node test-db-connection.js
   ```
   Share the output

2. **Check Supabase status:**
   - Go to Supabase dashboard
   - Make sure project is active (not paused)
   - Check connection string in Settings → Database

3. **Check Vercel logs:**
   - Go to latest deployment
   - Check Functions tab for errors
   - Share specific error messages

4. **Verify environment variables:**
   - Local: Check `apps/web/.env.local` exists
   - Vercel: Go through `VERIFY_VERCEL_ENV.md` checklist

---

## 🎉 What Success Looks Like

When everything is working:

1. **Local Development:**
   ```
   $ node test-db-connection.js
   ✅ Connected successfully!
   ✅ Query successful!
   ✅ Found 9 tables
   🎉 Database connection test completed successfully!
   ```

2. **Vercel Deployment:**
   - No errors in build logs
   - No errors in function logs
   - App works end-to-end

3. **User Experience:**
   - Can complete onboarding
   - Reaches `/today` dashboard
   - No redirect loops
   - Data saves to database

---

**Start with `./setup-env.sh` and let me know what you see!** 🚀


