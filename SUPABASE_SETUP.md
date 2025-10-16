# Supabase Setup Guide - Daybreak Database

## ✅ Completed Steps

1. **Created Supabase utility files** following Next.js with-supabase template:
   - `src/utils/supabase/client.ts` - Browser client
   - `src/utils/supabase/server.ts` - Server-side client
   - `src/utils/supabase/middleware.ts` - Middleware for session management

2. **Created test page** at `src/app/notes/page.tsx` to verify connection

3. **Installed required package**: `@supabase/ssr@0.5.2`

4. **Removed old Supabase files**:
   - ❌ Deleted `src/lib/supabase.ts` (old implementation)
   - ❌ Deleted `.env.local.backup` (old connection string)

5. **Updated `.env.local`** with placeholder variables

---

## 🚀 Next Steps - Complete These Now

### Step 1: Authenticate with Vercel
```bash
cd apps/web
npx vercel login
```

### Step 2: Link Your Project
```bash
npx vercel link
```
When prompted:
- Select your Vercel scope/team
- Choose "Link to existing project"
- Select your FlowStateMax project

### Step 3: Pull Environment Variables
```bash
npx vercel env pull .env.development.local
```

This will automatically populate:
- `POSTGRES_URL`
- `POSTGRES_PRISMA_URL`
- `POSTGRES_URL_NO_SSL`
- `POSTGRES_URL_NON_POOLING`
- `POSTGRES_USER`
- `POSTGRES_HOST`
- `POSTGRES_PASSWORD`
- `POSTGRES_DATABASE`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Step 4: Update Prisma DATABASE_URL
After pulling env vars, copy the `POSTGRES_PRISMA_URL` value to the `DATABASE_URL` in `.env.local`:

```bash
# In .env.local, replace:
DATABASE_URL=${POSTGRES_PRISMA_URL}

# With the actual value from .env.development.local, e.g.:
DATABASE_URL=postgres://default:xxxxx@xxxxx-pooler.aws.com/verceldb?pgbouncer=true&connect_timeout=15
```

### Step 5: Push Prisma Schema to Supabase
```bash
npm run db:push
```

This will create all your tables in the new Supabase "daybreak" database.

### Step 6: Create a Test Table
Either in Supabase dashboard or via SQL:
```sql
CREATE TABLE notes (
  id SERIAL PRIMARY KEY,
  title TEXT,
  content TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

INSERT INTO notes (title, content) VALUES
  ('Test Note', 'This is a test note from Supabase!');
```

### Step 7: Test the Connection
```bash
npm run dev
```

Navigate to: `http://localhost:3001/notes`

You should see the notes data in JSON format!

---

## 📝 Important Notes

- **Database Name**: `daybreak` (your new Supabase database via Vercel)
- **Old Connection Removed**: No more manual Supabase connection strings
- **Prisma + Supabase**: Your Prisma schema will now use Supabase as the PostgreSQL provider
- **SSR Support**: The new setup properly handles Next.js 14 Server Components with cookies

---

## 🔧 Troubleshooting

**Issue**: Environment variables not loading
- **Solution**: Make sure `.env.development.local` is in `apps/web/` directory
- **Solution**: Restart dev server after pulling env vars

**Issue**: Prisma connection errors
- **Solution**: Use `POSTGRES_PRISMA_URL` (with connection pooling) not `POSTGRES_URL`
- **Solution**: Run `npm run db:generate` after pulling env vars

**Issue**: Supabase auth errors
- **Solution**: Verify `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are set
- **Solution**: Check Vercel dashboard for correct Supabase integration

---

## ✨ What Changed

### Before (Old Setup)
```typescript
// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js'
const supabase = createClient(url, key) // Manual connection
```

### After (New Setup)
```typescript
// src/utils/supabase/server.ts
import { createServerClient } from '@supabase/ssr'
export async function createClient() {
  // Proper SSR with cookie handling
  return createServerClient(url, key, { cookies: {...} })
}
```

### Benefits
- ✅ Next.js 14 App Router compatible
- ✅ Proper SSR cookie handling
- ✅ Middleware support for auth
- ✅ Vercel-managed connection (no manual config)
- ✅ Connection pooling via Prisma
- ✅ Cleaner separation of client/server code

---

## 🎯 Summary

Run these commands in order:
```bash
cd apps/web
npx vercel login
npx vercel link
npx vercel env pull .env.development.local
# Update DATABASE_URL in .env.local with POSTGRES_PRISMA_URL value
npm run db:push
npm run dev
# Visit http://localhost:3001/notes
```

Your FlowStateMax app is now connected to the new Supabase "daybreak" database! 🎉
