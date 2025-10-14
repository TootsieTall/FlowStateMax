# Daybreak - Claude Development Guidelines

## Project Overview

**Daybreak** (formerly FlowState) is a comprehensive productivity application implementing Cal Newport's Deep Work methodology as a complete daily operating system. Unlike competitors (One Sec, Opal, Forest), Daybreak guides users through their entire day—planning, execution, distraction blocking, and intentional recovery—in one seamless system.

**Core Philosophy:** Be a daily companion that eliminates decision fatigue, not another productivity dashboard to manage.

**Target Users:** Knowledge workers, students, side hustlers—anyone struggling with digital distraction seeking structured productivity.

**Positioning:** "Cal Newport's Deep Work book as a daily companion app"

---

## The 11 Deep Work Methods (Cal Newport Foundation)

These methods form the philosophical foundation of every feature we build:

1. **Selective Work Environment:** 5 "Flow Zones" with geofencing triggers + nearby study spot suggestions
2. **Cast Iron Time Boxes:** Scheduled blocks never interrupted. "Wall strength" meter. Start 30-min, progress to hours
3. **Smart Daily Planning:** Weekly planning (30-min Sunday/Monday) + daily adjustments (10-min evening) + morning review (3-min). Batch similar tasks. Schedule deep work early. Add buffer time. Reality Check tracks estimated vs actual
4. **Pre-Work Rituals:** Customizable checklist (coffee, desk, music, DND). Auto-hides after 21 completions
5. **Boredom Training:** Practice silence during idle gaps. Don't fill every moment. Builds focus muscle (Optional module)
6. **Productive Multitasking:** Use low-brain activities (walking) to think deeply about ONE problem. Voice AI partner
7. **Strategic Irresponsibility:** Morning: Set 1-3 major goals. Filter new commitments: "Aligns with goals?" Show time cost
8. **Avoid "Any Benefit" Trap:** High Impact 🔥 vs Low Impact 📋 classification. Focus exclusively on highest ROI
9. **End Day Properly:** 15-min shutdown ritual. Brain dump, plan tomorrow, set alarms. Locks work apps until morning
10. **Active Relaxation:** Pick 3 activities/week instead of scrolling. Before social media: "Did you do recovery activity?"
11. **Flow States = Fulfillment:** Research shows stretching brain capabilities on difficult+meaningful work creates life satisfaction

**CRITICAL:** Every feature must map to one or more of these methods. If it doesn't, it doesn't belong in Daybreak.

---

## Design Principles (ALWAYS FOLLOW)

1. **Minimal Friction:** 5-min setup, 1-min daily overhead, 10-min shutdown
2. **One Primary Screen:** "Today View" is the hub—everything flows from there
3. **Eliminate Choice Paralysis:** Guide users with clear next actions, not overwhelming options
4. **Progressive Disclosure:** Advanced features hidden in "Explore" tab until needed
5. **Metrics Hidden by Default:** Progress dashboard in Settings (optional). Monthly notification only. Focus on doing, not tracking
6. **No Feature Bloat:** Every feature must serve core mission or get cut
7. **Native Feel:** Deep OS-level integration—should feel built-in, not third-party
8. **Realistic Approach:** Work with human behavior, not against it. Strategic reduction, not elimination
9. **Respect User Time:** Max 15 min/day management overhead
10. **Every feature accessible within 2 taps maximum**

### Before Adding Any Feature - Ask These Questions:
1. Does this help deep work?
2. Integrates seamlessly into daily flow?
3. Would Cal Newport approve?
4. Add friction or remove it?
5. Can users opt out?

---

## Core Features Summary

### Environment Optimizer
- **5 Flow Zones** with geofencing → push notification "Ready to enter flow?"
- **Audio:** Ambient sounds (rain, cafe, white noise) + classical music
- **Music Integration:** Spotify/Apple Music API
- **App Blocking:** Choose apps (Instagram, TikTok, etc.) with Opal/One Sec style deep breath intervention (5-sec inhale/exhale, then "Still want to open?")
- **Monochrome Mode:** Grayscale during flow sessions (reduces phone use 20-30%, makes apps visually boring)

### Iron Time Box Schedule
- Native calendar sync (Apple/Google), imports appointments
- Color-coded blocks: Deep Work (dark blue), Meetings (grey), Breaks (green), Gym (orange)
- Gamification: Streak counter, wall strength meter, monthly badges
- Native notifications: 15-min before, when starts, gentle reminder if leaving

### Smart Daily Planner
- **Quick Capture:** Floating "+" button → voice/text/scan → Inbox
- **Natural commands:** "Schedule tomorrow 9am," "Add to Friday"
- **Week View:** Drag-drop calendar (Mon-Sun), pinch zoom day/week
- **Reality Check:** After sessions "On time/Needed more/Finished early" → learns accuracy
- **Time Saved Graph (Settings):** Estimated vs actual over weeks
- **Deadline Breakdown:** AI suggests chunks ("Study for exam → 3×2hr sessions"), auto-schedules

