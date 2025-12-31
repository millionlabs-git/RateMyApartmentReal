---
stepsCompleted: [1, 2, 3, 4, 5, 6, 7, 8]
status: 'complete'
completedAt: '2025-12-30'
inputDocuments:
  - "NYC_Apartment_Review_Platform_PRD.docx"
  - "design_guidelines.md"
  - "replit.md"
  - "docs/project-overview.md"
  - "docs/architecture.md"
  - "docs/data-models.md"
  - "docs/component-inventory.md"
  - "docs/development-guide.md"
  - "docs/source-tree-analysis.md"
workflowType: 'architecture'
project_name: 'RateMyApartment'
user_name: 'finn'
date: '2025-12-30'
---

# Architecture Decision Document

_This document builds collaboratively through step-by-step discovery. Sections are appended as we work through each architectural decision together._

## Project Context Analysis

### Requirements Overview

**Functional Requirements:**

| Category | Key Requirements | Architectural Impact |
|----------|------------------|---------------------|
| **Building Management** | Add/search buildings, geocoded addresses, duplicate detection | Database design, external API integration (geocoding), search indexing |
| **Review System** | Multi-dimensional ratings (5 categories), floor-level data, anonymous option | Complex data model, aggregation queries, privacy controls |
| **User Authentication** | Registration, login, password reset, role-based access | Auth middleware, session management, email integration |
| **Admin Moderation** | Approve buildings/reviews, merge duplicates, suspend users | Admin routes, moderation queue, audit logging |
| **Media Handling** | Photo uploads with reviews, image galleries | Replit Object Storage, upload handling, image optimization |

**Non-Functional Requirements:**

| NFR | Requirement | Architectural Decision Driver |
|-----|-------------|------------------------------|
| **Performance** | Fast search, responsive UI | Query optimization, pagination, caching strategy |
| **Security** | Anonymous reviews, password hashing, XSS/SQL prevention | Input validation, secure auth, data sanitization |
| **Accessibility** | WCAG AA compliance | Semantic HTML, ARIA labels, focus management |
| **Scalability** | Handle growing NYC building database | Database indexing, API pagination |
| **Reliability** | Data integrity for reviews/ratings | Transaction handling, validation, backups |

**Scale & Complexity:**

- **Primary domain**: Full-stack web application (React + Express + PostgreSQL)
- **Complexity level**: Medium-High
- **Estimated architectural components**: 12-15 major features
- **User types**: 3 (anonymous, authenticated, admin)
- **Data entities**: 5+ (users, buildings, reviews, photos, duplicate_queue)

### Technical Constraints & Dependencies

**Existing Constraints (Brownfield):**
- React 18 + TypeScript frontend (established)
- Express + Drizzle ORM backend (established)
- PostgreSQL database (configured)
- shadcn/ui component library (50+ components available)
- Tailwind CSS with custom design tokens (established)
- Wouter routing (established)
- TanStack Query for server state (established)

**External Dependencies Required:**
- **Geocoding API** (Google Maps or similar) - Address validation, duplicate detection
- **Image Storage** - Replit Object Storage (native integration)
- **Email Service** (Postmark, SendGrid) - Password reset, notifications

**Environment:**
- Replit hosting (single port 5000)
- DATABASE_URL environment variable for PostgreSQL
- Replit Object Storage for media files

### Cross-Cutting Concerns Identified

| Concern | Affected Components | Resolution Approach |
|---------|---------------------|---------------------|
| **Authentication** | All protected routes, reviews, admin | Passport.js with session-based auth |
| **Authorization** | Admin routes, user-specific data | Role-based middleware |
| **Validation** | All form inputs, API requests | Zod schemas (already in place) |
| **Error Handling** | All API endpoints | Consistent error response format |
| **Logging** | API requests, admin actions | Request logging (partially implemented) |
| **Moderation State** | Buildings, reviews | Status field pattern (pending/approved/denied) |

## Starter Template Evaluation

### Primary Technology Domain

Full-stack web application - **Brownfield project with established stack**

### Existing Foundation (Not Starting Fresh)

This is a brownfield project. The technology stack has been established through prior development:

