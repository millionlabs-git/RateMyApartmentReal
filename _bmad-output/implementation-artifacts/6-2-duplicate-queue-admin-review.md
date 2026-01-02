# Story 6.2: Duplicate Queue for Admin Review

Status: ready-for-dev

## Story

As an **administrator**,
I want **to see a queue of potential duplicate buildings**,
so that **I can review and decide whether to merge them**.

## Acceptance Criteria

1. **Given** I am on the Admin Dashboard or Moderation page **When** there are pending duplicates **Then** I see a "Duplicates" tab/section with a count badge

2. **Given** I view the duplicates queue **When** the list loads **Then** I see pairs of buildings with: names, addresses, similarity score, detected date

3. **Given** I click on a duplicate pair **When** the detail view opens **Then** I see both buildings side-by-side for comparison

## Tasks / Subtasks

- [ ] Task 1: Create duplicates list API endpoint (AC: 1, 2)
  - [ ] Create GET /api/admin/duplicates route
  - [ ] Require admin role
  - [ ] Return pending duplicate pairs
  - [ ] Include: both building names, addresses, score, created_at
  - [ ] Pagination support

- [ ] Task 2: Create duplicates count endpoint (AC: 1)
  - [ ] Create GET /api/admin/duplicates/count route
  - [ ] Return count of pending duplicates
  - [ ] Used for badge display

- [ ] Task 3: Add Duplicates tab to moderation (AC: 1)
  - [ ] Add third tab: "Duplicates"
  - [ ] Show pending count as badge
  - [ ] Fetch count on page load

- [ ] Task 4: Create duplicates list component (AC: 2)
  - [ ] Create client/src/components/admin/duplicates-list.tsx
  - [ ] List of duplicate pair cards
  - [ ] Show: Building A name, Building B name
  - [ ] Show: similarity score as percentage
  - [ ] Show: detected date
  - [ ] Click to view details

- [ ] Task 5: Create duplicate pair card (AC: 2)
  - [ ] Show both building names
  - [ ] Show addresses
  - [ ] Similarity score badge (color-coded)
  - [ ] Date detected
  - [ ] "Review" button

- [ ] Task 6: Create duplicate detail view (AC: 3)
  - [ ] Navigate to /admin/duplicates/:id or open panel
  - [ ] Load both buildings' full data
  - [ ] Side-by-side display
  - [ ] Action buttons (for next stories)

- [ ] Task 7: Add duplicates route (AC: 3)
  - [ ] Add /admin/duplicates route
  - [ ] Add /admin/duplicates/:id route
  - [ ] Or use modal/panel for detail view

## Dev Notes

### Architecture Patterns
- Queue-based moderation workflow
- Tab-based navigation
- Count badges for notifications
- Detail view for comparison

### API Response Format
```json
{
  "data": [
    {
      "id": 1,
      "building_1": {
        "id": 10,
        "name": "123 Main St Apartments",
        "address": "123 Main Street"
      },
      "building_2": {
        "id": 15,
        "name": "123 Main Street Apts",
        "address": "123 Main St"
      },
      "similarity_score": 85,
      "created_at": "2025-01-01T00:00:00Z"
    }
  ],
  "pagination": { ... }
}
```

### Components to Create/Modify
- `server/routes.ts` - Add admin duplicates routes
- `client/src/pages/admin/moderation.tsx` - Add Duplicates tab
- `client/src/components/admin/duplicates-list.tsx` - New
- `client/src/components/admin/duplicate-pair-card.tsx` - New

### Design Guidelines
- Similar to other moderation tabs
- Similarity score color: green (>80), yellow (60-80), red (<60)
- Side-by-side comparison for detail view

### Project Structure Notes

- Reuse moderation page patterns
- Badge component for counts
- Detail view can be separate page or panel

### References

- [Source: _bmad-output/planning-artifacts/prd.md#FR49]
- [Source: design_guidelines.md#Admin Tables]

## Dev Agent Record

### Agent Model Used



### Debug Log References

### Completion Notes List

### File List
