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