**Current Stack:**
- Frontend: React 18 + TypeScript + Vite + Tailwind + shadcn/ui
- Backend: Express + Drizzle ORM + PostgreSQL
- Validation: Zod with drizzle-zod integration
- Auth: Passport.js (configured, pending implementation)

### Architectural Decisions Already Made

**Language & Runtime:**
- TypeScript 5.6.3 with strict mode
- ESM modules throughout
- Node.js 20.x runtime

**Styling Solution:**
- Tailwind CSS with custom design tokens
- CSS variables for theming (dark/light mode)
- shadcn/ui component library

**Build Tooling:**
- Vite for frontend (HMR, fast builds)
- esbuild for server bundling
- Single-port development server

**Code Organization:**
- `/client/src/` - React frontend
- `/server/` - Express backend
- `/shared/` - Database schema and types

**Development Experience:**
- Hot module replacement via Vite
- TypeScript type checking
- Path aliases (@/, @shared/, @assets)

**Note:** No initialization needed - focus on extending existing architecture for pending features.

## Core Architectural Decisions

### Decision Summary

| Category | Decision | Rationale |
|----------|----------|-----------|
| **Authentication** | Cookie-based sessions + local auth | Single-domain app, matches PRD, simpler |
| **Session Store** | PostgreSQL via connect-pg-simple | Reuses existing database |
| **Pagination** | Offset-based (?page=&limit=) | Simple, sufficient for dataset size |
| **Error Format** | Simple { "message": "..." } | Consistent, easy to handle |
| **Search** | PostgreSQL ILIKE queries | No extra infrastructure, good for MVP |
| **Geocoding** | Google Maps API (synchronous) | Best NYC accuracy, immediate validation |
| **Email** | Postmark | Excellent deliverability |
| **File Storage** | Replit Object Storage | Native integration |
| **File Limits** | 5MB max, JPEG/PNG/WebP | Balanced size/quality |
| **File Naming** | reviews/{reviewId}/{uuid}.{ext} | Organized by review |

### Data Architecture

**Database:** PostgreSQL with Drizzle ORM (established)

**Schema Extensions Required:**
- Extend `users` table (add email, role, status, created_at)
- Add `buildings` table with geocode fields
- Add `reviews` table with multi-dimensional ratings
- Add `review_photos` table for image references
- Add `duplicate_queue` table for moderation

**Session Storage:**
- `connect-pg-simple` for Express session store
- Sessions table in PostgreSQL

### Authentication & Security

**Strategy:** Passport.js with Local Strategy
- Email/password authentication
- Bcrypt for password hashing
- express-session with PostgreSQL store
- httpOnly cookies for session ID

**Authorization:**
- Role-based: `user` | `admin`
- Middleware checks for protected routes
- Admin routes under `/api/admin/*`

### API & Communication Patterns

**Design:** RESTful API at `/api/*`

**Endpoints Pattern:**
- `GET /api/buildings` - List with pagination
- `GET /api/buildings/:id` - Single building with reviews
- `POST /api/buildings` - Create (authenticated)
- `POST /api/reviews` - Submit review (authenticated)
- `GET /api/admin/moderation` - Moderation queue (admin)

**Pagination:**
```
GET /api/buildings?page=1&limit=20&search=brooklyn
Response: { data: [...], pagination: { page, limit, total, totalPages } }
```

**Error Responses:**
```json
{ "message": "Building not found" }
```
Status codes: 400 (validation), 401 (unauth), 403 (forbidden), 404 (not found), 500 (server)

### External Integrations

**Google Maps Geocoding:**
- Called on building submission
- Validates NYC address
- Stores lat/lng for duplicate detection
- Environment variable: `GOOGLE_MAPS_API_KEY`

**Postmark Email:**
- Password reset emails
- Optional: review notifications
- Environment variable: `POSTMARK_API_KEY`

**Replit Object Storage:**
- Review photo uploads
- Path: `reviews/{reviewId}/{uuid}.{ext}`
- Max: 5MB per file
- Types: JPEG, PNG, WebP

### Infrastructure & Deployment

**Hosting:** Replit (established)
- Single port 5000
- Auto-scaling handled by platform

