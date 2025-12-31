# Story 1.6: Account Deletion & Notification Preferences

Status: ready-for-dev

## Story

As an **authenticated user**,
I want **to delete my account and manage email notifications**,
so that **I have control over my data and communications**.

## Acceptance Criteria

1. **Given** I am on the Account Settings page **When** I click "Delete Account" **Then** a confirmation modal appears warning that this action is irreversible

2. **Given** I confirm account deletion **When** I click "Yes, delete my account" **Then** my account and associated data are deleted, I am logged out, and redirected to homepage

3. **Given** I am on Account Settings **When** I toggle notification preferences **Then** I can opt in/out of email notifications (review approved, review denied)

## Tasks / Subtasks

- [ ] Task 1: Add notification preferences to users table (AC: 3)
  - [ ] Add email_notifications column (boolean, default: true)
  - [ ] Or add notification_preferences column (JSON for granular control)
  - [ ] Run migration

- [ ] Task 2: Create delete account endpoint (AC: 1, 2)
  - [ ] Create DELETE /api/user/account route
  - [ ] Require authentication
  - [ ] Delete user's reviews (or anonymize)
  - [ ] Delete user's password reset tokens
  - [ ] Delete user's email verification tokens
  - [ ] Delete user account
  - [ ] Destroy session
  - [ ] Return success

- [ ] Task 3: Create update preferences endpoint (AC: 3)
  - [ ] Create PATCH /api/user/preferences route
  - [ ] Require authentication
  - [ ] Update notification preferences
  - [ ] Return updated preferences

- [ ] Task 4: Create delete account modal (AC: 1, 2)
  - [ ] Create client/src/components/settings/delete-account-modal.tsx
  - [ ] Warning message about irreversible action
  - [ ] "Cancel" and "Yes, delete my account" buttons
  - [ ] Red/destructive styling for delete button
  - [ ] Loading state during deletion
  - [ ] Redirect to homepage on success

- [ ] Task 5: Create notification preferences section (AC: 3)
  - [ ] Create client/src/components/settings/notification-preferences.tsx
  - [ ] Switch/toggle for email notifications
  - [ ] Optional: granular controls (review approved, review denied)
  - [ ] Auto-save on toggle change
  - [ ] Toast notification on save

- [ ] Task 6: Add sections to settings page (AC: 1, 2, 3)
  - [ ] Add Notifications section
  - [ ] Add Danger Zone section for account deletion
  - [ ] Style danger zone with red border/background

## Dev Notes

### Architecture Patterns
- Soft delete vs hard delete consideration (hard delete for MVP)
- Cascade or anonymize reviews on account deletion
- Toggle auto-save pattern for preferences
- Destructive action confirmation pattern

### Components to Create/Modify
- `shared/schema.ts` - Add notification preferences
- `server/routes.ts` - Add delete account, update preferences
- `client/src/components/settings/delete-account-modal.tsx` - New
- `client/src/components/settings/notification-preferences.tsx` - New
- `client/src/pages/settings.tsx` - Add sections

### Project Structure Notes

- Use Switch component from shadcn/ui for toggles
- Use Dialog component for confirmation modal
- Danger zone styling with red accents
- Follow AlertDialog pattern for destructive action

### References

- [Source: _bmad-output/planning-artifacts/prd.md#FR39, FR40]
- [Source: design_guidelines.md#Modals]

## Dev Agent Record

### Agent Model Used



### Debug Log References

### Completion Notes List

### File List
