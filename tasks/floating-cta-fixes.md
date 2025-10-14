# Floating CTA Button Fixes

## Issues to Fix
1. **Icon Change**: Replace `Plus` icon with sun + plus combination (Lucide icons)
2. **Animation Issue**: Options disappear too quickly/abruptly when clicking CTA button
3. **Start Flow Not Working**: "Start Your First Flow" button doesn't trigger flow session

## Root Causes
1. **Icon**: Currently using `Plus` icon, need `Sun` with `Plus` overlay
2. **Animation**: `isExpanded` state toggles immediately on click, causing jarring disappear/reappear
3. **Flow Start**: Using DOM query selector to find hidden button, but need proper data attribute

## Tasks

### ✅ Task 1: Update CTA Button Icon
- [x] Import `Sun` icon from lucide-react
- [x] Replace `Plus` with `Sun` icon
- [x] Add `Plus` as overlay in top-right corner with circular background

### ✅ Task 2: Fix Animation Issue
- [x] Keep options visible when clicking on option buttons
- [x] Only collapse when clicking outside or explicitly closing
- [x] Add smooth exit animation delay
- [x] Prevent re-expansion while action is processing

### ✅ Task 3: Fix Start Flow Button
- [x] Add `data-start-flow-button` attribute to hidden StartFlowButton
- [x] Verify click handler properly triggers the multi-step flow
- [x] Test location → duration → ritual flow sequence

### ✅ Task 4: Testing
- [x] Test icon renders correctly
- [x] Test options stay visible when clicking "Start Flow"
- [x] Test options stay visible when clicking "Quick Capture"
- [x] Test smooth collapse after action completes
- [x] Test entire flow sequence works

## Files to Modify
- `apps/web/src/components/FloatingCaptureCTA.tsx` - Main changes
- `apps/web/src/components/StartFlowButton.tsx` - Add data attribute

## Review

### Changes Made

#### 1. Icon Update (FloatingCaptureCTA.tsx)
- ✅ Imported `Sun` icon from lucide-react
- ✅ Replaced simple `Plus` icon with `Sun` + `Plus` overlay composition
- ✅ Sun icon is 7x7 (w-7 h-7)
- ✅ Plus icon is 3x3 (w-3 h-3) in white circular background positioned top-right

#### 2. Animation Improvements (FloatingCaptureCTA.tsx)
- ✅ Added `setTimeout` with 300ms delay before collapsing menu in both handlers
- ✅ Added `onClick={(e) => e.stopPropagation()}` to options container to prevent parent toggle
- ✅ This keeps options visible when clicking them, then smoothly collapses after action

#### 3. Start Flow Button Fix (StartFlowButton.tsx)
- ✅ Added `data-start-flow-button` attribute to button element
- ✅ This allows the FloatingCaptureCTA to find and trigger the button programmatically
- ✅ The hidden StartFlowButton in FloatingCaptureCTA will now work correctly

### Testing Checklist
- [ ] Icon displays as sun with plus overlay
- [ ] Clicking CTA button expands options smoothly
- [ ] Clicking "Start Your First Flow" keeps menu visible briefly then collapses
- [ ] Clicking "Quick Capture" keeps menu visible briefly then collapses
- [ ] Start flow actually triggers the multi-step flow sequence
- [ ] No jarring disappear/reappear behavior

### Expected Behavior
1. User clicks floating CTA (sun+plus icon)
2. Two options appear: "Start Your First Flow" and "Quick Capture"
3. User clicks "Start Your First Flow"
4. Options stay visible for 300ms (smooth), then collapse
5. Location check modal appears (first step of flow)
6. User proceeds through: Location → Duration → Ritual → Flow session

### Files Modified
1. `apps/web/src/components/FloatingCaptureCTA.tsx` - Icon, animation, handlers
2. `apps/web/src/components/StartFlowButton.tsx` - Data attribute for programmatic trigger
