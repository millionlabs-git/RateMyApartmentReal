# Development Guide

## Prerequisites

- Node.js 20.x or higher
- PostgreSQL database (or use Replit's built-in database)
- npm or bun package manager

## Environment Variables

Create a `.env` file or set these environment variables:

```bash
# Required
DATABASE_URL=postgresql://user:password@host:port/database

# Optional
PORT=5000
NODE_ENV=development
```

## Installation

```bash
# Install dependencies
npm install

# Push database schema
npm run db:push
```

## Development Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with HMR |
| `npm run build` | Build for production |
| `npm run start` | Run production build |
| `npm run check` | TypeScript type checking |
| `npm run db:push` | Push schema to database |

## Development Server

The development server runs both frontend and backend on a single port:

```bash
npm run dev
```

- **URL**: `http://localhost:5000`
- **API**: `http://localhost:5000/api/*`
- **HMR**: Vite hot module replacement enabled
- **Logging**: API requests logged to console

## Project Structure

```
├── client/src/           # React frontend
│   ├── components/       # UI components
│   ├── pages/           # Route pages
│   ├── hooks/           # Custom hooks
│   └── lib/             # Utilities
├── server/              # Express backend
└── shared/              # Shared code
```

## Adding New Pages

1. Create page component in `client/src/pages/`:

```tsx
// client/src/pages/search.tsx
export default function Search() {
  return (
    <div>Search Page</div>
  );
}
```

2. Add route in `client/src/App.tsx`:

```tsx
import Search from "@/pages/search";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/search" component={Search} />
      <Route component={NotFound} />
    </Switch>
  );
}
```

## Adding API Endpoints

Add routes in `server/routes.ts`:

```typescript
export async function registerRoutes(httpServer: Server, app: Express) {
  // GET endpoint
  app.get("/api/buildings", async (req, res) => {
    const buildings = await storage.getBuildings();
    res.json(buildings);
  });

  // POST endpoint
  app.post("/api/buildings", async (req, res) => {
    const building = await storage.createBuilding(req.body);
    res.status(201).json(building);
  });

  return httpServer;
}
```

## Adding Database Tables

1. Define schema in `shared/schema.ts`:

```typescript
export const buildings = pgTable("buildings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  address: text("address").notNull(),
});

export const insertBuildingSchema = createInsertSchema(buildings);
export type InsertBuilding = z.infer<typeof insertBuildingSchema>;
export type Building = typeof buildings.$inferSelect;
```

2. Push schema changes:

```bash
npm run db:push
```

3. Add to storage interface in `server/storage.ts`:

```typescript
export interface IStorage {
  // ... existing methods
  getBuildings(): Promise<Building[]>;
  createBuilding(building: InsertBuilding): Promise<Building>;
}
```

## Adding UI Components

### Using Existing shadcn/ui Components

Import from `@/components/ui/`:

```tsx
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
```

### Adding New shadcn/ui Components

Components can be added using the shadcn CLI or by copying from ui.shadcn.com:

```bash
npx shadcn@latest add [component-name]
```

Or manually copy component code to `client/src/components/ui/`.

## Styling Guidelines

### Tailwind CSS

Use Tailwind utility classes:

```tsx
<div className="flex items-center gap-4 p-6 bg-white rounded-xl shadow-sm">
  <h2 className="font-serif text-2xl text-[#1C1917]">Title</h2>
</div>
```

### Design Tokens

Reference design system colors:

| Color | Hex | Usage |
|-------|-----|-------|
| Ink | `#1C1917` | Primary text |
| Ink Light | `#57534E` | Secondary text |
| Stone | `#A8A29E` | Muted text |
| Cream | `#FDFAF6` | Background |
| Amber | `#B45309` | Accent/CTA |

### Typography

```tsx
// Headlines - Instrument Serif
<h1 className="font-serif text-4xl">Headline</h1>

// Body - DM Sans
<p className="font-sans text-base">Body text</p>
```

## Data Fetching

Use TanStack Query for server state:

```tsx
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

// Fetching data
function useBuildings() {
  return useQuery({
    queryKey: ["/api/buildings"],
  });
}

// Mutating data
function useCreateReview() {
  return useMutation({
    mutationFn: (data) => apiRequest("POST", "/api/reviews", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/reviews"] });
    },
  });
}
```

## Theme Support

The app supports dark/light modes via ThemeProvider:

```tsx
import { useTheme } from "@/components/theme-provider";

function MyComponent() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <div className={isDark ? "bg-gray-900" : "bg-white"}>
      Content
    </div>
  );
}
```

Use Tailwind's dark: variant:

```tsx
<div className="bg-white dark:bg-gray-900 text-black dark:text-white">
  Automatically themed content
</div>
```

## Testing

Testing setup is pending. Recommended stack:
- **Vitest** for unit tests
- **Playwright** for E2E tests
- **React Testing Library** for component tests

## Debugging

### Server Logs

API requests are logged with timing:

```
12:34:56 PM [express] GET /api/buildings 200 in 15ms
```

### React DevTools

Install React DevTools browser extension for component inspection.

### Database

Inspect database with Drizzle Studio:

```bash
npx drizzle-kit studio
```

## Production Build

```bash
# Build both client and server
npm run build

# Start production server
npm run start
```

Production build outputs:
- `dist/public/` - Static frontend files
- `dist/index.cjs` - Bundled server

## Deployment

The app is configured for Replit deployment:

1. Set `DATABASE_URL` secret
2. Run `npm run build`
3. Replit auto-starts with `npm run start`

For other platforms:
- Ensure PostgreSQL is accessible
- Set environment variables
- Run production build commands
