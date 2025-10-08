# 🎯 FlowStateMax Implementation Order

**Strategic Implementation Roadmap for ~70 Remaining Files**

---

## 🧠 Strategy Overview

**Core Philosophy**: Build in vertical slices to achieve working features ASAP, not horizontal layers.

**Key Principles**:
1. **Foundation First** - Shared packages before consumers
2. **Vertical Slices** - Complete one feature end-to-end before next
3. **Testing As You Go** - Validate each slice works before moving on
4. **MVP Focus** - Core flow session feature first, polish later
5. **Dependency Order** - Respect import dependencies

---

## 📊 Implementation Phases

### **Phase 1: Foundation** (13 files, ~2 hours)
*Goal: Establish shared infrastructure*

#### 1.1 Core Package - Domain Layer (4 files)
```
Priority: CRITICAL
Dependencies: None
Testing: Unit tests for validators
```

1. ✅ `packages/core/package.json`
2. ✅ `packages/core/src/types.ts` (already exists)
3. ✅ `packages/core/src/constants.ts` (already exists)
4. ✅ `packages/core/src/index.ts` (already exists)
5. 🆕 `packages/core/src/validators/schemas.ts` - Zod validation schemas

**Validation**: `cd packages/core && npm run lint`

#### 1.2 UI Package - Presentation Layer (7 files)
```
Priority: CRITICAL
Dependencies: React, @flowstate/core
Testing: Visual component tests
```

6. ✅ `packages/ui/package.json` (already exists)
7. ✅ `packages/ui/src/Button.tsx` (already exists)
8. ✅ `packages/ui/src/BlockCard.tsx` (already exists)
9. ✅ `packages/ui/src/Timer.tsx` (already exists)
10. ✅ `packages/ui/src/Modal.tsx` (already exists)
11. ✅ `packages/ui/src/BreathOverlay.tsx` (already exists)
12. ✅ `packages/ui/src/index.ts` (already exists)

**Validation**: `cd packages/ui && npm run lint`

#### 1.3 Server Package - Business Logic Layer (4 files)
```
Priority: HIGH
Dependencies: @flowstate/core
Testing: Integration tests for AI provider
```

13. 🆕 `packages/server/package.json`
14. 🆕 `packages/server/src/index.ts`
15. 🆕 `packages/server/src/ai/provider.ts` - OpenAI integration
16. 🆕 `packages/server/src/metrics/calculator.ts` - Flow metrics

**Validation**: `cd packages/server && npm run lint && npm run build`

**🧪 Phase 1 Testing**:
```bash
npm install  # Install all workspace dependencies
turbo run lint  # Verify all packages compile
```

---

### **Phase 2: Web App Foundation** (8 files, ~1 hour)
*Goal: Get Next.js app running with basic layout*

```
Priority: CRITICAL
Dependencies: Phase 1 complete
Testing: App loads at localhost:3000
```

17. 🆕 `apps/web/postcss.config.js`
18. 🆕 `apps/web/tsconfig.json`
19. ✅ `apps/web/src/lib/prisma.ts` (already exists)
20. 🆕 `apps/web/src/lib/ai.ts`
21. 🆕 `apps/web/src/lib/utils.ts`
22. ✅ `apps/web/src/app/layout.tsx` (already exists)
23. ✅ `apps/web/src/app/globals.css` (already exists)
24. ✅ `apps/web/src/app/providers.tsx` (already exists)
25. ✅ `apps/web/src/app/page.tsx` (already exists) - Update to redirect to /today

**🧪 Phase 2 Testing**:
```bash
cd apps/web
npx prisma generate
npx prisma db push
npx prisma db seed
cd ../..
npm run dev  # Should load without errors
```

---

### **Phase 3: MVP Feature - Flow Session** (12 files, ~3 hours)
*Goal: Complete vertical slice of core feature*

#### 3.1 API Routes - Data Layer (3 files)
```
Priority: CRITICAL
Dependencies: Phase 1, 2 complete
Testing: API endpoints return 200
```

