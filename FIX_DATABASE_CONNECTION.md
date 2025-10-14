# Fix Database Connection Error on Vercel

## The Error
```
Error querying the database: FATAL: Tenant or user not found
```

This means your `DATABASE_URL` credentials or format are incorrect.

## Solution

### Get Correct URLs from Supabase

1. **Supabase Dashboard** → **Settings** → **Database**

2. **For DATABASE_URL** (Connection Pooling):
   - Scroll to **Connection String**
   - Select **Transaction** mode
   - Select **URI** format
   - Copy the URL
   - **Add this to the end**: `?pgbouncer=true&connection_limit=1`
   
   Result should look like:
   ```
   postgresql://postgres.iqdomkoxncaw:[PASSWORD]@aws-0-us-west-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1
   ```
   
   **Important**: 
   - Port is `6543` (pooling port)
   - Must end with `?pgbouncer=true&connection_limit=1`

3. **For DIRECT_URL** (Direct Connection):
   - Same section, change to **Session** mode
   - Copy the URL (no extra parameters needed)
   
   Result should look like:
   ```
   postgresql://postgres.iqdomkoxncaw:[PASSWORD]@aws-0-us-west-1.pooler.supabase.com:5432/postgres
   ```
   
   **Important**:
   - Port is `5432` (direct port)
   - Same password as DATABASE_URL

### Update in Vercel

1. Go to Vercel → Your Project → Settings → Environment Variables

2. **Update DATABASE_URL**:
   - Click on existing `DATABASE_URL` → Edit
   - Replace with the new value (with `?pgbouncer=true&connection_limit=1`)

3. **Add DIRECT_URL** (if not already there):
   - Click "Add Variable"
   - Name: `DIRECT_URL`
   - Value: The session mode URL (port 5432)

### Redeploy

**Critical**: Environment variable changes require redeployment!

1. Vercel → Deployments tab
2. Click "..." on latest deployment
3. Click "Redeploy"
4. **Uncheck** "Use existing build cache"
5. Click "Redeploy"

### Verify

After deployment:
1. Test onboarding flow
2. Check Vercel Function logs
3. Should NOT see "Tenant or user not found" error

## Common Mistakes

❌ Missing `?pgbouncer=true&connection_limit=1` on DATABASE_URL
❌ Using wrong port (5432 instead of 6543 for pooling)
❌ Using Session mode URL for DATABASE_URL (should use Transaction mode)
❌ Wrong password
❌ Not redeploying after changing env vars

## If Password is Wrong

If you don't know your database password:

1. Supabase → Settings → Database
2. Scroll to **Database Password** section
3. Click **Reset Database Password**
4. Copy the NEW password
5. Update BOTH `DATABASE_URL` and `DIRECT_URL` with new password
6. Redeploy in Vercel

