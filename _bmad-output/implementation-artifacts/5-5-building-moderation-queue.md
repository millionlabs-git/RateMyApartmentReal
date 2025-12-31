# Story 5.5: Building Moderation Queue

Status: ready-for-dev

## Story

As an **administrator**,
I want **to review and approve/deny pending buildings**,
so that **only valid buildings appear in search results**.

## Acceptance Criteria

1. **Given** I am on the Moderation page **When** I view the Buildings tab **Then** I see a list of pending buildings with: name, address, submitted date

2. **Given** I click on a pending building **When** the building details are displayed **Then** I can view all fields and edit them before approval

3. **Given** I click "Approve" **When** the action is confirmed **Then** the building status changes to "approved" and it appears in search results

4. **Given** I click "Deny" **When** I confirm the action **Then** the building is removed from the queue

## Tasks / Subtasks

- [ ] Task 1: Create pending buildings API endpoint (AC: 1)
  - [ ] Create GET /api/admin/buildings/pending route
  - [ ] Require admin role
  - [ ] Return pending buildings
  - [ ] Include: name, address, city, zip, submitted date
  - [ ] Pagination support

- [ ] Task 2: Create building moderation endpoint (AC: 2, 3, 4)
  - [ ] Create PATCH /api/admin/buildings/:id route
  - [ ] Accept: status (approved/denied)
  - [ ] Accept: updated fields (for edit before approve)
  - [ ] Update building status and fields
  - [ ] Return updated building

- [ ] Task 3: Create building moderation list (AC: 1)
  - [ ] Create client/src/components/admin/building-moderation-list.tsx
  - [ ] List of pending building cards
  - [ ] Show: name, address, submitted date
  - [ ] Click to expand/view details

- [ ] Task 4: Create building detail/edit view (AC: 2)
  - [ ] Create client/src/components/admin/building-edit.tsx
  - [ ] Editable form for all fields
  - [ ] Pre-populated with submitted data
  - [ ] Validation on edit

- [ ] Task 5: Create approve/deny buttons (AC: 3, 4)
  - [ ] Approve button (saves edits and approves)
  - [ ] Deny button
  - [ ] Confirmation dialogs

- [ ] Task 6: Integrate into moderation page (AC: 1)
  - [ ] Add Buildings tab content
  - [ ] Switch between Reviews and Buildings tabs
  - [ ] Show pending count in tab badge

- [ ] Task 7: Handle approved building
  - [ ] Run geocoding if not already done
  - [ ] Check for duplicates again
  - [ ] Add to searchable buildings

## Dev Notes

### Architecture Patterns
- Queue-based moderation workflow
- Edit-before-approve pattern
- Tab-based navigation
- Geocoding on approval (if needed)

### Components to Create/Modify
- `server/routes.ts` - Add admin building routes
- `client/src/components/admin/building-moderation-list.tsx` - New
- `client/src/components/admin/building-edit.tsx` - New
- `client/src/pages/admin/moderation.tsx` - Add buildings tab

### Design Guidelines
- Editable form within moderation view
- Clear save/approve and deny actions
- Warning if geocoding fails

### Project Structure Notes

- Reuse building form styling from add-building
- Admin can fix typos before approval
- Follow existing tab patterns

### References

- [Source: _bmad-output/planning-artifacts/prd.md#FR46]
- [Source: design_guidelines.md#Admin Tables]

## Dev Agent Record

### Agent Model Used



### Debug Log References

### Completion Notes List

### File List
