# Story 6.3: Side-by-Side Building Comparison

Status: ready-for-dev

## Story

As an **administrator**,
I want **to compare two potential duplicate buildings side-by-side**,
so that **I can make an informed decision about merging**.

## Acceptance Criteria

1. **Given** I am viewing a duplicate pair **When** the comparison view loads **Then** I see both buildings with all fields displayed:
   - Name, Address, City, ZIP
   - Landlord, Neighborhood, Building Type
   - Number of reviews, Average rating
   - Created date

2. **Given** the buildings have different field values **When** I view the comparison **Then** differences are highlighted visually

3. **Given** I want to keep both buildings **When** I click "Dismiss" **Then** the duplicate queue entry is marked "dismissed" and removed from the queue

## Tasks / Subtasks

- [ ] Task 1: Create duplicate detail API endpoint (AC: 1)
  - [ ] Create GET /api/admin/duplicates/:id route
  - [ ] Return both buildings with full details
  - [ ] Include review counts and average ratings
  - [ ] Include created_at dates

- [ ] Task 2: Create dismiss endpoint (AC: 3)
  - [ ] Create PATCH /api/admin/duplicates/:id route
  - [ ] Accept: action = 'dismiss'
  - [ ] Update status to "dismissed"
  - [ ] Return success

- [ ] Task 3: Create comparison layout component (AC: 1)
  - [ ] Create client/src/components/admin/building-comparison.tsx
  - [ ] Two-column layout
  - [ ] Building A on left, Building B on right
  - [ ] Matching field rows

- [ ] Task 4: Create field comparison row (AC: 1, 2)
  - [ ] Create client/src/components/admin/comparison-row.tsx
  - [ ] Field label in center or left
  - [ ] Value A on left, Value B on right
  - [ ] Highlight if different

- [ ] Task 5: Implement difference highlighting (AC: 2)
  - [ ] Compare field values
  - [ ] Yellow/orange highlight for differences
  - [ ] Green for matching values (optional)
  - [ ] Visual indicator (icon or border)

- [ ] Task 6: Display review statistics (AC: 1)
  - [ ] Review count for each building
  - [ ] Average rating for each building
  - [ ] Help admin decide which to keep

- [ ] Task 7: Create dismiss button (AC: 3)
  - [ ] "Not Duplicates" or "Dismiss" button
  - [ ] Confirmation dialog
  - [ ] Update status and redirect

- [ ] Task 8: Create comparison page (AC: 1)
  - [ ] Create client/src/pages/admin/duplicate-compare.tsx
  - [ ] Or modal/panel in moderation page
  - [ ] Load duplicate pair data
  - [ ] Display comparison component

## Dev Notes

### Architecture Patterns
- Side-by-side comparison pattern
- Diff highlighting for visual clarity
- Dismiss action to clear false positives
- Review stats to aid decision

### Comparison Fields
1. Name
2. Address
3. City
4. ZIP Code
5. Landlord
6. Neighborhood
7. Building Type
8. Review Count
9. Average Rating
10. Created Date

### Components to Create/Modify
- `server/routes.ts` - Add duplicate detail and dismiss routes
- `client/src/pages/admin/duplicate-compare.tsx` - New
- `client/src/components/admin/building-comparison.tsx` - New
- `client/src/components/admin/comparison-row.tsx` - New

### Design Guidelines
- Two-column layout
- Field labels aligned
- Differences highlighted (yellow/orange)
- Clear action buttons at bottom

### Project Structure Notes

- Comparison component reusable
- Diff logic in client-side
- Simple string comparison for highlighting

### References

- [Source: _bmad-output/planning-artifacts/prd.md#FR50]
- [Source: design_guidelines.md#Admin Tables]

## Dev Agent Record

### Agent Model Used



### Debug Log References

### Completion Notes List

### File List
