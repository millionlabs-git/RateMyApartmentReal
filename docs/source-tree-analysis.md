# Source Tree Analysis

## Directory Structure

```
/home/runner/workspace/
├── client/                      # React frontend application
│   ├── index.html              # HTML entry point with Google Fonts
│   ├── public/                 # Static assets served directly
│   │   ├── nyc-day.mp4        # Day mode background video
│   │   └── nyc-background.mp4 # Night mode background video
│   └── src/                    # Frontend source code
│       ├── main.tsx           # ⚡ React entry point
│       ├── App.tsx            # ⚡ Root component with providers
│       ├── index.css          # Global styles and CSS variables
│       ├── components/        # React components
│       │   ├── ui/            # shadcn/ui component library (50+)
│       │   │   ├── button.tsx
│       │   │   ├── card.tsx
│       │   │   ├── dialog.tsx
│       │   │   ├── form.tsx
│       │   │   ├── input.tsx
│       │   │   ├── select.tsx
│       │   │   ├── sheet.tsx
│       │   │   ├── table.tsx
│       │   │   ├── toast.tsx
│       │   │   ├── toaster.tsx
│       │   │   └── ... (40+ more)
│       │   ├── theme-provider.tsx  # Dark/light theme context
│       │   └── theme-toggle.tsx    # Theme switcher component
│       ├── pages/             # Route-based pages
│       │   ├── home.tsx       # Homepage with hero section
│       │   └── not-found.tsx  # 404 error page
│       ├── hooks/             # Custom React hooks
│       │   ├── use-toast.ts   # Toast notification hook
│       │   └── use-mobile.tsx # Mobile detection hook
│       └── lib/               # Utilities
│           ├── utils.ts       # cn() class merging utility
│           └── queryClient.ts # TanStack Query configuration
│
├── server/                     # Express backend
│   ├── index.ts               # ⚡ Server entry point
│   ├── routes.ts              # API route definitions
│   ├── storage.ts             # Data access layer (IStorage interface)
│   ├── vite.ts                # Vite dev server integration
│   └── static.ts              # Production static file serving
│
├── shared/                     # Shared code between client/server
│   └── schema.ts              # ⚡ Drizzle database schema + Zod validation
│
├── attached_assets/            # Reference files and media
│   ├── NYC_Apartment_Review_Platform_PRD.docx  # Product requirements
│   ├── nyc-background.mp4     # Background video asset
│   └── rate_my_apartment_homepage.html         # Design reference
│
├── docs/                       # Generated documentation (this folder)
│
├── _bmad/                      # BMad Method tooling
├── _bmad-output/               # BMad workflow outputs
│
├── package.json               # Project dependencies and scripts
├── tsconfig.json              # TypeScript configuration
├── vite.config.ts             # Vite build configuration
├── tailwind.config.ts         # Tailwind CSS configuration
├── drizzle.config.ts          # Drizzle ORM configuration
├── postcss.config.js          # PostCSS configuration
├── components.json            # shadcn/ui configuration
├── replit.md                  # Existing architecture documentation
└── design_guidelines.md       # UI/UX design specifications
```

## Critical Directories

### `/client/src/` - Frontend Application
The React application entry point and all frontend code. Key patterns:
- Component-based architecture with shadcn/ui
- Wouter for declarative routing
- TanStack Query for server state
- Context API for theme management

### `/server/` - Backend API
Express server with middleware-based architecture:
- JSON body parsing
- Request logging
- Error handling
- Vite integration for development
- Static file serving for production

### `/shared/` - Shared Code
Database schema and types shared between client and server:
- Drizzle ORM schema definitions
- Zod validation schemas (via drizzle-zod)
- TypeScript type exports

### `/client/src/components/ui/` - Component Library
50+ shadcn/ui components built on Radix UI primitives:
- Fully styled with Tailwind CSS
- Accessible by default (ARIA)
- Customizable via CSS variables

## Entry Points

| Entry Point | File | Purpose |
|-------------|------|---------|
| React App | `client/src/main.tsx` | Renders App component to DOM |
| Express Server | `server/index.ts` | HTTP server startup |
| Database Schema | `shared/schema.ts` | Type definitions and validation |

## Key Files by Function

### Configuration
- `package.json` - Dependencies, scripts, project metadata
- `tsconfig.json` - TypeScript compiler options, path aliases
- `vite.config.ts` - Build tool configuration, plugins, aliases
- `tailwind.config.ts` - Design tokens, colors, typography, animations
- `drizzle.config.ts` - Database connection, migration output

### Application Logic
- `client/src/App.tsx` - Provider hierarchy, routing setup
- `client/src/pages/home.tsx` - Main homepage implementation
- `server/routes.ts` - API endpoint definitions
- `server/storage.ts` - Data access abstraction

### Styling
- `client/src/index.css` - CSS variables, global styles
- `tailwind.config.ts` - Theme extensions, custom utilities

## Path Aliases

Configured in `tsconfig.json` and `vite.config.ts`:

| Alias | Target | Usage |
|-------|--------|-------|
| `@/*` | `./client/src/*` | Import from client source |
| `@shared/*` | `./shared/*` | Import shared code |
| `@assets` | `./attached_assets` | Import static assets |

Example:
```typescript
import { Button } from "@/components/ui/button";
import { users } from "@shared/schema";
import videoUrl from "@assets/nyc-background.mp4";
```

## File Counts

| Directory | TypeScript | CSS | Config |
|-----------|------------|-----|--------|
| client/src | 57 files | 1 | - |
| server | 5 files | - | - |
| shared | 1 file | - | - |
| root | - | - | 7 files |
