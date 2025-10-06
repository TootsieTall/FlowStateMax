#!/bin/bash

# FlowState Complete Setup Script
# This script creates all remaining project files from the artifacts

set -e

echo "🚀 Setting up FlowState project structure..."
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Run this script from the root of the FlowStateMax repository"
    exit 1
fi

echo "📁 Creating directory structure..."

# Create all necessary directories
mkdir -p apps/web/src/app/{api,onboarding,today,week,explore,settings,flow,shutdown}
mkdir -p apps/web/src/app/api/{auth,sessions,blocks,goals,extension,ai,shutdown}
mkdir -p apps/web/src/{components,lib,hooks,store}
mkdir -p apps/web/prisma
mkdir -p apps/web/public/sounds

mkdir -p apps/extension/src/{background,content,options,shared,utils}
mkdir -p apps/extension/public/icons

mkdir -p packages/ui/src
mkdir -p packages/core/src/{validators,adapters}
mkdir -p packages/server/src/{ai,metrics}

mkdir -p docs
mkdir -p scripts
mkdir -p tests

echo "✅ Directory structure created!"
echo ""
echo "📝 Next steps to complete the setup:"
echo ""
echo "1. All critical configuration files are already in the repo"
echo "2. You need to add the remaining files from the artifacts in this conversation"
echo ""
echo "🎯 Priority files to add (check artifacts in chat):"
echo ""
echo "   📦 Artifact 3: Prisma Schema"
echo "      → apps/web/prisma/schema.prisma"
echo "      → apps/web/prisma/seed.ts"
echo ""
echo "   📦 Artifact 4: Next.js Core Files"
echo "      → apps/web/src/app/layout.tsx"
echo "      → apps/web/src/app/page.tsx"
echo "      → apps/web/src/lib/auth.ts"
echo "      → apps/web/src/lib/prisma.ts"
echo "      → apps/web/package.json"
echo "      → apps/web/next.config.js"
echo "      → apps/web/tailwind.config.js"
echo ""
echo "   📦 Artifact 5: UI Components"
echo "      → packages/ui/src/*.tsx files"
echo ""
echo "   📦 Artifact 6: Chrome Extension"
echo "      → apps/extension/manifest.json"
echo "      → apps/extension/src/**/*.ts files"
echo ""
echo "   📦 Artifacts 7-9: Pages & Components"
echo "      → All app pages and React components"
echo ""
echo "⚡ Quick start after adding files:"
echo ""
echo "   npm install"
echo "   cd apps/web"
echo "   npx prisma generate"
echo "   npx prisma db push"
echo "   npx prisma db seed"
echo "   cd ../.."
echo "   npm run dev"
echo ""
echo "📚 See README.md for detailed instructions"
echo ""
echo "💡 TIP: Copy files from artifacts in order (3, 4, 5, 6, 7, 8, 9, 10)"
echo "     Each artifact header shows the file paths"
