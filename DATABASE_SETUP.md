# Free Database Setup for FlowStateMax

## 🚀 Quick Setup with Neon (Recommended)

Neon is a serverless Postgres database with a **generous free tier** that works perfectly with Vercel.

### Step 1: Create a Neon Account

1. Go to [neon.tech](https://neon.tech)
2. Sign up with GitHub (easiest for Vercel integration)
3. Create a new project called "FlowStateMax"

### Step 2: Get Your Database Connection String

1. After creating the project, you'll see your connection string
2. Copy the **Pooled connection** string (looks like this):
   ```
   postgresql://username:password@ep-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require
   ```

### Step 3: Update Your Environment Variables

1. Open `/Users/authoydas/Desktop/FlowStateMax/apps/web/.env.local`
2. Replace the `DATABASE_URL` with your Neon connection string
3. Your file should look like this:

```env
# Database - Replace with your actual Neon connection string
DATABASE_URL="postgresql://username:password@ep-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require"

# NextAuth - Already configured
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="gEYpC/uNJkBuINquy4OrhXtStmsJAfe9BIFpdvfy0Ek="
```

### Step 4: Initialize the Database

Run these commands from the project root:

```bash
cd /Users/authoydas/Desktop/FlowStateMax

# Generate Prisma client
npm run db:generate --workspace=@flowstate/web

# Push the schema to your database
npm run db:push --workspace=@flowstate/web

# (Optional) Seed with sample data
npm run db:seed --workspace=@flowstate/web
```

### Step 5: Test the Connection

```bash
# Restart the dev server
npm run dev
```

Then visit `http://localhost:3000/today` - it should work now!

---

## 🌐 Deploying to Vercel

### When you're ready to deploy:

1. **Push your code to GitHub** (if not already done)
   ```bash
   git add .
   git commit -m "Add database configuration"
   git push origin main
   ```

2. **Connect Neon to Vercel**:
   - Go to your Vercel project settings
   - Navigate to Environment Variables
   - Add `DATABASE_URL` with your Neon connection string
   - Add `NEXTAUTH_URL` with your Vercel URL (e.g., `https://your-app.vercel.app`)
   - Add `NEXTAUTH_SECRET` with the same secret from .env.local

3. **Auto-deploy**:
   - Vercel will automatically run migrations on deploy
   - Your database will work in production immediately

---

## Alternative: Vercel Postgres

If you prefer Vercel's built-in database:

1. In your Vercel dashboard, go to Storage
2. Create a new Postgres database
3. Connect it to your project
4. Vercel will automatically set the `DATABASE_URL` environment variable

---

## Free Tier Limits

### Neon Free Tier:
- ✅ 0.5 GB storage
- ✅ Unlimited databases
- ✅ Community support
- ✅ Auto-suspend after 5 minutes of inactivity (auto-resume on next query)

### Vercel Postgres Free Tier:
- ✅ 256 MB storage
- ✅ 60 hours of compute per month
- ✅ 256 MB storage

Both are perfect for development and testing! 🎉

---

## Troubleshooting

### Error: "Can't reach database server"
- Make sure you copied the **Pooled connection** string from Neon
- Ensure the connection string includes `?sslmode=require` at the end
- Check that your internet connection is working

### Error: "Prisma schema validation failed"
- Run `npm run db:generate --workspace=@flowstate/web` to regenerate the Prisma client
- Make sure your DATABASE_URL is in the correct format

### Error: "Table does not exist"
- Run `npm run db:push --workspace=@flowstate/web` to create tables
- Or use `npx prisma migrate dev --name init` from the `apps/web` directory

---

## Next Steps

After your database is set up:

1. ✅ Complete the onboarding flow
2. ✅ Test creating time blocks
3. ✅ Test flow sessions
4. ✅ Deploy to Vercel
5. ✅ Configure production environment variables

