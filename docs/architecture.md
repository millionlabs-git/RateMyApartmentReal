# Architecture Documentation

## Overview

RateMyApartment is a full-stack TypeScript web application following a monolithic architecture with clear separation between client, server, and shared code. The application uses React for the frontend, Express for the backend API, and PostgreSQL for data persistence.

## Architecture Pattern

**Pattern**: Layered Monolith with Shared Types

```
┌────────────────────────────────────────────────────────────────┐
│                     Presentation Layer                          │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  React Components (shadcn/ui + Custom)                    │  │
│  │  ├── Pages (home, not-found, ...)                        │  │
│  │  ├── UI Components (50+ shadcn/ui)                       │  │
│  │  └── Theme Provider                                       │  │
│  └──────────────────────────────────────────────────────────┘  │
├────────────────────────────────────────────────────────────────┤
│                      State Layer                                │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  TanStack Query (Server State)                            │  │
│  │  React Context (Theme State)                              │  │
│  │  Local State (Component State)                            │  │
│  └──────────────────────────────────────────────────────────┘  │
├────────────────────────────────────────────────────────────────┤
│                      API Layer                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Express Middleware Pipeline                              │  │
│  │  ├── JSON Parsing                                        │  │
│  │  ├── Request Logging                                     │  │
│  │  ├── Route Handlers (/api/*)                             │  │
│  │  └── Error Handler                                       │  │
│  └──────────────────────────────────────────────────────────┘  │
├────────────────────────────────────────────────────────────────┤
│                      Data Layer                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  IStorage Interface                                       │  │
│  │  ├── MemStorage (In-memory - Development)                │  │
│  │  └── DbStorage (PostgreSQL - Production)                 │  │
│  └──────────────────────────────────────────────────────────┘  │
├────────────────────────────────────────────────────────────────┤
│                      Schema Layer                               │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Drizzle ORM Schema (shared/schema.ts)                   │  │
│  │  Zod Validation (drizzle-zod)                            │  │
│  │  TypeScript Types (inferred)                             │  │
│  └──────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────┘
```

## Technology Stack

### Frontend Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| React | 18.3.1 | UI framework |
| TypeScript | 5.6.3 | Type safety |
| Wouter | 3.3.5 | Client-side routing |
| TanStack Query | 5.60.5 | Server state caching |
| Tailwind CSS | 3.4.17 | Utility-first styling |
| Radix UI | Various | Accessible primitives |
| Vite | 7.3.0 | Build tool |
| Lucide React | 0.453.0 | Icon library |

### Backend Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| Node.js | 20.19 | Runtime |
| Express | 4.21.2 | HTTP framework |
| Drizzle ORM | 0.39.3 | Database queries |
| PostgreSQL | - | Database |
| Zod | 3.24.2 | Validation |
| Passport | 0.7.0 | Authentication |

## Component Architecture

### Frontend Component Hierarchy

```
App
├── QueryClientProvider (TanStack Query)
│   └── ThemeProvider (Dark/Light mode)
│       └── TooltipProvider
│           ├── Toaster (Global notifications)
│           └── Router (Wouter)
│               ├── Home (/)
│               │   ├── Navbar
│               │   ├── Hero Section
│               │   │   ├── Video Background (Day/Night)
│               │   │   ├── Search Bar (Glassmorphic)
│               │   │   └── Theme Toggle
│               │   ├── How It Works
│               │   └── Footer
│               └── NotFound (*)
```

### Backend Request Flow

```
Request
  │
  ▼
┌─────────────────┐
│ express.json()  │  Parse JSON body
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Logging         │  Log API requests
│ Middleware      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Route Handler   │  /api/* endpoints
│ (routes.ts)     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Storage         │  IStorage interface
│ Interface       │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Error Handler   │  Catch & format errors
└─────────────────┘
```

## Data Architecture

### Database Schema (Drizzle ORM)

```typescript
// shared/schema.ts
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});
```

### Storage Interface Pattern

```typescript
// server/storage.ts
export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
}
```

This interface allows swapping between:
- `MemStorage` - In-memory storage for development
- `DbStorage` - PostgreSQL storage for production

### Planned Schema Expansion (Per PRD)

```
users          buildings         reviews
─────          ─────────         ───────
id             id                id
username       name              building_id → buildings.id
password       address           user_id → users.id
role           city              overall_rating
created_at     zip               floor_number
status         landlord          noise_rating
               neighborhood      cleanliness_rating
               building_type     maintenance_rating
               geocode_lat       safety_rating
               geocode_lng       pest_rating
               status            review_text
               created_at        is_anonymous
                                 status
                                 created_at

review_photos          duplicate_queue
─────────────          ───────────────
id                     id
review_id →            building_id_1 →
image_url              building_id_2 →
created_at             similarity_score
                       status
                       created_at
```

## State Management

### Server State (TanStack Query)

```typescript
// client/src/lib/queryClient.ts
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      staleTime: Infinity,
      retry: false,
    },
  },
});
```

### Theme State (React Context)

```typescript
// client/src/components/theme-provider.tsx
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    // Check localStorage or system preference
  });
  // Sync with document.documentElement.classList
}
```

## API Design

### Endpoint Pattern

All API endpoints follow the pattern:
- Prefix: `/api`
- Method: REST conventions (GET, POST, PUT, DELETE)
- Response: JSON with consistent error format

### Error Response Format

```json
{
  "message": "Error description"
}
```

## Security Considerations

### Implemented
- Password storage ready for bcrypt/Argon2 hashing
- Environment variable for DATABASE_URL
- CORS configured via Express
- Input validation via Zod schemas

### Planned (Per PRD)
- JWT-based session management
- HTTPS enforcement
- Rate limiting on auth endpoints
- XSS/SQL injection prevention

## Build & Deployment

### Development
```
npm run dev
```
- Vite dev server with HMR
- Express server with tsx watch
- Single port (5000) serves both

### Production Build
```
npm run build
npm run start
```
- Vite builds to `dist/public`
- esbuild compiles server to `dist/index.cjs`
- Express serves static files

## Integration Points

### Client → Server
- TanStack Query fetches from `/api/*`
- Credentials included for session auth
- Error handling with status codes

### Server → Database
- Drizzle ORM queries PostgreSQL
- Connection via `DATABASE_URL` env var
- Migrations via `drizzle-kit push`

### External Services (Planned)
- **Postmark API**: Email delivery (password reset, notifications)
- **Google Geocoding API**: Address validation, duplicate detection
