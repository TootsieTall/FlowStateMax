#!/bin/bash

echo "🎯 FlowStateMax Database Setup"
echo "================================"
echo ""

# Check if .env.local exists
if [ ! -f "apps/web/.env.local" ]; then
    echo "❌ .env.local not found. Creating it..."
    cat > apps/web/.env.local << 'EOF'
# Database (You'll replace this with your Neon connection string)
DATABASE_URL="postgresql://username:password@ep-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="gEYpC/uNJkBuINquy4OrhXtStmsJAfe9BIFpdvfy0Ek="
EOF
    echo "✅ Created .env.local"
fi

echo ""
echo "📋 Quick Setup Steps:"
echo ""
echo "1. Go to https://neon.tech and create a free account"
echo "2. Create a new project called 'FlowStateMax'"
echo "3. Copy your connection string (Pooled connection)"
echo "4. Paste it below when prompted"
echo ""

read -p "Enter your Neon DATABASE_URL (or press Enter to skip): " db_url

if [ ! -z "$db_url" ]; then
    # Update the DATABASE_URL in .env.local
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        sed -i '' "s|DATABASE_URL=.*|DATABASE_URL=\"$db_url\"|g" apps/web/.env.local
    else
        # Linux
        sed -i "s|DATABASE_URL=.*|DATABASE_URL=\"$db_url\"|g" apps/web/.env.local
    fi
    
    echo "✅ Updated DATABASE_URL in .env.local"
    echo ""
    echo "🔄 Generating Prisma client..."
    npm run db:generate --workspace=@flowstate/web
    
    echo ""
    echo "🚀 Pushing schema to database..."
    npm run db:push --workspace=@flowstate/web
    
    echo ""
    echo "✅ Database setup complete!"
    echo ""
    echo "🎉 You can now run: npm run dev"
    echo "   Then visit: http://localhost:3000"
else
    echo ""
    echo "⏭️  Skipped database setup"
    echo ""
    echo "📝 To set up later, edit apps/web/.env.local and add your DATABASE_URL"
    echo "   Then run:"
    echo "   - npm run db:generate --workspace=@flowstate/web"
    echo "   - npm run db:push --workspace=@flowstate/web"
fi

echo ""
echo "📚 For detailed instructions, see DATABASE_SETUP.md"