### Ritual Builder
- Pop-up checklist before first flow: Make coffee, DND, clear desk, music, close email, breaths
- Progress: "Completed 14/21 times"
- Auto-hides after 21 consistent sessions (habit formed)

### Boredom Training (Optional - Explore Tab)
- **Meditation:** Binaural beats, timer (5/10/15/30min), "Comfort with Silence" score
- **AI Thinking Partner:** Text or voice chat for brainstorming, perfect for walks, saves summaries
- **Problem of the Day:** Daily strategic question
- **Paper Scan:** Camera → AI extracts → saves to notes

### Commitment Filter
- Morning: "What are 1-3 major goals today?" (shows in Today View)
- New requests: "Aligns with goals?" + time cost → Accept/Decline
- Monthly review: "Said no to X commitments, protected Y hours"

### ROI Task Analyzer
- Simple toggle when creating tasks: High Impact 🔥 or Low Impact 📋
- Visual separation in week view (high-impact bolded)
- Pie chart (Settings): "68% of time on high-impact work"

### Shutdown Ritual
- Widget "End Day" button or in-app (appears 5pm+)
- 5 steps: Brain dump → Tomorrow's top 3 → Review schedule → Set alarms → Shutdown Complete
- Locks work apps until morning wake time
- Journal: Scan handwritten or type directly

### Active Recovery Planner
- Weekly: "Pick 3 activities instead of scrolling"
- Suggestions: Physical (gym, climbing), Social (trivia, board games), Creative (museums), Learning (podcasts)
- Social media gate: "Did recovery activity?" before opening evening
- Gym: Time blocks, tracker (Upper/Lower/Cardio), syncs Health apps
- Tracking: "Active evenings 4/7" + monthly "Replaced X hours scrolling"

### Podcast Suggestions
- Onboarding: Pick 5 genres
- Weekly curation: 3-5 episodes every Monday
- Integration: Spotify/Apple Podcasts
- Quick access: Explore tab → one-tap play

---

## Navigation Structure

### Bottom Tab Bar (Always Accessible)
1. **Week View:** Drag-drop planning interface
2. **Today View ⭐ PRIMARY:** Current block, next 3 blocks, daily goals, "Start Flow" button
3. **Explore:** Optional features (Boredom Training, Podcasts, Recovery)
4. **Settings:** Config, metrics (opt-in), manage locations/apps/ritual

### Quick Actions
- **"+" Button:** Floating, quick capture from anywhere
- **"Start Flow":** Today View main button
- **"End Day":** Widget/button triggers shutdown

### Automatic Triggers
- Geofence: Location notification
- Blocked app: Deep breath screen
- 5pm: Shutdown reminder
- Morning: Daily goals prompt

---

## Typical Day Flow (User Journey)

**7am:** Wake (alarm from shutdown) → Check Today View (goals + blocks)  
**7:30am:** Commute → Podcast suggestion  
**9am:** Office geofence → "Ready to flow?" → Ritual checklist → Music/DND/Monochrome/Block ON  
**11am:** Session complete → Feedback ("On time?") → Monochrome OFF  
**12pm:** Lunch → Try Instagram → Deep breath → Go Back  
**2pm:** Second flow session  
**5:30pm:** Shutdown ritual (5 steps) → Work apps lock  
**7pm:** Try Twitter → "Did recovery activity?" → Go to gym  
**9pm:** Social media guilt-free (recovery done)

**Total app time:** ~15 min | **Value:** 6+ hours focused work + intentional evening

---

## Tech Stack

### Frontend (Web App)
- **Framework:** Next.js 14 with App Router
- **Language:** TypeScript
- **Styling:** Tailwind CSS with Dark Sunrise Theme
- **Animations:** Framer Motion
- **UI Components:** Hybrid approach - Utility classes (@flowstate/ui) + ShadCN for complex patterns
- **State Management:** Zustand (global state) + React Query (server state)
- **Forms:** React Hook Form with Zod validation
- **Date Handling:** date-fns

### Backend
- **API:** Next.js API Routes
- **Database:** PostgreSQL with Prisma ORM
- **Authentication:** NextAuth.js with Google OAuth + Guest mode
- **Hosting:** Vercel (recommended)
- **Database Hosting:** Supabase/Railway/Neon (PostgreSQL)

### Backend (Planned)
- **Real-time:** WebSockets for session sync
- **Background Jobs:** Temporal/Bull for scheduled tasks
- **File Storage:** S3/Cloudflare R2 for audio/documents
- **AI Integration:** OpenAI/Anthropic API for smart features

### Chrome Extension
- **Manifest:** V3
- **Build:** Webpack + TypeScript
- **Features:** App blocking, grayscale mode, breathing overlay
- **Integration:** Syncs with web app via API

### Monorepo Structure
- **Tool:** Turborepo with npm workspaces
- **Packages:**
  - `@flowstate/core` - Shared types, constants, validators
  - `@flowstate/ui` - Shared UI components
  - `@flowstate/server` - Server utilities (future)

### Platform-Specific APIs (Future Native Apps)