**Environment Variables:**
- `DATABASE_URL` - PostgreSQL connection
- `SESSION_SECRET` - Express session secret
- `GOOGLE_MAPS_API_KEY` - Geocoding
- `POSTMARK_API_KEY` - Email service

## Implementation Patterns & Consistency Rules

### Naming Patterns

**Database Naming:**

| Element | Convention | Example |
|---------|------------|---------|
| Tables | plural, snake_case | `users`, `buildings`, `reviews` |
| Columns | snake_case | `created_at`, `building_id`, `review_text` |
| Foreign keys | `{table}_id` | `user_id`, `building_id` |
| Indexes | `idx_{table}_{column}` | `idx_buildings_address` |

**API Naming:**

| Element | Convention | Example |
|---------|------------|---------|
| Endpoints | plural, kebab-case | `/api/buildings`, `/api/reviews` |
| Route params | `:id` format | `/api/buildings/:id` |
| Query params | snake_case | `?page=1&limit=20` |

**Code Naming:**

| Element | Convention | Example |
|---------|------------|---------|
| Components | PascalCase | `BuildingCard`, `ReviewForm` |
| Files | kebab-case.tsx | `building-card.tsx`, `review-form.tsx` |
| Functions | camelCase | `getBuildings`, `submitReview` |
| Variables | camelCase | `userId`, `buildingData` |
| Constants | SCREAMING_SNAKE | `MAX_FILE_SIZE`, `API_BASE_URL` |

### Structure Patterns

**Component Organization:**
```
client/src/components/
├── ui/                 # shadcn/ui primitives (existing)
├── buildings/          # Building feature components
│   ├── building-card.tsx
│   ├── building-list.tsx
│   └── building-detail.tsx
├── reviews/            # Review feature components
│   ├── review-form.tsx
│   ├── review-card.tsx
│   └── rating-display.tsx
├── auth/               # Auth feature components
│   ├── login-form.tsx
│   └── signup-form.tsx
└── admin/              # Admin feature components
    ├── moderation-queue.tsx
    └── duplicate-resolver.tsx
```

**Test File Location:**
- Co-located with source: `component.test.tsx` next to `component.tsx`
- Server tests: `server/__tests__/` directory

### Format Patterns

**API Response Format:**

Success (list):
```json
{
  "data": [...],
  "pagination": { "page": 1, "limit": 20, "total": 100, "totalPages": 5 }
}
```

Success (single/create/update):
```json
{ "data": { ... } }
```

Error:
```json
{ "message": "Error description" }
```

**HTTP Status Codes:**
- 200: Success
- 201: Created
- 400: Validation error
- 401: Unauthorized
- 403: Forbidden
- 404: Not found
- 500: Server error

### Process Patterns

**Query Loading Pattern:**
```tsx
const { data, isLoading, error } = useQuery(...);

if (isLoading) return <Skeleton className="h-32" />;
if (error) return <ErrorMessage message={error.message} />;
return <Content data={data} />;
```

**Mutation Pattern:**
```tsx
const { mutate, isPending } = useMutation({
  mutationFn: (data) => apiRequest("POST", "/api/resource", data),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["/api/resource"] });
    toast({ title: "Success", description: "Resource created" });
  },
  onError: (error) => {
    toast({ title: "Error", description: error.message, variant: "destructive" });
  },
});
```

**Form Submission Button:**
```tsx
<Button type="submit" disabled={isPending}>
  {isPending ? "Saving..." : "Save"}
</Button>
```

### Enforcement Guidelines

**All AI Agents MUST:**
1. Follow snake_case for database columns, camelCase for TypeScript
2. Use the `{ data, pagination?, message? }` response wrapper
3. Organize new components by feature under `components/{feature}/`
4. Use kebab-case for all component file names
5. Co-locate test files with source files
6. Use TanStack Query patterns for all data fetching
7. Handle loading/error states with early returns

**Anti-Patterns to Avoid:**
- Mixing camelCase in database columns
- Returning raw arrays without `{ data: [...] }` wrapper
- Creating components directly in `components/` root
- Using PascalCase for file names
- Inline loading/error handling instead of early returns

## Project Structure & Boundaries

