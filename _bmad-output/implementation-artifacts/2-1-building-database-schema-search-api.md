# Story 2.1: Building Database Schema & Search API

Status: ready-for-dev

## Story

As a **user**,
I want **to search for NYC buildings by name or address**,
so that **I can find buildings I'm interested in reviewing or researching**.

## Acceptance Criteria

1. **Given** I enter a search term in the search bar (homepage or search page) **When** I submit the search **Then** I see matching buildings filtered by name or address using PostgreSQL ILIKE **And** results are returned in < 500ms

2. **Given** there are many results **When** I view the search results **Then** results are paginated (20 per page) with page navigation

3. **Given** no buildings match my search **When** I view the results **Then** I see an empty state: "No buildings found. Try a different search or add a new building."

## Tasks / Subtasks

- [ ] Task 1: Create buildings table schema (AC: 1)
  - [ ] Add buildings table to shared/schema.ts
  - [ ] Fields: id, name, address, city, zip, landlord, neighborhood, building_type
  - [ ] Fields: geocode_lat, geocode_lng (for duplicate detection)
  - [ ] Fields: status (enum: pending, approved), created_at
  - [ ] Create index on address for performance
  - [ ] Create index on name for performance
  - [ ] Run migration

- [ ] Task 2: Create buildings search API endpoint (AC: 1, 2, 3)
  - [ ] Create GET /api/buildings route
  - [ ] Accept query params: search, page, limit
  - [ ] Implement ILIKE search on name and address
  - [ ] Only return approved buildings
  - [ ] Implement offset-based pagination
  - [ ] Return { data: [...], pagination: { page, limit, total, totalPages } }
  - [ ] Target < 500ms response time (NFR2)

- [ ] Task 3: Create single building endpoint (AC: 1)
  - [ ] Create GET /api/buildings/:id route
  - [ ] Return building details
  - [ ] Include aggregate rating and review count (placeholder for now)
  - [ ] Return 404 if not found or not approved

- [ ] Task 4: Create Zod validation schemas
  - [ ] Building insert schema
  - [ ] Building search params schema
  - [ ] Building response schema

- [ ] Task 5: Seed sample buildings (development)
  - [ ] Create seed script or SQL
  - [ ] Add 10-20 sample NYC buildings
  - [ ] Various neighborhoods and types

## Dev Notes

### Architecture Patterns
- PostgreSQL ILIKE for search (per architecture decision)
- Offset-based pagination (?page=&limit=)
- Response format: { data: [...], pagination: {...} }
- Index on searchable columns for performance

### Components to Create/Modify
- `shared/schema.ts` - Add buildings table
- `server/routes.ts` - Add buildings endpoints
- `server/storage.ts` - Add building queries

### Database Schema
```sql
CREATE TABLE buildings (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  address VARCHAR(255) NOT NULL,
  city VARCHAR(100) NOT NULL DEFAULT 'New York',
  zip VARCHAR(10) NOT NULL,
  landlord VARCHAR(255),
  neighborhood VARCHAR(100),
  building_type VARCHAR(50),
  geocode_lat DECIMAL(10, 8),
  geocode_lng DECIMAL(11, 8),
  status VARCHAR(20) NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_buildings_address ON buildings(address);
CREATE INDEX idx_buildings_name ON buildings(name);
```

### Project Structure Notes

- Buildings table is core entity
- Status field enables moderation workflow
- Geocode fields support duplicate detection (Story 2.4)

### References

- [Source: _bmad-output/planning-artifacts/prd.md#FR7, FR8, FR10, FR11]
- [Source: _bmad-output/planning-artifacts/architecture.md#Data Architecture]
- [Source: _bmad-output/planning-artifacts/architecture.md#API & Communication Patterns]

## Dev Agent Record

### Agent Model Used



### Debug Log References

### Completion Notes List

### File List
