# 🚨 URGENT: Database Connection Missing

## Root Cause
**DATABASE_URL** is not configured in `.env.local`, causing all database operations to fail with 500 errors.

## Current Status
✅ Prisma 5.22.0 installed  
✅ Schema defined (13 models)  
❌ **DATABASE_URL missing** - Cannot connect to Supabase  
❌ API endpoints failing  
❌ Onboarding completion blocked  

## Immediate Fix Required

### Step 1: Get Your Supabase Connection String

1. Go to https://supabase.com/dashboard
2. Select your **FlowStateMax** project
3. Click **Settings** → **Database**
4. Under **Connection String**, select **URI**
5. Copy the connection string (looks like this):
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres
   ```
6. **Important**: Replace `[YOUR-PASSWORD]` with your actual database password

### Step 2: Add to .env.local

Run this command (replace with YOUR actual connection string):

```bash
cd /Users/authoydas/Desktop/FlowStateMax/apps/web
echo 'DATABASE_URL="your-actual-connection-string-here"' >> .env.local
```

### Step 3: Add Connection Pooling (Recommended for Vercel)

For production (Vercel), use the **pooled connection**:

1. In Supabase: Settings → Database → **Connection Pooling**
2. Mode: **Transaction** (for Prisma)
3. Copy the pooled connection string
4. Add to Vercel environment variables

### Step 4: Generate Prisma Client

```bash
cd /Users/authoydas/Desktop/FlowStateMax/apps/web
npx prisma generate
```

### Step 5: Test Connection

```bash
npx prisma db pull
```

If successful, you'll see: "Prisma schema loaded from prisma/schema.prisma"

## Complete .env.local File Should Look Like:

```bash
# ============================================================================
# FlowState Development Environment
# ============================================================================

# 🔴 CRITICAL: Database Connection
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@db.xxxxx.supabase.co:5432/postgres"

# Feature Flags
NEXT_PUBLIC_ENABLE_OAUTH=false
NEXT_PUBLIC_ALLOW_GUEST_ONBOARDING=true
NEXT_PUBLIC_DEV_MODE=true

# NextAuth Configuration
NEXTAUTH_SECRET=dev-secret-key-for-local-development-only
NEXTAUTH_URL=http://localhost:3000

# Development Guest User
DEV_GUEST_USER_ID=dev-user-001
```

## Vercel Production Environment Variables

You MUST also add these to Vercel:

1. Go to https://vercel.com → Your Project → Settings → Environment Variables
2. Add these variables:

### Required:
- **DATABASE_URL** = (Pooled connection from Supabase)
- **NEXTAUTH_SECRET** = (Generate with: `openssl rand -base64 32`)
- **NEXTAUTH_URL** = https://your-domain.vercel.app
- **NEXT_PUBLIC_ALLOW_GUEST_ONBOARDING** = true
- **NEXT_PUBLIC_ENABLE_OAUTH** = false
- **NEXT_PUBLIC_DEV_MODE** = false (for production)

### After Adding Variables:
1. Trigger a new deployment (or push to git)
2. Vercel will rebuild with the new environment variables

## Why This Happened

Your `.env.local` was configured for **guest mode** but missing the database connection. 

**Guest mode** allows users to sign in without OAuth, BUT they still need the database to:
- Store onboarding data
- Save user preferences  
- Track flow sessions
- Persist time blocks

Without DATABASE_URL, all API endpoints fail because Prisma cannot connect.

## Testing After Fix

### Local Development:
```bash
# 1. Add DATABASE_URL to .env.local
# 2. Generate Prisma client
npx prisma generate

# 3. Start dev server
npm run dev

# 4. Try onboarding again
```

### Production (Vercel):
```bash
# 1. Add DATABASE_URL to Vercel environment variables
# 2. Redeploy
git push origin main

# 3. Wait 2 minutes for deployment
# 4. Try onboarding on production
```

## Security Notes

⚠️ **NEVER commit .env.local to git**  
✅ Already in .gitignore  
✅ Use different credentials for dev/prod  
✅ Rotate passwords regularly  

## Need Help?

If you don't have a Supabase project yet:
1. Go to https://supabase.com
2. Create new project (free tier)
3. Wait 2-3 minutes for database provisioning
4. Get connection string from Settings → Database
5. Follow steps above

