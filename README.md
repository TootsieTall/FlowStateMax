# FlowState - Deep Work Companion

> Cal Newport's Deep Work methodology as a complete daily operating system

FlowState is a desktop-first web application with a Chrome extension that guides you through your entire day—planning, execution, distraction blocking, and intentional recovery—in one seamless system.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- SQLite (bundled with Node)
- Chrome browser (for extension)

### Installation

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example apps/web/.env.local

# Initialize database
cd apps/web
npx prisma generate
npx prisma db push
npx prisma db seed
cd ../..

# Start development
npm run dev
```

Open http://localhost:3000

## 📦 Structure

- `apps/web` - Next.js application
- `apps/extension` - Chrome extension
- `packages/ui` - Shared components
- `packages/core` - Types & adapters
- `packages/server` - AI & metrics

## 🎯 Features

✅ Complete onboarding flow
✅ Today View (primary hub)
✅ Flow sessions with ritual
✅ Shutdown ritual
✅ Chrome extension with blocking

---

**Made with ❤️ for deep workers everywhere**
