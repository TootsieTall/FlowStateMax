# 🚀 Supabase Setup for FlowStateMax

## Why Supabase?

Supabase is a complete Backend-as-a-Service (BaaS) that includes:
- PostgreSQL database
- Built-in authentication (Google, GitHub, Email, etc.)
- Real-time subscriptions
- File storage
- Auto-generated REST APIs
- Row-level security

Perfect for FlowStateMax! 🎉

---

## Step 1: Create a Supabase Account

1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project"
3. Sign up with GitHub (easiest for Vercel integration)

---

## Step 2: Create a New Project

1. Click "New Project"
2. Name: `FlowStateMax`
3. Database Password: (generate a strong one)
4. Region: Choose closest to you
5. Pricing Plan: Free tier is perfect
6. Click "Create new project" (takes ~2 minutes)

---

## Step 3: Get Your Connection Strings

After project creation, go to **Project Settings → Database**

You'll need:

### Connection Pooling (for Vercel/Serverless)
```
postgres://postgres.[project-ref]:[password]@aws-0-us-east-1.pooler.supabase.com:6543/postgres
```

### Direct Connection (for local development)
```
postgresql://postgres:[password]@db.[project-ref].supabase.co:5432/postgres
```

---

## Step 4: Update Environment Variables

### For Local Development:

Edit `apps/web/.env.local`:

```env
# Supabase Database
DATABASE_URL="postgresql://postgres:[password]@db.[project-ref].supabase.co:5432/postgres"

# Supabase Auth (get these from Project Settings → API)
NEXT_PUBLIC_SUPABASE_URL="https://[project-ref].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"

# NextAuth (you can keep using NextAuth or switch to Supabase Auth)
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="gEYpC/uNJkBuINquy4OrhXtStmsJAfe9BIFpdvfy0Ek="
```

### For Vercel Production:

Use the **Connection Pooling** URL for DATABASE_URL

---

## Step 5: Install Supabase Client (Optional but Recommended)

```bash
cd /Users/authoydas/Desktop/FlowStateMax

# Install Supabase client
npm install @supabase/supabase-js --workspace=@flowstate/web
```

---

## Step 6: Initialize Database Schema

```bash
cd /Users/authoydas/Desktop/FlowStateMax

# Generate Prisma client
npm run db:generate --workspace=@flowstate/web

# Push schema to Supabase
npm run db:push --workspace=@flowstate/web
```

---

## Step 7: Set Up Authentication (Optional - Replace NextAuth)

### Option A: Keep Using NextAuth (Simpler for now)
- Just use Supabase for the database
- Continue using NextAuth for auth

### Option B: Switch to Supabase Auth (More features)

Create `apps/web/src/lib/supabase.ts`:

```typescript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

Then you can use Supabase Auth:

```typescript
// Sign in with Google
const { data, error } = await supabase.auth.signInWithOAuth({
  provider: 'google',
})

// Sign out
await supabase.auth.signOut()

// Get current user
const { data: { user } } = await supabase.auth.getUser()
```

---

## Step 8: Enable Real-time (Optional)

Real-time updates for flow sessions:

```typescript
// Subscribe to time blocks changes
const channel = supabase
  .channel('time-blocks')
  .on('postgres_changes', 
    { 
      event: '*', 
      schema: 'public', 
      table: 'TimeBlock',
      filter: `userId=eq.${userId}` 
    }, 
    (payload) => {
      console.log('TimeBlock changed!', payload)
      // Update your UI
    }
  )
  .subscribe()
```

---

## Step 9: Enable Row-Level Security (RLS)

In Supabase Dashboard → Authentication → Policies:

```sql
-- Users can only see their own data
CREATE POLICY "Users can view own data" ON "User"
  FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can view own time blocks" ON "TimeBlock"
  FOR SELECT
  USING (auth.uid() = "userId");

-- Add similar policies for other tables
```

---

## Comparison: Supabase vs Neon + NextAuth

### Current Setup (Neon + NextAuth):
```
┌─────────────┐     ┌──────────────┐
│   NextAuth  │────▶│  Next.js App │
│   (Auth)    │     └──────────────┘
└─────────────┘            │
                           ▼
                    ┌─────────────┐
                    │    Neon     │
                    │ (Database)  │
                    └─────────────┘
