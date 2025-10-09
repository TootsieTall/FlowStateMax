# ✅ Onboarding Flow - Navigation Verified

## Complete Onboarding Journey (8 Steps)

### Step 1: Welcome & Name Entry
- **Route**: `/onboarding`
- **Step Label**: No step label (entry point)
- **Purpose**: Collect user's name
- **Next**: `/onboarding/goals`
- **Status**: ✅ Working

---

### Step 2: Focus Areas
- **Route**: `/onboarding/goals`
- **Step Label**: STEP 2 OF 8
- **Purpose**: Select focus areas (Writing, Research, Coding, etc.)
- **Next**: `/onboarding/integrations`
- **Can Skip**: No (must select at least one)
- **Status**: ✅ Working

---

### Step 3: Calendar & Email Integration 🆕
- **Route**: `/onboarding/integrations`
- **Step Label**: STEP 3 OF 8
- **Purpose**: Connect calendar and work/school email
- **Options**:
  - **Calendar**: Google Calendar, Outlook Calendar, Apple Calendar
  - **Email**: Gmail/Google Workspace, Outlook/Microsoft 365
- **Next**: `/onboarding/locations`
- **Can Skip**: ✅ Yes ("Skip for now" button)
- **Status**: ✅ Working
- **Storage**: Saves to `localStorage`:
  - `flowstate_calendar_integration`
  - `flowstate_email_integration`

---

### Step 4: Work Locations
- **Route**: `/onboarding/locations`
- **Step Label**: STEP 4 OF 8
- **Purpose**: Define work locations (manual or GPS-based)
- **Features**:
  - Manual location entry
  - GPS capture with adjustable radius
  - Edit/remove locations
- **Next**: `/onboarding/apps`
- **Can Skip**: ✅ Yes
- **Status**: ✅ Working
- **Storage**: `flowstate_work_locations`

---

### Step 5: App Blocking
- **Route**: `/onboarding/apps`
- **Step Label**: STEP 5 OF 8
- **Purpose**: Select apps to block during deep work
- **Pre-selected Apps**: Instagram, Twitter, Facebook, TikTok, Reddit, YouTube
- **Next**: `/onboarding/ritual`
- **Can Skip**: ✅ Yes
- **Status**: ✅ Working
- **Storage**: `flowstate_blocked_apps`

---

### Step 6: Flow Ritual
- **Route**: `/onboarding/ritual`
- **Step Label**: STEP 6 OF 8
- **Purpose**: Build pre-work routine
- **Default Items**:
  - Put phone in another room
  - Close unnecessary browser tabs
  - Grab water/coffee
  - Set workspace temperature
  - Review today's intention
- **Next**: `/onboarding/boredom`
- **Can Skip**: ✅ Yes
- **Status**: ✅ Working
- **Storage**: `flowstate_ritual_items`

---

