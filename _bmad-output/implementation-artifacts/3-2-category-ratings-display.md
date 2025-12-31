# Story 3.2: Category Ratings Display

Status: ready-for-dev

## Story

As a **user**,
I want **to see detailed category ratings for a building**,
so that **I can understand specific aspects like noise, cleanliness, and safety**.

## Acceptance Criteria

1. **Given** I am on a building detail page **When** the page loads **Then** I see visual rating bars for 5 categories: Noise, Cleanliness, Maintenance, Safety, Pests **And** each bar shows the aggregate score (1-5) calculated from all approved reviews

2. **Given** a building has no approved reviews **When** I view the category ratings **Then** I see "No ratings yet" with empty/gray rating bars

3. **Given** a building has approved reviews **When** I view the category ratings **Then** scores are calculated as averages of all approved reviews, rounded to 1 decimal

## Tasks / Subtasks

- [ ] Task 1: Update building API to include aggregate ratings (AC: 1, 3)
  - [ ] Calculate average for each category from approved reviews
  - [ ] Calculate overall average rating
  - [ ] Calculate total review count
  - [ ] Return aggregates in building response
  - [ ] Return null for categories with no reviews

- [ ] Task 2: Create rating bar component (AC: 1, 2)
  - [ ] Create client/src/components/reviews/rating-bar.tsx
  - [ ] Display category label (left)
  - [ ] Display horizontal bar with fill percentage
  - [ ] Display numeric score (right)
  - [ ] Amber color for filled portion
  - [ ] Gray for empty portion

- [ ] Task 3: Create category ratings component (AC: 1, 2, 3)
  - [ ] Create client/src/components/reviews/category-ratings.tsx
  - [ ] Display all 5 category bars
  - [ ] Categories: Noise, Cleanliness, Maintenance, Safety, Pests
  - [ ] Handle empty state (no reviews)
  - [ ] Show "No ratings yet" message

- [ ] Task 4: Integrate into building detail page (AC: 1)
  - [ ] Add CategoryRatings component to left panel
  - [ ] Position below building info
  - [ ] Use Card component for section

- [ ] Task 5: Add aggregate calculation query (AC: 3)
  - [ ] Create efficient SQL query for aggregates
  - [ ] JOIN with reviews table
  - [ ] Filter by status = 'approved'
  - [ ] GROUP BY building_id
  - [ ] Use AVG() for each rating column

## Dev Notes

### Architecture Patterns
- Aggregate calculations done server-side for performance
- Cached via TanStack Query
- Null handling for buildings with no reviews
- Rounded to 1 decimal place

### Rating Categories
1. **Noise** - Sound levels from neighbors, street, building systems
2. **Cleanliness** - Common area maintenance
3. **Maintenance** - Repair response time and quality
4. **Safety** - Security, lighting, entry systems
5. **Pests** - Presence of roaches, mice, bedbugs

### Components to Create/Modify
- `server/routes.ts` - Update GET /api/buildings/:id
- `client/src/components/reviews/rating-bar.tsx` - New
- `client/src/components/reviews/category-ratings.tsx` - New
- `client/src/pages/building.tsx` - Integrate component

### Design Guidelines
- Category sliders: Horizontal bars with amber fill
- Labels on left, score on right
- Amber (#D97706) for filled portion
- Gray for unfilled portion

### Project Structure Notes

- Review-related components in `client/src/components/reviews/`
- Rating bars are CSS-based, not chart library
- Follow existing responsive patterns

### References

- [Source: _bmad-output/planning-artifacts/prd.md#FR14, FR15]
- [Source: design_guidelines.md#Rating Components]

## Dev Agent Record

### Agent Model Used



### Debug Log References

### Completion Notes List

### File List