#### iOS
- Calendar: EventKit
- Music: MusicKit + Spotify SDK
- Blocking: Screen Time API
- Monochrome: `UIAccessibility.isGrayscaleEnabled`
- Geofence: Core Location
- Notifications: UserNotifications
- Health: HealthKit

#### Android
- Calendar: Google Calendar API
- Music: Spotify SDK
- Blocking: Digital Wellbeing API/Accessibility Service
- Monochrome: Digital Wellbeing grayscale
- Geofence: Google Play Services Location
- Notifications: Firebase
- Health: Google Fit

### AI Integration
- **Task parsing:** NLP for voice/text commands
- **Time estimation:** ML from user history
- **Brainstorming:** GPT-4/Claude API for thinking partner
- **Suggestions:** Recommendation engine for podcasts/activities

### CRITICAL TECHNICAL RULES
- **NEVER use localStorage/sessionStorage** in production code - Use React state (useState/useReducer) or database
- **NEVER hardcode API keys** - Always use environment variables
- **NEVER skip error handling** - Every API call needs try/catch
- **ALWAYS validate user input** - Use Zod schemas

---

## File Organization

```
FlowStateMax/
├── apps/
│   ├── web/                      # Main Next.js application
│   │   ├── src/
│   │   │   ├── app/              # App Router pages & API routes
│   │   │   │   ├── (auth)/       # Auth pages (login, signup)
│   │   │   │   ├── onboarding/   # Onboarding flow (9 steps)
│   │   │   │   │   ├── page.tsx           # Welcome
│   │   │   │   │   ├── goals/             # Set 3 main goals
│   │   │   │   │   ├── locations/         # 5 Flow Zones
│   │   │   │   │   ├── apps/              # Block apps
│   │   │   │   │   ├── ritual/            # Pre-work ritual
│   │   │   │   │   ├── integrations/      # Music, calendar
│   │   │   │   │   ├── boredom/           # Boredom training intro
│   │   │   │   │   ├── recovery/          # Active recovery
│   │   │   │   │   └── complete/          # Onboarding done
│   │   │   │   ├── today/        # ⭐ PRIMARY - Today View
│   │   │   │   ├── week/         # Week View calendar
│   │   │   │   ├── flow/         # Active flow session
│   │   │   │   │   └── complete/ # Session complete
│   │   │   │   ├── capture/      # Quick capture & inbox
│   │   │   │   ├── explore/      # Optional features
│   │   │   │   ├── shutdown/     # Shutdown ritual
│   │   │   │   ├── settings/     # Settings & metrics
│   │   │   │   └── api/          # API routes
│   │   │   │       ├── ai/              # AI endpoints
│   │   │   │       │   ├── brainstorm/      # Thinking partner
│   │   │   │       │   ├── deadline-breakdown/
│   │   │   │       │   └── parse-intent/    # NLP for capture
│   │   │   │       ├── sessions/        # Flow session CRUD
│   │   │   │       ├── blocks/          # Time blocks
│   │   │   │       ├── goals/           # Daily goals
│   │   │   │       ├── ritual/          # Ritual tracking
│   │   │   │       └── extension/       # Extension sync
│   │   │   ├── components/       # React components
│   │   │   │   ├── AppShell.tsx         # Main layout
│   │   │   │   ├── BottomNav.tsx        # Navigation
│   │   │   │   ├── TodayView.tsx        # Today screen
│   │   │   │   ├── FlowSessionView.tsx  # Active flow
│   │   │   │   ├── StartFlowButton.tsx  # CTA
│   │   │   │   ├── QuickCapture.tsx     # Capture modal
│   │   │   │   ├── RitualChecklist.tsx  # Pre-work ritual
│   │   │   │   ├── SessionComplete.tsx  # Post-session
│   │   │   │   ├── ui/                  # ShadCN components
│   │   │   │   └── onboarding/          # Onboarding components
│   │   │   ├── hooks/            # Custom React hooks
│   │   │   │   ├── useTimeBlocks.ts
│   │   │   │   └── useWorkLocations.ts
│   │   │   ├── lib/              # Utilities
│   │   │   │   ├── auth.ts              # NextAuth config
│   │   │   │   ├── prisma.ts            # Prisma client
│   │   │   │   ├── ai.ts                # AI integrations
│   │   │   │   ├── flow-session.ts      # Session logic
│   │   │   │   ├── navigation-guards.ts # Route protection
│   │   │   │   ├── routes.ts            # Route constants
│   │   │   │   └── utils.ts             # Helpers
│   │   │   ├── store/            # Zustand stores
│   │   │   │   ├── index.ts             # Main app store
│   │   │   │   └── onboarding.ts        # Onboarding flow
│   │   │   └── types/            # TypeScript types
│   │   └── prisma/
│   │       ├── schema.prisma     # Database schema
│   │       ├── migrations/       # DB migrations
│   │       └── seed.ts           # Database seeder
│   └── extension/                # Chrome extension
│       ├── src/
│       │   ├── background/       # Service worker
│       │   │   └── service_worker.ts
│       │   ├── content/          # Content scripts
│       │   │   ├── content_script.ts    # Main script
│       │   │   ├── breath_overlay.ts    # Breath intervention
│       │   │   └── grayscale_filter.ts  # Monochrome mode
│       │   ├── shared/           # Shared utilities
│       │   │   ├── api.ts               # Web app API client
│       │   │   ├── storage.ts           # Chrome storage
│       │   │   └── types.ts             # Extension types
│       │   └── options/          # Extension options
│       ├── public/               # Static assets
│       └── manifest.json         # Extension manifest
├── packages/
│   ├── core/                     # Shared business logic
│   │   └── src/
│   │       ├── types.ts          # Shared types
│   │       ├── constants.ts      # Constants
│   │       └── validators/       # Zod schemas
│   └── ui/                       # Shared UI components
│       └── src/
│           ├── Button.tsx
│           ├── Timer.tsx
│           ├── FlowTimer.tsx
│           ├── BreathOverlay.tsx
│           ├── BlockCard.tsx
│           └── Modal.tsx
└── docs/                         # Documentation
```