### Complete Project Directory Structure

```
/home/runner/workspace/
├── client/                          # React frontend application
│   ├── index.html                   # HTML entry with Google Fonts
│   ├── public/                      # Static assets
│   │   ├── nyc-day.mp4             # Day mode background
│   │   └── nyc-background.mp4      # Night mode background
│   └── src/
│       ├── main.tsx                 # React entry point
│       ├── App.tsx                  # Root component, providers, routing
│       ├── index.css                # Global styles, CSS variables
│       │
│       ├── components/
│       │   ├── ui/                  # shadcn/ui primitives (existing)
│       │   │   ├── button.tsx
│       │   │   ├── card.tsx
│       │   │   ├── dialog.tsx
│       │   │   ├── form.tsx
│       │   │   ├── input.tsx
│       │   │   ├── select.tsx
│       │   │   ├── skeleton.tsx
│       │   │   ├── table.tsx
│       │   │   ├── toast.tsx
│       │   │   └── ... (40+ more)
│       │   │
│       │   ├── buildings/           # Building feature components
│       │   │   ├── building-card.tsx
│       │   │   ├── building-list.tsx
│       │   │   ├── building-detail.tsx
│       │   │   ├── building-form.tsx
│       │   │   └── building-search.tsx
│       │   │
│       │   ├── reviews/             # Review feature components
│       │   │   ├── review-card.tsx
│       │   │   ├── review-list.tsx
│       │   │   ├── review-form.tsx
│       │   │   ├── rating-display.tsx
│       │   │   ├── rating-input.tsx
│       │   │   └── photo-upload.tsx
│       │   │
│       │   ├── auth/                # Auth feature components
│       │   │   ├── login-form.tsx
│       │   │   ├── signup-form.tsx
│       │   │   ├── forgot-password.tsx
│       │   │   └── auth-guard.tsx
│       │   │
│       │   ├── admin/               # Admin feature components
│       │   │   ├── moderation-queue.tsx
│       │   │   ├── building-review.tsx
│       │   │   ├── duplicate-resolver.tsx
│       │   │   └── user-management.tsx
│       │   │
│       │   ├── layout/              # Layout components
│       │   │   ├── header.tsx
│       │   │   ├── footer.tsx
│       │   │   └── nav.tsx
│       │   │
│       │   ├── theme-provider.tsx   # Dark/light theme context
│       │   └── theme-toggle.tsx     # Theme switcher
│       │
│       ├── pages/                   # Route pages
│       │   ├── home.tsx             # Homepage (existing)
│       │   ├── search.tsx           # Building search results
│       │   ├── building.tsx         # Single building detail
│       │   ├── add-building.tsx     # Submit new building
│       │   ├── add-review.tsx       # Submit review for building
│       │   ├── login.tsx            # Login page
│       │   ├── signup.tsx           # Registration page
│       │   ├── forgot-password.tsx  # Password reset request
│       │   ├── reset-password.tsx   # Password reset form
│       │   ├── profile.tsx          # User profile
│       │   ├── admin/               # Admin pages
│       │   │   ├── dashboard.tsx
│       │   │   ├── moderation.tsx
│       │   │   └── users.tsx
│       │   └── not-found.tsx        # 404 page (existing)
│       │
│       ├── hooks/                   # Custom React hooks
│       │   ├── use-toast.ts         # Toast notifications (existing)
│       │   ├── use-mobile.tsx       # Mobile detection (existing)
│       │   ├── use-auth.ts          # Auth state hook
│       │   ├── use-buildings.ts     # Building queries
│       │   └── use-reviews.ts       # Review queries
│       │
│       └── lib/                     # Utilities
│           ├── utils.ts             # cn() utility (existing)
│           ├── queryClient.ts       # TanStack Query config (existing)
│           └── api.ts               # API helper functions
│
├── server/                          # Express backend
│   ├── index.ts                     # Server entry point
│   ├── routes.ts                    # API route registration
│   ├── storage.ts                   # IStorage interface + implementations
│   ├── vite.ts                      # Vite dev integration
│   ├── static.ts                    # Production static serving
│   │
│   ├── auth/                        # Authentication
│   │   ├── passport.ts              # Passport.js configuration
│   │   ├── session.ts               # Session store setup
│   │   └── routes.ts                # Auth endpoints
│   │
│   ├── middleware/                  # Express middleware
│   │   ├── auth.ts                  # requireAuth, requireAdmin
│   │   ├── validation.ts            # Zod schema validation
│   │   └── error-handler.ts         # Consistent error responses
│   │
│   ├── services/                    # Business logic
│   │   ├── geocoding.ts             # Google Maps API integration
│   │   ├── email.ts                 # Postmark email service
│   │   ├── storage.ts               # Replit Object Storage
│   │   └── duplicate-detection.ts   # Building duplicate logic
│   │
│   └── __tests__/                   # Server tests
│       ├── auth.test.ts
│       ├── buildings.test.ts
│       └── reviews.test.ts
│
├── shared/                          # Shared client/server code
│   └── schema.ts                    # Drizzle schema + Zod validation
│
├── migrations/                      # Database migrations (generated)
│
├── docs/                            # Project documentation
│   ├── index.md
│   ├── project-overview.md
│   ├── architecture.md
│   ├── source-tree-analysis.md
│   ├── component-inventory.md
│   ├── data-models.md
│   └── development-guide.md
│
├── _bmad-output/                    # BMad workflow artifacts
│   └── planning-artifacts/
│       └── architecture.md          # This document
│
├── package.json                     # Dependencies and scripts
├── tsconfig.json                    # TypeScript configuration
├── vite.config.ts                   # Vite build configuration
├── tailwind.config.ts               # Tailwind theme configuration
├── drizzle.config.ts                # Drizzle ORM configuration
├── postcss.config.js                # PostCSS configuration
├── components.json                  # shadcn/ui configuration
├── replit.md                        # Existing architecture notes
├── design_guidelines.md             # UI/UX specifications
└── .env                             # Environment variables (not committed)
```

