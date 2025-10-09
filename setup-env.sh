#!/bin/bash

echo "🔐 FlowStateMax Environment Setup"
echo "================================="
echo ""

# Check if .env.local already exists
if [ -f "apps/web/.env.local" ]; then
    echo "⚠️  apps/web/.env.local already exists!"
    echo ""
    read -p "Do you want to overwrite it? (y/N): " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "❌ Setup cancelled"
        exit 1
    fi
fi

# Create .env.local file
echo "📝 Creating apps/web/.env.local..."
cat > apps/web/.env.local << 'EOF'
# Supabase Database (Direct connection for local development)
DATABASE_URL="postgresql://postgres:Ad215143421!@db.iqdomkoxncawrzwrrydr.supabase.co:5432/postgres?sslmode=require"

# Supabase API
NEXT_PUBLIC_SUPABASE_URL="https://iqdomkoxncawrzwrrydr.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlxZG9ta294bmNhd3J6d3JyeWRyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk5Mjc2NzUsImV4cCI6MjA3NTUwMzY3NX0.EngmT5oKDjMXO9CatzFNWOmvtHPiH5AVLActCf-MQXg"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="gEYpC/uNJkBuINquy4OrhXtStmsJAfe9BIFpdvfy0Ek="
EOF

echo "✅ Created apps/web/.env.local"
echo ""

# Test database connection
echo "🔍 Testing database connection..."
echo ""

if command -v node &> /dev/null; then
    node test-db-connection.js
    DB_TEST_RESULT=$?
    
    if [ $DB_TEST_RESULT -eq 0 ]; then
        echo ""
        echo "🎉 Environment setup complete!"
        echo ""
        echo "📋 Next steps:"
        echo "   1. If tables don't exist, run: npm run db:push --workspace=@flowstate/web"
        echo "   2. Start dev server: npm run dev"
        echo "   3. Visit: http://localhost:3000"
    else
        echo ""
        echo "⚠️  Database connection test failed"
        echo ""
        echo "💡 Troubleshooting:"
        echo "   1. Check if Supabase project is paused (open dashboard to wake it up)"
        echo "   2. Verify password is correct"
        echo "   3. See ENV_SETUP_GUIDE.md for more help"
    fi
else
    echo "⚠️  Node.js not found - skipping connection test"
    echo "   Run 'node test-db-connection.js' manually to test"
fi

echo ""
echo "📖 For more information, see: ENV_SETUP_GUIDE.md"

