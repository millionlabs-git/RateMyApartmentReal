# Story 1.4: User Settings - Profile Management

Status: ready-for-dev

## Story

As an **authenticated user**,
I want **to change my email and password**,
so that **I can keep my account secure and up to date**.

## Acceptance Criteria

1. **Given** I am on the Account Settings page **When** I enter a new email address **Then** a verification email is sent to the new address **And** my email is updated only after clicking the verification link

2. **Given** I want to change my password **When** I enter my current password and a new password (with confirmation) **Then** my password is updated and I see a success message

3. **Given** I enter an incorrect current password **When** I submit the password change form **Then** I see "Current password is incorrect"

## Tasks / Subtasks

- [ ] Task 1: Create email verification tokens table (AC: 1)
  - [ ] Add email_verification_tokens table to schema
  - [ ] Fields: id, user_id, new_email, token, expires_at, created_at
  - [ ] Run migration

- [ ] Task 2: Create change email endpoint (AC: 1)
  - [ ] Create POST /api/user/change-email route
  - [ ] Require authentication
  - [ ] Validate new email format and uniqueness
  - [ ] Generate verification token
  - [ ] Store token with new_email
  - [ ] Send verification email via Postmark
  - [ ] Return success message

- [ ] Task 3: Create verify email endpoint (AC: 1)
  - [ ] Create GET /api/user/verify-email/:token route
  - [ ] Validate token exists and not expired
  - [ ] Update user email to new_email
  - [ ] Delete token
  - [ ] Return success

- [ ] Task 4: Create change password endpoint (AC: 2, 3)
  - [ ] Create POST /api/user/change-password route
  - [ ] Require authentication
  - [ ] Validate current password with bcrypt.compare
  - [ ] Return error if current password incorrect
  - [ ] Validate new password strength
  - [ ] Hash new password
  - [ ] Update user password
  - [ ] Return success

- [ ] Task 5: Create account settings page (AC: 1, 2, 3)
  - [ ] Create client/src/pages/settings.tsx
  - [ ] Add navigation link in user menu
  - [ ] Create settings page layout

- [ ] Task 6: Create email change form (AC: 1)
  - [ ] Create client/src/components/settings/email-change-form.tsx
  - [ ] New email input
  - [ ] Submit button
  - [ ] Success message with verification instructions
  - [ ] Error handling

- [ ] Task 7: Create password change form (AC: 2, 3)
  - [ ] Create client/src/components/settings/password-change-form.tsx
  - [ ] Current password input
  - [ ] New password input with strength indicator
  - [ ] Confirm new password input
  - [ ] Submit button with loading state
  - [ ] Success/error toast notifications

- [ ] Task 8: Create email verification page
  - [ ] Create client/src/pages/verify-email.tsx
  - [ ] Extract token from URL
  - [ ] Call verify endpoint
  - [ ] Show success or error message
  - [ ] Add route to App.tsx

## Dev Notes

### Architecture Patterns
- Protected routes require authentication middleware
- Email verification prevents email hijacking
- Current password required for password change (security)
- Token-based email verification

### Components to Create/Modify
- `shared/schema.ts` - Add email_verification_tokens table
- `server/routes.ts` - Add user settings routes
- `client/src/pages/settings.tsx` - New settings page
- `client/src/components/settings/email-change-form.tsx` - New
- `client/src/components/settings/password-change-form.tsx` - New
- `client/src/pages/verify-email.tsx` - New
- `client/src/components/layout/header.tsx` - Add settings link

### Project Structure Notes

- Settings components in `client/src/components/settings/`
- Reuse password-strength component from Story 1.1
- Follow existing form patterns with TanStack Query

### References

- [Source: _bmad-output/planning-artifacts/prd.md#FR36, FR37]
- [Source: _bmad-output/planning-artifacts/architecture.md#Authentication & Security]

## Dev Agent Record

### Agent Model Used



### Debug Log References

### Completion Notes List

### File List
