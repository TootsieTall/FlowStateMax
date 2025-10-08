# 🔑 How to Get Your Supabase Credentials

After your Supabase project is created, follow these steps:

## Step 1: Get Database Connection String

1. In Supabase Dashboard, go to **Project Settings** (gear icon in sidebar)
2. Click **Database** in the left menu
3. Scroll to **Connection string** section
4. Select **URI** tab
5. Copy the connection string that looks like:
   ```
   postgresql://postgres.xxxxx:[YOUR-PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres
   ```
6. **IMPORTANT**: Replace `[YOUR-PASSWORD]` with the database password you created

## Step 2: Get API Keys

1. Still in **Project Settings**, click **API** in the left menu
2. You'll see two important values:

   **Project URL:**
   ```
   https://xxxxx.supabase.co
   ```
   
   **anon/public key:** (long string starting with "eyJ...")
   ```
   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

## Step 3: Update Your .env.local

Copy these values and paste them in the terminal when prompted, or manually edit:

`/Users/authoydas/Desktop/FlowStateMax/apps/web/.env.local`

---

## 🎯 Quick Reference

Your Supabase Dashboard is at:
**https://supabase.com/dashboard/project/[your-project-id]**

Need help? The values you need are:
1. **DATABASE_URL** → Project Settings → Database → Connection string (URI)
2. **NEXT_PUBLIC_SUPABASE_URL** → Project Settings → API → Project URL
3. **NEXT_PUBLIC_SUPABASE_ANON_KEY** → Project Settings → API → anon public key