```

### Supabase Setup (All-in-One):
```
┌─────────────────────────────┐
│         Supabase            │
│  ┌─────────┐  ┌──────────┐ │     ┌──────────────┐
│  │  Auth   │  │ Database │ │────▶│  Next.js App │
│  └─────────┘  └──────────┘ │     └──────────────┘
│  ┌─────────┐  ┌──────────┐ │
│  │ Storage │  │ Realtime │ │
│  └─────────┘  └──────────┘ │
└─────────────────────────────┘
```

---

## Free Tier Comparison

### Supabase Free:
- 500 MB database storage
- 1 GB file storage
- 2 GB bandwidth/month
- 50,000 monthly active users
- Social OAuth providers
- 2 million Realtime messages/month

### Neon Free:
- 500 MB database storage (0.5 GB)
- Unlimited databases
- Auto-suspend after 5 min
- No auth, storage, or realtime

---

## My Recommendation

**Start with Supabase** because:

1. ✅ **You get more for free**: Auth + Database + Storage
2. ✅ **Less code to write**: Auth is built-in
3. ✅ **Real-time updates**: Perfect for flow session tracking
4. ✅ **Future-proof**: When you need file uploads, it's already there
5. ✅ **Great dashboard**: Easy to view and manage data

**Later, you can:**
- Add Google OAuth in 5 minutes
- Enable real-time for live updates
- Add file storage for user avatars
- Use built-in APIs

---

## Quick Start Script

```bash
#!/bin/bash

# After creating your Supabase project:

# 1. Install Supabase
npm install @supabase/supabase-js --workspace=@flowstate/web

# 2. Update .env.local with your Supabase credentials
# (Get from Supabase Dashboard → Project Settings)

# 3. Push schema
npm run db:push --workspace=@flowstate/web

# 4. Restart dev server
npm run dev
```

---

## Need Help?

- [Supabase Docs](https://supabase.com/docs)
- [Supabase + Next.js Guide](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs)
- [Supabase Auth Helpers for Next.js](https://supabase.com/docs/guides/auth/auth-helpers/nextjs)

---

## Vercel Deployment with Supabase

1. Push to GitHub
2. Import to Vercel
3. Add environment variables in Vercel:
   ```
   DATABASE_URL = [Connection Pooling URL from Supabase]
   NEXT_PUBLIC_SUPABASE_URL = [Your Supabase URL]
   NEXT_PUBLIC_SUPABASE_ANON_KEY = [Your anon key]
   NEXTAUTH_URL = https://your-app.vercel.app
   NEXTAUTH_SECRET = [Your secret]
   ```
4. Deploy!

Supabase works perfectly with Vercel's serverless functions. 🚀

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

# ✅ Supabase Setup Complete!

## 🎉 Success Summary

Your FlowStateMax app is now fully connected to Supabase and running!

### What We Set Up:

1. ✅ **Supabase Account & Project**
   - Project: "TootsieTall's Project"
   - Region: US East (North Virginia)
   - Project ID: `iqdomkoxncawrzwrrydr`

2. ✅ **Database Created**
   - 11 tables created successfully
   - All relationships and constraints set up
   - Ready for production use

3. ✅ **Environment Variables Configured**
   - Database connection string
   - Supabase API credentials
   - NextAuth configuration

4. ✅ **App Running**
   - Dev server: http://localhost:3000
   - Redirecting to onboarding flow
   - Database queries working

---

## 📊 Your Database Tables

Successfully created:
- ✅ User
- ✅ Account  
- ✅ Session
- ✅ FlowLocation
- ✅ BlockedApp
- ✅ RitualItem
- ✅ TimeBlock
- ✅ Task
- ✅ FlowSession
- ✅ ShutdownLog
- ✅ DailyGoal

---

## 🔑 Your Credentials

### Database
- **URL**: `https://iqdomkoxncawrzwrrydr.supabase.co`
- **Project ID**: `iqdomkoxncawrzwrrydr`
- **Region**: `us-east-1`

