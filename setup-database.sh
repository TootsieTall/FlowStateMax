#!/bin/bash

# FlowStateMax Database Setup Script
# Run this after getting your Supabase connection string

echo "=================================================="
echo "   FlowStateMax Database Setup"
echo "=================================================="
echo ""

# Check if we're in the right directory
if [ ! -f "apps/web/prisma/schema.prisma" ]; then
    echo "❌ Error: Please run this script from the FlowStateMax root directory"
    exit 1
fi

echo "This script will help you configure your Supabase database connection."
echo ""
echo "First, get your Supabase connection string:"
echo "1. Go to https://supabase.com/dashboard"
echo "2. Select your project"
echo "3. Settings → Database → Connection String (URI)"
echo "4. Copy the connection string"
echo ""
read -p "Enter your Supabase DATABASE_URL: " DATABASE_URL

if [ -z "$DATABASE_URL" ]; then
    echo "❌ No DATABASE_URL provided. Exiting."
    exit 1
fi

# Validate it looks like a Postgres URL
if [[ ! "$DATABASE_URL" =~ ^postgresql:// ]]; then
    echo "⚠️  Warning: This doesn't look like a PostgreSQL connection string"
    read -p "Continue anyway? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Add to .env.local
echo ""
echo "📝 Adding DATABASE_URL to apps/web/.env.local..."

cd apps/web

# Check if DATABASE_URL already exists
if grep -q "DATABASE_URL=" .env.local 2>/dev/null; then
    echo "⚠️  DATABASE_URL already exists in .env.local"
    read -p "Overwrite it? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        # Remove old DATABASE_URL line
        sed -i.backup '/^DATABASE_URL=/d' .env.local
        echo "DATABASE_URL=\"$DATABASE_URL\"" >> .env.local
        echo "✅ DATABASE_URL updated"
    else
        echo "⏭️  Skipped updating DATABASE_URL"
    fi
else
    # Add DATABASE_URL
    echo "" >> .env.local
    echo "# Database Connection" >> .env.local
    echo "DATABASE_URL=\"$DATABASE_URL\"" >> .env.local
    echo "✅ DATABASE_URL added to .env.local"
fi

# Generate Prisma Client
echo ""
echo "🔧 Generating Prisma Client..."
npx prisma generate

if [ $? -eq 0 ]; then
    echo "✅ Prisma Client generated successfully"
else
    echo "❌ Failed to generate Prisma Client"
    exit 1
fi

# Test connection
echo ""
echo "🔍 Testing database connection..."
npx prisma db pull --force > /dev/null 2>&1

if [ $? -eq 0 ]; then
    echo "✅ Database connection successful!"
    echo ""
    echo "=================================================="
    echo "   Setup Complete! ✨"
    echo "=================================================="
    echo ""
    echo "Next steps:"
    echo "1. Start the dev server: npm run dev"
    echo "2. Try completing onboarding again"
    echo ""
    echo "For production (Vercel):"
    echo "1. Add DATABASE_URL to Vercel environment variables"
    echo "2. Use the POOLED connection from Supabase"
    echo "3. Redeploy your app"
    echo ""
else
    echo "⚠️  Database connection test failed"
    echo ""
    echo "This could mean:"
    echo "- The connection string is incorrect"
    echo "- Your IP is not allowed (check Supabase network settings)"
    echo "- The database is not accessible"
    echo ""
    echo "Please verify your connection string and try again."
    exit 1
fi
