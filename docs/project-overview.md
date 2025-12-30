# RateMyApartment - Project Overview

## Executive Summary

**RateMyApartment** (also known as Rate My Apartment) is a community-driven web platform for NYC renters to find and share honest, anonymous reviews of apartment buildings across the five boroughs. The application features an editorial, warm design aesthetic inspired by Airbnb and Medium, with glassmorphic UI elements and a focus on transparency and trustworthiness.

## Project Information

| Attribute | Value |
|-----------|-------|
| **Project Name** | RateMyApartment |
| **Type** | Full-stack Web Application |
| **Repository Type** | Monolith (client/server/shared) |
| **Primary Language** | TypeScript |
| **Framework** | React 18 + Express |
| **Database** | PostgreSQL |

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                      RateMyApartment                         │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐     │
│  │   Client    │    │   Server    │    │   Shared    │     │
│  │  (React)    │◄──►│  (Express)  │◄──►│  (Schema)   │     │
│  └─────────────┘    └─────────────┘    └─────────────┘     │
│        │                   │                   │            │
│        ▼                   ▼                   ▼            │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐     │
│  │ Tailwind +  │    │ Drizzle ORM │    │ Zod Schema  │     │
│  │ shadcn/ui   │    │ + Passport  │    │ Validation  │     │
│  └─────────────┘    └─────────────┘    └─────────────┘     │
│                            │                                │
│                            ▼                                │
│                    ┌─────────────┐                         │
│                    │ PostgreSQL  │                         │
│                    └─────────────┘                         │
└─────────────────────────────────────────────────────────────┘
```

## Technology Stack Summary

### Frontend
- **React 18.3.1** - UI framework with hooks
- **TypeScript 5.6.3** - Type safety
- **Wouter 3.3.5** - Lightweight routing
- **TanStack Query 5.60.5** - Server state management
- **Tailwind CSS 3.4.17** - Utility-first styling
- **shadcn/ui** - 50+ Radix UI components
- **Vite 7.3.0** - Build tool with HMR

### Backend
- **Node.js 20.19** - JavaScript runtime
- **Express 4.21.2** - HTTP server framework
- **Drizzle ORM 0.39.3** - Type-safe database queries
- **PostgreSQL** - Primary database
- **Zod 3.24.2** - Schema validation
- **Passport 0.7.0** - Authentication (configured)

### Design System
- **Typography**: Instrument Serif (headlines) + DM Sans (body)
- **Colors**: Warm neutrals with Amber accent (#B45309)
- **Pattern**: Glassmorphic hero, editorial warmth

## Current Implementation Status

### Implemented
- Homepage with video background (day/night modes)
- Glassmorphic hero search bar
- Responsive navigation with mobile menu
- Dark/light theme toggle
- "How It Works" section
- Footer with navigation links
- 50+ UI components (shadcn/ui)
- Database schema for users
- Storage interface abstraction

### Pending (Per PRD)
- Building search functionality
- Building detail pages
- Review submission system
- User authentication flow
- Admin dashboard
- Building moderation
- Duplicate detection
- Photo uploads
- Floor insights charts

## Quick Reference

| Item | Location |
|------|----------|
| Frontend entry | `client/src/main.tsx` |
| App root | `client/src/App.tsx` |
| Homepage | `client/src/pages/home.tsx` |
| Server entry | `server/index.ts` |
| API routes | `server/routes.ts` |
| Database schema | `shared/schema.ts` |
| UI components | `client/src/components/ui/` |
| Design tokens | `tailwind.config.ts` |

## Related Documentation

- [Architecture](./architecture.md) - Technical architecture details
- [Source Tree](./source-tree-analysis.md) - Directory structure
- [Component Inventory](./component-inventory.md) - UI components
- [Development Guide](./development-guide.md) - Setup and commands
- [Data Models](./data-models.md) - Database schema
- [Design Guidelines](../design_guidelines.md) - UI/UX patterns

## PRD Reference

The full product requirements are documented in:
`attached_assets/NYC_Apartment_Review_Platform_PRD.docx`

Key features planned:
- Anonymous building reviews with multi-dimensional ratings
- Floor-level insights and interactive charts
- Photo uploads and galleries
- Admin moderation workflows
- Duplicate building detection