---

## State Management

### Global State (Zustand)
Located in `apps/web/src/store/`:

**Main Store (`index.ts`):**
- Active flow session state
- User preferences
- UI state (modals, notifications)
- Current location/geofence status

**Onboarding Store (`onboarding.ts`):**
- Multi-step onboarding flow progress
- Collected data (goals, locations, apps, ritual)
- Step validation

**Pattern:** Slices for different features, combined into single store

```typescript
// Example store usage
const { activeSession, startFlow, endFlow } = useStore()
const { currentStep, setGoals, completeStep } = useOnboardingStore()
```

### Server State (React Query)
- **Queries:** Fetching user data, time blocks, sessions, goals
- **Mutations:** Creating/updating/deleting resources
- **Cache:** Automatic caching with smart invalidation
- **Optimistic Updates:** Immediate UI feedback

### Local State (React State)
- Component-specific UI state
- Form state (with React Hook Form)
- Temporary interaction state

**Rule:** Use the right state for the job. Don't put everything in global state.

---

## Development Workflow Rules

### CRITICAL: Follow these rules EXACTLY

1. **First think through the problem, read the codebase for relevant files, and write a plan to tasks/todo.md**

2. **The plan should have a list of todo items that you can check off as you complete them**

3. **Before you begin working, check in with me and I will verify the plan**

4. **Then, begin working on the todo items, marking them as complete as you go**

5. **Please every step of the way just give me a high level explanation of what changes you made**

6. **Make every task and code change you do as simple as possible. We want to avoid making any massive or complex changes. Every change should impact as little code as possible. Everything is about simplicity.**

7. **Finally, add a review section to the todo.md file with a summary of the changes you made and any other relevant information**

8. **DO NOT BE LAZY. NEVER BE LAZY. IF THERE IS A BUG FIND THE ROOT CAUSE AND FIX IT. NO TEMPORARY FIXES. YOU ARE A SENIOR DEVELOPER. NEVER BE LAZY**

9. **MAKE ALL FIXES AND CODE CHANGES AS SIMPLE AS HUMANLY POSSIBLE. THEY SHOULD ONLY IMPACT NECESSARY CODE RELEVANT TO THE TASK AND NOTHING ELSE. IT SHOULD IMPACT AS LITTLE CODE AS POSSIBLE. YOUR GOAL IS TO NOT INTRODUCE ANY BUGS. IT'S ALL ABOUT SIMPLICITY.**

10. **AFTER EVERY MAJOR TASK COMPLETION, PUSH ALL CHANGES TO GIT** - This ensures work is saved and creates a clear checkpoint for progress. Always commit and push when a significant feature or fix is completed.

---

## Design System: Dark Sunrise Theme

### Color Philosophy
**Concept:** Pre-dawn darkness with sunrise breaking through - deep blacks with warm sunrise accents

**Reference Document:** `DARK_THEME_UI_TRANSFORMATION_BRIEF.md` contains complete specifications

### Core Color Palette

```typescript
// Backgrounds (Dark → Light)
bg-primary           // #0b0b0b - Deep black base
bg-secondary         // #141414 - Section backgrounds  
bg-elevated          // #1e1e1e - Cards, panels
bg-surface           // #252525 - Elevated surfaces

// Text (Light → Dark on dark background)
text-primary         // #F5F2ED - Primary text (cream white)
text-secondary       // #B8B0A8 - Body text (warm gray)
text-tertiary        // #6B6560 - Muted text (bark)

// Accents (Sunrise breaking through)
accent-gold          // #FFC857 - Primary CTAs, highlights
accent-orange        // #FF8C42 - Interactive states, hover
accent-warm          // #FFB84D - Subtle highlights

// Semantic Colors
color-deep-work      // Deep blue - Focus sessions
color-meeting        // Grey - Meetings
color-break          // Green - Breaks
color-gym            // Orange - Physical activity

// Borders & Effects
border-default       // #2C2C2C - Standard borders
focus-ring           // rgba(255, 184, 77, 0.3) - Focus states
```

