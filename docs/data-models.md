# Data Models

## Overview

RateMyApartment uses **Drizzle ORM** with PostgreSQL for data persistence. Schema definitions live in `shared/schema.ts` and are shared between client and server.

## Current Schema

### Users Table

```typescript
// shared/schema.ts
import { sql } from "drizzle-orm";
import { pgTable, text, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
```

### Entity Relationship (Current)

```
┌─────────────────┐
│     users       │
├─────────────────┤
│ id (PK, UUID)   │
│ username (UQ)   │
│ password        │
└─────────────────┘
```

## Planned Schema (Per PRD)

### Users Table (Extended)

```typescript
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull().unique(),
  password_hash: text("password_hash").notNull(),
  role: text("role").default("user"), // user | admin
  created_at: timestamp("created_at").defaultNow(),
  status: text("status").default("active"), // active | suspended
});
```

### Buildings Table

```typescript
export const buildings = pgTable("buildings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  address: text("address").notNull(),
  city: text("city").default("New York"),
  zip: varchar("zip", { length: 10 }).notNull(),
  landlord: text("landlord"),
  neighborhood: text("neighborhood"),
  building_type: text("building_type"), // High-rise, Walk-up, Brownstone
  geocode_lat: numeric("geocode_lat"),
  geocode_lng: numeric("geocode_lng"),
  status: text("status").default("pending"), // pending | approved
  created_at: timestamp("created_at").defaultNow(),
});
```

### Reviews Table

```typescript
export const reviews = pgTable("reviews", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  building_id: varchar("building_id").references(() => buildings.id),
  user_id: varchar("user_id").references(() => users.id),
  overall_rating: integer("overall_rating").notNull(), // 1-5
  floor_number: integer("floor_number"),
  noise_rating: integer("noise_rating"), // 1-5
  cleanliness_rating: integer("cleanliness_rating"), // 1-5
  maintenance_rating: integer("maintenance_rating"), // 1-5
  safety_rating: integer("safety_rating"), // 1-5
  pest_rating: integer("pest_rating"), // 1-5
  review_text: text("review_text").notNull(),
  is_anonymous: boolean("is_anonymous").default(true),
  status: text("status").default("pending"), // pending | approved | denied
  created_at: timestamp("created_at").defaultNow(),
});
```

### Review Photos Table

```typescript
export const review_photos = pgTable("review_photos", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  review_id: varchar("review_id").references(() => reviews.id),
  image_url: text("image_url").notNull(),
  created_at: timestamp("created_at").defaultNow(),
});
```

### Duplicate Queue Table

```typescript
export const duplicate_queue = pgTable("duplicate_queue", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  building_id_1: varchar("building_id_1").references(() => buildings.id),
  building_id_2: varchar("building_id_2").references(() => buildings.id),
  similarity_score: numeric("similarity_score"),
  status: text("status").default("pending"), // pending | merged | dismissed
  created_at: timestamp("created_at").defaultNow(),
});
```

## Entity Relationship Diagram (Planned)

```
┌─────────────────┐         ┌─────────────────┐
│     users       │         │   buildings     │
├─────────────────┤         ├─────────────────┤
│ id (PK)         │◄─┐      │ id (PK)         │◄─┐
│ email (UQ)      │  │      │ name            │  │
│ password_hash   │  │      │ address         │  │
│ role            │  │      │ city            │  │
│ created_at      │  │      │ zip             │  │
│ status          │  │      │ landlord        │  │
└─────────────────┘  │      │ neighborhood    │  │
                     │      │ building_type   │  │
                     │      │ geocode_lat/lng │  │
                     │      │ status          │  │
                     │      │ created_at      │  │
                     │      └─────────────────┘  │
                     │               │           │
                     │               ▼           │
                     │      ┌─────────────────┐  │
                     │      │    reviews      │  │
                     │      ├─────────────────┤  │
                     │      │ id (PK)         │  │
                     └──────│ user_id (FK)    │  │
                            │ building_id (FK)│──┘
                            │ overall_rating  │
                            │ floor_number    │
                            │ noise_rating    │
                            │ cleanliness_... │
                            │ maintenance_... │
                            │ safety_rating   │
                            │ pest_rating     │
                            │ review_text     │
                            │ is_anonymous    │
                            │ status          │
                            │ created_at      │
                            └─────────────────┘
                                    │
                                    ▼
                            ┌─────────────────┐
                            │ review_photos   │
                            ├─────────────────┤
                            │ id (PK)         │
                            │ review_id (FK)  │
                            │ image_url       │
                            │ created_at      │
                            └─────────────────┘

┌─────────────────────────────┐
│      duplicate_queue        │
├─────────────────────────────┤
│ id (PK)                     │
│ building_id_1 (FK)          │
│ building_id_2 (FK)          │
│ similarity_score            │
│ status                      │
│ created_at                  │
└─────────────────────────────┘
```

## Validation Schemas

Drizzle-zod generates Zod schemas from Drizzle tables:

```typescript
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

// Insert schema (for creating new records)
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

// Select schema (for reading records)
export const selectUserSchema = createSelectSchema(users);

// TypeScript types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
```

## Database Configuration

```typescript
// drizzle.config.ts
export default defineConfig({
  out: "./migrations",
  schema: "./shared/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
});
```

## Migration Commands

```bash
# Push schema changes to database
npm run db:push

# Generate migration files (if needed)
npx drizzle-kit generate

# Run migrations
npx drizzle-kit migrate
```

## Storage Interface

The application uses an interface-based storage pattern:

```typescript
// server/storage.ts
export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
}

// In-memory implementation (development)
export class MemStorage implements IStorage { ... }

// Database implementation (production) - to be added
export class DbStorage implements IStorage { ... }
```

## Rating Categories

Per PRD, reviews use 5-category rating system:

| Category | Field | Definition |
|----------|-------|------------|
| Noise | `noise_rating` | Sound from neighbors, street, building systems |
| Cleanliness | `cleanliness_rating` | Common areas, hallways, lobby, laundry |
| Maintenance | `maintenance_rating` | Repair response time and quality |
| Safety | `safety_rating` | Security, lighting, entry systems |
| Pests | `pest_rating` | Presence of roaches, mice, etc. |

All ratings are integers 1-5 (1 = Poor, 5 = Excellent).
