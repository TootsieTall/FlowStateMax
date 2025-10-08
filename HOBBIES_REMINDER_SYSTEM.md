# Hobbies Reminder System

## Overview
The hobbies-to-try feature allows users to list activities they've always wanted to explore. The system will periodically suggest these hobbies during recovery time to encourage users to try new things and expand their interests.

## Data Storage

### Current Implementation
During onboarding, hobbies are stored in `localStorage`:
```javascript
localStorage.setItem('flowstate_hobbies_to_try', JSON.stringify(hobbiesToTry))
```

Example data structure:
```json
[
  "Learn guitar",
  "Rock climbing", 
  "Photography",
  "Pottery",
  "Learn Spanish"
]
```

### Future Database Schema
When implementing the backend API, create a `HobbyToTry` model:

```prisma
model HobbyToTry {
  id          String   @id @default(cuid())
  userId      String
  user        User     @relation(fields: [userId], references: [id])
  hobby       String
  addedAt     DateTime @default(now())
  triedAt     DateTime?
  completed   Boolean  @default(false)
  notes       String?
  
  @@index([userId])
}
```

## Reminder Logic

### When to Show Reminders

1. **During Break Time**
   - Between deep work sessions
   - During scheduled recovery periods
   - After completing a flow session

2. **Weekly Digest**
   - Sunday evening: "This week, try exploring [hobby]"
   - Friday afternoon: "Weekend approaching - time to try [hobby]?"

3. **Low Energy Periods**
   - When user reports feeling burned out
   - After long work streaks
   - During vacation/time-off periods

### Reminder Frequency
- Show maximum 1 hobby reminder per day
- Rotate through the list (don't repeat until all have been suggested)
- Mark hobbies as "tried" when user confirms
- Reset rotation monthly to re-surface old suggestions

### Reminder UI Components

#### 1. Modal Popup (Low Priority)
```
┌────────────────────────────────────┐
│  ✨ Try Something New              │
│                                    │
│  How about: Learn Guitar           │
│                                    │
│  [I'll try it] [Maybe later] [✓]  │
└────────────────────────────────────┘
```

#### 2. Dashboard Widget
```
┌────────────────────────────────┐
│ 🎨 Hobby Suggestions           │
│                                │
│ • Learn guitar                 │
│ • Rock climbing                │
│ • Photography                  │
│                                │
│ [Pick one for today →]         │
└────────────────────────────────┘
```

#### 3. Push Notification (Extension)
```
FlowState: Weekend's here! 🎸
Time to try learning guitar?
```

## Implementation Phases

### Phase 1: Storage & Display ✅
- [x] Onboarding page with hobby input
- [x] Save to localStorage
- [x] Basic UI with tags

### Phase 2: Backend Integration
- [ ] Create database model
- [ ] API endpoints (GET, POST, PUT, DELETE)
- [ ] Migrate localStorage data to DB on first login
- [ ] User settings for reminder frequency

### Phase 3: Reminder System
- [ ] Reminder scheduling logic
- [ ] Dashboard widget showing suggestions
- [ ] Mark hobbies as "tried" or "completed"
- [ ] Track which hobbies have been suggested

### Phase 4: Enhanced Features
- [ ] Browser extension notifications
- [ ] Email digest option
- [ ] Share progress with friends
- [ ] Hobby categories and filters
- [ ] Community hobby suggestions

## API Endpoints (Future)

```typescript
// Get user's hobbies to try
GET /api/hobbies

// Add new hobby
POST /api/hobbies
Body: { hobby: string }

// Mark hobby as tried
PUT /api/hobbies/:id/tried
Body: { notes?: string }

// Mark hobby as completed
PUT /api/hobbies/:id/completed

// Delete hobby
DELETE /api/hobbies/:id

// Get today's suggested hobby
GET /api/hobbies/suggestion
```

## Reminder Algorithm

```typescript
function getHobbyReminder(user: User): Hobby | null {
  // Don't show if user disabled reminders
  if (!user.settings.hobbyReminders) return null;
  
  // Don't show if already shown today
  if (wasShownToday(user.id)) return null;
  
  // Get hobbies that haven't been suggested recently
  const hobbies = getUntriedHobbies(user.id);
  
  if (hobbies.length === 0) {
    // All hobbies tried, reset suggestions
    resetSuggestions(user.id);
    return getRandomHobby(user.id);
  }
  
  // Return least recently suggested hobby
  return hobbies[0];
}
```

## User Settings

Allow users to configure:
- Enable/disable hobby reminders
- Reminder frequency (daily, weekly, monthly)
- Preferred reminder times
- Reminder channels (email, push, in-app)

## Analytics to Track

- How many hobbies users add
- How many hobbies get marked as "tried"
- Completion rates
- Average time from adding to trying
- Most popular hobby categories

## Notes

- Keep reminders gentle and non-intrusive
- Focus on encouragement, not pressure
- Allow users to easily dismiss or snooze
- Celebrate when users try new things
- Consider gamification (badges for trying X hobbies)

