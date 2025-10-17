# Phase 7: Complete Settings & Integration Infrastructure

## Overview

Make every aspect of the Settings tab functional with database persistence, add optional integration infrastructure (no real functionality yet, just connection/storage), and enable users to manage all their preferences and data.

## Architecture & Routing Structure

### Frontend Routing

All settings functionality remains on a single page with client-side state management:

- **Main Route**: `/settings` - Single page with expandable sections
- **No sub-routes**: Avoid `/settings/profile`, `/settings/locations` etc.
- **Deep-linking support**: Use URL hash fragments for direct section access
  - `/settings#profile`
  - `/settings#locations`
  - `/settings#blocked-apps`
  - `/settings#ritual`
  - `/settings#integrations`
  - `/settings#notifications`

### API Route Organization

Follow RESTful conventions and Next.js App Router patterns:

```
apps/web/src/app/api/
├── user/
│   └── profile/
│       └── route.ts              # GET, PATCH /api/user/profile
├── settings/
│   ├── locations/
│   │   ├── route.ts              # GET, POST /api/settings/locations
│   │   └── [id]/
│   │       └── route.ts          # PATCH, DELETE /api/settings/locations/[id]
│   ├── blocked-apps/
│   │   ├── route.ts              # GET, POST /api/settings/blocked-apps
│   │   └── [id]/
│   │       └── route.ts          # PATCH, DELETE /api/settings/blocked-apps/[id]
│   ├── ritual/
│   │   ├── route.ts              # GET, POST /api/settings/ritual
│   │   ├── [id]/
│   │   │   └── route.ts          # PATCH, DELETE /api/settings/ritual/[id]
│   │   └── reorder/
│   │       └── route.ts          # PUT /api/settings/ritual/reorder
│   ├── notifications/
│   │   └── route.ts              # GET, PATCH /api/settings/notifications
│   ├── integrations/
│   │   ├── route.ts              # GET /api/settings/integrations
│   │   └── [provider]/
│   │       └── route.ts          # DELETE /api/settings/integrations/[provider]
│   └── account/
│       └── delete/
│           └── route.ts          # DELETE /api/settings/account/delete
└── integrations/
    ├── google-calendar/
    │   ├── auth/
    │   │   └── route.ts          # GET /api/integrations/google-calendar/auth (redirect to OAuth)
    │   └── callback/
    │       └── route.ts          # GET /api/integrations/google-calendar/callback
    ├── gmail/
    │   ├── auth/
    │   │   └── route.ts          # GET /api/integrations/gmail/auth
    │   └── callback/
    │       └── route.ts          # GET /api/integrations/gmail/callback
    ├── canvas/
    │   └── route.ts              # POST /api/integrations/canvas (API key validation)
    ├── spotify/
    │   ├── auth/
    │   │   └── route.ts          # GET /api/integrations/spotify/auth
    │   └── callback/
    │       └── route.ts          # GET /api/integrations/spotify/callback
    └── apple-music/
        ├── auth/
        │   └── route.ts          # GET /api/integrations/apple-music/auth
        └── callback/
            └── route.ts          # GET /api/integrations/apple-music/callback
```

### Best Practices

#### 1. API Route Patterns

- **Collection routes** (`/api/settings/locations`): GET (list), POST (create)
- **Item routes** (`/api/settings/locations/[id]`): PATCH (update), DELETE (remove)
- **Special actions** (`/api/settings/ritual/reorder`): PUT with custom logic
- **OAuth flows**: Separate `/auth` (initiate) and `/callback` (handle) routes

#### 2. Request/Response Standards

- **Success responses**: Always return JSON with meaningful data
  ```typescript
  { success: true, data: {...}, message?: "Operation successful" }
  ```

- **Error responses**: Consistent error structure
  ```typescript
  { error: true, message: "User-friendly message", code?: "ERROR_CODE" }
  ```

- **Status codes**: 
  - 200 (success), 201 (created)
  - 400 (bad request), 401 (unauthorized), 404 (not found)
  - 500 (server error)

#### 3. Authentication Middleware

All settings and integration APIs require authentication:

```typescript
const session = await getServerSession(authOptions)
if (!session?.user) {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
}
```

#### 4. Data Validation

Use Zod schemas for request validation:

**File**: `apps/web/src/lib/validators/settings.ts`

