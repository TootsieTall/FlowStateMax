# 🌅 Daybreak - Flow State Productivity

> **Capture the golden hour of productivity. Deep work made easy and rewarding.**

Daybreak (formerly FlowStateMax) is a productivity app based on Cal Newport's Deep Work methodology. It helps you achieve deep focus and eliminate distractions through location-based triggers, app blocking, and structured planning with a warm, inviting golden hour design.

## ✨ Key Features

- **📍 Location-Based Flow Triggers**: Automatic notifications when entering your designated flow zones
- **🔒 Smart App Blocking**: Breathing exercise intervention before opening distracting apps
- **🎨 Monochrome Mode**: Grayscale browser during flow sessions to reduce digital temptation
- **📅 Visual Planning**: Drag-drop weekly calendar with color-coded time blocks
- **🎯 Daily Goals**: Morning prompts for 1-3 major goals
- **🌙 Shutdown Ritual**: Guided end-of-day process to properly close out work
- **🧠 Boredom Training**: Optional meditation and AI thinking partner
- **🏋️ Active Recovery**: Gym tracking and intentional downtime activities

## 🚀 Quick Start

Get the app running in 10 minutes:

```bash
# Clone and install
git clone https://github.com/TootsieTall/FlowStateMax.git
cd FlowStateMax
npm install

# Set up environment
cd apps/web
cp .env.example .env.local
# Edit .env.local with your database and OAuth credentials

# Initialize database
npx prisma generate
npx prisma db push
npx prisma db seed

# Start development server
cd ../..
npm run dev
```

**📖 Full setup guide**: See [QUICKSTART.md](./QUICKSTART.md)

## 🏗️ Project Structure

```
flowstate/
├── apps/
│   ├── web/                 # Next.js web application
│   │   ├── src/
│   │   │   ├── app/        # App Router pages
│   │   │   ├── components/ # React components
│   │   │   └── lib/        # Utilities (auth, prisma, AI)
│   │   └── prisma/         # Database schema & seed
│   └── extension/          # Chrome extension
│       ├── src/
│       │   ├── background/ # Service worker
│       │   ├── content/    # Content scripts
│       │   └── options/    # Settings page
│       └── manifest.json
├── packages/
│   ├── ui/                 # Shared UI components
│   ├── core/               # Types, constants, validators
│   └── server/             # Server utilities
└── docs/                   # Documentation
```

## ✅ Implementation Status

### Completed ✅
- [x] Monorepo setup with Turborepo
- [x] Next.js 14 web application
- [x] Prisma database schema with PostgreSQL
- [x] NextAuth.js authentication (Google OAuth)
- [x] **Today View** - Main dashboard with current block & daily goals
- [x] **Week View** - Calendar grid for time blocking
- [x] **UI Components** - Button, BlockCard, Timer, Modal, BreathOverlay
- [x] **Core Package** - Types, constants, validators
- [x] **API Routes** - Sessions, blocks, goals
- [x] **Chrome Extension** - Full implementation
  - [x] Background service worker
  - [x] Content scripts for blocking & grayscale
  - [x] Breathing exercise overlay
  - [x] Options page
  - [x] Popup interface
- [x] Database seeding with demo data
- [x] Onboarding flow (partial)

### In Progress 🚧
- [ ] Onboarding complete flow (7 screens)
- [ ] Settings pages
- [ ] Explore tab features
- [ ] Shutdown ritual flow
- [ ] Quick capture with AI
- [ ] Deadline breakdown with AI
- [ ] Mobile responsiveness

### Planned 📋
- [ ] Real-time session sync
- [ ] Spotify/Apple Music integration
- [ ] Geofencing with location triggers
- [ ] Podcast curation
- [ ] Metrics dashboard
- [ ] Social features (focus buddies)
- [ ] Mobile apps (iOS & Android)

## 🛠️ Tech Stack

**Frontend**
- Next.js 14 (App Router)
- React 18
- TypeScript
- Tailwind CSS
- Framer Motion (animations)

**Backend**
- Next.js API Routes
- Prisma ORM
- PostgreSQL
- NextAuth.js

**Extension**
- Chrome Extension Manifest V3
- Webpack bundler
- TypeScript

**Monorepo**
- Turborepo
- npm workspaces

## 📚 Documentation

- **[FlowState App - Complete Screen Map.svg](./FlowState%20App%20-%20Complete%20Screen%20Map.svg)** - Visual guide to all 40+ screens
- **[QUICKSTART.md](./QUICKSTART.md)** - Detailed setup instructions
- **[Project Instructions](./)** - Complete product spec and design principles
- **[CONTRIBUTING.md](./CONTRIBUTING.md)** - How to contribute
- **[SECURITY.md](./SECURITY.md)** - Security policy

## 🎯 Design Philosophy

1. **Minimal Friction**: 5-min setup, 1-min daily overhead
2. **One Primary Screen**: Today View is the hub
3. **Eliminate Choice Paralysis**: Clear next actions, not overwhelming options
4. **Progressive Disclosure**: Advanced features hidden until needed
5. **Metrics Hidden by Default**: Focus on doing, not tracking
6. **Native Feel**: Deep OS integration

## 🚢 Deployment

### Web App

**Recommended**: Deploy to Vercel (zero-config for Next.js)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

**Environment variables needed**:
- `DATABASE_URL`
- `NEXTAUTH_URL`
- `NEXTAUTH_SECRET`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`

### Chrome Extension

```bash
cd apps/extension
npm run build
```

Then:
1. Go to `chrome://extensions/`
2. Enable Developer mode
3. Click "Load unpacked"
4. Select `apps/extension/dist` folder

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

### Development Workflow

```bash
# Install dependencies
npm install

# Start dev server (all apps)
npm run dev

# Run specific app
npm run dev --filter=web

# Build all
npm run build

# Lint
npm run lint

# Database migrations
cd apps/web
npx prisma migrate dev
```

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## 🙏 Acknowledgments

- **Cal Newport** - For the Deep Work methodology that inspired this app
- **One Sec** - Inspiration for breathing intervention
- **Opal** - Inspiration for app blocking approach
- **Sunsama** - Inspiration for time blocking UI

## 📧 Contact

- **Issues**: https://github.com/TootsieTall/FlowStateMax/issues
- **Discussions**: https://github.com/TootsieTall/FlowStateMax/discussions

---

**Built with ❤️ for deep workers everywhere**

*"The ability to perform deep work is becoming increasingly rare at exactly the same time it is becoming increasingly valuable in our economy. As a consequence, the few who cultivate this skill, and then make it the core of their working life, will thrive."* - Cal Newport
