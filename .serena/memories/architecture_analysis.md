# FlowStateMax Architecture Analysis

## Project Overview
- **Type**: Productivity/Deep Work application
- **Architecture**: Turborepo monorepo with 2 apps + 2 shared packages
- **Tech Stack**: Next.js 14, React 18, TypeScript, Prisma, PostgreSQL, Chrome Extension

## Architectural Structure

### Monorepo Configuration
```
flowstate/
├── apps/
│   ├── web/              # Next.js 14 App Router application
│   └── extension/        # Chrome Extension (Manifest V3)
├── packages/
│   ├── ui/               # Shared React UI components
│   ├── core/             # Types, constants, validators (Zod)
│   └── server/           # Server utilities (referenced but not found)
```

### Technology Stack by Layer

**Frontend (Web App)**
- Next.js 14 with App Router
- React 18 + TypeScript
- Tailwind CSS for styling
- Framer Motion for animations
- @tanstack/react-query for server state
- Zustand for client state
- @dnd-kit for drag-drop interactions

**Backend (Web App)**
- Next.js API Routes (serverless)
- Prisma ORM + PostgreSQL
- NextAuth.js (Google OAuth)
- Database-based sessions

**Extension**
- Manifest V3 service worker
- Content scripts with CSS injection
- Webpack bundler
- Chrome APIs (storage, tabs, declarativeNetRequest, alarms, notifications)

**Shared Packages**
- `@flowstate/core`: Types, constants, Zod validators
- `@flowstate/ui`: React components (Button, Timer, Modal, BlockCard, BreathOverlay)
- `@flowstate/server`: Referenced but directory not found

## Architectural Patterns

### Design Patterns Identified

1. **Repository Pattern** (Partial)
   - Prisma client acts as data access layer
   - Direct DB queries in API routes (not fully abstracted)

2. **Provider Pattern**
   - SessionProvider (NextAuth)
   - QueryClientProvider (React Query)
   - Centralized in `providers.tsx`

3. **Layered Architecture**
   - Presentation: React components + pages
   - API: Next.js route handlers
   - Data: Prisma + PostgreSQL
   - Shared: Core types + UI components

4. **Monorepo Package Strategy**
   - Code sharing via workspace packages
   - TypeScript references for type sharing
   - Turborepo for build orchestration

5. **State Management Pattern**
   - Server state: React Query
   - Client state: Zustand
   - Session state: NextAuth + database
   - Extension state: Chrome storage API

### Communication Patterns

**Web App ↔ Database**
- Prisma ORM for type-safe queries
- Connection pooling via Prisma Client

**Web App ↔ Extension**
- chrome.runtime.sendMessage for bidirectional communication
- Extension checks: GET_SESSION_STATUS, ENABLE_GLOBAL_GRAYSCALE
- Host permissions for localhost:3000 and flowstate.app

**Client ↔ Server (Web App)**
- React Query for data fetching/caching
- Next.js API routes with auth middleware
- RESTful conventions (GET, POST, PATCH, DELETE)

## Data Model Architecture

### Core Entities (11 models)

**User Management**
- User (central hub)
- Account (OAuth providers)
- Session (auth sessions)

**Deep Work Features**
- TimeBlock (calendar events)
- Task (todo items)
- FlowSession (focus tracking)
- DailyGoal (1-3 daily goals)

**Settings**
- FlowLocation (geofencing)
- BlockedApp (app blockers)
- RitualItem (shutdown ritual)

**Logging**
- ShutdownLog (daily closure)

### Relationships
- User has one-to-many with all entities
- TimeBlock ↔ Task (optional linkage)
- Cascade deletes on user deletion
- Enums: BlockType (5 types), Impact (2 levels)

## Authentication & Authorization

**Strategy**: NextAuth.js with database sessions
- Google OAuth provider
- PrismaAdapter for session storage
- Custom session callback for user.id injection
- Session strategy: database (not JWT)

**Authorization Pattern**
- getServerSession() in all API routes
- User ID from session for data scoping
- Consistent 401 for unauthorized access

## Key Architectural Decisions

1. **App Router (Next.js 14)** - Modern routing with server components
2. **Database Sessions** - More secure than JWT, enables revocation
3. **Monorepo Structure** - Code sharing between web + extension
4. **Manifest V3** - Future-proof extension architecture
5. **Prisma + PostgreSQL** - Type-safe ORM with relational DB
6. **Turborepo** - Incremental builds, task orchestration
7. **Zustand over Redux** - Simpler state management
8. **React Query** - Server state separation from client state

## Architecture Strengths

✅ **Type Safety Throughout**
- TypeScript in all packages
- Prisma generates types from schema
- Shared `@flowstate/core` types
- End-to-end type safety

