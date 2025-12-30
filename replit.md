# Rate My Apartment — NYC Building Reviews

## Overview

A community-driven platform for NYC renters to find and share honest, anonymous reviews of apartment buildings. The application features an editorial, warm design aesthetic inspired by Airbnb and Medium, with glassmorphic UI elements and a focus on transparency and trustworthiness.

## Recent Changes (December 30, 2025)

- **Homepage Implementation**: Full-screen hero section with NYC video background, glassmorphic search bar, "How It Works" section, and footer
- **Responsive Navigation**: Fixed navbar with scroll-based background transition, mobile hamburger menu using Sheet component
- **Design Tokens**: Configured Instrument Serif and DM Sans fonts, warm neutral color palette with amber accents
- **Video Integration**: Background video (nyc-background.mp4) imported via @assets alias and properly served by Vite

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight React router)
- **State Management**: TanStack React Query for server state
- **Styling**: Tailwind CSS with custom design tokens
- **Component Library**: shadcn/ui (Radix UI primitives with custom styling)
- **Build Tool**: Vite with custom plugins for Replit integration

### Backend Architecture
- **Runtime**: Node.js with Express
- **Language**: TypeScript (ESM modules)
- **API Structure**: RESTful endpoints prefixed with `/api`
- **Storage Pattern**: Interface-based storage abstraction (`IStorage`) currently using in-memory implementation (`MemStorage`), designed for easy database migration

### Database Layer
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Schema Location**: `shared/schema.ts` (shared between client and server)
- **Validation**: Zod schemas generated from Drizzle schemas via `drizzle-zod`
- **Migrations**: Managed via `drizzle-kit push`

### Design System
- **Typography**: Instrument Serif (headlines), DM Sans (body/UI)
- **Color Palette**: Warm neutrals with amber accent (#D97706)
- **Component Patterns**: Glassmorphic hero elements, white cards with subtle borders, editorial warmth
- **Spacing**: Tailwind units (4, 8, 12, 16, 20, 24, 32)

### Project Structure
```
├── client/src/          # React frontend
│   ├── components/ui/   # shadcn/ui components
│   ├── pages/           # Route components
│   ├── hooks/           # Custom React hooks
│   └── lib/             # Utilities and query client
├── server/              # Express backend
│   ├── routes.ts        # API route definitions
│   ├── storage.ts       # Data access layer
│   └── static.ts        # Static file serving
├── shared/              # Shared types and schemas
│   └── schema.ts        # Drizzle database schema
└── attached_assets/     # Static assets and reference files
```

## External Dependencies

### Database
- **PostgreSQL**: Primary database (connection via `DATABASE_URL` environment variable)
- **connect-pg-simple**: Session storage for Express

### UI/Component Libraries
- **Radix UI**: Headless component primitives (dialogs, dropdowns, forms, etc.)
- **Lucide React**: Icon library
- **Embla Carousel**: Carousel component
- **cmdk**: Command palette component
- **Vaul**: Drawer component
- **react-day-picker**: Calendar/date picker

### Build & Development
- **Vite**: Frontend build tool with HMR
- **esbuild**: Server bundling for production
- **Replit plugins**: Dev banner, cartographer, runtime error overlay