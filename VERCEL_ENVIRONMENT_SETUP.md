# 🚀 Vercel Environment Variables Setup

## Critical Issue: Missing Environment Variables

The 500 errors are caused by missing environment variables in Vercel. Here's what needs to be set:

## 🔧 Required Environment Variables

### 1. **Authentication (CRITICAL)**
```bash
NEXTAUTH_SECRET=your-secret-key-here-generate-with-openssl-rand-base64-32
NEXTAUTH_URL=https://flowstatemax.vercel.app
```

### 2. **Feature Flags (CRITICAL)**
```bash
NEXT_PUBLIC_ENABLE_OAUTH=false
NEXT_PUBLIC_ALLOW_GUEST_ONBOARDING=true
NEXT_PUBLIC_DEV_MODE=false
```

### 3. **Database Connection (CRITICAL)**
```bash
DATABASE_URL=postgresql://[user]:[password]@[host]:[port]/[database]?pgbouncer=true&connection_limit=1
DIRECT_URL=postgresql://[user]:[password]@[host]:[port]/[database]
```

### 4. **Supabase (if using Supabase features)**
```bash
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

## 🚨 Immediate Fix Steps

### Step 1: Generate NEXTAUTH_SECRET
```bash
openssl rand -base64 32
```

### Step 2: Set Environment Variables in Vercel
1. Go to: https://vercel.com/authoy-das-projects/flowstatemax/settings/environment-variables
2. Add each variable above
3. **IMPORTANT**: After adding variables, redeploy the project

### Step 3: Get Database URLs
Since you're using Vercel + Supabase integration:
1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Look for existing `POSTGRES_*` variables
3. Use `POSTGRES_PRISMA_URL` as `DATABASE_URL`
4. Use `POSTGRES_URL` as `DIRECT_URL`

## 🔍 Current Error Analysis

**Error**: `Server Components render error` with digest `3359504335`
**Cause**: Missing `NEXTAUTH_SECRET` and other environment variables
**Impact**: Authentication system fails, causing 500 errors

## ✅ Quick Test

After setting environment variables:
1. Redeploy the project
2. Visit: https://flowstatemax.vercel.app
3. Should redirect to `/onboarding` instead of 500 error

## 🎯 Priority Order

1. **NEXTAUTH_SECRET** (highest priority)
2. **NEXTAUTH_URL** 
3. **NEXT_PUBLIC_ALLOW_GUEST_ONBOARDING=true**
4. **DATABASE_URL** and **DIRECT_URL**
5. Other variables as needed

## 📝 Notes

- The app is designed to work in "guest mode" without OAuth
- Users can complete onboarding without signing in
- Database connection is needed for data persistence
- All tables are already created in Supabase