### Glow System (Not Shadows!)

Dark backgrounds need glows instead of shadows for depth:

**Three glow levels:**
1. **glow-subtle** - Minimal ambient glow (cards)
2. **glow-medium** - Standard elevation (interactive elements)
3. **glow-strong** - Prominent emphasis (active states, modals)

**Sunrise glow colors:**
- Warm golden glows: `rgba(255, 184, 77, 0.1-0.4)`
- Orange interactive states: `rgba(255, 140, 66, 0.2-0.5)`
- Combine with subtle black shadows for depth

### Depth Layer Utility Classes

Use these semantic classes to create visual hierarchy:

```css
.layer-base         /* bg-primary (#0b0b0b) - Deepest background */
.layer-elevated     /* bg-elevated (#1e1e1e) + glow-subtle */
.layer-floating     /* bg-surface (#252525) + glow-medium */
.layer-modal        /* bg-surface + glow-strong - Highest elevation */
```

### Responsive Layout Principles

**Principle 1: System of Boxes**
- Every design starts as a system of boxes
- Build layouts where everything has a clear relationship and natural balance
- The structure itself should feel flexible before it ever responds

**Principle 2: Rearrange with Purpose**
- A responsive layout isn't about shrinking — it's about rearranging
- As space changes, elements should shift, flow, or reprioritize
- Maintain clarity and rhythm at all breakpoints

**Implementation:**
```jsx
/* Good - Responsive container with proper spacing */
<main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
  {/* Cards stack naturally with consistent gaps */}
  <div className="card-shiny p-6">...</div>
  <div className="layer-modal p-8 rounded-warm-lg">...</div>
</main>
```

---

## UI Component Guidelines

### Design System Overview
- **Theme:** Dark Sunrise - Pre-dawn darkness with warm sunrise accents
- **Approach:** Hybrid - Utility classes for simple components, ShadCN for complex interactions
- **Philosophy:** Keep it simple unless complexity adds real value
- **Full Specs:** See `DARK_THEME_UI_TRANSFORMATION_BRIEF.md` for complete implementation guide

### When to Use Utility Classes (Preferred for Simple UI)

**USE for these components:**
- ✅ **Buttons** - Use `.btn-primary`, `.btn-secondary`, `.btn-ghost`, `.btn-success`
- ✅ **Basic Cards** - Use `.card`, `.card-elevated`, `.card-interactive`
- ✅ **Text Inputs** - Use `.input` class
- ✅ **Text Areas** - Use `.textarea` class
- ✅ **Badges** - Use `.badge` with variants
- ✅ **Simple Layouts** - Use Tailwind utilities directly

**Example:**
```tsx
<button className="btn-primary">Save Changes</button>
<div className="card p-6">
  <h3 className="text-h3 text-text-primary">Card Title</h3>
  <input className="input" placeholder="Enter text..." />
</div>
```

### When to Use ShadCN Components (For Complex Interactions)

**USE ShadCN for these patterns:**

#### 🎯 **Modals/Dialogs** - When you need overlays
```tsx
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

<Dialog open={open} onOpenChange={setOpen}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Confirm Action</DialogTitle>
    </DialogHeader>
    <p>Are you sure you want to proceed?</p>
  </DialogContent>
</Dialog>
```

#### 🎯 **Dropdown Menus** - For action menus
```tsx
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"

<DropdownMenu>
  <DropdownMenuTrigger>⋯</DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuItem onClick={handleEdit}>Edit</DropdownMenuItem>
    <DropdownMenuItem onClick={handleDelete}>Delete</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

#### 🎯 **Complex Selects** - If default `<select>` isn't enough
```tsx
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"

<Select onValueChange={handleChange}>
  <SelectTrigger>
    <SelectValue placeholder="Choose option" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="1">Option 1</SelectItem>
    <SelectItem value="2">Option 2</SelectItem>
  </SelectContent>
</Select>
```

#### 🎯 **Tooltips** - For hover information
```tsx
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"

<Tooltip>
  <TooltipTrigger>?</TooltipTrigger>
  <TooltipContent>Helpful explanation</TooltipContent>
</Tooltip>
```

#### 🎯 **Popovers** - For contextual UI
```tsx
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"

<Popover>
  <PopoverTrigger>Options</PopoverTrigger>
  <PopoverContent>
    <div className="space-y-2">
      {/* Complex content here */}
    </div>
  </PopoverContent>
</Popover>
```

#### 🎯 **Command Palette** - For search/commands (⌘K)
```tsx
import { CommandDialog, CommandInput, CommandList, CommandItem } from "@/components/ui/command"

<CommandDialog open={open} onOpenChange={setOpen}>
  <CommandInput placeholder="Search..." />
  <CommandList>
    <CommandItem>Create task</CommandItem>
    <CommandItem>New time block</CommandItem>
  </CommandList>