### Environment Variables
Location: `apps/web/.env.local`

```env
DATABASE_URL="postgresql://postgres:Ad215143421$@db.iqdomkoxncawrzwrrydr.supabase.co:5432/postgres"
NEXT_PUBLIC_SUPABASE_URL="https://iqdomkoxncawrzwrrydr.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

## 🚀 What's Next?

### 1. Test Your App
Visit: **http://localhost:3000**

You should see:
- Welcome/onboarding page
- Ability to enter your name
- Complete the 8-step onboarding flow

### 2. View Your Data in Supabase
- Go to Supabase Dashboard → **Table Editor**
- You'll see all your tables
- Data will appear here as you use the app

### 3. Optional Enhancements

#### Enable Google OAuth (Later)
1. Supabase Dashboard → Authentication → Providers
2. Enable Google
3. Add your Google OAuth credentials
4. Update your auth code to use Supabase Auth

#### Enable Real-time (Later)
```typescript
import { supabase } from '@/lib/supabase'

// Subscribe to changes
const channel = supabase
  .channel('timeblocks')
  .on('postgres_changes', {
    event: '*',
    schema: 'public',
    table: 'TimeBlock'
  }, (payload) => {
    console.log('Change!', payload)
  })
  .subscribe()
```

---

## 🌐 Deploying to Vercel

When ready to deploy:

### 1. Push to GitHub
```bash
git add .
git commit -m "Add Supabase integration"
git push origin main
```

### 2. Deploy to Vercel
1. Import your GitHub repo to Vercel
2. Add environment variables:
   - `DATABASE_URL` = Your Supabase connection string
   - `NEXT_PUBLIC_SUPABASE_URL` = Your Supabase URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = Your anon key
   - `NEXTAUTH_URL` = `https://your-app.vercel.app`
   - `NEXTAUTH_SECRET` = Your secret key

3. Deploy! 🚀

---

## 📝 Important Notes

### Database Connection
- Direct connection (port 5432) may not work from local machine on free tier
- We used Supabase SQL Editor to create tables initially
- Your app uses the connection string for runtime queries
- This is normal for Supabase free tier!

### Supabase Dashboard
Access your project: https://supabase.com/dashboard/project/iqdomkoxncawrzwrrydr

Useful sections:
- **Table Editor** - View/edit data
- **SQL Editor** - Run SQL queries
- **Authentication** - Manage users
- **Storage** - File uploads (future)
- **Logs** - Debug issues

---

## 🎯 Testing Checklist

- [ ] Visit http://localhost:3000
- [ ] Complete onboarding flow
- [ ] Check Supabase Table Editor to see data
- [ ] Test creating time blocks
- [ ] Test flow sessions
- [ ] Verify data persists on refresh

---

## 🆘 Troubleshooting

### If app won't start:
```bash
# Kill existing processes
pkill -f "next dev"

# Restart
cd /Users/authoydas/Desktop/FlowStateMax
npm run dev
```

### If database errors:
- Check Supabase project is active (not paused)
- Verify .env.local has correct credentials
- Check Supabase Dashboard → Logs for errors

### If tables are missing:
- Go to Supabase SQL Editor
- The SQL script is in `/tmp/supabase_schema.sql`
- Re-run if needed

---

## 📚 Resources

