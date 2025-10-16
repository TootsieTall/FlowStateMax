#!/bin/bash

# Vercel + Supabase Setup Script for FlowStateMax (daybreak database)
# Run this script from apps/web directory

set -e

echo "🚀 FlowStateMax - Vercel Supabase Setup"
echo "========================================"
echo ""

# Step 1: Login to Vercel
echo "Step 1: Vercel Login"
echo "-------------------"
echo "Opening browser for authentication..."
npx vercel login
echo "✅ Logged in successfully"
echo ""

# Step 2: Link to Vercel project
echo "Step 2: Link Project"
echo "-------------------"
npx vercel link
echo "✅ Project linked"
echo ""

# Step 3: Pull environment variables
echo "Step 3: Pull Environment Variables"
echo "-----------------------------------"
npx vercel env pull .env.development.local
echo "✅ Environment variables pulled"
echo ""

# Step 4: Check if .env.development.local was created
if [ ! -f .env.development.local ]; then
    echo "❌ Error: .env.development.local was not created"
    exit 1
fi

echo "✅ .env.development.local created successfully"
echo ""

# Step 5: Extract POSTGRES_PRISMA_URL and update .env.local
echo "Step 4: Update DATABASE_URL in .env.local"
echo "------------------------------------------"

if grep -q "POSTGRES_PRISMA_URL=" .env.development.local; then
    PRISMA_URL=$(grep "POSTGRES_PRISMA_URL=" .env.development.local | cut -d '=' -f2-)

    # Update .env.local with the correct DATABASE_URL
    if grep -q "^DATABASE_URL=" .env.local; then
        # Replace existing DATABASE_URL
        if [[ "$OSTYPE" == "darwin"* ]]; then
            sed -i '' "s|^DATABASE_URL=.*|DATABASE_URL=\"${PRISMA_URL}\"|" .env.local
        else
            sed -i "s|^DATABASE_URL=.*|DATABASE_URL=\"${PRISMA_URL}\"|" .env.local
        fi
    else
        # Add DATABASE_URL if it doesn't exist
        echo "" >> .env.local
        echo "# Prisma Database URL (from Vercel Supabase)" >> .env.local
        echo "DATABASE_URL=\"${PRISMA_URL}\"" >> .env.local
    fi

    echo "✅ DATABASE_URL updated in .env.local"
else
    echo "⚠️  Warning: POSTGRES_PRISMA_URL not found in .env.development.local"
    echo "   Please manually set DATABASE_URL in .env.local"
fi
echo ""

# Step 6: Install dependencies (ensure @supabase/ssr is installed)
echo "Step 5: Install Dependencies"
echo "----------------------------"
npm install
echo "✅ Dependencies installed"
echo ""

# Step 7: Push Prisma schema to Supabase
echo "Step 6: Push Prisma Schema to Supabase"
echo "---------------------------------------"
echo "This will create all tables in your daybreak database..."
npm run db:push
echo "✅ Database schema pushed"
echo ""

# Step 8: Summary
echo "🎉 Setup Complete!"
echo "=================="
echo ""
echo "Next steps:"
echo "1. Create a 'notes' table in Supabase (see instructions below)"
echo "2. Run: npm run dev"
echo "3. Visit: http://localhost:3001/notes"
echo ""
echo "To create the notes table, run this SQL in Supabase:"
echo ""
echo "CREATE TABLE notes ("
echo "  id SERIAL PRIMARY KEY,"
echo "  title TEXT,"
echo "  content TEXT,"
echo "  created_at TIMESTAMP DEFAULT NOW()"
echo ");"
echo ""
echo "INSERT INTO notes (title, content) VALUES"
echo "  ('Test Note', 'This is a test from Supabase daybreak database!');"
echo ""