### Step 7: Boredom Resistance
- **Route**: `/onboarding/boredom`
- **Step Label**: STEP 7 OF 8
- **Purpose**: Configure downtime handling
- **Options**:
  1. Embrace it (Cal Newport's method)
  2. Productive breaks
  3. Minimal intervention
- **Next**: `/onboarding/recovery`
- **Can Skip**: ✅ Yes
- **Status**: ✅ Working
- **Storage**: `flowstate_boredom_preference`

---

### Step 8: Active Recovery
- **Route**: `/onboarding/recovery`
- **Step Label**: STEP 8 OF 8
- **Purpose**: Plan recovery activities
- **Features**:
  - Select recovery activities (Gym, Running, Sports, Social, Reading, Hobbies)
  - Add custom activities
  - Choose tracking preference
  - **NEW**: Add hobbies to try (for periodic reminders)
- **Next**: `/onboarding/complete`
- **Can Skip**: ✅ Yes
- **Status**: ✅ Working
- **Storage**: 
  - `flowstate_recovery_activities`
  - `flowstate_track_recovery`
  - `flowstate_hobbies_to_try`

---

### Step 9: Completion
- **Route**: `/onboarding/complete`
- **Purpose**: Celebrate completion and redirect to dashboard
- **Next**: `/today`
- **Status**: ✅ Working

---

## Navigation Flow Diagram

```
/onboarding (Welcome)
    ↓
/onboarding/goals (Step 2 of 8)
    ↓
/onboarding/integrations (Step 3 of 8) ⭐ NEW
    ↓
/onboarding/locations (Step 4 of 8)
    ↓
/onboarding/apps (Step 5 of 8)
    ↓
/onboarding/ritual (Step 6 of 8)
    ↓
/onboarding/boredom (Step 7 of 8)
    ↓
/onboarding/recovery (Step 8 of 8)
    ↓
/onboarding/complete
    ↓
/today (Main Dashboard)
```

---

## Data Collection Summary

By the end of onboarding, the following data is stored in `localStorage`:

1. **User Info**: Name (via NextAuth session)
2. **Goals**: Selected focus areas
3. **Integrations**: Calendar & email preferences ⭐ NEW
4. **Locations**: Work zones with GPS coordinates
5. **Apps**: Blocked applications list
6. **Ritual**: Pre-work checklist items
7. **Boredom**: Downtime handling preference
8. **Recovery**: Activities and hobbies to try

---

## Testing Checklist

- [x] Step 1: Name entry works
- [x] Step 2: Goals page shows "STEP 2 OF 8"
- [x] Step 3: Integrations page accessible at `/onboarding/integrations`
- [x] Step 3: Shows Google, Outlook, Apple options
- [x] Step 3: Can skip integration setup
- [x] Step 3: Navigation to locations works
- [x] Step 4: Locations page shows "STEP 4 OF 8"
- [x] Step 5: Apps page shows "STEP 5 OF 8"
- [x] Step 6: Ritual page shows "STEP 6 OF 8"
- [x] Step 7: Boredom page shows "STEP 7 OF 8"
- [x] Step 8: Recovery page shows "STEP 8 OF 8"
- [x] Final: Complete page works
- [x] All navigation arrows point to correct next step

---

## Future Enhancements

For the integrations page, when backend is ready:

### Google Calendar Integration
```typescript
// API endpoint to initiate OAuth
POST /api/integrations/google/calendar

// Redirect to Google OAuth
// Store refresh token in database
// Fetch calendar events
GET /api/calendar/events
```

### Email Integration
```typescript
// Connect email for meeting analysis
POST /api/integrations/google/gmail
POST /api/integrations/outlook/mail

// Analyze meeting invites
GET /api/meetings/analyze
```

---

## ✅ Verification Complete

**Date**: October 8, 2025
**All Steps**: 8/8 pages working
**Navigation**: All transitions verified
**Step Numbers**: Correctly labeled 2-8
**New Feature**: Calendar & Email integration page added
**Status**: Ready for user testing 🚀

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

# Location-Based Deep Work System

## Overview
The FlowState location system helps users maintain focus by tracking their work zones and integrating location verification into the deep work session workflow.

## Components

### 1. **Work Locations Storage**
- Locations are saved to `localStorage` (will migrate to database when backend is ready)
- Storage key: `flowstate_work_locations`
- Each location includes:
  - `id`: Unique identifier
  - `name`: Location name (e.g., "Home Office", "Library")
  - `latitude` & `longitude`: Optional GPS coordinates
  - `radius`: Detection radius in feet (default: 50ft, range: 25-500ft)

### 2. **Location Entry Points**

#### Onboarding (`/onboarding/locations`)
- Users can add locations during initial setup
- Two methods:
  - **Manual Entry**: Type location name (honor system)
  - **GPS Location**: Capture current coordinates with geolocation API
- Adjustable detection radius per location
- Skip option available

#### Settings (Future)
- Manage locations after onboarding
- Add/edit/remove locations
- Update detection radius

### 3. **Session Integration**

#### The Workflow:
1. **User clicks "Start Flow Session"** in TodayView
2. **SessionChecklist modal appears** with:
   - Location verification (auto-detects if in saved zone)
   - Pre-session checklist (environment, tools, mindset)
   - Duration selection (15 min - 4 hours)
   - Optional goal input

3. **Location Options:**
   - 🌍 **Work from anywhere** (no location required) ✅
   - 📍 **Saved locations** (from onboarding)
   - ✏️ **Custom location** (one-time entry)

4. **Session data includes:**
   ```typescript
   {
     location: string,           // Selected location name
     locationVerified: boolean,   // True if GPS verified
     duration: number,           // Minutes
     goal?: string,             // Optional
     checklist: {
       location: boolean,
       environment: boolean,
       tools: boolean,
       mindset: boolean
     }
   }
   ```

### 4. **Location Detection**

#### How It Works:
1. When SessionChecklist opens, it automatically checks current location
2. Uses browser Geolocation API to get user's coordinates
3. Calculates distance to each saved location
4. If within radius → marks location as verified
5. Pre-selects the matching location

#### Distance Calculation:
- Uses Haversine formula
- Calculates great-circle distance between two GPS points
- Converts to feet (Earth's radius: 20,902,231 feet)
- Compares to location's radius setting

#### User Experience:
- ✅ **In saved zone**: Green banner shows "You're in [Location]!"
- 📍 **Location marked as current** in the selection list
- 🔍 **Can re-check location** with button click
- 🌍 **Can work anywhere** without location requirement

### 5. **Key Features**

#### Non-Restrictive Design:
- ✅ Locations are **optional** (not required)
- ✅ Can always select "Work from anywhere"
- ✅ Can work outside saved locations
- ✅ Honor system for manual locations
- ✅ GPS detection is helpful, not mandatory

#### Future Enhancements:
- Geofencing notifications when entering work zones
- "Ready to start working?" prompt on location entry
- Historical analytics (most productive locations)
- Weather-aware suggestions
- Shared work zones (for teams)

## Code Structure

### Hook: `useWorkLocations`
```typescript
// Location management hook
const {
  locations,           // Array of saved locations
  currentLocation,     // Current detected location or null
  isLoading,          // Loading state
  checkCurrentLocation, // Async function to detect location
  saveLocation,        // Add new location
  removeLocation,      // Delete location
  updateLocation,      // Modify location
} = useWorkLocations()
```

### Component: `SessionChecklist`
```typescript
// Pre-session preparation component
<SessionChecklist
  onComplete={(sessionData) => {
    // Start session with location data
  }}
  onSkip={() => {
    // Skip checklist
  }}
/>
```

### Component: `TodayView` (Integration Example)
```typescript
// Shows how locations integrate into workflow
const handleSessionComplete = async (sessionData: SessionData) => {
  await fetch('/api/sessions', {
    method: 'POST',
    body: JSON.stringify({
      blockId: currentBlock.id,
      location: sessionData.location,
      locationVerified: sessionData.locationVerified,
      checklist: sessionData.checklist,
      // ... other data
    })
  })
}
```

## User Flow Examples

### Scenario 1: User in Saved Location
1. User is at "Home Office" (GPS tracked)
2. Clicks "Start Flow Session"
3. System detects location automatically
4. Shows: ✅ "You're in Home Office!"
5. Location checklist item auto-checked
6. User completes other checklist items
7. Starts session with verified location

### Scenario 2: User Working From Anywhere
1. User is at a café (not a saved location)
2. Clicks "Start Flow Session"
3. Selects "🌍 Work from anywhere"
4. No location verification needed
5. Completes required checklist items
6. Starts session successfully

### Scenario 3: User at New Location
1. User is at library (not saved yet)
2. Clicks "Start Flow Session"
3. Selects "✏️ Other location"
4. Types "University Library"
5. Can save for future or use once
6. Starts session

## Data Flow

```
Onboarding → localStorage → useWorkLocations hook
                                     ↓
                          SessionChecklist component
                                     ↓
                          Geolocation API check
                                     ↓
                          Session data with location
                                     ↓
                          API endpoint (/api/sessions)
                                     ↓
                          Database (future)
```

## Privacy & Permissions

- GPS coordinates stored locally only
- Geolocation requires user permission
- Permission denial handled gracefully
- Can use app without GPS features
- No location tracking when app is closed
- User controls all location data

## Technical Notes

### Browser Compatibility:
- Geolocation API: All modern browsers
- localStorage: All browsers
- Position timeout: 5 seconds
- Error handling for permission denied

### Performance:
- Location check is async (non-blocking)
- Uses local storage for instant access
- GPS check only on user action
- No background tracking

### Security:
- No server-side location storage yet
- GPS coords stay in browser
- User can delete locations anytime
- No third-party location services

## Future Roadmap

1. **Phase 1** (Current): Manual + GPS location tracking ✅
2. **Phase 2**: Geofencing notifications
3. **Phase 3**: Database persistence
4. **Phase 4**: Location-based analytics
5. **Phase 5**: Multi-device sync
6. **Phase 6**: Team/shared locations

---

**Built with focus on user privacy and flexibility** 🎯