- [Supabase Docs](https://supabase.com/docs)
- [Prisma Docs](https://www.prisma.io/docs)
- [Next.js 14 Docs](https://nextjs.org/docs)
- [Your Supabase Dashboard](https://supabase.com/dashboard/project/iqdomkoxncawrzwrrydr)

---

## 🎉 Congratulations!

Your FlowStateMax app is now:
- ✅ Connected to Supabase PostgreSQL
- ✅ Running locally
- ✅ Ready for development
- ✅ Deployable to Vercel

**Start building your deep work empire!** 🚀

Visit: **http://localhost:3000**

# 🔧 Manual Supabase Setup (Simplified)

## The Easiest Way - Build Your Connection String

You can manually construct your DATABASE_URL using these pieces:

### What You Need:

1. **Project Reference ID** - Found in your project URL
   - Look at your browser URL: `https://supabase.com/dashboard/project/XXXXX`
   - The `XXXXX` part is your project reference ID

2. **Your Database Password** - The one you created when setting up the project
   - If you forgot it, click "Reset database password" on the Database Settings page

3. **Your Region** - You selected this when creating the project
   - Common ones: `us-east-1`, `us-west-1`, `eu-west-1`

### Build Your Connection String:

Replace the values in ALL CAPS below:

```
postgresql://postgres.YOUR_PROJECT_REF:YOUR_PASSWORD@aws-0-YOUR_REGION.pooler.supabase.com:6543/postgres
```

**Example:**
```
postgresql://postgres.abcdefghijklmnop:MySecurePassword123@aws-0-us-east-1.pooler.supabase.com:6543/postgres
```

---

## Step-by-Step:

### 1. Get Your Project Reference ID

Look at your browser URL bar right now. It should look like:
```
https://supabase.com/dashboard/project/abcdefghijklmnop/database/...
```

Copy the part after `/project/` (before the next `/`)

### 2. Get Your Project URL and API Key

These are easier to find:

1. Click the **Home** icon in the left sidebar
2. You should see **"Project URL"** and **"API Keys"**
3. Copy these:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public key**: Long string starting with `eyJ...`

OR:

1. Click **Project Settings** (gear icon ⚙️)
2. Click **API** in the left menu
3. Copy:
   - **Project URL**
   - **anon public** key

---

## Quick Configuration Without the Script

Just manually edit this file:

**`apps/web/.env.local`**

```env
# Supabase Database - Manual construction
# Format: postgresql://postgres.PROJECT_REF:PASSWORD@aws-0-REGION.pooler.supabase.com:6543/postgres
DATABASE_URL="postgresql://postgres.YOUR_PROJECT_REF:YOUR_PASSWORD@aws-0-us-east-1.pooler.supabase.com:6543/postgres"

# Supabase API (get from Project Settings → API)
NEXT_PUBLIC_SUPABASE_URL="https://YOUR_PROJECT_REF.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key-here"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="gEYpC/uNJkBuINquy4OrhXtStmsJAfe9BIFpdvfy0Ek="
```

---

## Let's Do This Together

Tell me:

1. What's your **project reference ID**? (from browser URL)
2. What **region** did you select? (us-east-1, eu-west-1, etc.)
3. Do you remember your **database password**? (If not, we'll reset it)

I'll build the connection string for you!

---

## Alternative: Find It in Supabase

Try this path:

1. **Home** (house icon) in left sidebar
2. Look for **"Connect"** or **"Connection Info"** button/section
3. Select **"Connection Pooling"** or **"Transaction"** mode
4. Copy the URI

OR

1. Click on your project name at the top
2. Look for **"Project API"** or **"Project Settings"** 
3. Database tab should have connection info

# 🚀 Supabase Quick Start Guide

## ✅ What We've Done So Far

1. ✅ Installed Supabase client (`@supabase/supabase-js`)
2. ✅ Created configuration script
3. ✅ Created Supabase client utility (`apps/web/src/lib/supabase.ts`)
4. ✅ Opened Supabase dashboard in your browser

## 📋 Next Steps (Follow in Order)

### Step 1: Complete Supabase Project Setup
**In your browser at https://supabase.com/dashboard**

1. ✅ Sign up with GitHub
2. ✅ Create new project "FlowStateMax"
3. ✅ Generate a strong database password (save it!)
4. ✅ Choose your region
5. ✅ Wait ~2 minutes for creation

### Step 2: Get Your Credentials
**After project is created:**

1. Go to **Project Settings** → **Database**
   - Copy the **Connection string** (URI format)
   - Replace `[YOUR-PASSWORD]` with your database password

2. Go to **Project Settings** → **API**
   - Copy **Project URL**
   - Copy **anon public** key

📖 Detailed instructions in: `GET_SUPABASE_CREDENTIALS.md`

### Step 3: Configure Your App

Run the interactive configuration script:

```bash
cd /Users/authoydas/Desktop/FlowStateMax
./configure-supabase.sh
```

**Or manually edit** `apps/web/.env.local`:

```env
# Supabase Database
DATABASE_URL="postgresql://postgres.xxxxx:[password]@aws-0-us-east-1.pooler.supabase.com:6543/postgres"

# Supabase API
NEXT_PUBLIC_SUPABASE_URL="https://xxxxx.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="gEYpC/uNJkBuINquy4OrhXtStmsJAfe9BIFpdvfy0Ek="
```

### Step 4: Initialize Database

```bash
# Generate Prisma client
npm run db:generate --workspace=@flowstate/web

# Push your schema to Supabase
npm run db:push --workspace=@flowstate/web
```

### Step 5: Verify Setup

```bash
# Restart dev server
npm run dev
```

Then visit: http://localhost:3000

---

## 🎯 What You Get with Supabase

### 1. Database ✅
- Your existing Prisma schema works as-is
- 500MB free storage
- Auto-scaling

### 2. Authentication (Optional - Can Add Later)
```typescript
import { supabase } from '@/lib/supabase'

// Sign in with Google (after enabling in Supabase dashboard)
const { data, error } = await supabase.auth.signInWithOAuth({
  provider: 'google',
  options: {
    redirectTo: 'http://localhost:3000/auth/callback'
  }
})
```

### 3. Real-time Updates (Optional)
```typescript
// Subscribe to time block changes
const channel = supabase
  .channel('timeblocks')
  .on('postgres_changes', {
    event: '*',
    schema: 'public',
    table: 'TimeBlock',
    filter: `userId=eq.${userId}`
  }, (payload) => {
    console.log('TimeBlock updated!', payload)
  })
  .subscribe()
```

### 4. File Storage (Optional)
```typescript
// Upload user avatar
const { data, error } = await supabase.storage
  .from('avatars')
  .upload(`${userId}/avatar.png`, file)
```

---

## 🔧 Troubleshooting

### Error: "Missing Supabase environment variables"
- Make sure you ran `./configure-supabase.sh`
- Check `apps/web/.env.local` exists and has all variables
- Restart your dev server

### Error: "Can't reach database server"
- Verify your DATABASE_URL has the correct password
- Check Supabase project is running (not paused)
- Try the connection string from Supabase dashboard again

### Error: "Invalid API key"
- Make sure NEXT_PUBLIC_SUPABASE_ANON_KEY is copied correctly
- No extra spaces or quotes

---

## 🌐 Deploying to Vercel

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Add Supabase integration"
   git push origin main
   ```

2. **In Vercel Dashboard:**
   - Go to your project → Settings → Environment Variables
   - Add the same variables from your `.env.local`:
     - `DATABASE_URL`
     - `NEXT_PUBLIC_SUPABASE_URL`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
     - `NEXTAUTH_URL` (set to your Vercel URL)
     - `NEXTAUTH_SECRET`

3. **Redeploy:**
   - Your app will automatically use Supabase in production!

---

## 📚 Resources

- [Supabase Docs](https://supabase.com/docs)
- [Supabase + Next.js Guide](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs)
- [Your Supabase Dashboard](https://supabase.com/dashboard)

---

## ⏭️ What's Next?

After your app is working with Supabase:

1. **Enable Google OAuth** (Optional):
   - Supabase Dashboard → Authentication → Providers → Google
   - Add your Google OAuth credentials
   - Update your sign-in code to use Supabase Auth

2. **Add Real-time** (Optional):
   - Subscribe to database changes
   - Live updates across devices

3. **Add File Storage** (Optional):
   - User avatars
   - Document uploads

4. **Enable Row-Level Security**:
   - Supabase Dashboard → Database → Policies
   - Secure your data so users only see their own content

---

## 🎉 Ready to Configure?

Run this command when your Supabase project is ready:

```bash
./configure-supabase.sh
```

Or follow the manual steps above!

