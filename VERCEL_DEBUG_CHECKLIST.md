# 🔍 Vercel Onboarding Issue - Debug Checklist

## The Problem
You're getting "Failed to complete onboarding. Please try again." on Vercel production.

This is a **401 Unauthorized** error from `/api/onboarding/complete`, which means:
- The guest session isn't being created OR
- Environment variables aren't set correctly on Vercel

## 🚨 Immediate Checks on Vercel

### 1. Verify Environment Variables Are Set

Go to your Vercel project → Settings → Environment Variables

**Check these are ALL set**:
```bash
✅ NEXTAUTH_SECRET=<your-secret>
✅ NEXTAUTH_URL=https://flowstatemax.vercel.app
✅ NEXT_PUBLIC_ALLOW_GUEST_ONBOARDING=true
✅ NEXT_PUBLIC_DEV_MODE=false
✅ DATABASE_URL=postgresql://...
✅ DIRECT_URL=postgresql://...
```

**CRITICAL**: After adding/changing environment variables, you MUST redeploy!

### 2. Check NEXTAUTH_URL Matches Your Domain

The URL must be EXACT:
- ✅ `https://flowstatemax.vercel.app` (if that's your domain)
- ❌ `https://flowstatemax.vercel.app/` (no trailing slash)
- ❌ `http://...` (must be https)
- ❌ Missing entirely

### 3. Verify NEXTAUTH_SECRET Exists

Generate a new one if needed:
```bash
openssl rand -base64 32
```

Then add it to Vercel environment variables.

### 4. Check Database Connection

Make sure `DATABASE_URL` and `DIRECT_URL` are correct from Supabase:
- Go to Supabase → Settings → Database
- Copy the **Connection Pooling** URL
- Copy the **Direct Connection** URL
- Add both to Vercel

---

## 🔍 Advanced Debugging

### Check Vercel Build Logs

1. Go to your deployment in Vercel
2. Click on the deployment
3. Look for environment variable confirmation:
   ```
   - Environments: .env.production
   ```

### Check Vercel Function Logs

1. Go to Vercel dashboard
2. Click on your deployment
3. Go to **Functions** tab
4. Look for logs from `/api/onboarding/complete`
5. Check for error messages like:
   - "No session found"
   - "Prisma connection error"
   - "Invalid credentials"

### Test Guest Login Flow

**On Vercel**, try this manually:
1. Open browser DevTools (F12)
2. Go to Network tab
3. Navigate to `/onboarding`
4. Click "Continue Without Signing In"
5. Check the network request:
   - Should call `/api/auth/callback/credentials`
   - Should return cookies with session token
   - Look for errors in response

---

## 🔧 Most Likely Issues

### Issue 1: NEXTAUTH_URL is Wrong
**Symptom**: Session cookies aren't being set
**Fix**: 
```bash
NEXTAUTH_URL=https://flowstatemax.vercel.app
```
Must match your actual Vercel URL exactly!

### Issue 2: NEXTAUTH_SECRET is Missing
**Symptom**: Session can't be encrypted
**Fix**: Generate and add to Vercel:
```bash
openssl rand -base64 32
```

### Issue 3: Environment Variables Not Redeployed
**Symptom**: Changes don't take effect
**Fix**: After changing env vars, trigger a new deployment:
- Push a commit, OR
- Go to Deployments → Click "..." → Redeploy

### Issue 4: Guest Mode Not Enabled
**Symptom**: Credentials provider not available
**Fix**: Ensure these are set:
```bash
NEXT_PUBLIC_ALLOW_GUEST_ONBOARDING=true
NEXT_PUBLIC_DEV_MODE=false  # Must be false on production!
```

### Issue 5: Database Connection Issues
**Symptom**: User creation fails after session is created
**Fix**: Verify Supabase URLs are correct and database is accessible

---

## ✅ Quick Fix Steps

1. **Go to Vercel Dashboard** → Your Project → Settings → Environment Variables

2. **Add/Verify ALL of these**:
   ```
   NEXTAUTH_SECRET=<generate-with-openssl-rand-base64-32>
   NEXTAUTH_URL=https://flowstatemax.vercel.app
   NEXT_PUBLIC_ALLOW_GUEST_ONBOARDING=true
   NEXT_PUBLIC_DEV_MODE=false
   DATABASE_URL=<from-supabase>
   DIRECT_URL=<from-supabase>
   ```

3. **Redeploy**:
   - Go to Deployments tab
   - Click "..." on latest deployment
   - Click "Redeploy"
   - ✅ Check "Use existing build cache" OFF

4. **Test Again** after deployment completes

---

## 🧪 Test Locally First

Before deploying again, test the production build locally:

```bash
cd apps/web
npm run build
npm run start
```

Then test at `http://localhost:3000` (or 3001) to see if it works with production settings.

---

## 📞 If Still Not Working

Check these logs on Vercel:
1. Build logs - did build complete successfully?
2. Function logs - what error is the API throwing?
3. Runtime logs - are environment variables loading?

Share the error from Vercel Function logs and I can help debug further.