### Architectural Boundaries

**API Boundaries:**

| Boundary | Endpoints | Auth Required |
|----------|-----------|---------------|
| Public API | `GET /api/buildings`, `GET /api/buildings/:id` | No |
| User API | `POST /api/buildings`, `POST /api/reviews` | Yes (user) |
| Admin API | `/api/admin/*` | Yes (admin role) |
| Auth API | `/api/auth/*` | Varies |

**Component Boundaries:**

| Layer | Responsibility | Communication |
|-------|----------------|---------------|
| Pages | Route handling, layout composition | Props to components |
| Feature Components | Feature-specific UI and logic | TanStack Query for data |
| UI Components | Reusable styled primitives | Props only, no data fetching |
| Hooks | Shared stateful logic | Return values to consumers |

**Service Boundaries:**

| Service | Location | External Dependencies |
|---------|----------|----------------------|
| Geocoding | `server/services/geocoding.ts` | Google Maps API |
| Email | `server/services/email.ts` | Postmark API |
| File Storage | `server/services/storage.ts` | Replit Object Storage |
| Database | `server/storage.ts` | PostgreSQL via Drizzle |

**Data Boundaries:**

| Boundary | Description |
|----------|-------------|
| Database Layer | All DB access through `storage.ts` interface |
| Validation Layer | Zod schemas validate at API entry points |
| Session Store | PostgreSQL via connect-pg-simple |

### Requirements to Structure Mapping

**Building Management:**
- Search UI: `client/src/components/buildings/building-search.tsx`
- List View: `client/src/components/buildings/building-list.tsx`
- Detail View: `client/src/pages/building.tsx`
- Create Form: `client/src/components/buildings/building-form.tsx`
- API Routes: `server/routes.ts` → `/api/buildings/*`
- Schema: `shared/schema.ts` → `buildings` table

**Review System:**
- Review Form: `client/src/components/reviews/review-form.tsx`
- Rating Display: `client/src/components/reviews/rating-display.tsx`
- Photo Upload: `client/src/components/reviews/photo-upload.tsx`
- API Routes: `server/routes.ts` → `/api/reviews/*`
- Schema: `shared/schema.ts` → `reviews`, `review_photos` tables

