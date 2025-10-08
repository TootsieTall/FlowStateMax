# 🔧 Manual Supabase Setup (Simplified)

## The Easiest Way - Build Your Connection String

You can manually construct your DATABASE_URL using these pieces:

### What You Need:

1. **Project Reference ID** - Found in your project URL
   - Look at your browser URL: `https://supabase.com/dashboard/project/XXXXX`
   - The `XXXXX` part is your project reference ID

2. **Your Database Password** - The one you created when setting up the project
   - If you forgot it, click "Reset database password" on the Database Settings page

3. **Your Region** - You selected this when creating the project
   - Common ones: `us-east-1`, `us-west-1`, `eu-west-1`

### Build Your Connection String:

Replace the values in ALL CAPS below:

```
postgresql://postgres.YOUR_PROJECT_REF:YOUR_PASSWORD@aws-0-YOUR_REGION.pooler.supabase.com:6543/postgres
```

**Example:**
```
postgresql://postgres.abcdefghijklmnop:MySecurePassword123@aws-0-us-east-1.pooler.supabase.com:6543/postgres
```

---

## Step-by-Step:

### 1. Get Your Project Reference ID

Look at your browser URL bar right now. It should look like:
```
https://supabase.com/dashboard/project/abcdefghijklmnop/database/...
```

Copy the part after `/project/` (before the next `/`)

### 2. Get Your Project URL and API Key

These are easier to find:

1. Click the **Home** icon in the left sidebar
2. You should see **"Project URL"** and **"API Keys"**
3. Copy these:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public key**: Long string starting with `eyJ...`

OR:

1. Click **Project Settings** (gear icon ⚙️)
2. Click **API** in the left menu
3. Copy:
   - **Project URL**
   - **anon public** key

---

## Quick Configuration Without the Script

Just manually edit this file:

**`apps/web/.env.local`**

```env
# Supabase Database - Manual construction
# Format: postgresql://postgres.PROJECT_REF:PASSWORD@aws-0-REGION.pooler.supabase.com:6543/postgres
DATABASE_URL="postgresql://postgres.YOUR_PROJECT_REF:YOUR_PASSWORD@aws-0-us-east-1.pooler.supabase.com:6543/postgres"

# Supabase API (get from Project Settings → API)
NEXT_PUBLIC_SUPABASE_URL="https://YOUR_PROJECT_REF.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key-here"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="gEYpC/uNJkBuINquy4OrhXtStmsJAfe9BIFpdvfy0Ek="
```

---

## Let's Do This Together

Tell me:

1. What's your **project reference ID**? (from browser URL)
2. What **region** did you select? (us-east-1, eu-west-1, etc.)
3. Do you remember your **database password**? (If not, we'll reset it)

I'll build the connection string for you!

---

## Alternative: Find It in Supabase

Try this path:

1. **Home** (house icon) in left sidebar
2. Look for **"Connect"** or **"Connection Info"** button/section
3. Select **"Connection Pooling"** or **"Transaction"** mode
4. Copy the URI

OR

1. Click on your project name at the top
2. Look for **"Project API"** or **"Project Settings"** 
3. Database tab should have connection info

