#!/bin/bash

# 🔧 Automated Vercel + Supabase Connection Script
# This script will configure Vercel environment variables with your Supabase database

set -e

echo "🚀 FlowStateMax: Connecting Vercel to Supabase Database"
echo "============================================================"
echo ""

# Supabase Project Details
SUPABASE_PROJECT_REF="iqdomkoxncawrzwrrydr"
SUPABASE_PROJECT_URL="https://iqdomkoxncawrzwrrydr.supabase.co"
SUPABASE_REGION="us-east-1"

# Vercel Project Details  
VERCEL_PROJECT_ID="prj_3iEYeDRgBjVnmAayujNUuGjDQTni"
VERCEL_TEAM_ID="team_bUGsB7c8TOacGycJSSgWQTJK"

echo "📦 Project Configuration:"
echo "  Supabase Project: $SUPABASE_PROJECT_REF"
echo "  Supabase URL: $SUPABASE_PROJECT_URL"
echo "  Vercel Project: flowstatemax"
echo ""

# Check if VERCEL_TOKEN is set
if [ -z "$VERCEL_TOKEN" ]; then
    echo "❌ ERROR: VERCEL_TOKEN environment variable is not set"
    echo ""
    echo "To get your Vercel token:"
    echo "1. Go to: https://vercel.com/account/tokens"
    echo "2. Click 'Create Token'"
    echo "3. Copy the token and run:"
    echo "   export VERCEL_TOKEN='your-token-here'"
    echo ""
    exit 1
fi

# Get database password from user
echo "🔑 Database Password Required"
echo "============================================================"
echo ""
echo "To get your database password:"
echo "1. Go to: https://supabase.com/dashboard/project/$SUPABASE_PROJECT_REF/settings/database"
echo "2. Scroll to 'Connection String' → Click 'Connection Pooling'"
echo "3. Copy the password from the connection string"
echo "   (The part after 'postgres.' and before '@')"
echo ""
echo "OR reset your password:"
echo "1. Scroll to 'Database Password'"  
echo "2. Click 'Reset Database Password'"
echo "3. Copy the new password immediately"
echo ""
read -sp "Enter your database password: " DB_PASSWORD
echo ""
echo ""

if [ -z "$DB_PASSWORD" ]; then
    echo "❌ ERROR: Password cannot be empty"
    exit 1
fi

# Construct connection strings
DATABASE_URL="postgresql://postgres.${SUPABASE_PROJECT_REF}:${DB_PASSWORD}@aws-0-${SUPABASE_REGION}.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1"
DIRECT_URL="postgresql://postgres.${SUPABASE_PROJECT_REF}:${DB_PASSWORD}@aws-0-${SUPABASE_REGION}.pooler.supabase.com:5432/postgres"

echo "✅ Connection strings generated"
echo ""

# Function to set Vercel environment variable
set_vercel_env() {
    local key=$1
    local value=$2
    local env_type=${3:-"production,preview,development"}
    
    echo "📝 Setting $key..."
    
    # Create or update environment variable
    response=$(curl -s -X POST \
        "https://api.vercel.com/v10/projects/$VERCEL_PROJECT_ID/env" \
        -H "Authorization: Bearer $VERCEL_TOKEN" \
        -H "Content-Type: application/json" \
        -d "{
            \"key\": \"$key\",
            \"value\": \"$value\",
            \"type\": \"encrypted\",
            \"target\": [\"production\", \"preview\", \"development\"],
            \"gitBranch\": null,
            \"upsert\": \"true\"
        }")
    
    if echo "$response" | grep -q "\"created\""; then
        echo "  ✅ $key configured successfully"
    elif echo "$response" | grep -q "error"; then
        echo "  ❌ Failed to set $key"
        echo "  Response: $response"
        return 1
    else
        echo "  ℹ️  $key may already exist (response: $response)"
    fi
}

echo "🔧 Configuring Vercel Environment Variables..."
echo "============================================================"
echo ""

# Set DATABASE_URL
set_vercel_env "DATABASE_URL" "$DATABASE_URL"

# Set DIRECT_URL
set_vercel_env "DIRECT_URL" "$DIRECT_URL"

