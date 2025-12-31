# Story 3.3: Reviews Schema & Review List

Status: ready-for-dev

## Story

As a **user**,
I want **to read all reviews for a building**,
so that **I can learn from other renters' experiences**.

## Acceptance Criteria

1. **Given** I am on a building detail page **When** I scroll to the reviews section **Then** I see review cards showing: star rating, floor number, review text, photos (if any), date posted

2. **Given** there are multiple reviews **When** I view the review list **Then** I can sort by: Newest, Highest Rated, Lowest Rated

3. **Given** a building has no reviews **When** I view the reviews section **Then** I see "No reviews yet. Be the first to share your experience!"

## Tasks / Subtasks

- [ ] Task 1: Create reviews table schema (AC: 1)
  - [ ] Add reviews table to shared/schema.ts
  - [ ] Fields: id, building_id (FK), user_id (FK)
  - [ ] Fields: overall_rating, floor_number
  - [ ] Fields: noise_rating, cleanliness_rating, maintenance_rating, safety_rating, pest_rating
  - [ ] Fields: review_text, is_anonymous
  - [ ] Fields: status (enum: pending, approved, denied)
  - [ ] Fields: created_at
  - [ ] Run migration

- [ ] Task 2: Create review_photos table schema (AC: 1)
  - [ ] Add review_photos table to shared/schema.ts
  - [ ] Fields: id, review_id (FK), image_url, created_at
  - [ ] Run migration

- [ ] Task 3: Create reviews API endpoint (AC: 1, 2)
  - [ ] Create GET /api/buildings/:id/reviews route
  - [ ] Accept query params: sort (newest, highest, lowest)
  - [ ] Only return approved reviews
  - [ ] Include photos for each review
  - [ ] Include user info (if not anonymous)
  - [ ] Implement pagination

- [ ] Task 4: Create review card component (AC: 1)
  - [ ] Create client/src/components/reviews/review-card.tsx
  - [ ] Display star rating (overall)
  - [ ] Display floor number
  - [ ] Display review text
  - [ ] Display photo thumbnails (if any)
  - [ ] Display date posted (formatted)
  - [ ] Display "Anonymous" or username

- [ ] Task 5: Create review list component (AC: 1, 2, 3)
  - [ ] Create client/src/components/reviews/review-list.tsx
  - [ ] Fetch reviews with TanStack Query
  - [ ] Sort dropdown (Newest, Highest, Lowest)
  - [ ] Map reviews to review cards
  - [ ] Loading skeletons
  - [ ] Empty state with CTA

- [ ] Task 6: Create reviews hook
  - [ ] Create client/src/hooks/use-reviews.ts
  - [ ] useReviews(buildingId, sort) hook
  - [ ] Fetch from GET /api/buildings/:id/reviews
  - [ ] Return reviews, isLoading, error

- [ ] Task 7: Integrate into building detail page (AC: 1, 2, 3)
  - [ ] Add ReviewList component below category ratings
  - [ ] Add section header "Reviews"

## Dev Notes

### Architecture Patterns
- Reviews linked to buildings and users via foreign keys
- Status field for moderation workflow
- is_anonymous field controls username display
- Separate review_photos table for image references

### Database Schema
```sql
CREATE TABLE reviews (
  id SERIAL PRIMARY KEY,
  building_id INTEGER NOT NULL REFERENCES buildings(id),
  user_id INTEGER NOT NULL REFERENCES users(id),
  overall_rating INTEGER NOT NULL CHECK (overall_rating BETWEEN 1 AND 5),
  floor_number INTEGER NOT NULL,
  noise_rating INTEGER CHECK (noise_rating BETWEEN 1 AND 5),
  cleanliness_rating INTEGER CHECK (cleanliness_rating BETWEEN 1 AND 5),
  maintenance_rating INTEGER CHECK (maintenance_rating BETWEEN 1 AND 5),
  safety_rating INTEGER CHECK (safety_rating BETWEEN 1 AND 5),
  pest_rating INTEGER CHECK (pest_rating BETWEEN 1 AND 5),
  review_text TEXT NOT NULL,
  is_anonymous BOOLEAN NOT NULL DEFAULT true,
  status VARCHAR(20) NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE review_photos (
  id SERIAL PRIMARY KEY,
  review_id INTEGER NOT NULL REFERENCES reviews(id),
  image_url VARCHAR(500) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
```

### Components to Create/Modify
- `shared/schema.ts` - Add reviews and review_photos tables
- `server/routes.ts` - Add GET /api/buildings/:id/reviews
- `client/src/components/reviews/review-card.tsx` - New
- `client/src/components/reviews/review-list.tsx` - New
- `client/src/hooks/use-reviews.ts` - New
- `client/src/pages/building.tsx` - Integrate

### Project Structure Notes

- Review components in `client/src/components/reviews/`
- Photos stored in Replit Object Storage (Story 4.2)
- Sort options via Select component

### References

- [Source: _bmad-output/planning-artifacts/prd.md#FR17]
- [Source: _bmad-output/planning-artifacts/architecture.md#Data Architecture]
- [Source: design_guidelines.md#Cards]

## Dev Agent Record

### Agent Model Used



### Debug Log References

### Completion Notes List

### File List