**User Authentication:**
- Login/Signup: `client/src/components/auth/`
- Auth State: `client/src/hooks/use-auth.ts`
- Passport Config: `server/auth/passport.ts`
- Session: `server/auth/session.ts`
- Middleware: `server/middleware/auth.ts`
- Schema: `shared/schema.ts` → `users` table (extended)

**Admin Moderation:**
- Queue UI: `client/src/components/admin/moderation-queue.tsx`
- Duplicate UI: `client/src/components/admin/duplicate-resolver.tsx`
- Admin Pages: `client/src/pages/admin/`
- API Routes: `server/routes.ts` → `/api/admin/*`
- Schema: `shared/schema.ts` → `duplicate_queue` table

### Integration Points

**Internal Communication:**
- Frontend ↔ Backend: REST API via TanStack Query
- Components ↔ State: React Context (theme), TanStack Query (server state)
- Server ↔ Database: Drizzle ORM

**External Integrations:**
- Google Maps Geocoding: `server/services/geocoding.ts`
- Postmark Email: `server/services/email.ts`
- Replit Object Storage: `server/services/storage.ts`

**Data Flow:**
```
User Input → React Form → API Request → Express Route
    → Zod Validation → Service Layer → Database
    → Response → TanStack Query Cache → UI Update
```

### File Organization Patterns

**Configuration Files:**
- Root level: Build tools, TypeScript, package management
- Environment: `.env` for secrets (DATABASE_URL, API keys)

**Source Organization:**
- Feature-based: Components grouped by domain (buildings, reviews, auth, admin)
- Shared utilities: `lib/` for cross-cutting helpers
- Type safety: Schemas in `shared/` for client/server type sharing

**Test Organization:**
- Component tests: Co-located (e.g., `building-card.test.tsx`)
- Server tests: `server/__tests__/` directory
- E2E tests: Future addition when testing framework configured

## Architecture Validation Results

### Coherence Validation ✅

**Decision Compatibility:**
All technology choices work together without conflicts. The React 18 + Express + PostgreSQL + Drizzle stack is a proven, well-integrated combination. Authentication via Passport.js with cookie-based sessions and PostgreSQL storage follows standard patterns with no version incompatibilities.

**Pattern Consistency:**
Implementation patterns align with technology choices. Naming conventions (snake_case for DB, camelCase for TypeScript, kebab-case for files) are consistently applied. The `{ data, pagination?, message? }` response wrapper and TanStack Query patterns are uniformly documented.

**Structure Alignment:**
Project structure fully supports architectural decisions. The brownfield codebase's existing organization (`client/`, `server/`, `shared/`) is extended naturally with new feature directories (`auth/`, `middleware/`, `services/`). Component boundaries are clear and respected.

### Requirements Coverage Validation ✅

**PRD Feature Coverage:**
All five PRD categories are architecturally supported:
- Building Management: Schema, API endpoints, and UI components mapped
- Review System: Multi-dimensional ratings, photo uploads, anonymous option covered
- User Authentication: Complete auth flow with Passport.js and session management
- Admin Moderation: Moderation queue, duplicate detection, user management defined
- Media Handling: Replit Object Storage integration with clear limits and paths

**Non-Functional Requirements Coverage:**
- Performance: Offset pagination, PostgreSQL ILIKE queries, database indexing
- Security: bcrypt hashing, httpOnly cookies, Zod validation, XSS prevention
- Accessibility: WCAG AA via shadcn/ui defaults and semantic HTML patterns
- Scalability: Paginated APIs and indexed queries support growing dataset
- Reliability: Drizzle transactions and validation at API entry points

### Implementation Readiness Validation ✅

**Decision Completeness:**
All critical decisions documented with specific versions (React 18, TypeScript 5.6.3, Node.js 20.x). External integrations (Google Maps, Postmark, Replit Object Storage) fully specified with environment variable requirements.

**Structure Completeness:**
Complete project tree defined with all files and directories. Every PRD feature mapped to specific locations. Integration points (API boundaries, service boundaries, data boundaries) clearly documented.

**Pattern Completeness:**
Comprehensive implementation patterns with code examples for:
- TanStack Query loading/mutation patterns
- Error handling with consistent response format
- Form submission with loading states
- Component organization by feature