```typescript
import { z } from 'zod'

export const locationSchema = z.object({
  name: z.string().min(1).max(100),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  radius: z.number().min(10).max(5000), // meters
  enabled: z.boolean().optional()
})

export const blockedAppSchema = z.object({
  name: z.string().min(1).max(100),
  identifier: z.string().min(1),
  domain: z.string().optional(),
  category: z.string().optional(),
  enabled: z.boolean().optional()
})

export const ritualItemSchema = z.object({
  text: z.string().min(1).max(200)
})

export const notificationPreferencesSchema = z.object({
  locationAlerts: z.boolean(),
  sessionAlerts: z.boolean(),
  integrationSync: z.boolean(),
  dailyPrompts: z.boolean(),
  streakTracking: z.boolean()
})

export const profileUpdateSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  image: z.string().url().optional()
})
```

#### 5. OAuth Callback Security

- **State parameter**: Generate and verify CSRF token
- **Error handling**: Catch OAuth errors gracefully
- **Redirect logic**: Return to settings page with status message

#### 6. Settings Page State Management

Use React hooks for client-side state:

- `useState` for local UI state (expanded sections, edit modes)
- `useEffect` for data fetching on mount
- **Optimistic updates**: Update UI immediately, rollback on error
- **Debouncing**: For real-time updates (e.g., name editing)

#### 7. Navigation Flow

- Settings accessible from bottom nav and user menu
- After OAuth callback, redirect to `/settings#integrations` with toast message
- Account deletion redirects to `/login` with goodbye message
- Cancel actions stay on current section (no navigation)

#### 8. Error Boundaries

Wrap settings sections in error boundaries to prevent full page crashes:

**File**: `apps/web/src/components/settings/SettingsSectionErrorBoundary.tsx`

### Component Architecture

```
apps/web/src/components/settings/
├── ExpandableSection.tsx         # Reusable accordion wrapper
├── SettingsSectionErrorBoundary.tsx
├── profile/
│   └── ProfileEditor.tsx         # Profile section content
├── locations/
│   ├── LocationsList.tsx
│   ├── LocationItem.tsx
│   └── AddLocationModal.tsx
├── blocked-apps/
│   ├── BlockedAppsList.tsx
│   ├── BlockedAppItem.tsx
│   └── AddBlockedAppModal.tsx
├── ritual/
│   ├── RitualList.tsx
│   ├── RitualItem.tsx
│   └── AddRitualItemForm.tsx
├── integrations/
│   ├── IntegrationsList.tsx
│   ├── IntegrationCard.tsx
│   └── CanvasApiKeyForm.tsx
├── notifications/
│   └── NotificationPreferences.tsx
└── account/
    └── DeleteAccountModal.tsx
```

### Routes Configuration

**File**: `apps/web/src/lib/routes.ts`

Update to include settings hash routes:

```typescript
const ROUTES = {
  // ... existing routes
  SETTINGS: {
    ROOT: '/settings',
    PROFILE: '/settings#profile',
    LOCATIONS: '/settings#locations',
    BLOCKED_APPS: '/settings#blocked-apps',
    RITUAL: '/settings#ritual',
    INTEGRATIONS: '/settings#integrations',
    NOTIFICATIONS: '/settings#notifications',
    DANGER_ZONE: '/settings#danger-zone'
  },
  // Integration OAuth routes
  INTEGRATIONS: {
    GOOGLE_CALENDAR_AUTH: '/api/integrations/google-calendar/auth',
    GMAIL_AUTH: '/api/integrations/gmail/auth',
    SPOTIFY_AUTH: '/api/integrations/spotify/auth',
    APPLE_MUSIC_AUTH: '/api/integrations/apple-music/auth',
  }
}
```

## Database Schema Updates

### 1. Create Integration Table

Add new `Integration` model to `schema.prisma`:

```prisma
model Integration {
  id                String   @id @default(cuid())
  userId            String
  provider          String   // "google_calendar", "gmail", "canvas", "spotify", "apple_music"
  providerAccountId String?
  accessToken       String?  @db.Text
  refreshToken      String?  @db.Text
  expiresAt         Int?
  scope             String?
  isActive          Boolean  @default(true)
  metadata          Json?    // Store additional provider-specific data
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
  
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@unique([userId, provider])
  @@index([userId])
}
```

### 2. Create NotificationPreferences Table

