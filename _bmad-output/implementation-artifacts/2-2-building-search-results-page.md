# Story 2.2: Building Search Results Page

Status: ready-for-dev

## Story

As a **user**,
I want **to see search results as visual building cards**,
so that **I can quickly scan and compare buildings**.

## Acceptance Criteria

1. **Given** I am on the search results page **When** buildings are displayed **Then** each building card shows: name, address, overall rating (stars), review count

2. **Given** I click on a building card **When** the card is clicked **Then** I am navigated to the Building Detail page

3. **Given** I am on the homepage **When** I submit a search in the hero search bar **Then** I am redirected to the search page with results

## Tasks / Subtasks

- [ ] Task 1: Create search page (AC: 1, 2, 3)
  - [ ] Create client/src/pages/search.tsx
  - [ ] Add route /search to App.tsx
  - [ ] Accept ?q= query parameter for search term
  - [ ] Display search bar at top
  - [ ] Display building grid below

- [ ] Task 2: Create building card component (AC: 1, 2)
  - [ ] Create client/src/components/buildings/building-card.tsx
  - [ ] Display building name (heading)
  - [ ] Display full address
  - [ ] Display star rating (1-5 stars, amber color)
  - [ ] Display review count
  - [ ] Card hover effect (subtle shadow)
  - [ ] Click navigates to /building/:id

- [ ] Task 3: Create building list component (AC: 1)
  - [ ] Create client/src/components/buildings/building-list.tsx
  - [ ] Responsive grid layout (1 col mobile, 2 cols tablet, 3 cols desktop)
  - [ ] Loading skeletons during fetch
  - [ ] Empty state when no results

- [ ] Task 4: Create search bar component (AC: 3)
  - [ ] Create client/src/components/buildings/building-search.tsx
  - [ ] Input field with search icon
  - [ ] Submit on Enter or button click
  - [ ] Navigate to /search?q={term}

- [ ] Task 5: Connect homepage hero search (AC: 3)
  - [ ] Update existing hero search bar
  - [ ] On submit, redirect to /search?q={term}
  - [ ] Maintain glassmorphic styling

- [ ] Task 6: Add pagination component (AC: 1)
  - [ ] Use pagination data from API
  - [ ] Previous/Next buttons
  - [ ] Page number display
  - [ ] Update URL query params on page change

- [ ] Task 7: Create buildings hook (AC: 1)
  - [ ] Create client/src/hooks/use-buildings.ts
  - [ ] useBuildings(search, page) hook
  - [ ] Use TanStack Query with /api/buildings
  - [ ] Handle loading and error states

## Dev Notes

### Architecture Patterns
- TanStack Query for data fetching
- URL-based search state (?q=&page=)
- Responsive grid with Tailwind
- Loading skeletons per design patterns

### Components to Create/Modify
- `client/src/pages/search.tsx` - New page
- `client/src/components/buildings/building-card.tsx` - New
- `client/src/components/buildings/building-list.tsx` - New
- `client/src/components/buildings/building-search.tsx` - New
- `client/src/hooks/use-buildings.ts` - New
- `client/src/App.tsx` - Add route
- Hero search component - Connect to search page

### Design Guidelines
- Cards: White background, 1px border (#E7E5E4), rounded-xl, p-6
- Stars: Amber (#D97706) filled
- Grid gaps: gap-6
- Hover: subtle shadow elevation

### Project Structure Notes

- Building components in `client/src/components/buildings/`
- Follow existing Card component patterns from shadcn/ui

### References

- [Source: _bmad-output/planning-artifacts/prd.md#FR8, FR9]
- [Source: design_guidelines.md#Cards]
- [Source: design_guidelines.md#Apartment Search Page]

## Dev Agent Record

### Agent Model Used



### Debug Log References

### Completion Notes List

### File List
