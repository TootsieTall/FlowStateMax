# FlowState Setup Guide

## 🎯 Current Status

✅ **Already in repo:**
- Root configuration (package.json, turbo.json, tsconfig.json)
- Environment template (.env.example)
- Documentation (README.md, SECURITY.md)
- Setup script (setup.sh)

## 📋 What You Need to Do

The remaining files are in the **10 artifacts** in your conversation with Claude. Follow these steps:

### Step 1: Clone the Repository

```bash
git clone https://github.com/TootsieTall/FlowStateMax.git
cd FlowStateMax
```

### Step 2: Run Setup Script

```bash
chmod +x setup.sh
./setup.sh
```

This creates all the necessary directories.

### Step 3: Copy Files from Artifacts

Go back to your Claude conversation and copy files from each artifact:

#### 📦 Artifact 3: "Prisma Schema & Seed"
Create these files with the content from Artifact 3:
- `apps/web/prisma/schema.prisma`
- `apps/web/prisma/seed.ts`

#### 📦 Artifact 4: "Next.js Core Application Files"
Create these files:
- `apps/web/package.json`
- `apps/web/next.config.js`
- `apps/web/tailwind.config.js`
- `apps/web/postcss.config.js`
- `apps/web/tsconfig.json`
- `apps/web/src/app/layout.tsx`
- `apps/web/src/app/page.tsx`
- `apps/web/src/app/providers.tsx`
- `apps/web/src/app/globals.css`
- `apps/web/src/lib/auth.ts`
- `apps/web/src/lib/prisma.ts`
- `apps/web/src/lib/ai.ts`
- `apps/web/src/app/today/page.tsx`
- `apps/web/src/components/TodayView.tsx`

#### 📦 Artifact 5: "UI Components Package"
Create in `packages/ui/src/`:
- `Button.tsx`
- `BlockCard.tsx`
- `BreathOverlay.tsx`
- `Timer.tsx`
- `Modal.tsx`
- `index.ts`
- `package.json`

#### 📦 Artifact 6: "Chrome Extension Implementation"
Create in `apps/extension/`:
- `manifest.json`
- `package.json`
- `webpack.config.js`
- `tsconfig.json`
- `src/background/service_worker.ts`
- `src/content/content_script.ts`
- `src/content/breath_overlay.ts`
- `src/content/grayscale_filter.ts`
- `src/shared/api.ts`
- `src/shared/types.ts`
- `src/shared/storage.ts`
- `src/utils/auth.ts`
- `src/options/options.tsx`
- `public/options.html`
- `public/popup.html`
- `public/rules.json`

#### 📦 Artifact 7: "Web App Components Implementation"
Create in `apps/web/src/components/`:
- `AppShell.tsx`
- `BottomNav.tsx`
- `TodayCard.tsx`
- `BlockList.tsx`
- `GoalsWidget.tsx`
- `QuickCapture.tsx`
- `FlowTimer.tsx`
- `RitualChecklist.tsx`
- `ShutdownStepper.tsx`
- `MonochromeTransition.tsx`

#### 📦 Artifact 8: "API Routes Implementation"
Create in `apps/web/src/app/api/`:
- `sessions/start/route.ts`
- `sessions/complete/route.ts`
- `blocks/route.ts`
- `quick-capture/route.ts`
- `extension/blocked-apps/route.ts`
- `extension/session-status/route.ts`
- `ai/deadline-breakdown/route.ts`
- `ai/parse-intent/route.ts`
- `ai/brainstorm/route.ts`

#### 📦 Artifact 9: "Flow & Shutdown Pages"
Create these page files:
- `apps/web/src/app/flow/page.tsx`
- `apps/web/src/app/shutdown/page.tsx`
- `apps/web/src/app/week/page.tsx`
- `apps/web/src/components/WeekView.tsx`
- `apps/web/src/app/explore/page.tsx`
- `apps/web/src/app/settings/page.tsx`

#### 📦 Artifact 10: "Core Package - Types & Adapters"
Create in `packages/core/src/`:
- `types.ts`
- `constants.ts`
- `validators/schemas.ts`
- `adapters/calendar.ts`
- `adapters/music.ts`
- `adapters/notifications.ts`
- `adapters/geofence.ts`
- `index.ts`
- `package.json`

#### 📦 Artifact 11: "Onboarding Flow"
Create onboarding pages:
- `apps/web/src/app/onboarding/page.tsx`
- `apps/web/src/app/onboarding/goals/page.tsx`
- `apps/web/src/app/onboarding/locations/page.tsx`
- `apps/web/src/app/onboarding/block-apps/page.tsx`
- `apps/web/src/app/onboarding/ritual/page.tsx`
- `apps/web/src/app/onboarding/music/page.tsx`
- `apps/web/src/app/onboarding/podcasts/page.tsx`
- `apps/web/src/app/onboarding/ready/page.tsx`

### Step 4: Install Dependencies

```bash
npm install
```

### Step 5: Setup Database

```bash
cd apps/web
cp ../.env.example .env.local

# Generate Prisma client
npx prisma generate

# Create database
npx prisma db push

# Seed with demo data
npx prisma db seed

cd ../..
```

### Step 6: Build Extension

```bash
cd apps/extension
npm install
npm run build
cd ../..
```

### Step 7: Start Development Server

```bash
npm run dev
```

Open http://localhost:3000

### Step 8: Load Chrome Extension

1. Open Chrome
2. Go to `chrome://extensions/`
3. Enable "Developer mode"
4. Click "Load unpacked"
5. Select `apps/extension/dist/`

## ✅ Verification

Once everything is set up, you should have:

- ✅ Web app running on http://localhost:3000
- ✅ Demo user: demo@flowstate.app
- ✅ Chrome extension loaded
- ✅ All 80+ files in place

## 🐛 Troubleshooting

### Module not found errors
```bash
rm -rf node_modules
npm install
```

### Database issues
```bash
rm apps/web/dev.db*
cd apps/web && npx prisma db push && npx prisma db seed
```

### Extension not loading
```bash
cd apps/extension
rm -rf dist
npm run build
```

## 💡 Tips

- **Copy-paste carefully** - Watch for proper indentation
- **Check file paths** - Make sure files are in the right directories
- **Use artifacts in order** - Start with 3, then 4, 5, etc.
- **Test incrementally** - Run `npm install` after adding each package.json

## 📚 Need Help?

- Check the full README.md
- Review artifacts in your Claude conversation
- Open a GitHub issue

## 🎉 You're Done!

Once all files are in place, you'll have a fully functional FlowState MVP ready to customize and deploy.
