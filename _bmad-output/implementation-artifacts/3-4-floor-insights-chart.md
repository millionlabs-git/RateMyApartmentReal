# Story 3.4: Floor Insights Chart

Status: ready-for-dev

## Story

As a **user**,
I want **to see floor-level rating distributions**,
so that **I can understand if certain floors have better or worse experiences**.

## Acceptance Criteria

1. **Given** I am on a building detail page with reviews **When** I view the Floor Insights section **Then** I see a vertical bar chart showing average ratings by floor

2. **Given** I hover over or click a floor bar **When** I interact with the chart **Then** I see the floor number and average rating highlighted

3. **Given** a building has reviews from only a few floors **When** I view the chart **Then** only floors with reviews are displayed (no empty floors)

## Tasks / Subtasks

- [ ] Task 1: Create floor aggregation API (AC: 1, 3)
  - [ ] Add floor aggregation to building detail endpoint
  - [ ] Or create GET /api/buildings/:id/floor-insights
  - [ ] Group reviews by floor_number
  - [ ] Calculate average overall_rating per floor
  - [ ] Count reviews per floor
  - [ ] Return array: [{ floor: 1, avgRating: 4.2, reviewCount: 5 }, ...]

- [ ] Task 2: Create floor insights component (AC: 1, 2, 3)
  - [ ] Create client/src/components/buildings/floor-insights.tsx
  - [ ] Vertical bar chart (CSS-based, not chart library)
  - [ ] Each bar represents a floor
  - [ ] Bar height proportional to rating (1-5 scale)
  - [ ] Only show floors with reviews

- [ ] Task 3: Create individual floor bar component (AC: 1, 2)
  - [ ] Floor label below bar
  - [ ] Rating value above or inside bar
  - [ ] Amber color with varying opacity based on rating
  - [ ] Hover state shows tooltip with details

- [ ] Task 4: Add interactivity (AC: 2)
  - [ ] Hover effect on bars
  - [ ] Tooltip showing: "Floor X: 4.2 avg (5 reviews)"
  - [ ] Highlight effect on interaction

- [ ] Task 5: Handle empty state
  - [ ] Show message if no floor data
  - [ ] "Floor insights will appear after reviews are submitted"

- [ ] Task 6: Integrate into building detail page (AC: 1)
  - [ ] Add FloorInsights component to left panel
  - [ ] Position after category ratings
  - [ ] Section header: "Floor Insights"
  - [ ] Collapsible section (optional)

## Dev Notes

### Architecture Patterns
- Floor data aggregated server-side
- CSS-based chart (no external chart library)
- Data fetched with building detail or separate endpoint
- Tooltip for detailed info on hover

### Chart Design
- Vertical bars arranged horizontally
- Each bar represents one floor
- Height = rating (1-5 scale mapped to percentage)
- Amber (#D97706) with opacity variations
- Floor labels at bottom
- Grid lines optional

### Components to Create/Modify
- `server/routes.ts` - Add floor aggregation
- `client/src/components/buildings/floor-insights.tsx` - New
- `client/src/pages/building.tsx` - Integrate

### Design Guidelines
- Simple vertical bar charts using CSS
- Bars: Amber with varying opacity
- Grid background: Subtle gray lines
- Floor labels: Small DM Sans (0.75rem)

### Project Structure Notes

- Chart built with CSS Flexbox/Grid
- No external chart library needed
- Responsive - adjust bar width on mobile

### References

- [Source: _bmad-output/planning-artifacts/prd.md#FR16]
- [Source: design_guidelines.md#Floor Insights Charts]

## Dev Agent Record

### Agent Model Used



### Debug Log References

### Completion Notes List

### File List
