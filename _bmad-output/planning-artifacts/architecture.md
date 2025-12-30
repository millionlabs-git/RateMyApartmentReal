---
stepsCompleted: [1, 2, 3, 4]
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

