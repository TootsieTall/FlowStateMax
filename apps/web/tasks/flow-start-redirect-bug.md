# Flow Start Redirect Bug - Root Cause Analysis

## Problem
**"Start Your First Flow"** button redirects to `/onboarding` instead of triggering the multi-step flow sequence.

## Root Cause
The `/api/sessions/validate` endpoint (lines 50-80) has **overly strict validation** that's failing and causing the redirect:

```typescript
// Line 50-52: Fails if onboarding not complete
if (!user.onboardingComplete) {
  errors.push('Please complete onboarding first')
}

// Line 55-64: Fails if no flow locations
if (flowLocations === 0) {
  errors.push('Please add at least one flow location')
}

// Line 67-75: Fails if no ritual items
if (ritualItems === 0) {
  errors.push('Please set up your pre-flow ritual')
}

// Line 77-80: Returns redirect to onboarding
return NextResponse.json({
  isValid: errors.length === 0,
  errors,
  redirectTo: errors.length > 0 ? '/onboarding' : undefined, // ← BUG HERE
})
```

## Why This Is Wrong

### 1. **Flow locations are OPTIONAL**
- Per CLAUDE.md: "Skip Location Check" button exists
- LocationCheck component has `onSkip()` handler
- Users should be able to start flow without locations

### 2. **Ritual items are OPTIONAL**
- Per CLAUDE.md: Ritual auto-hides after 21 completions
- Users with `ritualCompletionCount >= 28` skip ritual entirely
- First-time users may not have ritual items yet

### 3. **These components handle their own state**
- LocationCheck shows "Add Your First Flow Location" if none exist
- RitualChecklist handles first-time setup
- DurationInput handles duration selection

## The Multi-Step Flow Design

The flow was designed to be **self-configuring**:

```
START FLOW BUTTON
    ↓
STEP 1: LocationCheck
    - If no locations: Show benefits + "Add Location" or "Skip"
    - If locations: Auto-detect or manual select
    ↓
STEP 2: DurationInput (if no time block)
    - Preset durations: 30m, 60m, 90m, 120m
    - Custom input option
    ↓
STEP 3: RitualChecklist (if < 28 completions)
    - Show pre-work ritual items
    - Track completion count
    ↓
STEP 4: Start Flow Session
    - Call /api/sessions/flow/start
    - Navigate to /flow page
    - Show DaybreakAnimation
```

## Solution

### Fix 1: Make validation less strict
**Only validate:**
- ✅ User is authenticated
- ✅ No active session exists
- ✅ Onboarding is complete

**Don't validate:**
- ❌ Flow locations (handled by LocationCheck)
- ❌ Ritual items (handled by RitualChecklist)
- ❌ Time blocks (handled by DurationInput)

### Fix 2: Update `/api/sessions/validate/route.ts`

Remove the rigid prerequisites and let components handle their own state.

### Fix 3: Update `/api/sessions/flow/start/route.ts`

Make `locationId` and `ritualCompleted` truly optional in the request body.

## Files to Modify

1. **`apps/web/src/app/api/sessions/validate/route.ts`**
   - Remove flow location validation
   - Remove ritual item validation
   - Keep only: auth + active session + onboarding complete

2. **`apps/web/src/app/api/sessions/flow/start/route.ts`**
   - Verify optional parameters are handled correctly
   - Ensure session starts even without location/ritual

## Testing Plan

1. **Fresh user (completed onboarding, no locations/ritual)**
   - Click "Start Flow"
   - Should see: LocationCheck → "No locations" → Skip or Add
   - Then: DurationInput → RitualChecklist → Flow starts

2. **User with locations (no ritual)**
   - Click "Start Flow"
   - Should see: LocationCheck → Select location
   - Then: DurationInput → RitualChecklist → Flow starts

3. **Experienced user (28+ ritual completions)**
   - Click "Start Flow"
   - Should see: LocationCheck → DurationInput → Flow starts (skip ritual)

## Expected Behavior After Fix

✅ "Start Your First Flow" triggers multi-step sequence
✅ Components handle their own missing data gracefully
✅ No redirect to onboarding unless truly incomplete
✅ Flow starts successfully with minimal friction
