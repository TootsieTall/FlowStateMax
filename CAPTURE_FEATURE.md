# 📝 Quick Capture Feature - Complete Implementation

> **AI-powered task capture system for FlowState**

The Quick Capture feature allows users to instantly capture thoughts, tasks, and ideas using natural language, with AI automatically parsing intent and suggesting time blocks.

---

## ✨ Features

### 1. **Quick Capture Modal**
- **Global Access**: Available anywhere via `⌘K` (Mac) or `Ctrl+K` (Windows/Linux)
- **Natural Language Input**: Type naturally - AI understands context
- **Smart Parsing**: Automatically detects:
  - Task type (task, note, or scheduled item)
  - Deadlines ("by Friday", "next week")
  - Scheduled times ("tomorrow at 2pm")
  - Priority/impact level
- **Real-time Suggestions**: AI shows what it understands as you type
- **One-Click Capture**: Instant save to database

### 2. **AI-Powered Intent Parsing**
The system understands natural language and extracts:
- **Title**: Concise task name
- **Deadline**: From phrases like "by Friday", "due next week"
- **Scheduled Time**: For calendar events
- **Impact Level**: HIGH for urgent/important, LOW for nice-to-haves
- **Suggested Breakdown**: For large tasks that need multiple time blocks

### 3. **Deadline Breakdown**
For tasks with deadlines, AI automatically:
- Breaks down large tasks into 3-5 focused work blocks
- Suggests realistic durations (1-4 hours)
- Schedules blocks with buffer time
- Creates actual TimeBlock entries in the database

### 4. **Capture Page**
Full-featured task management at `/capture`:
- View all captured items
- Filter by status (all/active/completed)
- Sort by recent, deadline, or impact
- Search functionality
- Toggle completion status
- Delete items
- Stats dashboard

### 5. **AI Brainstorm Partner**
Interactive AI assistant for:
- Problem-solving
- Creative brainstorming
- Task planning
- Decision-making
- Deep work strategies

---

## 🏗️ Implementation Details

### Components

#### `QuickCapture.tsx`
Location: `/apps/web/src/components/QuickCapture.tsx`

**Features:**
- Modal overlay with backdrop
- Auto-focus input on open
- Debounced AI parsing (800ms)
- Type selection (task/note/schedule)
- AI suggestion display
- Loading states
- Keyboard shortcuts

**Usage:**
```tsx
import QuickCapture from '@/components/QuickCapture';

// Component is globally available via layout
// Trigger with: toggleQuickCapture() from useAppStore
```

#### `QuickCaptureWrapper.tsx`
Location: `/apps/web/src/components/QuickCaptureWrapper.tsx`

Simple wrapper to use QuickCapture in Server Components.

### API Routes

#### 1. `/api/quick-capture` (POST)
**Purpose**: Create captured items

**Request:**
```json
{
  "text": "Finish project proposal by Friday",
  "type": "task" | "note" | "schedule"
}
```

**Response:**
```json
{
  "success": true,
  "task": {
    "id": "abc123",
    "title": "Finish project proposal",
    "deadline": "2024-10-13T00:00:00.000Z",
    "impact": "HIGH"
  }
}
```

**Features:**
- Auto-calls parse-intent API
- Creates Task or TimeBlock
- Optionally triggers deadline breakdown

#### 2. `/api/quick-capture` (GET)
**Purpose**: Fetch recent captures

**Response:**
```json
{
  "success": true,
  "items": [...]
}
```

#### 3. `/api/ai/parse-intent` (POST)
**Purpose**: Parse natural language into structured data

**Request:**
```json
{
  "text": "Call Mom tomorrow at 2pm"
}
```

**Response:**
```json
{
  "type": "schedule",
  "title": "Call Mom",
  "scheduledAt": "2024-10-10T14:00:00.000Z",
  "impact": "LOW"
}
```

**Parsing Logic:**
- Uses AI when available
- Falls back to regex-based parsing
- Handles:
  - Days of week ("Monday", "Friday")
  - Relative dates ("tomorrow", "next week")
  - Time expressions ("2pm", "14:00")
  - Deadlines ("by Friday", "due Monday")
  - Impact keywords ("urgent", "important")

#### 4. `/api/ai/deadline-breakdown` (POST)
**Purpose**: Break large tasks into time blocks

**Request:**
```json
{
  "taskId": "task_123",
  "deadline": "2024-10-20T00:00:00.000Z"
}
```

**Response:**
```json
{
  "success": true,
  "blocks": [
    {
      "id": "block_1",
      "title": "Research & Planning",
      "startTime": "2024-10-10T09:00:00.000Z",
      "endTime": "2024-10-10T11:00:00.000Z",
      "type": "DEEP_WORK"
    }
  ],
  "reasoning": "Balanced breakdown with research, execution, and review phases"
}
```

