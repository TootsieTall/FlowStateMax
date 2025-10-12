# Database Connection Audit - Supabase PostgreSQL

## System Overview
**Database**: PostgreSQL (Supabase)  
**ORM**: Prisma 5.22.0  
**Connection String**: DATABASE_URL environment variable

## Schema Status ✅
- **Generator**: prisma-client-js
- **Provider**: postgresql
- **Models**: 13 tables defined
- **Version**: 5.22.0 (latest stable)

### Database Models:
1. ✅ User (with onboarding fields)
2. ✅ Account (OAuth)
3. ✅ Session (NextAuth)
4. ✅ FlowLocation
5. ✅ BlockedApp
6. ✅ RitualItem
7. ✅ TimeBlock
8. ✅ Task
9. ✅ FlowSession
10. ✅ SessionBlockBreak
11. ✅ ShutdownLog
12. ✅ DailyGoal

## Connection Issues Found

### 🔴 CRITICAL: DATABASE_URL Not Found Locally
**Status**: Environment variable not configured in local development  
**Impact**: Local development cannot connect to database

### Symptoms:
- `grep DATABASE_URL` returned empty result
- `.env.local` may not exist or is not configured

## Required Environment Variables

### For Local Development (.env.local):
```bash
# Supabase PostgreSQL Connection
DATABASE_URL="postgresql://postgres:[PASSWORD]@[PROJECT_REF].supabase.co:5432/postgres"

# Direct connection (for Prisma migrations)
DIRECT_URL="postgresql://postgres:[PASSWORD]@[PROJECT_REF].supabase.co:5432/postgres"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="[generate-with-openssl-rand]"

# Optional: OAuth
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."

# Feature Flags
NEXT_PUBLIC_ALLOW_GUEST_ONBOARDING="true"
NEXT_PUBLIC_ENABLE_OAUTH="false"
```

### For Production (Vercel):
All of the above MUST be configured in Vercel Environment Variables.

## Verification Steps

### 1. Test Database Connection
```bash
cd apps/web
npx prisma db pull
```
**Expected**: Should connect and show schema
**If fails**: DATABASE_URL is incorrect or not set

### 2. Generate Prisma Client
```bash
npx prisma generate
```
**Expected**: Generates types in node_modules/@prisma/client
**Required**: Must run after any schema changes

### 3. Run Migrations
```bash
npx prisma db push
```
**Expected**: Pushes schema to database
**Note**: Use `migrate dev` for production-ready migrations

### 4. Test Query
```bash
npx prisma studio
```
**Expected**: Opens GUI to browse database
**If works**: Connection is valid

## Common Supabase Issues

### Issue 1: Connection Pooling
**Problem**: Direct connections may fail in serverless  
**Solution**: Use connection pooling URL

```bash
# Transaction mode (recommended for Prisma)
DATABASE_URL="postgresql://postgres:[PASSWORD]@[PROJECT_REF].pooler.supabase.com:5432/postgres?pgbouncer=true"

# Direct connection (for migrations only)
DIRECT_URL="postgresql://postgres:[PASSWORD]@[PROJECT_REF].supabase.co:5432/postgres"
```

### Issue 2: SSL/TLS Requirements
**Problem**: Supabase requires SSL  
**Solution**: Add `sslmode=require` to connection string

```bash
DATABASE_URL="...?sslmode=require"
```

### Issue 3: IPv6 vs IPv4
**Problem**: Some environments don't support IPv6  
**Solution**: Force IPv4 in Supabase project settings

## Security Best Practices

### ✅ DO:
- Use environment variables for all credentials
- Use connection pooling for serverless (Vercel)
- Rotate database passwords regularly
- Enable Row Level Security (RLS) in Supabase
- Use separate databases for dev/staging/prod

### ❌ DON'T:
- Commit .env files to git
- Share database credentials in code
- Use same credentials across environments
- Expose database publicly without RLS

## Production Deployment Checklist

- [ ] DATABASE_URL configured in Vercel
- [ ] DIRECT_URL configured (if using migrations)
- [ ] Prisma client generated during build
- [ ] Database migrations applied
- [ ] Connection pooling enabled
- [ ] SSL/TLS enforced
- [ ] RLS policies configured in Supabase
- [ ] Backup strategy in place

## Troubleshooting Commands

### Check Prisma Client Status
```bash
npx prisma -v
```

### Test Connection
```bash
npx prisma db pull --force
```

### View Current Schema
```bash
npx prisma db pull --print
```

### Reset Database (DANGEROUS - only for dev)
```bash
npx prisma db push --force-reset
```

### Check Supabase Status
```bash
curl https://[PROJECT_REF].supabase.co/rest/v1/
```

## Next Steps

1. **Configure DATABASE_URL** in `.env.local`
2. **Test connection** with `npx prisma db pull`
3. **Generate client** with `npx prisma generate`
4. **Verify Vercel env** variables are set
5. **Test production** deployment after env setup

## Supabase Connection String Format

```
postgresql://[user]:[password]@[host]:[port]/[database]?[options]

Example:
postgresql://postgres:your-password@db.project-ref.supabase.co:5432/postgres?sslmode=require
```

### Where to Find:
1. Go to Supabase Dashboard
2. Select your project
3. Settings → Database
4. Connection String → URI (or Connection Pooling)
5. Copy and replace `[YOUR-PASSWORD]` with your actual password

## Monitoring Recommendations

### Prisma Metrics:
- Query execution time
- Connection pool usage
- Failed query rate
- Database errors

### Supabase Metrics:
- Active connections
- Query performance
- Database size
- API response times

### Alerts:
- Connection failures
- Slow queries (>1s)
- High error rate
- Connection pool exhaustion