</CommandDialog>
```

### Decision Tree for UI Components

```
Need a UI component?
│
├─ Is it a button, card, or input?
│  └─ YES → Use utility classes (.btn-primary, .card, .input)
│
├─ Does it need to overlay the page?
│  └─ YES → Use Dialog or Popover (ShadCN)
│
├─ Does it have multiple actions/options?
│  └─ YES → Use DropdownMenu (ShadCN)
│
├─ Does it need keyboard navigation?
│  └─ YES → Use Command or Select (ShadCN)
│
├─ Does it need hover information?
│  └─ YES → Use Tooltip (ShadCN)
│
└─ Otherwise → Use Tailwind utilities directly
```

### Component Class Reference

**All component styles use dark theme:**

```css
/* Buttons - Sunrise gradient CTAs */
.btn-primary         // Gold→Orange gradient, main actions
.btn-secondary       // Outlined with glow, secondary actions
.btn-ghost           // Transparent, tertiary actions
.btn-success         // Green for completion states

/* Cards - Dark with glows */
.card                // Dark elevated card with subtle glow
.card-elevated       // Prominent glow and border
.card-interactive    // Hover glow and lift effect

/* Forms - Dark with golden focus */
.input               // Dark input with sunrise focus glow
.textarea            // Multi-line text input

/* Effects */
.hover-lift          // Translate up on hover
.glow-focus          // Focus ring with golden glow
.animate-bounce-in   // Entrance animation
.pulse-glow          // Active session indicator
```

**Full implementation:** See `apps/web/src/app/globals.css` and `DARK_THEME_UI_TRANSFORMATION_BRIEF.md`

### Performance Guidelines

1. **Prefer utility classes** - Faster, less JavaScript
2. **Use ShadCN sparingly** - Only when complexity is needed
3. **Lazy load dialogs** - Only render when open
4. **Memoize dropdown content** - Prevent unnecessary re-renders
5. **Keep animations simple** - Use CSS over JavaScript

### Accessibility Requirements

All components (utility or ShadCN) must have:
- ✅ Proper ARIA labels
- ✅ Keyboard navigation
- ✅ Focus indicators (accent-gold ring)
- ✅ Color contrast (WCAG AA minimum)
- ✅ Screen reader support

ShadCN components handle most of this automatically - another reason to use them for complex patterns.

---

## Competitive Differentiation

### vs One Sec ($3 one-time)
- **One Sec:** Only breathing intervention before apps
- **Daybreak:** Breathing + blocking + monochrome + complete daily system

### vs Opal ($10/month)
- **Opal:** App blocking + focus timer + stats
- **Daybreak:** Everything Opal has + planning + rituals + shutdown + AI + location triggers + monochrome

### Unique to Daybreak (No Competitor Has)
1. **Monochrome mode** - Makes phone boring during flow
2. **Location-based triggers** - Auto prompts when entering zones
3. **Pre-work ritual system** - Habit-building checklist
4. **AI thinking partner** - Voice/text brainstorming
5. **Shutdown ritual** - Locks work apps until morning
6. **Complete planning** - Weekly calendar + AI deadline breakdown
7. **Active recovery** - Gym + activity suggestions + conscious social media
8. **Podcast curation** - Weekly listening for downtime
9. **All-in-one system** - Complete daily OS, not just blocker/timer

**Why this matters:** Users pay for 3-4 apps ($20-40/mo). We replace all of them.

---

## Current Implementation Status

### ✅ Completed
- Monorepo setup with Turborepo
- Next.js 14 app with TypeScript
- Prisma database schema with all models
- Authentication with NextAuth (Google OAuth + Guest mode)
- All main page structures (Today, Week, Explore, Settings, Flow, Capture, Shutdown)
- Complete onboarding flow (9 steps: Welcome, Goals, Locations, Apps, Ritual, Integrations, Boredom, Recovery, Complete)
- Chrome extension (app blocking, grayscale, breathing overlay)
- API routes for sessions, blocks, goals, ritual, AI features
- Database seeding
- Navigation system with middleware and route guards
- Dark Sunrise Theme foundation

### 🚧 In Progress - HIGH PRIORITY
- **Connect UI to backend** - Forms don't persist data to database
- **Flow session lifecycle** - Start/pause/resume/complete flow
- **Week view interactions** - Create/edit/delete time blocks
- **Onboarding completion bug** - Infinite loop on complete page
- **Extension-web sync** - Real-time session status between platforms

### 📋 Planned - Missing Features (See Screen Map Analysis)

**Phase 3 - Flow Sessions:**
- Location Trigger notification screen
- Pre-Work Ritual Checklist modal (before starting flow)

**Phase 4 - Planning:**
- Inbox Management page (process captured items)
- Deadline Breakdown UI (API exists, needs interface)
- Daily Goals dedicated modal/screen
- Commitment Filter feature (align-with-goals checker)

**Phase 5 - Explore Tab:**
- AI Thinking Partner page (API exists, needs UI)
- Meditation/Boredom Training page (standalone in main app)
- Podcasts curation page (weekly suggestions)
- Active Recovery Planner page (evening activities)
- Gym Tracker (workout logging, health sync)

**Phase 6 - Future:**
- Real-time session sync (WebSockets)
- Music integration (Spotify/Apple Music)
- Geofencing location triggers (mobile only)
- Metrics/analytics dashboard (Settings)
- Native mobile apps (iOS/Android)

---

## Common Tasks

### Adding a New Feature
1. **Check alignment** - Does it map to one of the 11 Deep Work methods?
2. **Design API** - Add route in `apps/web/src/app/api/`
3. **Update schema** - Add models in `prisma/schema.prisma`, run migration
4. **Create UI** - Components in appropriate feature folder
5. **Add to store** - Only if global state needed
6. **Update types** - Shared types in `@flowstate/core`
7. **Test manually** - Follow user journey
8. **Document** - Update this file if significant

### Working with Database
```bash
# Generate Prisma client (after schema changes)
cd apps/web
npx prisma generate

