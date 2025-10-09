# Chrome Extension Integration Guide

## Overview

The FlowState Chrome extension provides deep work support by:
- **Session Synchronization**: Polls web app every 5 seconds for active flow sessions
- **App Blocking**: Shows breath overlay when user tries to access blocked apps
- **Grayscale Mode**: Applies visual filter when monochrome mode is active
- **Usage Tracking**: Logs when users choose "Open Anyway" on blocked apps

## Architecture

### Background Service Worker
**File**: `apps/extension/src/background/service_worker.ts`

**Key Features**:
- **Session Polling**: Checks `/api/extension/session-status` every 5 seconds
- **State Synchronization**: Updates local extension state from web app
- **Grayscale Control**: Applies/removes CSS filter across all tabs
- **Block Break Logging**: Records when users bypass blocking

**Alarms**:
- `session_poll`: Every 5 seconds - polls session status from API
- `session_check`: Every 1 minute - checks if session should end

### Content Script
**File**: `apps/extension/src/content/content_script.ts`

**Responsibilities**:
- Check if current page should be blocked
- Show breath overlay for blocked apps
- Apply/remove grayscale filter on command
- Log "Open Anyway" actions with URL

### API Integration
**Files**: `apps/extension/src/shared/api.ts`

**Endpoints Used**:
```typescript
GET  /api/extension/session-status  // Poll every 5 seconds
GET  /api/extension/blocked-apps     // Fetch blocked apps list
POST /api/extension/log-break        // Log "Open Anyway" actions
POST /api/sessions                   // Start session
PATCH /api/sessions                  // End session
```

## API Endpoints

### Session Status
```typescript
GET /api/extension/session-status

Response:
{
  active: boolean
  session: {
    id: string
    startTime: Date
    monochromeOn: boolean
    appsBlocked: boolean
    musicPlayed: boolean
  } | null
  monochromeEnabled: boolean
  appsBlocked: boolean
}
```

### Blocked Apps
```typescript
GET /api/extension/blocked-apps

Response:
{
  apps: Array<{
    id: string
    name: string
    domain: string
    category: string
    enabled: boolean
  }>
}
```

### Log Block Break
```typescript
POST /api/extension/log-break

Body:
{
  appName: string
  url: string
  timestamp: string (ISO 8601)
}

Response:
{
  success: true
  break: {
    id: string
    sessionId: string
    appName: string
    url: string
    timestamp: Date
  }
}
```

## Database Schema

### BlockedApp (Enhanced)
```prisma
model BlockedApp {
  id            String   @id @default(cuid())
  userId        String
  name          String
  identifier    String   // Bundle ID or package name
  domain        String?  // NEW: Website domain for browser blocking
  category      String?  // NEW: App category (social, entertainment, etc.)
  enabled       Boolean  @default(true)
  createdAt     DateTime @default(now())
}
```

### SessionBlockBreak (New)
```prisma
model SessionBlockBreak {
  id        String      @id @default(cuid())
  sessionId String
  appName   String
  url       String?
  timestamp DateTime
  createdAt DateTime    @default(now())

  session   FlowSession @relation(fields: [sessionId], references: [id], onDelete: Cascade)

  @@index([sessionId])
}
```

## Authentication Flow

1. **Web App Login**: User authenticates via NextAuth
2. **Token Generation**: JWT token created on successful login
3. **Extension Auth**: Token passed to extension via `chrome.storage.local`
4. **API Requests**: All API calls include `Authorization: Bearer <token>` header
5. **Token Refresh**: Extension receives updated token from web app

## Session Flow

### Active Session
1. User starts flow session in web app
2. Extension polls `/api/extension/session-status` every 5 seconds
3. Extension receives `active: true` with session details
4. Extension fetches blocked apps from `/api/extension/blocked-apps`
5. Extension applies grayscale filter if `monochromeEnabled: true`
6. Extension blocks matching domains with breath overlay

### Blocked App Interaction
1. User navigates to blocked domain (e.g., `twitter.com`)
2. Content script checks with background service worker
3. Background matches domain against blocked apps list
4. Content script shows breath overlay with app name
5. User sees breathing animation for 5 seconds
6. User chooses:
   - **"Go Back"**: `window.history.back()` executed
   - **"Open Anyway"**: Log sent to `/api/extension/log-break` with URL

### Session End
1. Session ends in web app or time expires
2. Extension polls and receives `active: false`
3. Extension clears local session state
4. Extension removes grayscale filter from all tabs
5. Extension stops blocking apps

## Grayscale Implementation

### Global Control
```typescript
// Enable globally with intensity
globalGrayscaleEnabled = true
grayscaleIntensity = 100 // 0-100
await applyGrayscaleToAllTabs(true, 100)

// Disable globally
globalGrayscaleEnabled = false
await applyGrayscaleToAllTabs(false)
```

### Per-Tab Application
```typescript
// Message sent to each tab
chrome.tabs.sendMessage(tabId, {
  type: 'ENABLE_GRAYSCALE',
  payload: { intensity: 100 }
})

// Or disable
chrome.tabs.sendMessage(tabId, {
  type: 'DISABLE_GRAYSCALE'
})
```

### CSS Filter
```css
/* Applied to document root */
html {
  filter: grayscale(100%);
  transition: filter 0.5s ease-in-out;
}
```

