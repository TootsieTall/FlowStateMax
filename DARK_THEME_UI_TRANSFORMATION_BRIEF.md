# 🌅 FlowState Daybreak → Dark Sunrise UI Transformation

## Planning Brief for Opus

**Objective**: Transform the entire FlowState Daybreak UI from light golden-hour theme to a sophisticated dark theme with sunrise accents breaking through.

**Visual Concept**: Pre-dawn darkness with the first rays of golden sunrise breaking over the horizon. Think: **dark, warm, and energizing** - like waking up at 5am to tackle deep work.

---

## 🛠 Prerequisites & Installation Verification

### 1. Tailwind CSS

**Check if installed:**
```bash
cd apps/web
grep "tailwindcss" package.json
```

**Expected:** Should see `"tailwindcss": "^3.x.x"` in devDependencies

**If not installed:**
```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

**Verify configuration exists:**
- [ ] `apps/web/tailwind.config.js` exists
- [ ] `apps/web/postcss.config.js` exists
- [ ] `apps/web/src/app/globals.css` has Tailwind directives

### 2. ShadCN UI

**Check if initialized:**
```bash
cd apps/web
ls -la components/ui/
```

**Expected:** Should see UI component files (button.tsx, dialog.tsx, etc.)

**If not initialized:**
```bash
npx shadcn-ui@latest init
```

**Configuration prompts:**
- TypeScript: Yes
- Style: Default
- Base color: Slate (we'll override with custom colors)
- Global CSS: `src/app/globals.css`
- CSS variables: Yes
- Tailwind config: `tailwind.config.js`
- Components: `src/components/ui`
- Utils: `src/lib/utils`
- React Server Components: Yes

**Install required components:**
```bash
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add dropdown-menu
npx shadcn-ui@latest add select
npx shadcn-ui@latest add tooltip
npx shadcn-ui@latest add toast
npx shadcn-ui@latest add switch
```

**Verify installation:**
- [ ] `apps/web/src/components/ui/` directory exists
- [ ] Components have been added
- [ ] `apps/web/src/lib/utils.ts` exists with `cn()` helper

### 3. Framer Motion

**Check if installed:**
```bash
cd apps/web
grep "framer-motion" package.json
```

**Expected:** Should see `"framer-motion": "^10.x.x"` or `"^11.x.x"` in dependencies

**If not installed:**
```bash
npm install framer-motion
```

**Verify installation:**
```bash
npm list framer-motion
```

**Test import:**
Create a test file or check existing components:
```tsx
import { motion } from 'framer-motion'
// Should not show TypeScript errors
```

### 4. Lucide React Icons

**Check if installed:**
```bash
cd apps/web
grep "lucide-react" package.json
```

**Expected:** Should see `"lucide-react": "^0.x.x"` in dependencies

**If not installed:**
```bash
npm install lucide-react
```

**Verify installation:**
```bash
npm list lucide-react
```

**Test import:**
```tsx
import { Sparkles, Calendar, Zap } from 'lucide-react'
// Should not show TypeScript errors
```

### 5. Pre-Transformation Checklist

Before starting the UI transformation, verify:

- [ ] All dependencies installed (`npm install` completed without errors)
- [ ] Development server runs (`npm run dev` works)
- [ ] No TypeScript errors (`npm run type-check` or check IDE)
- [ ] Tailwind compiles correctly (check browser for styles)
- [ ] Can import from `@/components/ui/*` (ShadCN)
- [ ] Can import from `framer-motion`
- [ ] Can import from `lucide-react`

**Quick test component** (create in `apps/web/src/app/test-setup.tsx`):
```tsx
'use client'

import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function TestSetup() {
  return (
    <div className="min-h-screen bg-bg-primary p-8">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-bg-elevated p-6 rounded-lg"
      >
        <h1 className="text-text-primary text-2xl mb-4">Setup Test</h1>
        <Button className="bg-accent-gold text-bg-primary">
          <Sparkles className="w-5 h-5 mr-2" />
          Test Button
        </Button>
      </motion.div>
    </div>
  )
}
```

If this component renders without errors, you're ready to start! 🚀

---

## 🎨 Exact Color Palette (Use These Exact Codes)

```css
/* ================================
   Neutral / Dark Base Colors
   ================================ */
--bg-primary: #0b0b0b;       /* Deep blackish base background */
--bg-secondary: #141414;     /* Slightly lighter for section contrast */
--bg-elevated: #1e1e1e;      /* Used for cards, modals, panels */
--bg-surface: #252525;       /* Slightly lighter surface for overlays */

/* ================================
   Accent / Sunrise Highlights
   ================================ */
--accent-gold: #FFC857;      /* Primary accent for CTAs, highlights */
--accent-orange: #FF8C42;    /* Secondary accent for interactive states */
--accent-warm: #FFB84D;      /* Soft warm tone for subtle glows */

/* ================================
   Text / Typography
   ================================ */
--text-primary: #F5F2ED;     /* Warm off-white for main text */
--text-secondary: #B8B0A8;   /* Muted warm gray for subtext */
--text-tertiary: #6B6560;    /* Dim warm gray for less important text */

/* ================================
   Supporting Elements
   ================================ */
