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

