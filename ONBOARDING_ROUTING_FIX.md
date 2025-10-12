# Onboarding Routing Fix Summary

## Issues Found

The onboarding flow had several critical routing issues that caused users to be redirected back to onboarding instead of proceeding to the main application after completion:

### 1. **Missing API Endpoint**
- **Problem**: No API endpoint existed to mark onboarding as complete in the database
- **Impact**: User's `onboardingComplete` status was never saved to the database

### 2. **Onboarding Complete Page Didn't Save Status**
- **Problem**: The complete page (`/onboarding/complete`) only redirected to `/today` without calling any API
- **Impact**: Database remained unchanged, causing middleware to redirect users back to onboarding

### 3. **Middleware Not Checking Database Status**
- **Problem**: Middleware relied on JWT token `onboardingComplete` flag but never fetched it from database
- **Impact**: Token didn't have updated onboarding status, causing incorrect redirects

### 4. **Auth Configuration Missing Onboarding Status**
- **Problem**: JWT callback didn't fetch or store `onboardingComplete` status
- **Impact**: Token couldn't be used to check onboarding completion

### 5. **Today Page Creating Users Incorrectly**
- **Problem**: Today page created new users with `onboardingComplete: true` as a workaround
- **Impact**: Users could bypass onboarding entirely

## Solutions Implemented

### 1. Created API Endpoint: `/api/onboarding/complete`
**File**: `apps/web/src/app/api/onboarding/complete/route.ts`

```typescript
// POST endpoint to mark onboarding complete
// GET endpoint to check onboarding status
```

**Features**:
- Marks user's `onboardingComplete` as `true` in database
- Creates user record if it doesn't exist (upsert pattern)
- Saves goals and other onboarding data
- Returns success confirmation

### 2. Updated Onboarding Complete Page
**File**: `apps/web/src/app/onboarding/complete/page.tsx`

**Changes**:
- Calls `/api/onboarding/complete` before redirecting
- Updates session using `useSession().update()` to refresh JWT token
- Properly awaits API call completion
- Added error handling and logging

### 3. Fixed Middleware Onboarding Check
**File**: `apps/web/src/middleware.ts`

**Changes**:
- Added check for `onboardingComplete` status from token
- Redirects unauthenticated users with incomplete onboarding to `/onboarding`
- Allows authenticated users with complete onboarding to access protected routes
- Improved logic for guest users vs authenticated users

### 4. Enhanced Auth Configuration
**File**: `apps/web/src/lib/auth.ts`

**Changes**:
- Added Prisma import for database access
- Updated JWT callback to fetch `onboardingComplete` from database
- Stores `onboardingComplete` in JWT token for fast middleware checks
- Refreshes onboarding status on session update trigger
- Passes `onboardingComplete` to session for client-side access

### 5. Fixed Today Page User Creation
**File**: `apps/web/src/app/today/page.tsx`

**Changes**:
- Changed default `onboardingComplete` from `true` to `false`
- Added explicit check: redirects to `/onboarding` if not complete
- Improved error handling for user creation

### 6. Goals Page Now Saves Data
**File**: `apps/web/src/app/onboarding/goals/page.tsx`

**Changes**:
- Saves selected goals to localStorage
- Ensures goals are available when completing onboarding

## Flow After Fixes

### New User Flow:
1. User visits app → Middleware redirects to `/onboarding`
2. User enters name → Creates guest session
3. User goes through onboarding steps
4. Each step saves data to localStorage
5. User reaches `/onboarding/complete`
6. Complete page calls `/api/onboarding/complete`:
   - Saves all data to database
   - Sets `onboardingComplete = true`
7. Session is updated via `updateSession()`
8. JWT token is refreshed with new status
9. User is redirected to `/today`
10. Middleware checks token → `onboardingComplete: true` → Allows access
11. Today page checks database → Confirms completion → Shows dashboard

### Returning User Flow:
1. User logs in → JWT token includes `onboardingComplete: true`
2. Middleware checks token → Allows access to protected routes
3. User can navigate freely between pages

### Incomplete Onboarding Flow:
1. User starts onboarding but leaves before completing
2. JWT token has `onboardingComplete: false` (or undefined)
3. User tries to access `/today` or other protected routes
4. Middleware checks token → Redirects to `/onboarding`
5. User must complete onboarding to proceed

## Key Improvements

1. **Database as Source of Truth**: Onboarding status is now properly persisted
2. **JWT Token Caching**: Fast middleware checks without database hits on every request
3. **Session Updates**: Token refreshes when onboarding is completed
4. **Proper Error Handling**: Failed API calls are logged and don't crash the app
5. **Consistent Flow**: All routes properly enforce onboarding requirement

## Testing Checklist

- [x] New user can complete onboarding and access today page
- [x] Returning user with complete onboarding can access all pages
- [x] User with incomplete onboarding is redirected from protected pages
- [x] Onboarding complete API successfully saves to database
- [x] Session updates after completing onboarding
- [x] Middleware properly checks onboarding status
- [x] No infinite redirect loops

## Files Changed

1. `apps/web/src/app/api/onboarding/complete/route.ts` - **NEW**
2. `apps/web/src/app/onboarding/complete/page.tsx` - Updated
3. `apps/web/src/middleware.ts` - Updated
4. `apps/web/src/lib/auth.ts` - Updated
5. `apps/web/src/app/today/page.tsx` - Updated
6. `apps/web/src/app/onboarding/goals/page.tsx` - Updated

## Environment Variables Required

No new environment variables needed. Existing setup remains the same:
- `DATABASE_URL` - Postgres connection
- `NEXTAUTH_SECRET` - JWT secret
- `NEXT_PUBLIC_ALLOW_GUEST_ONBOARDING` - Guest mode flag
- `NEXT_PUBLIC_ENABLE_OAUTH` - OAuth flag

## Future Enhancements

1. **API Endpoints for Each Step**: Currently using localStorage, could add endpoints for:
   - `/api/onboarding/goals`
   - `/api/onboarding/locations`
   - `/api/onboarding/ritual`
   - etc.

2. **Progress Tracking**: Track which steps are completed to allow resuming

3. **Skip Completed Steps**: If user has partial data, skip those steps

4. **Onboarding Analytics**: Track where users drop off in the flow

5. **Better Error States**: Handle API failures more gracefully with retry logic

## Notes

- Guest mode still works - guests can complete onboarding without OAuth
- OAuth prompt still appears at completion for guest users if enabled
- Middleware respects all feature flags (guest mode, OAuth, etc.)
- Session updates are automatic - no manual refresh needed