## Building the Extension

### Development
```bash
cd apps/extension
npm install
npm run build:dev
```

### Production
```bash
cd apps/extension
npm run build
```

### Loading in Browser
1. Open Chrome and navigate to `chrome://extensions`
2. Enable "Developer mode" (top right)
3. Click "Load unpacked"
4. Select `apps/extension/dist` directory

### Cross-Browser Support
- **Chrome**: Full support (Manifest V3)
- **Edge**: Full support (Chromium-based)
- **Brave**: Full support (Chromium-based)
- **Firefox**: Requires Manifest V2 adaptation

## Testing Checklist

### Session Synchronization
- [ ] Extension polls every 5 seconds during active session
- [ ] Grayscale applies when monochrome mode enabled
- [ ] Grayscale removes when session ends
- [ ] Blocked apps list syncs from database

### App Blocking
- [ ] Breath overlay shows for blocked domains
- [ ] "Go Back" navigates to previous page
- [ ] "Open Anyway" logs to database with URL
- [ ] Overlay appears within 100ms of navigation

### Grayscale Mode
- [ ] Filter applies to all existing tabs
- [ ] Filter applies to newly opened tabs
- [ ] Intensity adjustable (0-100%)
- [ ] Smooth transition on enable/disable

### Authentication
- [ ] JWT token stored in chrome.storage
- [ ] API calls include Authorization header
- [ ] 401 responses handled gracefully
- [ ] Token refresh works seamlessly

### Error Handling
- [ ] Network failures don't crash extension
- [ ] Invalid tokens show auth prompt
- [ ] Missing session data handled gracefully
- [ ] Content script errors logged properly

## Security Considerations

### Token Storage
- Tokens stored in `chrome.storage.local` (encrypted by browser)
- Never exposed to web pages
- Cleared on logout

### API Security
- All endpoints require authentication
- Session data validated per user
- Block breaks logged with user context
- Rate limiting on polling endpoints

### Permissions
```json
{
  "permissions": [
    "storage",        // Token and state storage
    "tabs",           // Tab management for grayscale
    "declarativeNetRequest", // Future: block at network level
    "alarms",         // Polling and session checks
    "notifications"   // Session completion alerts
  ],
  "host_permissions": [
    "https://flowstate.app/*",
    "http://localhost:3000/*"
  ]
}
```

## Migration Guide

### Database Migration
Run this SQL after deployment:
```sql
-- See: apps/web/prisma/migrations/add_extension_support.sql
ALTER TABLE "BlockedApp" ADD COLUMN "domain" TEXT;
ALTER TABLE "BlockedApp" ADD COLUMN "category" TEXT;

CREATE TABLE "SessionBlockBreak" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "appName" TEXT NOT NULL,
    "url" TEXT,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "SessionBlockBreak_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "SessionBlockBreak_sessionId_idx" ON "SessionBlockBreak"("sessionId");

ALTER TABLE "SessionBlockBreak"
  ADD CONSTRAINT "SessionBlockBreak_sessionId_fkey"
  FOREIGN KEY ("sessionId") REFERENCES "FlowSession"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;
```

### Backfill Existing Data
```sql
-- Add domains to existing blocked apps
UPDATE "BlockedApp"
SET
  domain = CASE
    WHEN name LIKE '%Twitter%' THEN 'twitter.com'
    WHEN name LIKE '%Instagram%' THEN 'instagram.com'
    WHEN name LIKE '%YouTube%' THEN 'youtube.com'
    -- Add more mappings
  END,
  category = CASE
    WHEN name LIKE '%Twitter%' OR name LIKE '%Instagram%' THEN 'social'
    WHEN name LIKE '%YouTube%' OR name LIKE '%Netflix%' THEN 'entertainment'
    -- Add more mappings
  END
WHERE domain IS NULL;
```

## Future Enhancements

### Planned Features
- [ ] **Network-level blocking**: Use `declarativeNetRequest` API
- [ ] **Productivity insights**: Track time saved by blocking
- [ ] **Custom block messages**: User-defined overlay messages
- [ ] **Schedule-based blocking**: Auto-block during focus hours
- [ ] **Multi-device sync**: Coordinate blocking across devices

### Performance Optimizations
- [ ] **Conditional polling**: Only poll during active sessions
- [ ] **WebSocket connection**: Real-time updates instead of polling
- [ ] **Offline support**: Queue logs when offline
- [ ] **Lazy loading**: Load resources only when needed

## Troubleshooting

### Extension Not Syncing
1. Check authentication: `chrome.storage.local.get('auth')`
2. Verify API endpoint: Check network tab in DevTools
3. Check alarm status: `chrome.alarms.getAll()`
4. Review console logs in extension service worker

### Grayscale Not Applying
1. Check global state: `globalGrayscaleEnabled`
2. Verify content script loaded: Check tab injections
3. Test message passing: Send manual `ENABLE_GRAYSCALE`
4. Check for CSS conflicts in host page

### Blocking Not Working
1. Verify blocked apps list: `chrome.storage.local.get('blockedApps')`
2. Check domain matching logic
3. Review content script initialization
4. Test overlay creation manually

## Support

For issues or questions:
- GitHub Issues: [repository]/issues
- Documentation: [repository]/docs
- Contact: team@flowstate.app
