# FlowState - Quick Start Guide

## 🚀 Get Up and Running in 10 Minutes

This guide will help you get the FlowState app running locally.

## Prerequisites

- **Node.js** 18+ and npm
- **PostgreSQL** database (local or cloud)
- **Google OAuth** credentials (for authentication)

## Step 1: Clone and Install

```bash
# Clone the repository
git clone https://github.com/TootsieTall/FlowStateMax.git
cd FlowStateMax

# Install dependencies
npm install
```

## Step 2: Set Up Database

### Option A: Local PostgreSQL

```bash
# Install PostgreSQL (if not already installed)
# macOS:
brew install postgresql
brew services start postgresql

# Create database
createdb flowstate
```

### Option B: Cloud Database (Recommended)

Use a free PostgreSQL database from:
- **Supabase**: https://supabase.com (Free tier: 500MB)
- **Railway**: https://railway.app (Free tier with credit card)
- **Neon**: https://neon.tech (Free tier: 3GB)

## Step 3: Configure Environment Variables

Create `.env.local` in `apps/web/`:

```bash
cd apps/web
cp ../.env.example .env.local
```

Edit `apps/web/.env.local`:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/flowstate"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-random-secret-here"  # Generate: openssl rand -base64 32

# Google OAuth (see Step 4)
GOOGLE_CLIENT_ID="your-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your-client-secret"

# Optional: AI Features
ENABLE_AI_FEATURES=false
AI_PROVIDER=mock
```

## Step 4: Set Up Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (or select existing)
3. Enable **Google+ API**
4. Go to **Credentials** → **Create Credentials** → **OAuth 2.0 Client ID**
5. Configure OAuth consent screen (External, add test users)
6. Create OAuth Client ID:
   - Application type: **Web application**
   - Authorized redirect URIs: `http://localhost:3000/api/auth/callback/google`
7. Copy **Client ID** and **Client Secret** to `.env.local`

## Step 5: Initialize Database

```bash
# From apps/web directory
cd apps/web

# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push

# Seed with demo data
npx prisma db seed
```

## Step 6: Start Development Server

```bash
# From root directory
cd ../..
npm run dev
```

The app will be available at **http://localhost:3000**

## Step 7: Sign In

1. Open http://localhost:3000
2. Click **Get Started**
3. Sign in with Google
4. Complete onboarding (5 steps)
5. You'll land on the **Today View**!

## ✅ Verification Checklist

- [ ] Database connected (check Prisma Studio: `npx prisma studio`)
- [ ] Google OAuth working (can sign in)
- [ ] Today View shows demo time blocks
- [ ] Week View displays calendar
- [ ] No console errors

## 🎯 Explore the App

### Main Features to Test:

1. **Today View** (`/today`)
   - See current time block
   - Click "Start Flow Session"
   - View daily goals

2. **Week View** (`/week`)
   - Drag-drop calendar (coming soon)
   - View all blocks for the week
   - Add new blocks

3. **Settings** (`/settings`)
   - Manage flow locations
   - Edit blocked apps
   - View metrics dashboard

## 🐛 Common Issues

### Database Connection Error
```
Error: P1001: Can't reach database server
```
**Fix**: Check DATABASE_URL in `.env.local` and ensure PostgreSQL is running

### OAuth Error
```
Error: [next-auth][error][OAUTH_CALLBACK_ERROR]
```
**Fix**: 
- Verify redirect URI in Google Console matches exactly
- Check GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET
- Add your email as a test user in OAuth consent screen

### Port Already in Use
```
Error: Port 3000 is already in use
```
**Fix**: 
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use different port
PORT=3001 npm run dev
```

## 🔧 Development Tools

### Prisma Studio (Database GUI)
```bash
cd apps/web
npx prisma studio
```
Open http://localhost:5555 to view/edit database

### View Logs
```bash
# Next.js logs
tail -f .next/trace

# Database queries
# Set in .env.local:
DATABASE_LOG_LEVEL=query
```

## 🌐 Chrome Extension (Optional)

### Build Extension
```bash
cd apps/extension
npm install
npm run build
```

### Load in Chrome
1. Open `chrome://extensions/`
2. Enable **Developer mode**
3. Click **Load unpacked**
4. Select `apps/extension/dist` folder
5. Extension icon appears in toolbar

### Connect Extension to Web App
1. Click extension icon
2. Click **Extension Settings**
3. Click **Sign In**
4. Authenticate with web app
5. Extension syncs blocked apps

## 📚 Next Steps

1. **Customize**: Edit `/apps/web/src/app/today/page.tsx` to modify Today View
2. **Add Features**: Check `FlowState App - Complete Screen Map.svg` for all screens
3. **Deploy**: See `DEPLOYMENT.md` (coming soon)
4. **Mobile**: See project instructions for mobile app strategy

## ❓ Need Help?

- Check existing issues: https://github.com/TootsieTall/FlowStateMax/issues
- Review project instructions in this repo
- Check Prisma docs: https://www.prisma.io/docs
- NextAuth docs: https://next-auth.js.org/

## 🎉 You're Ready!

Your FlowState development environment is set up. Start building your deep work companion!

**Pro tip**: Run `npx prisma studio` in one terminal and `npm run dev` in another for the best development experience.
