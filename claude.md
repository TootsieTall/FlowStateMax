# FlowState - Claude Development Guidelines

## Project Overview

**FlowState** is an advanced productivity application implementing Cal Newport's Deep Work methodology as a complete daily operating system. It's designed to be more than just another note-taking or task management tool - it's a comprehensive productivity companion that guides users through their entire day from wake-up to shutdown.

The app combines:
- Location-based flow triggers with geofencing
- Smart app blocking with breathing interventions
- Visual planning with drag-drop time blocking
- AI-powered task management and deadline breakdown
- Structured daily rituals (morning, pre-work, shutdown)
- Active recovery planning and gym tracking
- Boredom training with meditation and AI thinking partner

## Tech Stack

### Frontend (Web App)
- **Framework:** Next.js 14 with App Router
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion
- **UI Components:** Custom component library (@flowstate/ui)
- **State Management:** Zustand (global state) + React Query (server state)
- **Forms:** React Hook Form with Zod validation
- **Date Handling:** date-fns

### Backend (Currently)
- **API:** Next.js API Routes
- **Database:** PostgreSQL with Prisma ORM
- **Authentication:** NextAuth.js with Google OAuth
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

### Monorepo Structure
- **Tool:** Turborepo with npm workspaces
- **Packages:**
  - `@flowstate/core` - Shared types, constants, validators
  - `@flowstate/ui` - Shared UI components
  - `@flowstate/server` - Server utilities (future)

## File Organization

```
FlowStateMax/
├── apps/
│   ├── web/                      # Main Next.js application
│   │   ├── src/
│   │   │   ├── app/              # App Router pages & API routes
│   │   │   │   ├── (auth)/       # Auth pages (login, register)
│   │   │   │   ├── (main)/       # Main app pages (protected)
│   │   │   │   ├── onboarding/   # Onboarding flow
│   │   │   │   └── api/          # API routes
│   │   │   ├── components/       # React components
│   │   │   │   ├── layout/       # Layout components (Nav, Footer)
│   │   │   │   ├── features/     # Feature-specific components
│   │   │   │   └── ui/           # Base UI components
│   │   │   ├── hooks/            # Custom React hooks
│   │   │   ├── lib/              # Utilities
│   │   │   │   ├── auth.ts       # NextAuth config
│   │   │   │   ├── prisma.ts     # Prisma client
│   │   │   │   └── ai/           # AI integrations
│   │   │   ├── store/            # Zustand stores
│   │   │   │   ├── index.ts      # Main app store
│   │   │   │   └── onboarding.ts # Onboarding store
│   │   │   └── types/            # TypeScript type definitions
│   │   └── prisma/
│   │       ├── schema.prisma     # Database schema
│   │       └── seed.ts           # Database seeder
│   └── extension/                # Chrome extension
│       ├── src/
│       │   ├── background/       # Service worker
│       │   ├── content/          # Content scripts
│       │   └── popup/            # Extension popup
│       └── manifest.json         # Extension manifest
├── packages/
│   ├── core/                     # Shared business logic
│   ├── ui/                       # Shared UI components
│   └── server/                   # Server utilities
└── docs/                         # Documentation
```

## State Management

### Global State (Zustand)
Located in `apps/web/src/store/`:
- **Main Store (`index.ts`)**: Session state, user preferences, active flow session
- **Onboarding Store (`onboarding.ts`)**: Multi-step onboarding flow state
- **Pattern:** Slices for different features, combined into single store

### Server State (React Query)
- **Queries:** Fetching user data, blocks, sessions
- **Mutations:** Creating/updating/deleting resources
- **Cache:** Automatic caching with smart invalidation

### Local State (React State)
- Component-specific UI state
- Form state (with React Hook Form)
- Temporary interaction state

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

## Design Principles

1. **Minimal Friction:** Every feature must be accessible within 2 taps
2. **One Primary Screen:** Today View is the hub - everything flows from there
3. **Progressive Disclosure:** Advanced features hidden until needed
4. **Metrics Hidden by Default:** Focus on doing, not tracking
5. **Native Feel:** Should feel like a built-in OS feature
6. **Respect User Time:** Max 15 min/day management overhead

