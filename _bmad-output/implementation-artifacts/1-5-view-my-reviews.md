# Story 1.5: View My Reviews

Status: ready-for-dev

## Story

As an **authenticated user**,
I want **to see a list of all reviews I've submitted**,
so that **I can track my contributions to the platform**.

## Acceptance Criteria

1. **Given** I am on the Account Settings page **When** I view the "My Reviews" section **Then** I see a list of my submitted reviews with building name, rating, date, and status (pending/approved/denied)

2. **Given** I have no submitted reviews **When** I view the "My Reviews" section **Then** I see "You haven't submitted any reviews yet" with a CTA to browse buildings

## Tasks / Subtasks

- [ ] Task 1: Create user reviews API endpoint (AC: 1, 2)
  - [ ] Create GET /api/user/reviews route
  - [ ] Require authentication
  - [ ] Query reviews by user_id
  - [ ] Join with buildings table for building name
  - [ ] Return reviews with: id, building_name, building_id, overall_rating, status, created_at
  - [ ] Sort by created_at descending
  - [ ] Support pagination

- [ ] Task 2: Create my reviews component (AC: 1, 2)
  - [ ] Create client/src/components/settings/my-reviews.tsx
  - [ ] Use TanStack Query to fetch /api/user/reviews
  - [ ] Display loading skeleton while fetching
  - [ ] Handle empty state with message and CTA

- [ ] Task 3: Create review item component (AC: 1)
  - [ ] Create client/src/components/settings/review-item.tsx
  - [ ] Display building name (link to building page)
  - [ ] Display star rating
  - [ ] Display date (formatted)
  - [ ] Display status badge (pending=yellow, approved=green, denied=red)

- [ ] Task 4: Add My Reviews section to settings page (AC: 1, 2)
  - [ ] Add My Reviews section header
  - [ ] Integrate my-reviews component
  - [ ] Use Card component for section styling

- [ ] Task 5: Create empty state component (AC: 2)
  - [ ] Display friendly message
  - [ ] Add "Browse Buildings" button linking to search page
  - [ ] Use appropriate icon or illustration

## Dev Notes

### Architecture Patterns
- Protected endpoint with requireAuth middleware
- Pagination using offset-based pattern (?page=&limit=)
- Join query for building name
- TanStack Query for data fetching

### Components to Create/Modify
- `server/routes.ts` - Add GET /api/user/reviews
- `client/src/components/settings/my-reviews.tsx` - New
- `client/src/components/settings/review-item.tsx` - New
- `client/src/pages/settings.tsx` - Add section

### Project Structure Notes

- Status badges use different colors per design guidelines
- Link building names to building detail pages
- Follow existing list component patterns

### References

- [Source: _bmad-output/planning-artifacts/prd.md#FR38]
- [Source: design_guidelines.md#Cards]

## Dev Agent Record

### Agent Model Used



### Debug Log References

### Completion Notes List

### File List
