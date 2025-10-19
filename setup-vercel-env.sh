#!/bin/bash

# Vercel Environment Variables Setup Script
# This script helps you set up the required environment variables in Vercel

set -e

echo "🚀 FlowStateMax - Vercel Environment Setup"
echo "=========================================="
echo ""

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Installing..."
    npm install -g vercel
fi

# Check if user is logged in
if ! vercel whoami &> /dev/null; then
    echo "🔐 Please log in to Vercel:"
    vercel login
fi

echo "✅ Logged in to Vercel"
echo ""

# Generate NEXTAUTH_SECRET
echo "🔑 Generating NEXTAUTH_SECRET..."
NEXTAUTH_SECRET=$(openssl rand -base64 32)
echo "Generated NEXTAUTH_SECRET: $NEXTAUTH_SECRET"
echo ""

# Set environment variables
echo "📝 Setting environment variables in Vercel..."

# Critical authentication variables
vercel env add NEXTAUTH_SECRET production <<< "$NEXTAUTH_SECRET"
vercel env add NEXTAUTH_URL production <<< "https://flowstatemax.vercel.app"

# Feature flags
vercel env add NEXT_PUBLIC_ENABLE_OAUTH production <<< "false"
vercel env add NEXT_PUBLIC_ALLOW_GUEST_ONBOARDING production <<< "true"
vercel env add NEXT_PUBLIC_DEV_MODE production <<< "false"

echo "✅ Environment variables set!"
echo ""

# Check if database variables exist
echo "🗄️ Checking for database connection..."
if vercel env ls | grep -q "DATABASE_URL"; then
    echo "✅ DATABASE_URL already exists"
else
    echo "⚠️  DATABASE_URL not found. You may need to:"
    echo "   1. Connect Supabase to your Vercel project"
    echo "   2. Or manually set DATABASE_URL and DIRECT_URL"
fi

if vercel env ls | grep -q "DIRECT_URL"; then
    echo "✅ DIRECT_URL already exists"
else
    echo "⚠️  DIRECT_URL not found. You may need to set it manually."
fi

echo ""
echo "🎉 Setup Complete!"
echo "=================="
echo ""
echo "Next steps:"
echo "1. The environment variables have been set"
echo "2. A new deployment will be triggered automatically"
echo "3. Monitor the deployment at: https://vercel.com/authoy-das-projects/flowstatemax"
echo "4. Test the app at: https://flowstatemax.vercel.app"
echo ""
echo "If you still see 500 errors, check:"
echo "- Database connection (DATABASE_URL, DIRECT_URL)"
echo "- Supabase connection (if using Supabase features)"
echo "- Vercel deployment logs for specific errors"
echo ""