## UI Component Guidelines (Daybreak Theme)

### Design System Overview
- **Theme:** Daybreak - Golden hour aesthetic with warm creams, sunset oranges, and golden yellows
- **Approach:** Hybrid - Utility classes for simple components, ShadCN for complex interactions
- **Philosophy:** Keep it simple unless complexity adds real value

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
  <h3 className="text-h3 text-bark-500">Card Title</h3>
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

**When to use:** Form modals, confirmations, detail views, settings panels

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

**When to use:** Context menus, action buttons with multiple options, user profile menus

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

**When to use:** Need custom styling, search/filter, or better mobile UX than native `<select>`

#### 🎯 **Tooltips** - For hover information
```tsx
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"

<Tooltip>
  <TooltipTrigger>?</TooltipTrigger>
  <TooltipContent>Helpful explanation</TooltipContent>
</Tooltip>
```

**When to use:** Icons need explanation, abbreviated text, help hints

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

**When to use:** Color pickers, date pickers, filters, contextual forms

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

**When to use:** Quick actions, keyboard shortcuts, search functionality

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

### Color Palette Reference (Daybreak Theme)

```tsx
// Backgrounds
bg-dawn-100          // Primary page background (warm cream)
bg-dawn-200          // Secondary/elevated surfaces
bg-white             // Cards and forms

// Text
text-bark-500        // Primary text (deep warm brown)
text-bark-400        // Secondary text
text-bark-300        // Muted text
text-bark-200        // Tertiary/disabled text

// Accents
text-sunset-500      // Primary actions (sunset orange)
text-gold-400        // Success/completion (golden)
text-sand-400        // Calm actions (sandy)

// Borders
border-border-light  // Subtle borders
border-border        // Standard borders

// Shadows
shadow-warm-sm       // Subtle cards
shadow-warm-md       // Standard elevation
shadow-warm-lg       // Prominent cards
shadow-glow-gold     // Success states
shadow-glow-sunset   // Active/focus states
```

### Component Class Reference

```css
/* Buttons */
.btn-primary         // Sunset gradient, main actions
.btn-secondary       // White with border, secondary actions
.btn-ghost           // Transparent, tertiary actions
.btn-success         // Golden, completion states

/* Cards */
.card                // Standard white card
.card-elevated       // More prominent shadow
.card-interactive    // Hover lift effect

/* Forms */
.input               // Text inputs with warm focus rings
.textarea            // Multi-line text input
.select              // Basic select (use ShadCN for complex)

/* Effects */
.hover-lift          // Translate up on hover
.text-gradient-sunset // Gradient text for headings
.text-gradient-gold  // Golden gradient text
.animate-bounce-in   // Entrance animation
.animate-icon-bounce // Icon hover effect
.completion-shine    // Success animation
```

### Practical Examples by Feature

#### Creating a Time Block
```tsx
// Simple card with utility classes
<div className="card-interactive group">
  <div className="flex items-center justify-between">
    <h3 className="text-h4 text-bark-500">Deep Work</h3>
    
    {/* Action menu - use ShadCN */}
    <DropdownMenu>
      <DropdownMenuTrigger>
        <MoreVertical className="w-4 h-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>Edit</DropdownMenuItem>
        <DropdownMenuItem>Delete</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  </div>
</div>
```

#### Settings Panel
```tsx
// Toggle setting - use Switch
<div className="card p-6">
  <div className="flex items-center justify-between">
    <div>
      <h4 className="text-body font-medium text-bark-500">Dark Mode</h4>
      <p className="text-body-sm text-bark-300">Toggle dark theme</p>
    </div>
    <Switch checked={darkMode} onCheckedChange={setDarkMode} />
  </div>
</div>
```