--focus-ring: rgba(255, 184, 77, 0.3);   /* Glow for focus/hover states */
--border-default: #2C2C2C;               /* Card / component borders */
--shadow-glow: 0 0 20px rgba(255, 184, 77, 0.25); /* Ambient sunrise glow */
```

---

## 🛠 Technology Stack Requirements

**MUST USE**:
1. **Tailwind CSS** - All styling via utility classes
2. **ShadCN UI** - For complex interactive components (modals, dropdowns, etc.)
3. **Framer Motion** - All animations and transitions
4. **Lucide Icons** - Consistent iconography throughout

**Design Philosophy**:
- **Minimal but impactful** - Every animation should serve a purpose
- **Smooth and buttery** - 60fps transitions, no jank
- **Delightful micro-interactions** - Hover states, focus rings, button presses
- **Consistent language** - Same animation timing and easing throughout
- **Glows over shadows** - Dark backgrounds need glows, not drop shadows

---

## 🎯 Transformation Scope

### Pages to Transform (Every Single One)

**Onboarding Flow** (9 pages):
1. `/onboarding` - Welcome page
2. `/onboarding/goals` - Focus area selection
3. `/onboarding/integrations` - Calendar/email setup
4. `/onboarding/locations` - Geofencing triggers
5. `/onboarding/apps` - App blocking configuration
6. `/onboarding/ritual` - Pre-work ritual builder
7. `/onboarding/boredom` - Break preferences
8. `/onboarding/recovery` - Active recovery planning
9. `/onboarding/complete` - Success celebration

**Main Application Pages**:
1. `/today` - Daily dashboard (primary view)
2. `/week` - Week planning calendar
3. `/explore` - Optional features showcase
4. `/settings` - User preferences and configuration
5. `/capture` - Quick task capture
6. `/flow` - Active flow session view
7. `/flow/complete` - Post-session feedback
8. `/shutdown` - Evening shutdown ritual

**Auth Pages**:
1. `/` - Landing page
2. `/login` - Sign in
3. `/signup` - Registration

### Components to Transform (Shared UI)
1. **BottomNav** - Navigation bar
2. **QuickCapture** - Task capture modal
3. **SessionChecklist** - Pre-session ritual
4. **TimeBlockCard** - Calendar block display
5. **TaskCard** - Task list item
6. **ConnectAccountPrompt** - OAuth prompt modal

---

## 🎨 Design System Transformation

### Color Application Rules

**Backgrounds (Layering Strategy)**:
```
Page background → --bg-primary (#0b0b0b)
  ↳ Sections → --bg-secondary (#141414)
    ↳ Cards → --bg-elevated (#1e1e1e)
      ↳ Nested surfaces → --bg-surface (#252525)
```

**Text Hierarchy**:
```
Headings/Important → --text-primary (#F5F2ED)
Body text → --text-secondary (#B8B0A8)
Captions/Muted → --text-tertiary (#6B6560)
```

**Accent Usage**:
```
Primary CTAs → --accent-gold (#FFC857)
Hover states → --accent-orange (#FF8C42)
Subtle highlights → --accent-warm (#FFB84D)
Focus rings → rgba(255, 184, 77, 0.3)
```

**Borders & Dividers**:
```
Default borders → --border-default (#2C2C2C)
Highlighted borders → --accent-gold with low opacity
Focus borders → --accent-orange
```

### Shadow System → Glow System

**Replace shadows with glows**:

```css
/* OLD (Light Theme) */
.shadow-warm-md {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

/* NEW (Dark Theme) */
.glow-subtle {
  box-shadow: 
    0 0 10px rgba(255, 184, 77, 0.1),
    0 0 20px rgba(255, 184, 77, 0.05);
}

.glow-medium {
  box-shadow: 
    0 0 15px rgba(255, 184, 77, 0.2),
    0 0 30px rgba(255, 184, 77, 0.1),
    0 4px 6px rgba(0, 0, 0, 0.3);
}

.glow-strong {
  box-shadow: 
    0 0 20px rgba(255, 200, 87, 0.3),
    0 0 40px rgba(255, 200, 87, 0.15),
    0 8px 16px rgba(0, 0, 0, 0.4);
}

.glow-interactive {
  /* For hover states */
  box-shadow: 
    0 0 25px rgba(255, 140, 66, 0.4),
    0 0 50px rgba(255, 140, 66, 0.2),
    0 4px 12px rgba(0, 0, 0, 0.3);
}
```

---

## 💫 Animation & Micro-Interaction Requirements

### Framer Motion Patterns

**Page Transitions**:
```jsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, y: -20 }}
  transition={{ duration: 0.3, ease: 'easeOut' }}
>
  {/* Page content */}
</motion.div>
```

**Card Hover Effects**:
```jsx
<motion.div
  whileHover={{ 
    scale: 1.02, 
    boxShadow: '0 0 25px rgba(255, 184, 77, 0.3)' 
  }}
  transition={{ duration: 0.2 }}
  className="bg-elevated rounded-lg p-6"
>
  {/* Card content */}
</motion.div>
```

**Button Interactions**:
```jsx
<motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
  className="btn-primary"
>
  Start Flow Session
</motion.button>
```

**Icon Bounce** (on hover):
```jsx
<motion.div
  whileHover={{ y: -4 }}
  transition={{ type: 'spring', stiffness: 400 }}
>
  <Sparkles className="w-6 h-6 text-accent-gold" />
</motion.div>
```

**Stagger Children** (for lists):
```jsx
<motion.div
  variants={{
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }}
>
  {items.map((item) => (
    <motion.div
      key={item.id}
      variants={{
        hidden: { opacity: 0, x: -20 },
        show: { opacity: 1, x: 0 }
      }}
    >
      {item.content}
    </motion.div>
  ))}
</motion.div>
```

**Pulse Glow** (for active states):
```jsx
<motion.div
  animate={{
    boxShadow: [
      '0 0 20px rgba(255, 184, 77, 0.3)',
      '0 0 40px rgba(255, 184, 77, 0.5)',
      '0 0 20px rgba(255, 184, 77, 0.3)',
    ]
  }}
  transition={{
    duration: 2,
    repeat: Infinity,
    ease: 'easeInOut'
  }}
>
  {/* Active flow session indicator */}
</motion.div>
```

### Animation Timing Standards

```javascript
// Use these consistently throughout
const transitions = {
  fast: 0.15,      // Quick feedback (button press)
  normal: 0.25,    // Standard transitions (hover, focus)
  slow: 0.4,       // Page transitions, modals
  slower: 0.6      // Hero animations, celebrations
}

const easings = {
  smooth: [0.4, 0, 0.2, 1],           // General purpose
  bounce: [0.68, -0.55, 0.265, 1.55], // Playful interactions
  snap: [0.6, -0.05, 0.01, 0.99]      // Sharp, energetic
}
```

---

## 🧩 Component Style Transformations

### Button System

```jsx
// Primary CTA - Sunrise gradient
<button className="
  bg-gradient-to-r from-accent-gold to-accent-orange
  text-bg-primary font-semibold
  px-6 py-3 rounded-lg
  hover:scale-105 hover:shadow-glow-strong
  active:scale-95
  transition-all duration-200
  focus:outline-none focus:ring-4 focus:ring-focus-ring
">
  Start Flow Session
</button>

// Secondary - Outlined with glow
<button className="
  bg-transparent border-2 border-accent-gold/30
  text-accent-gold font-medium
  px-6 py-3 rounded-lg
  hover:border-accent-gold hover:shadow-glow-subtle
  hover:bg-accent-gold/10
  transition-all duration-200
  focus:outline-none focus:ring-4 focus:ring-focus-ring
">
  Skip
</button>

// Ghost - Subtle hover
<button className="
  bg-transparent text-text-secondary
  px-4 py-2 rounded-lg
  hover:bg-bg-elevated hover:text-text-primary
  transition-all duration-200
">
  Cancel
</button>
```

### Card System

```jsx
// Standard Card
<div className="
  bg-bg-elevated rounded-xl
  border border-border-default
  p-6
  hover:border-accent-gold/20 hover:shadow-glow-subtle
  transition-all duration-300
">
  {/* Content */}
</div>

// Interactive Card (clickable)
<motion.div
  whileHover={{ scale: 1.02, y: -4 }}
  className="
    bg-bg-elevated rounded-xl
    border border-border-default
    p-6 cursor-pointer
    hover:border-accent-gold/40 hover:shadow-glow-medium
    transition-all duration-200
  "
>
  {/* Content */}
</motion.div>

// Elevated Card (modal, important)
<div className="
  bg-bg-surface rounded-2xl
  border border-accent-gold/20
  p-8 shadow-glow-strong
">
  {/* Content */}
</div>
```

### Input System

```jsx
// Text Input
<input
  type="text"
  className="
    w-full bg-bg-elevated
    border border-border-default
    text-text-primary placeholder:text-text-tertiary
    px-4 py-3 rounded-lg
    focus:outline-none focus:border-accent-orange focus:ring-4 focus:ring-focus-ring
    transition-all duration-200
  "
  placeholder="Enter task..."
/>

// Textarea
<textarea
  className="
    w-full bg-bg-elevated
    border border-border-default
    text-text-primary placeholder:text-text-tertiary
    px-4 py-3 rounded-lg
    min-h-[120px] resize-y
    focus:outline-none focus:border-accent-orange focus:ring-4 focus:ring-focus-ring
    transition-all duration-200
  "
  placeholder="Describe your task..."
/>
```

### Badge/Tag System

```jsx
// Success/Complete Badge
<span className="
  inline-flex items-center gap-1.5
  bg-accent-gold/10 border border-accent-gold/30
  text-accent-gold text-sm font-medium
  px-3 py-1 rounded-full
  shadow-glow-subtle
">
  <CheckCircle className="w-4 h-4" />
  Complete
</span>

// Info Badge
<span className="
  inline-flex items-center gap-1.5
  bg-accent-orange/10 border border-accent-orange/30
  text-accent-orange text-sm font-medium
  px-3 py-1 rounded-full
">
  <Clock className="w-4 h-4" />
  Active
</span>

// Muted Badge
<span className="
  inline-flex items-center gap-1.5
  bg-bg-surface border border-border-default
  text-text-secondary text-sm font-medium
  px-3 py-1 rounded-full
">
  <Tag className="w-4 h-4" />
  Deep Work
</span>
```

---

## 🎭 Lucide Icon Usage

**Guidelines**:
- Use consistently sized icons (w-5 h-5 for inline, w-6 h-6 for standalone)
- Apply accent colors to important icons
- Animate icons on hover for interactivity
- Use stroke-width of 2 for consistency

**Common Icons**:
```jsx
import {
  Sparkles,        // Success, completion, magic
  Target,          // Goals, focus
  Calendar,        // Scheduling, time blocks
  Clock,           // Time, duration
  CheckCircle,     // Completion, success
  Circle,          // Empty state, incomplete
  Zap,             // Flow state, energy
  Coffee,          // Breaks, ritual
  Moon,            // Shutdown, evening
  Sun,             // Sunrise theme
  Flame,           // Active session, on fire
  TrendingUp,      // Progress, growth
  MoreVertical,    // Menu, options
  X,               // Close, dismiss
  ChevronRight,    // Navigation, next
  Settings,        // Configuration
  User             // Profile, account
} from 'lucide-react'

// Example usage with animation
<motion.div whileHover={{ rotate: 180 }} transition={{ duration: 0.3 }}>
  <Settings className="w-5 h-5 text-accent-gold" />
</motion.div>
```

---

## 🎬 ShadCN Component Usage

**When to Use ShadCN**:

### 1. Modals/Dialogs
```jsx
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"

<Dialog open={open} onOpenChange={setOpen}>
  <DialogContent className="bg-bg-elevated border-accent-gold/20 shadow-glow-strong">
    <DialogHeader>
      <DialogTitle className="text-text-primary">Create Time Block</DialogTitle>
      <DialogDescription className="text-text-secondary">
        Schedule a deep work session
      </DialogDescription>
    </DialogHeader>
    {/* Form content */}
  </DialogContent>
</Dialog>
```

### 2. Dropdowns
```jsx
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

<DropdownMenu>
  <DropdownMenuTrigger className="text-text-secondary hover:text-text-primary">
    <MoreVertical className="w-5 h-5" />
  </DropdownMenuTrigger>
  <DropdownMenuContent className="bg-bg-surface border-border-default shadow-glow-medium">
    <DropdownMenuItem className="text-text-secondary hover:text-text-primary hover:bg-bg-elevated">
      <Edit className="w-4 h-4 mr-2" />
      Edit
    </DropdownMenuItem>
    <DropdownMenuItem className="text-text-secondary hover:text-text-primary hover:bg-bg-elevated">
      <Trash className="w-4 h-4 mr-2" />
      Delete
    </DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

### 3. Tooltips
```jsx
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

<TooltipProvider>
  <Tooltip>
    <TooltipTrigger>
      <HelpCircle className="w-4 h-4 text-text-tertiary" />
    </TooltipTrigger>
    <TooltipContent className="bg-bg-surface border-accent-gold/20 text-text-primary">
      <p>This helps you maintain deep focus</p>
    </TooltipContent>
  </Tooltip>
</TooltipProvider>
```

### 4. Select (Custom Dropdown)
```jsx
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

<Select value={value} onValueChange={setValue}>
  <SelectTrigger className="bg-bg-elevated border-border-default text-text-primary">
    <SelectValue placeholder="Select block type" />
  </SelectTrigger>
  <SelectContent className="bg-bg-surface border-border-default shadow-glow-medium">
    <SelectItem value="DEEP_WORK" className="text-text-secondary hover:text-text-primary">
      Deep Work
    </SelectItem>
    <SelectItem value="MEETING" className="text-text-secondary hover:text-text-primary">
      Meeting
    </SelectItem>
  </SelectContent>
</Select>
```

### 5. Toast Notifications
```jsx
import { useToast } from "@/components/ui/use-toast"

const { toast } = useToast()

toast({
  title: "Flow session started! 🔥",
  description: "Stay focused. You've got this.",
  className: "bg-bg-elevated border-accent-gold/30 text-text-primary shadow-glow-medium"
})
```

---

## 📐 Layout & Spacing Guidelines

### Container Widths
```jsx
// Full-width (landing page)
<div className="w-full">

// Contained (most pages)
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

// Narrow (onboarding, forms)
<div className="max-w-2xl mx-auto px-4">

// Wide (week view calendar)
<div className="max-w-[1600px] mx-auto px-4">
```

### Spacing Scale
```jsx
// Use Tailwind's spacing scale consistently
gap-2   // 0.5rem - Tight spacing (icon + text)
gap-4   // 1rem - Standard spacing (list items)
gap-6   // 1.5rem - Section spacing (cards in grid)
gap-8   // 2rem - Large spacing (page sections)
gap-12  // 3rem - Hero spacing (major divisions)

// Padding
p-4     // Standard card padding
p-6     // Medium card padding
p-8     // Large card/modal padding
p-12    // Hero section padding
```

### Typography Scale
```jsx
// Headings
text-4xl sm:text-5xl lg:text-6xl font-bold  // Hero heading
text-3xl font-bold                           // Page title (h1)
text-2xl font-semibold                       // Section heading (h2)
text-xl font-semibold                        // Subsection (h3)
text-lg font-medium                          // Card title (h4)

// Body text
text-base text-text-secondary                // Body text
text-sm text-text-secondary                  // Small text
text-xs text-text-tertiary                   // Caption, metadata
```

---

## 🎯 Specific Page Transformation Examples

### 1. Today View (`/today`)

**Key Elements**:
- Hero section with current time block (if active)
- Today's schedule overview
- Quick action buttons
- Upcoming tasks list

**Visual Hierarchy**:
```jsx
<div className="min-h-screen bg-bg-primary">
  {/* Hero - Active Session or Next Block */}
  <div className="bg-gradient-to-br from-bg-secondary via-bg-primary to-bg-secondary">
    <div className="max-w-7xl mx-auto px-6 py-12">
      {activeSession ? (
        <motion.div
          animate={{ boxShadow: ['0 0 30px rgba(255,184,77,0.3)', '0 0 50px rgba(255,184,77,0.5)', '0 0 30px rgba(255,184,77,0.3)'] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="bg-bg-elevated border-2 border-accent-gold/40 rounded-2xl p-8"
        >
          <div className="flex items-center gap-3 mb-4">
            <Flame className="w-8 h-8 text-accent-orange" />
            <h2 className="text-2xl font-bold text-text-primary">Flow Session Active</h2>
          </div>
          {/* Timer, etc */}
        </motion.div>
      ) : (
        // Next block preview
      )}
    </div>
  </div>

  {/* Quick Actions */}
  <div className="max-w-7xl mx-auto px-6 py-8">
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <motion.button whileHover={{ scale: 1.05 }} className="btn-primary">
        <Zap className="w-5 h-5" />
        Start Flow Session
      </motion.button>
      {/* More buttons */}
    </div>
  </div>

  {/* Today's Schedule */}
  <div className="max-w-7xl mx-auto px-6 py-8">
    <h3 className="text-xl font-semibold text-text-primary mb-6">Today's Schedule</h3>
    <div className="space-y-4">
      {blocks.map((block, index) => (
        <motion.div
          key={block.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-bg-elevated border border-border-default rounded-lg p-4"
        >
          {/* Block details */}
        </motion.div>
      ))}
    </div>
  </div>
</div>
```

### 2. Week View (`/week`)

**Key Elements**:
- 7-day calendar grid
- Time blocks displayed in grid
- Drag-to-create functionality
- Color-coded blocks

**Visual Style**:
```jsx
<div className="min-h-screen bg-bg-primary">
  {/* Header */}
  <div className="bg-bg-secondary border-b border-border-default">
    <div className="max-w-[1600px] mx-auto px-6 py-6">
      <h1 className="text-3xl font-bold text-text-primary">Week Planning</h1>
      <p className="text-text-secondary mt-2">Drag to create time blocks</p>
    </div>
  </div>

  {/* Calendar Grid */}
  <div className="max-w-[1600px] mx-auto px-6 py-8">
    <div className="bg-bg-elevated rounded-xl border border-border-default overflow-hidden">
      {/* Days header */}
      <div className="grid grid-cols-7 border-b border-border-default">
        {days.map(day => (
          <div key={day} className="p-4 text-center">
            <div className="text-sm text-text-tertiary">{day.name}</div>
            <div className="text-2xl font-bold text-text-primary">{day.date}</div>
          </div>
        ))}
      </div>

      {/* Time grid */}
      <div className="grid grid-cols-7">
        {/* Grid cells with time blocks */}
        {timeSlots.map(slot => (
          <motion.div
            key={slot.id}
            whileHover={{ backgroundColor: 'rgba(255, 200, 87, 0.05)' }}
            className="h-20 border-r border-b border-border-default/50 cursor-pointer"
          >
            {/* Time block if exists */}
          </motion.div>
        ))}
      </div>
    </div>
  </div>
</div>
```

### 3. Onboarding Complete (`/onboarding/complete`)

**Key Elements**:
- Success celebration
- Summary of what was configured
- CTA to enter app

**Visual Style**:
```jsx
<div className="min-h-screen bg-gradient-to-br from-bg-primary via-bg-secondary to-bg-primary flex items-center justify-center px-4">
  <motion.div
    initial={{ scale: 0.9, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    transition={{ duration: 0.5, ease: 'easeOut' }}
    className="max-w-2xl w-full"
  >
    <div className="bg-bg-elevated rounded-2xl border border-accent-gold/30 p-12 shadow-glow-strong">
      {/* Success Icon with pulse animation */}
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          rotate: [0, 5, -5, 0]
        }}
        transition={{ duration: 0.6 }}
        className="flex justify-center mb-8"
      >
        <div className="bg-gradient-to-br from-accent-gold to-accent-orange rounded-full p-6 shadow-glow-strong">
          <Sparkles className="w-16 h-16 text-bg-primary" />
        </div>
      </motion.div>

      {/* Heading */}
      <h1 className="text-4xl font-bold text-center mb-4">
        <span className="bg-gradient-to-r from-accent-gold to-accent-orange bg-clip-text text-transparent">
          You're All Set!
        </span>
      </h1>
      <p className="text-xl text-text-secondary text-center mb-8">
        Your deep work journey begins now
      </p>

      {/* Summary cards with stagger animation */}
      <motion.div
        variants={{
          hidden: { opacity: 0 },
          show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
          }
        }}
        initial="hidden"
        animate="show"
        className="grid grid-cols-3 gap-4 mb-8"
      >
        {[
          { icon: Target, label: 'Goals Set', value: '3' },
          { icon: Calendar, label: 'Rituals Ready', value: '6' },
          { icon: Zap, label: 'Apps Blocked', value: '5' }
        ].map((item, i) => (
          <motion.div
            key={i}
            variants={{
              hidden: { opacity: 0, y: 20 },
              show: { opacity: 1, y: 0 }
            }}
            className="bg-bg-surface rounded-lg p-4 text-center border border-accent-gold/20"
          >
            <item.icon className="w-8 h-8 text-accent-gold mx-auto mb-2" />
            <div className="text-2xl font-bold text-text-primary">{item.value}</div>
            <div className="text-sm text-text-secondary">{item.label}</div>
          </motion.div>
        ))}
      </motion.div>

      {/* CTA Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="w-full bg-gradient-to-r from-accent-gold to-accent-orange text-bg-primary font-bold text-lg py-4 rounded-lg shadow-glow-strong hover:shadow-glow-interactive transition-all"
      >
        Start Your First Flow Session →
      </motion.button>
    </div>
  </motion.div>
</div>
```

---

## ✨ Special Effects & Flourishes

### 1. Gradient Text
```jsx
<h1 className="text-5xl font-bold bg-gradient-to-r from-accent-gold via-accent-orange to-accent-warm bg-clip-text text-transparent">
  Flow State Achieved
</h1>
```

### 2. Border Glow Effect
```jsx
<div className="relative group">
  {/* Glow border */}
  <div className="absolute -inset-0.5 bg-gradient-to-r from-accent-gold to-accent-orange rounded-lg opacity-0 group-hover:opacity-100 blur transition-all duration-500" />
  
  {/* Content */}
  <div className="relative bg-bg-elevated rounded-lg p-6">
    {/* Card content */}
  </div>
</div>
```

### 3. Loading Shimmer
```jsx
<div className="animate-pulse bg-gradient-to-r from-bg-elevated via-bg-surface to-bg-elevated bg-[length:200%_100%] animate-shimmer h-24 rounded-lg" />

/* Add to tailwind.config.js */
animation: {
  shimmer: 'shimmer 2s infinite linear',
}
keyframes: {
  shimmer: {
    '0%': { backgroundPosition: '-200% 0' },
    '100%': { backgroundPosition: '200% 0' },
  }
}
```

### 4. Success Celebration
```jsx
<motion.div
  initial={{ scale: 0 }}
  animate={{ scale: 1 }}
  transition={{
    type: 'spring',
    stiffness: 260,
    damping: 20
  }}
>
  <motion.div
    animate={{
      rotate: [0, 10, -10, 10, 0],
      scale: [1, 1.1, 1.1, 1.1, 1]
    }}
    transition={{
      duration: 0.6,
      times: [0, 0.2, 0.4, 0.6, 1]
    }}
  >
    <CheckCircle className="w-16 h-16 text-accent-gold" />
  </motion.div>
</motion.div>
```

### 5. Focus Ring Pulse
```jsx
<motion.div
  animate={{
    boxShadow: [
      '0 0 0 0 rgba(255, 184, 77, 0.4)',
      '0 0 0 8px rgba(255, 184, 77, 0)',
    ]
  }}
  transition={{
    duration: 1.5,
    repeat: Infinity,
    ease: 'easeOut'
  }}
  className="rounded-lg"
>
  {/* Active element */}
</motion.div>
```

---

## 📋 Execution Checklist for Sonnet

### Pre-Work: Dependencies Installation ✅

**MUST COMPLETE FIRST:**

1. **Verify all dependencies are installed:**
```bash
cd apps/web

# Check installations
npm list tailwindcss framer-motion lucide-react

# Install if missing
npm install framer-motion lucide-react
npm install -D tailwindcss postcss autoprefixer
```

2. **Initialize ShadCN UI (if not already):**
```bash
npx shadcn-ui@latest init

# Install required components
npx shadcn-ui@latest add dialog dropdown-menu select tooltip toast switch
```

3. **Verify imports work:**
- [ ] Can import `motion` from `framer-motion`
- [ ] Can import icons from `lucide-react`
- [ ] Can import components from `@/components/ui/*`
- [ ] Tailwind classes compile correctly

4. **Test setup:**
- [ ] Run `npm run dev` - server starts without errors
- [ ] No TypeScript errors in IDE
- [ ] Can see Tailwind styles in browser

### Step 1: Tailwind Configuration (`apps/web/tailwind.config.js`)

**Update the `extend` section with these EXACT colors:**

```javascript
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // EXACT COLOR PALETTE - DO NOT MODIFY
        'bg-primary': '#0b0b0b',
        'bg-secondary': '#141414',
        'bg-elevated': '#1e1e1e',
        'bg-surface': '#252525',
        
        'accent-gold': '#FFC857',
        'accent-orange': '#FF8C42',
        'accent-warm': '#FFB84D',
        
        'text-primary': '#F5F2ED',
        'text-secondary': '#B8B0A8',
        'text-tertiary': '#6B6560',
        
        'border-default': '#2C2C2C',
      },
      boxShadow: {
        'glow-subtle': '0 0 10px rgba(255, 184, 77, 0.1), 0 0 20px rgba(255, 184, 77, 0.05)',
        'glow-medium': '0 0 15px rgba(255, 184, 77, 0.2), 0 0 30px rgba(255, 184, 77, 0.1), 0 4px 6px rgba(0, 0, 0, 0.3)',
        'glow-strong': '0 0 20px rgba(255, 200, 87, 0.3), 0 0 40px rgba(255, 200, 87, 0.15), 0 8px 16px rgba(0, 0, 0, 0.4)',
        'glow-interactive': '0 0 25px rgba(255, 140, 66, 0.4), 0 0 50px rgba(255, 140, 66, 0.2), 0 4px 12px rgba(0, 0, 0, 0.3)',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        shimmer: 'shimmer 2s infinite linear',
      },
    },
  },
  plugins: [],
}
```

**Verification:**
- [ ] Config file saved
- [ ] Run `npm run dev` - no Tailwind errors
- [ ] Test in browser: `<div className="bg-bg-primary">` should show dark background

### Step 2: Global Styles (`apps/web/src/app/globals.css`)

**Add to the TOP of the file:**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* ================================
   DARK SUNRISE THEME
   CSS Custom Properties
   ================================ */

:root {
  /* Neutral / Dark Base Colors */
  --bg-primary: #0b0b0b;       /* Deep blackish base background */
  --bg-secondary: #141414;     /* Slightly lighter for section contrast */
  --bg-elevated: #1e1e1e;      /* Used for cards, modals, panels */
  --bg-surface: #252525;       /* Slightly lighter surface for overlays */

  /* Accent / Sunrise Highlights */
  --accent-gold: #FFC857;      /* Primary accent for CTAs, highlights */
  --accent-orange: #FF8C42;    /* Secondary accent for interactive states */
  --accent-warm: #FFB84D;      /* Soft warm tone for subtle glows */

  /* Text / Typography */
  --text-primary: #F5F2ED;     /* Warm off-white for main text */
  --text-secondary: #B8B0A8;   /* Muted warm gray for subtext */
  --text-tertiary: #6B6560;    /* Dim warm gray for less important text */

  /* Supporting Elements */
  --focus-ring: rgba(255, 184, 77, 0.3);   /* Glow for focus/hover states */
  --border-default: #2C2C2C;               /* Card / component borders */
  --shadow-glow: 0 0 20px rgba(255, 184, 77, 0.25); /* Ambient sunrise glow */
}

@layer base {
  body {
    @apply bg-bg-primary text-text-primary antialiased;
  }
}

@layer components {
  /* Button Components */
  .btn-primary {
    @apply bg-gradient-to-r from-accent-gold to-accent-orange;
    @apply text-bg-primary font-semibold px-6 py-3 rounded-lg;
    @apply hover:scale-105 hover:shadow-glow-strong;
    @apply active:scale-95 transition-all duration-200;
    @apply focus:outline-none focus:ring-4;
    box-shadow: 0 0 0 0 var(--focus-ring);
  }
  
  .btn-primary:focus {
    box-shadow: 0 0 0 4px var(--focus-ring);
  }

  .btn-secondary {
    @apply bg-transparent border-2;
    border-color: rgba(255, 200, 87, 0.3);
    @apply text-accent-gold font-medium px-6 py-3 rounded-lg;
    @apply hover:border-accent-gold hover:shadow-glow-subtle;
    @apply hover:bg-accent-gold/10 transition-all duration-200;
  }

  .btn-ghost {
    @apply bg-transparent text-text-secondary px-4 py-2 rounded-lg;
    @apply hover:bg-bg-elevated hover:text-text-primary;
    @apply transition-all duration-200;
  }

  /* Card Components */
  .card {
    @apply bg-bg-elevated rounded-xl p-6;
    border: 1px solid var(--border-default);
    @apply hover:border-accent-gold/20 hover:shadow-glow-subtle;
    @apply transition-all duration-300;
  }

  .card-elevated {
    @apply bg-bg-surface rounded-2xl p-8;
    border: 1px solid rgba(255, 200, 87, 0.2);
    @apply shadow-glow-strong;
  }

  /* Input Components */
  .input {
    @apply w-full bg-bg-elevated px-4 py-3 rounded-lg;
    border: 1px solid var(--border-default);
    @apply text-text-primary placeholder:text-text-tertiary;
    @apply focus:outline-none focus:border-accent-orange;
    @apply transition-all duration-200;
  }
  
  .input:focus {
    box-shadow: 0 0 0 4px var(--focus-ring);
  }
}
```

**Verification:**
- [ ] File saved
- [ ] Browser shows dark background
- [ ] Text is readable (light on dark)
- [ ] No CSS errors in console

### Step 3: Verify Setup Before Transforming Components

**Create a test page to verify everything works:**

File: `apps/web/src/app/theme-test/page.tsx`

```tsx
'use client'

import { motion } from 'framer-motion'
import { Sparkles, Zap, Calendar } from 'lucide-react'

export default function ThemeTest() {
  return (
    <div className="min-h-screen bg-bg-primary p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold text-text-primary">
          Dark Theme Test Page
        </h1>

        {/* Color Swatches */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-text-primary">Colors</h2>
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-bg-primary h-20 rounded-lg border border-border-default flex items-center justify-center text-text-secondary text-sm">
              bg-primary
            </div>
            <div className="bg-bg-elevated h-20 rounded-lg border border-border-default flex items-center justify-center text-text-secondary text-sm">
              bg-elevated
            </div>
            <div className="bg-accent-gold h-20 rounded-lg flex items-center justify-center text-bg-primary text-sm font-bold">
              accent-gold
            </div>
            <div className="bg-accent-orange h-20 rounded-lg flex items-center justify-center text-bg-primary text-sm font-bold">
              accent-orange
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-text-primary">Buttons</h2>
          <div className="flex gap-4">
            <button className="btn-primary">
              Primary Button
            </button>
            <button className="btn-secondary">
              Secondary Button
            </button>
            <button className="btn-ghost">
              Ghost Button
            </button>
          </div>
        </div>

        {/* Cards */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-text-primary">Cards</h2>
          <div className="card">
            <h3 className="text-lg font-semibold text-text-primary mb-2">Standard Card</h3>
            <p className="text-text-secondary">This is a standard card with default styling.</p>
          </div>
          <div className="card-elevated">
            <h3 className="text-lg font-semibold text-text-primary mb-2">Elevated Card</h3>
            <p className="text-text-secondary">This card has a stronger glow effect.</p>
          </div>
        </div>

        {/* Framer Motion Test */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-text-primary">Animations (Framer Motion)</h2>
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="card cursor-pointer"
          >
            <p className="text-text-secondary">Hover me for scale animation</p>
          </motion.div>
        </div>

        {/* Icons Test */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-text-primary">Icons (Lucide)</h2>
          <div className="flex gap-6">
            <Sparkles className="w-8 h-8 text-accent-gold" />
            <Zap className="w-8 h-8 text-accent-orange" />
            <Calendar className="w-8 h-8 text-accent-warm" />
          </div>
        </div>

        {/* Inputs */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-text-primary">Form Inputs</h2>
          <input 
            type="text" 
            className="input" 
            placeholder="Type something..."
          />
        </div>
      </div>
    </div>
  )
}
```

**Test this page:**
1. Navigate to `http://localhost:3000/theme-test`
2. Verify all elements display correctly
3. Check colors match the palette
4. Test hover states and animations
5. Ensure no console errors

**If everything works, you're ready to transform components!** ✅

---

### Component-by-Component Transformation

**Onboarding Pages** (9 files):
- [ ] `/onboarding/page.tsx`
- [ ] `/onboarding/goals/page.tsx`
- [ ] `/onboarding/integrations/page.tsx`
- [ ] `/onboarding/locations/page.tsx`
- [ ] `/onboarding/apps/page.tsx`
- [ ] `/onboarding/ritual/page.tsx`
- [ ] `/onboarding/boredom/page.tsx`
- [ ] `/onboarding/recovery/page.tsx`
- [ ] `/onboarding/complete/page.tsx`

**Main App Pages** (8 files):
- [ ] `/today/page.tsx`
- [ ] `/week/page.tsx`
- [ ] `/explore/page.tsx`
- [ ] `/settings/page.tsx`
- [ ] `/capture/page.tsx`
- [ ] `/flow/page.tsx`
- [ ] `/flow/complete/page.tsx`
- [ ] `/shutdown/page.tsx`

**Auth Pages** (3 files):
- [ ] `/page.tsx` (landing)
- [ ] `/login/page.tsx`
- [ ] `/signup/page.tsx`

**Shared Components** (6 files):
- [ ] `components/BottomNav.tsx`
- [ ] `components/QuickCapture.tsx`
- [ ] `components/SessionChecklist.tsx`
- [ ] `components/TimeBlockCard.tsx` (if exists)
- [ ] `components/TaskCard.tsx` (if exists)
- [ ] `components/ConnectAccountPrompt.tsx` (if exists)

### Quality Assurance
- [ ] All pages use exact color palette
- [ ] All animations are smooth (60fps)
- [ ] All hover states provide feedback
- [ ] Focus states are accessible
- [ ] Text contrast meets WCAG AA
- [ ] No console errors
- [ ] Mobile responsive
- [ ] Dark theme consistent throughout

---

## 🎯 Success Criteria

**Visual Excellence**:
- ✅ Dark backgrounds create sophisticated, professional aesthetic
- ✅ Sunrise accents (gold/orange) pop beautifully against dark
- ✅ All text is easily readable with proper contrast
- ✅ Glows replace shadows effectively on dark background
- ✅ No harsh white or jarring colors

**Animation Quality**:
- ✅ Every interaction feels smooth and intentional
- ✅ Page transitions are buttery (60fps)
- ✅ Hover effects provide instant feedback
- ✅ Loading states are delightful
- ✅ Celebrations feel rewarding

**Consistency**:
- ✅ Same color palette used everywhere
- ✅ Same animation timing throughout
- ✅ Same component styling patterns
- ✅ Same spacing scale applied
- ✅ Same icon sizes and styles

**Technical Quality**:
- ✅ Tailwind utilities used (no inline styles)
- ✅ Framer Motion for all animations
- ✅ ShadCN for complex components
- ✅ Lucide icons throughout
- ✅ No console errors or warnings

---

## 💡 Tips for Implementation

1. **Start with config files** (tailwind.config.js, globals.css) before touching components
2. **Transform one page at a time** - easier to test and debug
3. **Test on different screen sizes** as you go
4. **Use design tokens** (CSS variables) instead of hardcoded values
5. **Preview in browser** frequently to catch visual issues early
6. **Copy-paste patterns** once you have them working well
7. **Don't overthink** - follow the examples provided closely

---

## 📚 Reference

**Color Palette Source**: This brief (top section)  
**Existing Design System**: `/Users/authoydas/Desktop/FlowStateMax/claude.md`  
**Current Components**: `/Users/authoydas/Desktop/FlowStateMax/apps/web/src/`  

---

**Created**: October 14, 2025  
**For**: UI Transformation (Dark Sunrise Theme)  
**Estimated Effort**: 2-3 days of focused work  
**Priority**: High - this sets the visual foundation for the entire app

Let's make this app look absolutely stunning! 🌅✨

