# 🔐 Environment Variables Setup Guide

## 🖥️ Local Development Setup

### Create `.env.local` file

Create this file at: `apps/web/.env.local`

```env
# Supabase Database (Direct connection for local development)
DATABASE_URL="postgresql://postgres:Ad215143421!@db.iqdomkoxncawrzwrrydr.supabase.co:5432/postgres?sslmode=require"

# Supabase API
NEXT_PUBLIC_SUPABASE_URL="https://iqdomkoxncawrzwrrydr.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlxZG9ta294bmNhd3J6d3JyeWRyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk5Mjc2NzUsImV4cCI6MjA3NTUwMzY3NX0.EngmT5oKDjMXO9CatzFNWOmvtHPiH5AVLActCf-MQXg"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="gEYpC/uNJkBuINquy4OrhXtStmsJAfe9BIFpdvfy0Ek="
```

### Quick Setup Commands

```bash
cd /Users/authoydas/Desktop/FlowStateMax

# Create the .env.local file (copy from above)
cat > apps/web/.env.local << 'EOF'
DATABASE_URL="postgresql://postgres:Ad215143421!@db.iqdomkoxncawrzwrrydr.supabase.co:5432/postgres?sslmode=require"
NEXT_PUBLIC_SUPABASE_URL="https://iqdomkoxncawrzwrrydr.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlxZG9ta294bmNhd3J6d3JyeWRyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk5Mjc2NzUsImV4cCI6MjA3NTUwMzY3NX0.EngmT5oKDjMXO9CatzFNWOmvtHPiH5AVLActCf-MQXg"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="gEYpC/uNJkBuINquy4OrhXtStmsJAfe9BIFpdvfy0Ek="
EOF

# Test database connection
node test-db-connection.js

# If tables don't exist, create them
npm run db:generate --workspace=@flowstate/web
npm run db:push --workspace=@flowstate/web

# Start dev server
npm run dev
```

---

## ☁️ Vercel Production Setup

### Environment Variables for Vercel

Go to: **Vercel Dashboard → Your Project → Settings → Environment Variables**

Add these variables:

| Variable Name | Value | Notes |
|--------------|-------|-------|
| `DATABASE_URL` | `postgresql://postgres.iqdomkoxncawrzwrrydr:Ad215143421$@aws-0-us-east-1.pooler.supabase.com:5432/postgres?pgbouncer=true&connection_limit=1` | ⚠️ Use **pooler** URL for serverless |
| `NEXT_PUBLIC_SUPABASE_URL` | `https://iqdomkoxncawrzwrrydr.supabase.co` | Public - safe to expose |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlxZG9ta294bmNhd3J6d3JyeWRyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk5Mjc2NzUsImV4cCI6MjA3NTUwMzY3NX0.EngmT5oKDjMXO9CatzFNWOmvtHPiH5AVLActCf-MQXg` | Public - safe to expose |
| `NEXTAUTH_URL` | `https://flowstatemax.vercel.app` | Your production URL |
| `NEXTAUTH_SECRET` | `gEYpC/uNJkBuINquy4OrhXtStmsJAfe9BIFpdvfy0Ek=` | Keep secret! |

### Important Notes:

1. **DATABASE_URL for Vercel uses Connection Pooling:**
   - Local: `db.iqdomkoxncawrzwrrydr.supabase.co:5432` (direct)
   - Vercel: `aws-0-us-east-1.pooler.supabase.com:5432` (pooled)
   
2. **Password encoding:**
   - Your password contains `!` which becomes `$` in pooler URLs
   - Direct: `Ad215143421!`
   - Pooler: `Ad215143421$`

3. **Apply to all environments:**
   - Check: Production, Preview, Development

---

## 🧪 Testing the Connection

### Test Local Connection

```bash
# Run the test script
node test-db-connection.js
```

Expected output:
```
🔍 Testing database connection...

✅ DATABASE_URL is set
   Connection: postgresql://postgres:****@db.iqdomkoxncawrzwrrydr.supabase.co:5432/postgres?sslmode=require

🔌 Attempting to connect to database...
✅ Connected successfully!

🔍 Testing query...
✅ Query successful!
   Result: [{"test":1}]

📋 Checking database tables...
✅ Found 9 tables:
   - BlockedApp
   - DailyGoal
   - FlowLocation
   - FlowSession
   - RitualItem
   - ShutdownLog
   - Task
   - TimeBlock
   - User

👤 Checking User table...
✅ User table exists with 0 user(s)

🎉 Database connection test completed successfully!
```

### Test Vercel Connection

After deploying to Vercel, check the logs:
1. Go to Vercel Dashboard → Deployments
2. Click on latest deployment
3. Go to "Functions" tab
4. Look for any database connection errors

---

## 🔧 Troubleshooting

### Error: `DATABASE_URL environment variable is not set`

**Solution:** Create the `.env.local` file as shown above

### Error: `Can't reach database server`

**Possible causes:**
1. ❌ Supabase project is paused (free tier pauses after inactivity)
   - **Fix:** Open Supabase dashboard to wake it up
   
2. ❌ Wrong password
   - **Fix:** Verify password in Supabase dashboard
   
3. ❌ Firewall blocking connection
   - **Fix:** Check your network settings

### Error: `relation "User" does not exist`

**Solution:** Push your Prisma schema to the database:

```bash
npm run db:push --workspace=@flowstate/web
```

### Vercel deployment works but database errors occur

**Check:**
1. ✅ Environment variables are set in Vercel
2. ✅ Using **pooler** URL for `DATABASE_URL` (not direct connection)
3. ✅ Password uses `$` instead of `!` in pooler URL
4. ✅ Applied to all environments (Production, Preview, Development)

---

## 📋 Quick Checklist

### Local Development
- [ ] Created `apps/web/.env.local`
- [ ] Added `DATABASE_URL` (direct connection)
- [ ] Added `NEXT_PUBLIC_SUPABASE_URL`
- [ ] Added `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] Added `NEXTAUTH_URL` and `NEXTAUTH_SECRET`
- [ ] Ran `node test-db-connection.js` successfully
- [ ] Ran `npm run db:push` to create tables
- [ ] Started dev server with `npm run dev`

### Vercel Production
- [ ] Set `DATABASE_URL` (pooler connection)
- [ ] Set `NEXT_PUBLIC_SUPABASE_URL`
- [ ] Set `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] Set `NEXTAUTH_URL` (production URL)
- [ ] Set `NEXTAUTH_SECRET`
- [ ] Applied to all environments
- [ ] Redeployed after adding variables
- [ ] Checked deployment logs for errors

---

## 🎯 Next Steps

Once database is connected:

1. **Test locally:**
   ```bash
   npm run dev
   # Visit http://localhost:3000
   ```

2. **Verify in Vercel:**
   - Complete onboarding flow
   - Click "Start Your First Flow Session"
   - Should see the `/today` dashboard
   - No errors in Vercel logs

3. **Check Supabase Dashboard:**
   - Go to Table Editor
   - You should see a new user in the `User` table

---

## 🆘 Need Help?

If you're still having issues:

1. Run: `node test-db-connection.js` and share the output
2. Check Vercel logs for specific error messages
3. Verify Supabase project is active (not paused)
4. Make sure all environment variables are set correctly