26. ✅ `apps/web/src/app/api/auth/[...nextauth]/route.ts` (already exists)
27. ✅ `apps/web/src/app/api/sessions/route.ts` (already exists)
28. 🆕 `apps/web/src/app/api/sessions/start/route.ts`
29. 🆕 `apps/web/src/app/api/sessions/complete/route.ts`

#### 3.2 State Management (1 file)
```
Priority: CRITICAL
Dependencies: @flowstate/core
Testing: Zustand store actions work
```

30. ✅ `apps/web/src/store/index.ts` (already exists)

#### 3.3 Core Components (4 files)
```
Priority: CRITICAL
Dependencies: @flowstate/ui, store
Testing: Components render without errors
```

31. 🆕 `apps/web/src/components/AppShell.tsx` - Nav wrapper
32. 🆕 `apps/web/src/components/BottomNav.tsx` - Mobile navigation
33. 🆕 `apps/web/src/components/FlowTimer.tsx` - Session timer
34. 🆕 `apps/web/src/components/MonochromeTransition.tsx` - Visual effect

#### 3.4 Today View - Main Page (4 files)
```
Priority: CRITICAL
Dependencies: All above
Testing: Full flow session start → complete works
```

35. 🆕 `apps/web/src/components/TodayCard.tsx`
36. 🆕 `apps/web/src/components/BlockList.tsx`
37. ✅ `apps/web/src/components/TodayView.tsx` (already exists)
38. ✅ `apps/web/src/app/today/page.tsx` (already exists)

**🧪 Phase 3 Testing**:
```bash
# Manual testing checklist:
1. ✅ Navigate to /today
2. ✅ Start a flow session
3. ✅ Timer counts up
4. ✅ Complete session with feedback
5. ✅ Session saves to database
```

**🎉 MVP MILESTONE**: You now have a working deep work timer!

---

### **Phase 4: Calendar Feature** (6 files, ~2 hours)
*Goal: Time blocking and weekly planning*

#### 4.1 API Routes (2 files)
```
Priority: HIGH
Dependencies: Phase 3 complete
Testing: CRUD operations work
```

39. ✅ `apps/web/src/app/api/blocks/route.ts` (already exists)
40. ✅ `apps/web/src/app/api/goals/route.ts` (already exists)

#### 4.2 Components & Page (4 files)
```
Priority: HIGH
Dependencies: @dnd-kit, date-fns
Testing: Drag-drop works, persists to DB
```

41. 🆕 `apps/web/src/components/GoalsWidget.tsx`
42. ✅ `apps/web/src/components/WeekView.tsx` (already exists)
43. ✅ `apps/web/src/app/week/page.tsx` (already exists)
44. 🆕 `apps/web/src/app/flow/page.tsx` - Active session view

**🧪 Phase 4 Testing**:
```bash
# Manual testing:
1. ✅ Create time blocks via drag
2. ✅ Edit block details
3. ✅ Set daily goals
4. ✅ View week calendar
```

---

### **Phase 5: Quick Capture & AI** (4 files, ~1.5 hours)
*Goal: Task capture with AI enhancement*

```
Priority: MEDIUM
Dependencies: OpenAI API key, Phase 4
Testing: AI parsing works correctly
```

45. 🆕 `apps/web/src/components/QuickCapture.tsx` - Modal with natural language input
46. 🆕 `apps/web/src/app/api/quick-capture/route.ts` - Task creation
47. 🆕 `apps/web/src/app/api/ai/parse-intent/route.ts` - Natural language → structured task
48. 🆕 `apps/web/src/app/api/ai/deadline-breakdown/route.ts` - Break large tasks into blocks
49. 🆕 `apps/web/src/app/api/ai/brainstorm/route.ts` - AI thinking partner

**🧪 Phase 5 Testing**:
```bash
# Test AI integration:
1. ✅ "Finish project proposal by Friday" → Creates task with deadline
2. ✅ AI breaks down multi-day project into blocks
3. ✅ AI brainstorm session works
```

---

### **Phase 6: Chrome Extension** (16 files, ~3 hours)
*Goal: App blocking, grayscale, breath overlay*

#### 6.1 Extension Configuration (4 files)
```
Priority: HIGH
Dependencies: None
Testing: Extension loads in Chrome
```