**Strategy:**
- Research/Planning phase
- Main execution blocks
- Review/Polish phase
- Buffer time before deadline
- Realistic 1-4 hour blocks

#### 5. `/api/ai/brainstorm` (POST)
**Purpose**: Interactive AI thinking partner

**Request:**
```json
{
  "prompt": "How should I structure my research project?",
  "context": "Working on AI ethics paper",
  "conversationHistory": [
    {"role": "user", "content": "..."},
    {"role": "assistant", "content": "..."}
  ]
}
```

**Response:**
```json
{
  "success": true,
  "response": "I'd suggest breaking your AI ethics research into...",
  "timestamp": "2024-10-09T..."
}
```

#### 6. `/api/ai/brainstorm` (GET)
**Purpose**: Get suggested prompts

**Response:**
```json
{
  "success": true,
  "prompts": [
    {
      "category": "Problem Solving",
      "prompts": ["I'm stuck on...", "How would you..."]
    }
  ]
}
```

### Pages

#### `/capture` - Capture Management Page
Location: `/apps/web/src/app/capture/page.tsx`

**Features:**
- Stats dashboard (total, active, completed, high impact)
- Search functionality
- Filters (all/active/completed)
- Sort options (recent/deadline/impact)
- Item cards with metadata
- Toggle completion
- Delete items
- Responsive design
- Empty state with CTA

---

## 🎯 User Flows

### Flow 1: Quick Task Capture
1. User presses `⌘K` anywhere in app
2. Modal opens with focused input
3. User types: "Write blog post by Friday"
4. AI shows suggestion:
   - Type: Task
   - Title: Write blog post
   - Deadline: October 13, 2024
   - Impact: LOW
5. User clicks "Capture"
6. Task created in database
7. Modal closes
8. Success!

### Flow 2: Scheduled Event
1. User clicks floating capture button
2. Types: "Team standup tomorrow at 10am"
3. AI suggests:
   - Type: Schedule
   - Title: Team standup
   - Scheduled: October 10, 2024 at 10:00 AM
4. User confirms
5. TimeBlock created
6. Shows on calendar

### Flow 3: Project with Deadline
1. User captures: "Complete website redesign by next Friday"
2. AI detects large task with deadline
3. System asks: "Break down into blocks?"
4. User confirms
5. AI creates 5 time blocks:
   - Research & Requirements (2h)
   - Design Mockups (3h)
   - Development (4h)
   - Testing & Polish (2h)
   - Final Review (1h)
6. Blocks appear in week view

### Flow 4: Browse Captures
1. User navigates to `/capture`
2. Sees all captured items
3. Filters to "Active" tasks
4. Sorts by "Deadline"
5. Completes a task
6. Stats update in real-time

---

## 🔧 Integration Points

### Store Integration
The QuickCapture component uses Zustand store:

```typescript
import { useAppStore } from '@/store';

const { quickCaptureOpen, toggleQuickCapture } = useAppStore();

// Open modal
toggleQuickCapture();
```

### Database Schema
Uses existing Prisma models:
- **Task**: For tasks and notes
- **TimeBlock**: For scheduled items and deadline breakdowns

### AI Integration
Configurable AI provider in `/lib/ai.ts`:
- Mock responses (default)
- OpenAI (when configured)
- Claude (when configured)

Set environment variable:
```bash
ENABLE_AI_FEATURES=true
AI_PROVIDER=openai  # or 'claude' or 'mock'
OPENAI_API_KEY=sk-...
```

---

## 🎨 UI/UX Details

### Design System
- **Colors**: Indigo primary, teal accents
- **Animations**: Smooth fades, slides, scales
- **Typography**: Clear hierarchy
- **Spacing**: Consistent 4px grid
- **Dark mode**: Full support

### Keyboard Shortcuts
- `⌘K` / `Ctrl+K`: Open Quick Capture
- `Escape`: Close modal
- `Enter`: Submit (in forms)

### Accessibility
- Focus management
- Keyboard navigation
- ARIA labels
- Screen reader support
- High contrast mode

---

## 📊 Examples

### Example 1: Basic Task
**Input**: `Buy groceries`

**Parsed**:
```json
{
  "type": "task",
  "title": "Buy groceries",
  "impact": "LOW"
}
```

### Example 2: Deadline Task
**Input**: `Finish quarterly report by Friday 5pm`

**Parsed**:
```json
{
  "type": "task",
  "title": "Finish quarterly report",
  "deadline": "2024-10-13T17:00:00.000Z",
  "impact": "HIGH"
}
```

### Example 3: Scheduled Meeting
**Input**: `Client call tomorrow at 2:30pm`