✅ **Modern Stack Choices**
- Next.js 14 App Router
- React Server Components support
- Manifest V3 extension
- Prisma with PostgreSQL

✅ **Clean Separation of Concerns**
- API routes separate from UI
- Shared packages avoid duplication
- Content scripts isolated from background
- Clear monorepo boundaries

✅ **Security Conscious**
- NextAuth.js for OAuth
- Database sessions (revocable)
- Auth checks in all API routes
- Cascade deletes for data cleanup

✅ **Developer Experience**
- Turborepo for fast builds
- Hot reload in development
- Prisma Studio for DB exploration
- TypeScript for autocomplete

## Architecture Weaknesses

⚠️ **Missing Service Layer**
- API routes contain business logic
- No abstraction between routes and DB
- Difficult to test in isolation
- Violates Single Responsibility Principle

⚠️ **Inconsistent Error Handling**
- Console.error instead of logging service
- Generic error messages to client
- No error tracking/monitoring
- Inconsistent status codes

⚠️ **No Input Validation Layer**
- Request bodies not validated with Zod
- Type safety stops at API boundary
- SQL injection risk mitigated by Prisma but no validation
- Core package has validators but not used in routes

⚠️ **Missing Server Package**
- Referenced in web/package.json but doesn't exist
- Broken dependency reference
- Could cause build failures

⚠️ **State Management Complexity**
- Three state management solutions (Zustand, React Query, NextAuth)
- Extension state separate from web state
- Synchronization challenges
- No clear state ownership boundaries

⚠️ **Lack of API Versioning**
- No /v1/ or versioning strategy
- Breaking changes would affect all clients
- No deprecation strategy

⚠️ **No Testing Infrastructure**
- No test files visible
- No testing packages in dependencies
- No CI/CD configuration
- Quality assurance gaps

⚠️ **Hardcoded Configuration**
- Extension host permissions hardcoded
- No environment-based configuration
- Magic strings throughout codebase

⚠️ **Missing Observability**
- No logging infrastructure
- No monitoring/metrics
- No performance tracking
- Console.log for debugging only

⚠️ **Extension-Web Coupling**
- Tight coupling via message passing
- No formal API contract
- Version mismatch risks
- Testing extension-web integration difficult

## Design Principles Assessment

**Followed Principles:**
- ✅ DRY: Shared packages reduce duplication
- ✅ Separation of Concerns: Clear layer boundaries
- ✅ Type Safety: TypeScript + Prisma types

**Violated Principles:**
- ❌ Single Responsibility: API routes do too much
- ❌ Dependency Inversion: Routes depend on Prisma directly
- ❌ Open/Closed: Hard to extend without modifying
- ❌ YAGNI: Some over-engineering in state management

## Scalability Considerations

**Current Limitations:**
1. **Database**: Single PostgreSQL instance, no read replicas
2. **API Routes**: Serverless limitations (timeout, cold starts)
3. **State Sync**: Extension-web sync not real-time
4. **File Structure**: Flat API routes will become unwieldy at scale

**Growth Bottlenecks:**
1. Prisma queries in API routes (N+1 queries risk)
2. No caching layer (Redis, CDN)
3. No background job processing
4. No rate limiting
5. Session table growth over time

## Technology Debt

1. **Outdated Dependencies**
   - Next.js 14.0.4 (stable is 14.2+)
   - Several packages could be updated

2. **Missing Infrastructure**
   - No CI/CD pipelines
   - No automated testing
   - No database migrations (only push)
   - No deployment configuration

3. **Incomplete Features**
   - Onboarding flow partial
   - Settings pages missing
   - Mobile responsiveness incomplete
   - Real-time sync not implemented

## Security Assessment

**Strengths:**
- ✅ NextAuth.js with OAuth
- ✅ Database sessions
- ✅ Prisma ORM (SQL injection protection)
- ✅ Auth checks in routes

**Vulnerabilities:**
- ⚠️ No input validation with Zod
- ⚠️ No rate limiting
- ⚠️ No CSRF protection visible
- ⚠️ No request size limits
- ⚠️ Error messages may leak info
- ⚠️ No API key rotation strategy
- ⚠️ Environment variables in .env.example

## Performance Considerations

**Optimizations Present:**
- React Query caching (1 min staleTime)
- Prisma connection pooling
- Next.js automatic code splitting
- Turborepo build caching

**Performance Gaps:**
- No database indexing strategy visible
- No query optimization (N+1 risk)
- No CDN for static assets
- No image optimization strategy
- No lazy loading for routes
- Bundle size not monitored

## Recommended Architecture

See separate recommendations section for detailed improvements.