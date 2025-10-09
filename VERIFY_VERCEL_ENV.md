# ✅ Verify Vercel Environment Variables

## 🎯 Required Environment Variables for Vercel

Your FlowStateMax app needs these environment variables set in Vercel:

### 1. Database Connection (Pooled for Serverless)

```
Variable: DATABASE_URL
Value: postgresql://postgres.iqdomkoxncawrzwrrydr:Ad215143421$@aws-0-us-east-1.pooler.supabase.com:5432/postgres?pgbouncer=true&connection_limit=1
```

⚠️ **Important Notes:**
- Uses **pooler** URL: `aws-0-us-east-1.pooler.supabase.com`
- Password uses `$` instead of `!` (URL encoding)
- Includes `pgbouncer=true` for connection pooling
- Includes `connection_limit=1` to prevent connection leaks

### 2. Supabase Public URL

```
Variable: NEXT_PUBLIC_SUPABASE_URL
Value: https://iqdomkoxncawrzwrrydr.supabase.co
```

### 3. Supabase Anonymous Key

```
Variable: NEXT_PUBLIC_SUPABASE_ANON_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlxZG9ta294bmNhd3J6d3JyeWRyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk5Mjc2NzUsImV4cCI6MjA3NTUwMzY3NX0.EngmT5oKDjMXO9CatzFNWOmvtHPiH5AVLActCf-MQXg
```

### 4. NextAuth URL (Production)

```
Variable: NEXTAUTH_URL
Value: https://flowstatemax.vercel.app
```

### 5. NextAuth Secret

```
Variable: NEXTAUTH_SECRET
Value: gEYpC/uNJkBuINquy4OrhXtStmsJAfe9BIFpdvfy0Ek=
```

---

## 📋 How to Verify in Vercel Dashboard

### Step 1: Open Vercel Dashboard

1. Go to: https://vercel.com/dashboard
2. Click on your **`flowstatemax`** project

### Step 2: Check Environment Variables

1. Click **"Settings"** at the top
2. Click **"Environment Variables"** in the left sidebar
3. You should see all 5 variables listed

### Step 3: Verify Each Variable

For each variable, check:

✅ **Variable Name** matches exactly (case-sensitive!)
✅ **Value** is correct (no extra spaces or quotes)
✅ **Applied to:** Production, Preview, Development (all checked)

---

## 🔍 Common Issues & Fixes

### Issue 1: Variable Names Don't Match

❌ Wrong: `NEXT_PUBLIC_supabase_url`
✅ Correct: `NEXT_PUBLIC_SUPABASE_URL`

**Fix:** Delete and recreate with exact name

### Issue 2: Extra Quotes in Values

❌ Wrong: `"https://iqdomkoxncawrzwrrydr.supabase.co"`
✅ Correct: `https://iqdomkoxncawrzwrrydr.supabase.co`

**Fix:** Remove quotes from the value

### Issue 3: Not Applied to All Environments

If only checked for "Production":
- Preview deployments will fail
- Pull request deployments will fail

**Fix:** Check all three: Production, Preview, Development

### Issue 4: Using Direct Connection Instead of Pooler

❌ Wrong: `db.iqdomkoxncawrzwrrydr.supabase.co:5432`
✅ Correct: `aws-0-us-east-1.pooler.supabase.com:5432`

**Fix:** Update `DATABASE_URL` to use pooler URL

### Issue 5: Wrong Password Encoding

❌ Wrong: `Ad215143421!` (direct connection format)
✅ Correct: `Ad215143421$` (pooler format)

**Fix:** Replace `!` with `$` in pooler URL

---

## 🧪 Test After Setting Variables

### 1. Redeploy

After setting/updating environment variables:

1. Go to **"Deployments"** tab
2. Click **"..."** menu on latest deployment
3. Click **"Redeploy"**
4. Wait for deployment to complete

### 2. Check Deployment Logs

1. Click on the deployment
2. Go to **"Functions"** tab
3. Look for any errors:
   - ✅ No database errors = Connection working!
   - ❌ "Can't reach database" = Check `DATABASE_URL`
   - ❌ "Environment variable not found" = Variable not set

### 3. Test the App

Visit: https://flowstatemax.vercel.app

1. Complete onboarding
2. Click "Start Your First Flow Session"
3. Should reach `/today` dashboard without errors

---

## 📊 Environment Variables Comparison

| Variable | Local (.env.local) | Vercel (Production) |
|----------|-------------------|---------------------|
| `DATABASE_URL` | Direct connection (`:5432`) | Pooler connection (`:5432` with pooler) |
| Password in URL | `Ad215143421!` | `Ad215143421$` |
| `NEXTAUTH_URL` | `http://localhost:3000` | `https://flowstatemax.vercel.app` |
| Others | Same | Same |

---

## ✅ Quick Verification Checklist

Use this checklist to verify your Vercel setup:

- [ ] Go to Vercel → flowstatemax → Settings → Environment Variables
- [ ] `DATABASE_URL` is set
  - [ ] Uses pooler URL: `aws-0-us-east-1.pooler.supabase.com`
  - [ ] Password is `Ad215143421$` (with `$`)
  - [ ] Includes `pgbouncer=true`
  - [ ] Includes `connection_limit=1`
- [ ] `NEXT_PUBLIC_SUPABASE_URL` is set to `https://iqdomkoxncawrzwrrydr.supabase.co`
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` is set (long JWT token)
- [ ] `NEXTAUTH_URL` is set to `https://flowstatemax.vercel.app`
- [ ] `NEXTAUTH_SECRET` is set
- [ ] All variables applied to: Production, Preview, Development
- [ ] No extra quotes around values
- [ ] No trailing spaces in values
- [ ] Redeployed after adding/updating variables
- [ ] Checked deployment logs for errors
- [ ] Tested app end-to-end

---

## 🆘 Still Having Issues?

If database connection is still failing:

1. **Check Supabase Dashboard:**
   - Go to: https://supabase.com/dashboard
   - Click on your project
   - Make sure it's not paused (free tier pauses after inactivity)
   - Click around to "wake it up"

2. **Verify Connection String:**
   - Go to: Supabase → Settings → Database
   - Under "Connection pooling", copy the "Connection string"
   - Make sure it matches your `DATABASE_URL` (with your password)

3. **Check Vercel Logs:**
   - Vercel Dashboard → Deployments → Latest → Functions
   - Look for specific error messages
   - Share them for troubleshooting

4. **Test Locally First:**
   - Run `./setup-env.sh` to create local `.env.local`
   - Run `node test-db-connection.js` to test connection
   - If local works but Vercel doesn't, it's a Vercel config issue

---

## 📞 Support Resources

- **Supabase Docs:** https://supabase.com/docs
- **Vercel Docs:** https://vercel.com/docs/concepts/projects/environment-variables
- **Prisma Pooling Guide:** https://www.prisma.io/docs/guides/performance-and-optimization/connection-management