### Gap Analysis Results

**Critical Gaps:** None identified

**Nice-to-Have Enhancements:**
- Testing framework setup (Vitest + React Testing Library recommended)
- CI/CD pipeline configuration
- Rate limiting for API endpoints
- Image optimization for uploads

These are not blocking and can be addressed during implementation phase.

### Architecture Completeness Checklist

**✅ Requirements Analysis**
- [x] Project context thoroughly analyzed
- [x] Scale and complexity assessed (Medium-High)
- [x] Technical constraints identified (Brownfield stack)
- [x] Cross-cutting concerns mapped (auth, validation, error handling)

**✅ Architectural Decisions**
- [x] Critical decisions documented with versions
- [x] Technology stack fully specified
- [x] Integration patterns defined (REST, TanStack Query)
- [x] Performance considerations addressed (pagination, ILIKE)

**✅ Implementation Patterns**
- [x] Naming conventions established
- [x] Structure patterns defined (feature-based)
- [x] Communication patterns specified (REST + Query)
- [x] Process patterns documented (loading, error, mutation)

**✅ Project Structure**
- [x] Complete directory structure defined
- [x] Component boundaries established
- [x] Integration points mapped
- [x] Requirements to structure mapping complete

### Architecture Readiness Assessment

**Overall Status:** READY FOR IMPLEMENTATION

**Confidence Level:** High - brownfield project with established patterns and clear extension points

**Key Strengths:**
- Proven technology stack already in production use
- 50+ shadcn/ui components ready for feature development
- Clear separation between client/server/shared code
- Comprehensive pattern documentation for AI agent consistency

**Areas for Future Enhancement:**
- Add testing infrastructure (Vitest, Playwright)
- Configure CI/CD pipeline
- Implement rate limiting for public APIs
- Add image optimization for review photos

### Implementation Handoff

**AI Agent Guidelines:**
- Follow all architectural decisions exactly as documented
- Use implementation patterns consistently across all components
- Respect project structure and boundaries
- Refer to this document for all architectural questions
- Organize new components by feature under `components/{feature}/`

**First Implementation Priority:**
Proceed to `create-epics-and-stories` workflow to break down PRD requirements into implementable user stories, then `sprint-planning` to begin implementation.

## Architecture Completion Summary

### Workflow Completion

**Architecture Decision Workflow:** COMPLETED
**Total Steps Completed:** 8
**Date Completed:** 2025-12-30
**Document Location:** `_bmad-output/planning-artifacts/architecture.md`

### Final Architecture Deliverables

**Complete Architecture Document**
- All architectural decisions documented with specific versions
- Implementation patterns ensuring AI agent consistency
- Complete project structure with all files and directories
- Requirements to architecture mapping
- Validation confirming coherence and completeness

**Implementation Ready Foundation**
- 10+ architectural decisions made (auth, pagination, search, geocoding, email, storage, etc.)
- 7 implementation pattern categories defined (naming, structure, format, process)
- 5 architectural component areas specified (buildings, reviews, auth, admin, media)
- All PRD requirements fully supported

**AI Agent Implementation Guide**
- Technology stack with verified versions (React 18, TS 5.6.3, Node 20.x)
- Consistency rules that prevent implementation conflicts
- Project structure with clear boundaries
- Integration patterns and communication standards

### Quality Assurance Checklist

**Architecture Coherence**
- [x] All decisions work together without conflicts
- [x] Technology choices are compatible
- [x] Patterns support the architectural decisions
- [x] Structure aligns with all choices

**Requirements Coverage**
- [x] All functional requirements are supported
- [x] All non-functional requirements are addressed
- [x] Cross-cutting concerns are handled
- [x] Integration points are defined

**Implementation Readiness**
- [x] Decisions are specific and actionable
- [x] Patterns prevent agent conflicts
- [x] Structure is complete and unambiguous
- [x] Examples are provided for clarity

---

**Architecture Status:** READY FOR IMPLEMENTATION

**Next Phase:** Begin implementation using the architectural decisions and patterns documented herein.

**Document Maintenance:** Update this architecture when major technical decisions are made during implementation.

