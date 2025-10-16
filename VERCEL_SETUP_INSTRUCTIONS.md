# 🚀 Vercel + Supabase Connection Setup

## ✅ What's Already Done

1. ✅ Created Supabase utility files (`src/utils/supabase/`)
2. ✅ Created test page at `src/app/notes/page.tsx` with your exact code
3. ✅ Installed `@supabase/ssr` package
4. ✅ Removed old Supabase files (`src/lib/supabase.ts`, `.env.local.backup`)
5. ✅ Created automated setup script

---

## 🎯 Run This Command to Complete Setup

From the **`apps/web`** directory:

```bash
cd /Users/authoydas/Desktop/FlowStateMax/apps/web
./setup-vercel-supabase.sh
```

This script will:
1. ✅ Run `vercel login` (opens browser)
2. ✅ Run `vercel link` (links to your project)
3. ✅ Run `vercel env pull .env.development.local` (gets all Supabase vars)
4. ✅ Update `DATABASE_URL` in `.env.local` automatically
5. ✅ Install dependencies
6. ✅ Run `npm run db:push` to create tables in Supabase

---

## 📝 Manual Step-by-Step (if script fails)

If you prefer to run commands manually:

```bash
cd apps/web

# 1. Login
npx vercel login

# 2. Link project
npx vercel link

# 3. Pull env vars
npx vercel env pull .env.development.local

# 4. Install deps
npm install

# 5. Push Prisma schema
npm run db:push
```

Then manually copy `POSTGRES_PRISMA_URL` from `.env.development.local` to `DATABASE_URL` in `.env.local`.

---

## 🗄️ Create Notes Table in Supabase

After setup, run this SQL in your Supabase SQL Editor:

```sql
CREATE TABLE notes (
  id SERIAL PRIMARY KEY,
  title TEXT,
  content TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

INSERT INTO notes (title, content) VALUES
  ('Welcome', 'This is from your daybreak database!'),
  ('Test Note', 'Connection successful! 🎉');
```

---

## 🧪 Test the Connection

```bash
npm run dev
```

Visit: **http://localhost:3001/notes**

You should see JSON with your notes data! ✨

---

## 📂 Files Created

- `src/utils/supabase/client.ts` - Browser client
- `src/utils/supabase/server.ts` - Server client (used by notes page)
- `src/utils/supabase/middleware.ts` - Session management
- `src/app/notes/page.tsx` - Test page with your exact code
- `setup-vercel-supabase.sh` - Automated setup script

## 🗑️ Files Removed

- ❌ `src/lib/supabase.ts` (old implementation)
- ❌ `.env.local.backup` (old connection string)

---

## 🎉 Your Database: daybreak

All connections now point to your new Supabase database created through Vercel!

The `POSTGRES_PRISMA_URL` uses connection pooling which is perfect for serverless functions.