# Set NEXT_PUBLIC_SUPABASE_URL
set_vercel_env "NEXT_PUBLIC_SUPABASE_URL" "$SUPABASE_PROJECT_URL"

# Set NEXT_PUBLIC_SUPABASE_ANON_KEY
ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlxZG9ta294bmNhd3J6d3JyeWRyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk5Mjc2NzUsImV4cCI6MjA3NTUwMzY3NX0.EngmT5oKDjMXO9CatzFNWOmvtHPiH5AVLActCf-MQXg"
set_vercel_env "NEXT_PUBLIC_SUPABASE_ANON_KEY" "$ANON_KEY"

echo ""
echo "✅ Environment variables configured successfully!"
echo ""

# Trigger redeployment
echo "🚀 Triggering Vercel Redeployment..."
echo "============================================================"
echo ""

# Get latest deployment
LATEST_DEPLOYMENT=$(curl -s \
    "https://api.vercel.com/v6/deployments?projectId=$VERCEL_PROJECT_ID&teamId=$VERCEL_TEAM_ID&limit=1" \
    -H "Authorization: Bearer $VERCEL_TOKEN" | jq -r '.deployments[0].uid')

if [ -z "$LATEST_DEPLOYMENT" ] || [ "$LATEST_DEPLOYMENT" = "null" ]; then
    echo "❌ Could not get latest deployment"
    echo "Please redeploy manually:"
    echo "1. Go to: https://vercel.com/$VERCEL_TEAM_ID/flowstatemax"
    echo "2. Click 'Deployments'"
    echo "3. Click '...' on latest deployment → 'Redeploy'"
    echo "4. UNCHECK 'Use existing build cache'"
    echo "5. Click 'Redeploy'"
else
    echo "📦 Latest deployment: $LATEST_DEPLOYMENT"
    
    # Trigger redeploy
    redeploy_response=$(curl -s -X POST \
        "https://api.vercel.com/v13/deployments" \
        -H "Authorization: Bearer $VERCEL_TOKEN" \
        -H "Content-Type: application/json" \
        -d "{
            \"name\": \"flowstatemax\",
            \"project\": \"$VERCEL_PROJECT_ID\",
            \"target\": \"production\",
            \"gitSource\": {
                \"type\": \"github\",
                \"ref\": \"main\",
                \"repoId\": \"1070969046\"
            }
        }")
    
    NEW_DEPLOYMENT=$(echo "$redeploy_response" | jq -r '.id // .uid // empty')
    
    if [ -n "$NEW_DEPLOYMENT" ] && [ "$NEW_DEPLOYMENT" != "null" ]; then
        echo "✅ Redeployment triggered: $NEW_DEPLOYMENT"
        echo ""
        echo "Monitor deployment:"
        echo "https://vercel.com/$VERCEL_TEAM_ID/flowstatemax/$NEW_DEPLOYMENT"
    else
        echo "⚠️  Automatic redeploy may have failed"
        echo "Response: $redeploy_response"
        echo ""
        echo "Please redeploy manually:"
        echo "1. Go to: https://vercel.com/$VERCEL_TEAM_ID/flowstatemax"
        echo "2. Click 'Deployments'"
        echo "3. Click '...' → 'Redeploy' (UNCHECK build cache)"
    fi
fi

echo ""
echo "============================================================"
echo "✨ Connection Complete!"
echo "============================================================"
echo ""
echo "📊 Next Steps:"
echo "1. Wait for deployment to complete (~2 minutes)"
echo "2. Test onboarding: https://flowstatemax.vercel.app/onboarding"
echo "3. Verify data is saving to database"
echo ""
echo "🔍 Verify Database Connection:"
echo "   You can test if data is being saved by:"
echo "   1. Complete onboarding flow"
echo "   2. Check Supabase dashboard for new data in:"
echo "      - RitualItem table"
echo "      - FlowLocation table"  
echo "      - BlockedApp table"
echo ""
echo "📖 Connection Details (save these securely):"
echo "   DATABASE_URL: postgresql://postgres.$SUPABASE_PROJECT_REF:****@aws-0-$SUPABASE_REGION.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1"
echo "   DIRECT_URL: postgresql://postgres.$SUPABASE_PROJECT_REF:****@aws-0-$SUPABASE_REGION.pooler.supabase.com:5432/postgres"
echo ""

