# Story 5.3: User Management

Status: ready-for-dev

## Story

As an **administrator**,
I want **to view and manage user accounts**,
so that **I can handle user issues and enforce platform rules**.

## Acceptance Criteria

1. **Given** I am on the User Management page (/admin/users) **When** the page loads **Then** I see a paginated table of users with: email, signup date, review count, status

2. **Given** I enter a search term **When** I search by email **Then** the table filters to matching users

3. **Given** I click on a user row **When** the user details panel opens **Then** I can: view full details, send password reset email, suspend/activate account, delete account

4. **Given** I suspend a user **When** I confirm the action **Then** the user's status changes to "suspended" and they cannot log in

## Tasks / Subtasks

- [ ] Task 1: Create users list API endpoint (AC: 1, 2)
  - [ ] Create GET /api/admin/users route
  - [ ] Require admin role
  - [ ] Accept query params: search, page, limit
  - [ ] Search by email (ILIKE)
  - [ ] Return: email, created_at, review_count, status
  - [ ] Include pagination

- [ ] Task 2: Create user update endpoints (AC: 3, 4)
  - [ ] Create PATCH /api/admin/users/:id route
  - [ ] Accept: status (active/suspended)
  - [ ] Update user status
  - [ ] Return updated user

- [ ] Task 3: Create user delete endpoint (AC: 3)
  - [ ] Create DELETE /api/admin/users/:id route
  - [ ] Delete user and associated data
  - [ ] Return success

- [ ] Task 4: Create send password reset endpoint (AC: 3)
  - [ ] Create POST /api/admin/users/:id/reset-password route
  - [ ] Generate reset token
  - [ ] Send reset email via Postmark
  - [ ] Return success

- [ ] Task 5: Create users table component (AC: 1, 2)
  - [ ] Create client/src/components/admin/users-table.tsx
  - [ ] Columns: email, signup date, reviews, status
  - [ ] Sortable columns (optional)
  - [ ] Click row to open details
  - [ ] Use Table component from shadcn/ui

- [ ] Task 6: Create user search component (AC: 2)
  - [ ] Search input above table
  - [ ] Debounced search
  - [ ] Clear search button

- [ ] Task 7: Create user details panel (AC: 3, 4)
  - [ ] Create client/src/components/admin/user-details-panel.tsx
  - [ ] Slide-out panel or modal
  - [ ] Show all user details
  - [ ] Action buttons: Reset Password, Suspend/Activate, Delete

- [ ] Task 8: Create action confirmation modals (AC: 3, 4)
  - [ ] Suspend confirmation
  - [ ] Delete confirmation (destructive)
  - [ ] Clear warning messages

- [ ] Task 9: Create user management page (AC: 1)
  - [ ] Create client/src/pages/admin/users.tsx
  - [ ] Use admin layout
  - [ ] Integrate table and panel components

- [ ] Task 10: Update login to check status (AC: 4)
  - [ ] Check user status on login
  - [ ] Reject login if suspended
  - [ ] Return appropriate error message

## Dev Notes

### Architecture Patterns
- Paginated API with search
- Table with row selection
- Details panel pattern
- Confirmation dialogs for actions

### Components to Create/Modify
- `server/routes.ts` - Add admin user routes
- `client/src/pages/admin/users.tsx` - New
- `client/src/components/admin/users-table.tsx` - New
- `client/src/components/admin/user-details-panel.tsx` - New
- `server/auth/passport.ts` - Check user status on login

### Design Guidelines
- Clean table layout with alternating rows
- Header row: DM Sans semibold, border-b
- Cells: p-4 padding, 0.875rem font
- Action buttons: Small pills, outlined style

### Project Structure Notes

- Admin components in `client/src/components/admin/`
- Use Sheet or Dialog for details panel
- Table component from shadcn/ui

### References

- [Source: _bmad-output/planning-artifacts/prd.md#FR41, FR42, FR43]
- [Source: design_guidelines.md#Admin Tables]

## Dev Agent Record

### Agent Model Used



### Debug Log References

### Completion Notes List

### File List