```prisma
model NotificationPreferences {
  id                    String   @id @default(cuid())
  userId                String   @unique
  locationAlerts        Boolean  @default(true)
  sessionAlerts         Boolean  @default(true)
  integrationSync       Boolean  @default(true)
  dailyPrompts          Boolean  @default(true)
  streakTracking        Boolean  @default(true)
  createdAt             DateTime @default(now())
  updatedAt             DateTime @updatedAt
  
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

### 3. Update User Model

Add relation to User model:

```prisma
integrations              Integration[]
notificationPreferences   NotificationPreferences?
```

**Files**: `apps/web/prisma/schema.prisma`

## API Endpoints

### Profile Management

**File**: `apps/web/src/app/api/user/profile/route.ts`

- `GET`: Fetch user profile (name, email, image)
- `PATCH`: Update user profile
- `POST`: Upload profile image (future enhancement)

### Locations CRUD

**File**: `apps/web/src/app/api/settings/locations/route.ts`

- `GET`: List all user locations
- `POST`: Create new location
- `PATCH`: Update location (name, coordinates, radius, enabled status)
- `DELETE`: Remove location by ID

### Blocked Apps CRUD

**File**: `apps/web/src/app/api/settings/blocked-apps/route.ts`

- `GET`: List all blocked apps
- `POST`: Add blocked app
- `PATCH`: Update blocked app (name, identifier, enabled status)
- `DELETE`: Remove blocked app by ID

### Ritual CRUD

**File**: `apps/web/src/app/api/settings/ritual/route.ts`

- Extend existing `apps/web/src/app/api/onboarding/ritual/route.ts`
- Add `PATCH`: Update individual ritual item
- Add `DELETE`: Remove ritual item by ID
- Add `PUT`: Reorder ritual items

### Integrations Manager

**File**: `apps/web/src/app/api/settings/integrations/route.ts`

- `GET`: List all user integrations with connection status
- `POST`: Initiate OAuth flow for provider
- `DELETE`: Disconnect integration

**Individual Provider Routes**:

- `apps/web/src/app/api/integrations/google-calendar/callback/route.ts`
- `apps/web/src/app/api/integrations/gmail/callback/route.ts`
- `apps/web/src/app/api/integrations/canvas/route.ts` (API key based)
- `apps/web/src/app/api/integrations/spotify/callback/route.ts`
- `apps/web/src/app/api/integrations/apple-music/callback/route.ts`

### Notification Preferences

**File**: `apps/web/src/app/api/settings/notifications/route.ts`

- `GET`: Fetch notification preferences
- `PATCH`: Update notification preferences

### Account Deletion

**File**: `apps/web/src/app/api/settings/account/delete/route.ts`

- `DELETE`: Hard delete user and all associated data (cascading delete via Prisma)

## Settings Page UI Restructure

**File**: `apps/web/src/app/settings/page.tsx`

Transform into expandable accordion sections:

### Section 1: Profile

- Display name (editable)
- Email (read-only, from auth)
- Profile image placeholder
- Save button

### Section 2: Work Locations

- List all FlowLocations with enable/disable toggle
- Edit location name, coordinates, radius
- Delete location button
- Add new location button → opens modal/form

### Section 3: Blocked Apps

- List all BlockedApps with enable/disable toggle
- Edit app name, identifier, category
- Delete app button
- Add new blocked app button

### Section 4: Pre-Work Ritual

- List all RitualItems with drag-to-reorder
- Edit ritual item text
- Delete ritual item button
- Add new ritual step button

### Section 5: Integrations

- **Google Calendar**: Connect/Disconnect button, status indicator
- **Gmail**: Connect/Disconnect button, status indicator
- **Canvas LMS**: API key input field, Connect/Disconnect button
- **Spotify**: Connect/Disconnect button, status indicator
- **Apple Music**: Connect/Disconnect button, status indicator
- Show "Connected ✓" or "Not Connected" with last sync time

### Section 6: Notification Preferences

- Toggle switches for:
  - Location-based alerts
  - Session alerts
  - Integration sync notifications
  - Daily prompts (on app open only)
  - Streak tracking notifications
- Note: "All notifications are in-app only"

### Section 7: Danger Zone

- **Delete Account** button (red, confirmation modal required)
- Warning text: "This action cannot be undone. All your data will be permanently deleted."

## Integration OAuth Infrastructure

### Environment Variables

Add to `.env` and document in `ENV_CONFIG.md`:

```env
# Google APIs
GOOGLE_CALENDAR_CLIENT_ID=
GOOGLE_CALENDAR_CLIENT_SECRET=
GMAIL_CLIENT_ID=
GMAIL_CLIENT_SECRET=

# Canvas LMS
CANVAS_API_BASE_URL=

