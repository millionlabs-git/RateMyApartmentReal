# Story 6.1: Duplicate Detection System

Status: ready-for-dev

## Story

As the **system**,
I want **to automatically detect potential duplicate buildings**,
so that **administrators can review and merge them**.

## Acceptance Criteria

1. **Given** a new building is submitted **When** the building is saved with geocode coordinates **Then** the system checks for existing buildings within 50 meters **And** if a potential duplicate is found, an entry is created in the duplicate_queue

2. **Given** a duplicate pair is detected **When** the entry is created **Then** it includes: building_id_1, building_id_2, similarity_score, status "pending"

3. **Given** similarity scoring **When** calculating the score **Then** the score is based on: geocode proximity + normalized address matching

## Tasks / Subtasks

- [ ] Task 1: Create duplicate_queue table (AC: 2)
  - [ ] Add duplicate_queue table to shared/schema.ts
  - [ ] Fields: id, building_id_1 (FK), building_id_2 (FK)
  - [ ] Fields: similarity_score (0-100)
  - [ ] Fields: status (enum: pending, merged, dismissed)
  - [ ] Fields: created_at
  - [ ] Unique constraint on building pair
  - [ ] Run migration

- [ ] Task 2: Enhance duplicate detection service (AC: 1, 3)
  - [ ] Update server/services/duplicate-detection.ts
  - [ ] findDuplicatesForBuilding(buildingId) function
  - [ ] Query buildings within 50 meters
  - [ ] Calculate similarity score

- [ ] Task 3: Implement similarity scoring (AC: 3)
  - [ ] Distance score: closer = higher score
  - [ ] Address score: normalized string similarity
  - [ ] Name score: Levenshtein distance
  - [ ] Weighted combination for final score
  - [ ] Return score 0-100

- [ ] Task 4: Create queue entry function (AC: 1, 2)
  - [ ] createDuplicateQueueEntry(building1, building2, score)
  - [ ] Check if pair already exists
  - [ ] Skip if already exists or dismissed
  - [ ] Insert new queue entry

- [ ] Task 5: Trigger on building approval (AC: 1)
  - [ ] Hook into building approval flow
  - [ ] Run duplicate detection on approval
  - [ ] Create queue entries for potential duplicates

- [ ] Task 6: Trigger on new building creation (AC: 1)
  - [ ] Hook into building creation flow
  - [ ] Run detection if geocoded
  - [ ] Flag potential duplicates immediately

- [ ] Task 7: Create duplicate check API (optional)
  - [ ] GET /api/admin/buildings/:id/check-duplicates
  - [ ] Manual trigger for duplicate check
  - [ ] Return potential duplicates

## Dev Notes

### Architecture Patterns
- Background processing for duplicate detection
- Similarity scoring algorithm
- Queue-based workflow
- Haversine formula for distance

### Similarity Score Calculation
```typescript
function calculateSimilarityScore(building1, building2) {
  const distanceMeters = haversineDistance(
    building1.geocode_lat, building1.geocode_lng,
    building2.geocode_lat, building2.geocode_lng
  );

  // Distance score: 100 at 0m, 0 at 50m+
  const distanceScore = Math.max(0, 100 - (distanceMeters / 50 * 100));

  // Address similarity (Levenshtein or similar)
  const addressScore = stringSimilarity(
    normalizeAddress(building1.address),
    normalizeAddress(building2.address)
  ) * 100;

  // Weighted average
  return (distanceScore * 0.6) + (addressScore * 0.4);
}
```

### Components to Create/Modify
- `shared/schema.ts` - Add duplicate_queue table
- `server/services/duplicate-detection.ts` - Enhance with scoring
- `server/routes.ts` - Hook into building approval

### Database Schema
```sql
CREATE TABLE duplicate_queue (
  id SERIAL PRIMARY KEY,
  building_id_1 INTEGER NOT NULL REFERENCES buildings(id),
  building_id_2 INTEGER NOT NULL REFERENCES buildings(id),
  similarity_score INTEGER NOT NULL CHECK (similarity_score BETWEEN 0 AND 100),
  status VARCHAR(20) NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  UNIQUE(building_id_1, building_id_2)
);
```

### Project Structure Notes

- Detection logic in services layer
- Triggered on building state changes
- Queue entries created automatically

### References

- [Source: _bmad-output/planning-artifacts/prd.md#FR48, FR49]
- [Source: _bmad-output/planning-artifacts/architecture.md#External Integrations]

## Dev Agent Record

### Agent Model Used



### Debug Log References

### Completion Notes List

### File List
