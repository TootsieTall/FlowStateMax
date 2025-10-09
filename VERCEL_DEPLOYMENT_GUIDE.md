# 🚀 FlowStateMax Vercel Deployment Guide

## Complete Step-by-Step Instructions

---

## 📋 **Before You Start**

Make sure you have:
- ✅ GitHub account (you already have this)
- ✅ Code pushed to GitHub (DONE! ✅)
- ✅ Supabase project created (DONE! ✅)
- ✅ Your environment variables (listed below)

---

## 🎯 **Step 1: Create Vercel Account**

1. **Go to**: https://vercel.com
2. Click **"Sign Up"** in the top right
3. Click **"Continue with GitHub"**
4. **Authorize Vercel** to access your GitHub account
5. You'll be redirected to your Vercel dashboard

---

## 🎯 **Step 2: Import Your Project**

### 2.1 Start Import
1. On the Vercel dashboard, click **"Add New..."** button (top right)
2. Select **"Project"** from the dropdown
3. You'll see the "Import Git Repository" page

### 2.2 Find Your Repository
1. You should see **"Import Git Repository"** section
2. Look for **"TootsieTall/FlowStateMax"** in the list
   - If you don't see it, click **"Adjust GitHub App Permissions"**
   - Make sure Vercel has access to your repositories
3. Click **"Import"** next to FlowStateMax

---

## 🎯 **Step 3: Configure Your Project**

### 3.1 Project Settings
On the configuration screen:

1. **Project Name**: `flowstate-max` (or your preferred name)
   - This will be your URL: `flowstate-max.vercel.app`

2. **Framework Preset**: 
   - Should auto-detect as **"Next.js"**
   - If not, select it from dropdown

3. **Root Directory**: 
   - Leave as **"./"** (default)
   - ⚠️ DO NOT change this

4. **Build and Output Settings**:
   - Leave all defaults (Vercel knows how to build Next.js)
   - Build Command: `npm run build` (auto-filled)
   - Output Directory: `.next` (auto-filled)
   - Install Command: `npm install` (auto-filled)

---

## 🎯 **Step 4: Add Environment Variables** (CRITICAL!)

This is the most important step! Click **"Environment Variables"** section.

### 4.1 Add Each Variable

For **EACH** variable below, do this:
1. Click **"Add Variable"** or the input field
2. **Name**: Copy the variable name exactly
3. **Value**: Copy the corresponding value
4. **Environment**: Select **"Production"**, **"Preview"**, and **"Development"** (all three!)
5. Click **"Add"** or move to next variable

---

### 📝 **Your Environment Variables:**

**Variable 1:**
```
Name: DATABASE_URL
Value: postgresql://postgres.iqdomkoxncawrzwrrydr:Ad215143421$@aws-0-us-east-1.pooler.supabase.com:5432/postgres?pgbouncer=true&connection_limit=1
```

**Variable 2:**
```
Name: NEXT_PUBLIC_SUPABASE_URL
Value: https://iqdomkoxncawrzwrrydr.supabase.co
```

**Variable 3:**
```
Name: NEXT_PUBLIC_SUPABASE_ANON_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlxZG9ta294bmNhd3J6d3JyeWRyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk5Mjc2NzUsImV4cCI6MjA3NTUwMzY3NX0.EngmT5oKDjMXO9CatzFNWOmvtHPiH5AVLActCf-MQXg
```

**Variable 4:**
```
Name: NEXTAUTH_SECRET
Value: gEYpC/uNJkBuINquy4OrhXtStmsJAfe9BIFpdvfy0Ek=
```

**Variable 5:**
```
Name: NEXTAUTH_URL
Value: https://flowstate-max.vercel.app
```
⚠️ **IMPORTANT**: Replace `flowstate-max` with YOUR actual project name from Step 3.1

---

### 4.2 Verify Your Variables

After adding all 5 variables, you should see:
- ✅ DATABASE_URL
- ✅ NEXT_PUBLIC_SUPABASE_URL
- ✅ NEXT_PUBLIC_SUPABASE_ANON_KEY
- ✅ NEXTAUTH_SECRET
- ✅ NEXTAUTH_URL

---

## 🎯 **Step 5: Deploy!**

1. **Double-check** all environment variables are correct
2. Click the big **"Deploy"** button at the bottom
3. Watch the deployment progress:
   - Installing dependencies (~30 seconds)
   - Building your application (~1-2 minutes)
   - Deploying to edge network (~10 seconds)

### What You'll See:
```
Building...
▲ Vercel
⚡️  Deploying to Production...
📦 Installing dependencies...
🔨 Building application...
✅ Build Complete!
🚀 Deploying...
✨ Deployment Complete!
```

---

## 🎯 **Step 6: Get Your Live URL**

1. After deployment completes, you'll see:
   - ✅ **"Congratulations!"** message
   - 🔗 Your live URL: `https://your-project-name.vercel.app`

2. **Copy your URL**

3. Click **"Visit"** to see your live app! 🎉

---

## 🎯 **Step 7: Update NEXTAUTH_URL (Important!)**

Now that you have your actual URL, update it:

1. In Vercel dashboard, go to your project
2. Click **"Settings"** tab at the top
3. Click **"Environment Variables"** in left sidebar
4. Find **NEXTAUTH_URL**
5. Click the **"⋯"** menu → **"Edit"**
6. Update to your **actual URL**: `https://your-actual-url.vercel.app`
7. Click **"Save"**
8. Click **"Redeploy"** (Vercel will prompt you)

