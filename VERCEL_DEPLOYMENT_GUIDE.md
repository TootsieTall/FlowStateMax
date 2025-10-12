# 🚀 Deploy FlowStateMax to Vercel

## Quick Start (5 minutes)

### Step 1: Go to Vercel
1. Open [vercel.com](https://vercel.com) in your browser
2. Click **"Sign Up"** or **"Log In"**
3. Choose **"Continue with GitHub"**
4. Authorize Vercel to access your GitHub account

### Step 2: Import Your Repository
1. Click **"Add New..."** → **"Project"**
2. Find **"TootsieTall/FlowStateMax"** in the list
3. Click **"Import"**

### Step 3: Configure Project
1. **Framework Preset**: Next.js (should auto-detect)
2. **Root Directory**: Leave as `./` (root)
3. **Build Command**: Leave default (`npm run build`)
4. **Output Directory**: Leave default (`.next`)

### Step 4: Add Environment Variables
**IMPORTANT**: Click **"Environment Variables"** and add ALL of these:

#### Variable 1: DATABASE_URL
```
Name: DATABASE_URL
Value: postgresql://postgres.iqdomkoxncawrzwrrydr:Ad215143421$@aws-0-us-east-1.pooler.supabase.com:5432/postgres?pgbouncer=true&connection_limit=1
```
✅ Select: **Production**, **Preview**, **Development**

#### Variable 2: NEXT_PUBLIC_SUPABASE_URL
```
Name: NEXT_PUBLIC_SUPABASE_URL
Value: https://iqdomkoxncawrzwrrydr.supabase.co
```
✅ Select: **Production**, **Preview**, **Development**

#### Variable 3: NEXT_PUBLIC_SUPABASE_ANON_KEY
```
Name: NEXT_PUBLIC_SUPABASE_ANON_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlxZG9ta294bmNhd3J6d3JyeWRyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk5Mjc2NzUsImV4cCI6MjA3NTUwMzY3NX0.EngmT5oKDjMXO9CatzFNWOmvtHPiH5AVLActCf-MQXg
```
✅ Select: **Production**, **Preview**, **Development**

#### Variable 4: NEXTAUTH_SECRET
```
Name: NEXTAUTH_SECRET
Value: gEYpC/uNJkBuINquy4OrhXtStmsJAfe9BIFpdvfy0Ek=
```
✅ Select: **Production**, **Preview**, **Development**

#### Variable 5: NEXTAUTH_URL
```
Name: NEXTAUTH_URL
Value: https://flowstatemax.vercel.app
```
✅ Select: **Production** only (we'll update this after deployment)

#### Variable 6: NEXT_PUBLIC_ENABLE_OAUTH
```
Name: NEXT_PUBLIC_ENABLE_OAUTH
Value: false
```
✅ Select: **Production**, **Preview**, **Development**

#### Variable 7: NEXT_PUBLIC_ALLOW_GUEST_ONBOARDING
```
Name: NEXT_PUBLIC_ALLOW_GUEST_ONBOARDING
Value: true
```
✅ Select: **Production**, **Preview**, **Development**

### Step 5: Deploy!
1. Click **"Deploy"** button
2. ☕ Wait 2-3 minutes while Vercel builds your app
3. You'll see: "🎉 Congratulations!" when done

### Step 6: Update NEXTAUTH_URL
1. Copy your actual Vercel URL (e.g., `https://flow-state-max-xyz.vercel.app`)
2. Go to **Project Settings** → **Environment Variables**
3. Find **NEXTAUTH_URL**
4. Click **Edit**
5. Update the value with your actual URL
6. Click **Save**
7. Go to **Deployments** tab
8. Click **"..."** on the latest deployment → **"Redeploy"**

### Step 7: Test Your App!
1. Click "Visit" to open your live app
2. Test the onboarding flow
3. Create a flow session
4. Everything should work! 🎉

---

## ⚠️ Important Notes

### Database Password
The `$` character in your password (`Ad215143421$`) should **NOT** be URL-encoded in Vercel. Vercel handles this automatically.

Use exactly: `Ad215143421$` (not `Ad215143421%24`)

### Monorepo Configuration
Vercel should auto-detect the Next.js app in `apps/web`. If it doesn't:
1. Go to **Project Settings** → **General**
2. Set **Root Directory** to `apps/web`
3. Click **Save**
4. Redeploy

### Build Command Override (if needed)
If the default build fails, try:
```
cd apps/web && npm run build
```

---

## 🐛 Troubleshooting

### Build Fails with "Cannot find module"
**Solution**: Vercel needs to install dependencies
- Add Build Command: `npm install && cd apps/web && npm run build`

### Database Connection Error
**Solution**: Check environment variables
1. Verify all 7 environment variables are added
2. Make sure they're selected for Production
3. Redeploy

### "Unauthorized" or "Session not found"
**Solution**: NEXTAUTH_URL mismatch
1. Update NEXTAUTH_URL with your actual Vercel URL
2. Redeploy

### Onboarding loops or redirects
**Solution**: Clear browser cache/cookies and try again

---

## 📊 After Deployment

### Check Database
Use Supabase MCP in Cursor to verify data:
```sql
SELECT COUNT(*) FROM "User";
```

### Monitor Logs
1. Go to Vercel dashboard
2. Click your project
3. Go to **Deployments** → Click latest → **Runtime Logs**
4. Watch for any errors

### Set Up Custom Domain (Optional)
1. Go to **Project Settings** → **Domains**
2. Add your custom domain
3. Update NEXTAUTH_URL with new domain
4. Redeploy

---

## 🎯 Quick Checklist

- [ ] Logged into Vercel with GitHub
- [ ] Imported TootsieTall/FlowStateMax repository
- [ ] Added all 7 environment variables
- [ ] Selected Production/Preview/Development for each
- [ ] Clicked "Deploy"
- [ ] Deployment succeeded
- [ ] Copied actual Vercel URL
- [ ] Updated NEXTAUTH_URL with actual URL
- [ ] Redeployed after updating NEXTAUTH_URL
- [ ] Tested onboarding flow
- [ ] Created first flow session
- [ ] Everything works! 🎉

---

## 🆘 Need Help?

If deployment fails or you encounter issues, check the deployment logs in Vercel for specific error messages.

Common issues are usually:
1. Missing environment variables
2. Wrong NEXTAUTH_URL
3. Database connection (rare with Supabase)

Good luck! 🚀

