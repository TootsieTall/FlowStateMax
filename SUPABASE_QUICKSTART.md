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

