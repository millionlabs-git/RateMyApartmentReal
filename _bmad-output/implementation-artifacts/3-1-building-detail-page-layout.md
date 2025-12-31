# Story 3.1: Building Detail Page Layout

Status: ready-for-dev

## Story

As a **user**,
I want **to view a building's complete information on a dedicated page**,
so that **I can understand the building before deciding to review or rent**.

## Acceptance Criteria

1. **Given** I navigate to a building detail page (/building/:id) **When** the page loads **Then** I see a two-column layout with:
   - Left panel: Building name, street address, landlord name (if available)
   - Right panel: Overall star rating, total review count, prominent "Write a Review" CTA button

2. **Given** I am not logged in **When** I click "Write a Review" **Then** I am redirected to the login page with a return URL

3. **Given** I am logged in **When** I click "Write a Review" **Then** I am navigated to the review submission form for this building

## Tasks / Subtasks

- [ ] Task 1: Create building detail page (AC: 1, 2, 3)
  - [ ] Create client/src/pages/building.tsx
  - [ ] Add route /building/:id to App.tsx
  - [ ] Extract building ID from URL params
  - [ ] Fetch building data with TanStack Query

- [ ] Task 2: Create building info panel (left side) (AC: 1)
  - [ ] Create client/src/components/buildings/building-info.tsx
  - [ ] Display building name (large serif heading)
  - [ ] Display street address
  - [ ] Display city, ZIP
  - [ ] Display landlord name (if available)
  - [ ] Display neighborhood (if available)
  - [ ] Display building type (if available)

- [ ] Task 3: Create rating summary panel (right side) (AC: 1)
  - [ ] Create client/src/components/buildings/rating-summary.tsx
  - [ ] Display overall star rating (large)
  - [ ] Display review count ("X reviews")
  - [ ] Display "Write a Review" button (prominent CTA)

- [ ] Task 4: Create two-column layout (AC: 1)
  - [ ] 60/40 split on desktop
  - [ ] Stacked on mobile (info first, then rating)
  - [ ] Right panel sticky on desktop
  - [ ] Responsive breakpoints

- [ ] Task 5: Implement Write a Review button logic (AC: 2, 3)
  - [ ] Check authentication status
  - [ ] If not logged in: redirect to /login?returnUrl=/building/:id/review
  - [ ] If logged in: navigate to /building/:id/review
  - [ ] Use useAuth hook

- [ ] Task 6: Create building detail hook
  - [ ] Create client/src/hooks/use-building.ts
  - [ ] useBuilding(id) hook
  - [ ] Fetch from GET /api/buildings/:id
  - [ ] Return building data, isLoading, error

- [ ] Task 7: Handle loading and error states
  - [ ] Loading skeleton for page
  - [ ] 404 page if building not found
  - [ ] Error state if API fails

## Dev Notes

### Architecture Patterns
- URL params for building ID (wouter useParams)
- TanStack Query for data fetching
- Conditional navigation based on auth state
- Responsive two-column layout

### Components to Create/Modify
- `client/src/pages/building.tsx` - New
- `client/src/components/buildings/building-info.tsx` - New
- `client/src/components/buildings/rating-summary.tsx` - New
- `client/src/hooks/use-building.ts` - New
- `client/src/App.tsx` - Add route

### Design Guidelines
- Two-column layout (60/40 split desktop)
- Right panel sticky sidebar
- Large serif heading for building name
- Prominent CTA button (amber/ink color)

### Project Structure Notes

- Building components in `client/src/components/buildings/`
- Responsive: stack on mobile, side-by-side on desktop
- Use existing Card components from shadcn/ui

### References

- [Source: _bmad-output/planning-artifacts/prd.md#FR12, FR13]
- [Source: design_guidelines.md#Building Detail Page]

## Dev Agent Record

### Agent Model Used



### Debug Log References

### Completion Notes List

### File List
