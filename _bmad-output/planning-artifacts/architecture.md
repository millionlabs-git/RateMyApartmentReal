---
stepsCompleted: [1, 2]
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