# Push schema changes (development)
npx prisma db push

# Create migration (production)
npx prisma migrate dev --name feature_name

# Open Prisma Studio (database GUI)
npx prisma studio

# Seed database with test data
npx prisma db seed
```

### Running Development
```bash
# Install dependencies (first time)
npm install

# Start all apps (web + extension)
npm run dev

# Start specific app only
npm run dev --filter=web
npm run dev --filter=extension

# Build everything for production
npm run build

# Run linter
npm run lint

# Type check
npm run type-check
```

### Chrome Extension Development
```bash
# Build extension
cd apps/extension
npm run build

# Watch mode (rebuilds on change)
npm run watch

# Load in Chrome:
# 1. Open chrome://extensions/
# 2. Enable "Developer mode"
# 3. Click "Load unpacked"
# 4. Select apps/extension/dist/
```

---

## Key Files to Know

### Configuration & Design
- **`DARK_THEME_UI_TRANSFORMATION_BRIEF.md`** - Complete UI design system and implementation guide
- **`claude.md`** - This file - source of truth for development
- `apps/web/tailwind.config.js` - Tailwind theme configuration (Dark Sunrise colors)
- `apps/web/src/app/globals.css` - Global styles, utility classes, component classes
- `apps/web/prisma/schema.prisma` - Database schema (all models)
- `turbo.json` - Turborepo configuration
- `vercel.json` - Vercel deployment config

### Core Application Files
- `apps/web/src/app/today/page.tsx` - **⭐ Today View (PRIMARY SCREEN)**
- `apps/web/src/app/week/page.tsx` - Week View calendar
- `apps/web/src/app/flow/page.tsx` - Active flow session
- `apps/web/src/app/shutdown/page.tsx` - Shutdown ritual
- `apps/web/src/middleware.ts` - Route protection and auth
- `apps/web/src/lib/auth.ts` - NextAuth configuration
- `apps/web/src/lib/prisma.ts` - Prisma client singleton
- `apps/web/src/lib/routes.ts` - Route constants (use these, not hardcoded strings)
- `apps/web/src/components/TodayView.tsx` - Today View component
- `apps/web/src/components/FlowSessionView.tsx` - Flow session UI
- `apps/web/src/store/index.ts` - Main Zustand store

### Chrome Extension Files
- `apps/extension/src/background/service_worker.ts` - Background worker (manages blocking)
- `apps/extension/src/content/content_script.ts` - Content script (injected on blocked sites)
- `apps/extension/src/content/breath_overlay.ts` - Breathing intervention UI
- `apps/extension/src/content/grayscale_filter.ts` - Monochrome mode implementation
- `apps/extension/src/shared/api.ts` - Web app API client
- `apps/extension/manifest.json` - Extension manifest (permissions, scripts)

---

## Environment Variables

Required in `apps/web/.env.local`:
```bash
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/daybreak"

# Auth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-here"

# Google OAuth (optional, for OAuth login)
GOOGLE_CLIENT_ID="your-client-id"
GOOGLE_CLIENT_SECRET="your-client-secret"

