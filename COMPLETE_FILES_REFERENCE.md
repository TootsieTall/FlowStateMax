# Complete File Contents Reference

This document contains ALL remaining source files for FlowState. Copy and paste these into your project.

## 📋 Current Status

✅ **Already pushed to repo:**
- Root config (package.json, turbo.json, tsconfig.json, .gitignore, .env.example)
- Documentation (README.md, SECURITY.md, SETUP_GUIDE.md)
- Prisma (schema.prisma, seed.ts)
- Web config (package.json, next.config.js, tailwind.config.js)
- Auth (lib/auth.ts)

## 📝 Files to Create

### Web App Core (apps/web/src/)

Refer to **Artifacts 4-9** in your conversation for these files:

#### app/layout.tsx
```typescript
// See Artifact 4: "Next.js Core Application Files"
// Copy the layout.tsx content
```

#### app/page.tsx
```typescript
// See Artifact 4
// Redirects to /today
```

#### app/globals.css
```css
// See Artifact 4
// Tailwind directives + custom styles
```

#### lib/ai.ts
```typescript
// See Artifact 4
// AI provider abstraction with mock responses
```

### Components (apps/web/src/components/)

Refer to **Artifact 7** for all component files:

- AppShell.tsx
- BottomNav.tsx  
- TodayCard.tsx
- BlockList.tsx
- GoalsWidget.tsx
- QuickCapture.tsx
- FlowTimer.tsx
- RitualChecklist.tsx
- ShutdownStepper.tsx
- MonochromeTransition.tsx
- TodayView.tsx
- WeekView.tsx

### Pages (apps/web/src/app/)

#### today/page.tsx
```typescript
// See Artifact 4: Full Today View implementation
```

#### flow/page.tsx  
```typescript
// See Artifact 9: Flow session page
```

#### shutdown/page.tsx
```typescript
// See Artifact 9: Shutdown ritual page
```

#### week/page.tsx
```typescript
// See Artifact 9: Week calendar view
```

#### explore/page.tsx
```typescript
// See Artifact 9: Explore tab with optional features
```

#### settings/page.tsx
```typescript
// See Artifact 9: Settings and configuration
```

### Onboarding (apps/web/src/app/onboarding/)

Refer to **Artifact 11** for all 8 onboarding pages:

- page.tsx (welcome)
- goals/page.tsx
- locations/page.tsx
- block-apps/page.tsx
- ritual/page.tsx
- music/page.tsx
- podcasts/page.tsx
- ready/page.tsx

### API Routes (apps/web/src/app/api/)

Refer to **Artifact 8** for all API implementations:

- sessions/start/route.ts
- sessions/complete/route.ts
- blocks/route.ts
- goals/route.ts
- quick-capture/route.ts
- shutdown/complete/route.ts
- extension/blocked-apps/route.ts
- extension/session-status/route.ts
- ai/deadline-breakdown/route.ts
- ai/parse-intent/route.ts
- ai/brainstorm/route.ts

### UI Package (packages/ui/src/)

Refer to **Artifact 5** for all UI components:

- Button.tsx
- BlockCard.tsx
- BreathOverlay.tsx
- Timer.tsx
- Modal.tsx
- index.ts
- package.json

### Core Package (packages/core/src/)

Refer to **Artifact 10** for core types and adapters:

- types.ts
- constants.ts
- index.ts
- package.json
- validators/schemas.ts
- adapters/calendar.ts
- adapters/music.ts
- adapters/notifications.ts
- adapters/geofence.ts

### Server Package (packages/server/src/)

Refer to **Artifact 12** for server utilities:

- index.ts
- package.json
- ai/provider.ts
- metrics/calculator.ts

### Chrome Extension (apps/extension/)

Refer to **Artifact 6** for complete extension:

- manifest.json
- package.json
- webpack.config.js
- tsconfig.json
- src/background/service_worker.ts
- src/content/content_script.ts
- src/content/breath_overlay.ts
- src/content/grayscale_filter.ts
- src/options/options.tsx
- src/shared/api.ts
- src/shared/types.ts
- src/shared/storage.ts
- src/utils/auth.ts
- public/options.html
- public/popup.html
- public/rules.json

## 🎯 Quick Copy Instructions

1. **Open the artifact** in the conversation
2. **Find the file** you need (check headers)
3. **Copy the content** between the code blocks
4. **Create the file** at the path shown
5. **Paste the content**

## ⚡ Fastest Method

Instead of copying files individually:

1. Clone the repo: `git clone https://github.com/TootsieTall/FlowStateMax.git`
2. Open **Artifact 4** in the conversation
3. Copy ALL code between the artifact tags
4. Use find/replace to separate files by the comment headers
5. Repeat for Artifacts 5-11

## 🔍 Finding Specific Files

Each artifact header shows the file structure like:

```
// ============================================  
// apps/web/src/app/layout.tsx
// ============================================
```

Look for these comment blocks to identify which content goes where.

## ✅ Verification Checklist

After copying all files, verify:

- [ ] All `apps/web/src/` files present
- [ ] All `packages/*/src/` files present  
- [ ] All `apps/extension/src/` files present
- [ ] All `package.json` files in subdirectories
- [ ] Run `npm install` successfully
- [ ] Run `npx prisma generate` successfully
- [ ] Run `npm run dev` starts server

## 💡 Pro Tips

- **Use VS Code**: Multi-cursor editing helps create files fast
- **Terminal shortcuts**: Use `mkdir -p` to create nested dirs
- **Copy carefully**: Watch for proper indentation
- **Check imports**: Ensure relative paths are correct

## 🐛 Common Issues

**"Module not found"**
→ Check package.json files are in place  
→ Run `npm install` in root and subdirectories

**"Cannot find module '@flowstate/ui'"**
→ Ensure packages/ui/src/index.ts exists  
→ Check tsconfig.json paths are correct

**Prisma errors**
→ Run `npx prisma generate`  
→ Check DATABASE_URL in .env.local

## 📚 Full Artifact Reference

- **Artifact 1**: File tree structure (reference)
- **Artifact 2**: Root configuration ✅ (done)
- **Artifact 3**: Prisma schema ✅ (done)
- **Artifact 4**: Next.js core files
- **Artifact 5**: UI components package
- **Artifact 6**: Chrome extension
- **Artifact 7**: Web app components
- **Artifact 8**: API routes
- **Artifact 9**: Page implementations
- **Artifact 10**: Core package (types/adapters)
- **Artifact 11**: Onboarding flow
- **Artifact 12**: Server package

---

**Need help?** Check SETUP_GUIDE.md or open a GitHub issue.
