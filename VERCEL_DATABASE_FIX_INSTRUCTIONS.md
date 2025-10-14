# Fix "Tenant or user not found" Error - Step by Step

## Current Status
You're getting: `Error querying the database: FATAL: Tenant or user not found`

This means Vercel **cannot authenticate** with your Supabase database.

---

## ✅ Your Correct Connection Strings

Based on your Supabase project `iqdomkoxncawrzwrrydr`:

### DATABASE_URL (Connection Pooling - Port 6543):
```
postgresql://postgres.iqdomkoxncawrzwrrydr:[YOUR-PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1
```

### DIRECT_URL (Direct Connection - Port 5432):
```
postgresql://postgres.iqdomkoxncawrzwrrydr:[YOUR-PASSWORD]@aws-0-us-east-1.pooler.supabase.com:5432/postgres
```

---

## 🔑 Get Your Database Password from Supabase UI

**You MUST get this from the Supabase dashboard:**

### Method 1: Copy from Supabase Dashboard

1. Go to: https://supabase.com/dashboard/project/iqdomkoxncawrzwrrydr/settings/database

2. Scroll down to **"Connection String"** section

3. Click **"Connection Pooling"**

4. You'll see a connection string like:
   ```
   postgresql://postgres.iqdomkoxncawrzwrrydr:[YOUR-PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres
   ```

5. **Copy the entire string INCLUDING the password**

6. **Add to the end**: `?pgbouncer=true&connection_limit=1`

   Final DATABASE_URL:
   ```
   postgresql://postgres.iqdomkoxncawrzwrrydr:[PASSWORD-YOU-JUST-COPIED]@aws-0-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1
   ```

7. For DIRECT_URL, click **"Session pooling"** instead and copy that string (port will be 5432)

### Method 2: Reset Your Password (If You Don't See It)

If Supabase shows `[YOUR-PASSWORD]` instead of the actual password:

1. Go to: https://supabase.com/dashboard/project/iqdomkoxncawrzwrrydr/settings/database

2. Scroll to **"Database Password"** section

3. Click **"Reset Database Password"**

4. **COPY THE NEW PASSWORD IMMEDIATELY** (you can't see it again!)

5. Replace `[YOUR-PASSWORD]` in both URLs with this password

---

## 🔧 Update Vercel Environment Variables

### Step 1: Update DATABASE_URL

1. Go to: https://vercel.com/authoy-das-projects/flowstatemax/settings/environment-variables

2. Find **DATABASE_URL** in the list

3. Click the **"..."** menu → **Edit**

4. Replace the ENTIRE value with:
   ```
   postgresql://postgres.iqdomkoxncawrzwrrydr:[YOUR-ACTUAL-PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1
   ```
   **Make sure**:
   - Port is `6543` ✓
   - Ends with `?pgbouncer=true&connection_limit=1` ✓
   - Password is correct ✓

5. Click **Save**

### Step 2: Add or Update DIRECT_URL

1. If DIRECT_URL doesn't exist, click **"Add Variable"**
   
   Otherwise, click **"..."** → **Edit** on existing DIRECT_URL

2. Name: `DIRECT_URL`

3. Value:
   ```
   postgresql://postgres.iqdomkoxncawrzwrrydr:[YOUR-ACTUAL-PASSWORD]@aws-0-us-east-1.pooler.supabase.com:5432/postgres
   ```
   **Make sure**:
   - Port is `5432` ✓
   - Same password as DATABASE_URL ✓
   - NO query parameters on this one ✓

4. Environment: **All Environments** (Production, Preview, Development)

5. Click **Save**

---

## 🚀 Redeploy (CRITICAL!)

Environment variables only take effect after redeployment:

1. Go to: https://vercel.com/authoy-das-projects/flowstatemax

2. Click **"Deployments"** tab

3. Find the latest deployment

4. Click **"..."** → **"Redeploy"**

5. **IMPORTANT**: **UNCHECK** "Use existing build cache"

6. Click **"Redeploy"**

7. **Wait for deployment to complete** (watch the build logs)

---

## ✅ Verify It's Fixed

After redeployment completes:

1. Go to: https://flowstatemax.vercel.app/onboarding

2. Click "Continue Without Signing In"

3. Complete onboarding

4. Click "Start Your First Flow Session"

5. Should redirect to `/today` successfully! ✓

---

## 🐛 If Still Not Working

Check Vercel Function Logs:

1. Go to latest deployment in Vercel

2. Click **"Functions"** tab

3. Look for logs from `/api/onboarding/complete`

4. Check if error is:
   - ✅ Still "Tenant or user not found" → Password is wrong
   - ✅ Different error → Share the new error message

---

## 📋 Checklist

- [ ] Got database password from Supabase dashboard
- [ ] Updated DATABASE_URL in Vercel (port 6543, with ?pgbouncer=true&connection_limit=1)
- [ ] Added DIRECT_URL in Vercel (port 5432, no query parameters)
- [ ] Both URLs use the SAME password
- [ ] Redeployed WITHOUT build cache
- [ ] Waited for deployment to complete
- [ ] Tested onboarding flow

---

## Common Mistakes to Avoid

❌ Using port 5432 for DATABASE_URL (should be 6543)
❌ Using port 6543 for DIRECT_URL (should be 5432)
❌ Forgetting `?pgbouncer=true&connection_limit=1` on DATABASE_URL
❌ Adding query parameters to DIRECT_URL (should have none)
❌ Using different passwords for DATABASE_URL and DIRECT_URL
❌ Using wrong password (make sure it's the database password, not project password)
❌ Not redeploying after changing environment variables
❌ Using cached build when redeploying