# AI Features (optional)
OPENAI_API_KEY="sk-..." # For AI thinking partner, task parsing
# OR
ANTHROPIC_API_KEY="sk-..." # Alternative to OpenAI
```

To generate NEXTAUTH_SECRET:
```bash
openssl rand -base64 32
```

---

## Common Patterns

### API Routes
```typescript
// Standard pattern for protected API routes
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  // 1. Check authentication
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  try {
    // 2. Your logic here
    const data = await prisma.someModel.findMany({
      where: { userId: session.user.id }
    })
    
    // 3. Return success
    return NextResponse.json({ data })
  } catch (error) {
    // 4. Handle errors
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
```

### Database Queries
```typescript
// Always use Prisma client from lib
import { prisma } from '@/lib/prisma'

// Include relations when needed
const user = await prisma.user.findUnique({
  where: { id: session.user.id },
  include: {
    blocks: true,
    dailyGoals: true,
    workLocations: true,
  }
})

// Use transactions for multiple operations
await prisma.$transaction([
  prisma.flowSession.create({ data: sessionData }),
  prisma.timeBlock.update({ where: { id }, data: { completed: true } }),
])
```

### Component Structure
```typescript
// Components should be simple and focused
'use client' // Only if using hooks/interactivity

import { useState } from 'react'
import { motion } from 'framer-motion'

interface ComponentProps {
  prop1: string
  prop2?: number
}

export function ComponentName({ prop1, prop2 = 0 }: ComponentProps) {
  // 1. Hooks at top
  const [state, setState] = useState()
  
  // 2. Event handlers
  const handleClick = () => {
    setState(prev => ...)
  }
  
  // 3. Early returns for loading/error states
  if (!prop1) return null
  
  // 4. Render
  return (
    <motion.div
      className="card p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <h3 className="text-h3 text-text-primary">{prop1}</h3>
      <button className="btn-primary" onClick={handleClick}>
        Click me
      </button>
    </motion.div>
  )
}
```

### Using Zustand Store
```typescript
// Reading state
import { useStore } from '@/store'

function MyComponent() {
  const activeSession = useStore(state => state.activeSession)
  const startFlow = useStore(state => state.startFlow)
  
  // Use selectors to prevent unnecessary re-renders
  return <div>{activeSession?.id}</div>
}
```

### Form Handling with React Hook Form + Zod
```typescript
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const schema = z.object({
  title: z.string().min(1, 'Title required'),
  duration: z.number().min(15).max(240),
})

type FormData = z.infer<typeof schema>

export function MyForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema)
  })
  
  const onSubmit = async (data: FormData) => {
    const res = await fetch('/api/blocks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    // Handle response...
  }
  
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('title')} className="input" />
      {errors.title && <span>{errors.title.message}</span>}
      <button type="submit" className="btn-primary">Submit</button>
    </form>
  )
}
```

---

## Testing Approach

### Manual Testing Checklist
- [ ] User can complete onboarding flow
- [ ] Today View shows current block and goals
- [ ] Can start/pause/resume/complete flow session
- [ ] Week View allows creating/editing time blocks
- [ ] Quick Capture saves to inbox
- [ ] Shutdown ritual locks work apps
- [ ] Extension blocks apps with breathing screen
- [ ] Extension syncs with web app session status
- [ ] Monochrome mode activates during flow
- [ ] Location triggers work (mobile only)

### Tools
- **API Testing:** Postman/Insomnia for API routes
- **Database:** Prisma Studio for data inspection
- **Extension:** Chrome DevTools, check background worker console
- **UI/UX:** Manual flows through each user journey

### Future (When Ready)
- Unit tests with Vitest
- Integration tests with Playwright
- E2E tests for critical flows
- Extension automated testing

---

## Design Review Checklist

Before shipping any feature:
- [ ] Explainable in one sentence
- [ ] Accessible within 2 taps
- [ ] Works on smallest screen size
- [ ] No decision paralysis (clear next action)
- [ ] Completable in <1 minute
- [ ] Follows Dark Sunrise theme
- [ ] Has proper error states
- [ ] Includes loading states
- [ ] Accessible (keyboard nav, screen reader)
- [ ] Maps to one of the 11 Deep Work methods

---

## Legal & Platform Considerations

### Intellectual Property
- **Ideas/functionality can't be copyrighted** - Using similar mechanics (breathing, blocking) is legal
- **Our implementation is original** - Unique combination of features
- **Attribution:** Can say "inspired by Cal Newport's Deep Work" with proper credit

### Platform Compliance
- **Chrome Web Store:** Follow extension policies for blocking, permissions
- **App Store (iOS):** Comply with Screen Time API guidelines
- **Google Play (Android):** Accessibility Service requires justification
- **Privacy:** GDPR/CCPA compliant - user data stays with user, deletable

### Trademark
- Check "Daybreak" availability in USPTO + app stores
- Alternatives if needed: FlowMode, DeepFlow, FocusState

---

## Success Metrics (Future)

**Engagement:**
- 70%+ Daily Active Users
- 2-3 flow sessions/day average
- 80%+ shutdown ritual completion

**Retention:**
- Day 7: 60%
- Day 30: 40%
- Day 90: 25%

**Impact:**
- 4+ focus hours/day
- 2+ hours saved/week (Reality Check data)
- 8+ passive hours replaced/month (Active Recovery)

---

## Remember (Core Philosophy)

- **Simplicity is key** - Every change should be minimal and focused
- **Test as you go** - Don't accumulate untested changes
- **Document decisions** - Add comments for non-obvious choices
- **Follow the philosophy** - If it doesn't help deep work, it doesn't belong
- **Today View is king** - Everything must make sense from there
- **No productivity theater** - Features create real focus, not just feel productive
- **Work with human nature** - Strategic reduction, not elimination
- **Respect user's time** - Max 15 min/day app management
- **Would Cal Newport approve?** - If no, reconsider

---

**This is the source of truth for all Daybreak decisions. When in doubt, refer to core philosophy: seamless daily companion that eliminates decision fatigue and guides users to deep work.**
