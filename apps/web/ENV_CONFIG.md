# Environment Configuration Guide

## OAuth Feature Flags

Add these variables to your `.env.local` file to control OAuth behavior:

```bash
# ============================================================================
# OAuth Feature Flags - CRITICAL FOR QUICK RECOVERY
# ============================================================================

# Enable/Disable Google OAuth (set to "false" to disable OAuth entirely)
NEXT_PUBLIC_ENABLE_OAUTH=false

# When OAuth is disabled, allow guest onboarding (recommended for testing)
NEXT_PUBLIC_ALLOW_GUEST_ONBOARDING=true

# Development mode - provides test user when OAuth is disabled
NEXT_PUBLIC_DEV_MODE=true

# ============================================================================
# NextAuth Configuration
# ============================================================================
NEXTAUTH_SECRET=your-secret-key-here-generate-with-openssl-rand-base64-32
NEXTAUTH_URL=http://localhost:3000

# ============================================================================
# Google OAuth Credentials (only needed if ENABLE_OAUTH=true)
# ============================================================================
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# ============================================================================
# Development Settings
# ============================================================================
# Guest user ID for testing (used when guest mode is enabled)
DEV_GUEST_USER_ID=guest-user-dev-001
```

## Quick Recovery Steps

### To Immediately Disable OAuth:
1. Set `NEXT_PUBLIC_ENABLE_OAUTH=false` in your environment
2. Redeploy or restart your dev server
3. Users can now complete onboarding without OAuth

### To Test Locally Without OAuth:
1. Set `NEXT_PUBLIC_DEV_MODE=true`
2. Set `NEXT_PUBLIC_ALLOW_GUEST_ONBOARDING=true`
3. Start your dev server

### To Enable OAuth After Onboarding:
1. Keep `NEXT_PUBLIC_ENABLE_OAUTH=false` during onboarding
2. Show "Connect Google" option after onboarding completion
3. Users can optionally connect their Google account later

