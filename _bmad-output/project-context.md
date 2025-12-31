---
project_name: 'RateMyApartment'
user_name: 'finn'
date: '2025-12-30'
sections_completed: ['technology_stack', 'language_rules', 'framework_rules', 'database_rules', 'file_organization', 'api_patterns', 'critical_rules']
status: 'complete'
rule_count: 25
optimized_for_llm: true
---

# Project Context for AI Agents

_This file contains critical rules and patterns that AI agents must follow when implementing code in this project. Focus on unobvious details that agents might otherwise miss._

---

## Technology Stack & Versions

| Layer | Technology | Version |
|-------|------------|---------|
| **Frontend** | React | 18.3.1 |
| **Language** | TypeScript | 5.6.3 (strict mode) |
| **Backend** | Express | 4.21.2 |
| **Database** | PostgreSQL + Drizzle ORM | pg 8.16.3 / drizzle-orm 0.39.3 |
| **Build** | Vite | 7.3.0 |
| **Styling** | Tailwind CSS | 3.4.17 |
| **State** | TanStack Query | 5.60.5 |
| **Validation** | Zod + drizzle-zod | 3.24.2 / 0.7.0 |
| **UI** | shadcn/ui (Radix) | Various ^1.x |
| **Routing** | Wouter | 3.3.5 |
| **Auth** | Passport.js + passport-local | 0.7.0 / 1.0.0 |
| **Session** | express-session + connect-pg-simple | 1.18.1 / 10.0.0 |

**Module System:** ESM (`"type": "module"` in package.json)

---

## Critical Implementation Rules

### Language-Specific Rules (TypeScript)

- **Strict mode enabled** - all code must pass strict type checking
- **ESM modules** - use `import`/`export`, never `require`/`module.exports`
- **Path aliases**: `@/*` → `client/src/*`, `@shared/*` → `shared/*`
- **No `any` types** - use proper typing or `unknown` with type guards
- **Async/await preferred** over raw Promises for readability

### Framework-Specific Rules (React + Express)

**React:**
- Use TanStack Query for ALL server state (never `useState` for API data)
- Loading pattern: early return with `<Skeleton>` before content
- Error pattern: early return with `<ErrorMessage>` before content
- Mutations must call `queryClient.invalidateQueries()` on success
- Use `toast()` for user feedback on mutations

**Express:**
- All routes under `/api/*`
- Response format: `{ data: T }` or `{ data: T[], pagination: {...} }`
- Error format: `{ message: string }` with appropriate status code
- Validate all inputs with Zod schemas at route entry

### Database Rules (Drizzle + PostgreSQL)

- **Table names**: plural, snake_case (`users`, `buildings`, `reviews`)
- **Column names**: snake_case (`created_at`, `building_id`)
- **TypeScript names**: camelCase (`createdAt`, `buildingId`)
- All DB access through `storage.ts` interface
- Use `drizzle-zod` for insert/select schema generation

### File & Component Organization

- **File names**: kebab-case (`building-card.tsx`, `use-auth.ts`)
- **Component names**: PascalCase (`BuildingCard`, `ReviewForm`)
- **Feature organization**: `components/{feature}/` not `components/` root
- **Test files**: co-located (`component.test.tsx` next to `component.tsx`)
- **Server tests**: `server/__tests__/` directory

### API Response Patterns

```typescript
// List response
{ data: [...], pagination: { page, limit, total, totalPages } }

// Single item response
{ data: { ... } }

// Error response
{ message: "Error description" }
```

**Status codes**: 200 (OK), 201 (Created), 400 (Validation), 401 (Unauthorized), 403 (Forbidden), 404 (Not Found), 500 (Server Error)

---

## Critical Don't-Miss Rules

**NEVER:**
- Use camelCase for database columns
- Return raw arrays without `{ data: [...] }` wrapper
- Create components directly in `components/` root (use feature folders)
- Use PascalCase for file names
- Fetch data with `useState` + `useEffect` (use TanStack Query)
- Skip loading/error states in components

**ALWAYS:**
- Validate API inputs with Zod before processing
- Use httpOnly cookies for session (never localStorage for auth)
- Hash passwords with bcrypt (never store plaintext)
- Use `isPending` state on buttons during mutations
- Invalidate queries after successful mutations

---

## Usage Guidelines

**For AI Agents:**
- Read this file before implementing any code
- Follow ALL rules exactly as documented
- When in doubt, prefer the more restrictive option
- Refer to `_bmad-output/planning-artifacts/architecture.md` for detailed patterns

**For Humans:**
- Keep this file lean and focused on agent needs
- Update when technology stack changes
- Review quarterly for outdated rules
- Remove rules that become obvious over time

---

_Last Updated: 2025-12-30_
