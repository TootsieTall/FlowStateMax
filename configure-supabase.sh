#!/bin/bash

echo "🔧 FlowStateMax - Supabase Configuration"
echo "=========================================="
echo ""
echo "Make sure your Supabase project is created!"
echo "Follow the guide in GET_SUPABASE_CREDENTIALS.md to find these values."
echo ""

# Check if .env.local exists
ENV_FILE="apps/web/.env.local"

if [ -f "$ENV_FILE" ]; then
    echo "📝 Existing .env.local found. It will be updated."
    echo ""
else
    echo "📝 Creating new .env.local file..."
    echo ""
fi

# Collect credentials
echo "Please enter your Supabase credentials:"
echo ""

read -p "1. DATABASE_URL (Connection string from Project Settings → Database): " DATABASE_URL
echo ""

read -p "2. NEXT_PUBLIC_SUPABASE_URL (Project URL from Project Settings → API): " SUPABASE_URL
echo ""

read -p "3. NEXT_PUBLIC_SUPABASE_ANON_KEY (anon public key from Project Settings → API): " SUPABASE_ANON_KEY
echo ""

# Create or update .env.local
cat > "$ENV_FILE" << EOF
# Supabase Database
DATABASE_URL="$DATABASE_URL"

# Supabase API
NEXT_PUBLIC_SUPABASE_URL="$SUPABASE_URL"
NEXT_PUBLIC_SUPABASE_ANON_KEY="$SUPABASE_ANON_KEY"

# NextAuth (keep existing setup for now)
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="gEYpC/uNJkBuINquy4OrhXtStmsJAfe9BIFpdvfy0Ek="

# For Vercel production, also add:
# NEXTAUTH_URL="https://your-app.vercel.app"
EOF

echo "✅ .env.local has been updated!"
echo ""
echo "📍 Location: $ENV_FILE"
echo ""
echo "🔄 Next steps:"
echo "   1. Generate Prisma client:"
echo "      npm run db:generate --workspace=@flowstate/web"
echo ""
echo "   2. Push schema to Supabase:"
echo "      npm run db:push --workspace=@flowstate/web"
echo ""
echo "   3. Restart your dev server:"
echo "      npm run dev"
echo ""
echo "🎉 You're all set! Visit http://localhost:3000"

