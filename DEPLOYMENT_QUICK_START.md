# 🚀 Deploy FlowStateMax in 10 Minutes

## TL;DR - Super Quick Version

```
1. Go to: vercel.com
2. Sign up with GitHub
3. Import "FlowStateMax" repo
4. Add 5 environment variables (see VERCEL_ENV_VARIABLES.txt)
5. Click "Deploy"
6. Wait 2 minutes
7. Visit your live app!
```

---

## 📊 Visual Steps

### Step 1: Vercel Homepage
```
vercel.com → "Sign Up" → "Continue with GitHub"
```

### Step 2: Import Project
```
Dashboard → "Add New..." → "Project" → Find "FlowStateMax" → "Import"
```

### Step 3: Configure
```
Project Name: flowstate-max
Framework: Next.js (auto-detected)
Root Directory: ./ (default)
```

### Step 4: Environment Variables (CRITICAL!)
```
Click "Environment Variables" section
Add these 5 variables:
├─ DATABASE_URL (from VERCEL_ENV_VARIABLES.txt)
├─ NEXT_PUBLIC_SUPABASE_URL
├─ NEXT_PUBLIC_SUPABASE_ANON_KEY
├─ NEXTAUTH_SECRET
└─ NEXTAUTH_URL (use your vercel URL)

For EACH variable:
☑️ Select: Production
☑️ Select: Preview  
☑️ Select: Development
```

### Step 5: Deploy
```
Click "Deploy" → Wait 2 minutes → Done! ✨
```

### Step 6: Update NEXTAUTH_URL
```
Get your URL: https://your-app.vercel.app
Settings → Environment Variables → Edit NEXTAUTH_URL
Update with actual URL → Save → Redeploy
```

---

## ✅ What You'll See

### During Build:
```
📦 Installing dependencies... (30s)
🔨 Building application... (60s)
🚀 Deploying... (10s)
✅ Success!
```

### After Deployment:
```
🎉 Congratulations!
🔗 https://your-project.vercel.app
```

---

## 🧪 Test Your Deployment

### 1. Visit Your App
```
https://your-project.vercel.app
```

### 2. Complete Onboarding
```
Enter name → 8 steps → Should work perfectly!
```

### 3. Check Database
```
Supabase Dashboard → Table Editor → See your data!
```

### 4. Test /today Page
```
Visit: https://your-app.vercel.app/today
✅ Should load without errors!
```

---

## 📁 Files to Reference

1. **VERCEL_DEPLOYMENT_GUIDE.md** - Complete step-by-step guide
2. **VERCEL_ENV_VARIABLES.txt** - Copy-paste ready variables
3. **This file** - Quick visual reference

---

## 🆘 Common Issues

### Build Failed?
- Check environment variables are correct
- Check build logs in Vercel dashboard

### Database Error?
- Verify DATABASE_URL is correct
- Check Supabase project is active

### 404 Errors?
- All pages should exist in apps/web/src/app/
- Wait for deployment to complete

---

## 🎯 Success Checklist

After deployment:
- [ ] App loads at Vercel URL
- [ ] Onboarding flow works
- [ ] Can complete all 8 steps
- [ ] /today page loads (no database errors)
- [ ] Data appears in Supabase
- [ ] No console errors

---

## 🚀 You're Ready!

**Next Action:** Open `VERCEL_ENV_VARIABLES.txt` and follow the guide!

**Time to Deploy:** ~10 minutes
**Difficulty:** Easy
**Cost:** $0 (Free tier)

Let's go! 🎉