50. ✅ `apps/extension/manifest.json` (already exists)
51. ✅ `apps/extension/package.json` (already exists)
52. 🆕 `apps/extension/webpack.config.js`
53. 🆕 `apps/extension/tsconfig.json`

#### 6.2 Background Service Worker (1 file)
```
Priority: HIGH
Dependencies: Chrome APIs
Testing: Message passing works
```

54. ✅ `apps/extension/src/background/service_worker.ts` (already exists)

#### 6.3 Content Scripts (3 files)
```
Priority: HIGH
Dependencies: Background worker
Testing: Grayscale + breath overlay work
```

55. ✅ `apps/extension/src/content/content_script.ts` (already exists)
56. ✅ `apps/extension/src/content/grayscale_filter.ts` (already exists)
57. ✅ `apps/extension/src/content/breath_overlay.ts` (already exists)

#### 6.4 Shared Utilities (4 files)
```
Priority: HIGH
Dependencies: @flowstate/core
Testing: API sync works
```

58. ✅ `apps/extension/src/shared/api.ts` (already exists)
59. ✅ `apps/extension/src/shared/types.ts` (already exists)
60. ✅ `apps/extension/src/shared/storage.ts` (already exists)
61. 🆕 `apps/extension/src/utils/auth.ts`

#### 6.5 UI & Assets (4 files)
```
Priority: MEDIUM
Dependencies: Options page components
Testing: Extension UI works
```

62. ✅ `apps/extension/src/options/options.tsx` (already exists)
63. 🆕 `apps/extension/public/options.html`
64. 🆕 `apps/extension/public/popup.html`
65. 🆕 `apps/extension/public/rules.json` - Declarative net request rules

**🧪 Phase 6 Testing**:
```bash
cd apps/extension
npm run build
# Load unpacked in chrome://extensions/
# Test:
1. ✅ Grayscale activates during session
2. ✅ Breath overlay on blocked sites
3. ✅ Sync with web app
```

---

### **Phase 7: Onboarding Flow** (8 files, ~2 hours)
*Goal: First-time user experience*

```
Priority: MEDIUM
Dependencies: All core features done
Testing: Complete flow saves user preferences
```

66. ✅ `apps/web/src/app/onboarding/page.tsx` (already exists)
67. ✅ `apps/web/src/app/onboarding/goals/page.tsx` (already exists)
68. 🆕 `apps/web/src/app/onboarding/locations/page.tsx`
69. 🆕 `apps/web/src/app/onboarding/block-apps/page.tsx`
70. 🆕 `apps/web/src/app/onboarding/ritual/page.tsx`
71. 🆕 `apps/web/src/app/onboarding/music/page.tsx`
72. 🆕 `apps/web/src/app/onboarding/podcasts/page.tsx`
73. 🆕 `apps/web/src/app/onboarding/ready/page.tsx`

**🧪 Phase 7 Testing**:
```bash
# Reset user onboarding status in DB
# Complete full onboarding flow
# Verify all preferences save correctly
```

---

### **Phase 8: Shutdown Ritual** (4 files, ~1 hour)
*Goal: End-of-day closure*

```
Priority: LOW
Dependencies: Phase 3, 4 complete
Testing: Shutdown saves successfully
```

74. 🆕 `apps/web/src/components/RitualChecklist.tsx`
75. 🆕 `apps/web/src/components/ShutdownStepper.tsx`
76. 🆕 `apps/web/src/app/shutdown/page.tsx`
77. 🆕 `apps/web/src/app/api/shutdown/complete/route.ts`

**🧪 Phase 8 Testing**:
```bash
# Complete shutdown ritual
# Verify brain dump saves
# Verify tomorrow's tasks created
```

---

### **Phase 9: Settings & Explore** (4 files, ~1 hour)
*Goal: User configuration and content discovery*

```
Priority: LOW
Dependencies: All features complete
Testing: Settings persist correctly
```

78. 🆕 `apps/web/src/app/settings/page.tsx` - User preferences
79. 🆕 `apps/web/src/app/explore/page.tsx` - Podcast/content curation
80. 🆕 `apps/web/src/app/api/extension/blocked-apps/route.ts`
81. 🆕 `apps/web/src/app/api/extension/session-status/route.ts`

