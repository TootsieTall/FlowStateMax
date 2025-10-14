# 🔧 FIX: Onboarding Not Saving Data

## Problem Identified
✅ Vercel deployment successful
✅ Build completed without errors
❌ **Onboarding data NOT saving to database**

### Evidence:
- Database has **11 users** but **0 ritual items, 0 locations, 0 blocked apps**
- Users can complete onboarding but data disappears

## Root Cause
Vercel environment variables for database connection are either:
1. Not configured
2. Using wrong password
3. Missing DIRECT_URL variable

---

## 🚀 IMMEDIATE FIX

### Step 1: Get Your Database Connection Strings from Supabase

1. Go to: https://supabase.com/dashboard/project/iqdomkoxncawrzwrrydr/settings/database

2. Scroll to **"Connection String"** section

3. Click **"Connection Pooling"** tab and copy the string:
   ```
   postgresql://postgres.iqdomkoxncawrzwrrydr:[YOUR-PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres
   ```

4. Click **"Session pooling"** tab and copy that string too:
   ```
   postgresql://postgres.iqdomkoxncawrzwrrydr:[YOUR-PASSWORD]@aws-0-us-east-1.pooler.supabase.com:5432/postgres
   ```

**⚠️ IMPORTANT:** If you see `[YOUR-PASSWORD]` instead of an actual password, you need to:
- Go to **Settings** → **Database**
- Scroll to **"Database Password"**
- Click **"Reset Database Password"**
- **Copy the password IMMEDIATELY** (you won't see it again!)

---

### Step 2: Update Vercel Environment Variables

1. Go to: https://vercel.com/authoy-das-projects/flowstatemax/settings/environment-variables

2. **DATABASE_URL** (Connection Pooling):
   - Click **"..."** → **"Edit"** on DATABASE_URL
   - Replace with:
     ```
     postgresql://postgres.iqdomkoxncawrzwrrydr:[YOUR-ACTUAL-PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1
     ```
   - **Must have**:
     - Port `6543` ✓
     - Ends with `?pgbouncer=true&connection_limit=1` ✓
   - Click **Save**

3. **DIRECT_URL** (Direct Connection):
   - If doesn't exist, click **"Add Variable"**
   - Name: `DIRECT_URL`
   - Value:
     ```
     postgresql://postgres.iqdomkoxncawrzwrrydr:[YOUR-ACTUAL-PASSWORD]@aws-0-us-east-1.pooler.supabase.com:5432/postgres
     ```
   - **Must have**:
     - Port `5432` ✓
     - NO query parameters ✓
     - Same password as DATABASE_URL ✓
   - Environment: **All Environments**
   - Click **Save**

---

### Step 3: Redeploy with Fresh Build

1. Go to: https://vercel.com/authoy-das-projects/flowstatemax

2. Click **"Deployments"** tab

3. Find the latest deployment

4. Click **"..."** → **"Redeploy"**

5. **⚠️ CRITICAL**: **UNCHECK** "Use existing build cache"

6. Click **"Redeploy"**

7. **Wait for deployment to complete** (watch build logs)

---

## ✅ Verify the Fix

After redeployment:

1. Open: https://flowstatemax.vercel.app/onboarding

2. Complete the onboarding flow:
   - Enter goals
   - Add ritual items
   - Add a location
   - Select apps to block

3. Check database to verify data saved:
   ```sql
   SELECT COUNT(*) FROM "RitualItem";  -- Should be > 0
   SELECT COUNT(*) FROM "FlowLocation";  -- Should be > 0
   SELECT COUNT(*) FROM "BlockedApp";  -- Should be > 0
   ```

---

## 🐛 If Still Not Working

### Check Vercel Function Logs:

1. Go to latest deployment: https://vercel.com/authoy-das-projects/flowstatemax

2. Click **"Runtime Logs"** or **"Functions"** tab

3. Look for errors from:
   - `/api/onboarding/ritual`
   - `/api/onboarding/locations`
   - `/api/onboarding/apps`

4. Common errors:
   - `Tenant or user not found` → Password is incorrect
   - `Connection refused` → DATABASE_URL format is wrong
   - `Unauthorized` → Session/auth issue (different problem)

### Test API Endpoints Directly:

You can test if the database connection works by checking:
```bash
# This should return database version info if connected
curl https://flowstatemax.vercel.app/api/test-db
```

---

## 📋 Quick Checklist

- [ ] Got actual password from Supabase dashboard
- [ ] DATABASE_URL uses port 6543 with `?pgbouncer=true&connection_limit=1`
- [ ] DIRECT_URL uses port 5432 with NO query parameters
- [ ] Both URLs use the SAME password
- [ ] Updated BOTH variables in Vercel
- [ ] Set environment to "All Environments"
- [ ] Redeployed WITHOUT build cache
- [ ] Waited for deployment to complete
- [ ] Tested onboarding and verified data in database

---

## Common Mistakes to Avoid

❌ Using port 5432 for DATABASE_URL (should be 6543)
❌ Using port 6543 for DIRECT_URL (should be 5432)
❌ Forgetting `?pgbouncer=true&connection_limit=1` on DATABASE_URL
❌ Adding query parameters to DIRECT_URL
❌ Using different passwords
❌ Not redeploying after changes
❌ Keeping build cache when redeploying

---

## Expected Behavior After Fix

✅ Users complete onboarding → Data saves to database
✅ Ritual items visible on dashboard
✅ Flow locations available for selection
✅ Blocked apps tracked during sessions
✅ Users can start flow sessions successfully

---

## Database Statistics (Current)

- **Users**: 11 ✅
- **RitualItems**: 0 ❌
- **FlowLocations**: 0 ❌
- **BlockedApps**: 0 ❌

**After fix, these should all be > 0**

