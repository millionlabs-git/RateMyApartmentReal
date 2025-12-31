# Story 5.6: Bulk Moderation Actions

Status: ready-for-dev

## Story

As an **administrator**,
I want **to approve or deny multiple items at once**,
so that **I can efficiently process large moderation queues**.

## Acceptance Criteria

1. **Given** I am viewing a moderation queue (reviews or buildings) **When** I select multiple items using checkboxes **Then** bulk action buttons appear: "Approve Selected", "Deny Selected"

2. **Given** I click "Approve Selected" with 5 items selected **When** I confirm the action **Then** all 5 items are approved and removed from the queue

3. **Given** I use "Select All" on a page **When** I click the select all checkbox **Then** all visible items on the current page are selected

## Tasks / Subtasks

- [ ] Task 1: Create bulk reviews endpoint (AC: 1, 2)
  - [ ] Create POST /api/admin/reviews/bulk route
  - [ ] Require admin role
  - [ ] Accept: { ids: [], action: 'approve' | 'deny' }
  - [ ] Update all specified reviews
  - [ ] Return success count

- [ ] Task 2: Create bulk buildings endpoint (AC: 1, 2)
  - [ ] Create POST /api/admin/buildings/bulk route
  - [ ] Require admin role
  - [ ] Accept: { ids: [], action: 'approve' | 'deny' }
  - [ ] Update all specified buildings
  - [ ] Return success count

- [ ] Task 3: Add checkboxes to moderation lists (AC: 1, 3)
  - [ ] Add checkbox column to review list
  - [ ] Add checkbox column to building list
  - [ ] Track selected items in state
  - [ ] "Select All" checkbox in header

- [ ] Task 4: Create bulk action bar (AC: 1)
  - [ ] Create client/src/components/admin/bulk-action-bar.tsx
  - [ ] Appears when items selected
  - [ ] Shows selected count
  - [ ] "Approve Selected" button
  - [ ] "Deny Selected" button
  - [ ] "Clear Selection" button

- [ ] Task 5: Implement bulk approve action (AC: 2)
  - [ ] Confirmation dialog
  - [ ] Call bulk endpoint
  - [ ] Show success toast with count
  - [ ] Clear selection
  - [ ] Refresh list

- [ ] Task 6: Implement bulk deny action (AC: 2)
  - [ ] Confirmation dialog
  - [ ] Option: notify users (for reviews)
  - [ ] Call bulk endpoint
  - [ ] Show success toast
  - [ ] Clear selection
  - [ ] Refresh list

- [ ] Task 7: Implement select all (AC: 3)
  - [ ] Header checkbox toggles all visible
  - [ ] Indeterminate state for partial selection
  - [ ] Only selects current page items

- [ ] Task 8: Handle mixed selection states
  - [ ] Show count of selected items
  - [ ] Handle page navigation with selection
  - [ ] Option: persist selection across pages (advanced)

## Dev Notes

### Architecture Patterns
- Bulk API endpoints for efficiency
- Selection state management
- Floating action bar pattern
- Confirmation for bulk destructive actions

### API Request Format
```json
POST /api/admin/reviews/bulk
{
  "ids": [1, 2, 3, 4, 5],
  "action": "approve"
}

Response:
{
  "success": true,
  "count": 5
}
```

### Components to Create/Modify
- `server/routes.ts` - Add bulk endpoints
- `client/src/components/admin/bulk-action-bar.tsx` - New
- `client/src/components/admin/review-moderation-list.tsx` - Add checkboxes
- `client/src/components/admin/building-moderation-list.tsx` - Add checkboxes

### Design Guidelines
- Checkbox in first column
- Action bar appears at bottom or top when items selected
- Clear visual feedback for selection

### Project Structure Notes

- Use Checkbox component from shadcn/ui
- Selection state in parent component
- Toast notifications for success/error

### References

- [Source: _bmad-output/planning-artifacts/prd.md#FR47]
- [Source: design_guidelines.md#Admin Tables]

## Dev Agent Record

### Agent Model Used



### Debug Log References

### Completion Notes List

### File List