# Music APIs
SPOTIFY_CLIENT_ID=
SPOTIFY_CLIENT_SECRET=
APPLE_MUSIC_DEVELOPER_TOKEN=
APPLE_MUSIC_TEAM_ID=
APPLE_MUSIC_KEY_ID=
```

### OAuth Flow Implementation

**Lib file**: `apps/web/src/lib/integrations.ts`

Create helper functions:

- `initiateGoogleCalendarAuth()`: Generate OAuth URL
- `handleGoogleCalendarCallback()`: Exchange code for tokens
- `initiateGmailAuth()`: Generate OAuth URL
- `handleGmailCallback()`: Exchange code for tokens
- `initiateSpotifyAuth()`: Generate OAuth URL
- `handleSpotifyCallback()`: Exchange code for tokens
- `storeIntegrationTokens()`: Save to database
- `refreshIntegrationToken()`: Refresh expired tokens
- `disconnectIntegration()`: Remove from database

### Canvas LMS (API Key Based)

Simple API key storage (no OAuth):

- User inputs API key and institution URL
- Validate by making test API call
- Store encrypted in database

## Migration Script

**File**: `apps/web/prisma/migrations/[timestamp]_phase_7_settings_infrastructure/migration.sql`

Use MCP Supabase `apply_migration` to:

1. Create `Integration` table
2. Create `NotificationPreferences` table with default values for all existing users
3. Add foreign key constraints

## Components

### Expandable Section Component

**File**: `apps/web/src/components/settings/ExpandableSection.tsx`

- Accordion-style section with smooth animation
- Icon indicator (chevron down/up)
- Click to expand/collapse

### Integration Card Component

**File**: `apps/web/src/components/settings/IntegrationCard.tsx`

- Provider logo/icon
- Connection status badge
- Connect/Disconnect button
- Last synced timestamp (if connected)

### Delete Account Modal

**File**: `apps/web/src/components/settings/DeleteAccountModal.tsx`

- Confirmation modal with warning
- "Type 'DELETE' to confirm" input
- Final confirmation button

### Location Item Component

**File**: `apps/web/src/components/settings/LocationItem.tsx`

- Display location with map pin icon
- Edit mode with inline form
- Enable/disable toggle
- Delete button

### Similar components for BlockedApp and RitualItem

## Implementation Requirements

### Data Persistence

- Every form input must save to database on change or on explicit "Save" button
- Optimistic UI updates with error handling
- Toast notifications for success/error states

### Optional Integrations

- All integration connections are OPTIONAL
- App functionality is NOT gated by integrations
- If user skips integrations, they can still use 100% of current app features
- Integration status only affects future features (to be built later)

### Error Handling

- Graceful OAuth flow failures with user-friendly messages
- Token refresh logic for expired integrations
- Network error handling with retry mechanisms

### Security

- OAuth tokens encrypted at rest (consider using Prisma middleware)
- CSRF protection for OAuth callbacks
- Rate limiting on sensitive endpoints (account deletion, integration connections)

## Testing Checklist

- [ ] Profile updates persist to database
- [ ] Location CRUD operations work correctly
- [ ] Blocked apps CRUD operations work correctly
- [ ] Ritual items CRUD operations work correctly
- [ ] Google Calendar OAuth flow stores tokens
- [ ] Gmail OAuth flow stores tokens
- [ ] Canvas API key validation and storage
- [ ] Spotify OAuth flow stores tokens
- [ ] Apple Music connection stores credentials
- [ ] Notification preferences save correctly
- [ ] Account deletion removes all user data
- [ ] All integrations show correct connection status
- [ ] App works fully without any integrations connected

## Documentation

**File**: `PHASE_7_SETTINGS_IMPLEMENTATION.md` (this file, saved to project root)

Additional documentation:

- Update `ENV_CONFIG.md` with new environment variables
- Add OAuth setup instructions to README
- Document integration architecture for future development

## Implementation To-Dos

- [ ] Create and apply database migration for Integration and NotificationPreferences tables with MCP Supabase
- [ ] Implement profile management API endpoints (GET, PATCH)
- [ ] Create settings/locations API with full CRUD operations
- [ ] Create settings/blocked-apps API with full CRUD operations
- [ ] Extend ritual API with PATCH, DELETE, and PUT (reorder) endpoints
- [ ] Create notification preferences API (GET, PATCH)
- [ ] Implement account deletion API with cascading delete
- [ ] Create integrations helper library with OAuth flow functions
- [ ] Create base integrations API (GET list, DELETE disconnect)
- [ ] Implement Google Calendar OAuth callback and token storage
- [ ] Implement Gmail OAuth callback and token storage
- [ ] Implement Canvas LMS API key validation and storage
- [ ] Implement Spotify OAuth callback and token storage
- [ ] Implement Apple Music connection and credential storage
- [ ] Create ExpandableSection accordion component for settings
- [ ] Create IntegrationCard component with connection status
- [ ] Create DeleteAccountModal with confirmation flow
- [ ] Create LocationItem component with inline editing
- [ ] Create BlockedAppItem component with inline editing
- [ ] Create RitualItemEditor component with drag-to-reorder
- [ ] Rebuild settings page with all expandable sections and full functionality
- [ ] Update ENV_CONFIG.md with all integration environment variables and setup instructions
- [ ] Test all integration OAuth flows and verify data persistence
- [ ] Verify all settings are functional, data persists, and app works without integrations