---

## 🎯 **Step 8: Test Your App**

### 8.1 Visit Your App
Go to: `https://your-project-name.vercel.app`

### 8.2 Test Onboarding
1. You should see the onboarding page
2. Enter your name and click "Get Started"
3. Complete all 8 steps:
   - ✅ Focus Areas
   - ✅ Calendar/Email Integration
   - ✅ Work Locations
   - ✅ App Blocking
   - ✅ Flow Ritual
   - ✅ Boredom Training
   - ✅ Active Recovery
   - ✅ Completion

### 8.3 Test Database Connection
1. After onboarding, you'll be redirected to `/today`
2. **This should work now!** (no database errors)
3. Check your Supabase Dashboard → Table Editor
4. You should see your user data in the `User` table! 🎉

---

## 🎯 **Step 9: Set Up Auto-Deploy (Already Done!)**

Vercel automatically set up auto-deploy when you imported from GitHub.

**This means:**
- Every time you push to `main` branch → Auto-deploy to production
- Every time you push to other branches → Preview deployment
- Every PR → Preview URL for testing

**Try it:**
```bash
# Make a small change
echo "# Test" >> README.md

# Commit and push
git add README.md
git commit -m "Test auto-deploy"
git push

# Check Vercel dashboard - new deployment starts automatically!
```

---

## ✅ **Success Checklist**

After deployment, verify:
- [ ] App loads at your Vercel URL
- [ ] Onboarding flow works
- [ ] Can enter name and proceed
- [ ] All 8 onboarding steps accessible
- [ ] After completion, `/today` page loads (no errors!)
- [ ] Data appears in Supabase Table Editor
- [ ] No console errors in browser DevTools

---

## 🎉 **You're Live!**

### **Your App URLs:**
- **Production**: `https://your-project-name.vercel.app`
- **Vercel Dashboard**: `https://vercel.com/your-username/flowstate-max`
- **GitHub**: `https://github.com/TootsieTall/FlowStateMax`
- **Supabase**: `https://supabase.com/dashboard/project/iqdomkoxncawrzwrrydr`

### **Share Your App:**
Your app is now live on the internet! Share it with:
- Friends and family
- Potential users
- Portfolio reviewers
- Anyone with the link!

---

## 🔄 **Making Updates**

### Local Development:
```bash
# Work locally
npm run dev

# Make changes, test at localhost:3000
# When ready, push to GitHub
git add .
git commit -m "Add new feature"
git push

# Vercel deploys automatically in 30-60 seconds!
```

### View Deployment:
1. Check Vercel dashboard for deployment status
2. View deployment logs if there are issues
3. Each deployment gets a unique URL for testing

---

## 🆘 **Troubleshooting**

### Build Failed
**Check:**
1. Build logs in Vercel dashboard
2. Make sure all dependencies are in `package.json`
3. Environment variables are set correctly

### Database Connection Error
**Check:**
1. `DATABASE_URL` is correct in environment variables
2. Supabase project is active (not paused)
3. Password in connection string is correct

### 404 on Pages
**Check:**
1. Pages exist in `apps/web/src/app/` directory
2. File names are correct (e.g., `page.tsx`)
3. Clear Vercel cache and redeploy

### Environment Variables Not Working
**Check:**
1. Variable names are EXACTLY correct (case-sensitive)
2. All environments selected (Production, Preview, Development)
3. Redeploy after adding/changing variables

---

## 📊 **Monitoring Your App**

### Vercel Analytics (Free Tier):
1. Go to your project in Vercel
2. Click **"Analytics"** tab
3. See page views, performance, etc.

### Deployment Logs:
1. Click on any deployment
2. View build logs, runtime logs
3. Debug any issues

### Supabase Logs:
1. Go to Supabase Dashboard
2. Click **"Logs"** tab
3. See all database queries

---

## 🚀 **Next Steps**

Now that you're deployed:

1. **Test All Features**
   - Complete onboarding
   - Create time blocks
   - Start flow sessions
   - Check location verification

2. **Customize**
   - Update branding
   - Add your logo
   - Customize colors

3. **Share**
   - Add to your portfolio
   - Share on social media
   - Get feedback from users

4. **Iterate**
   - Fix bugs
   - Add features
   - Deploy instantly with git push!

---

## 💡 **Pro Tips**

1. **Use Preview Deployments**
   - Create branches for new features
   - Test before merging to main
   - Each branch gets its own URL

2. **Environment-Specific Variables**
   - Use different values for Production vs Preview
   - Test with staging databases

3. **Domain Setup**
   - Add custom domain (free on Vercel)
   - Settings → Domains → Add
   - Use your own domain!

4. **Enable Web Analytics**
   - Settings → Analytics
   - See real user metrics (free tier includes basic analytics)

---

## 📚 **Helpful Resources**

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Supabase + Vercel Guide](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs)
- [Your Vercel Dashboard](https://vercel.com/dashboard)

---

## ✨ **Congratulations!**

You've successfully deployed FlowStateMax to production! 

Your deep work app is now live and accessible to anyone in the world! 🌍

**Enjoy building and iterating on your app!** 🎉