**Parsed**:
```json
{
  "type": "schedule",
  "title": "Client call",
  "scheduledAt": "2024-10-10T14:30:00.000Z"
}
```

### Example 4: Large Project
**Input**: `Build mobile app MVP by end of month`

**Parsed**:
```json
{
  "type": "task",
  "title": "Build mobile app MVP",
  "deadline": "2024-10-31T23:59:59.000Z",
  "impact": "HIGH",
  "suggestedBlocks": [
    { "title": "Requirements & Design", "duration": "3h", "day": "Monday" },
    { "title": "Core Features Development", "duration": "4h", "day": "Wednesday" },
    { "title": "UI Implementation", "duration": "3h", "day": "Friday" },
    { "title": "Testing & Bug Fixes", "duration": "2h", "day": "Next Monday" },
    { "title": "Final Polish", "duration": "2h", "day": "Next Wednesday" }
  ]
}
```

---

## 🚀 Future Enhancements

### Phase 1: Core Improvements
- [ ] Voice input support
- [ ] Recurring task creation
- [ ] Tags and categories
- [ ] Custom templates

### Phase 2: Advanced AI
- [ ] Context-aware suggestions
- [ ] Learning from user patterns
- [ ] Smart scheduling optimization
- [ ] Dependency detection

### Phase 3: Collaboration
- [ ] Share captures with team
- [ ] Collaborative brainstorming
- [ ] Task delegation
- [ ] Progress sharing

### Phase 4: Integrations
- [ ] Email-to-capture (forward emails)
- [ ] Slack integration
- [ ] Browser extension quick capture
- [ ] Mobile app capture

---

## 🧪 Testing

### Manual Testing Checklist
- [x] ⌘K opens modal
- [x] Natural language parsing works
- [x] AI suggestions display correctly
- [x] Tasks are created in database
- [x] Deadline breakdown creates time blocks
- [x] Capture page displays items
- [x] Filters and search work
- [x] Completion toggle works
- [x] Delete functionality works
- [x] Keyboard shortcuts work
- [x] Mobile responsive

### Test Cases

**Test 1: Simple Task**
```
Input: "Buy milk"
Expected: Task created with title "Buy milk", impact LOW
```

**Test 2: Deadline Parsing**
```
Input: "Submit taxes by April 15"
Expected: Task with deadline 2024-04-15
```

**Test 3: Time Parsing**
```
Input: "Dentist appointment tomorrow at 3pm"
Expected: TimeBlock at tomorrow 15:00
```

**Test 4: Impact Detection**
```
Input: "URGENT: Fix production bug"
Expected: Task with impact HIGH
```

---

## 📝 Notes

### Implementation Decisions

1. **Why debounce AI parsing?**
   - Prevents excessive API calls
   - Better UX (not too jumpy)
   - 800ms is sweet spot

2. **Why separate capture page?**
   - Dedicated space for task management
   - Better organization
   - Doesn't clutter main views

3. **Why Zustand for state?**
   - Simple, performant
   - Global state without context
   - Already used in app

4. **Why fallback parsing?**
   - Works without AI API
   - Faster response
   - Reliability

### Known Limitations

1. **AI parsing accuracy**: Depends on AI model quality
2. **Date parsing**: Limited to common phrases
3. **No undo**: Deletions are permanent (for now)
4. **No offline support**: Requires internet connection

---

## 🎓 Code Quality

### TypeScript
- Full type safety
- Proper interfaces
- No `any` types

### Performance
- Debounced API calls
- Optimistic updates
- Lazy loading where appropriate

### Error Handling
- Comprehensive try-catch
- User-friendly error messages
- Graceful degradation

### Accessibility
- Semantic HTML
- ARIA attributes
- Keyboard navigation
- Focus management

---

## 📚 Related Documentation

- [Project Instructions](./README.md)
- [Features Overview](./FEATURES.md)
- [API Documentation](./apps/web/src/app/api/)
- [Database Schema](./apps/web/prisma/schema.prisma)

---

**Built with 💙 for deep workers who need to capture fast and work focused**

---

## Quick Reference

| Feature | Shortcut | Location |
|---------|----------|----------|
| Open Quick Capture | `⌘K` or `Ctrl+K` | Anywhere |
| Close Modal | `Escape` | In modal |
| View All Captures | Click nav link | `/capture` |
| Floating Button | Click | Bottom right of pages |

| API Endpoint | Method | Purpose |
|--------------|--------|---------|
| `/api/quick-capture` | POST | Create item |
| `/api/quick-capture` | GET | List items |
| `/api/ai/parse-intent` | POST | Parse natural language |
| `/api/ai/deadline-breakdown` | POST | Break down task |
| `/api/ai/brainstorm` | POST | AI thinking partner |
| `/api/ai/brainstorm` | GET | Get prompts |