---

### **Phase 10: Core Package Adapters** (4 files, ~2 hours)
*Goal: External integrations (future-proof)*

```
Priority: OPTIONAL
Dependencies: External APIs
Testing: Mock implementations work
```

82. 🆕 `packages/core/src/adapters/calendar.ts` - Google Calendar sync
83. 🆕 `packages/core/src/adapters/music.ts` - Spotify/Apple Music
84. 🆕 `packages/core/src/adapters/notifications.ts` - Push notifications
85. 🆕 `packages/core/src/adapters/geofence.ts` - Location triggers

**Note**: Implement as stubs initially, full integration later.

---

## 🎯 Minimal Viable Demo (MVD)

**Goal**: Working demo in ~6 hours

**Include**:
- ✅ Phases 1-3 (Foundation + Flow Session)
- ✅ Phase 6.1-6.3 (Basic extension)
- ✅ Skip: Onboarding, shutdown, settings, AI features

**MVD Testing**:
```bash
# Core user journey:
1. ✅ Sign in with Google
2. ✅ Create time block on Week view
3. ✅ Start flow session from Today view
4. ✅ Extension applies grayscale
5. ✅ Complete session with feedback
6. ✅ View session history
```

---

## 📋 Dependency Map

```
Foundation Layer:
  @flowstate/core → @flowstate/ui → @flowstate/server
                ↓                ↓
Web App Layer:  ↓                ↓
  API Routes ←──┴────────────────┘
       ↓
  Components
       ↓
  Pages

Extension Layer:
  @flowstate/core → background → content scripts → UI
```

---

## 🧪 Testing Strategy

### Unit Tests (Future)
- `packages/core/src/validators` - Zod schemas
- `packages/server/src/metrics` - Calculation logic

### Integration Tests (Future)
- API routes with test database
- Extension ↔ Web app communication

### E2E Tests (Future - Playwright)
- Complete flow session lifecycle
- Onboarding flow end-to-end
- Extension blocking behavior

### Manual Testing Checklist (Now)
After each phase, validate key user journeys work.

---

## ⚡ Quick Commands

```bash
# Phase 1: Foundation
cd packages/core && npm install && npm run lint
cd packages/ui && npm install && npm run lint
cd packages/server && npm install && npm run build

# Phase 2: Web App Foundation
cd apps/web
npx prisma generate
npx prisma db push
npx prisma db seed
npm run dev

# Phase 6: Extension
cd apps/extension
npm run build
# Load in chrome://extensions/

# Full Build
npm install  # From root
turbo run build
```

---

## 🚨 Common Pitfalls

1. **Import Errors**: Always implement packages before apps
2. **Type Mismatches**: Run `npx prisma generate` after schema changes
3. **Extension CORS**: Ensure host_permissions in manifest.json
4. **State Sync**: Extension ↔ web requires message passing
5. **AI API Keys**: Set OPENAI_API_KEY before Phase 5

---

## 📦 File Count Summary

| Phase | Files | Est. Time | Priority |
|-------|-------|-----------|----------|
| 1. Foundation | 13 | 2h | CRITICAL |
| 2. Web Foundation | 8 | 1h | CRITICAL |
| 3. Flow Session MVP | 12 | 3h | CRITICAL |
| 4. Calendar | 6 | 2h | HIGH |
| 5. Quick Capture | 5 | 1.5h | MEDIUM |
| 6. Extension | 16 | 3h | HIGH |
| 7. Onboarding | 8 | 2h | MEDIUM |
| 8. Shutdown | 4 | 1h | LOW |
| 9. Settings/Explore | 4 | 1h | LOW |
| 10. Adapters | 4 | 2h | OPTIONAL |
| **Total** | **80** | **~18.5h** | - |

---

## 🎉 Success Metrics

**MVD Complete**: Phases 1-3 + basic extension working
**Feature Complete**: Phases 1-9 implemented
**Production Ready**: Phase 10 + testing + deployment

---

**Next Step**: Start with Phase 1.1 - Core Package foundation.
