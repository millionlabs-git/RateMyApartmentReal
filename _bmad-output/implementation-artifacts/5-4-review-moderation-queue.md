# Story 5.4: Review Moderation Queue

Status: ready-for-dev

## Story

As an **administrator**,
I want **to review and approve/deny pending reviews**,
so that **only quality content appears on the platform**.

## Acceptance Criteria

1. **Given** I am on the Moderation page (/admin/moderation) **When** I view the Reviews tab **Then** I see a list of pending reviews with: building name, rating, review text preview, submitted date

2. **Given** I click on a pending review **When** the full review is displayed **Then** I see the complete review text, all ratings, photos, and user info (if not anonymous)

3. **Given** I click "Approve" **When** the action is confirmed **Then** the review status changes to "approved" and it appears on the building page

4. **Given** I click "Deny" **When** I optionally enter a reason **Then** the review status changes to "denied" and optionally the user is notified via email

## Tasks / Subtasks

- [ ] Task 1: Create pending reviews API endpoint (AC: 1)
  - [ ] Create GET /api/admin/reviews/pending route
  - [ ] Require admin role
  - [ ] Return pending reviews with building info
  - [ ] Include: building_name, overall_rating, review_text (truncated), created_at
  - [ ] Pagination support

- [ ] Task 2: Create review moderation endpoints (AC: 3, 4)
  - [ ] Create PATCH /api/admin/reviews/:id route
  - [ ] Accept: status (approved/denied), deny_reason (optional)
  - [ ] Update review status
  - [ ] Send notification email if denied and reason provided
  - [ ] Return updated review

- [ ] Task 3: Create moderation tabs component (AC: 1)
  - [ ] Create client/src/components/admin/moderation-tabs.tsx
  - [ ] Tab: Reviews (with pending count badge)
  - [ ] Tab: Buildings (with pending count badge)
  - [ ] Use Tabs component from shadcn/ui

- [ ] Task 4: Create review moderation list (AC: 1)
  - [ ] Create client/src/components/admin/review-moderation-list.tsx
  - [ ] List of pending review cards
  - [ ] Show: building name, rating, text preview, date
  - [ ] Click to expand/view details

- [ ] Task 5: Create review detail view (AC: 2)
  - [ ] Create client/src/components/admin/review-detail.tsx
  - [ ] Full review text
  - [ ] All category ratings
  - [ ] Photos (if any)
  - [ ] User info (if not anonymous)
  - [ ] Submitted date

- [ ] Task 6: Create approve/deny buttons (AC: 3, 4)
  - [ ] Approve button (green)
  - [ ] Deny button (red)
  - [ ] Confirmation for approve
  - [ ] Modal for deny with optional reason

- [ ] Task 7: Create deny modal (AC: 4)
  - [ ] Optional reason textarea
  - [ ] Checkbox: "Notify user"
  - [ ] Cancel and Deny buttons

- [ ] Task 8: Create moderation page (AC: 1)
  - [ ] Create client/src/pages/admin/moderation.tsx
  - [ ] Use admin layout
  - [ ] Include tabs for reviews and buildings

- [ ] Task 9: Create denial notification email (AC: 4)
  - [ ] Email template for review denied
  - [ ] Include reason if provided
  - [ ] Send via Postmark

## Dev Notes

### Architecture Patterns
- Queue-based moderation workflow
- Tab-based navigation
- Expandable list items
- Optional notification emails

### Components to Create/Modify
- `server/routes.ts` - Add admin review routes
- `server/services/email.ts` - Add denial email template
- `client/src/pages/admin/moderation.tsx` - New
- `client/src/components/admin/moderation-tabs.tsx` - New
- `client/src/components/admin/review-moderation-list.tsx` - New
- `client/src/components/admin/review-detail.tsx` - New

### Design Guidelines
- List items with preview text
- Clear approve (green) / deny (red) actions
- Modal for deny with optional reason

### Project Structure Notes

- Moderation components in `client/src/components/admin/`
- Tabs component from shadcn/ui
- Review detail can be expandable or side panel

### References

- [Source: _bmad-output/planning-artifacts/prd.md#FR45]
- [Source: design_guidelines.md#Admin Tables]

## Dev Agent Record

### Agent Model Used



### Debug Log References

### Completion Notes List

### File List
