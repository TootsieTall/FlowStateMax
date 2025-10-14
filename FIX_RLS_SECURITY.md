# Fix RLS Security Issue

## Enable Row-Level Security on User Table

Run this SQL in your Supabase SQL Editor:

```sql
-- 1. Enable RLS on User table
ALTER TABLE public."User" ENABLE ROW LEVEL SECURITY;

-- 2. Revoke public access
REVOKE ALL ON public."User" FROM anon;
REVOKE ALL ON public."User" FROM authenticated;

-- 3. Allow users to read their own record
CREATE POLICY "Users can read own record" ON public."User"
  FOR SELECT
  TO authenticated
  USING (id = (SELECT auth.uid())::text);

-- 4. Allow users to update their own record
CREATE POLICY "Users can update own record" ON public."User"
  FOR UPDATE
  TO authenticated
  USING (id = (SELECT auth.uid())::text)
  WITH CHECK (id = (SELECT auth.uid())::text);

-- 5. Service role can do everything (for Prisma)
-- This is automatically true, no policy needed

-- 6. Add index for performance
CREATE INDEX IF NOT EXISTS idx_user_id ON public."User"(id);
```

## Note

- This doesn't affect your Prisma code (uses service_role)
- Only affects direct Supabase client access
- Do this AFTER fixing the onboarding issue