#### Form with Validation
```tsx
// Simple inputs, Dialog for modal
<Dialog open={open} onOpenChange={setOpen}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Create Time Block</DialogTitle>
    </DialogHeader>
    
    {/* Use utility classes for form */}
    <div className="space-y-4">
      <input className="input" placeholder="Block title..." />
      <textarea className="textarea" placeholder="Description..." />
      <button className="btn-primary w-full">Create Block</button>
    </div>
  </DialogContent>
</Dialog>
```

### Additional ShadCN Components to Install (As Needed)

When you need these, install from ShadCN:
- `Switch` - Better toggles
- `AlertDialog` - Better than window.confirm()
- `Tabs` - Tabbed interfaces
- `Accordion` - Collapsible sections
- `Toast` - Notifications
- `Checkbox` - Better checkboxes
- `RadioGroup` - Radio button groups
- `Slider` - Range inputs
- `Progress` - Progress bars
- `Avatar` - User avatars

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
- ✅ Focus indicators (sunset-400 ring)
- ✅ Color contrast (WCAG AA)
- ✅ Screen reader support

ShadCN components handle most of this automatically - another reason to use them for complex patterns.

## Current Implementation Status

### ✅ Completed
- Monorepo setup with Turborepo
- Next.js 14 app with TypeScript
- Prisma database schema
- Authentication with NextAuth
- Today View dashboard
- Week View calendar
- Basic UI components
- Chrome extension (full implementation)
- Database seeding

### 🚧 In Progress
- Complete onboarding flow
- Settings pages
- Explore tab features
- Shutdown ritual
- Quick capture with AI
- Mobile responsiveness

### 📋 Planned
- Real-time session sync
- Music integration (Spotify/Apple)
- Geofencing triggers
- Podcast curation
- Metrics dashboard
- Mobile apps

## Common Tasks

### Adding a New Feature
1. Check if it aligns with core philosophy
2. Design API in `apps/web/src/app/api/`
3. Add database schema in `prisma/schema.prisma`
4. Create UI components in appropriate folder
5. Add to store if needed
6. Update types in `@flowstate/core`

### Working with Database
```bash
# Generate Prisma client
cd apps/web
npx prisma generate

# Push schema changes
npx prisma db push

# Open Prisma Studio
npx prisma studio

# Seed database
npx prisma db seed
```

### Running Development
```bash
# Install dependencies
npm install

# Start all apps
npm run dev

# Start specific app
npm run dev --filter=web

# Build everything
npm run build

# Lint
npm run lint
```

## Key Files to Know

- `apps/web/src/app/(main)/today/page.tsx` - Today View (main screen)
- `apps/web/src/app/(main)/week/page.tsx` - Week View calendar
- `apps/web/src/store/index.ts` - Main app state
- `apps/web/prisma/schema.prisma` - Database schema
- `apps/web/src/lib/auth.ts` - Authentication config
- `apps/web/src/components/` - All UI components

## Environment Variables

Required in `apps/web/.env.local`:
```
DATABASE_URL=
NEXTAUTH_URL=
NEXTAUTH_SECRET=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
OPENAI_API_KEY= (optional)
```

## Testing Approach

- Manual testing for UI/UX flows
- API route testing with Postman/Insomnia
- Database queries tested in Prisma Studio
- Chrome extension tested in browser

## Common Patterns

### API Routes
```typescript
// Standard pattern for API routes
export async function GET(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  // Your logic here
  
  return NextResponse.json({ data })
}
```

### Database Queries
```typescript
// Always use Prisma client from lib
import { prisma } from '@/lib/prisma'

const user = await prisma.user.findUnique({
  where: { id: session.user.id },
  include: { blocks: true }
})
```

### Component Structure
```typescript
// Components should be simple and focused
export function ComponentName({ prop1, prop2 }: Props) {
  // Hooks at top
  const [state, setState] = useState()
  
  // Event handlers
  const handleClick = () => {}
  
  // Render
  return <div>...</div>
}
```

## Remember

- **Simplicity is key** - Every change should be minimal
- **Test as you go** - Don't accumulate untested changes
- **Document decisions** - Add comments for non-obvious choices
- **Follow the philosophy** - If it doesn't help deep work, it doesn't belong
